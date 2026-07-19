// Pre-generate the whole content pool into MySQL, so real users only ever hit
// cache.
//
//   npx tsx scripts/warm-pool.ts            # everything still missing
//   npx tsx scripts/warm-pool.ts --dry      # count and cost, generate nothing
//   npx tsx scripts/warm-pool.ts --lang de --level A1
//
// MUST RUN ON THE DROPLET: it writes to `topic_packs`, and MySQL is not exposed
// off-box.
//
// Idempotent and resumable — generateTopicPack() checks the cache first, so a
// re-run after a crash or a Ctrl-C only fills what is genuinely missing. That
// matters: this is thousands of paid API calls and it must never redo work.
//
// The pool route also warms one topic per request, but that would take thousands
// of user requests to fill and the earliest users would see a nearly empty pool.
// This is the deliberate version.
import { TOPIC_CATALOGUE } from '../src/lib/ai/catalogue';
import { generateTopicPack, contentKeyFor, LANGS, LEVELS } from '../src/lib/ai/generate';
import { query } from '../src/lib/db';

// Each call is ~4k output tokens. 4 workers measured ≈13 packs/min, so 8 should
// land near ≈26 and take the full catalogue from ~6 hours to roughly 3.
// Override with --concurrency N.
const DEFAULT_CONCURRENCY = 8;

// Rate limits are the expected failure at this concurrency, and they are
// transient — retrying with backoff is the difference between a clean run and
// several hundred packs to re-run. Non-rate-limit errors fail fast: retrying a
// malformed generation just wastes money.
const MAX_RETRIES = 3;

function isRateLimit(err: unknown): boolean {
  const e = err as { status?: number; code?: string; message?: string };
  return e?.status === 429 || e?.code === 'rate_limit_exceeded' || /rate limit/i.test(e?.message ?? '');
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// gpt-4o-mini list price at time of writing. Used ONLY for the pre-flight
// estimate — never for billing decisions, and it will drift.
const USD_PER_PACK = 0.0022;

interface Job {
  topic: string;
  language: string;
  level: string;
}

function parseArgs() {
  const a = process.argv.slice(2);
  const get = (flag: string) => {
    const i = a.indexOf(flag);
    return i >= 0 ? a[i + 1] : undefined;
  };
  return {
    dry: a.includes('--dry'),
    lang: get('--lang'),
    level: get('--level'),
    concurrency: Number(get('--concurrency')) || DEFAULT_CONCURRENCY,
  };
}

async function main() {
  const { dry, lang, level, concurrency } = parseArgs();

  const languages = lang ? [lang] : Object.keys(LANGS);
  const levels = level ? [level.toUpperCase()] : LEVELS;
  for (const l of languages) if (!LANGS[l]) throw new Error(`unknown language: ${l}`);
  for (const l of levels) if (!LEVELS.includes(l)) throw new Error(`unknown level: ${l}`);

  const all: Job[] = [];
  for (const language of languages)
    for (const lvl of levels)
      for (const topic of TOPIC_CATALOGUE) all.push({ topic, language, level: lvl });

  console.log(`catalogue ${TOPIC_CATALOGUE.length} topics x ${languages.length} languages x ${levels.length} levels = ${all.length} packs`);

  // ONE query for the keys, not one per job. Asking cachedPack() per topic meant
  // 5,040 sequential round trips, which took longer than the generation would
  // have — and pulled every cached pack's full JSON across the wire to answer a
  // question about key existence.
  process.stdout.write('checking what is already cached… ');
  const rows = await query(
    `SELECT content_key FROM topic_packs WHERE language IN (${languages.map(() => '?').join(',')})
       AND level IN (${levels.map(() => '?').join(',')})`,
    [...languages, ...levels]
  );
  const have = new Set(
    (Array.isArray(rows) ? (rows as { content_key: string }[]) : []).map((r) => r.content_key)
  );
  const missing = all.filter((j) => !have.has(contentKeyFor(j.language, j.level, j.topic)));
  console.log(`${all.length - missing.length} cached, ${missing.length} missing`);

  if (!missing.length) return console.log('pool is complete — nothing to do.');
  console.log(`estimated cost: ~$${(missing.length * USD_PER_PACK).toFixed(2)} (rough, list price)`);

  if (dry) return console.log('--dry: stopping before any generation.');

  console.log(`concurrency: ${concurrency}`);

  let done = 0;
  let failed = 0;
  let rateLimited = 0;
  const started = Date.now();

  // Fixed-size worker pool over a shared cursor: bounded concurrency without
  // building thousands of promises up front.
  let cursor = 0;
  async function worker(id: number) {
    while (cursor < missing.length) {
      const job = missing[cursor++];
      let attempt = 0;
      for (;;) {
        try {
          await generateTopicPack(job.topic, job.language, job.level);
          done++;
          break;
        } catch (err) {
          // Only rate limits are worth retrying: they are transient and expected
          // at this concurrency. A malformed generation would fail identically on
          // a retry and cost again.
          if (isRateLimit(err) && attempt < MAX_RETRIES) {
            const wait = 2000 * 2 ** attempt++;
            rateLimited++;
            await sleep(wait);
            continue;
          }
          failed++;
          console.warn(`  ✗ ${job.language}/${job.level}/${job.topic}: ${err instanceof Error ? err.message : err}`);
          break;
        }
      }
      const n = done + failed;
      if (n % 25 === 0 || n === missing.length) {
        const rate = n / ((Date.now() - started) / 1000);
        const eta = Math.round((missing.length - n) / Math.max(rate, 0.01));
        console.log(`  ${n}/${missing.length}  ok=${done} failed=${failed}  ~${eta}s left  [w${id}]`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, (_, i) => worker(i + 1)));

  console.log(`\ndone: ${done} generated, ${failed} failed, ${rateLimited} rate-limit retries, ${Math.round((Date.now() - started) / 1000)}s`);
  if (failed) console.log('re-run to retry the failures — cached packs are skipped.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
