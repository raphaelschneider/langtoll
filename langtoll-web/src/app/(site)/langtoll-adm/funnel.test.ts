import { describe, expect, it } from 'vitest';
import { buildReport, ONBOARDING_STEPS, stageOf } from './funnel';
import type { EventRow, UserRow } from './funnel';

const u = (id: string, extra: Partial<UserRow> = {}): UserRow => ({
  device_id: id,
  app_version: '1.0',
  plan: 'free',
  platform: 'ios',
  created_at: '2026-09-01T10:00:00Z',
  onboarded_at: null,
  last_seen_at: null,
  ...extra,
});
const e = (id: string, event: string, data: unknown = null, at = '2026-09-01T10:05:00Z'): EventRow => ({ device_id: id, event, data, created_at: at });

describe('buildReport', () => {
  it('walks the onboarding steps and counts where people stop', () => {
    const users = [u('a'), u('b'), u('c', { onboarded_at: '2026-09-01T10:10:00Z' })];
    const events = [
      e('a', 'onboarding_step', { step: 'hook' }),
      e('a', 'onboarding_step', { step: 'how' }),
      e('b', 'onboarding_step', { step: 'hook' }),
      ...ONBOARDING_STEPS.map((s) => e('c', 'onboarding_step', { step: s })),
      e('c', 'onboarded', { language: 'de', level: 'A1' }),
      e('c', 'session_started', { language: 'de', level: 'A1' }),
      e('c', 'session_completed', { language: 'de', level: 'A1' }),
    ];
    const r = buildReport(users, events, [], { days: null, excludeTest: true }, new Date('2026-09-02T00:00:00Z'));
    const onb = r.sections.find((s) => s.key === 'onboarding')!;
    expect(onb.rows[0]).toEqual(['1. hook', '3', '100%', '0', '1']); // b stopped on hook
    expect(onb.rows[1]).toEqual(['2. how', '2', '67%', '1', '1']); // a stopped on how
    expect(onb.rows[onb.rows.length - 1][1]).toBe('1'); // c finished
    expect(r.kpis.find((k) => k.label === 'Paid a fare')!.value).toBe('1');
  });

  it('attributes a subscription to the wall it came from and hides mock devices', () => {
    const users = [u('p'), u('m')];
    const events = [
      e('p', 'paywall_viewed', { source: 'settings_fare' }),
      e('p', 'purchase_tapped', { period: 'yearly', source: 'settings_fare' }),
      e('p', 'subscribed', { period: 'yearly', source: 'settings_fare' }),
      e('m', 'subscribed', { period: 'yearly', mock: true }),
    ];
    const r = buildReport(users, events, [], { days: null, excludeTest: true });
    expect(r.excludedTest).toBe(1);
    const wall = r.sections.find((s) => s.key === 'paywall')!;
    expect(wall.rows[0].slice(0, 4)).toEqual(['settings_fare', '1', '1', '100%']);
    expect(wall.rows[0][7]).toBe('1');
  });

  it('treats a sandbox purchase as a test device, never as revenue', () => {
    const users = [u('real'), u('tf')];
    const events = [
      e('real', 'paywall_viewed', { source: 'onboarding' }),
      e('real', 'subscribed', { period: 'weekly', source: 'onboarding', sandbox: false }),
      e('tf', 'paywall_viewed', { source: 'onboarding' }),
      e('tf', 'subscribed', { period: 'weekly', source: 'onboarding', sandbox: true }),
    ];
    const hidden = buildReport(users, events, [], { days: null, excludeTest: true });
    expect(hidden.excludedTest).toBe(1);
    expect(hidden.kpis.find((k) => k.label === 'Subscribed')!.value).toBe('1');
    const shown = buildReport(users, events, [], { days: null, excludeTest: false });
    expect(shown.kpis.find((k) => k.label === 'Subscribed')!.value).toBe('1'); // still not a sale
    const row = shown.sections.find((s) => s.key === 'installs')!.rows.find((r) => r[0] === 'tf')!;
    expect(row[10]).toBe('sandbox (weekly)');
  });

  it('marks a lapse and labels the subscription mirror by environment', () => {
    const users = [u('x')];
    const events = [e('x', 'subscribed', { period: 'weekly', sandbox: false }), e('x', 'unsubscribed', { sandbox: false })];
    const subs = [
      { device_id: 'x', plan: 'plus', status: 'ended', period: 'weekly', sandbox: 0, started_at: '2026-09-01T10:00:00Z', ended_at: '2026-09-08T10:00:00Z' },
      { device_id: 'x', plan: 'plus', status: 'active', period: 'weekly', sandbox: null, started_at: '2026-08-01T10:00:00Z', ended_at: null },
    ];
    const r = buildReport(users, events, subs, { days: null, excludeTest: true });
    const row = r.sections.find((s) => s.key === 'installs')!.rows[0];
    expect(row[10]).toBe('yes (weekly), lapsed');
    const mirror = r.sections.find((s) => s.key === 'subs')!.rows.map((x) => x[0]);
    expect(mirror).toContain('plus · weekly · ended');
    expect(mirror).toContain('unknown-env plus · weekly · active');
  });

  it('shows the fare each install chose, falling back to the last unlock for old builds', () => {
    const users = [u('new'), u('old')];
    const events = [
      e('new', 'onboarded', { language: 'es', level: 'A1', exercises: 5, minutes: 30 }),
      e('new', 'session_started', { language: 'es', level: 'A1', exercises: 8, minutes: 15 }),
      e('old', 'session_started', { language: 'de', level: 'A1' }),
      e('old', 'unlocked', { minutes: 35 }),
    ];
    const r = buildReport(users, events, [], { days: null, excludeTest: true });
    const rows = r.sections.find((s) => s.key === 'installs')!.rows;
    expect(rows.find((x) => x[0] === 'new')![5]).toBe('8 ex · 15 min');
    expect(rows.find((x) => x[0] === 'old')![5]).toBe('? ex · ~35 min');
    const fares = r.sections.find((s) => s.key === 'fares')!.rows.map((x) => x[0]);
    expect(fares).toContain('8 ex · 15 min');
  });

  it('names the deepest stage', () => {
    const users = [u('x')];
    const events = [e('x', 'app_open'), e('x', 'onboarding_step', { step: 'fare' })];
    const r = buildReport(users, events, [], { days: null, excludeTest: true });
    expect(r.sections.find((s) => s.key === 'stages')!.rows[0][0]).toBe('onboarding:fare');
    expect(typeof stageOf).toBe('function');
  });
});
