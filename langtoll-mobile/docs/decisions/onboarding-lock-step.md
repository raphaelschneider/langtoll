# Onboarding lock step — should the Screen Time permission gate finishing?

**Status:** OPEN. Decision deferred until there are enough real installs to read
(2026-09-16, Ralph). Revisit when the funnel shows ~30 organic devices reaching
the lock step.

## What the last step does today

- The final onboarding screen ("lock") runs Apple's Screen Time flow: the
  Family Controls authorization sheet, then the notification permission sheet,
  then the native `FamilyActivityPicker`. Three system modals on one screen,
  unannounced.
- The finish button is **disabled until authorization is granted AND at least
  one app is picked** (`app/onboarding.tsx`, `disabled={step === 'lock' && !lockReady}`).
  There is no skip and no "later". Tapping "Don't Allow" or backing out of the
  picker leaves the user on the last screen with a dead button.
- The app never sends the `blocking_enabled` telemetry event the server already
  accepts, so a device that "stopped at lock" cannot be told apart by cause:
  permission denied, picker abandoned, or crash.

## What the data says (as of 2026-09-16)

30-day funnel export, 12 installs:

| step | reached | stopped here |
|---|---|---|
| language | 9 | 2 |
| name | 11 | 2 |
| lock (last) | 5 | 3 |
| finished | 2 | — |

Caveat that matters: the three devices that stopped at lock joined on 5, 7 and
10 September, before the App Store release on 11 September. At least one is
very likely Apple's reviewer, who never grants Family Controls. Organic App
Store installs since launch: **2**. This is a signal, not a measurement — hence
the deferral.

## Why it is not simply "the permission is needed"

The permission is needed for the product to work. The gate is a separate
choice: whether the user must clear it *before* they have done anything, or
after their first practice session. The first session needs no shield.

## Options on the table

1. **Let onboarding finish without the lock.** Button always enabled on the
   lock step. If nothing is authorized, a persistent "Set up the gate" card on
   home runs the same flow. This is how the screen-time apps that convert well
   sequence it: value first, permission second.
2. **Handle "Don't Allow" explicitly.** On denial, say what happened, offer a
   button into iOS Settings, and a way through without it. Today the button
   just stays grey.
3. **Instrument the step.** Send `blocking_enabled` with a `result`
   (`granted` / `denied` / `picker_cancelled`) so the next export says where
   inside the step people leave.

Option 3 carries no product risk and makes the eventual decision on 1 and 2
evidence-based; it can ship independently.

## What would change the decision

- Organic devices reaching the lock step and a stopped-here rate at or above
  ~40% → ship option 1 and 2.
- Organic devices completing the lock step at a normal rate (≤ 15% loss) →
  keep the gate, ship only option 2.

## Related

- `store/app-review-notes.md` claims "every step can be skipped". On a real
  device the lock step cannot. Fix the claim or the step, whichever way this
  lands.
