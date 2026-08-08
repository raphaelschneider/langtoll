// JIT pronunciation audio for AI-generated packs.
//
// The AUTHORED corpus is pre-rendered offline (langtoll-mobile/scripts/
// gen-audio.js) into /public/audio-packs/<lang>/<sha1(lang|text)>.mp3. AI topic
// packs can't be pre-rendered — they don't exist until a user asks — so their
// texts are REGISTERED here at generation time and synthesized on first
// request by /api/audio, cached forever in media-cache/audio.
//
// Registration is the abuse boundary: /api/audio serves by (lang, hash) and
// only synthesizes hashes that pack generation wrote to `jit_audio`. Arbitrary
// text can never reach the TTS spend — an unregistered hash is a plain 404.
//
// Addressing is sha1(`${lang}|${text}`), byte-identical to the app
// (langtoll-mobile/lib/audio-pack.ts) and the corpus generator. All three must
// stay in lockstep or every lookup 404s.
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getOpenAI } from './openai';
import { query } from '@/lib/db';
import { logUsage } from '@/lib/usage';

// Accent per language — mirrors the packs' speechLocale decisions
// (langtoll-mobile/content/*/index.ts) and REGION_GUIDANCE in generate.ts:
// pt is BRAZILIAN, es Peninsular, en British.
const LOCALE_SPEAKERS: Record<string, string> = {
  de: 'German (Germany)',
  es: 'Spanish (Spain, Castilian)',
  fr: 'French (France)',
  it: 'Italian (Italy)',
  pt: 'Brazilian Portuguese',
  en: 'British English',
};

const TTS_MODEL = process.env.LANGTOLL_TTS_MODEL || 'gpt-4o-mini-tts';
const TTS_VOICE = process.env.LANGTOLL_TTS_VOICE || 'nova';
// Speaker-gendered forms (obrigado/obrigada) keep the same voice as everything
// else — a teacher doesn't change gender to teach a form; the item annotations
// "(said by men/women)" carry the teaching. See gen-audio.js for the same rule.

export function audioHash(lang: string, text: string): string {
  return crypto.createHash('sha1').update(`${lang}|${text}`).digest('hex');
}

function cachePath(lang: string, hash: string): string {
  return path.join(process.cwd(), 'media-cache', 'audio', lang, `${hash}.mp3`);
}

/** Register a generated pack's texts as synthesizable. Idempotent, best-effort. */
export async function registerPackAudio(
  lang: string,
  pack: { vocab: { de: string }[]; sentences: { de: string }[] }
): Promise<void> {
  if (!LOCALE_SPEAKERS[lang]) return;
  const sentenceWords = pack.sentences.flatMap((s) =>
    typeof s.de === 'string'
      ? // The order exercise speaks single words as they are tapped — each
        // needs its own render or the tap falls back to robot TTS.
        s.de.replace(/[.,!?;:¿¡«»"„“”]/g, ' ').split(/\s+/)
      : []
  );
  const texts = [
    ...new Set(
      [...pack.vocab.map((v) => v.de), ...pack.sentences.map((s) => s.de), ...sentenceWords].filter(
        (t) => typeof t === 'string' && t.trim().length > 0 && t.length <= 200
      )
    ),
  ];
  try {
    for (const text of texts) {
      await query(`INSERT IGNORE INTO jit_audio (lang, hash, text) VALUES (?, ?, ?)`, [
        lang,
        audioHash(lang, text),
        text,
      ]);
    }
  } catch {
    // registration is best-effort — an unregistered text just falls back to
    // on-device TTS in the app, which is the pre-feature status quo
  }
}

/**
 * The cached audio file for (lang, hash), synthesizing on first request.
 * Returns the file path, or null when the hash is unregistered or synthesis
 * failed — the route turns null into 404 and the app falls back to TTS.
 */
export async function ensureAudioFile(lang: string, hash: string): Promise<string | null> {
  const speaker = LOCALE_SPEAKERS[lang];
  if (!speaker || !/^[0-9a-f]{40}$/.test(hash)) return null;

  const file = cachePath(lang, hash);
  if (fs.existsSync(file)) return file;

  let text: string | null = null;
  try {
    const rows = await query('SELECT text FROM jit_audio WHERE lang = ? AND hash = ?', [lang, hash]);
    const row = Array.isArray(rows) ? (rows[0] as { text?: string } | undefined) : undefined;
    text = row?.text ?? null;
  } catch {
    return null;
  }
  if (!text) return null;

  try {
    const res = await getOpenAI().audio.speech.create({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: text,
      response_format: 'mp3',
      instructions:
        `Speak as a native ${speaker} speaker reading one vocabulary item to a language learner: ` +
        `clear, neutral, natural pace, no theatrics.`,
    });
    const audio = Buffer.from(await res.arrayBuffer());
    // tokensIn approximates spend for the budget dashboard: TTS is billed per
    // input token/character, and the usage row's shape predates audio.
    void logUsage('tts', { model: TTS_MODEL, tokensIn: text.length });
    fs.mkdirSync(path.dirname(file), { recursive: true });
    // Write-then-rename so a concurrent request never reads a half-written file.
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, audio);
    fs.renameSync(tmp, file);
    return file;
  } catch (err) {
    console.warn('[tts] synthesis failed:', err instanceof Error ? err.message : err);
    return null;
  }
}
