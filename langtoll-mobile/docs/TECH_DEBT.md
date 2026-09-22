# Tech debt

Things we know we owe the app. One entry per item, newest at the top. An entry
leaves this file when it ships (mention the commit in the removal).

## Sentence builder: empty screen, no haptics, no Tolly (2026-09-22, Ralph)

**Where:** the "Build the sentence" exercise (`components/session/OrderBuilder.tsx`,
`components/session/OrderBank.tsx`, rendered from `app/session.tsx`).

**Problem:** between the prompt at the top and the word bank at the bottom the
screen is a void. The answer line sits alone under the sentence and the whole
middle of the phone is empty. It reads as unfinished and is the weakest-looking
exercise in the session.

**Wanted:**

1. **Tolly in the empty space.** He is the operator, so he watches you build:
   `stern` (or `peek`) while the sentence is being assembled, `happy` when the
   check passes, `sad` when it fails. `Tolly` already has one `mood` prop and
   the assets exist (`assets/tolly/`); `app/session.tsx` already swaps
   `sad`/`happy` on the grade line for other exercise types, so this is the same
   pattern moved into the builder's empty middle. Size him so he fills the gap
   without crowding the bank on a 6.1" phone.
2. **Haptics on every word tap.** Today only drag reorder and drag-to-remove
   buzz (`OrderBuilder.tsx` handleDrop, Light impact). A plain tap on a bank
   chip and a tap on a placed chip should give the same Light impact. The
   check result already fires Success/Error notification haptics in
   `app/session.tsx`; keep that, do not double it.

**Not now:** logged on launch day. Ship after the 1.0.2 review clears and the
funnel work is done. No data yet on whether this screen loses people.
