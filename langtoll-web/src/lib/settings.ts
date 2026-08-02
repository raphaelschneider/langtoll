// Editable app settings, stored in MySQL (one JSON row per key) and edited from /langtoll-adm.
// Pricing is the source of truth for the landing page card + MRR estimate. It is NOT what
// users actually pay — the app shows the live App Store / RevenueCat price; this is the
// marketing/display figure, kept here so it can be changed without a deploy.
//
// Reads are cheap and rare: the landing page is statically cached (ISR), so this is hit at
// most once per revalidation window, never per visitor. Every read falls back to defaults
// on any failure (e.g. at `next build`, where no DB env is loaded), so it can't break a build.
import { query } from '@/lib/db';

export interface Pricing {
  monthly: number;
  yearly: number;
  currency: string; // ISO 4217, e.g. 'USD'
}

// Fallback before any admin edit and whenever the DB is unreachable. Keep roughly in sync
// with the app's RevenueCat products (langtoll-mobile/lib/plans.ts).
export const DEFAULT_PRICING: Pricing = { monthly: 7.99, yearly: 39.99, currency: 'USD' };

// The running droplet won't re-run cloud-init, so the table self-heals on first use. Cheap:
// CREATE TABLE IF NOT EXISTS is a no-op once it exists, and we only attempt it once per process.
let ensured = false;
async function ensureTable(): Promise<void> {
  if (ensured) return;
  await query(
    `CREATE TABLE IF NOT EXISTS app_settings (
       k          VARCHAR(64) PRIMARY KEY,
       v          JSON NOT NULL,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
     )`,
    [],
    1
  );
  ensured = true;
}

// Never trust raw stored/posted values — clamp to sane positives, fall back per field.
function coerce(raw: any): Pricing {
  const monthly = Number(raw?.monthly);
  const yearly = Number(raw?.yearly);
  const currency =
    typeof raw?.currency === 'string' && raw.currency.trim()
      ? raw.currency.trim().toUpperCase().slice(0, 3)
      : DEFAULT_PRICING.currency;
  return {
    monthly: Number.isFinite(monthly) && monthly > 0 ? Math.round(monthly * 100) / 100 : DEFAULT_PRICING.monthly,
    yearly: Number.isFinite(yearly) && yearly > 0 ? Math.round(yearly * 100) / 100 : DEFAULT_PRICING.yearly,
    currency,
  };
}

/** Reads pricing from MySQL; returns defaults on any failure (build time, empty table). */
export async function getPricing(): Promise<Pricing> {
  try {
    await ensureTable();
    const rows = await query(`SELECT v FROM app_settings WHERE k = 'pricing' LIMIT 1`, [], 1);
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row) return DEFAULT_PRICING;
    // mysql2 returns JSON columns already parsed; tolerate a string too.
    const raw = typeof row.v === 'string' ? JSON.parse(row.v) : row.v;
    return coerce(raw);
  } catch {
    return DEFAULT_PRICING;
  }
}

/** Writes pricing to MySQL (admin only). Values are validated/clamped by coerce(). */
export async function setPricing(input: Partial<Pricing>): Promise<Pricing> {
  await ensureTable();
  const next = coerce({ ...DEFAULT_PRICING, ...input });
  const json = JSON.stringify(next);
  await query(
    `INSERT INTO app_settings (k, v) VALUES ('pricing', CAST(? AS JSON))
     ON DUPLICATE KEY UPDATE v = CAST(? AS JSON)`,
    [json, json]
  );
  return next;
}

/** Currency symbol for display; falls back to the ISO code when unknown. */
export function currencySymbol(currency: string): string {
  switch (currency) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    default:
      return '';
  }
}

/** e.g. (9.99, 'USD') → "$9.99"; whole numbers drop the decimals → "$10". */
export function fmtPrice(amount: number, currency: string): string {
  const sym = currencySymbol(currency);
  const n = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return sym ? `${sym}${n}` : `${n} ${currency}`;
}

/** Rounded yearly saving vs paying monthly, e.g. 50 → "Save 50%". 0 when there's no saving. */
export function yearlyDiscountPct(p: Pricing): number {
  if (p.monthly <= 0) return 0;
  const pct = Math.round((1 - p.yearly / (p.monthly * 12)) * 100);
  return pct > 0 ? pct : 0;
}
