# Tech debt

Things we know we owe the app. One entry per item, newest at the top. An entry
leaves this file when it ships (mention the commit in the removal).

## Buyback offer (2026-09-23, Ralph)

**What:** an offer that wins back people who cancelled, as a discount or free
period on their way back to Plus.

**Why:** on launch day a yearly trial user cancelled renewal on day one and kept
using the app. When the trial ends they fall to free, which covers the A1 course
and 30-minute fare they picked. What they lose is audio, the sentence builder
and typing. That moment is when an offer has the best odds.

**Open questions:** where it shows (on the lapse, on a Plus-gated tap, or both).
Whether it uses Apple's own win-back offers, set up in App Store Connect and
served through RevenueCat, or a promotional offer we trigger ourselves. What it
gives (price and length).

(Sentence builder Tolly + tap haptics shipped in 2f1b752.)
