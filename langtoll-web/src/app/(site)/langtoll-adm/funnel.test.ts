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

  it('names the deepest stage', () => {
    const users = [u('x')];
    const events = [e('x', 'app_open'), e('x', 'onboarding_step', { step: 'fare' })];
    const r = buildReport(users, events, [], { days: null, excludeTest: true });
    expect(r.sections.find((s) => s.key === 'stages')!.rows[0][0]).toBe('onboarding:fare');
    expect(typeof stageOf).toBe('function');
  });
});
