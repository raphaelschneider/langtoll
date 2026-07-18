// Session generation: picks items using an SRS-light policy and turns them into
// concrete exercises. Pure functions over (pack, progress, difficulty) — no DB
// or store access here, so the whole engine is unit-testable.
//
// Difficulty (1–10, from onboarding) shapes the mix:
//   1–3  recognition-heavy: multiple choice + der/die/das, gentle cloze
//   4–6  production starts: typed answers, listening, more cloze
//   7–10 production-heavy: typing, sentence building (order), listening

import type { LanguagePack, VocabItem, SentenceItem } from '@/content/german/types';
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

const ARTICLES = ['der', 'die', 'das'] as const;

function articleOf(item: VocabItem): string | null {
  if (item.pos !== 'noun') return null;
  const first = item.de.split(' ')[0];
  return (ARTICLES as readonly string[]).includes(first) ? first : null;
}

function articleExercise(item: VocabItem, key: string): Exercise {
  const article = articleOf(item)!;
  const noun = item.de.slice(article.length + 1);
  return {
    key,
    type: 'article',
    itemId: item.id,
    prompt: `___ ${noun}`,
    hint: item.en[0],
    options: [...ARTICLES],
    answer: article,
    reveal: revealFor(item),
    audio: item.de,
  };
}

function listenExercise(item: VocabItem, pack: LanguagePack, rand: () => number, key: string): Exercise {
  return {
    key,
    type: 'listen',
    itemId: item.id,
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
    prompt: s.en,
    options: shuffle(words, rand),
    answer: words.join(' '),
    reveal: s.de,
    audio: s.de,
  };
}

/** Weighted pick of a vocab exercise type for one item. */
function pickVocabType(
  item: VocabItem,
  seenBefore: boolean,
  difficulty: number,
  audio: boolean,
  rand: () => number
): ExerciseType {
  const canArticle = articleOf(item) !== null;
  const roll = rand();

  if (difficulty <= 3) {
    if (canArticle && roll < 0.22) return 'article';
    if (seenBefore && difficulty >= 3 && roll > 0.9) return 'type_de';
    return roll < 0.62 ? 'mc_de_en' : 'mc_en_de';
  }
  if (difficulty <= 6) {
    if (audio && roll < 0.15) return 'listen';
    if (canArticle && roll < 0.3) return 'article';
    if (seenBefore && roll < 0.5) return 'type_de';
    return roll < 0.75 ? 'mc_de_en' : 'mc_en_de';
  }
  // 7–10: production-heavy
  if (audio && roll < 0.15) return 'listen';
  if (seenBefore && roll < 0.55) return 'type_de';
  if (canArticle && roll < 0.65) return 'article';
  return roll < 0.82 ? 'mc_en_de' : 'mc_de_en';
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
    const type = pickVocabType(item, seenBefore, difficulty, audio, rand);
    const key = `${item.id}-${i}`;

    if (type === 'article') {
      exercises.push(articleExercise(item, key));
    } else if (type === 'listen') {
      exercises.push(listenExercise(item, pack, rand, key));
    } else if (type === 'type_de') {
      exercises.push({
        key,
        type,
        itemId: item.id,
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
        prompt: item.en[0],
        options: mcOptions(item, pack, 'de', rand),
        answer: item.de,
        reveal: revealFor(item),
        audio: item.de,
      });
    }
  });

  sentences.forEach((s, i) => {
    const useOrder = difficulty >= 5 && rand() < 0.45 && s.de.split(/\s+/).length <= 9;
    exercises.push(useOrder ? orderExercise(s, rand, `${s.id}-${i}`) : clozeExercise(s, rand, `${s.id}-${i}`));
  });

  return { exercises: shuffle(exercises, rand) };
}
