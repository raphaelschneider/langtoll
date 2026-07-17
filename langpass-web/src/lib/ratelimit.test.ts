import { describe, it, expect, vi, beforeEach } from 'vitest';

// In-memory stand-in for the MySQL rate_limits table so the 429 path is provable in tests
// (locally the limiter is usually disabled via LANGPASS_RATELIMIT_OFF for screenshot bursts,
// so an integration probe can't distinguish "off" from "broken").
const store = new Map<string, { count: number; reset_at: number }>();
vi.mock('@/lib/db', () => ({
  query: vi.fn(async (sql: string, params: unknown[]) => {
    if (sql.startsWith('SELECT')) {
      const buckets = params as string[]; // flat list of bucket keys
      return buckets
        .filter((b) => store.has(b))
        .map((b) => ({ bucket: b, count: store.get(b)!.count, reset_at: store.get(b)!.reset_at }));
    }
    if (sql.startsWith('INSERT')) {
      // VALUES (?, 1, ?) ... ON DUPLICATE KEY UPDATE count = count + 1 — params are [bucket, resetAt] pairs.
      const flat = params as (string | number)[];
      for (let i = 0; i < flat.length; i += 2) {
        const bucket = flat[i] as string;
        const cur = store.get(bucket);
        store.set(bucket, {
          count: cur ? cur.count + 1 : 1,
          reset_at: flat[i + 1] as number,
        });
      }
      return [];
    }
    return []; // DELETE sweep
  }),
}));

import { rateLimit } from './ratelimit';
import type { NextRequest } from 'next/server';

const fakeReq = (ip = '203.0.113.7') =>
  ({ headers: new Headers({ 'cf-connecting-ip': ip }) }) as unknown as NextRequest;

beforeEach(() => {
  store.clear();
  delete process.env.LANGPASS_RATELIMIT_OFF;
});

describe('rateLimit', () => {
  const windows = [{ tag: 'm', limit: 3, windowMs: 60_000 }];

  it('allows up to the limit, then 429s with Retry-After', async () => {
    for (let i = 0; i < 3; i++) {
      expect(await rateLimit(fakeReq(), 'test', windows)).toBeNull();
    }
    const res = await rateLimit(fakeReq(), 'test', windows);
    expect(res?.status).toBe(429);
    expect(Number(res?.headers.get('retry-after'))).toBeGreaterThan(0);
  });

  it('separates identities — one abuser cannot exhaust another IP\'s budget', async () => {
    for (let i = 0; i < 3; i++) await rateLimit(fakeReq('203.0.113.7'), 'test', windows);
    expect((await rateLimit(fakeReq('203.0.113.7'), 'test', windows))?.status).toBe(429);
    expect(await rateLimit(fakeReq('198.51.100.9'), 'test', windows)).toBeNull();
  });

  it('a rejected request does not consume budget (no lockout creep)', async () => {
    for (let i = 0; i < 3; i++) await rateLimit(fakeReq(), 'test', windows);
    await rateLimit(fakeReq(), 'test', windows); // rejected
    expect(store.get([...store.keys()][0])!.count).toBe(3); // still 3, not 4
  });

  it('honours the LANGPASS_RATELIMIT_OFF dev escape hatch', async () => {
    process.env.LANGPASS_RATELIMIT_OFF = '1';
    for (let i = 0; i < 10; i++) {
      expect(await rateLimit(fakeReq(), 'test', windows)).toBeNull();
    }
  });
});
