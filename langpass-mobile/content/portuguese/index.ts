import type { LanguagePack } from '@/content/german/types';
import { A1_VOCAB } from './a1-vocab';
import { A1_SENTENCES } from './a1-sentences';
import { A2_VOCAB } from './a2-vocab';
import { A2_SENTENCES } from './a2-sentences';
import { B1_VOCAB } from './b1-vocab';
import { B1_SENTENCES } from './b1-sentences';

// Brazilian Portuguese. Full A1–B1. Each level is a distinct pack with no
// vocabulary shared between them — selecting B1 must never serve A1 words.
const PORTUGUESE_FLAVOR = {
  heroLocked: 'Primeiro português,\ndepois TikTok.',
  heroUnlocked: 'Aproveita.',
  sessionDone: 'Desbloqueado!',
  correct: 'Isso!',
  typedPlaceholder: 'em português…',
} as const;

export const PORTUGUESE_A1: LanguagePack = {
  id: 'pt-a1',
  language: 'pt',
  name: 'Portuguese · A1',
  level: 'A1',
  version: 1,
  speechLocale: 'pt-BR',
  vocab: A1_VOCAB,
  sentences: A1_SENTENCES,
  flavor: PORTUGUESE_FLAVOR,
};

export const PORTUGUESE_A2: LanguagePack = {
  id: 'pt-a2',
  language: 'pt',
  name: 'Portuguese · A2',
  level: 'A2',
  version: 1,
  speechLocale: 'pt-BR',
  vocab: A2_VOCAB,
  sentences: A2_SENTENCES,
  flavor: PORTUGUESE_FLAVOR,
};

export const PORTUGUESE_B1: LanguagePack = {
  id: 'pt-b1',
  language: 'pt',
  name: 'Portuguese · B1',
  level: 'B1',
  version: 1,
  speechLocale: 'pt-BR',
  vocab: B1_VOCAB,
  sentences: B1_SENTENCES,
  flavor: PORTUGUESE_FLAVOR,
};
