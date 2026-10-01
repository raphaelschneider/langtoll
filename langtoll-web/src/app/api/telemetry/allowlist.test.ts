import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// The server drops any event not on its allowlist, silently. Between 2026-09-28 and
// 10-01 seven app events (taste answers, cancel reasons, lock-step results…) were
// sent and thrown away because the list lagged. This keeps the two in lockstep.
describe('telemetry allowlist', () => {
  it('accepts every event the app can send', () => {
    const app = readFileSync(join(__dirname, '../../../../../langtoll-mobile/lib/telemetry.ts'), 'utf8');
    const server = readFileSync(join(__dirname, 'route.ts'), 'utf8');
    const appEvents = [...app.matchAll(/^\s*\| '([a-z_]+)'/gm)].map((m) => m[1]);
    const serverEvents = new Set([...server.matchAll(/^\s*'([a-z_]+)',/gm)].map((m) => m[1]));
    expect(appEvents.length).toBeGreaterThan(10);
    expect(appEvents.filter((e) => !serverEvents.has(e))).toEqual([]);
  });
});
