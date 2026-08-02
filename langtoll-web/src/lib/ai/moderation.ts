// Screening for anything a user types that reaches the model — today that is the
// custom topic from Settings.
//
// Two distinct risks, and they need different defences:
//
//   1. PROMPT INJECTION. The topic used to be interpolated straight into the
//      prompt inside quotes, so a string containing a quote could close it and
//      append instructions. Shape screening rejects the characters that make
//      that possible; the caller additionally delimits the topic and tells the
//      model to treat it as a subject name only.
//
//   2. UNACCEPTABLE CONTENT. A topic like a slur or a sexual scenario would
//      otherwise be generated with our API key, cached in our database, and
//      rendered in an app rated 4+. OpenAI's moderation endpoint is free and
//      purpose-built for this, so there is no reason not to call it.
//
// Screen the OUTPUT too, not just the input: an innocuous topic can still
// produce something we would not want in a children-rated app, and generated
// packs are cached and served to everyone who asks for that topic.
import { getOpenAI } from './openai';

export interface ScreenResult {
  ok: boolean;
  /** Safe to show a user — never echoes the offending text back. */
  reason?: string;
}

const MODERATION_MODEL = process.env.LANGTOLL_MODERATION_MODEL || 'omni-moderation-latest';

// Letters (any script), marks, digits, spaces and a small punctuation set. This
// deliberately excludes quotes, braces, angle brackets, backslashes and newlines
// — the characters used to escape a prompt context.
const ALLOWED = /^[\p{L}\p{M}\p{N} .,'’&/()-]+$/u;

// Phrases that only appear when someone is addressing the model rather than
// naming a topic. Cheap to check and catches the unsubtle attempts before we
// spend a moderation call.
const INJECTION_MARKERS = [
  'ignore previous',
  'ignore all previous',
  'disregard',
  'system prompt',
  'you are now',
  'act as',
  'instead output',
  'new instructions',
  'jailbreak',
  'prompt:',
];

/** Cheap synchronous screen: shape, length, and obvious instruction-injection. */
export function screenShape(topic: string): ScreenResult {
  const t = topic.trim();
  if (t.length < 2) return { ok: false, reason: 'Topic is too short.' };
  if (t.length > 80) return { ok: false, reason: 'Topic is too long.' };
  if (/[\r\n\t]/.test(topic)) return { ok: false, reason: 'Topic must be a single line.' };
  if (!ALLOWED.test(t)) return { ok: false, reason: 'Topic contains characters that are not allowed.' };
  const lower = t.toLowerCase();
  if (INJECTION_MARKERS.some((m) => lower.includes(m))) {
    return { ok: false, reason: 'That does not look like a topic.' };
  }
  return { ok: true };
}

/**
 * OpenAI moderation. Fails OPEN on a network/API error: a moderation outage
 * should not take the feature down, and the shape screen plus the structural
 * validation still apply. Flip to fail-closed if abuse ever shows up.
 */
export async function screenModeration(text: string): Promise<ScreenResult> {
  try {
    const res = await getOpenAI().moderations.create({ model: MODERATION_MODEL, input: text });
    const flagged = res.results?.some((r) => r.flagged);
    if (flagged) return { ok: false, reason: 'That topic is not something we can generate content for.' };
    return { ok: true };
  } catch (err) {
    console.warn('[moderation] check failed, allowing:', err instanceof Error ? err.message : err);
    return { ok: true };
  }
}

/** Full screen for user-supplied input: shape first (free), then moderation. */
export async function screenUserTopic(topic: string): Promise<ScreenResult> {
  const shape = screenShape(topic);
  if (!shape.ok) return shape;
  return screenModeration(topic);
}

/**
 * Screen generated content before it is cached and served. Takes the pack's
 * visible strings rather than the JSON, so field names don't pollute the check.
 */
export async function screenGeneratedPack(pack: {
  vocab: { de: string; en: string[] }[];
  sentences: { de: string; en: string }[];
}): Promise<ScreenResult> {
  const text = [
    ...pack.vocab.flatMap((v) => [v.de, ...v.en]),
    ...pack.sentences.flatMap((s) => [s.de, s.en]),
  ].join('\n');
  if (!text.trim()) return { ok: true };
  return screenModeration(text);
}
