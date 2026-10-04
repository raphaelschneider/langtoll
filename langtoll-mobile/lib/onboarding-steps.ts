// The onboarding's step list and where a relaunch resumes. Pure, so the cross-
// version resume is testable: an install that stopped mid-onboarding on 1.0.3,
// updated in the background, and reopened on 1.0.4 must land on a sensible step
// with every answer kept (founder question, 2026-10-04).
//
// The name is asked just before the mirror, the first screen that uses it. It was
// third, before anything about the learner: in the 30 days to 2026-09-28, 10 of 62
// installs got no further than the name field, and 8 of those walked back to the
// start and left (founder call to move it). Keep in sync with ONBOARDING_STEPS in
// langtoll-web/src/app/(site)/langtoll-adm/funnel.ts (it maps old builds' order too).
import { SPEAKER_FORM_EXAMPLES } from '@/lib/plans';
import type { Language } from '@/content/german/types';

/** Bumped when STEPS is reordered; saved into the draft so a resume knows which order it came from. */
export const STEP_ORDER = 2;
export const STEPS = [
  'hook',
  'how',
  'language',
  'difficulty',
  'apps',
  'name',
  'mirror',
  'when',
  'fare',
  'goal',
  'tease',
  'future',
  'forms',
  'printing',
  'summary',
  'taste',
  'paywall',
  'lock',
] as const;
export type Step = (typeof STEPS)[number];

/** The order builds before 1.0.4 saved drafts under (name third). For the resume test. */
export const STEPS_ORDER_1: readonly Step[] = [
  'hook', 'how', 'name', 'language', 'difficulty', 'apps', 'mirror', 'when', 'fare',
  'goal', 'tease', 'future', 'forms', 'printing', 'summary', 'taste', 'paywall', 'lock',
];

// The step list adapts to the chosen language: the speaker-forms question
// only exists where the language HAS speaker-gendered forms — a German
// learner once got a Portuguese grammar lesson here.
export function stepsFor(language: Language): readonly Step[] {
  return SPEAKER_FORM_EXAMPLES[language ?? 'de'] ? STEPS : STEPS.filter((x) => x !== 'forms');
}

// Where a relaunch picks up. Mid-loader goes to the summary it was loading, and
// the lock step is only for someone who has paid: a draft that says 'lock'
// without Plus (a lapse, a refund) goes back to the wall.
export function resumeIndex(draft: { step: string; order?: number }, steps: readonly Step[], plus: boolean): number {
  let s = draft.step as Step;
  if (s === 'printing') s = 'summary';
  // A draft saved under the old order (name third, before 1.0.4) that stopped on
  // the name field has not answered language, difficulty or apps yet; the moved
  // 'name' now sits after them, so resume at 'language' rather than skip them.
  if (s === 'name' && draft.order !== STEP_ORDER) s = 'language';
  if (s === 'lock' && !plus) s = 'paywall';
  const i = steps.indexOf(s);
  return i >= 0 ? i : 0;
}
