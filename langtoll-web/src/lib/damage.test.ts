import { describe, expect, it } from 'vitest';
import { APPS, MAX_DAILY_MINUTES, damage, estimateDailyMinutes, formatDaily, roundToQuarterHour } from './damage';

describe('damage — mirrors langtoll-mobile/lib/projection.ts', () => {
  it('nothing ticked is a heavy scroller: 3h 30m', () => {
    expect(estimateDailyMinutes([])).toBe(210);
    expect(formatDaily(210)).toBe('3h 30m');
  });

  it('TikTok + Instagram: 3h 30m, 53 days, 6 years, 1,300 hours', () => {
    const mins = estimateDailyMinutes(['TikTok', 'Instagram']);
    expect(mins).toBe(210);
    const d = damage(mins, 'es');
    expect(d.daysPerYear).toBe(53);
    expect(d.yearsLost).toBe(6);
    expect(d.hoursPerYear).toBe(1300);
    expect(d.fluentHours).toBe(600);
  });

  it('all seven apps stop at the eight-hour cap', () => {
    expect(estimateDailyMinutes([...APPS])).toBe(MAX_DAILY_MINUTES);
    expect(formatDaily(MAX_DAILY_MINUTES)).toBe('8h');
  });

  it('snaps to the quarter hour', () => {
    expect(roundToQuarterHour(172)).toBe(165);
    expect(roundToQuarterHour(173)).toBe(180);
    expect(estimateDailyMinutes(['X'])).toBe(45);
    expect(estimateDailyMinutes(['X', 'Reddit', 'Instagram'])).toBe(180);
  });

  it('an unknown app counts as a light one, German fluency is 750, unknown course 600', () => {
    expect(estimateDailyMinutes(['Snapchat'])).toBe(45);
    expect(damage(210, 'de').fluentHours).toBe(750);
    expect(damage(210, 'xx').fluentHours).toBe(600);
  });

  it('years never round to zero', () => {
    expect(damage(15, 'es').yearsLost).toBe(1);
  });
});
