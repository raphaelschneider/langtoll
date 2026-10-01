// The onboarding's arithmetic, pure: the damage (what the apps take), and the
// other side (what the same time buys in the language). Kept out of the
// screen so the numbers a user is shown can be tested for the edges nobody
// would notice in a simulator run — a chosen fare that rounds to zero fares
// a day, a timeline that says "B2, then B2", seven apps adding up to ten
// hours.

// Minutes/day for a HEAVY user of each app — the person who picks it on a
// screen that asks which apps steal their nights. The mirror step used to
// quote per-app daily-active averages with an overlap discount, and "average
// user" read as "not me" (founder call, 2026-09-24: make the damage insane).
// These are the upper end of the published usage distributions, and they are
// summed: someone who names three apps is not sharing one habit across them.
// Netflix stays under its TV-inclusive figure: this is phone time.
export const APP_MINUTES: Record<string, number> = {
  TikTok: 120,
  YouTube: 100,
  Games: 90,
  Instagram: 90,
  Netflix: 90,
  X: 45,
  Reddit: 45,
};
/** An app we have no figure for still counts — as a light one. */
export const UNKNOWN_APP_MINUTES = 45;
// Naming everything still has to leave a night's sleep: eight hours is where
// the arithmetic stops being a mirror and becomes a joke.
export const MAX_DAILY_MINUTES = 8 * 60;
// Shown when the user skips app selection: a heavy scroller's day.
export const SOCIAL_AVERAGE_MINUTES = 210;
// The horizon the yearly loss is projected over — a working life of feeds.
export const HORIZON_YEARS = 40;
// Guided hours to B2 in the language — FSI category I (es/fr/it/pt) sits at
// 600–750, German at 750. Rounded down: the point is that a year of scrolling
// dwarfs it, and a smaller bar makes that truer, not weaker.
export const FLUENT_HOURS: Record<string, number> = { de: 750, es: 600, fr: 600, it: 600, pt: 600, en: 600 };
export const DEFAULT_FLUENT_HOURS = 600;

// A precise-looking 2h 59m reads as arithmetic; 3h reads as a fact. Snapping to
// the quarter hour keeps the headline blunt, and the estimate is nowhere near
// precise enough for the spare minutes to have meant anything anyway.
export function roundToQuarterHour(minutes: number): number {
  return Math.round(minutes / 15) * 15;
}

/** Minutes a day the chosen apps take, summed and capped, on the quarter hour. */
export function estimateDailyMinutes(selected: readonly string[]): number {
  if (selected.length === 0) return roundToQuarterHour(SOCIAL_AVERAGE_MINUTES);
  const total = selected.reduce((sum, a) => sum + (APP_MINUTES[a] ?? UNKNOWN_APP_MINUTES), 0);
  return roundToQuarterHour(Math.min(total, MAX_DAILY_MINUTES));
}

export interface Damage {
  /** Full days a year, from minutes a day. */
  daysPerYear: number;
  /** Whole years of life over HORIZON_YEARS — never less than one. */
  yearsLost: number;
  /** Hours a year to the nearest fifty: blunt numbers read as facts. */
  hoursPerYear: number;
  /** The fluency bar for the language, for "fluent takes about {n}". */
  fluentHours: number;
}

export function damage(dailyMinutes: number, language: string): Damage {
  const daysPerYear = Math.round((dailyMinutes * 365) / 1440);
  return {
    daysPerYear,
    yearsLost: Math.max(1, Math.round((daysPerYear * HORIZON_YEARS) / 365)),
    hoursPerYear: Math.round((dailyMinutes * 365) / 60 / 50) * 50,
    fluentHours: FLUENT_HOURS[language] ?? DEFAULT_FLUENT_HOURS,
  };
}

export const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;
export type ProjectedLevel = (typeof LEVELS)[number];

// ~20s per exercise (the "60–90 seconds" fare of ob.how3 is five of them),
// and about six new words in every ten exercises — the rest is review.
export const SECONDS_PER_EXERCISE = 20;
export const NEW_WORDS_PER_EXERCISE = 0.6;
// Levels from cumulative words, capped where the courses end.
const LEVEL_WORDS = [0, 1000, 2000, 4000];

export interface Projection {
  /** Unlocks of the daily time at the chosen minutes — never zero. */
  faresPerDay: number;
  /** Minutes of practice a day those fares add up to — never zero. */
  practiceMinutes: number;
  wordsPerDay: number;
  /** Words after thirty days, on the ten — never under ten. */
  words30: number;
  /** Month six: A2 at least, B1 at most. */
  level6: ProjectedLevel;
  /** Month twelve: above month six, or the projection if higher; capped at B2. */
  level12: ProjectedLevel;
}

function levelIdxAfterWords(words: number): number {
  let i = 0;
  for (let k = 1; k < LEVEL_WORDS.length; k++) if (words >= LEVEL_WORDS[k]) i = k;
  return i;
}

/**
 * The other side of the mirror, from the fare the user just set: every
 * unlock of that daily time costs fareEx exercises. The timeline must climb:
 * a heavy scroller's arithmetic lands on B2 by month six, and "B2, then B2"
 * reads as a broken screen.
 */
export function projection(dailyMinutes: number, fareEx: number, fareMin: number): Projection {
  // Rounded UP: 3 h 30 of apps at 2 h per unlock is two fares (the second one is
  // due at the two-hour mark), not one. Floor read "one fare a day" at 2 h
  // (founder, TestFlight 50, 2026-10-01).
  const faresPerDay = Math.max(1, Math.ceil(dailyMinutes / Math.max(1, fareMin)));
  const exercisesPerDay = faresPerDay * Math.max(1, fareEx);
  const practiceMinutes = Math.max(1, Math.round((exercisesPerDay * SECONDS_PER_EXERCISE) / 60));
  const wordsPerDay = exercisesPerDay * NEW_WORDS_PER_EXERCISE;
  const words30 = Math.max(10, Math.round((wordsPerDay * 30) / 10) * 10);
  const level6Idx = Math.min(2, Math.max(1, levelIdxAfterWords(wordsPerDay * 182)));
  const level12Idx = Math.min(3, Math.max(level6Idx + 1, levelIdxAfterWords(wordsPerDay * 365)));
  return {
    faresPerDay,
    practiceMinutes,
    wordsPerDay,
    words30,
    level6: LEVELS[level6Idx],
    level12: LEVELS[level12Idx],
  };
}
