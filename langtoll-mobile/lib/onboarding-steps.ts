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
export const STEP_ORDER = 3;
// 1.0.7 (2026-10-09): no taste and no paywall. Onboarding ends at the lock, the
// first fare is the real thing with full access, and the wall waits until that
// pass runs out. Keep in sync with ONBOARDING_STEPS_1_0_7 in the admin.
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
  'lock',
] as const;
export type Step = (typeof STEPS)[number];
/** Steps older builds saved drafts on that no longer exist. */
type OldStep = 'taste' | 'paywall';

/** The order builds before 1.0.4 saved drafts under (name third). For the resume test. */
export const STEPS_ORDER_1: readonly (Step | OldStep)[] = [
  'hook', 'how', 'name', 'language', 'difficulty', 'apps', 'mirror', 'when', 'fare',
  'goal', 'tease', 'future', 'forms', 'printing', 'summary', 'taste', 'paywall', 'lock',
];
/** 1.0.4 – 1.0.6: name before the mirror, with the taste and the paywall. */
export const STEPS_ORDER_2: readonly (Step | OldStep)[] = [
  'hook', 'how', 'language', 'difficulty', 'apps', 'name', 'mirror', 'when', 'fare',
  'goal', 'tease', 'future', 'forms', 'printing', 'summary', 'taste', 'paywall', 'lock',
];

// The step list adapts to the chosen language: the speaker-forms question
// only exists where the language HAS speaker-gendered forms — a German
// learner once got a Portuguese grammar lesson here.
export function stepsFor(language: Language): readonly Step[] {
  return SPEAKER_FORM_EXAMPLES[language ?? 'de'] ? STEPS : STEPS.filter((x) => x !== 'forms');
}

// Where a relaunch picks up. Mid-loader goes to the summary it was loading. A
// draft from a build with the taste or the paywall (before 1.0.7) that stopped
// on either has answered everything: it resumes on the lock, and gets the free
// first fare like everyone else.
export function resumeIndex(draft: { step: string; order?: number }, steps: readonly Step[]): number {
  let s = draft.step as Step | OldStep;
  if (s === 'printing') s = 'summary';
  if (s === 'taste' || s === 'paywall') s = 'lock';
  // A draft saved under the first order (name third, before 1.0.4) that stopped
  // on the name field has not answered language, difficulty or apps yet; the
  // moved 'name' now sits after them, so resume at 'language' rather than skip them.
  if (s === 'name' && (draft.order ?? 1) < 2) s = 'language';
  const i = steps.indexOf(s as Step);
  return i >= 0 ? i : 0;
}
