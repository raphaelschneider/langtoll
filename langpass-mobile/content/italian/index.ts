import type { LanguagePack } from '@/content/german/types';
import { A1_VOCAB } from './a1-vocab';
import { A1_SENTENCES } from './a1-sentences';
import { A2_VOCAB } from './a2-vocab';
import { A2_SENTENCES } from './a2-sentences';
import { B1_VOCAB } from './b1-vocab';
import { B1_SENTENCES } from './b1-sentences';

// Italian. Full A1–B1, each level a distinct pack with no vocabulary shared
// between them — selecting B1 must never serve A1 words.
//
// Flavor lines follow the language being LEARNED, so they stay Italian for
// every UI locale — that is the point of them.
const ITALIAN_FLAVOR = {
  heroLocked: 'Prima l’italiano,\npoi TikTok.',
  heroUnlocked: 'Goditelo.',
  sessionDone: 'Sbloccato!',
  correct: 'Esatto!',
  typedPlaceholder: 'in italiano…',
} as const;

export const ITALIAN_A1: LanguagePack = {
  id: 'it-a1',
  language: 'it',
  name: 'Italian · A1',
  level: 'A1',
  version: 1,
  speechLocale: 'it-IT',
  vocab: A1_VOCAB,
  sentences: A1_SENTENCES,
  flavor: ITALIAN_FLAVOR,
};

export const ITALIAN_A2: LanguagePack = {
  id: 'it-a2',
  language: 'it',
  name: 'Italian · A2',
  level: 'A2',
  version: 1,
  speechLocale: 'it-IT',
  vocab: A2_VOCAB,
  sentences: A2_SENTENCES,
  flavor: ITALIAN_FLAVOR,
};

export const ITALIAN_B1: LanguagePack = {
  id: 'it-b1',
  language: 'it',
  name: 'Italian · B1',
  level: 'B1',
  version: 1,
  speechLocale: 'it-IT',
  vocab: B1_VOCAB,
  sentences: B1_SENTENCES,
  flavor: ITALIAN_FLAVOR,
};
