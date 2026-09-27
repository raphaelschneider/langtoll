# Tech debt

Things we know we owe the app. One entry per item, newest at the top. An entry
leaves this file when it ships (mention the commit in the removal).

## Conversation practice (2026-09-27, Ralph)

**What:** let a learner practise a dialogue, not just words. Three options to weigh, cheapest
first; none started.

1. *Sentence-level listening.* The `listen` exercise at sentence length ("Un cappuccino e un
   cornetto, quanto viene?"), plus a "pick the right response" variant that turns comprehension
   into the first turn of a dialogue. Pre-rendered voice (server, OpenAI TTS, ~$0.004 a line,
   rendered once and shared), offline, no model at runtime. A few days: sentence items in the
   packs, their audio, the response variant in session.tsx.
2. *Typed reply, model-graded.* The other side stays scripted and pre-voiced; the learner types
   freely and a small model judges the reply and corrects it. Under a cent per dialogue, online
   only, Plus. The learner produces language, the path stays fixed. About two weeks with (1).
3. *Live conversation.* The model plays the other side and answers whatever the learner writes;
   its lines voiced on the fly. $0.05–0.20 per conversation, online only, Plus only, capped per
   day through the existing budget gate. Two to three weeks. The only one that can honestly be
   called "a conversation" in the store.

Ruled out: tile-built scripted dialogues (a drill in a dialogue costume, Ralph: "then it's fake")
and on-device TTS as the voice (Ralph: "sounds bad"; it stays the fallback while a pack downloads).
Spoken input (speech recognition) is not on the list until there is a reason.

**Why:** the ads sell "ordering breakfast in Italy"; the app drills words. Sentence listening
and a graded reply are the shortest path from the promise to the product.

**Open questions:** a second voice for the other speaker (everything is one voice today);
whether (2) is gated per day; the label in the app ("practise a dialogue" vs "conversation").

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
