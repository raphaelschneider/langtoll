import type { LanguagePack } from '@/content/german/types';
import { A1_VOCAB } from './a1-vocab';
import { A1_SENTENCES } from './a1-sentences';
import { A2_VOCAB } from './a2-vocab';
import { A2_SENTENCES } from './a2-sentences';
import { B1_VOCAB } from './b1-vocab';
import { B1_SENTENCES } from './b1-sentences';

// English. Full A1–B1, each level a distinct pack with no vocabulary shared
// between them — selecting B1 must never serve A1 words.
//
// Flavor lines follow the language being LEARNED, so they stay English for
// every UI locale — that is the point of them.
const ENGLISH_FLAVOR = {
  heroLocked: 'English first,\nTikTok after.',
  heroUnlocked: 'Enjoy it.',
  sessionDone: 'Unlocked!',
  correct: 'That’s it!',
  typedPlaceholder: 'in English…',
} as const;

export const ENGLISH_A1: LanguagePack = {
  id: 'en-a1',
  language: 'en',
  name: 'English · A1',
  level: 'A1',
  version: 1,
  speechLocale: 'en-GB',
  vocab: A1_VOCAB,
  sentences: A1_SENTENCES,
  flavor: ENGLISH_FLAVOR,
};

export const ENGLISH_A2: LanguagePack = {
  id: 'en-a2',
  language: 'en',
  name: 'English · A2',
  level: 'A2',
  version: 1,
  speechLocale: 'en-GB',
  vocab: A2_VOCAB,
  sentences: A2_SENTENCES,
  flavor: ENGLISH_FLAVOR,
};

export const ENGLISH_B1: LanguagePack = {
  id: 'en-b1',
  language: 'en',
  name: 'English · B1',
  level: 'B1',
  version: 1,
  speechLocale: 'en-GB',
  vocab: B1_VOCAB,
  sentences: B1_SENTENCES,
  flavor: ENGLISH_FLAVOR,
};
