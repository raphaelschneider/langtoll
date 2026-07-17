// AI topic-pack generation — LangPass's only paid AI route.
// Server-side so the OpenAI key never ships in the app. Same gate chain:
//   attestation → rate limit → entitlement (Plus/honeymoon) → global budget.
// Generated packs are cached in `topic_packs` (keyed by language+level+topic) so a
// given topic is generated once and served to everyone; the app caches it locally
// and drills it offline.
import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI, TOPIC_MODEL } from '@/lib/ai/openai';
import { requireAttestation } from '@/lib/attest';
import { requireEntitlement } from '@/lib/entitlement';
import { rateLimit, LIMITS } from '@/lib/ratelimit';
import { requireBudget, logUsage } from '@/lib/usage';
import { readJsonLimited } from '@/lib/bodylimit';
import { query } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LANGS: Record<string, string> = { de: 'German', es: 'Spanish', fr: 'French', pt: 'Portuguese', it: 'Italian' };
const LEVELS = ['A1', 'A2', 'B1'];
const POS = ['noun', 'verb', 'adj', 'adv', 'phrase', 'number', 'pronoun', 'prep', 'conj', 'question'];

interface Body {
  topic?: string;
  language?: string;
  level?: string;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'topic';
}

function prompt(topic: string, langName: string, level: string, vocabCount: number, sentenceCount: number): string {
  return `You are a ${langName} language curriculum author. Create learning content for the topic "${topic}" at CEFR level ${level}.

Return ONLY a JSON object with this exact shape (no markdown, no commentary):
{
  "vocab": [{ "de": "die Rechnung", "en": ["the bill","the check"], "pos": "noun", "category": "<topic slug>" }],
  "sentences": [{ "de": "Können wir bitte die Rechnung haben?", "en": "Can we have the bill, please?", "clozeIndex": 4, "clozeDistractors": ["Speisekarte","Küche","Gabel"] }]
}
Rules:
- Exactly ${vocabCount} vocab items and ${sentenceCount} sentences.
- The "de" field holds the ${langName} text (keep the field name "de" regardless of language).
- Nouns MUST include the article in "de" where the language has them.
- "pos" is one of: ${POS.join(', ')}.
- "en" is an array; first entry is the canonical English translation.
- "clozeIndex" is the 0-based index (splitting "de" on spaces) of the most interesting word to blank — never an article.
- "clozeDistractors" are 3 wrong-but-plausible ${langName} words for that blank.
- Difficulty, vocabulary and grammar must match ${level}. Use proper accents/diacritics.`;
}

function validate(topic: string, language: string, level: string, data: any) {
  const id = slug(topic);
  const vocab: any[] = [];
  const sentences: any[] = [];
  for (const [i, raw] of (data?.vocab ?? []).entries()) {
    if (typeof raw?.de !== 'string' || !raw.de.trim()) continue;
    const en = Array.isArray(raw.en) ? raw.en.filter((e: any) => typeof e === 'string' && e.trim()) : [];
    if (!en.length) continue;
    vocab.push({
      id: `topic-${id}-v${i}`,
      de: raw.de.trim(),
      en,
      pos: POS.includes(raw.pos) ? raw.pos : 'phrase',
      level,
      category: `topic-${id}`,
    });
  }
  for (const [i, raw] of (data?.sentences ?? []).entries()) {
    if (typeof raw?.de !== 'string' || typeof raw?.en !== 'string') continue;
    const words = raw.de.trim().split(/\s+/);
    let ci = typeof raw.clozeIndex === 'number' ? Math.floor(raw.clozeIndex) : -1;
    if (ci < 0 || ci >= words.length) ci = Math.floor(words.length / 2);
    const distractors = Array.isArray(raw.clozeDistractors)
      ? raw.clozeDistractors.filter((d: any) => typeof d === 'string' && d.trim()).slice(0, 3)
      : [];
    if (distractors.length < 3) continue;
    sentences.push({ id: `topic-${id}-s${i}`, de: raw.de.trim(), en: raw.en.trim(), level, clozeIndex: ci, clozeDistractors: distractors });
  }
  if (vocab.length < 5) throw new Error(`too little usable vocab (${vocab.length})`);
  return { name: topic.trim(), language, level, vocab, sentences, createdAt: new Date().toISOString() };
}

export async function POST(req: NextRequest) {
  const gate = await requireAttestation(req);
  if (gate) return gate;
  const limited = await rateLimit(req, 'topics', LIMITS.topics);
  if (limited) return limited;
  const unpaid = await requireEntitlement(req);
  if (unpaid) return unpaid;
  const capped = await requireBudget();
  if (capped) return capped;

  const parsed = await readJsonLimited<Body>(req, 4_000);
  if (!parsed.ok) return parsed.res;
  const topic = (parsed.data.topic ?? '').trim().slice(0, 80);
  const language = (parsed.data.language ?? 'de').toLowerCase();
  const level = (parsed.data.level ?? 'A1').toUpperCase();
  const langName = LANGS[language];
  if (!topic || !langName || !LEVELS.includes(level)) {
    return NextResponse.json({ error: 'invalid topic/language/level' }, { status: 400 });
  }

  // Cache: same (language, level, topic) is generated once, served to all.
  const contentKey = `${language}:${level}:${slug(topic)}`;
  try {
    const rows = await query('SELECT pack FROM topic_packs WHERE content_key = ?', [contentKey]);
    const row = Array.isArray(rows) ? rows[0] : null;
    if (row?.pack) {
      const pack = typeof row.pack === 'string' ? JSON.parse(row.pack) : row.pack;
      return NextResponse.json({ pack, cached: true });
    }
  } catch {
    // cache miss / DB hiccup — generate fresh below
  }

  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: TOPIC_MODEL,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt(topic, langName, level, 14, 4) }],
      temperature: 0.4,
      max_tokens: 2000,
    });
    void logUsage('topics', {
      model: TOPIC_MODEL,
      tokensIn: completion.usage?.prompt_tokens,
      tokensOut: completion.usage?.completion_tokens,
    });
    const content = completion.choices[0]?.message?.content;
    if (typeof content !== 'string') throw new Error('no content');
    const pack = validate(topic, language, level, JSON.parse(content));
    await query(
      `INSERT INTO topic_packs (content_key, language, level, topic, pack) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE pack = VALUES(pack)`,
      [contentKey, language, level, topic, JSON.stringify(pack)]
    ).catch(() => {});
    return NextResponse.json({ pack, cached: false });
  } catch (err) {
    console.warn('[topics] generation failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'generation failed' }, { status: 502 });
  }
}
