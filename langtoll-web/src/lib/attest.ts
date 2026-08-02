// App Attest — proves each API request comes from a genuine, unmodified instance of our app
// on a real Apple device, with no user accounts. See /api/attest/* for the handshake and
// requireAttestation() for the per-request gate applied to the expensive AI routes.
//
// Crypto verification is delegated to node-app-attest (cert-chain validation, CBOR parsing,
// nonce + counter checks). We add: stateless one-time challenges, public-key storage, and the
// replay-resistant counter persisted per key.
//
// SAFETY VALVE: the gate is INERT unless ATTEST_ENFORCE=1 and the team id + HMAC secret are set,
// so this can ship before the native client exists without breaking dev or the current app.
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAttestation, verifyAssertion } from 'node-app-attest';
import { query } from '@/lib/db';

const TEAM_ID = process.env.APPLE_TEAM_ID || '';
const BUNDLE_ID = process.env.APP_BUNDLE_ID || 'com.langtoll.app';
const HMAC_SECRET = process.env.ATTEST_HMAC_SECRET || '';
const ALLOW_DEV = process.env.ATTEST_ALLOW_DEV === '1'; // accept development-environment attestations
const ENFORCE = process.env.ATTEST_ENFORCE === '1';
const CHALLENGE_TTL_MS = 5 * 60 * 1000;

/** True only when fully configured AND enforcement is on — otherwise the gate passes through. */
export function attestEnforced(): boolean {
  return ENFORCE && !!TEAM_ID && !!HMAC_SECRET;
}

/** Whether the handshake endpoints can operate (need the secret + team id, regardless of ENFORCE). */
export function attestConfigured(): boolean {
  return !!TEAM_ID && !!HMAC_SECRET;
}

// Stateless single-window challenge: nonce.timestamp.hmac — no table needed. Replay of a
// *challenge* is harmless because the assertion counter must still advance on every request.
export function issueChallenge(): string {
  const nonce = crypto.randomBytes(16).toString('base64url');
  const ts = Date.now().toString();
  const sig = crypto.createHmac('sha256', HMAC_SECRET).update(`${nonce}.${ts}`).digest('base64url');
  return `${nonce}.${ts}.${sig}`;
}

function challengeValid(challenge: string): boolean {
  const parts = challenge.split('.');
  if (parts.length !== 3) return false;
  const [nonce, ts, sig] = parts;
  const expected = crypto.createHmac('sha256', HMAC_SECRET).update(`${nonce}.${ts}`).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const age = Date.now() - Number(ts);
  return Number.isFinite(age) && age >= 0 && age <= CHALLENGE_TTL_MS;
}

/** One-time per install: verify the attestation and store the device's public key. */
export async function registerAttestation(input: {
  keyId: string;
  attestation: string; // base64
  challenge: string;
  deviceId?: string | null;
}): Promise<void> {
  if (!attestConfigured()) throw new Error('attestation not configured');
  if (!challengeValid(input.challenge)) throw new Error('invalid challenge');
  const result = verifyAttestation({
    attestation: Buffer.from(input.attestation, 'base64'),
    challenge: input.challenge,
    keyId: input.keyId,
    bundleIdentifier: BUNDLE_ID,
    teamIdentifier: TEAM_ID,
    allowDevelopmentEnvironment: ALLOW_DEV,
  });
  await query(
    `INSERT INTO attest_keys (key_id, public_key, sign_count, device_id)
       VALUES (?, ?, 0, ?)
     ON DUPLICATE KEY UPDATE public_key = VALUES(public_key), device_id = VALUES(device_id)`,
    [input.keyId, result.publicKey, input.deviceId ?? null]
  );
}

/**
 * Per-request gate. Returns a 401 NextResponse to short-circuit the route, or null when the
 * request is allowed (valid assertion, or enforcement disabled). Reads the assertion from
 * x-attest-* headers; verifies the signature against the stored key and advances the counter.
 */
export async function requireAttestation(req: NextRequest): Promise<NextResponse | null> {
  if (!attestEnforced()) return null;
  const keyId = req.headers.get('x-attest-key');
  const assertion = req.headers.get('x-attest-assertion');
  const challenge = req.headers.get('x-attest-challenge');
  if (!keyId || !assertion || !challenge) {
    console.warn(`[attest] 401 attestation required — headers present? key:${!!keyId} assertion:${!!assertion} challenge:${!!challenge} (the app sent no/partial attestation — native module not loaded, simulator, or attestHeaders no-op'd)`);
    return NextResponse.json({ error: 'attestation required' }, { status: 401 });
  }
  if (!challengeValid(challenge)) {
    console.warn('[attest] 401 invalid challenge — HMAC mismatch or expired (>5min); the secret that issued it differs, or clocks are off');
    return NextResponse.json({ error: 'invalid challenge' }, { status: 401 });
  }
  try {
    const rows = await query('SELECT public_key, sign_count FROM attest_keys WHERE key_id = ?', [keyId]);
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row) {
      console.warn(`[attest] 401 unknown key ${keyId.slice(0, 12)}… — registration never succeeded (check /api/attest/register status)`);
      return NextResponse.json({ error: 'unknown key' }, { status: 401 });
    }
    // verifyAssertion enforces counter > stored and validates the signature + app id.
    const { signCount } = verifyAssertion({
      assertion: Buffer.from(assertion, 'base64'),
      payload: challenge, // clientData the device signed = the challenge
      publicKey: row.public_key,
      bundleIdentifier: BUNDLE_ID,
      teamIdentifier: TEAM_ID,
      signCount: Number(row.sign_count),
    });
    await query('UPDATE attest_keys SET sign_count = ? WHERE key_id = ?', [Number(signCount), keyId]);
    return null;
  } catch (err) {
    console.warn(`[attest] 401 assertion failed: ${err instanceof Error ? err.message : String(err)} (signature/counter/bundle/team mismatch — bundle=${BUNDLE_ID} team=${TEAM_ID})`);
    return NextResponse.json({ error: 'attestation failed' }, { status: 401 });
  }
}
