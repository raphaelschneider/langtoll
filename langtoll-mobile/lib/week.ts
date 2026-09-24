// Device-local weeks, Monday first. Shared by the store's recap counters and
// the home card's visibility rule.
import { addDays, todayISO } from '@/lib/date';

/** ISO date of the Monday of the week holding `iso` (device-local weeks). */
export function weekStartISO(iso: string = todayISO()): string {
  const d = new Date(`${iso}T12:00:00`); // noon: DST can't push it across a day
  const back = (d.getDay() + 6) % 7; // Mon → 0 … Sun → 6
  return addDays(iso, -back);
}
