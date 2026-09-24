import { recapSpan, recapHours } from './recap';

describe('recapSpan — how the weekly recap says its time', () => {
  test('under an hour is minutes, never "0 hours"', () => {
    expect(recapSpan(25)).toEqual({ unit: 'minutes', value: 25 });
    expect(recapSpan(0)).toEqual({ unit: 'minutes', value: 0 });
    expect(recapSpan(59)).toEqual({ unit: 'minutes', value: 59 });
  });

  test('exactly an hour is the singular form', () => {
    expect(recapSpan(60)).toEqual({ unit: 'hour', value: 1 });
  });

  test('an hour and a half keeps one decimal', () => {
    expect(recapSpan(90)).toEqual({ unit: 'hours', value: 1.5 });
  });

  test('whole hours drop the decimal', () => {
    expect(recapSpan(120)).toEqual({ unit: 'hours', value: 2 });
    expect(recapHours(120)).toBe(2);
    expect(String(recapSpan(120).value)).toBe('2');
  });

  test('odd minutes round to a tenth of an hour', () => {
    expect(recapSpan(100)).toEqual({ unit: 'hours', value: 1.7 });
    expect(recapSpan(63)).toEqual({ unit: 'hours', value: 1.1 });
  });

  test('negative or fractional input is clamped and rounded', () => {
    expect(recapSpan(-5)).toEqual({ unit: 'minutes', value: 0 });
    expect(recapSpan(59.6)).toEqual({ unit: 'hour', value: 1 });
  });
});
