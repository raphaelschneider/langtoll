# App Review notes — paste into App Store Connect "Notes for Review"

Draft for the LangToll 1.0 submission. Family Controls apps draw extra scrutiny,
and the two questions reviewers reliably ask are *why do you need this
entitlement* and *how do I reproduce the behaviour*. Both are answered up front.

---

## Notes for Review (paste below this line)

**No account or login is required.** LangToll has no sign-in of any kind — there
is no username, email, or password to provide. The app works immediately on
launch. Users are identified only by an anonymous per-device identifier.

**Why this app uses Family Controls (Screen Time)**

LangToll is a self-control tool. Its single purpose is to let a user put their
own distracting apps behind a language-learning exercise: to reopen an app they
chose to block, they must first complete a short practice session. The Screen
Time shield is the core mechanism of the product, not an ancillary feature.

Specifically:

- Authorization is requested as `.individual` — this is an adult applying a
  restriction to their own device. It is not a parental-control or
  child-supervision product, and it never manages another person's device.
- The user selects which apps to block themselves, using Apple's own
  `FamilyActivityPicker`. We never see, request, or store the identity of the
  selected apps — Family Controls keeps that selection opaque to us by design,
  and we only ever read the *count* of selected items in order to apply the free
  tier's one-app limit.
- No information about the user's app usage or selections leaves the device.
- The user can remove the shield at any time by clearing their selection in
  Settings, revoking Screen Time authorization in iOS Settings, or deleting the
  app.

**How to reproduce the core flow (physical device required)**

1. Launch the app and complete onboarding (name, language, level, fare). Every
   step can be skipped; the whole flow takes under a minute. The paywall is the
   last step — "Skip" is in the top-right corner.
2. At the "lock" step, grant Screen Time authorization when prompted and select
   at least one app in the picker. A notification permission prompt follows
   (see "Notifications" below).
3. Finish onboarding. The home screen shows an expired pass.
4. Tap **Practice to unlock**. Complete the short session (5 multiple-choice
   exercises by default).
5. On completion the pass is issued and the selected apps unlock for 30 minutes.
   Opening a locked app before this point shows the Screen Time shield.
6. After 30 minutes the apps re-lock automatically, without the user needing to
   reopen LangToll.

**Please note:** the Screen Time shield cannot function in the iOS Simulator —
Family Controls is only active on physical hardware.

**Notifications and the shield button**

The Screen Time shield shows a "Practice now" button. A shield extension cannot
open its app, so that button posts a local notification which, when tapped,
opens LangToll — this is why notification permission is requested during
onboarding. Other local notifications: an optional daily reminder at the hour
the user chose in onboarding, a notice when a pass expires, and a one-time
notice the day before a cancelled trial ends if the user's fare would change.
No remote push is used.

**Live Activities**

While a pass is active, a Live Activity shows the remaining time on the Lock
Screen and rotates vocabulary (word and translation) in the Dynamic Island.
It ends automatically when the pass expires.

**In-app purchases**

LangToll Plus is an auto-renewing subscription, offered weekly, monthly or
yearly. The monthly and yearly plans include a 7-day free trial; the weekly plan
does not. The free tier is fully functional: the lock, practice sessions and all
six language courses work without paying. Free locks a single app, trains the
complete A1 course with multiple-choice exercises, chooses between the stricter
fares (5 or 8 exercises for 15 or 30 minutes), and shows the pass countdown on
the Lock Screen. Plus adds: the A2 to B2 levels; vocabulary on the Dynamic
Island and translations on the Lock Screen; unlimited apps, whole categories and
websites; any fare (down to 3 exercises, up to 60 minutes); strict mode; typed,
sentence-building and listening exercises; spoken audio in a native voice; and
AI-generated topic packs. Purchases go through StoreKit via RevenueCat; Restore
Purchases is on the same screen.

**AI topic packs (Plus)**

The user types a topic (e.g. "ordering brunch") and the app requests a set of
vocabulary and example sentences for it from our server. Output is language-
learning content only (words, translations, sentences) and is reviewed by the
app for format before use. No personal data is sent — only the topic text, the
course language and the CEFR level.

**Languages**

The app teaches English, German, Spanish, French, Italian and Portuguese, with
the interface available in all six.

**What changed in this build (resubmission)**

This build addresses both issues raised in the previous review.

*Guideline 4 — iPad layout.* The app now supports iPad as a first-class device
rather than running in iPhone compatibility mode. Every screen has a capped,
centred content column, so text, buttons and the pass card keep a readable size
instead of stretching the full width of the display, and the type scale steps up
at iPad width. The home screen uses a two-pane layout whenever the window is
wide enough, with the pass beside the wallet, the route and the most recently
collected words. Actions sit with the content they belong to rather than pinned
to the bottom edge, which on a large tablet is the longest reach. All four
orientations are supported on iPad, and the layout responds to live window
resizing (Split View, Slide Over and the iPadOS 26 resizable window) rather than
reading a size once at launch.

*Guideline 4.2.3(ii) — additional downloads.* The previous build pre-downloaded
a whole course's pronunciation audio during onboarding and disabled the final
button until it finished. That step is gone. Pronunciation audio is now fetched
one short clip at a time, as each individual exercise needs it — roughly 30 KB
per word or sentence — in the same way any app loads the media for the screen
the user is currently on. There is no resource pack, no unpacking step, and
nothing the user has to wait behind: if a clip has not arrived, the app speaks
that word with the on-device system voice and carries on. The app is fully
usable, including offline, without downloading anything beyond itself.

---

## Internal checklist — do not paste

- [ ] Confirm the free-tier app limit copy matches `FREE_MAX_APPS` before submitting.
- [ ] If review asks for a demo video, record the onboarding → practice → unlock →
      re-lock loop on device; the simulator cannot show the shield.
- [ ] Export compliance: the app uses only standard HTTPS. Answer the encryption
      question accordingly (exempt).
- [ ] App Privacy: declare the anonymous device identifier and telemetry. No
      app-usage or app-selection data is collected — Family Controls selections
      never leave the device.
- [x] **iPad screenshots.** DONE 2026-09-10 — six composed shots at 2064x2752 in
      `store/screenshots/ipad-13/`, one language each, same treatment as the
      iPhone set (`marketing/appstore/store_shots.py --canvas ipad`).
- [ ] Check the iPad build on a physical iPad if one is available: Family
      Controls and the shield behave the same as on iPhone, but the simulator
      cannot exercise either.
