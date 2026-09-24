// The first-week express fare, with the real plans + store code.
import { freshStore, local } from '../test/store-harness';

jest.mock('@/lib/blocking', () => ({ grantUnlock: jest.fn(), lockNow: jest.fn() }));

const H = 3600_000;
const T0 = local(2026, 9, 22, 22).getTime(); // first launch: Tuesday 22:00
const plus = { plan: 'plus' as const, plusExpiresAt: '2027-01-01T00:00:00.000Z', plusWillRenew: true };

afterEach(() => jest.useRealTimers());

async function at(offsetMs: number, seed: Record<string, unknown>) {
  jest.useFakeTimers().setSystemTime(T0 + offsetMs);
  return freshStore({ firstLaunchAt: new Date(T0).toISOString(), ...plus, ...seed });
}

describe('express fare — three exercises for the first three days', () => {
  test('constants: three days, three exercises', async () => {
    const { plans } = await at(0, { exercisesPerUnlock: 5 });
    expect(plans.EXPRESS_DAYS).toBe(3);
    expect(plans.EXPRESS_EXERCISES).toBe(3);
  });

  test('before hydration there is no first launch on record, and no express', () => {
    // hydrate() stamps firstLaunchAt when it is missing, so null only exists
    // before the store has loaded — express must not fire on the default state.
    jest.useFakeTimers().setSystemTime(T0);
    let plans!: typeof import('@/lib/plans');
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      plans = require('@/lib/plans');
    });
    expect(plans.expressFareActive()).toBe(false);
    expect(plans.expressEndsAt()).toBe(0);
  });

  test('hydration stamps a first launch, so a fresh install gets express from its first minute', async () => {
    jest.useFakeTimers().setSystemTime(T0);
    const { store, plans } = await freshStore({ firstLaunchAt: null, ...plus, exercisesPerUnlock: 5, unlockMinutes: 30 });
    expect(store.getState().firstLaunchAt).not.toBeNull();
    expect(plans.expressFareActive()).toBe(true);
    expect(plans.effectiveExercisesPerUnlock()).toBe(3);
  });

  test('active one minute before the 72-hour mark, over at exactly 72 hours', async () => {
    const early = await at(72 * H - 60_000, { exercisesPerUnlock: 5, unlockMinutes: 30 });
    expect(early.plans.expressFareActive()).toBe(true);
    expect(early.plans.effectiveExercisesPerUnlock()).toBe(3);

    const late = await at(72 * H, { exercisesPerUnlock: 5, unlockMinutes: 30 });
    expect(late.plans.expressFareActive()).toBe(false);
    expect(late.plans.effectiveExercisesPerUnlock()).toBe(5);
  });

  test('the worked example: Tuesday 22:00 first launch ends Friday 22:00, shown as Friday', async () => {
    const { plans } = await at(H, { exercisesPerUnlock: 5, unlockMinutes: 30 });
    const ends = new Date(plans.expressEndsAt());
    expect(ends.getTime()).toBe(local(2026, 9, 25, 22).getTime());
    expect(plans.expressEndsWeekday()).toBe(ends.toLocaleDateString(undefined, { weekday: 'long' }));
    expect(plans.expressEndsWeekday()).toMatch(/^\p{L}+$/u);
  });

  test('a chosen fare of three is untouched and never announced', async () => {
    const { plans } = await at(H, { exercisesPerUnlock: 3, unlockMinutes: 30 });
    expect(plans.expressWillApply(3)).toBe(false);
    expect(plans.expressFareActive()).toBe(false);
    expect(plans.effectiveExercisesPerUnlock()).toBe(3);
  });

  test('a chosen fare of two stays two — express never makes a fare dearer', async () => {
    const { plans } = await at(H, { exercisesPerUnlock: 2, unlockMinutes: 30 });
    expect(plans.expressFareActive()).toBe(false);
    expect(plans.effectiveExercisesPerUnlock()).toBe(2);
  });

  test('free plan, chosen eight: three during express, the free rule after', async () => {
    const during = await at(H, { plan: 'free', plusExpiresAt: null, plusWillRenew: null, exercisesPerUnlock: 8, unlockMinutes: 30 });
    expect(during.plans.effectiveExercisesPerUnlock()).toBe(3);
    const after = await at(72 * H + 1, { plan: 'free', plusExpiresAt: null, plusWillRenew: null, exercisesPerUnlock: 8, unlockMinutes: 30 });
    expect(after.plans.effectiveExercisesPerUnlock()).toBe(after.plans.freeExercises(8));
    expect(after.plans.effectiveExercisesPerUnlock()).toBeGreaterThan(3);
  });

  test('unlock minutes are never shortened by express', async () => {
    const { plans } = await at(H, { exercisesPerUnlock: 8, unlockMinutes: 45 });
    expect(plans.expressFareActive()).toBe(true);
    expect(plans.effectiveUnlockMinutes()).toBe(45);
  });

  test('a first launch stamped in the future (clock skew) is not an eternal express', async () => {
    jest.useFakeTimers().setSystemTime(T0);
    const { plans } = await freshStore({ firstLaunchAt: new Date(T0 + 30 * 24 * H).toISOString(), ...plus, exercisesPerUnlock: 5, unlockMinutes: 30 });
    // Documented current behaviour: it IS active until that future date + 3 days.
    // If this ever flips, decide deliberately; the assertion pins the rule.
    expect(plans.expressFareActive()).toBe(true);
  });
});
