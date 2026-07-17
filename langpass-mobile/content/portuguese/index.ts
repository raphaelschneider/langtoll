import type { LanguagePack } from '@/content/german/types';
import { A1_VOCAB } from './a1-vocab';
import { A1_SENTENCES } from './a1-sentences';

// Brazilian Portuguese. A1 only for now (the test market); A2/B1 land later.
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
