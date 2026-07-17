// Resolves the pack the user actually trains on: their CEFR level's bundled
// pack, plus the AI topic pack merged in when one is generated and enabled.
import { packForLevel, type LanguagePack, type Level } from '@/content/german';
import { getState } from '@/lib/store';

/** Onboarding difficulty (1–10) → CEFR level. */
export function levelForDifficulty(d: number): Level {
  if (d <= 3) return 'A1';
  if (d <= 6) return 'A2';
  return 'B1';
}

export function activePack(): LanguagePack {
  const s = getState();
  const base = packForLevel(s.level);
  const topic = s.customTopic;
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
