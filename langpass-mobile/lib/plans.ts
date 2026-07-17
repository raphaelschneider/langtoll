// Subscription tiers + the feature gates. The whole app gates off isPlus();
// the actual StoreKit purchases live in ./purchases (RevenueCat), which mirrors
// the live entitlement into the store via applyEntitlement.
//
// Free-tier philosophy: the lock itself is free forever (the core promise —
// practice to unlock always works). Plus unlocks the levers: custom fares,
// strict mode, the full curriculum, AI topic packs, and new languages.
import { isPlus as storeIsPlus } from './store';

export type Period = 'monthly' | 'yearly';

export const PLUS_ENTITLEMENT = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT ?? 'plus';

// Product identifiers configured in App Store Connect + RevenueCat.
export const PRODUCT_IDS = {
  monthly: 'langpass_plus_monthly',
  yearly: 'langpass_plus_yearly',
} as const;

export const PLUS_FEATURES = [
  { icon: 'apps-outline', title: 'Lock your whole world', detail: 'Block unlimited apps, entire categories, and websites — free locks a single app' },
  { icon: 'options-outline', title: 'Your lock, your rules', detail: 'Tune the fare and how long apps stay open — free stays on the standard setting' },
  { icon: 'flame-outline', title: 'Strict mode', detail: 'No skips, no mercy: the phone stays locked until you finish the session' },
  { icon: 'school-outline', title: 'The full curriculum', detail: 'Typed answers, sentence building, listening and harder levels — free trains multiple choice' },
  { icon: 'sparkles-outline', title: 'AI topic packs', detail: 'Generate vocabulary for your world — brunch orders, match-day slang, anything' },
  { icon: 'language-outline', title: 'Every language we add', detail: 'German today — Spanish and French land in Plus first' },
] as const;

// Fallback prices shown only until RevenueCat loads the real localized store price.
// These are the US anchors decided for launch (see also PRODUCT_IDS).
export const PRICES: Record<Period, { label: string; price: string; note?: string; perMonth?: string; sub?: string }> = {
  monthly: { label: 'Monthly', price: '$7.99', sub: 'per month' },
  yearly: { label: 'Yearly', price: '$39.99', sub: 'per year', note: 'Save 58%', perMonth: '≈ $3.33/mo' },
};

/** Free trial length surfaced in copy (the actual intro offer is configured in App Store Connect). */
export const TRIAL_DAYS = 7;

export function isPlus(): boolean {
  return storeIsPlus();
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
