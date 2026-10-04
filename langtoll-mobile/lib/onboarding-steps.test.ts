// A draft saved by 1.0.3 (name third, no `order`) reopened on 1.0.4: every old
// step must resume on a step that exists, never skip an unanswered question, and
// never lose the answers already given.
import { resumeIndex, stepsFor, STEPS, STEPS_ORDER_1, STEP_ORDER } from './onboarding-steps';
import { FARE_MINUTE_STOPS, FARE_EXERCISES } from './plans';

describe('resume across versions', () => {
  const langs = ['de', 'es', 'fr', 'it', 'pt', 'en'] as const;

  it('every 1.0.3 step resumes on a valid 1.0.4 step without skipping unanswered questions', () => {
    for (const lang of langs) {
      const steps = stepsFor(lang as any);
      for (const old of STEPS_ORDER_1) {
        if (old === 'forms' && !steps.includes('forms')) continue;
        const i = resumeIndex({ step: old }, steps, false);
        const landed = steps[i]!;
        // Answers given in the old order before `old` must all be at or before `landed` in the new order.
        const answeredOld = STEPS_ORDER_1.slice(0, STEPS_ORDER_1.indexOf(old));
        const asked = ['language', 'difficulty', 'apps', 'name', 'when', 'fare', 'goal', 'forms'] as const;
        for (const q of asked) {
          if (!steps.includes(q)) continue;
          const answered = answeredOld.includes(q);
          const skipped = steps.indexOf(q) < i;
          // A question the 1.0.3 run never reached must not be behind the resume point.
          if (!answered) expect({ old, lang, q, landed, skipped }).toEqual({ old, lang, q, landed, skipped: false });
        }
        expect(['printing', 'lock']).not.toContain(landed);
      }
    }
  });

  it('a 1.0.4 draft resumes exactly where it stopped', () => {
    // A language with the speaker-forms step, so every step is exercised.
    const withForms = langs.find((l) => stepsFor(l as any).includes('forms'))!;
    expect(withForms).toBeDefined();
    const steps = stepsFor(withForms as any);
    for (const s of STEPS) {
      const i = resumeIndex({ step: s, order: STEP_ORDER }, steps, true);
      const expected = s === 'printing' ? 'summary' : s;
      expect(steps[i]).toBe(expected);
    }
    expect(steps[resumeIndex({ step: 'lock', order: STEP_ORDER }, steps, false)]).toBe('paywall');
  });

  it('every fare a 1.0.3 install could have saved is a stop on the 1.0.4 dial', () => {
    for (let m = 10; m <= 60; m += 5) expect(FARE_MINUTE_STOPS).toContain(m);
    for (const n of [3, 5, 8]) expect(FARE_EXERCISES).toContain(n);
  });

  it('an unknown step falls back to the start', () => {
    expect(resumeIndex({ step: 'nonsense' }, stepsFor('de'), false)).toBe(0);
  });
});
