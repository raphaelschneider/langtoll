import type { LanguagePack, Level } from './types';
import { A1_VOCAB } from './a1-vocab';
import { A1_SENTENCES } from './a1-sentences';
import { A2_VOCAB } from './a2-vocab';
import { A2_SENTENCES } from './a2-sentences';
import { B1_VOCAB } from './b1-vocab';
import { B2_VOCAB } from './b2-vocab';
import { B1_SENTENCES } from './b1-sentences';
import { B2_SENTENCES } from './b2-sentences';

export * from './types';

// Flavor follows the language, not the level — shared across German packs.
const GERMAN_FLAVOR = {
  heroLocked: 'Erst Deutsch,\ndann TikTok.',
  heroUnlocked: 'Genieß es.',
  sessionDone: 'Entsperrt!',
  correct: 'Richtig!',
  typedPlaceholder: 'auf Deutsch…',
} as const;

export const GERMAN_A1: LanguagePack = {
  id: 'de-a1',
  language: 'de',
  name: 'German · A1',
  level: 'A1',
  version: 1,
  speechLocale: 'de-DE',
  vocab: A1_VOCAB,
  sentences: A1_SENTENCES,
  flavor: GERMAN_FLAVOR,
};

export const GERMAN_A2: LanguagePack = {
  id: 'de-a2',
  language: 'de',
  name: 'German · A2',
  level: 'A2',
  version: 1,
  speechLocale: 'de-DE',
  vocab: A2_VOCAB,
  sentences: A2_SENTENCES,
  flavor: GERMAN_FLAVOR,
};

export const GERMAN_B1: LanguagePack = {
  id: 'de-b1',
  language: 'de',
  name: 'German · B1',
  level: 'B1',
  version: 1,
  speechLocale: 'de-DE',
  vocab: B1_VOCAB,
  sentences: B1_SENTENCES,
  flavor: GERMAN_FLAVOR,
};

export const GERMAN_B2: LanguagePack = {
  id: 'de-b2',
  language: 'de',
  name: 'German · B2',
  level: 'B2',
  version: 1,
  speechLocale: 'de-DE',
  vocab: B2_VOCAB,
  sentences: B2_SENTENCES,
  flavor: GERMAN_FLAVOR,
};

// Partial: a language may not ship every level yet (B2 is landing pack by pack),
// and packForLevel already falls back. A total Record would force every language
// to gain B2 in the same commit as the type.
const PACKS: Partial<Record<Level, LanguagePack>> = {
  A1: GERMAN_A1,
  A2: GERMAN_A2,
  B1: GERMAN_B1,
  B2: GERMAN_B2,
};

export function packForLevel(level: Level): LanguagePack {
  return PACKS[level] ?? GERMAN_A1;
}

/**
 * @deprecated Screens should use lib/pack's activePack(), which resolves the
 * user's level (and merges AI topic packs). Kept for anything level-agnostic.
 */
export function activePack(): LanguagePack {
  return GERMAN_A1;
}
