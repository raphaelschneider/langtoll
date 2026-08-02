// Second-stage gloss fill.
//
// Asking gpt-4o-mini for a whole pack AND five locale translations in one call
// overloads it: measured output kept the first two locales and silently dropped
// es/fr/it from 73% of sentences. gpt-4o does comply, but at ~12x the price for
// the A1/A2 half that is not worth it.
//
// So the work is split. Generation writes the pack; this fills the gaps with a
// focused translation-only call, which is a task mini does reliably because it is
// the only thing being asked. Two cheap calls beat one that quietly truncates.
//
// Only missing locales are requested — a pack with complete glosses costs
// nothing, and re-running after an interruption re-does only what is still empty.
//
//   npx tsx scripts/fill-glosses.ts --dry
//   npx tsx scripts/fill-glosses.ts --level A1 --concurrency 8
import { getOpenAI } from '../src/lib/ai/openai';
import { UI_LOCALES, LANGS, LEVELS } from '../src/lib/ai/generate';
import { logUsage } from '../src/lib/usage';
import { query } from '../src/lib/db';

const MODEL = process.env.LANGTOLL_GLOSS_MODEL || 'gpt-4o-mini';
const DEFAULT_CONCURRENCY = 8;

interface Pack {
  language: string;
  level: string;
  vocab: { de: string; en: string[]; gloss?: Record<string, string[]> }[];
  sentences: { de: string; en: string; gloss?: Record<string, string> }[];
}

const EMPTY = new Set(['…', '...', '']);
const isEmpty = (v: unknown): boolean => {
  const vals = Array.isArray(v) ? v : [v];
  return vals.every((x) => typeof x !== 'string' || EMPTY.has(x.trim()));
};

/** Locales still needing a translation for this item. */
function gaps(gloss: Record<string, unknown> | undefined, target: string): string[] {
  return UI_LOCALES.filter((l) => l !== target && (!gloss || !(l in gloss) || isEmpty(gloss[l])));
}

async function fillPack(pack: Pack): Promise<{ changed: boolean; pack: Pack }> {
  const target = pack.language;
  const jobs: { kind: 'v' | 's'; i: number; text: string; english: string; need: string[] }[] = [];

  pack.vocab.forEach((v, i) => {
    const need = gaps(v.gloss, target);
    if (need.length) jobs.push({ kind: 'v', i, text: v.de, english: v.en?.[0] ?? '', need });
  });
  pack.sentences.forEach((s, i) => {
    const need = gaps(s.gloss, target);
    if (need.length) jobs.push({ kind: 's', i, text: s.de, english: s.en ?? '', need });
  });
  if (!jobs.length) return { changed: false, pack };

  const langName = LANGS[target] ?? target;
  const items = jobs
    .map((j, n) => `${n}. [${j.need.join(',')}] ${langName}: ${j.text}  (English: ${j.english})`)
    .join('\n');

  const res = await getOpenAI().chat.completions.create({
    model: MODEL,
    response_format: { type: 'json_object' },
    messages: [{
      role: 'user',
      content: `You are a translator fluent in English, German, Spanish, French, Italian and Portuguese.

Translate each numbered item into ONLY the locales listed in its brackets.

Regional standards, non-negotiable: Portuguese is BRAZILIAN (o celular, o ônibus, você; clitics before the verb — "me chamo", never "chamo-me"; never telemóvel/autocarro/casa de banho). Spanish is PENINSULAR (el móvil, el coche, el ordenador). English is BRITISH (lift, flat, colour, realise).

Translate the MEANING, not the words. Never leave a value empty, and never answer with an ellipsis or placeholder.

${items}

Return ONLY a JSON object shaped like {"0": {"es": "la cuenta", "fr": "l'addition"}, "1": {"es": "...", "fr": "..."}} — one entry per item number, each containing exactly the locales that item asked for. The word JSON is required here by the API's response format.`,
    }],
    temperature: 0.2,
    max_tokens: 8000,
  });
  void logUsage('topics', {
    model: MODEL,
    tokensIn: res.usage?.prompt_tokens,
    tokensOut: res.usage?.completion_tokens,
  });

  const content = res.choices[0]?.message?.content;
  if (typeof content !== 'string') return { changed: false, pack };
  const parsed = JSON.parse(content) as Record<string, Record<string, string>>;

  let changed = false;
  jobs.forEach((job, n) => {
    const got = parsed[String(n)];
    if (!got) return;
    for (const loc of job.need) {
      const val = got[loc];
      if (typeof val !== 'string' || EMPTY.has(val.trim())) continue;
      if (job.kind === 'v') {
        const v = pack.vocab[job.i];
        v.gloss = { ...(v.gloss ?? {}), [loc]: [val.trim()] };
      } else {
        const s = pack.sentences[job.i];
        s.gloss = { ...(s.gloss ?? {}), [loc]: val.trim() };
      }
      changed = true;
    }
  });
  return { changed, pack };
}

async function main() {
  const argv = process.argv.slice(2);
  const get = (f: string) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
  const dry = argv.includes('--dry');
  const level = get('--level');
  const lang = get('--lang');
  const concurrency = Number(get('--concurrency')) || DEFAULT_CONCURRENCY;
  // Deliberately available so a change can be proven on a handful of packs before
  // being turned loose on thousands.
  const limit = Number(get('--limit')) || 0;

  const where: string[] = [];
  if (level) where.push(`level = '${level.toUpperCase()}'`);
  if (lang) where.push(`language = '${lang}'`);
  const rows = (await query(
    `SELECT content_key, pack FROM topic_packs${where.length ? ' WHERE ' + where.join(' AND ') : ''}`
  )) as { content_key: string; pack: string }[];

  let needing = rows
    .map((r) => ({ key: r.content_key, pack: (typeof r.pack === 'string' ? JSON.parse(r.pack) : r.pack) as Pack }))
    .filter(({ pack }) =>
      pack.vocab?.some((v) => gaps(v.gloss, pack.language).length) ||
      pack.sentences?.some((s) => gaps(s.gloss, pack.language).length));
  if (limit) needing = needing.slice(0, limit);

  console.log(`${rows.length} packs, ${needing.length} with gloss gaps`);
  if (!needing.length || dry) return console.log(dry ? '--dry: stopping.' : 'nothing to do.');

  let done = 0, failed = 0, cursor = 0;
  async function worker() {
    while (cursor < needing.length) {
      const item = needing[cursor++];
      try {
        const { changed, pack } = await fillPack(item.pack);
        if (changed) {
          await query('UPDATE topic_packs SET pack = ? WHERE content_key = ?', [JSON.stringify(pack), item.key]);
        }
        done++;
      } catch (err) {
        failed++;
        console.warn(`  ✗ ${item.key}: ${err instanceof Error ? err.message : err}`);
      }
      if ((done + failed) % 50 === 0) console.log(`  ${done + failed}/${needing.length}  ok=${done} failed=${failed}`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  console.log(`\nfilled ${done} packs, ${failed} failed`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
