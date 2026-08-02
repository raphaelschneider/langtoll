import OpenAI from 'openai';

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
    client = new OpenAI({ apiKey });
  }
  return client;
}

// Topic-pack generation. This started on gpt-4o-mini as "a bounded JSON
// generation, not open chat" — but the output showed where that saving landed:
// B2 packs written at A1 level, and cloze distractors that were nouns for a verb
// answer. Both are judgement, not formatting, and judgement is what the larger
// model buys.
//
// It also now has to translate every item into five locales correctly, where a
// wrong gloss teaches a wrong word to everyone using that interface language.
//
// Generation is one-time and cached forever, so the model cost is paid once per
// pack and amortised across every user who ever drills it. Override with
// LANGTOLL_TOPIC_MODEL.
export const TOPIC_MODEL = process.env.LANGTOLL_TOPIC_MODEL || 'gpt-4o';
