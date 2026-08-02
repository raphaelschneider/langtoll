// RevenueCat integration, behind the entitlement seam (applyEntitlement in the store).
//
// Graceful by design: with no API key (Expo Go, simulator, or a build where the
// native pod isn't linked), every call falls back to a local MOCK using the
// default PRICES — so the whole purchase → Plus flow is testable without a store.
// Flip to live by setting EXPO_PUBLIC_REVENUECAT_IOS_KEY and building the dev client.
//
// Live entitlement is the point: one customer-info listener mirrors RevenueCat's
// `plus` entitlement into the store, so renewals, cancellations and EXPIRY all
// flow through automatically.
import { Platform } from 'react-native';
import { applyEntitlement } from './store';
import { track } from './telemetry';
import { PLUS_ENTITLEMENT, PRODUCT_IDS, FALLBACK_PRICES, TRIAL_DAYS, type Period } from './plans';

const RC_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';

// The mock GRANTS PLUS FOR FREE. That is correct in dev and catastrophic in a
// shipped build: with no key, purchasesEnabled() is false, so every user would
// silently receive Plus and no purchase would ever reach Apple. Nothing in the
// simulator surfaces this — the paywall renders identically either way.
//
// So the mock is allowed ONLY where dev tooling is: __DEV__, or a Release build
// explicitly flagged with EXPO_PUBLIC_DEV_TOOLS=1 (the on-device test builds).
// A real production build has neither, so it cannot mock — it fails loudly instead.
const MOCK_ALLOWED = __DEV__ || process.env.EXPO_PUBLIC_DEV_TOOLS === '1';

/** True when a release build is missing its key — purchases are impossible. */
export function purchasesMisconfigured(): boolean {
  return !MOCK_ALLOWED && !purchasesEnabled();
}

/** A normalized package the paywall renders, whether from the store or the mock. */
export interface PlusPackage {
  period: Period;
  /** Localized price string, formatted by the store itself. */
  priceString: string;
  /** Numeric price, in `currency`. Everything derived is computed from this. */
  amount: number;
  /** ISO currency code the store charges in — never assumed to be USD. */
  currency: string;
  /** RevenueCat package object to purchase (null in mock mode). */
  raw: any | null;
  /** True if this package carries an introductory free trial. */
  hasTrial: boolean;
  /** Length of that trial in days, read from the store's intro offer. 0 if none. */
  trialDays: number;
}

/**
 * Format an amount in the store's own currency. Intl is available in Hermes on
 * iOS; the catch is a guard, not an expected path, and falls back to the store's
 * formatting conventions rather than inventing a "$".
 */
export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

/**
 * Trial length from a StoreKit intro offer. Only a genuinely free offer counts —
 * a discounted-but-paid intro price is not a trial and must not be sold as one.
 */
function introTrialDays(introPrice: any): number {
  if (!introPrice || introPrice.price !== 0) return 0;
  const n = introPrice.periodNumberOfUnits ?? 0;
  switch (introPrice.periodUnit) {
    case 'DAY':
      return n;
    case 'WEEK':
      return n * 7;
    case 'MONTH':
      return n * 30;
    case 'YEAR':
      return n * 365;
    default:
      return 0;
  }
}

/** Months billed per period — the divisor for a per-month equivalent. */
const MONTHS_PER_PERIOD: Record<Period, number> = {
  weekly: 12 / 52,
  monthly: 1,
  yearly: 12,
};

/**
 * Per-month equivalent, in the store's currency — yearly only.
 *
 * Monthly's own price is already its monthly cost, so the line would be noise.
 * Weekly's equivalent is ≈4.3× its sticker price, which makes the entry tier
 * read as expensive; that figure is true, but it isn't one we volunteer. The
 * amount billed and the period it covers stay fully disclosed on every card
 * either way — this only decides which derived comparison we surface.
 */
export function perMonthEquivalent(p: PlusPackage): string | null {
  if (p.period !== 'yearly' || p.amount <= 0) return null;
  return formatMoney(p.amount / MONTHS_PER_PERIOD.yearly, p.currency);
}

/**
 * Percentage saved against the monthly plan, annualized. Returns null rather
 * than a wrong number when it cannot be computed honestly: no monthly package to
 * compare with, mismatched currencies, or no actual saving.
 */
export function savingsVsMonthly(p: PlusPackage, all: PlusPackage[]): number | null {
  const monthly = all.find((x) => x.period === 'monthly');
  if (!monthly || monthly.amount <= 0 || p.amount <= 0) return null;
  if (monthly.currency !== p.currency) return null;
  const perMonth = p.amount / MONTHS_PER_PERIOD[p.period];
  const pct = Math.round((1 - perMonth / monthly.amount) * 100);
  return pct > 0 ? pct : null;
}

/** Live only when a real key is set on a native platform — otherwise mock. */
export function purchasesEnabled(): boolean {
  return !!RC_API_KEY && Platform.OS !== 'web' && !!nativeModule();
}

// Lazy require so the native module is never touched when disabled (Expo Go, web).
function nativeModule(): any | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-purchases');
  } catch {
    return null;
  }
}
function rc(): any {
  return nativeModule()?.default;
}

function isPlusActive(info: any): boolean {
  return !!info?.entitlements?.active?.[PLUS_ENTITLEMENT];
}

// Keyed on the STORE product identifier. The App Store ids are the langtoll_plus_*
// ones; RevenueCat's Test Store products for the same packages are named plainly
// (monthly/yearly/weekly), and a package can carry both. Accept either, because an
// unmatched identifier is dropped silently and the paywall then shows mock prices
// that look real while every purchase fails — which is exactly what shipped in
// TestFlight build 2 after these ids were "corrected" to the Test Store names.
const PERIOD_BY_PRODUCT: Record<string, Period> = {
  [PRODUCT_IDS.weekly]: 'weekly',
  [PRODUCT_IDS.monthly]: 'monthly',
  [PRODUCT_IDS.yearly]: 'yearly',
  weekly: 'weekly',
  monthly: 'monthly',
  yearly: 'yearly',
};

let configured = false;

/** Configure RevenueCat once at launch + register the live entitlement listener. No-op in mock. */
export async function configurePurchases(): Promise<void> {
  if (!purchasesEnabled() || configured) return;
  try {
    const Purchases = rc();
    const mod = nativeModule();
    if (__DEV__ && mod?.LOG_LEVEL) {
      try {
        Purchases.setLogLevel(mod.LOG_LEVEL.VERBOSE);
      } catch {
        // logging is best-effort
      }
    }
    Purchases.configure({ apiKey: RC_API_KEY });
    configured = true;
    Purchases.addCustomerInfoUpdateListener((info: any) => applyEntitlement(isPlusActive(info)));
    await syncEntitlement();
  } catch {
    // bad key / pod not linked — stay on mock; rebuild to enable
  }
}

/** Read the current entitlement and mirror it into the store. */
export async function syncEntitlement(): Promise<void> {
  if (!purchasesEnabled()) return;
  try {
    applyEntitlement(isPlusActive(await rc().getCustomerInfo()));
  } catch {
    // offline / not configured — keep last known plan
  }
}

/** The purchasable packages for the paywall — live from the store, or the mock. */
export async function getPackages(): Promise<PlusPackage[]> {
  if (purchasesEnabled()) {
    try {
      const offerings = await rc().getOfferings();
      const pkgs: any[] = offerings?.current?.availablePackages ?? [];
      const mapped = pkgs
        .map((p) => {
          const id = p?.product?.identifier ?? '';
          const period = PERIOD_BY_PRODUCT[id];
          if (!period) return null;
          const product = p?.product ?? {};
          const fallback = FALLBACK_PRICES[period];
          const amount = typeof product.price === 'number' ? product.price : fallback.amount;
          const currency = product.currencyCode ?? fallback.currency;
          const trialDays = introTrialDays(product.introPrice);
          return {
            period,
            priceString: product.priceString ?? formatMoney(amount, currency),
            amount,
            currency,
            raw: p,
            hasTrial: trialDays > 0,
            trialDays,
          } as PlusPackage;
        })
        .filter(Boolean) as PlusPackage[];
      if (mapped.length) return sortPackages(mapped);
    } catch {
      // fall through to mock
    }
  }
  return mockPackages();
}

function sortPackages(pkgs: PlusPackage[]): PlusPackage[] {
  // Best value first: yearly anchors, weekly sits last as the entry point.
  const order: Period[] = ['yearly', 'monthly', 'weekly'];
  return [...pkgs].sort((a, b) => order.indexOf(a.period) - order.indexOf(b.period));
}

// The mock runs the same derivation as the live path — it only substitutes the
// source of the numbers. Weekly carries no trial here either, mirroring the
// intro offers configured in App Store Connect.
function mockPackages(): PlusPackage[] {
  return sortPackages(
    (['yearly', 'monthly', 'weekly'] as Period[]).map((period) => {
      const { amount, currency } = FALLBACK_PRICES[period];
      const trialDays = period === 'weekly' ? 0 : TRIAL_DAYS;
      return {
        period,
        priceString: formatMoney(amount, currency),
        amount,
        currency,
        raw: null,
        hasTrial: trialDays > 0,
        trialDays,
      };
    })
  );
}

export type PurchaseResult = 'purchased' | 'cancelled' | 'error';

/**
 * Why the last purchase failed, in the store's own words. The paywall shows a
 * human sentence; this is appended so a failure is DIAGNOSABLE from a TestFlight
 * screenshot instead of requiring a debugger. StoreKit's reasons are things like
 * "product not available", "not allowed to make payments", "agreement missing" —
 * each pointing somewhere completely different.
 */
let lastError: string | null = null;
export function lastPurchaseError(): string | null {
  return lastError;
}

/** Buy a package. In mock mode, immediately grants Plus so the flow is testable. */
export async function purchase(pkg: PlusPackage): Promise<PurchaseResult> {
  track('purchase_tapped', { period: pkg.period });
  lastError = null;
  if (!purchasesEnabled() || !pkg.raw) {
    // Never hand out Plus in a build that isn't dev tooling — see MOCK_ALLOWED.
    if (!MOCK_ALLOWED) {
      lastError = !purchasesEnabled()
        ? 'RevenueCat not configured in this build'
        : 'store returned no purchasable product';
      track('purchase_unavailable');
      return 'error';
    }
    applyEntitlement(true); // mock: grant Plus locally
    return 'purchased';
  }
  try {
    const { customerInfo } = await rc().purchasePackage(pkg.raw);
    applyEntitlement(isPlusActive(customerInfo));
    if (isPlusActive(customerInfo)) {
      track('subscribed', { period: pkg.period });
      return 'purchased';
    }
    track('purchase_failed', { period: pkg.period });
    return 'error';
  } catch (e: any) {
    if (e?.userCancelled) {
      track('purchase_cancelled', { period: pkg.period });
      return 'cancelled';
    }
    // RevenueCat wraps StoreKit: userInfo.readableErrorCode is the useful one.
    lastError =
      e?.userInfo?.readableErrorCode ??
      e?.code ??
      e?.message ??
      'unknown store error';
    track('purchase_failed', { period: pkg.period, reason: String(lastError).slice(0, 60) });
    return 'error';
  }
}

/** Restore prior purchases. In mock mode this is a no-op that reports no entitlement. */
export async function restore(): Promise<boolean> {
  if (!purchasesEnabled()) return false;
  try {
    const info = await rc().restorePurchases();
    const active = isPlusActive(info);
    applyEntitlement(active);
    if (active) track('restored');
    return active;
  } catch {
    return false;
  }
}
