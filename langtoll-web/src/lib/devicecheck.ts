// Apple DeviceCheck — 2 bits of per-PHYSICAL-DEVICE storage that survive app reinstalls and device
// wipes (tied to the device + our developer account). We use bit0 as "this device has already used
// its free honeymoon", so a wipe-and-reinstall (which mints a fresh attest key + a fresh on-device
// clock) can't farm a new free week. See lib/entitlement.ts for how it's applied.
//
// The app generates a short-lived device token (DCDevice.generateToken); the server exchanges it
// with Apple, authenticated by an ES256 JWT signed with our DeviceCheck private key (.p8). No JWT
// dependency: Node's crypto signs ES256 in JOSE (ieee-p1363) form directly.
import crypto from 'crypto';

const TEAM_ID = process.env.APPLE_TEAM_ID || '';
const KEY_ID = process.env.DEVICECHECK_KEY_ID || '';
// The .p8 contents (PEM). Env files keep newlines as literal "\n"; restore them.
const PRIVATE_KEY = (process.env.DEVICECHECK_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const HOST =
  process.env.DEVICECHECK_ENV === 'development'
    ? 'https://api.development.devicecheck.apple.com'
    : 'https://api.devicecheck.apple.com';

/** Whether DeviceCheck is wired (key + team + key id present). When false the honeymoon falls back
 *  to install-age only (no reinstall protection). */
export function deviceCheckConfigured(): boolean {
  return !!TEAM_ID && !!KEY_ID && !!PRIVATE_KEY;
}

const b64url = (b: Buffer | string) => Buffer.from(b).toString('base64url');

// Apple accepts a JWT for ~20 min; sign once and reuse.
let jwt = { token: '', exp: 0 };
function appleJwt(): string {
  const now = Math.floor(Date.now() / 1000);
  if (jwt.token && jwt.exp - 60 > now) return jwt.token;
  const header = b64url(JSON.stringify({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' }));
  const payload = b64url(JSON.stringify({ iss: TEAM_ID, iat: now }));
  const input = `${header}.${payload}`;
  const sig = crypto.sign('SHA256', Buffer.from(input), { key: PRIVATE_KEY, dsaEncoding: 'ieee-p1363' });
  jwt = { token: `${input}.${b64url(sig)}`, exp: now + 1200 };
  return jwt.token;
}

function callApple(path: string, body: Record<string, unknown>): Promise<Response> {
  return fetch(`${HOST}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${appleJwt()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** Read bit0 for a device. true / false, or null if DeviceCheck couldn't resolve it (caller fails
 *  open). A never-seen device returns HTTP 200 with a plain-text "Failed to find bit state…" body,
 *  which we treat as bit0=false (a genuine first-timer). */
export async function queryBit0(deviceToken: string): Promise<boolean | null> {
  try {
    const res = await callApple('/v1/query_two_bits', {
      device_token: deviceToken,
      transaction_id: crypto.randomUUID(),
      timestamp: Date.now(),
    });
    const text = await res.text();
    if (!res.ok) return null; // 4xx/5xx — unknown; don't punish the user
    try {
      const j = JSON.parse(text);
      return typeof j.bit0 === 'boolean' ? j.bit0 : false;
    } catch {
      return false; // 200 + non-JSON body = no bits stored yet (fresh device)
    }
  } catch {
    return null; // network error
  }
}

/** Set bit0=true (mark the honeymoon consumed on this physical device). Best-effort; returns success. */
export async function setBit0(deviceToken: string): Promise<boolean> {
  try {
    const res = await callApple('/v1/update_two_bits', {
      device_token: deviceToken,
      transaction_id: crypto.randomUUID(),
      timestamp: Date.now(),
      bit0: true,
      bit1: false,
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Clear bit0 (mark the device as never-honeymooned again). DEV/admin only — this undoes the
 *  reinstall-abuse protection for one device, so it must stay behind admin auth. Used by the
 *  dev-tools "reset honeymoon" so a tester can re-experience the free week on their own phone. */
export async function clearBit0(deviceToken: string): Promise<boolean> {
  try {
    const res = await callApple('/v1/update_two_bits', {
      device_token: deviceToken,
      transaction_id: crypto.randomUUID(),
      timestamp: Date.now(),
      bit0: false,
      bit1: false,
    });
    return res.ok;
  } catch {
    return false;
  }
}
