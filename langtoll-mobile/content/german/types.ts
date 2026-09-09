// Content types for LangToll language packs.
// A "pack" is a bundled, versioned set of vocab + sentence items for one
// language/level. Packs ship in the app bundle (no network needed to unlock
// your phone — the whole point is it works at 7am on the subway).
//
// NOTE on the `de` field: for historical reasons the target-language string on
// every item is named `de` regardless of the pack's language (a Portuguese pack
// puts Portuguese text in `de`). It's the "word/sentence in the language being
// learned" slot; renaming it would churn the whole engine for no behavior gain.
//
// The `en` field is the mirror of that: the side the user READS, in their own
// UI locale. It holds English as authored, and localizePack() swaps in the
// matching `gloss` entry at load time — so an Italian UI learning Spanish gets
// Italian in `en`. Same trade as `de`: one stable slot, name kept for history.
import type { LocaleCode } from '@/lib/locales';

export type Level = 'A1' | 'A2' | 'B1' | 'B2';

/** Languages a user can learn. UI names resolve via i18n `lang.*` keys. */
export type Language = 'de' | 'es' | 'fr' | 'pt' | 'it' | 'en';

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

/**
 * Speaker-gender agreement marker. Some items are forms only one speaker
 * gender uses (pt obrigado/obrigada, es encantado/a): 'm' and 'f' mark the
 * variants, and filterPackForForms() keeps the ones matching the learner's
 * chosen forms (state.forms). Unmarked items are for everyone.
 */
export type SpeakerGender = 'm' | 'f';

export interface VocabItem {
  speakerGender?: SpeakerGender;
  /**
   * Other renderings graded as fully correct when typed — the speaker-gendered
   * sibling (obrigado <-> obrigada) or true synonyms. Never shown; only graded.
   */
  altAnswers?: string[];

  id: string;
  /** German side — nouns include the article (der/die/das). */
  de: string;
  /**
   * English translation(s); first entry is the canonical one. Always present —
   * it is the guaranteed fallback for any locale `gloss` hasn't covered yet.
   */
  en: string[];
  /**
   * Translations for the other UI locales. Resolved once per session by
   * localizePack() in lib/pack.ts, which swaps the matching entry into `en`
   * so the trainer keeps a single "the side the user reads" slot. Partial by
   * design: a missing locale falls back to English rather than blocking a pack.
   */
  gloss?: Partial<Record<LocaleCode, string[]>>;
  pos: PartOfSpeech;
  /**
   * Grammatical gender, for languages where the article does NOT reveal it.
   * French and Italian elide before vowels (l'eau, l'acqua), so the card would
   * otherwise teach a noun whose gender the learner can never recover — which
   * matters because gender is the thing they actually have to memorise.
   *
   * Deliberately NOT folded into `de`: that field is what gets spoken, and
   * "l'eau (f)" would be read aloud as "l'eau parenthèse f".
   *
   * Omit where the article already shows it (der/die/das, el/la, o/a, il/la).
   */
  gender?: 'm' | 'f';
  level: Level;
  /** Grouping used to pick plausible multiple-choice distractors. */
  category: string;
  /**
   * Where this item came from. Absent means authored — the hand-checked packs
   * that ship in the binary. 'ai' marks an item from the generated pool, which
   * is fetched and cached rather than bundled.
   *
   * Kept optional so the thousands of authored items need no annotation: absence
   * IS the authored case. Surfaced in-session behind the dev-tools flag so the
   * provenance of any exercise can be checked on a real device, and so answer
   * quality can later be compared between the two sources.
   * 'goal' marks items from the pack generated for the learner's own goal
   * ("Pass the B1 exam") — the trainer guarantees these seats in a session.
   */
  source?: 'ai' | 'goal' | 'topic';
}

export interface SentenceItem {
  speakerGender?: SpeakerGender;

  id: string;
  de: string;
  en: string;
  /** Per-locale translations; see VocabItem.gloss. */
  gloss?: Partial<Record<LocaleCode, string>>;
  level: Level;
  /**
   * 0-based index (whitespace-split) of the word to blank out in cloze
   * exercises. Chosen by hand so the blank is the interesting word, not "der".
   */
  clozeIndex: number;
  /** Wrong-but-plausible options for the blanked word. */
  clozeDistractors: string[];
  /**
   * Where this item came from. Absent means authored — the hand-checked packs
   * that ship in the binary. 'ai' marks an item from the generated pool, which
   * is fetched and cached rather than bundled.
   *
   * Kept optional so the thousands of authored items need no annotation: absence
   * IS the authored case. Surfaced in-session behind the dev-tools flag so the
   * provenance of any exercise can be checked on a real device, and so answer
   * quality can later be compared between the two sources.
   * 'goal' marks items from the pack generated for the learner's own goal
   * ("Pass the B1 exam") — the trainer guarantees these seats in a session.
   */
  source?: 'ai' | 'goal' | 'topic';
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
