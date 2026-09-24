// jest.config.js pins TZ to Europe/Lisbon so the DST case is deterministic.
import { nextMorning, MORNING_HOUR } from './pause';

const local = (y: number, m: number, d: number, h: number, min = 0) => new Date(y, m - 1, d, h, min, 0, 0).getTime();
const at = (ms: number) => {
  const d = new Date(ms);
  return { h: d.getHours(), m: d.getMinutes(), day: d.getDate(), month: d.getMonth() + 1 };
};

describe('nextMorning — when a night off ends', () => {
  test('MORNING_HOUR is eight', () => {
    expect(MORNING_HOUR).toBe(8);
  });

  test('at 07:59 the night off ends today at 08:00', () => {
    const r = at(nextMorning(local(2026, 9, 24, 7, 59)));
    expect(r).toEqual({ h: 8, m: 0, day: 24, month: 9 });
  });

  test('at exactly 08:00 it is tomorrow — a pause must always lift the lock for a while', () => {
    const r = at(nextMorning(local(2026, 9, 24, 8, 0)));
    expect(r).toEqual({ h: 8, m: 0, day: 25, month: 9 });
  });

  test('at 23:30 it is tomorrow morning', () => {
    const r = at(nextMorning(local(2026, 9, 24, 23, 30)));
    expect(r).toEqual({ h: 8, m: 0, day: 25, month: 9 });
  });

  test('the end is strictly in the future', () => {
    for (const h of [0, 7, 8, 9, 12, 23]) {
      const now = local(2026, 9, 24, h, 0);
      expect(nextMorning(now)).toBeGreaterThan(now);
    }
  });

  test('across the DST change night it still lands on 08:00 local (Lisbon, 2026-10-25)', () => {
    // Clocks go back at 02:00 on 2026-10-25 in Europe/Lisbon: the night is 25h long.
    const now = local(2026, 10, 24, 22, 0);
    const end = nextMorning(now);
    expect(at(end)).toEqual({ h: 8, m: 0, day: 25, month: 10 });
    expect((end - now) / 3600_000).toBe(11); // 22:00 → 08:00 across a 25-hour night
  });

  test('across the spring-forward night too (Lisbon, 2026-03-29)', () => {
    const now = local(2026, 3, 28, 23, 0);
    const end = nextMorning(now);
    expect(at(end)).toEqual({ h: 8, m: 0, day: 29, month: 3 });
    expect((end - now) / 3600_000).toBe(8); // 23:00 → 08:00 across a 23-hour night
  });

  test('defaults to the real clock', () => {
    expect(nextMorning()).toBeGreaterThan(Date.now());
  });
});
