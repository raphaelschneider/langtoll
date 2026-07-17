// Date helpers. The app is organized around local calendar days ("YYYY-MM-DD").

// Dev-only virtual clock offset (in days). The "Start new day" Developer button advances it so
// the app steps forward through the calendar — a brand-new today, with the existing journey as
// history — for staging screenshots. Always 0 in production (only the Developer menu mutates it)
// and resets on app restart (in-memory). Only "now" is shifted; explicit dates are untouched,
// so addDays/parseISO and stored rows behave normally.
let devDayOffset = 0;
export function advanceDevDay(n = 1): void {
  devDayOffset += n;
}
export function resetDevDay(): void {
  devDayOffset = 0;
}
function nowWithDevOffset(): Date {
  const d = new Date();
  if (devDayOffset) d.setDate(d.getDate() + devDayOffset);
  return d;
}

export function todayISO(d: Date = nowWithDevOffset()): string {
  // Local date (not UTC) so "today" matches the user's wall clock.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISO(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

export function addDays(iso: string, delta: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + delta);
  return todayISO(d);
}

export function isToday(iso: string): boolean {
  return iso === todayISO();
}

export function dayDelta(iso: string): number {
  const a = parseISO(iso).getTime();
  const b = parseISO(todayISO()).getTime();
  return Math.round((a - b) / 86400000);
}

/** "Today", "Yesterday", "Tomorrow", or e.g. "Mon, Jun 9". */
export function relativeDayLabel(iso: string): string {
  const delta = dayDelta(iso);
  if (delta === 0) return 'Today';
  if (delta === -1) return 'Yesterday';
  if (delta === 1) return 'Tomorrow';
  return parseISO(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** e.g. "Wednesday, June 11" */
export function longDayLabel(iso: string): string {
  return parseISO(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function monthLabel(iso: string): string {
  return parseISO(iso).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}
