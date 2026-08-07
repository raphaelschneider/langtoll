// The learner's long-term goal, in a form the AI generator can use.
//
// `state.goal` holds either one of the onboarding chips' i18n KEYS
// ('ob.goalWork' …) or free text the user typed ("Pass the B1 exam") — t()
// returns unknown keys verbatim, so both render fine in the UI. The AI must
// never see an i18n key though: chips map to canonical English phrases, free
// text passes through as written.
import { getState } from '@/lib/store';

const CHIP_GOALS: Record<string, string> = {
  'ob.goalTravel': 'travel and everyday situations abroad',
  'ob.goalLove': 'talking with a partner or family who speak the language',
  'ob.goalWork': 'work and study',
  'ob.goalBrain': 'general mental fitness',
};

/** The goal as prose for the AI, or null when unset. */
export function aiGoal(): string | null {
  const goal = getState().goal?.trim();
  if (!goal) return null;
  return CHIP_GOALS[goal] ?? goal.slice(0, 120);
}
