# Subscription setup — App Store Connect

One auto-renewable group, three durations. Paste the fields below into each
subscription's **App Store Localization** and **Review Notes**.

**Review screenshot** (required per subscription): `store/review/paywall-review-screenshot.png`
— the same image serves all three; it shows every product, its price, duration and
trial terms in one frame, which is what a reviewer needs to see.

---

## Subscription group

| Field | Value |
|---|---|
| Reference Name (internal) | `LangToll Plus` |
| Group Display Name (user-facing) | `LangToll Plus` |

---

## Localization — English (U.S.)

Display Name is capped at **35** characters, Description at **55**. Counts shown
so nothing gets rejected at save time. IAP display names are indexed for App Store
search, which is why "Languages" earns its place; the app name is not repeated —
it already appears above the product in the purchase sheet.

| Product | Display Name (≤35) | Description (≤55) |
|---|---|---|
| `yearly` | `Plus Yearly — All Languages` (27) | `All languages, unlimited locks, strict mode.` (44) |
| `monthly` | `Plus Monthly — All Languages` (28) | `All languages, unlimited locks, strict mode.` (44) |
| `weekly` | `Plus Weekly — All Languages` (27) | `All languages, unlimited locks, strict mode.` (44) |

---

## Review Notes — paste per subscription

Reviewers reliably ask two things about a subscription: *where is it in the app*
and *what does it add*. Both are answered before they have to look. The tier line
is the only part that changes between the three.

### Common block (all three)

```
No account, login, email or password is required — the app works immediately on
launch and users are identified only by an anonymous per-device identifier.

HOW TO REACH THIS SUBSCRIPTION
1. Launch LangToll and complete the short onboarding (any answers are fine).
   The paywall is shown as the final onboarding step.
2. Or at any time: home screen -> gear icon (top right) -> Plan -> "Upgrade to
   Plus". Both routes open the same screen shown in the review screenshot.

WHAT IT UNLOCKS
LangToll puts the user's own distracting apps behind a language exercise. That
core loop is FREE FOREVER and is not gated by this subscription. Plus adds:
blocking unlimited apps, whole categories and websites (free blocks a single
app); custom fare and unlock duration; strict mode; AI-generated topic packs;
and every language we add.

Purchases are processed through StoreKit via RevenueCat. "Restore" is available
on the same screen. Prices shown in the screenshot are US storefront values.
```

### Tier line — append to the block above

| Product | Line to append |
|---|---|
| yearly | `THIS PRODUCT: the yearly option, $39.99/year, with a 7-day free trial. It is the default selection on the screen.` |
| monthly | `THIS PRODUCT: the monthly option, $7.99/month, with a 7-day free trial.` |
| weekly | `THIS PRODUCT: the weekly option, $3.99/week. It carries NO free trial — the card states "No free trial - billed today" permanently, so a buyer sees this before selecting it.` |

---

## Cross-check before submitting

- Prices here must match `langtoll-mobile/lib/plans.ts` (FALLBACK_PRICES) and the
  products configured in RevenueCat: weekly $3.99 / monthly $7.99 / yearly $39.99.
- Trial: 7 days on monthly + yearly only. Weekly deliberately has none — weekly is
  priced at 2.2x monthly so it cannot cannibalise the monthly plan.
- The entitlement identifier is `plus` in RevenueCat; the app reads that alone.
