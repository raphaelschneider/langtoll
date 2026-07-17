// AI topic packs — the LingoLock-style "generate your own content" feature,
// behind a clean seam. generateTopicPack() asks an OpenAI-compatible endpoint
// for level-appropriate German vocab + cloze sentences on a user topic and
// returns a validated CustomTopic ready for lib/pack to merge into training.
//
// Config (all optional — without a key the seam falls back to a bundled demo
// pack so the whole flow is testable in the simulator):
//   EXPO_PUBLIC_OPENAI_API_KEY   the API key
//   EXPO_PUBLIC_OPENAI_BASE_URL  default https://api.openai.com/v1
//   EXPO_PUBLIC_OPENAI_MODEL     default gpt-4o-mini
//
// Note for later: shipping a raw API key inside a mobile bundle is fine for
// dev, wrong for production — the real build should call a tiny proxy we own
// (also lets us meter usage per subscription).
import type { Level, VocabItem, SentenceItem, PartOfSpeech } from '@/content/german/types';
import type { CustomTopic } from '@/lib/store';

const API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? null;
const BASE_URL = process.env.EXPO_PUBLIC_OPENAI_BASE_URL ?? 'https://api.openai.com/v1';
const MODEL = process.env.EXPO_PUBLIC_OPENAI_MODEL ?? 'gpt-4o-mini';

export function aiAvailable(): boolean {
  return !!API_KEY;
}

const POS_VALUES: PartOfSpeech[] = [
  'noun', 'verb', 'adj', 'adv', 'phrase', 'number', 'pronoun', 'prep', 'conj', 'question',
];

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'topic';
}

function prompt(topic: string, level: Level, vocabCount: number, sentenceCount: number): string {
  return `You are a German language curriculum author. Create learning content for the topic "${topic}" at CEFR level ${level}.

Return ONLY a JSON object with this exact shape (no markdown, no commentary):
{
  "vocab": [
    { "de": "die Rechnung", "en": ["the bill", "the check"], "pos": "noun", "category": "<topic slug>" }
  ],
  "sentences": [
    { "de": "Können wir bitte die Rechnung haben?", "en": "Can we have the bill, please?", "clozeIndex": 4, "clozeDistractors": ["Speisekarte", "Küche", "Gabel"] }
  ]
}

Rules:
- Exactly ${vocabCount} vocab items and ${sentenceCount} sentences.
- Nouns MUST include the article (der/die/das) in "de".
- "pos" is one of: ${POS_VALUES.join(', ')}.
- "en" is an array; the first entry is the canonical translation.
- "clozeIndex" is the 0-based index (splitting "de" on spaces) of the most interesting word to blank — never an article.
- "clozeDistractors" are 3 wrong-but-plausible German words for that blank.
- Difficulty, word choice and grammar must match ${level}. Umlauts and ß written properly.`;
}

interface RawVocab {
  de?: unknown;
  en?: unknown;
  pos?: unknown;
  category?: unknown;
}
interface RawSentence {
  de?: unknown;
  en?: unknown;
  clozeIndex?: unknown;
  clozeDistractors?: unknown;
}

function validate(topic: string, level: Level, data: any): CustomTopic {
  const id = slug(topic);
  const vocab: VocabItem[] = [];
  const sentences: SentenceItem[] = [];

  for (const [i, raw] of ((data?.vocab ?? []) as RawVocab[]).entries()) {
    if (typeof raw?.de !== 'string' || !raw.de.trim()) continue;
    const en = Array.isArray(raw.en) ? raw.en.filter((e) => typeof e === 'string' && e.trim()) : [];
    if (!en.length) continue;
    const pos = POS_VALUES.includes(raw.pos as PartOfSpeech) ? (raw.pos as PartOfSpeech) : 'phrase';
    vocab.push({
      id: `topic-${id}-v${i}`,
      de: raw.de.trim(),
      en: en as string[],
      pos,
      level,
      category: `topic-${id}`,
    });
  }

  for (const [i, raw] of ((data?.sentences ?? []) as RawSentence[]).entries()) {
    if (typeof raw?.de !== 'string' || typeof raw?.en !== 'string') continue;
    const words = raw.de.trim().split(/\s+/);
    let clozeIndex = typeof raw.clozeIndex === 'number' ? Math.floor(raw.clozeIndex) : -1;
    if (clozeIndex < 0 || clozeIndex >= words.length) clozeIndex = Math.floor(words.length / 2);
    const distractors = Array.isArray(raw.clozeDistractors)
      ? raw.clozeDistractors.filter((d) => typeof d === 'string' && d.trim()).slice(0, 3)
      : [];
    if (distractors.length < 3) continue;
    sentences.push({
      id: `topic-${id}-s${i}`,
      de: raw.de.trim(),
      en: raw.en.trim(),
      level,
      clozeIndex,
      clozeDistractors: distractors as string[],
    });
  }

  if (vocab.length < 5) throw new Error(`AI returned too little usable vocab (${vocab.length})`);
  return { name: topic.trim(), vocab, sentences, createdAt: new Date().toISOString() };
}

/**
 * Generate a topic pack. With no API key configured this resolves to a small
 * bundled demo pack (so the product flow is demonstrable offline).
 */
export async function generateTopicPack(
  topic: string,
  level: Level,
  opts: { vocabCount?: number; sentenceCount?: number } = {}
): Promise<CustomTopic> {
  const vocabCount = opts.vocabCount ?? 14;
  const sentenceCount = opts.sentenceCount ?? 4;

  if (!API_KEY) return demoPack(topic, level);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt(topic, level, vocabCount, sentenceCount) }],
        temperature: 0.4,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') throw new Error('OpenAI returned no content');
    return validate(topic, level, JSON.parse(content));
  } finally {
    clearTimeout(timeout);
  }
}

// ── offline demo pack (no API key) ─────────────────────────────────────────

function demoPack(topic: string, level: Level): Promise<CustomTopic> {
  const id = slug(topic);
  const vocab: VocabItem[] = [
    { de: 'die Speisekarte', en: ['the menu'] },
    { de: 'die Rechnung', en: ['the bill', 'the check'] },
    { de: 'das Trinkgeld', en: ['the tip'] },
    { de: 'bestellen', en: ['to order'] },
    { de: 'empfehlen', en: ['to recommend'] },
    { de: 'das Leitungswasser', en: ['the tap water'] },
    { de: 'die Vorspeise', en: ['the starter', 'the appetizer'] },
    { de: 'der Nachtisch', en: ['the dessert'] },
    { de: 'zum Mitnehmen', en: ['to go', 'takeaway'] },
    { de: 'lecker', en: ['tasty', 'delicious'] },
  ].map((v, i) => ({
    id: `topic-${id}-v${i}`,
    de: v.de,
    en: v.en,
    pos: v.de.startsWith('d') && v.de.includes(' ') ? ('noun' as const) : ('phrase' as const),
    level,
    category: `topic-${id}`,
  }));
  const sentences: SentenceItem[] = [
    {
      id: `topic-${id}-s0`,
      de: 'Ich hätte gern die Rechnung, bitte.',
      en: 'I would like the bill, please.',
      level,
      clozeIndex: 4,
      clozeDistractors: ['Speisekarte', 'Vorspeise', 'Küche'],
    },
    {
      id: `topic-${id}-s1`,
      de: 'Was können Sie uns heute empfehlen?',
      en: 'What can you recommend to us today?',
      level,
      clozeIndex: 5,
      clozeDistractors: ['bestellen', 'bezahlen', 'bringen'],
    },
  ];
  return new Promise((resolve) =>
    // small delay so the "generating…" state is visible in the demo flow
    setTimeout(
      () => resolve({ name: topic.trim(), vocab, sentences, createdAt: new Date().toISOString() }),
      1200
    )
  );
}
