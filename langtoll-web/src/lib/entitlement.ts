// Server-side entitlement gate for the paid surfaces (Sage chat, the progressive program, and
// illustration generation). The mobile app gates these client-side (canChatWithSage / canUseProgram
// / canGenerateImages), but a client gate is not a security boundary: anyone who can reach the API
// past attestation could otherwise use the paid service for free. This verifies the entitlement on
// the SERVER, where it can't be spoofed.
//
// Two ways to be entitled, mirroring the app:
//   1. Honeymoon — the free first week. Derived from the install's age (attest_keys.created_at, set
//      once at registration). Spoof-resistant because creating an attest key requires a valid
//      attestation. (Reinstalling yields a fresh key = fresh honeymoon — an inherent device-trial
//      limit that the on-device journeyStartDate shares; bounded by 7 days + the rate limiter. The
//      dormant device_status/DeviceCheck scaffolding is the future hardening for that.)
//   2. Plus — verified live against RevenueCat's REST API using the app's RevenueCat user id
//      (x-rc-user header), NOT the client's self-reported plan.
//
// SAFETY VALVE: inert (passes through) unless attestation is enforced AND a RevenueCat secret is set
// AND ENTITLEMENT_ENFORCE=1 — so this ships dormant and is flipped on deliberately, never breaking
// dev or the current app on deploy. Mirrors lib/attest.ts.
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { attestEnforced } from '@/lib/attest';
import { deviceCheckConfigured, queryBit0, setBit0 } from '@/lib/devicecheck';

const RC_SECRET = process.env.REVENUECAT_SECRET_KEY || '';
const RC_ENTITLEMENT = process.env.REVENUECAT_ENTITLEMENT || 'plus';
const ENFORCE = process.env.ENTITLEMENT_ENFORCE === '1';
// The free preview week was removed from the app (2026-09-05): Plus is the App Store trial and
// nothing else, so the server grants no install-age window either. Kept as an env knob (0 = off)
// so a future test can flip it without a deploy of code; the app has no matching window today.
const HONEYMOON_DAYS = Number(process.env.FREE_GRACE_DAYS || '0');

/** Enforcement is only meaningful when attestation is enforced — otherwise the per-install key is
 *  unverified and the honeymoon window is trivially spoofable. Also needs the RC secret to verify Plus. */
export function entitlementEnforced(): boolean {
  return ENFORCE && attestEnforced() && !!RC_SECRET;
}

// Per-instance positive cache so we don't call RevenueCat on every streamed chat token. Only
// successes are cached (a short-lived "this user is Plus"); negatives always re-check so an upgrade
// is honoured promptly.
const plusUntil = new Map<string, number>();
const PLUS_TTL_MS = 10 * 60 * 1000;

/** true = active Plus, false = definitively not, null = RevenueCat unreachable (caller fails open). */
async function revenueCatHasPlus(appUserId: string): Promise<boolean | null> {
  if (plusUntil.get(appUserId)! > Date.now()) return true;
  try {
    const res = await fetch(
      `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`,
      { headers: { Authorization: `Bearer ${RC_SECRET}` } }
    );
    if (res.status === 404) return false; // unknown subscriber → never purchased
    if (!res.ok) {
      // Fail-open is deliberate (an RC outage must never punish a payer) but it must be VISIBLE —
      // a misconfigured key would otherwise silently entitle everyone past their honeymoon.
      console.warn(`[entitlement] RevenueCat verify failed open — HTTP ${res.status} for user ${appUserId.slice(0, 8)}…`);
      return null;
    }
    const body = await res.json();
    const ent = body?.subscriber?.entitlements?.[RC_ENTITLEMENT];
    const active = !!ent && (!ent.expires_date || new Date(ent.expires_date).getTime() > Date.now());
    if (active) plusUntil.set(appUserId, Date.now() + PLUS_TTL_MS);
    else console.warn(`[entitlement] RC subscriber known but '${RC_ENTITLEMENT}' inactive (expires: ${ent?.expires_date ?? 'none'})`);
    return active;
  } catch (err) {
    console.warn(`[entitlement] RevenueCat verify unreachable — failing open: ${err instanceof Error ? err.message : err}`);
    return null; // network error → fail open
  }
}

/**
 * Free first week. The window is the install's age (attest_keys.created_at, set once at
 * registration). On top of that, when DeviceCheck is configured we enforce ONE honeymoon per
 * PHYSICAL device: a wipe-and-reinstall mints a fresh attest key (fresh clock), but DeviceCheck's
 * bit0 persists across reinstalls — so the second honeymoon is denied. The verdict is evaluated
 * against Apple ONCE per install and cached in attest_keys.honeymoon_ok.
 */
async function withinHoneymoon(keyId: string, dcToken: string | null): Promise<boolean> {
  let row: { created_at?: string; honeymoon_ok?: number | null } | null;
  try {
    const rows = await query('SELECT created_at, honeymoon_ok FROM attest_keys WHERE key_id = ?', [keyId]);
    row = Array.isArray(rows) ? rows[0] : null;
  } catch {
    return true; // a DB hiccup must never block a legit user (matches the rate-limiter's fail-open)
  }
  if (!row?.created_at) return false;
  const ageDays = (Date.now() - new Date(row.created_at).getTime()) / 86_400_000;
  if (ageDays >= HONEYMOON_DAYS) return false;

  // Without DeviceCheck, install-age alone (reinstall can farm a new week — accepted fallback).
  if (!deviceCheckConfigured()) return true;

  // Cached per-install verdict so we hit Apple once, not per request.
  if (row.honeymoon_ok === 1) return true;
  if (row.honeymoon_ok === 0) return false;
  // honeymoon_ok is NULL → not yet evaluated.
  if (!dcToken) return true; // no token on this request; allow now, decide when one arrives

  const bit0 = await queryBit0(dcToken);
  if (bit0 === null) return true; // Apple unreachable → fail open, re-evaluate later (stays NULL)
  if (bit0 === true) {
    // This physical device already consumed a honeymoon in a prior install. Deny + cache.
    await query('UPDATE attest_keys SET honeymoon_ok = 0 WHERE key_id = ?', [keyId]).catch(() => {});
    console.warn(`[entitlement] honeymoon denied — DeviceCheck bit0 set (reinstall) key:${keyId.slice(0, 10)}…`);
    return false;
  }
  // Genuine first honeymoon for this device. Claim the bit; only cache "eligible" once the
  // persistent bit is actually set, so a failed set is retried (never punishes the user meanwhile).
  if (await setBit0(dcToken)) {
    await query('UPDATE attest_keys SET honeymoon_ok = 1 WHERE key_id = ?', [keyId]).catch(() => {});
  }
  return true;
}

/**
 * Gate a paid route. Call AFTER requireAttestation (so x-attest-key is verified) and ideally after
 * the rate limit. Returns a 402 NextResponse to short-circuit, or null when the caller is entitled
 * (in honeymoon, or verified Plus). Inert when not enforced.
 */
export async function requireEntitlement(req: NextRequest): Promise<NextResponse | null> {
  if (!entitlementEnforced()) return null;

  const keyId = req.headers.get('x-attest-key');
  if (keyId && (await withinHoneymoon(keyId, req.headers.get('x-devicecheck-token')))) return null;

  const rcUser = req.headers.get('x-rc-user');
  if (rcUser) {
    const plus = await revenueCatHasPlus(rcUser);
    if (plus !== false) return null; // true = verified Plus; null = RC unreachable, fail open
  }

  console.warn(
    `[entitlement] 402 plus required — key:${keyId?.slice(0, 10) ?? 'none'}… rcUser:${rcUser ? 'present' : 'none'} (past honeymoon, no active Plus)`
  );
  return NextResponse.json({ error: 'plus required' }, { status: 402 });
}
