import { addDays, todayISO } from '@/lib/date';
import { weekStartISO } from '@/lib/week';

/** Words met in a session: distinct items, however many times one came round. */
export function distinctWords(exercises: readonly { itemId: string }[]): number {
  return new Set(exercises.map((e) => e.itemId)).size;
}

export interface RecapLast {
  weekStart: string;
  fares: number;
  words: number;
  minutes: number;
}

/**
 * The Monday home card shows last week's story — only the week just gone,
 * only on Monday and Tuesday, only with something to tell, and not once it
 * has been dismissed for that week.
 */
export function recapCardVisible(last: RecapLast | null, dismissedWeek: string | null, today: string = todayISO()): boolean {
  if (!last || last.fares <= 0) return false;
  const thisWeek = weekStartISO(today);
  return last.weekStart === addDays(thisWeek, -7) && today <= addDays(thisWeek, 1) && dismissedWeek !== last.weekStart;
}

// How the weekly recap says its time. A light week rounded to "0 hours" once;
// under an hour it is minutes, at an hour it is hours, with one decimal only
// when the hour is not whole ("1.5 hours", never "2.0 hours").

export type RecapSpan = { unit: 'minutes'; value: number } | { unit: 'hour' | 'hours'; value: number };

/** Round to one decimal, dropping a trailing .0 (1.5 stays, 2.0 becomes 2). */
export function recapHours(minutes: number): number {
  return Math.round((minutes / 60) * 10) / 10;
}

export function recapSpan(minutes: number): RecapSpan {
  const m = Math.max(0, Math.round(minutes));
  if (m < 60) return { unit: 'minutes', value: m };
  const h = recapHours(m);
  return { unit: h === 1 ? 'hour' : 'hours', value: h };
}
