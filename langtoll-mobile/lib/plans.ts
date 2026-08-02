// Subscription tiers + the feature gates. The whole app gates off isPlus();
// the actual StoreKit purchases live in ./purchases (RevenueCat), which mirrors
// the live entitlement into the store via applyEntitlement.
//
// Free-tier philosophy: the lock itself is free forever (the core promise —
// practice to unlock always works). Plus unlocks the levers: custom fares,
// strict mode, the full curriculum, AI topic packs, and new languages.
import { isPlus as storeIsPlus, getState } from './store';

export type Period = 'weekly' | 'monthly' | 'yearly';

export const PLUS_ENTITLEMENT = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT ?? 'plus';

// Product identifiers configured in App Store Connect + RevenueCat.
// These MUST equal the Product IDs in App Store Connect verbatim — lib/purchases
// maps a RevenueCat package to a Period via product.identifier, and an unknown id
// is dropped silently: the paywall then falls back to mock prices that look
// identical to the real ones while every purchase returns an error. Product IDs
// cannot be renamed after creation, so this constant follows the store, not the
// other way round.
export const PRODUCT_IDS = {
  weekly: 'weekly',
  monthly: 'monthly',
  yearly: 'yearly',
} as const;

export const PLUS_FEATURES = [
  { icon: 'apps-outline', title: 'Lock your whole world', detail: 'Block unlimited apps, entire categories, and websites — free locks a single app' },
  { icon: 'options-outline', title: 'Your lock, your rules', detail: 'Tune the fare and how long apps stay open — free stays on the standard setting' },
  { icon: 'flame-outline', title: 'Strict mode', detail: 'No skips, no mercy: the phone stays locked until you finish the session' },
  { icon: 'school-outline', title: 'The full curriculum', detail: 'Typed answers, sentence building, listening and harder levels — free trains multiple choice' },
  { icon: 'sparkles-outline', title: 'AI topic packs', detail: 'Generate vocabulary for your world — brunch orders, match-day slang, anything' },
  // Sells canUseAudio(), which is a real gate. The bullet here used to promise
  // early access to new languages — but all six packs ship to everyone and there
  // is no language gate anywhere, so Plus could not deliver it.
  { icon: 'volume-high-outline', title: 'The voice', detail: 'Hear every word and sentence in a studio-tuned native voice — free practises in text' },
] as const;

// Fallback prices shown only until RevenueCat loads the real localized store price.
// These are the US anchors decided for launch (see also PRODUCT_IDS).
// FALLBACK ONLY. The App Store is the source of truth for every price the user
// sees: real packages carry the store's own localized priceString, numeric
// amount and currency code (see purchases.ts). These amounts exist so the mock
// path — Expo Go, simulator, no key — can run the SAME derivation as the live
// path rather than a parallel one that drifts.
//
// Nothing derived lives here any more. Per-month equivalents, savings badges and
// period labels used to be frozen strings ('Save 58%', '≈ $3.33/mo', 'per week')
// rendered beside the real localized price — so a German user saw "€39,99" with
// "≈ $3.33/mo" under it. All of that is now computed from the store, in the
// store's currency, and the period wording comes from the locale catalogues.
//
// The tiers themselves: $3.99/wk is ≈$17.28/mo, deliberately 2.2× monthly so the
// entry tier cannot undercut it. Weekly carries no intro offer — that decision
// lives in App Store Connect, and trialDays reads it back per product.
export const FALLBACK_PRICES: Record<Period, { amount: number; currency: string }> = {
  weekly: { amount: 3.99, currency: 'USD' },
  monthly: { amount: 7.99, currency: 'USD' },
  yearly: { amount: 39.99, currency: 'USD' },
};

/** Free trial length surfaced in copy (the actual intro offer is configured in App Store Connect). */
export const TRIAL_DAYS = 7;

export function isPlus(): boolean {
  return storeIsPlus();
}

/** Honeymoon length — the "first week is the full experience" promise in ob.payPrice. */
export const HONEYMOON_DAYS = TRIAL_DAYS;

/**
 * True while the user is inside the honeymoon window: the grace period after
 * first launch where everything is unlocked, ending in the convert-or-downgrade
 * decision. Measured from firstLaunchAt, NOT from a purchase or a paywall view,
 * so it starts when the user arrives.
 *
 * A missing firstLaunchAt means hydrate() hasn't run yet; we return false rather
 * than guessing, so a race can only ever under-grant (a locked button that
 * unlocks a moment later), never hand out a perk the user hasn't got.
 */
export function withinHoneymoon(): boolean {
  const at = getState().firstLaunchAt;
  if (!at) return false;
  const started = Date.parse(at);
  if (Number.isNaN(started)) return false;
  return Date.now() - started < HONEYMOON_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * Audio is a Honeymoon + Plus perk. Free users see the controls in a locked
 * state (the paywall entry point) rather than not at all — see session.tsx and
 * settings.tsx. This also gates whether the trainer may generate 'listen'
 * exercises at all: without audio they are unanswerable, so buildSession must
 * be told, not just the playback layer.
 */
export function canUseAudio(): boolean {
  return isPlus() || withinHoneymoon();
}

// ── free-tier limits ────────────────────────────────────────────────────────

/** Free default lock settings — what the levers snap back to for free users.
 *  NOTE: the 30-minute unlock is deliberately the SAME for free and Plus — time is not a
 *  monetization lever (a shorter free reward only drives off the users who wanted the lock).
 *  Conversion comes from SCOPE (how much you can block) and POWER (strict mode, custom fares,
 *  curriculum, AI), never from degrading the core loop. */
export const FREE_EXERCISES_PER_UNLOCK = 5;
export const FREE_UNLOCK_MINUTES = 30;

// ── how much you can block (the primary lever) ───────────────────────────────
// Free locks a single app. Plus unlocks unlimited apps, whole categories, and websites.
// Family Controls keeps the selection opaque (we never learn WHICH apps), but the picker
// reports counts — enough to gate on. Categories/web are Plus-only because one category
// ("Social") would otherwise blow past a 1-app limit.
export const FREE_MAX_APPS = 1;

export interface SelectionCounts {
  applicationCount: number;
  categoryCount: number;
  webDomainCount: number;
}

/** True when a free user's selection exceeds what the free tier may lock (Plus = always allowed). */
export function selectionExceedsFreeLimit(c: SelectionCounts, plus: boolean): boolean {
  if (plus) return false;
  return c.applicationCount > FREE_MAX_APPS || c.categoryCount > 0 || c.webDomainCount > 0;
}

/** Custom fare (exercise count / unlock duration / strict mode) is Plus. */
export function canCustomizeLock(): boolean {
  return isPlus();
}

/** Strict mode (no skipping the session) is Plus. */
export function canUseStrictMode(): boolean {
  return isPlus();
}

/** Typed / sentence-building / listening drills are Plus; free trains multiple choice. */
export function canUseFullCurriculum(): boolean {
  return isPlus();
}

/** AI topic packs are Plus. */
export function canUseAiTopics(): boolean {
  return isPlus();
}
