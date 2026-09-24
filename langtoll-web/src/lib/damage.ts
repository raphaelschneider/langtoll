// The damage: what the apps take, as the landing page's calculator shows it.
//
// MIRROR of langtoll-mobile/lib/projection.ts — the onboarding's "The damage"
// step runs this exact arithmetic on the phone. The two must change together:
// a visitor who tapped TikTok + Instagram here and sees 3h 30m must see 3h 30m
// again on the app's mirror step, or the page was lying.

// Minutes/day for a HEAVY user of each app — the person who taps it on a
// screen that asks which apps steal their nights. Upper end of the published
// usage distributions, summed (someone who names three apps is not sharing
// one habit across them). Netflix stays under its TV-inclusive figure: phone time.
export const APP_MINUTES: Record<string, number> = {
  TikTok: 120,
  YouTube: 100,
  Games: 90,
  Instagram: 90,
  Netflix: 90,
  X: 45,
  Reddit: 45,
};
/** The chip order on the page — the app's onboarding order. */
export const APPS = ['TikTok', 'Instagram', 'YouTube', 'Reddit', 'X', 'Games', 'Netflix'] as const;
/** Ticked on load, like the app's onboarding. */
export const DEFAULT_APPS: readonly string[] = ['TikTok', 'Instagram'];
/** An app we have no figure for still counts — as a light one. */
export const UNKNOWN_APP_MINUTES = 45;
// Naming everything still has to leave a night's sleep: eight hours is where
// the arithmetic stops being a mirror and becomes a joke.
export const MAX_DAILY_MINUTES = 8 * 60;
// Nothing ticked: a heavy scroller's day.
export const SOCIAL_AVERAGE_MINUTES = 210;
// The horizon the yearly loss is projected over — a working life of feeds.
export const HORIZON_YEARS = 40;
// Guided hours to B2 — FSI category I (es/fr/it/pt) 600–750, German 750.
// Rounded down: a year of scrolling dwarfs it, and a smaller bar makes that truer.
export const FLUENT_HOURS: Record<string, number> = { de: 750, es: 600, fr: 600, it: 600, pt: 600, en: 600 };
export const DEFAULT_FLUENT_HOURS = 600;

// A precise-looking 2h 59m reads as arithmetic; 3h reads as a fact.
export function roundToQuarterHour(minutes: number): number {
  return Math.round(minutes / 15) * 15;
}

/** Minutes a day the ticked apps take, summed and capped, on the quarter hour. */
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
  /** The fluency bar for the course, for "fluent takes about {n}". */
  fluentHours: number;
}

export function damage(dailyMinutes: number, course: string): Damage {
  const daysPerYear = Math.round((dailyMinutes * 365) / 1440);
  return {
    daysPerYear,
    yearsLost: Math.max(1, Math.round((daysPerYear * HORIZON_YEARS) / 365)),
    hoursPerYear: Math.round((dailyMinutes * 365) / 60 / 50) * 50,
    fluentHours: FLUENT_HOURS[course] ?? DEFAULT_FLUENT_HOURS,
  };
}

/** "3h 30m" — the app's own headline format, in every locale. */
export function formatDaily(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h ? `${h}h` : '', m ? `${m}m` : ''].filter(Boolean).join(' ') || '0m';
}
