// Shared rate limiter for the money-spending routes (LLM + image generation). Fixed-window
// counters kept in MySQL (the `rate_limits` table) so the budget holds across the prod App
// Platform's >=2 instances — an in-process map gave each instance its own counter, so the real
// cap was N x the limit and reset on every deploy. This is a COST backstop against runaway /
// scripted use, NOT the auth boundary (App Attest is that). Fails OPEN on a store error: a DB
// hiccup must never take down the paid routes (and when the DB is truly down, the attestation gate
// — which also queries MySQL — already rejects the request, so there's no double exposure).
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export interface RateWindow {
  tag: string; // short label, unique per window on a route (e.g. 'm', 'd')
  limit: number;
  windowMs: number;
}

/** Client IP behind Caddy/the platform LB (X-Forwarded-For), else a fallback. */
export function clientKey(req: NextRequest): string {
  // Behind Cloudflare's proxy this is the real client IP, set by CF and not client-spoofable
  // (unlike x-forwarded-for, which a client can forge to dodge per-IP limits). Absent when not
  // proxied by CF, so this is a safe no-op off-Cloudflare. Prefer it first.
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

// Identity to limit on: the attested key when present — a genuine per-install id that App Attest
// already verified, so it can't be spoofed past the gate and isn't shared the way a carrier-NAT IP
// is (many real users behind one IP). Falls back to IP for unauthenticated/dev traffic.
function identity(req: NextRequest): string {
  const keyId = req.headers.get('x-attest-key');
  return keyId ? `k:${keyId}` : `ip:${clientKey(req)}`;
}

// Opportunistic cleanup of expired windows so the table can't grow unbounded from one-off ids.
// At most once a minute per instance; indexed on reset_at so it's cheap.
let lastSweep = 0;
async function sweep(now: number): Promise<void> {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  try {
    await query('DELETE FROM rate_limits WHERE reset_at < ?', [now]);
  } catch {
    // best-effort; a failed sweep just leaves expired rows for the next pass
  }
}

/**
 * Checks every window for the route; returns a 429 (with Retry-After) if any is already at its
 * limit, else records the hit and returns null to proceed. Two passes (read-all, then increment-all,
 * one query each) so a rejected request doesn't consume the other windows' budgets. Call right
 * after the attestation gate, before any paid work. `await` it.
 */
export async function rateLimit(
  req: NextRequest,
  route: string,
  windows: RateWindow[]
): Promise<NextResponse | null> {
  // Dev escape hatch: turn the limiter off entirely (e.g. LANGPASS_RATELIMIT_OFF=1 in .env.local)
  // so heavy local screenshot/seeding bursts don't hit 429s. NEVER set this in production.
  if (process.env.LANGPASS_RATELIMIT_OFF === '1') return null;

  const now = Date.now();
  const id = identity(req);
  const specs = windows.map((w) => {
    const windowStart = Math.floor(now / w.windowMs) * w.windowMs;
    return { w, bucket: `${route}:${w.tag}:${id}:${windowStart}`, resetAt: windowStart + w.windowMs };
  });

  try {
    // pass 1 — would any window already be at its limit? (read all buckets in one query)
    const placeholders = specs.map(() => '?').join(',');
    const rows = await query(
      `SELECT bucket, count FROM rate_limits WHERE bucket IN (${placeholders})`,
      specs.map((s) => s.bucket)
    );
    const counts = new Map<string, number>(
      (Array.isArray(rows) ? rows : []).map((r: any) => [r.bucket, Number(r.count)])
    );
    for (const s of specs) {
      if ((counts.get(s.bucket) ?? 0) >= s.w.limit) {
        const retryAfter = Math.max(1, Math.ceil((s.resetAt - now) / 1000));
        return NextResponse.json(
          { error: 'Too many requests — please slow down a moment.' },
          { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        );
      }
    }

    // pass 2 — record the hit against every window in one upsert
    const values = specs.map(() => '(?, 1, ?)').join(',');
    const params = specs.flatMap((s) => [s.bucket, s.resetAt]);
    await query(
      `INSERT INTO rate_limits (bucket, count, reset_at) VALUES ${values}
       ON DUPLICATE KEY UPDATE count = count + 1`,
      params
    );
    void sweep(now);
    return null;
  } catch (err) {
    console.warn(
      `[ratelimit] store unavailable — failing open for ${route}: ${err instanceof Error ? err.message : String(err)}`
    );
    return null;
  }
}

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/**
 * Per-route limits — comfortably above what a real user does, tight enough to cap a runaway/
 * scripted client's spend. AI topic generation is the only paid route; caps below stop farming
 * while a cached repeat-topic (served from the DB, no OpenAI) still counts a hit but costs nothing.
 */
export const LIMITS: Record<string, RateWindow[]> = {
  topics: [
    { tag: 'm', limit: 4, windowMs: MIN },
    { tag: 'h', limit: 20, windowMs: HOUR },
    { tag: 'd', limit: 40, windowMs: DAY },
  ],
  // Telemetry is a public MySQL-write endpoint (no OpenAI cost, but a row per call) — cap it to stop
  // DB-bloat spam. Deliberately GENEROUS: real bursty usage is well under this, and it keys per-IP so
  // a shared/NAT IP (many legit users) must never be throttled. The event allowlist already bounds it.
  telemetry: [
    { tag: 'm', limit: 120, windowMs: MIN },
    { tag: 'd', limit: 3000, windowMs: DAY },
  ],
};
