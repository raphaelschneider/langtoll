// The night off's end: 8:00 on the next morning that is still ahead. Pure and
// clock-injected so the edges (07:59 vs 08:00, the DST-change night) are
// tested rather than trusted.

export const MORNING_HOUR = 8;

/** Epoch ms of the next 08:00 local strictly after `now`. */
export function nextMorning(now: number = Date.now()): number {
  const d = new Date(now);
  d.setHours(MORNING_HOUR, 0, 0, 0);
  if (d.getTime() <= now) d.setDate(d.getDate() + 1);
  return d.getTime();
}
