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
import { PLUS_ENTITLEMENT, PRODUCT_IDS, PRICES, type Period } from './plans';

const RC_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';

/** A normalized package the paywall renders, whether from the store or the mock. */
export interface PlusPackage {
  period: Period;
  /** Localized price string from the store, or the fallback from PRICES. */
  priceString: string;
  /** RevenueCat package object to purchase (null in mock mode). */
  raw: any | null;
  /** True if this package carries an introductory free trial. */
  hasTrial: boolean;
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

const PERIOD_BY_PRODUCT: Record<string, Period> = {
  [PRODUCT_IDS.monthly]: 'monthly',
  [PRODUCT_IDS.yearly]: 'yearly',
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
          return {
            period,
            priceString: p?.product?.priceString ?? PRICES[period].price,
            raw: p,
            hasTrial: !!p?.product?.introPrice && p.product.introPrice.price === 0,
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
  const order: Period[] = ['yearly', 'monthly'];
  return [...pkgs].sort((a, b) => order.indexOf(a.period) - order.indexOf(b.period));
}

function mockPackages(): PlusPackage[] {
  return sortPackages(
    (['yearly', 'monthly'] as Period[]).map((period) => ({
      period,
      priceString: PRICES[period].price,
      raw: null,
      hasTrial: true,
    }))
  );
}

export type PurchaseResult = 'purchased' | 'cancelled' | 'error';

/** Buy a package. In mock mode, immediately grants Plus so the flow is testable. */
export async function purchase(pkg: PlusPackage): Promise<PurchaseResult> {
  if (!purchasesEnabled() || !pkg.raw) {
    applyEntitlement(true); // mock: grant Plus locally
    return 'purchased';
  }
  try {
    const { customerInfo } = await rc().purchasePackage(pkg.raw);
    applyEntitlement(isPlusActive(customerInfo));
    return isPlusActive(customerInfo) ? 'purchased' : 'error';
  } catch (e: any) {
    if (e?.userCancelled) return 'cancelled';
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
    return active;
  } catch {
    return false;
  }
}
