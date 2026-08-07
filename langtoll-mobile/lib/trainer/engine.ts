// Session generation: picks items using an SRS-light policy and turns them into
// concrete exercises. Pure functions over (pack, progress, difficulty) — no DB
// or store access here, so the whole engine is unit-testable.
//
// Difficulty (1–10, from onboarding) shapes the mix:
//   1–3  recognition-heavy: multiple choice + der/die/das, gentle cloze
//   4–6  production starts: typed answers, listening, more cloze
//   7–10 production-heavy: typing, sentence building (order), listening

import type { LanguagePack, VocabItem, SentenceItem, Language } from '@/content/german/types';
import type { ItemProgressRow } from '@/lib/db/types';

export type ExerciseType =
  | 'mc_de_en' // German word → pick English
  | 'mc_en_de' // English word → pick German
  | 'type_de' // English word → type German
  | 'cloze' // fill the blank in a sentence
  | 'article' // pick der/die/das for a noun
  | 'order' // arrange words into the German sentence
  | 'listen'; // hear German → pick meaning

export interface Exercise {
  /** Stable per-session key. */
  key: string;
  /** Extra typed renderings graded as correct (speaker-gendered siblings). */
  altAnswers?: string[];
  type: ExerciseType;
  itemId: string;
  /** The question line shown big (word, cloze sentence, or English sentence for `order`). */
  prompt: string;
  /** Secondary line under the prompt (e.g. the sentence's translation as a hint). */
  hint?: string;
  /** Multiple-choice options / word bank in display order; absent for type_de. */
  options?: string[];
  /** The exact expected answer (an option for MC, the German string for typed/order). */
  answer: string;
  /** Shown after answering — the full resolved sentence / canonical translation. */
  reveal: string;
  /** German text for TTS (the prompt or the solution, whichever is German). */
  audio?: string;
  /**
   * Provenance of the underlying item — absent means authored, 'ai' means it
   * came from the generated pool. Carried through so a dev build can show which
   * is which on a real device, and so answer quality can be compared later.
   */
  source?: 'ai';
}

export interface SessionPlan {
  exercises: Exercise[];
}

export interface BuildOptions {
  /** 1–10; defaults to 3 (A1-comfortable). */
  difficulty?: number;
  /** Whether audio (listen) exercises may be included. */
  audio?: boolean;
}

// Mulberry32 — tiny seeded PRNG so a session is stable for a given seed but
// different across sessions.
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Priority for picking the next items:
 *  1. items answered wrong recently (streak 0 but seen) — re-drill mistakes
 *  2. unseen items — steady new material
 *  3. seen items, least-recently-seen first — spaced refresh
 * Mastered items (streak >= 3) still appear, just rarely.
 */
function pickVocab(
  pack: LanguagePack,
  progress: Map<string, ItemProgressRow>,
  count: number,
  rand: () => number
): VocabItem[] {
  const wrong: VocabItem[] = [];
  const unseen: VocabItem[] = [];
  const review: VocabItem[] = [];
  const mastered: VocabItem[] = [];
  for (const v of pack.vocab) {
    const p = progress.get(v.id);
    if (!p) unseen.push(v);
    else if (p.streak === 0) wrong.push(v);
    else if (p.streak >= 3) mastered.push(v);
    else review.push(v);
  }
  review.sort((a, b) =>
    (progress.get(a.id)?.last_seen_at ?? '').localeCompare(progress.get(b.id)?.last_seen_at ?? '')
  );
  const pool = [
    ...shuffle(wrong, rand),
    ...shuffle(unseen.slice(0, 12), rand),
    ...review,
    ...shuffle(mastered, rand),
    ...unseen.slice(12),
  ];
  return pool.slice(0, count);
}

/**
 * Reveal line for a vocab item. Appends grammatical gender where the article
 * doesn't show it (French/Italian elision: l'eau, l'acqua) — the reveal is the
 * moment the learner actually absorbs it, and `audio` stays clean because it
 * reads item.de directly rather than this string.
 */
function revealFor(item: VocabItem): string {
  const g = item.gender ? ` (${item.gender})` : '';
  return `${item.de}${g} — ${item.en[0]}`;
}

function mcOptions(
  item: VocabItem,
  pack: LanguagePack,
  side: 'de' | 'en',
  rand: () => number
): string[] {
  const correct = side === 'de' ? item.de : item.en[0];
  const sameCategory = shuffle(
    pack.vocab.filter((v) => v.id !== item.id && v.category === item.category),
    rand
  );
  const anyOther = shuffle(
    pack.vocab.filter((v) => v.id !== item.id && v.category !== item.category),
    rand
  );
  // The prompt is whatever sits on the OTHER side from the options.
  const promptText = side === 'de' ? item.en[0] : item.de;

  const seen = new Set([correct]);
  const distractors: string[] = [];
  for (const v of [...sameCategory, ...anyOther]) {
    const text = side === 'de' ? v.de : v.en[0];
    // Skip anything that MEANS the same as the prompt, not just anything that
    // reads the same as the correct option. Two headwords legitimately share a
    // gloss when the gloss language doesn't split them — Italian "perché" is
    // both why and because, "ciao" is both hello and goodbye, Portuguese "boa
    // noite" covers evening and night. Offering the sibling as a distractor
    // gives the item two correct answers and marks one of them wrong.
    const vPrompt = side === 'de' ? v.en[0] : v.de;
    if (vPrompt === promptText) continue;
    if (!seen.has(text)) {
      seen.add(text);
      distractors.push(text);
      if (distractors.length === 3) break;
    }
  }
  return shuffle([correct, ...distractors], rand);
}

// The article sets per language, grouped so a noun is only ever quizzed against
// articles it could actually take: a singular Spanish noun offers el/la, its
// plural offers los/las — never a four-way mix a native speaker would not face.
//
// This was `['der', 'die', 'das']`, full stop. The article exercise silently
// never fired for five of the six languages: articleOf matched nothing, its
// weight redistributed, and a Spanish learner simply had one exercise type less
// than a German one — with no error anywhere, because "no article found" is
// also the correct outcome for verbs.
//
// English has no entry: 'the' is invariant, so there is nothing to quiz.
// French/Italian elided forms (l’aéroport, l’azienda) match no set on purpose —
// the surface form hides the article, which is why those items carry an
// explicit `gender` field instead. Asking le/la about a noun written l’ would
// mark a learner wrong for something the language never shows.
const ARTICLE_GROUPS: Partial<Record<Language, string[][]>> = {
  de: [['der', 'die', 'das']],
  es: [['el', 'la'], ['los', 'las']],
  pt: [['o', 'a'], ['os', 'as']],
  it: [['il', 'lo', 'la'], ['i', 'gli', 'le']],
  // French singular only: the plural is always `les`, and a quiz with one
  // option is not a question.
  fr: [['le', 'la']],
};

/** The article group this noun's article belongs to, or null if unquizzable. */
function articleGroupOf(item: VocabItem, language: Language): string[] | null {
  if (item.pos !== 'noun') return null;
  const first = item.de.split(' ')[0].toLowerCase();
  return ARTICLE_GROUPS[language]?.find((group) => group.includes(first)) ?? null;
}

function articleExercise(item: VocabItem, language: Language, key: string): Exercise {
  const options = articleGroupOf(item, language)!;
  const article = item.de.split(' ')[0];
  const noun = item.de.slice(article.length + 1);
  return {
    key,
    type: 'article',
    itemId: item.id,
    source: item.source,
    prompt: `___ ${noun}`,
    hint: item.en[0],
    options: [...options],
    answer: article.toLowerCase(),
    reveal: revealFor(item),
    audio: item.de,
  };
}

function listenExercise(item: VocabItem, pack: LanguagePack, rand: () => number, key: string): Exercise {
  return {
    key,
    type: 'listen',
    itemId: item.id,
    source: item.source,
    prompt: '',
    options: mcOptions(item, pack, 'en', rand),
    answer: item.en[0],
    reveal: revealFor(item),
    audio: item.de,
  };
}

function clozeExercise(s: SentenceItem, rand: () => number, key: string): Exercise {
  const words = s.de.split(/\s+/);
  const answerWord = words[s.clozeIndex].replace(/[.,!?]$/, '');
  const punct = words[s.clozeIndex].slice(answerWord.length);
  const blanked = words.map((w, i) => (i === s.clozeIndex ? '_____' + punct : w)).join(' ');
  return {
    key,
    type: 'cloze',
    itemId: s.id,
    source: s.source,
    prompt: blanked,
    hint: s.en,
    options: shuffle([answerWord, ...s.clozeDistractors], rand),
    answer: answerWord,
    reveal: s.de,
    audio: s.de,
  };
}

function orderExercise(s: SentenceItem, rand: () => number, key: string): Exercise {
  const words = s.de.replace(/[.!?]$/, '').split(/\s+/);
  return {
    key,
    type: 'order',
    itemId: s.id,
    source: s.source,
    prompt: s.en,
    options: shuffle(words, rand),
    answer: words.join(' '),
    reveal: s.de,
    audio: s.de,
  };
}

/** The vocab-driven exercise types. Sentences pick between cloze and order. */
type VocabExerciseType = Extract<
  ExerciseType,
  'mc_de_en' | 'mc_en_de' | 'type_de' | 'article' | 'listen'
>;

/**
 * How often each type should appear, by difficulty band.
 *
 * These are weights, normalised over whatever is ELIGIBLE for the item at hand,
 * so the printed numbers are the real odds rather than a starting point that
 * later branches eat into.
 *
 * The previous version drew ONE random number and compared it against a chain
 * of thresholds, which made the branches correlated and the constants
 * misleading: at difficulty 8 `article` read as 65% and actually fired 10%,
 * because type_de had already consumed that slice of the same roll. Worse,
 * difficulty ≤ 3 had no listen branch at all — and 3 is the default every new
 * user starts on, so the voice we sell as a Plus feature never appeared until
 * someone raised the difficulty by hand.
 *
 * Recognition dominates at the bottom, production at the top; listening runs
 * throughout, because it is the skill that decays first without practice.
 */
const VOCAB_TYPE_WEIGHTS: { maxDifficulty: number; weights: Record<VocabExerciseType, number> }[] = [
  { maxDifficulty: 3, weights: { mc_de_en: 34, mc_en_de: 22, article: 20, listen: 12, type_de: 12 } },
  { maxDifficulty: 6, weights: { mc_de_en: 20, mc_en_de: 20, article: 15, listen: 15, type_de: 30 } },
  { maxDifficulty: 10, weights: { mc_de_en: 12, mc_en_de: 20, article: 12, listen: 18, type_de: 38 } },
];

/**
 * Weighted pick of a vocab exercise type for one item.
 *
 * A type drops out when the item or the session cannot support it — no article
 * to ask for, no audio in this plan, or a word the user has never met (typing
 * something you have not seen is a memory test, not a drill). The remaining
 * weights renormalise, so removing one type redistributes its share instead of
 * silently handing it to whichever branch happened to come next.
 */
function pickVocabType(
  item: VocabItem,
  language: Language,
  seenBefore: boolean,
  difficulty: number,
  audio: boolean,
  rand: () => number
): ExerciseType {
  const band =
    VOCAB_TYPE_WEIGHTS.find((b) => difficulty <= b.maxDifficulty) ??
    VOCAB_TYPE_WEIGHTS[VOCAB_TYPE_WEIGHTS.length - 1];

  const eligible = (Object.entries(band.weights) as [VocabExerciseType, number][]).filter(
    ([type, weight]) => {
      if (weight <= 0) return false;
      if (type === 'article') return articleGroupOf(item, language) !== null;
      if (type === 'listen') return audio;
      if (type === 'type_de') return seenBefore;
      return true;
    }
  );

  const total = eligible.reduce((sum, [, weight]) => sum + weight, 0);
  // Nothing eligible can only happen if the table is emptied; mc_de_en needs
  // nothing from the item, so it is the one type that is always answerable.
  if (total <= 0) return 'mc_de_en';

  let r = rand() * total;
  for (const [type, weight] of eligible) {
    r -= weight;
    if (r < 0) return type;
  }
  return eligible[eligible.length - 1][0];
}

/** Fraction of the session that comes from sentences, by difficulty. */
function sentenceShare(difficulty: number): number {
  if (difficulty <= 3) return 0.2;
  if (difficulty <= 6) return 0.3;
  return 0.4;
}

/**
 * Build a session of `count` exercises for the given difficulty. Typed and
 * order exercises only use material the user has met or can see translated —
 * you're never asked to produce something you've never encountered.
 */
export function buildSession(
  pack: LanguagePack,
  progressRows: ItemProgressRow[],
  count: number,
  seed: number,
  opts: BuildOptions = {}
): SessionPlan {
  const difficulty = Math.min(10, Math.max(1, opts.difficulty ?? 3));
  const audio = opts.audio ?? false;
  const rand = rng(seed);
  const progress = new Map(progressRows.map((r) => [r.item_id, r]));

  const sentenceCount = Math.max(1, Math.round(count * sentenceShare(difficulty)));
  const vocabCount = count - sentenceCount;

  const vocabItems = pickVocab(pack, progress, vocabCount, rand);
  const sentences = shuffle(pack.sentences, rand).slice(0, sentenceCount);

  const exercises: Exercise[] = [];

  vocabItems.forEach((item, i) => {
    const seenBefore = (progress.get(item.id)?.seen ?? 0) > 0;
    const type = pickVocabType(item, pack.language, seenBefore, difficulty, audio, rand);
    const key = `${item.id}-${i}`;

    if (type === 'article') {
      exercises.push(articleExercise(item, pack.language, key));
    } else if (type === 'listen') {
      exercises.push(listenExercise(item, pack, rand, key));
    } else if (type === 'type_de') {
      exercises.push({
        key,
        type,
        itemId: item.id,
    source: item.source,
        altAnswers: item.altAnswers,
        prompt: item.en[0],
        answer: item.de,
        reveal: revealFor(item),
        audio: item.de,
      });
    } else if (type === 'mc_de_en') {
      exercises.push({
        key,
        type,
        itemId: item.id,
    source: item.source,
        prompt: item.de,
        options: mcOptions(item, pack, 'en', rand),
        answer: item.en[0],
        reveal: revealFor(item),
        audio: item.de,
      });
    } else {
      exercises.push({
        key,
        type: 'mc_en_de',
        itemId: item.id,
    source: item.source,
        prompt: item.en[0],
        options: mcOptions(item, pack, 'de', rand),
        answer: item.de,
        reveal: revealFor(item),
        audio: item.de,
      });
    }
  });

  sentences.forEach((s, i) => {
    // Arranging given word-tiles is foundational and fully scaffolded (every word is handed
    // to you), so make it available from the very start — it used to be gated to
    // difficulty >= 5, which meant beginners never got the one drill that teaches word order,
    // the whole battle in German. Cap at 9 words so the tile bank stays tappable.
    const useOrder = s.de.split(/\s+/).length <= 9 && rand() < 0.5;
    exercises.push(useOrder ? orderExercise(s, rand, `${s.id}-${i}`) : clozeExercise(s, rand, `${s.id}-${i}`));
  });

  return { exercises: shuffle(exercises, rand) };
}
