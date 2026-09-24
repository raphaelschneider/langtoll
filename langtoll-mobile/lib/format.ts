// Small display formatters shared across screens.

/** A clock time in the device's own format ("8:00 AM" / "08:00"). */
export function formatClock(ms: number): string {
  return new Date(ms).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
