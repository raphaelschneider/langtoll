# App Review notes — paste into App Store Connect "Notes for Review"

Draft for the LangPass 1.0 submission. Family Controls apps draw extra scrutiny,
and the two questions reviewers reliably ask are *why do you need this
entitlement* and *how do I reproduce the behaviour*. Both are answered up front.

---

## Notes for Review (paste below this line)

**No account or login is required.** LangPass has no sign-in of any kind — there
is no username, email, or password to provide. The app works immediately on
launch. Users are identified only by an anonymous per-device identifier.

**Why this app uses Family Controls (Screen Time)**

LangPass is a self-control tool. Its single purpose is to let a user put their
own distracting apps behind a language-learning exercise: to reopen the app they
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

**How to reproduce the core flow**

1. Launch the app and complete onboarding (name, language, level). Onboarding
   can be completed in under a minute.
2. At the "choose your apps" step, grant Screen Time authorization when prompted
   and select at least one app to lock.
3. Finish onboarding. The home screen shows an expired pass.
4. Tap **Practice**. Complete the short session (5 exercises by default).
5. On completion the pass is issued and the selected apps unlock for 30 minutes.
   Opening a locked app before this point shows the Screen Time shield.
6. After 30 minutes the apps re-lock automatically, without the user needing to
   reopen LangPass.

**Please note:** the Screen Time shield cannot function in the iOS Simulator —
Family Controls is only active on physical hardware. Reviewing this flow requires
a physical device.

**In-app purchases**

LangPass Plus is an auto-renewing subscription, offered weekly, monthly or
yearly. The monthly and yearly plans include a 7-day free trial; the weekly plan
does not. The free tier is fully functional: the lock, the practice sessions,
and all six language courses are available without paying. Plus adds the ability
to lock multiple apps and whole categories, tuning of the fare and unlock
duration, strict mode, the full set of exercise types, AI-generated topic packs,
and spoken audio.

**Languages**

The app teaches English, German, Spanish, French, Italian and Brazilian
Portuguese, with the interface available in all six.

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
