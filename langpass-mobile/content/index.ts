// The content registry: every bundled language pack, indexed by language + level.
// Adding a language = author its packs + register them here; nothing else in the
// app hardcodes German anymore.
import type { Language, Level, LanguagePack } from '@/content/german/types';
import { GERMAN_A1, GERMAN_A2, GERMAN_B1 } from '@/content/german';
import { PORTUGUESE_A1 } from '@/content/portuguese';

export * from '@/content/german/types';

// Partial<Record<Level, …>> because a language need not offer every level yet
// (Portuguese ships A1 only for the test).
const REGISTRY: Record<Language, Partial<Record<Level, LanguagePack>>> = {
  de: { A1: GERMAN_A1, A2: GERMAN_A2, B1: GERMAN_B1 },
  pt: { A1: PORTUGUESE_A1 },
  es: {},
  fr: {},
  it: {},
};

/** Languages that actually have at least one pack — what the picker offers. */
export function availableLanguages(): Language[] {
  return (Object.keys(REGISTRY) as Language[]).filter((l) => Object.keys(REGISTRY[l]).length > 0);
}

/** Levels a language ships, in order. */
export function levelsFor(language: Language): Level[] {
  return (['A1', 'A2', 'B1'] as Level[]).filter((lvl) => REGISTRY[language][lvl]);
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
