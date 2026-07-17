// AI topic packs — the LingoLock-style "generate your own content" feature,
// behind a clean seam. generateTopicPack() asks OUR backend proxy
// (langpass-web /api/topics/generate) for level-appropriate vocab + cloze
// sentences on a user topic and returns a validated CustomTopic ready for
// lib/pack to merge into training.
//
// The OpenAI key lives ONLY on the server now — the app never sees it. The
// proxy also meters usage, caches each (language, level, topic) once for
// everyone, and enforces the paid-feature gates (App Attest + entitlement).
//
// Config:
//   EXPO_PUBLIC_API_URL   base URL of the backend, e.g. https://api.langpass.app
//                         Without it the seam falls back to a bundled demo pack
//                         so the flow is still demonstrable fully offline.
import type { Level, VocabItem, SentenceItem, PartOfSpeech, Language } from '@/content/german/types';
import type { CustomTopic } from '@/lib/store';
import { getDeviceId } from '@/lib/db/queries';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? null;

export function aiAvailable(): boolean {
  return !!API_BASE;
}

const POS_VALUES: PartOfSpeech[] = [
  'noun', 'verb', 'adj', 'adv', 'phrase', 'number', 'pronoun', 'prep', 'conj', 'question',
];

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'topic';
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
 * Generate a topic pack via the backend proxy. With no EXPO_PUBLIC_API_URL
 * configured this resolves to a small bundled demo pack (so the product flow
 * is demonstrable offline). On a real backend error it throws, so the caller
 * can surface a retry state.
 */
export async function generateTopicPack(
  topic: string,
  level: Level,
  language: Language = 'de'
): Promise<CustomTopic> {
  if (!API_BASE) return demoPack(topic, level);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const res = await fetch(`${API_BASE}/api/topics/generate`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        // Rate-limit bucket + future support lookup. The paid gates (App Attest,
        // entitlement) add their own headers once the native client ships; until
        // then they're dormant server-side, so this call succeeds without them.
        'x-device-id': safeDeviceId(),
      },
      body: JSON.stringify({ topic, language, level }),
    });
    if (res.status === 429) throw new Error('Too many requests — give it a minute and try again.');
    if (res.status === 402 || res.status === 403) throw new Error('AI topics are a Plus feature.');
    if (!res.ok) throw new Error(`topics ${res.status}: ${(await res.text()).slice(0, 160)}`);
    const json = await res.json();
    if (!json?.pack) throw new Error('backend returned no pack');
    // Re-validate defensively: the server already validates, but a stale cache
    // row or shape drift shouldn't crash the trainer.
    return validate(topic, level, json.pack);
  } finally {
    clearTimeout(timeout);
  }
}

function safeDeviceId(): string {
  try {
    return getDeviceId();
  } catch {
    return 'unknown';
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
