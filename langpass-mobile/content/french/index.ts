import type { LanguagePack } from '@/content/german/types';
import { A1_VOCAB } from './a1-vocab';
import { A1_SENTENCES } from './a1-sentences';
import { A2_VOCAB } from './a2-vocab';
import { A2_SENTENCES } from './a2-sentences';
import { B1_VOCAB } from './b1-vocab';
import { B1_SENTENCES } from './b1-sentences';

// French. Full A1–B1, each level a distinct pack with no vocabulary shared
// between them — selecting B1 must never serve A1 words.
//
// Flavor lines follow the language being LEARNED, so they stay French for
// every UI locale — that is the point of them.
const FRENCH_FLAVOR = {
  heroLocked: 'D’abord le français,\nensuite TikTok.',
  heroUnlocked: 'Profites-en.',
  sessionDone: 'Débloqué !',
  correct: 'Exact !',
  typedPlaceholder: 'en français…',
} as const;

export const FRENCH_A1: LanguagePack = {
  id: 'fr-a1',
  language: 'fr',
  name: 'French · A1',
  level: 'A1',
  version: 1,
  speechLocale: 'fr-FR',
  vocab: A1_VOCAB,
  sentences: A1_SENTENCES,
  flavor: FRENCH_FLAVOR,
};

export const FRENCH_A2: LanguagePack = {
  id: 'fr-a2',
  language: 'fr',
  name: 'French · A2',
  level: 'A2',
  version: 1,
  speechLocale: 'fr-FR',
  vocab: A2_VOCAB,
  sentences: A2_SENTENCES,
  flavor: FRENCH_FLAVOR,
};

export const FRENCH_B1: LanguagePack = {
  id: 'fr-b1',
  language: 'fr',
  name: 'French · B1',
  level: 'B1',
  version: 1,
  speechLocale: 'fr-FR',
  vocab: B1_VOCAB,
  sentences: B1_SENTENCES,
  flavor: FRENCH_FLAVOR,
};
