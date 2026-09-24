import {
  estimateDailyMinutes,
  roundToQuarterHour,
  damage,
  projection,
  MAX_DAILY_MINUTES,
  SOCIAL_AVERAGE_MINUTES,
  DEFAULT_FLUENT_HOURS,
  LEVELS,
} from './projection';

const ALL_APPS = ['TikTok', 'Instagram', 'YouTube', 'Reddit', 'X', 'Games', 'Netflix'];

describe('estimateDailyMinutes — the damage headline', () => {
  test('no apps picked shows a heavy scroller day: 3h 30m', () => {
    expect(estimateDailyMinutes([])).toBe(210);
    expect(SOCIAL_AVERAGE_MINUTES).toBe(210);
  });

  test('TikTok + Instagram is 3h 30m (summed, no overlap discount)', () => {
    expect(estimateDailyMinutes(['TikTok', 'Instagram'])).toBe(210);
  });

  test('all seven apps cap at eight hours, not ten', () => {
    expect(estimateDailyMinutes(ALL_APPS)).toBe(MAX_DAILY_MINUTES);
    expect(MAX_DAILY_MINUTES).toBe(480);
  });

  test('an app with no figure still counts as a light one', () => {
    expect(estimateDailyMinutes(['Snapchat'])).toBe(45);
  });

  test('snaps to the quarter hour', () => {
    expect(roundToQuarterHour(173)).toBe(180); // 2h53 → 3h
    expect(roundToQuarterHour(172)).toBe(165); // 2h52 → 2h45 (under the midpoint)
    expect(roundToQuarterHour(158)).toBe(165); // 2h38 → 2h45
    expect(roundToQuarterHour(0)).toBe(0);
    // every combination lands on a quarter hour
    for (const combo of [['X'], ['Reddit', 'X'], ['YouTube', 'Reddit'], ALL_APPS]) {
      expect(estimateDailyMinutes(combo) % 15).toBe(0);
    }
  });
});

describe('damage — the years and the fluency bar', () => {
  test('3h 30m is 53 days a year and 6 years of a 40-year horizon', () => {
    const d = damage(210, 'es');
    expect(d.daysPerYear).toBe(53);
    expect(d.yearsLost).toBe(6);
  });

  test('hours a year round to the nearest fifty: 3h 30m → 1,300', () => {
    expect(damage(210, 'es').hoursPerYear).toBe(1300);
    expect(damage(480, 'es').hoursPerYear).toBe(2900);
  });

  test('years lost is never zero, even for a light user', () => {
    expect(damage(15, 'es').yearsLost).toBe(1);
    expect(damage(0, 'es').yearsLost).toBe(1);
    expect(damage(0, 'es').daysPerYear).toBe(0);
  });

  test('fluent hours per language, German higher, unknown falls back to 600', () => {
    expect(damage(210, 'de').fluentHours).toBe(750);
    expect(damage(210, 'pt').fluentHours).toBe(600);
    expect(damage(210, 'th').fluentHours).toBe(DEFAULT_FLUENT_HOURS);
  });
});

describe('projection — the other side of the mirror', () => {
  const idx = (l: string) => LEVELS.indexOf(l as (typeof LEVELS)[number]);

  test('TikTok + Instagram at 5 exercises / 30 min: 7 fares, 12 minutes, 630 words by day 30', () => {
    const p = projection(210, 5, 30);
    expect(p.faresPerDay).toBe(7);
    expect(p.practiceMinutes).toBe(12);
    expect(p.wordsPerDay).toBeCloseTo(21);
    expect(p.words30).toBe(630);
    expect(p.level6).toBe('B1');
    expect(p.level12).toBe('B2');
  });

  test('the timeline always climbs and never says the same level twice', () => {
    const cases: [number, number, number][] = [
      [480, 8, 10], // heavy: 48 fares × 8
      [480, 10, 10],
      [210, 5, 30],
      [60, 3, 60], // light: 1 fare × 3
      [15, 3, 60], // lighter than one fare
      [0, 5, 30], // no time at all
      [210, 1, 30],
    ];
    for (const [mins, ex, unlock] of cases) {
      const p = projection(mins, ex, unlock);
      expect(idx(p.level6)).toBeGreaterThanOrEqual(idx('A2'));
      expect(idx(p.level6)).toBeLessThanOrEqual(idx('B1'));
      expect(idx(p.level12)).toBeGreaterThan(idx(p.level6));
      expect(idx(p.level12)).toBeLessThanOrEqual(idx('B2'));
    }
  });

  test('heavy usage caps at B2 by month twelve, B1 by month six', () => {
    const p = projection(480, 10, 10);
    expect(p.level6).toBe('B1');
    expect(p.level12).toBe('B2');
  });

  test('light usage still promises A2 then B1', () => {
    const p = projection(60, 3, 60);
    expect(p.level6).toBe('A2');
    expect(p.level12).toBe('B1');
  });

  test('fares a day is never zero — a fare that does not fit the day still happens once', () => {
    expect(projection(15, 5, 30).faresPerDay).toBe(1);
    expect(projection(0, 5, 30).faresPerDay).toBe(1);
    expect(projection(0, 5, 30).practiceMinutes).toBeGreaterThanOrEqual(1);
  });

  test('words by day 30 is never under ten and lands on a ten', () => {
    expect(projection(0, 1, 60).words30).toBe(20); // 1 fare × 1 × 0.6 × 30 = 18 → 20
    expect(projection(15, 1, 60).words30 % 10).toBe(0);
    expect(projection(15, 1, 60).words30).toBeGreaterThanOrEqual(10);
  });

  test('a zero or negative fare cannot break the arithmetic', () => {
    const p = projection(210, 0, 0);
    expect(Number.isFinite(p.faresPerDay)).toBe(true);
    expect(p.faresPerDay).toBeGreaterThanOrEqual(1);
    expect(p.practiceMinutes).toBeGreaterThanOrEqual(1);
    expect(p.words30).toBeGreaterThanOrEqual(10);
  });
});
