// Content types for LangPass language packs.
// A "pack" is a bundled, versioned set of vocab + sentence items for one
// language/level. Packs ship in the app bundle (no network needed to unlock
// your phone — the whole point is it works at 7am on the subway).
//
// NOTE on the `de` field: for historical reasons the target-language string on
// every item is named `de` regardless of the pack's language (a Portuguese pack
// puts Portuguese text in `de`). It's the "word/sentence in the language being
// learned" slot; renaming it would churn the whole engine for no behavior gain.

export type Level = 'A1' | 'A2' | 'B1';

/** Languages a user can learn. UI names resolve via i18n `lang.*` keys. */
export type Language = 'de' | 'es' | 'fr' | 'pt' | 'it';

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adj'
  | 'adv'
  | 'phrase'
  | 'number'
  | 'pronoun'
  | 'prep'
  | 'conj'
  | 'question';

export interface VocabItem {
  id: string;
  /** German side — nouns include the article (der/die/das). */
  de: string;
  /** English translation(s); first entry is the canonical one. */
  en: string[];
  pos: PartOfSpeech;
  level: Level;
  /** Grouping used to pick plausible multiple-choice distractors. */
  category: string;
}

export interface SentenceItem {
  id: string;
  de: string;
  en: string;
  level: Level;
  /**
   * 0-based index (whitespace-split) of the word to blank out in cloze
   * exercises. Chosen by hand so the blank is the interesting word, not "der".
   */
  clozeIndex: number;
  /** Wrong-but-plausible options for the blanked word. */
  clozeDistractors: string[];
}

export interface LanguagePack {
  id: string; // e.g. 'de-a1'
  language: Language;
  name: string;
  level: Level;
  version: number;
  /** BCP-47 locale for on-device TTS, e.g. 'de-DE', 'pt-BR'. */
  speechLocale: string;
  vocab: VocabItem[];
  sentences: SentenceItem[];
  /**
   * Target-language flavor lines. These follow the language being LEARNED —
   * they are product voice, not UI translation, so they ship with the pack
   * (UI-locale strings live in lib/i18n).
   */
  flavor: {
    /** Home hero while locked, e.g. "Erst Deutsch,\ndann TikTok." */
    heroLocked: string;
    /** Home hero while unlocked, e.g. "Genieß es." */
    heroUnlocked: string;
    /** Session-complete headline, e.g. "Entsperrt!" */
    sessionDone: string;
    /** Correct-answer exclamation, e.g. "Richtig!" */
    correct: string;
    /** Typed-exercise input placeholder, e.g. "auf Deutsch…" */
    typedPlaceholder: string;
  };
}
