// Resolves the pack the user actually trains on: their language + CEFR level's
// bundled pack, plus the AI topic pack merged in when one is generated and enabled.
import { packFor, type LanguagePack, type Level } from '@/content';
import { getState } from '@/lib/store';
import { resolvedLocale } from '@/lib/i18n';
import { sanitizeTopic } from '@/lib/ai/topics';
import { FALLBACK_LOCALE, type LocaleCode } from '@/lib/locales';

/** Onboarding difficulty (1–10) → CEFR level. */
export function levelForDifficulty(d: number): Level {
  if (d <= 3) return 'A1';
  if (d <= 6) return 'A2';
  return 'B1';
}

// Packs are authored with English in `en` and every other UI locale under
// `gloss`. Rather than thread a locale through the whole trainer, we resolve it
// once here: the returned pack has the user's locale sitting in `en`, so
// engine.ts keeps its single "side the user reads" slot and needs no changes.
// Items with no gloss for the locale keep English — a half-translated pack
// degrades word by word instead of failing.
const localized = new Map<string, LanguagePack>();

function localizePack(pack: LanguagePack, locale: LocaleCode): LanguagePack {
  if (locale === FALLBACK_LOCALE) return pack;
  const key = `${pack.id}:${locale}`;
  const hit = localized.get(key);
  if (hit) return hit;
  const out: LanguagePack = {
    ...pack,
    vocab: pack.vocab.map((v) => {
      const g = v.gloss?.[locale];
      return g && g.length ? { ...v, en: g } : v;
    }),
    sentences: pack.sentences.map((s) => {
      const g = s.gloss?.[locale];
      return g ? { ...s, en: g } : s;
    }),
  };
  localized.set(key, out);
  return out;
}

export function activePack(): LanguagePack {
  const s = getState();
  const base = localizePack(packFor(s.learningLanguage, s.level), resolvedLocale());
  // Sanitize on every load: packs generated before the blank-detection guards
  // existed are already persisted on devices, and a bad sentence renders an
  // unanswerable exercise ("__" offered as one of the options).
  const topic = s.customTopic ? sanitizeTopic(s.customTopic) : null;
  if (topic && s.useCustomTopic && topic.vocab.length) {
    return {
      ...base,
      name: `${base.name} · ${topic.name}`,
      vocab: [...base.vocab, ...topic.vocab],
      sentences: [...base.sentences, ...topic.sentences],
    };
  }
  return base;
}
