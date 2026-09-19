# Apple Ads — campaign plan (v1, 2026-09-19)

Apple Ads **Advanced** (keyword control). Metric that matters: **cost per trial**
(the onboarding paywall has no skip, so an install without a trial is worth nothing).
Attribution: `enableAdServicesAttributionTokenCollection()` in `lib/purchases.ts`
+ RevenueCat → Integrations → Apple Search Ads must be switched on.

Storefronts to start: **US, UK**. Next: DE, ES, FR, IT, BR with the localized
keyword sets from `appstore-metadata.md`.

Bidding on competitor brand names is allowed in Apple Ads. They stay banned in the
App Store keyword field and in ad text.

Each block below is paste-ready (one keyword per line) for the "Add keywords" box.

---

## 1. Brand — exact, lowest bids
```
langtoll
lang toll
```

## 2. Screen time — exact, main budget
Custom product page: **screen-time CPP** (shield, Tolly on watch, "Your doomscroll finally pays rent").
```
app blocker
block apps
screen time
reduce screen time
screen time limit
stop doomscrolling
doomscrolling
phone addiction
social media blocker
tiktok blocker
instagram blocker
digital detox
dopamine detox
focus app
```

## 3. Competitors — exact, capped daily budget
Ad group A (screen-time apps, screen-time CPP):
```
opal
one sec
screenzen
jomo
clearspace
brick
appblock
forest
lingolock
```
Ad group B (language apps, language CPP; short trial, cut if cost per trial is bad):
```
duolingo
babbel
busuu
memrise
drops
```

## 4. Language — exact, below screen-time bids
Custom product page: **default gallery** (one language per shot).
```
spanish vocabulary
german vocabulary
french vocabulary
italian vocabulary
portuguese vocabulary
vocabulary builder
learn spanish
learn german
learn french
learn italian
learn portuguese
```

## 5. Discovery — broad match + Search Match, low bids
Broad-match seeds: `app blocker`, `screen time`, `learn language`, `vocabulary`.
**Negatives (exact):** every keyword from campaigns 1–4, so the campaigns don't bid against each other.
Weekly: move search terms that produce trials into their campaign as exact, and add them here as negatives.

---

## Review cadence
- Run 7–10 days at a small daily budget before judging anything.
- Then compare cost per trial per campaign and shift budget to the winner.
- Pause any keyword with ~50+ taps and zero trials.
