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
import { applyEntitlement, type EntitlementMeta } from './store';
import { scheduleTrialEndNotice } from './notify';
import { track } from './telemetry';
import { initDeviceId, supportCode } from './device';
import { isHydrated, getState } from './store';

// Every entitlement write goes through here so the store and the trial-end
// warning always agree: a fresh Plus, a cancelled trial (willRenew flips) and
// a lapse each re-evaluate the notice from the live entitlement shape.
/**
 * What the admin needs to know about a plan change, read off CustomerInfo.
 * `sandbox` is the flag that separates a TestFlight purchase from money: seven
 * sandbox weeklies read as seven paying customers on launch day (2026-09-22).
 */
interface PlanReport {
  period: Period | null;
  sandbox: boolean | null;
  rcUser: string | null;
  /** When the store last charged for it (ISO), to tell a reinstall from a sale. */
  latestPurchaseAt: string | null;
}

/**
 * A listener grant whose purchase is older than this is not a sale made now: it
 * is an existing subscription RevenueCat found on a fresh install (or a second
 * device). On 2026-10-04 a monthly subscriber reinstalled and the admin counted
 * a new 'subscribed' two seconds after app_open, before any paywall.
 */
const REINSTALL_GRACE_MS = 10 * 60 * 1000;

/**
 * Where a plan change came from, for attribution. purchase() sets this while a
 * StoreKit sheet is up so that a listener firing before purchasePackage resolves
 * still credits the wall that sold it, not 'listener'.
 */
let pending: { source: string; period: Period } | null = null;

/**
 * Every plan change is reported HERE, from the transition, not from the call
 * site — so Plus that arrives through the listener (a purchase completed after
 * the app was killed on the sheet, a receipt picked up on reinstall) and a lapse
 * reach the admin too. Before this, only purchase() reported, so a lapsed device
 * stayed "plus · active" on the server forever and a listener grant stayed free.
 *
 * `source` is the gate for a subscribe ('listener' when nobody asked); restore()
 * reports itself and passes null so a restore is not counted as a sale.
 */
function applyPlan(plus: boolean, meta?: EntitlementMeta, report?: PlanReport, source: string | null = 'listener'): void {
  // Before hydration the store holds the default plan, not the user's — a
  // comparison would invent a "subscribed" on every launch of a Plus device.
  const was = isHydrated() ? getState().plan : null;
  applyEntitlement(plus, meta);
  scheduleTrialEndNotice();
  if (was === null) return;
  if (plus && was !== 'plus' && source !== null) {
    const bought = report?.latestPurchaseAt ? Date.parse(report.latestPurchaseAt) : NaN;
    const preexisting = !pending && Number.isFinite(bought) && Date.now() - bought > REINSTALL_GRACE_MS;
    track(preexisting ? 'restored' : 'subscribed', {
      period: pending?.period ?? report?.period ?? null,
      source: pending?.source ?? source,
      sandbox: report?.sandbox ?? null,
      rcUser: report?.rcUser ?? null,
    });
  } else if (!plus && was === 'plus') {
    track('unsubscribed', { sandbox: report?.sandbox ?? null, rcUser: report?.rcUser ?? null });
  }
}

/** The 'plus' entitlement's shape, straight from RevenueCat's CustomerInfo. */
function entitlementMeta(info: any): EntitlementMeta {
  const e = info?.entitlements?.active?.[PLUS_ENTITLEMENT];
  return {
    expiresAt: typeof e?.expirationDate === 'string' ? e.expirationDate : null,
    willRenew: typeof e?.willRenew === 'boolean' ? e.willRenew : null,
    isTrial: e?.periodType ? e.periodType === 'TRIAL' : null,
  };
}

/** The reporting shape of the same CustomerInfo — see PlanReport. */
function planReport(info: any): PlanReport {
  // On a lapse the entitlement is no longer under `active`; `all` still has it,
  // with the product that was bought and whether it was sandbox.
  const e = info?.entitlements?.active?.[PLUS_ENTITLEMENT] ?? info?.entitlements?.all?.[PLUS_ENTITLEMENT];
  return {
    period: PERIOD_BY_PRODUCT[e?.productIdentifier ?? ''] ?? null,
    sandbox: typeof e?.isSandbox === 'boolean' ? e.isSandbox : null,
    rcUser: typeof info?.originalAppUserId === 'string' ? info.originalAppUserId : null,
    latestPurchaseAt: typeof e?.latestPurchaseDate === 'string' ? e.latestPurchaseDate : null,
  };
}
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

/** A yearly price as a weekly one ("≈ €0.77/wk"), set beside the weekly plan's own price. */
export function perWeekEquivalent(p: PlusPackage): string | null {
  if (p.period !== 'yearly' || p.amount <= 0) return null;
  return formatMoney(p.amount / 52, p.currency);
}

/** Twelve months of the monthly plan, for the struck-through price on the yearly card.
 *  Null when there is no monthly plan in the same currency or no saving to show. */
export function yearOfMonthly(p: PlusPackage, all: PlusPackage[]): string | null {
  const monthly = all.find((x) => x.period === 'monthly');
  if (p.period !== 'yearly' || !monthly || monthly.currency !== p.currency) return null;
  const year = monthly.amount * 12;
  return year > p.amount ? formatMoney(year, p.currency) : null;
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

// Simulator escape hatch: the dev .env carries the real key, so the simulator
// runs live StoreKit, which cannot complete a purchase there, and the HARD
// paywall then blocks every screen behind it. EXPO_PUBLIC_MOCK_PURCHASES=1
// forces the mock (tap a plan, get Plus) — but only where the mock is already
// allowed, and check-release-config refuses it in a production build.
const FORCE_MOCK = MOCK_ALLOWED && process.env.EXPO_PUBLIC_MOCK_PURCHASES === '1';

/** Live only when a real key is set on a native platform — otherwise mock. */
export function purchasesEnabled(): boolean {
  if (FORCE_MOCK) return false;
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
    // Apple Ads attribution: hands the AdServices token to RevenueCat so trials and
    // renewals trace back to the campaign/keyword. No ATT prompt needed. Fire-and-forget.
    Purchases.enableAdServicesAttributionTokenCollection?.().catch(() => {});
    Purchases.addCustomerInfoUpdateListener((info: any) => applyPlan(isPlusActive(info), entitlementMeta(info), planReport(info)));
    await syncEntitlement();
    void identifyCustomer();
  } catch {
    // bad key / pod not linked — stay on mock; rebuild to enable
  }
}

/**
 * Ties the RevenueCat customer to our install, both ways, on every launch:
 * - RevenueCat gets the support code (as display name and attribute) and the full
 *   device id, so a support email's "5A24-084E" finds the customer in RevenueCat.
 * - The admin gets the RevenueCat id (rc_identity), for every install, not only
 *   ones that bought on this device.
 * A customer wrote on 2026-10-01 asking for a refund with a support code that had
 * no purchase on file, and there was no way to find them in RevenueCat.
 */
async function identifyCustomer(): Promise<void> {
  try {
    const deviceId = await initDeviceId();
    const code = supportCode();
    await rc().setAttributes({ langtoll_support_code: code, langtoll_device_id: deviceId });
    await rc().setDisplayName?.(code);
    const rcUser = await rc().getAppUserID();
    if (typeof rcUser === 'string' && rcUser) track('rc_identity', { rcUser });
  } catch {
    // best-effort: identity must never block purchases or launch
  }
}

/** Read the current entitlement and mirror it into the store. */
export async function syncEntitlement(): Promise<void> {
  if (!purchasesEnabled()) return;
  try {
    const info = await rc().getCustomerInfo();
    applyPlan(isPlusActive(info), entitlementMeta(info), planReport(info));
  } catch {
    // offline / not configured — keep last known plan
  }
}

/**
 * Why the live offerings could not be used, in one short phrase.
 *
 * This used to be a bare `catch {}` that fell through to the mock, which made
 * every distinct failure look identical on screen: real prices and mock prices
 * are the same numbers (FALLBACK_PRICES mirrors the US anchors), so a paywall
 * running entirely on mock data is INDISTINGUISHABLE from a working one until
 * you press buy. Two TestFlight builds were spent guessing at this. The four
 * causes below need four different fixes, so they get four different messages.
 */
let offeringsDiag: string | null = null;
export function offeringsDiagnostic(): string | null {
  return offeringsDiag;
}

/**
 * A product's intro offer says nothing about THIS person: Apple grants a free trial
 * once per Apple ID per subscription group, so a reinstall or a second account on the
 * same Apple ID is told "7 days free" by the paywall and then shown the full price on
 * Apple's sheet — the exact moment people back out. Ask the store, and sell the
 * no-trial version to anyone it says is ineligible. Unknown (no answer yet, or a
 * storefront that cannot say) keeps the offer as advertised. Best-effort: a failure
 * here must never hide the trial from someone entitled to it (pre-freeze audit,
 * 2026-10-01).
 */
async function dropUsedTrials(pkgs: PlusPackage[]): Promise<void> {
  try {
    const ids = pkgs.filter((p) => p.hasTrial).map((p) => p.raw?.product?.identifier).filter(Boolean) as string[];
    if (!ids.length) return;
    const result = await rc().checkTrialOrIntroductoryPriceEligibility(ids);
    const INELIGIBLE = nativeModule()?.INTRO_ELIGIBILITY_STATUS?.INTRO_ELIGIBILITY_STATUS_INELIGIBLE ?? 1;
    for (const p of pkgs) {
      const id = p.raw?.product?.identifier;
      if (id && result?.[id]?.status === INELIGIBLE) {
        p.hasTrial = false;
        p.trialDays = 0;
      }
    }
  } catch {
    // leave the store's own offer in place
  }
}

/** The purchasable packages for the paywall — live from the store, or the mock. */
export async function getPackages(): Promise<PlusPackage[]> {
  if (purchasesEnabled()) {
    const unmatched: string[] = [];
    try {
      const offerings = await rc().getOfferings();
      const pkgs: any[] = offerings?.current?.availablePackages ?? [];
      if (!offerings?.current) {
        // No offering is marked Current in the RevenueCat dashboard, or the SDK
        // key points at a project/app that has none.
        offeringsDiag = 'no current offering';
      } else if (!pkgs.length) {
        // The offering exists but StoreKit returned no product for any of its
        // packages — products not attached in RevenueCat, or the App Store has
        // nothing purchasable for this bundle id on this storefront.
        offeringsDiag = `offering "${offerings.current.identifier}" has 0 products`;
      }
      const mapped = pkgs
        .map((p) => {
          const id = p?.product?.identifier ?? '';
          const period = PERIOD_BY_PRODUCT[id];
          if (!period) {
            unmatched.push(id || '(no id)');
            return null;
          }
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
      if (mapped.length) {
        offeringsDiag = null; // live products in hand — nothing to report
        await dropUsedTrials(mapped);
        return sortPackages(mapped);
      }
      if (unmatched.length) {
        // Products came back, but under identifiers this build doesn't know.
        // Printing them is the whole point: the fix is to make PRODUCT_IDS match.
        offeringsDiag = `unknown product ids: ${unmatched.join(', ')}`;
      }
    } catch (e: any) {
      // Most commonly an invalid/revoked SDK key, which RevenueCat only rejects
      // here — configure() accepts any string and fails silently.
      offeringsDiag = `offerings failed: ${e?.userInfo?.readableErrorCode ?? e?.code ?? e?.message ?? 'unknown'}`;
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
/**
 * `source` names the gate that opened the paywall (lib/paywall) so tapped /
 * subscribed can be joined to paywall_viewed per gate.
 */
export async function purchase(pkg: PlusPackage, source = 'unknown'): Promise<PurchaseResult> {
  track('purchase_tapped', { period: pkg.period, source });
  lastError = null;
  if (!purchasesEnabled() || !pkg.raw) {
    // Never hand out Plus in a build that isn't dev tooling — see MOCK_ALLOWED.
    if (!MOCK_ALLOWED) {
      lastError = !purchasesEnabled()
        ? 'RevenueCat not configured in this build'
        : offeringsDiag ?? 'store returned no purchasable product';
      track('purchase_unavailable', { period: pkg.period, source });
      return 'error';
    }
    applyPlan(true, undefined, undefined, source); // mock: grant Plus locally (telemetry is off in mock builds)
    return 'purchased';
  }
  pending = { source, period: pkg.period };
  try {
    const { customerInfo } = await rc().purchasePackage(pkg.raw);
    // 'subscribed' is reported by applyPlan on the free → plus transition, with
    // this wall as its source (via `pending`, even if the listener got there first).
    applyPlan(isPlusActive(customerInfo), entitlementMeta(customerInfo), planReport(customerInfo), source);
    if (isPlusActive(customerInfo)) {
      return 'purchased';
    }
    // Apple ACCEPTED the purchase (no throw) but the entitlement is not active.
    // The money moved and the user got nothing — the worst failure mode here, and
    // the only one that used to produce a bare "could not complete" with no cause.
    // It means the purchased product carries no entitlement in RevenueCat: the
    // App Store products shipped with none attached while the Test Store copies
    // had `plus`, so every sandbox purchase reported failure after succeeding.
    lastError = `purchased, but "${PLUS_ENTITLEMENT}" is not active — attach the entitlement to ${pkg.raw?.product?.identifier ?? 'this product'} in RevenueCat`;
    track('purchase_failed', { period: pkg.period, reason: 'entitlement_inactive', source });
    return 'error';
  } catch (e: any) {
    if (e?.userCancelled) {
      track('purchase_cancelled', { period: pkg.period, source });
      return 'cancelled';
    }
    // RevenueCat wraps StoreKit: userInfo.readableErrorCode is the useful one.
    lastError =
      e?.userInfo?.readableErrorCode ??
      e?.code ??
      e?.message ??
      'unknown store error';
    track('purchase_failed', { period: pkg.period, reason: String(lastError).slice(0, 60), source });
    return 'error';
  } finally {
    pending = null;
  }
}

/** Restore prior purchases. In mock mode this is a no-op that reports no entitlement. */
export async function restore(): Promise<boolean> {
  if (!purchasesEnabled()) return false;
  try {
    const info = await rc().restorePurchases();
    const active = isPlusActive(info);
    const report = planReport(info);
    // source null: a restore is not a sale. It reports itself below, with the
    // same shape, so the server mirror still learns the plan + sandbox flag.
    applyPlan(active, entitlementMeta(info), report, null);
    if (active) track('restored', { period: report.period, sandbox: report.sandbox, rcUser: report.rcUser });
    return active;
  } catch {
    return false;
  }
}
