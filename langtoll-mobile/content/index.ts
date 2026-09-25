// The content registry: every bundled language pack, indexed by language + level.
// Adding a language = author its packs + register them here; nothing else in the
// app hardcodes German anymore.
import type { Language, Level, LanguagePack } from '@/content/german/types';
import { GERMAN_A1, GERMAN_A2, GERMAN_B1, GERMAN_B2 } from '@/content/german';
import { PORTUGUESE_A1, PORTUGUESE_A2, PORTUGUESE_B1, PORTUGUESE_B2 } from '@/content/portuguese';
import { SPANISH_A1, SPANISH_A2, SPANISH_B1, SPANISH_B2 } from '@/content/spanish';
import { ITALIAN_A1, ITALIAN_A2, ITALIAN_B1, ITALIAN_B2 } from '@/content/italian';
import { FRENCH_A1, FRENCH_A2, FRENCH_B1, FRENCH_B2 } from '@/content/french';
import { ENGLISH_A1, ENGLISH_A2, ENGLISH_B1, ENGLISH_B2 } from '@/content/english';
import { FALLBACK_LOCALE } from '@/lib/locales';

export * from '@/content/german/types';

// Partial<Record<Level, …>> because a language need not offer every level yet
// (a language need not offer every level yet — packFor falls back to the highest
// authored level, which is why a half-authored language shows lower-level words).
const REGISTRY: Record<Language, Partial<Record<Level, LanguagePack>>> = {
  de: { A1: GERMAN_A1, A2: GERMAN_A2, B1: GERMAN_B1, B2: GERMAN_B2 },
  pt: { A1: PORTUGUESE_A1, A2: PORTUGUESE_A2, B1: PORTUGUESE_B1, B2: PORTUGUESE_B2 },
  en: { A1: ENGLISH_A1, A2: ENGLISH_A2, B1: ENGLISH_B1, B2: ENGLISH_B2 },
  es: { A1: SPANISH_A1, A2: SPANISH_A2, B1: SPANISH_B1, B2: SPANISH_B2 },
  fr: { A1: FRENCH_A1, A2: FRENCH_A2, B1: FRENCH_B1, B2: FRENCH_B2 },
  it: { A1: ITALIAN_A1, A2: ITALIAN_A2, B1: ITALIAN_B1, B2: ITALIAN_B2 },
};

/** Languages that actually have at least one pack — what the picker offers. */
export function availableLanguages(): Language[] {
  return (Object.keys(REGISTRY) as Language[]).filter((l) => Object.keys(REGISTRY[l]).length > 0);
}

/**
 * Languages we offer to someone whose interface is `uiLocale`: every shipped
 * course, with the phone's own language LAST. A phone set to German is often
 * a newcomer immersing in Germany, and the German course is exactly theirs
 * (founder, 2026-09-25: "if I set my phone to German, I don't even see a
 * German course"). Meanings then fall back to English — a pack never glosses
 * its own language (lib/pack.ts) — so the one course that cannot work is
 * English on an English interface, and that one stays out. Own language last
 * also keeps it from being the preselected default: the picker takes the
 * first entry. Locale codes and Language codes share the same alphabet
 * ('de', 'pt', …), so plain equality is the whole comparison.
 */
export function learnableLanguages(uiLocale: string): Language[] {
  const all = availableLanguages();
  // Spanish first on every phone that is not Spanish: the first entry is the
  // preselected one (founder, 2026-09-25).
  const first = all.filter((l) => l === DEFAULT_COURSE && l !== uiLocale);
  const rest = all.filter((l) => l !== uiLocale && l !== DEFAULT_COURSE);
  const own = all.filter((l) => l === uiLocale && l !== FALLBACK_LOCALE);
  return [...first, ...rest, ...own];
}

/** The course preselected in the picker, wherever the phone is not already that language. */
const DEFAULT_COURSE: Language = 'es';

/**
 * Languages shown as "SOON" — everything we intend to teach that has no pack
 * yet. Derived rather than hardcoded so a language moves from SOON to the real
 * list the moment its pack lands in REGISTRY, with no second place to remember
 * to edit. The same own-language rule as learnableLanguages.
 */
export function soonLanguages(uiLocale: string): Language[] {
  const shipped = new Set(availableLanguages());
  return (Object.keys(REGISTRY) as Language[]).filter(
    (l) => !shipped.has(l) && !(l === uiLocale && l === FALLBACK_LOCALE),
  );
}

/** Levels a language ships, in order. */
export function levelsFor(language: Language): Level[] {
  return (['A1', 'A2', 'B1', 'B2'] as Level[]).filter((lvl) => REGISTRY[language][lvl]);
}

/**
 * Resolve the pack for (language, level), degrading gracefully: if the exact
 * level isn't authored yet, fall back to the highest available for that
 * language, then to German A1 as a last resort.
 */
export function packFor(language: Language, level: Level): LanguagePack {
  const byLevel = REGISTRY[language];
  if (byLevel[level]) return byLevel[level]!;
  const available = levelsFor(language);
  if (available.length) return byLevel[available[available.length - 1]]!;
  return GERMAN_A1;
}
