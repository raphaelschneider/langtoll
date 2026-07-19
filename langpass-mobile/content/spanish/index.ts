import type { LanguagePack } from '@/content/german/types';
import { A1_VOCAB } from './a1-vocab';
import { A1_SENTENCES } from './a1-sentences';
import { A2_VOCAB } from './a2-vocab';
import { A2_SENTENCES } from './a2-sentences';
import { B1_VOCAB } from './b1-vocab';
import { B2_VOCAB } from './b2-vocab';
import { B1_SENTENCES } from './b1-sentences';
import { B2_SENTENCES } from './b2-sentences';

// Spanish. A1 is the first fully-glossed pack — every item carries de/fr/it/pt
// alongside English, so a learner on any of our six UI locales trains against
// their own language. A2/B1 land next.
//
// Flavor lines follow the language being LEARNED, so they stay Spanish for
// every UI locale — that is the point of them.
const SPANISH_FLAVOR = {
  heroLocked: 'Primero español,\ndespués TikTok.',
  heroUnlocked: 'Disfruta.',
  sessionDone: '¡Desbloqueado!',
  correct: '¡Eso es!',
  typedPlaceholder: 'en español…',
} as const;

export const SPANISH_A1: LanguagePack = {
  id: 'es-a1',
  language: 'es',
  name: 'Spanish · A1',
  level: 'A1',
  version: 1,
  speechLocale: 'es-ES',
  vocab: A1_VOCAB,
  sentences: A1_SENTENCES,
  flavor: SPANISH_FLAVOR,
};

export const SPANISH_A2: LanguagePack = {
  id: 'es-a2',
  language: 'es',
  name: 'Spanish · A2',
  level: 'A2',
  version: 1,
  speechLocale: 'es-ES',
  vocab: A2_VOCAB,
  sentences: A2_SENTENCES,
  flavor: SPANISH_FLAVOR,
};

export const SPANISH_B1: LanguagePack = {
  id: 'es-b1',
  language: 'es',
  name: 'Spanish · B1',
  level: 'B1',
  version: 1,
  speechLocale: 'es-ES',
  vocab: B1_VOCAB,
  sentences: B1_SENTENCES,
  flavor: SPANISH_FLAVOR,
};

export const SPANISH_B2: LanguagePack = {
  id: 'es-b2',
  language: 'es',
  name: 'Spanish · B2',
  level: 'B2',
  version: 1,
  speechLocale: 'es-ES',
  vocab: B2_VOCAB,
  sentences: B2_SENTENCES,
  flavor: SPANISH_FLAVOR,
};
