// Drafts saved by older builds reopened on this one: every old step must resume
// on a step that exists, never skip an unanswered question, and never lose the
// answers already given. 1.0.3 had the name third; 1.0.4–1.0.7 had the taste and
// the paywall; 1.0.8 ends at the lock.
import { resumeIndex, stepsFor, STEPS, STEPS_ORDER_1, STEPS_ORDER_2, STEP_ORDER } from './onboarding-steps';
import { FARE_MINUTE_STOPS, FARE_EXERCISES } from './plans';

const langs = ['de', 'es', 'fr', 'it', 'pt', 'en'] as const;
const asked = ['language', 'difficulty', 'apps', 'name', 'when', 'fare', 'goal', 'forms'] as const;

function checkOldOrder(oldOrder: readonly string[], order: number | undefined) {
  for (const lang of langs) {
    const steps = stepsFor(lang as any);
    for (const old of oldOrder) {
      if (old === 'forms' && !steps.includes('forms')) continue;
      const i = resumeIndex({ step: old, order }, steps);
      const landed = steps[i]!;
      const answeredOld = oldOrder.slice(0, oldOrder.indexOf(old));
      for (const q of asked) {
        if (!steps.includes(q)) continue;
        const answered = answeredOld.includes(q);
        const skipped = steps.indexOf(q) < i;
        if (!answered) expect({ old, lang, q, landed, skipped }).toEqual({ old, lang, q, landed, skipped: false });
      }
      expect(landed).not.toBe('printing');
      // The taste and the paywall are gone: a draft stopped on either had answered
      // everything, so it resumes on the lock and gets the free first fare.
      if (old === 'taste' || old === 'paywall' || old === 'lock') expect(landed).toBe('lock');
    }
  }
}

describe('resume across versions', () => {
  it('1.0.3 drafts (name third, no order field)', () => checkOldOrder(STEPS_ORDER_1, undefined));
  it('1.0.4–1.0.7 drafts (order 2, taste and paywall)', () => checkOldOrder(STEPS_ORDER_2, 2));

  it('a current draft resumes exactly where it stopped', () => {
    const withForms = langs.find((l) => stepsFor(l as any).includes('forms'))!;
    const steps = stepsFor(withForms as any);
    for (const s of STEPS) {
      const i = resumeIndex({ step: s, order: STEP_ORDER }, steps);
      expect(steps[i]).toBe(s === 'printing' ? 'summary' : s);
    }
  });

  it('every fare an older install could have saved is a stop on the dial', () => {
    for (let m = 10; m <= 60; m += 5) expect(FARE_MINUTE_STOPS).toContain(m);
    for (const n of [3, 5, 8]) expect(FARE_EXERCISES).toContain(n);
  });

  it('an unknown step falls back to the start', () => {
    expect(resumeIndex({ step: 'nonsense' }, stepsFor('de'))).toBe(0);
  });
});
