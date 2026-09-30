// Small display formatters shared across screens.

/** A clock time in the device's own format ("8:00 AM" / "08:00"). */
export function formatClock(ms: number): string {
  return new Date(ms).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

/** Unlock time for people: "45 min", "1 h", "1 h 30 min", "6 h". */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}
