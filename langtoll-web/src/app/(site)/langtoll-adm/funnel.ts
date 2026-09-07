// Conversion funnel for the admin — the "where exactly do we lose people" view.
//
// Ported from relift-adm's funnel (2026-09-07) so the two apps read the same way. Aggregates
// alone hide the leak on a small install base, so this pulls every event for the cohort and
// computes the whole story in one pass — install → onboarding step-by-step → paywall → trial
// → first pass → retention — plus a per-install table so any single journey can be read
// without the Support lookup.
//
// Everything is shaped as plain tables (`Section`) so the page, the copy-to-clipboard text and
// the CSV download render the SAME data — the page can never say something the export doesn't.
// Pure shaping lives in buildReport() (unit-tested); loadFunnel() is the only thing touching MySQL.
import { query } from '@/lib/db';

/** Mirror of STEPS in langtoll-mobile/app/onboarding.tsx — the order the onboarding is walked.
 *  'forms' only exists for languages with speaker-gendered forms (es/fr/it/pt); German and
 *  English learners skip it, so its "stopped here" count is meaningful only per language. */
export const ONBOARDING_STEPS = [
  'hook', 'how', 'name', 'language', 'difficulty', 'apps', 'mirror', 'when', 'fare', 'goal',
  'forms', 'printing', 'summary', 'paywall', 'lock',
] as const;
/** The paywall IS a step here (it is a screen of the flow); steps past it are only reached by people who saw it. */
export const PAYWALL_STEP = (ONBOARDING_STEPS as readonly string[]).indexOf('paywall');

export interface UserRow {
  device_id: string;
  app_version: string | null;
  plan: string | null;
  platform: string | null;
  created_at: Date | string;
  onboarded_at: Date | string | null;
  last_seen_at: Date | string | null;
}
export interface EventRow {
  device_id: string;
  event: string;
  data: unknown; // mysql2 hands JSON back parsed; tests may pass strings
  created_at: Date | string;
}
export interface SubRow {
  device_id: string;
  plan: string;
  status: string;
  period: string | null;
  started_at: Date | string;
  ended_at: Date | string | null;
}

export interface FunnelOptions {
  /** cohort = installs created in the last N days; null = all time */
  days: number | null;
  /** drop devices that ever fired a mock purchase or ran in the simulator */
  excludeTest: boolean;
}

export interface Section {
  key: string;
  title: string;
  note?: string;
  headers: string[];
  rows: string[][];
}

export interface Kpi {
  label: string;
  value: string;
  sub?: string;
}

export interface FunnelReport {
  generatedAt: string;
  window: string;
  installs: number;
  excludedTest: number;
  kpis: Kpi[];
  sections: Section[];
}

// ── helpers ────────────────────────────────────────────────────────────────

function asObj(data: unknown): Record<string, unknown> {
  if (!data) return {};
  if (typeof data === 'string') {
    try {
      const p = JSON.parse(data);
      return p && typeof p === 'object' ? (p as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return typeof data === 'object' ? (data as Record<string, unknown>) : {};
}

function toDate(v: Date | string | null | undefined): Date | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : '—');
const short = (id: string) => (id.length > 10 ? `…${id.slice(-8)}` : id);

/** Calendar days between two dates (UTC), floored. */
function daysBetween(a: Date, b: Date): number {
  return Math.floor((Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()) - Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate())) / 86400000);
}

// ── per-device rollup ──────────────────────────────────────────────────────

interface Device {
  id: string;
  version: string;
  plan: string;
  platform: string;
  created: Date;
  lastSeen: Date | null;
  isTest: boolean;
  opens: number;
  language: string | null;
  level: string | null;
  /** highest onboarding step index seen (-1 = no step events, i.e. a pre-build-17 install) */
  stepMax: number;
  stepSeen: Set<number>;
  onboarded: boolean;
  paywallFroms: string[];
  /** per entry point: what happened on THAT wall (a tap on the settings wall is not an onboarding tap) */
  walls: Map<string, { taps: number; cancelled: number; failed: number; unavailable: number }>;
  tapped: number;
  cancelled: number;
  failed: string[];
  unavailable: number;
  subscribed: boolean;
  subscribedFrom: string | null;
  subscribedPeriod: string | null;
  restored: boolean;
  sessionsStarted: number;
  sessionsCompleted: number;
  sessionsAbandoned: number;
  unlocks: number;
  listenFallbacks: number;
  activeDays: Set<string>;
}

function wall(d: Device, data: Record<string, unknown>) {
  const from = String(data.source ?? data.from ?? 'direct');
  let w = d.walls.get(from);
  if (!w) {
    w = { taps: 0, cancelled: 0, failed: 0, unavailable: 0 };
    d.walls.set(from, w);
  }
  return w;
}

function rollup(users: UserRow[], events: EventRow[]): Device[] {
  const byId = new Map<string, Device>();
  for (const u of users) {
    const created = toDate(u.created_at) ?? new Date(0);
    byId.set(u.device_id, {
      id: u.device_id,
      version: u.app_version ?? '?',
      plan: u.plan ?? 'free',
      platform: u.platform ?? '?',
      created,
      lastSeen: toDate(u.last_seen_at),
      isTest: (u.platform ?? '').toLowerCase().includes('sim'),
      opens: 0,
      language: null,
      level: null,
      stepMax: -1,
      stepSeen: new Set(),
      onboarded: !!u.onboarded_at,
      paywallFroms: [],
      walls: new Map(),
      tapped: 0,
      cancelled: 0,
      failed: [],
      unavailable: 0,
      subscribed: false,
      subscribedFrom: null,
      subscribedPeriod: null,
      restored: false,
      sessionsStarted: 0,
      sessionsCompleted: 0,
      sessionsAbandoned: 0,
      unlocks: 0,
      listenFallbacks: 0,
      activeDays: new Set(),
    });
  }
  for (const e of events) {
    const d = byId.get(e.device_id);
    if (!d) continue;
    const data = asObj(e.data);
    // Late-flushed events carry their real time in data.at (see mobile telemetry queue).
    const at = toDate(typeof data.at === 'string' ? data.at : null) ?? toDate(e.created_at);
    if (at) d.activeDays.add(dayKey(at));
    if (data.mock === true) d.isTest = true;
    switch (e.event) {
      case 'app_open':
        d.opens++;
        break;
      case 'onboarding_step': {
        const idx = (ONBOARDING_STEPS as readonly string[]).indexOf(String(data.step ?? ''));
        if (idx >= 0) {
          d.stepSeen.add(idx);
          if (idx > d.stepMax) d.stepMax = idx;
        }
        break;
      }
      case 'onboarded':
        d.onboarded = true;
        if (typeof data.language === 'string') d.language = data.language;
        if (typeof data.level === 'string') d.level = data.level;
        break;
      case 'paywall_viewed':
        d.paywallFroms.push(String(data.source ?? data.from ?? 'direct'));
        break;
      case 'purchase_tapped':
        d.tapped++;
        wall(d, data).taps++;
        break;
      case 'purchase_cancelled':
        d.cancelled++;
        wall(d, data).cancelled++;
        break;
      case 'purchase_failed':
        d.failed.push(String(data.reason ?? data.error ?? 'unknown'));
        wall(d, data).failed++;
        break;
      case 'purchase_unavailable':
        d.unavailable++;
        wall(d, data).unavailable++;
        break;
      case 'subscribed':
        if (data.mock === true) d.isTest = true;
        else {
          d.subscribed = true;
          d.subscribedFrom = String(data.source ?? data.from ?? 'direct');
          d.subscribedPeriod = typeof data.period === 'string' ? data.period : null;
        }
        break;
      case 'restored':
        d.restored = true;
        break;
      case 'session_started':
        d.sessionsStarted++;
        if (!d.language && typeof data.language === 'string') d.language = data.language;
        if (typeof data.level === 'string') d.level = data.level;
        break;
      case 'session_completed':
        d.sessionsCompleted++;
        break;
      case 'session_abandoned':
        d.sessionsAbandoned++;
        break;
      case 'unlocked':
        d.unlocks++;
        break;
      case 'listen_fallback_used':
        d.listenFallbacks++;
        break;
    }
  }
  return [...byId.values()];
}

/** Whether the device came back on a calendar day ≥ N days after install. */
function returnedAfter(d: Device, n: number): boolean {
  for (const day of d.activeDays) {
    if (daysBetween(d.created, new Date(`${day}T00:00:00Z`)) >= n) return true;
  }
  return false;
}

/** The deepest point of the journey a device reached — one word per install. */
export function stageOf(d: Device): string {
  if (d.subscribed) return 'subscribed';
  if (d.sessionsCompleted > 0) return 'paid the fare';
  if (d.sessionsStarted > 0) return 'started a session';
  if (d.onboarded) return 'onboarded';
  if (d.tapped > 0) return 'tapped buy';
  if (d.paywallFroms.length && d.stepMax < PAYWALL_STEP) return 'saw paywall';
  if (d.stepMax >= 0) return `onboarding:${ONBOARDING_STEPS[d.stepMax]}`;
  if (d.opens > 0) return 'opened';
  return 'installed';
}

// ── the report ─────────────────────────────────────────────────────────────

export function buildReport(users: UserRow[], events: EventRow[], subs: SubRow[], opts: FunnelOptions, now = new Date()): FunnelReport {
  const all = rollup(users, events);
  const devices = opts.excludeTest ? all.filter((d) => !d.isTest) : all;
  const excludedTest = all.length - devices.length;
  const n = devices.length;
  const count = (f: (d: Device) => boolean) => devices.filter(f).length;

  const sections: Section[] = [];

  // 1) Versions — the caveat first: onboarding step events only exist from build 17 on.
  {
    const byVer = new Map<string, Device[]>();
    for (const d of devices) (byVer.get(d.version) ?? byVer.set(d.version, []).get(d.version)!).push(d);
    sections.push({
      key: 'versions',
      title: 'Installs by app version',
      note: 'Onboarding step events ship from build 17 (Sep 5) — older builds show 0 step events, not 0 onboardings.',
      headers: ['version', 'installs', 'step events', 'onboarded', 'saw paywall', 'tapped buy', 'subscribed', 'paid a fare'],
      rows: [...byVer.entries()]
        .sort((a, b) => b[1].length - a[1].length)
        .map(([v, ds]) => [
          v,
          String(ds.length),
          String(ds.filter((d) => d.stepMax >= 0).length),
          String(ds.filter((d) => d.onboarded).length),
          String(ds.filter((d) => d.paywallFroms.length).length),
          String(ds.filter((d) => d.tapped > 0).length),
          String(ds.filter((d) => d.subscribed).length),
          String(ds.filter((d) => d.sessionsCompleted > 0).length),
        ]),
    });
  }

  // 1b) Languages — which course people pick, and whether the course changes behaviour.
  {
    const byLang = new Map<string, Device[]>();
    for (const d of devices) {
      const k = d.language ?? '?';
      (byLang.get(k) ?? byLang.set(k, []).get(k)!).push(d);
    }
    sections.push({
      key: 'languages',
      title: 'Installs by course language',
      note: 'From the onboarded / session_started events. "?" = never finished onboarding.',
      headers: ['course', 'installs', 'onboarded', 'saw paywall', 'subscribed', 'paid a fare', 'came back day 1+'],
      rows: [...byLang.entries()]
        .sort((a, b) => b[1].length - a[1].length)
        .map(([c, ds]) => [
          c,
          String(ds.length),
          String(ds.filter((d) => d.onboarded).length),
          String(ds.filter((d) => d.paywallFroms.length).length),
          String(ds.filter((d) => d.subscribed).length),
          String(ds.filter((d) => d.sessionsCompleted > 0).length),
          String(ds.filter((d) => returnedAfter(d, 1)).length),
        ]),
    });
  }

  // 2) Money funnel — strictly ordered; each row's % of previous is the step conversion.
  const money: [string, number][] = [
    ['Installed', n],
    ['Opened the app', count((d) => d.opens > 0)],
    ['Saw paywall (any)', count((d) => d.paywallFroms.length > 0)],
    ['Tapped buy', count((d) => d.tapped > 0)],
    ['Subscribed / trial started', count((d) => d.subscribed)],
  ];
  const stepPct = (c: number, prev: number) => (c > prev ? 'n/a (prior step unlogged on older builds)' : pct(c, prev));
  sections.push({
    key: 'money',
    title: 'Money funnel',
    note: '"% prev" is the conversion of that single step. Subscribed = real StoreKit purchase reported by the app (the simulator mock never reports one).',
    headers: ['stage', 'devices', '% installs', '% prev'],
    rows: money.map(([s, c], i) => [s, String(c), pct(c, n), i ? stepPct(c, money[i - 1][1]) : '—']),
  });

  // 3) Product funnel — value delivered regardless of paying.
  const olderThan = (days: number) => devices.filter((d) => daysBetween(d.created, now) >= days);
  const product: [string, number, number][] = [
    ['Installed', n, n],
    ['Finished onboarding', count((d) => d.onboarded), n],
    ['Started a session', count((d) => d.sessionsStarted > 0), n],
    ['Paid a fare (completed a session)', count((d) => d.sessionsCompleted > 0), n],
    ['Paid 3+ fares', count((d) => d.sessionsCompleted >= 3), n],
    ['Came back day 1+', olderThan(1).filter((d) => returnedAfter(d, 1)).length, olderThan(1).length],
    ['Came back day 3+', olderThan(3).filter((d) => returnedAfter(d, 3)).length, olderThan(3).length],
    ['Came back day 7+', olderThan(7).filter((d) => returnedAfter(d, 7)).length, olderThan(7).length],
    ['Came back day 14+', olderThan(14).filter((d) => returnedAfter(d, 14)).length, olderThan(14).length],
  ];
  sections.push({
    key: 'product',
    title: 'Product funnel & retention',
    note: 'Retention rows only count installs old enough to have had the chance (the "eligible" column).',
    headers: ['stage', 'devices', 'eligible', '% eligible'],
    rows: product.map(([s, c, e]) => [s, String(c), String(e), pct(c, e)]),
  });

  // 4) Onboarding step by step.
  const stepDevices = devices.filter((d) => d.stepMax >= 0);
  {
    const rows: string[][] = [];
    let prev = stepDevices.length;
    ONBOARDING_STEPS.forEach((step, i) => {
      const reached = stepDevices.filter((d) => d.stepMax >= i).length;
      // "stopped here" = this was the last screen seen and they never finished.
      const stopped = stepDevices.filter((d) => d.stepMax === i && !d.onboarded).length;
      rows.push([`${i + 1}. ${step}`, String(reached), pct(reached, stepDevices.length), String(prev - reached), String(stopped)]);
      prev = reached;
    });
    const finished = stepDevices.filter((d) => d.onboarded).length;
    rows.push(['— finished (onboarded)', String(finished), pct(finished, stepDevices.length), String(prev - finished), '—']);
    sections.push({
      key: 'onboarding',
      title: 'Onboarding step by step',
      note: `${stepDevices.length} installs have step events. "reached" = got at least this far; "stopped here" = last screen seen and never finished. 'forms' is skipped for German and English learners, so its "lost vs prev" is not a drop.`,
      headers: ['step', 'reached', '% of onboardings', 'lost vs prev', 'stopped here'],
      rows,
    });
  }

  // 5) Paywall by entry point.
  {
    const froms = new Map<string, Device[]>();
    for (const d of devices) for (const f of new Set(d.paywallFroms)) (froms.get(f) ?? froms.set(f, []).get(f)!).push(d);
    const rows = [...froms.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([f, ds]) => {
        const views = ds.length;
        const on = (k: 'taps' | 'cancelled' | 'failed' | 'unavailable') => ds.filter((d) => (d.walls.get(f)?.[k] ?? 0) > 0).length;
        const tapped = on('taps');
        const subbed = ds.filter((d) => d.subscribed && d.subscribedFrom === f).length;
        return [f, String(views), String(tapped), pct(tapped, views), String(on('cancelled')), String(on('failed')), String(on('unavailable')), String(subbed), pct(subbed, views)];
      });
    sections.push({
      key: 'paywall',
      title: 'Paywall by entry point',
      note: 'Devices, not impressions. Entry points are the gates in lib/paywall.ts (onboarding, settings_fare, session_voice, …). "subscribed" is attributed to the wall the purchase came from.',
      headers: ['from', 'viewers', 'tapped', 'tap rate', 'cancelled sheet', 'failed', 'unavailable', 'subscribed', 'sub rate'],
      rows,
    });
  }

  // 6) Purchase failures — the exact reason strings.
  {
    const errs = new Map<string, number>();
    for (const d of devices) for (const e of d.failed) errs.set(e, (errs.get(e) ?? 0) + 1);
    sections.push({
      key: 'failures',
      title: 'Purchase failures',
      headers: ['reason', 'count'],
      rows: [...errs.entries()].sort((a, b) => b[1] - a[1]).map(([e, c]) => [e, String(c)]),
    });
  }

  // 7) Subscription mirror — what the server's subscriptions table says, by period and status.
  {
    const cohort = new Set(devices.map((d) => d.id));
    const rows = new Map<string, number>();
    for (const s of subs) {
      if (!cohort.has(s.device_id)) continue;
      const k = `${s.plan} · ${s.period ?? '?'} · ${s.status}`;
      rows.set(k, (rows.get(k) ?? 0) + 1);
    }
    sections.push({
      key: 'subs',
      title: 'Subscriptions (server mirror)',
      note: 'The subscriptions table as written by the app / RevenueCat sync, for this cohort. Independent of the events above.',
      headers: ['plan · period · status', 'devices'],
      rows: [...rows.entries()].sort((a, b) => b[1] - a[1]).map(([k, c]) => [k, String(c)]),
    });
  }

  // 8) Where each install stopped — the one-word summary, counted.
  {
    const stages = new Map<string, number>();
    for (const d of devices) stages.set(stageOf(d), (stages.get(stageOf(d)) ?? 0) + 1);
    sections.push({
      key: 'stages',
      title: 'Where installs are right now',
      note: 'The deepest point each install reached. onboarding:<step> = quit inside onboarding on that screen.',
      headers: ['stage', 'installs', '%'],
      rows: [...stages.entries()].sort((a, b) => b[1] - a[1]).map(([s, c]) => [s, String(c), pct(c, n)]),
    });
  }

  // 9) Every install, one row — the table to paste when a number needs a face.
  sections.push({
    key: 'installs',
    title: 'Every install',
    note: 'Newest first. onboarding = last screen seen. paywall = entry points seen. sub = real subscription.',
    headers: ['device', 'joined', 'version', 'plan', 'course', 'opens', 'onboarding', 'paywall', 'tapped', 'sub', 'sessions', 'fares paid', 'abandoned', 'active days', 'last seen', 'stage'],
    rows: [...devices]
      .sort((a, b) => b.created.getTime() - a.created.getTime())
      .map((d) => [
        d.id,
        dayKey(d.created),
        d.version,
        d.plan,
        d.language ? `${d.language}${d.level ? ` ${d.level}` : ''}` : '—',
        String(d.opens),
        d.stepMax >= 0 ? `${d.stepMax + 1}/${ONBOARDING_STEPS.length} ${ONBOARDING_STEPS[d.stepMax]}${d.onboarded ? ' ✓' : ''}` : d.onboarded ? '✓' : '—',
        [...new Set(d.paywallFroms)].join('+') || '—',
        d.tapped ? String(d.tapped) : '—',
        d.subscribed ? `yes${d.subscribedPeriod ? ` (${d.subscribedPeriod})` : ''}` : d.restored ? 'restored' : '—',
        String(d.sessionsStarted),
        String(d.sessionsCompleted),
        String(d.sessionsAbandoned),
        String(d.activeDays.size),
        d.lastSeen ? dayKey(d.lastSeen) : '—',
        stageOf(d),
      ]),
  });

  const subscribed = count((d) => d.subscribed);
  const sawPaywall = count((d) => d.paywallFroms.length > 0);
  const onboarded = count((d) => d.onboarded);
  const paidFare = count((d) => d.sessionsCompleted > 0);
  const kpis: Kpi[] = [
    { label: 'Installs', value: String(n), sub: opts.days ? `last ${opts.days} days` : 'all time' },
    { label: 'Finished onboarding', value: String(onboarded), sub: `${pct(onboarded, n)} of installs` },
    { label: 'Paid a fare', value: String(paidFare), sub: `${pct(paidFare, onboarded)} of onboarded` },
    { label: 'Saw paywall', value: String(sawPaywall), sub: `${pct(sawPaywall, n)} of installs` },
    { label: 'Subscribed', value: String(subscribed), sub: `${pct(subscribed, sawPaywall)} of paywall viewers` },
  ];

  return {
    generatedAt: now.toISOString(),
    window: opts.days ? `installs in the last ${opts.days} days` : 'all installs',
    installs: n,
    excludedTest,
    kpis,
    sections,
  };
}

// ── renderers (shared by the copy button and the download) ─────────────────

export function reportToText(r: FunnelReport): string {
  const out: string[] = [];
  out.push(`# LangToll conversion funnel — ${r.window}`);
  out.push(`generated ${r.generatedAt} · ${r.installs} installs · ${r.excludedTest} test devices excluded`);
  out.push('');
  out.push(r.kpis.map((k) => `${k.label}: ${k.value}${k.sub ? ` (${k.sub})` : ''}`).join(' · '));
  for (const s of r.sections) out.push('', sectionToText(s));
  return out.join('\n');
}

/** One section as a Markdown table (title, note, header row, rows). */
export function sectionToText(s: Section): string {
  const out: string[] = [`## ${s.title}`];
  if (s.note) out.push(`_${s.note}_`);
  out.push('', `| ${s.headers.join(' | ')} |`, `| ${s.headers.map(() => '---').join(' | ')} |`);
  if (!s.rows.length) out.push(`| ${s.headers.map((_, i) => (i ? '' : '(none)')).join(' | ')} |`);
  for (const row of s.rows) out.push(`| ${row.map((c) => c.replace(/\|/g, '\\|')).join(' | ')} |`);
  return out.join('\n');
}

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export function reportToCsv(r: FunnelReport): string {
  const out: string[] = [];
  out.push(`# LangToll conversion funnel,${csvCell(r.window)},generated ${r.generatedAt},${r.installs} installs,${r.excludedTest} test devices excluded`);
  for (const s of r.sections) {
    out.push('', `# ${s.title}${s.note ? ` — ${s.note}` : ''}`);
    out.push(s.headers.map(csvCell).join(','));
    for (const row of s.rows) out.push(row.map(csvCell).join(','));
  }
  return out.join('\n');
}

// ── data access ────────────────────────────────────────────────────────────

export const FUNNEL_WINDOWS = [7, 30, 90, null] as const;

/** Parse ?days= — null/"all"/garbage → all time. */
export function parseDays(v: string | undefined): number | null {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.min(3650, Math.round(n)) : null;
}

export async function loadFunnel(opts: FunnelOptions): Promise<FunnelReport> {
  const where = opts.days ? 'WHERE created_at >= NOW() - INTERVAL ? DAY' : '';
  const params = opts.days ? [opts.days] : [];
  const [users, events, subs] = await Promise.all([
    query(`SELECT device_id, app_version, plan, platform, created_at, onboarded_at, last_seen_at FROM app_users ${where}`, params) as Promise<UserRow[]>,
    query(
      `SELECT e.device_id, e.event, e.data, e.created_at
       FROM app_events e
       JOIN app_users u ON u.device_id = e.device_id
       ${where ? where.replace('created_at', 'u.created_at') : ''}
       ORDER BY e.id
       LIMIT 500000`,
      params,
    ) as Promise<EventRow[]>,
    query(`SELECT device_id, plan, status, period, started_at, ended_at FROM subscriptions`) as Promise<SubRow[]>,
  ]);
  return buildReport(users, events, subs, opts);
}
