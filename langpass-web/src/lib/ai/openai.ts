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

// Topic-pack generation runs on the cheap model — it's a bounded JSON generation, not open chat,
// and gpt-4o-mini produces solid A1–B1 vocabulary. Override with LANGPASS_TOPIC_MODEL.
export const TOPIC_MODEL = process.env.LANGPASS_TOPIC_MODEL || 'gpt-4o-mini';
