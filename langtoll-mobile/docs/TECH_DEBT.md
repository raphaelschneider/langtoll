# Tech debt

Things we know we owe the app. One entry per item, newest at the top. An entry
leaves this file when it ships (mention the commit in the removal).

## Landing page videos (2026-09-24, Ralph)

**What:** regenerate the three phone videos in the landing page's "Pay the toll.
Collect your pass." section (langtoll-web/public/shots/pass-loop.mp4,
practice-loop.mp4, wallet-loop.mp4 and their poster PNGs), one per language
if the capture rig allows it.

**Why:** the loops were recorded before the sentence builder, Tolly's moods,
the first-fare onboarding and the new hook. The section promises "watch the
whole ritual" and shows a stale app. The rig for stills exists
(marketing/appstore/capture); video needs a recording pass on the simulator
(`xcrun simctl io <udid> recordVideo`) driven by the same seeds, then a trim
and loop-point pass.

**Open questions:** one set in English or six localized sets; whether the
landing shows the ritual as three loops or one continuous clip.

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
