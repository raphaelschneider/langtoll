// The App Store review prompt, asked once, at the only moment it's fair to ask:
// straight after a pass is issued — the user just won something.
//
// Apple gives you roughly three prompts per user per year and silently swallows
// the rest, so the prompt is a scarce resource: spending it on a bad moment is
// worse than not asking. The rules below are deliberately conservative.
//
//   NOT TOO EARLY — a first-session prompt asks a stranger for a favour. We wait
//     until MIN_SESSIONS passes have actually been earned, so the loop has proven
//     itself at least a few times.
//   NOT TOO LATE — asking at session 20 misses the peak; by then the novelty is
//     gone and the user has already decided how they feel. Session 3 is inside
//     the first days for anyone who is going to stick.
//   NOT WHEN IT WENT BADLY — a session scraped through with wrong answers is not
//     a delight moment. We require a mostly-correct run.
//   ONCE — one ask, ever, per install. If they dismiss it, that is an answer.
//
// A "Rate LangToll" row in Settings can open the store listing directly later;
// Apple forbids using requestReview() as the target of a button.
import * as StoreReview from 'expo-store-review';
import { getState, markReviewPrompted } from '@/lib/store';

/** Passes that must be earned before we ask. Session 3 ≈ 15 exercises. */
const MIN_SESSIONS = 3;
/** Share of the session that must be correct for it to count as a good moment. */
const MIN_ACCURACY = 0.7;

/**
 * Ask for a review if this moment qualifies. Call from the pass-issued screen
 * AFTER its animation has landed — never during. Fire-and-forget; every failure
 * path is a silent no-op.
 */
export function maybeAskForReview(correct: number, total: number): void {
  void (async () => {
    try {
      const s = getState();
      if (s.reviewPromptedAt) return; // asked once already
      if (s.sessionsCompleted < MIN_SESSIONS) return; // too early
      if (total > 0 && correct / total < MIN_ACCURACY) return; // not a win
      if (!(await StoreReview.hasAction())) return; // no store UI on this device

      // Record BEFORE showing: iOS may swallow the prompt (its own quota), and a
      // swallowed prompt still burns the moment — retrying next session would
      // just pester. One ask means one ask.
      markReviewPrompted();
      await StoreReview.requestReview();
    } catch {
      // never let a review prompt break the celebration
    }
  })();
}
