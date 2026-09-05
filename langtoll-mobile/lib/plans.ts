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
  weekly: 'langtoll_plus_weekly',
  monthly: 'langtoll_plus_monthly',
  yearly: 'langtoll_plus_yearly',
} as const;

export const PLUS_FEATURES = [
  { icon: 'apps-outline', title: 'Lock your whole world', detail: 'Block unlimited apps, entire categories, and websites — free locks a single app' },
  { icon: 'options-outline', title: 'Your lock, your rules', detail: 'Set any fare — fewer exercises, longer unlocks, your call. Free keeps the stricter fares' },
  { icon: 'flame-outline', title: 'Strict mode', detail: 'Zero grace: the shield lands the instant your pass expires' },
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

/**
 * Audio is a Plus perk. Free users see the controls in a locked
 * state (the paywall entry point) rather than not at all — see session.tsx and
 * settings.tsx. This also gates whether the trainer may generate 'listen'
 * exercises at all: without audio they are unanswerable, so buildSession must
 * be told, not just the playback layer.
 */
export function canUseAudio(): boolean {
  return isPlus();
}

// ── free-tier limits ────────────────────────────────────────────────────────

/** Free default lock settings — what an out-of-range fare snaps back to for free users.
 *  The default fare is the SAME for free and Plus: nobody who never touches the dials
 *  meets a gate. Conversion comes from SCOPE (how much you can block), POWER (strict
 *  mode, curriculum, AI) and FLEXIBILITY (any fare), never from degrading the core loop. */
export const FREE_EXERCISES_PER_UNLOCK = 5;
export const FREE_UNLOCK_MINUTES = 30;

/**
 * The fare rule (founder call, 2026-09-05): FREE CAN MAKE IT HARDER, ONLY PLUS
 * CAN MAKE IT EASIER. A stricter lock costs nothing and makes better learners,
 * so it is never behind a wall; leniency — a longer scroll for a shorter
 * session — is what Plus sells, and nobody resents paying for it because the
 * fair default was always available. These lists are the free-tier choices;
 * both contain the defaults above, as they must.
 */
export const FREE_FARE_EXERCISES: readonly number[] = [5, 8];
export const FREE_FARE_MINUTES: readonly number[] = [15, 30];

/**
 * The fare a user may choose: how many exercises buy how many minutes.
 *
 * Both lists lived as frozen copies in settings.tsx AND onboarding.tsx, so the
 * two screens could silently offer different fares. They belong here, beside
 * the free defaults they must always contain — FREE_EXERCISES_PER_UNLOCK and
 * FREE_UNLOCK_MINUTES are members of these lists, not independent numbers.
 *
 * 10 minutes is a deliberate floor: shorter than a session takes to earn, and
 * the trade stops feeling worth it. 60 is the ceiling for the same reason in
 * reverse — an hour of unlocked phone for five exercises is barely a lock.
 */
export const FARE_EXERCISES = [3, 5, 8] as const;

// Minutes are dragged, not picked from chips, so they are a RANGE rather than a
// list — every 5-minute stop from 10 to 60. FREE_UNLOCK_MINUTES (30) sits on the
// grid, as any default must, or a free user could never return to it.
export const FARE_MINUTES_MIN = 10;
export const FARE_MINUTES_MAX = 60;
export const FARE_MINUTES_STEP = 5;

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

// There is no free preview window: Plus is the 7-day App Store trial and
// nothing else (founder call, 2026-09-05 — the earlier "honeymoon" week is gone).

/** The FULL fare range (any exercise count, any duration) is Plus. */
export function canCustomizeLock(): boolean {
  return isPlus();
}

/** Strict mode (re-lock with zero grace) is Plus. */
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

/** What a stored fare becomes on the free tier: itself if free may choose it, else the default. */
export function freeExercises(n: number): number {
  return FREE_FARE_EXERCISES.includes(n) ? n : FREE_EXERCISES_PER_UNLOCK;
}
export function freeMinutes(n: number): number {
  return FREE_FARE_MINUTES.includes(n) ? n : FREE_UNLOCK_MINUTES;
}

/**
 * The fare that actually applies, derived at READ time rather than snapped
 * back on downgrade: a lapsed subscriber's stored custom fare stays put (so
 * resubscribing restores it) but stops applying the moment the entitlement
 * lapses — it falls to the nearest free choice. Everything that grants,
 * displays or builds sessions reads these, never the raw store fields.
 */
export function effectiveExercisesPerUnlock(): number {
  const n = getState().exercisesPerUnlock;
  return canCustomizeLock() ? n : freeExercises(n);
}

export function effectiveUnlockMinutes(): number {
  const n = getState().unlockMinutes;
  return canCustomizeLock() ? n : freeMinutes(n);
}

/**
 * True when the fare the user is running on needs Plus — i.e. losing Plus
 * would change it. Drives the trial-end warning: the one thing a lapsing
 * subscriber must hear before it happens, not after (founder call).
 */
export function fareWillRevert(): boolean {
  const s = getState();
  return isPlus() && (freeExercises(s.exercisesPerUnlock) !== s.exercisesPerUnlock || freeMinutes(s.unlockMinutes) !== s.unlockMinutes);
}

/** Strict mode as it actually applies — the toggle only bites while entitled. */
export function strictModeActive(): boolean {
  return canUseStrictMode() && getState().strictMode;
}

// Speaker-gendered form examples per learnable language — drives BOTH whether
// the "which forms?" question appears at all (null = the language has no
// meaningful speaker agreement; German learners never see it) and which words
// illustrate it. A Portuguese example in front of a German learner was the bug
// that created this table.
export const SPEAKER_FORM_EXAMPLES: Record<string, { m: string; f: string } | null> = {
  pt: { m: 'obrigado', f: 'obrigada' },
  es: { m: 'encantado', f: 'encantada' },
  fr: { m: 'désolé', f: 'désolée' },
  it: { m: 'stanco', f: 'stanca' },
  de: null,
  en: null,
};
