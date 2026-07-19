// Why is validate() dropping generated sentences?
//
// 63% of warmed packs came back with ZERO sentences while their vocab was intact,
// so the model is producing sentences and the validator is rejecting them. This
// asks the model for one pack and reports, per sentence, exactly which rule fired
// — rather than guessing from the outside.
//
//   npx tsx scripts/diagnose-pack.ts [language] [level] [topic...]
import { getOpenAI, TOPIC_MODEL } from '../src/lib/ai/openai';
import { prompt, LANGS, VOCAB_PER_PACK, SENTENCES_PER_PACK } from '../src/lib/ai/generate';

const HAS_BLANK = /_{2,}|…|\.{3,}|(?:^|\s)-{2,}(?:\s|$)/;
const ARTICLES = new Set([
  'der','die','das','den','dem','des','ein','eine','einen','einem','einer','eines',
  'el','la','los','las','un','una','unos','unas',
  'le','les','une','du',
  'il','lo','gli','i','uno',
  'o','a','os','as','um','uma',
  'the',
]);
const bare = (w: string) => w.replace(/^[¿¡"'(]+|[.,!?;:"')]+$/g, '').toLowerCase();
const isArticle = (w: string) => ARTICLES.has(bare(w));

async function main() {
  const language = process.argv[2] ?? 'de';
  const level = (process.argv[3] ?? 'A1').toUpperCase();
  const topic = process.argv.slice(4).join(' ') || 'at the doctor';

  const completion = await getOpenAI().chat.completions.create({
    model: TOPIC_MODEL,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt(topic, LANGS[language], level, VOCAB_PER_PACK, SENTENCES_PER_PACK) }],
    temperature: 0.4,
    max_tokens: 4000,
  });

  console.log(`finish_reason: ${completion.choices[0]?.finish_reason}`);
  console.log(`tokens: in=${completion.usage?.prompt_tokens} out=${completion.usage?.completion_tokens}\n`);

  const data = JSON.parse(completion.choices[0]?.message?.content ?? '{}');
  console.log(`model returned: ${(data.vocab ?? []).length} vocab, ${(data.sentences ?? []).length} sentences\n`);

  const tally: Record<string, number> = {};
  const note = (r: string) => (tally[r] = (tally[r] ?? 0) + 1);

  for (const [i, raw] of (data.sentences ?? []).entries()) {
    const reasons: string[] = [];
    if (typeof raw?.de !== 'string' || typeof raw?.en !== 'string') reasons.push('de/en not a string');
    const de = String(raw?.de ?? '').trim();
    if (HAS_BLANK.test(de)) reasons.push('contains a blank marker');
    const words = de.split(/\s+/);
    if (words.length < 3) reasons.push('under 3 words');

    let ci = typeof raw?.clozeIndex === 'number' ? Math.floor(raw.clozeIndex) : -1;
    const usable = (n: number) => n >= 0 && n < words.length - 1 && !isArticle(words[n]);
    if (!usable(ci)) {
      const alt = words.findIndex((_w: string, n: number) => usable(n));
      if (alt < 0) reasons.push('no usable cloze slot');
      else ci = alt;
    }

    if (ci >= 0 && ci < words.length) {
      const answer = bare(words[ci]);
      const kept = Array.isArray(raw?.clozeDistractors)
        ? Array.from(new Set(
            raw.clozeDistractors
              .filter((d: unknown): d is string => typeof d === 'string' && d.trim().length > 0)
              .map((d: string) => d.trim())
              .filter((d: string) => bare(d) !== answer && !isArticle(d))
          )).slice(0, 3)
        : [];
      if (kept.length < 3) {
        const given = (raw?.clozeDistractors ?? []) as string[];
        const dropped = given.filter((d) => bare(d) === answer || isArticle(d));
        reasons.push(`only ${kept.length}/3 distractors survive` +
          (dropped.length ? ` (dropped: ${dropped.map((d) => `${d}${isArticle(d) ? ' [article]' : ' [=answer]'}`).join(', ')})` : ` (model gave ${given.length})`));
      }
    }

    if (reasons.length) {
      console.log(`  ✗ [${i}] "${de}"`);
      console.log(`      blank=${words[ci] ?? '?'}  distractors=${JSON.stringify(raw?.clozeDistractors)}`);
      for (const r of reasons) { console.log(`      → ${r}`); note(r.replace(/\(.*\)/, '').trim()); }
    }
  }

  const kept = (data.sentences ?? []).length - Object.values(tally).reduce((a, b) => a + b, 0);
  console.log(`\nsummary: ~${Math.max(kept, 0)} would survive`);
  for (const [r, n] of Object.entries(tally).sort((a, b) => b[1] - a[1])) console.log(`  ${n}x  ${r}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
