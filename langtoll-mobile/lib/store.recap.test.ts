// The weekly recap's counters, rolled on Monday boundaries, with the real
// store code. TZ is Europe/Lisbon (jest.config.js).
import { freshStore, local } from '../test/store-harness';
import { weekStartISO } from './week';
import { recapCardVisible, distinctWords } from './recap';
import { todayISO } from './date';

jest.mock('@/lib/blocking', () => ({ grantUnlock: jest.fn(), lockNow: jest.fn() }));

const MON_14 = '2026-09-14';
const MON_21 = '2026-09-21';
const MON_28 = '2026-09-28';

afterEach(() => {
  jest.useRealTimers();
});

describe('weekStartISO — Monday-first, device-local', () => {
  test('a Sunday belongs to the week that started six days earlier', () => {
    expect(weekStartISO('2026-09-27')).toBe(MON_21);
  });
  test('a Monday starts its own week', () => {
    expect(weekStartISO(MON_28)).toBe(MON_28);
  });
  test('Sunday 23:59 and Monday 00:00 local fall in different weeks', () => {
    expect(weekStartISO(todayISO(local(2026, 9, 27, 23, 59)))).toBe(MON_21);
    expect(weekStartISO(todayISO(local(2026, 9, 28, 0, 0)))).toBe(MON_28);
  });
  test('a DST-change week is still one week (Lisbon, clocks back 2026-10-25)', () => {
    expect(weekStartISO('2026-10-25')).toBe('2026-10-19');
    expect(weekStartISO('2026-10-26')).toBe('2026-10-26');
  });
});

describe('rollRecap — closing a finished week', () => {
  test('a finished week with no fares keeps the previous story', async () => {
    jest.useFakeTimers().setSystemTime(local(2026, 9, 22)); // Tuesday of week 21
    const older = { weekStart: '2026-09-07', fares: 3, words: 9, minutes: 90 };
    const { store } = await freshStore({
      recapWeekStart: MON_14,
      recapFares: 0,
      recapWords: 0,
      recapMinutes: 0,
      recapLast: older,
    });
    store.rollRecap();
    const s = store.getState();
    expect(s.recapLast).toEqual(older);
    expect(s.recapWeekStart).toBe(MON_21);
    expect([s.recapFares, s.recapWords, s.recapMinutes]).toEqual([0, 0, 0]);
  });

  test('a finished week with fares becomes last week', async () => {
    jest.useFakeTimers().setSystemTime(local(2026, 9, 22));
    const { store } = await freshStore({ recapWeekStart: MON_14, recapFares: 4, recapWords: 10, recapMinutes: 120, recapLast: null });
    store.rollRecap();
    const s = store.getState();
    expect(s.recapLast).toEqual({ weekStart: MON_14, fares: 4, words: 10, minutes: 120 });
    expect(s.recapWeekStart).toBe(MON_21);
    expect(s.recapFares).toBe(0);
  });

  test('rolling twice in the same week is a no-op', async () => {
    jest.useFakeTimers().setSystemTime(local(2026, 9, 22));
    const { store } = await freshStore({ recapWeekStart: MON_21, recapFares: 2, recapWords: 5, recapMinutes: 60, recapLast: null });
    store.rollRecap();
    store.rollRecap();
    expect(store.getState().recapFares).toBe(2);
    expect(store.getState().recapLast).toBeNull();
  });

  test('a first-week user has nothing to tell until the first Monday', async () => {
    jest.useFakeTimers().setSystemTime(local(2026, 9, 22));
    const { store } = await freshStore({ recapWeekStart: null, recapFares: 0, recapLast: null });
    store.rollRecap();
    expect(store.getState().recapLast).toBeNull();
    expect(store.getState().recapWeekStart).toBe(MON_21);
  });
});

describe('bumpRecap — one paid fare at a time', () => {
  test('accumulates within the week', async () => {
    jest.useFakeTimers().setSystemTime(local(2026, 9, 22));
    const { store } = await freshStore({ recapWeekStart: MON_21, recapFares: 0, recapWords: 0, recapMinutes: 0 });
    store.bumpRecap(3, 30);
    store.bumpRecap(4, 30);
    const s = store.getState();
    expect([s.recapFares, s.recapWords, s.recapMinutes]).toEqual([2, 7, 60]);
    expect(s.recapWeekStart).toBe(MON_21);
  });

  test('the first fare of a new week rolls the old one first', async () => {
    jest.useFakeTimers().setSystemTime(local(2026, 9, 28, 9)); // Monday morning
    const { store } = await freshStore({ recapWeekStart: MON_21, recapFares: 5, recapWords: 12, recapMinutes: 150 });
    store.bumpRecap(2, 30);
    const s = store.getState();
    expect(s.recapLast).toEqual({ weekStart: MON_21, fares: 5, words: 12, minutes: 150 });
    expect(s.recapWeekStart).toBe(MON_28);
    expect([s.recapFares, s.recapWords, s.recapMinutes]).toEqual([1, 2, 30]);
  });

  test('words are distinct items, not exercises', () => {
    const plan = [{ itemId: 'a' }, { itemId: 'b' }, { itemId: 'a' }, { itemId: 'c' }, { itemId: 'b' }];
    expect(distinctWords(plan)).toBe(3);
    expect(distinctWords([])).toBe(0);
  });
});

describe('recapCardVisible — the Monday home card', () => {
  const last = { weekStart: MON_21, fares: 5, words: 12, minutes: 150 };

  test('shows on Monday and Tuesday of the following week', () => {
    expect(recapCardVisible(last, null, MON_28)).toBe(true);
    expect(recapCardVisible(last, null, '2026-09-29')).toBe(true);
  });
  test('gone by Wednesday', () => {
    expect(recapCardVisible(last, null, '2026-09-30')).toBe(false);
  });
  test('an older week never resurfaces', () => {
    expect(recapCardVisible(last, null, '2026-10-05')).toBe(false);
  });
  test('nothing to tell, nothing shown', () => {
    expect(recapCardVisible({ ...last, fares: 0 }, null, MON_28)).toBe(false);
    expect(recapCardVisible(null, null, MON_28)).toBe(false);
  });
  test('dismissing hides that week only', async () => {
    expect(recapCardVisible(last, MON_21, MON_28)).toBe(false);
    // the week after, a new story with the old dismissal still on record
    const next = { weekStart: MON_28, fares: 2, words: 4, minutes: 60 };
    expect(recapCardVisible(next, MON_21, '2026-10-05')).toBe(true);
    // and the store records the dismissal
    const { store } = await freshStore({ recapLast: last, recapDismissedWeek: null });
    store.dismissRecap(last.weekStart);
    expect(store.getState().recapDismissedWeek).toBe(MON_21);
  });
});
