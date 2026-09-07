// LangToll admin dashboard — onboarding, engagement, and subscription numbers at a glance.
// Server-rendered straight from MySQL telemetry tables; refresh the page for live data.
import { query } from '@/lib/db';
import { getPricing, fmtPrice } from '@/lib/settings';
import { getUsageByDay, estimateCostUSD } from '@/lib/usage';
import { updatePricing, deleteDevice } from './actions';
import { BarChart } from './Charts';
import { BRAND, FONT } from './brand';
import { adminFontClassName } from '@/lib/fonts';
import { CopyButton } from './CopyButton';
import { loadFunnel, parseDays, reportToText, sectionToText, FUNNEL_WINDOWS } from './funnel';

export const dynamic = 'force-dynamic';

// internal dashboard at the deliberately non-obvious /langtoll-adm — Basic-auth gated in middleware,
// kept out of search engines, and (unlike /admin) NOT named in robots.txt so the path isn't leaked.
export const metadata = { robots: { index: false, follow: false } };

// Palette + type live in ./brand (shared with the charts and the copy button).

interface DayCount {
  day: string;
  n: number;
}

async function getStats() {
  const [totals] = await query(`
    SELECT
      COUNT(*) AS users,
      SUM(onboarded_at IS NOT NULL) AS onboarded,
      SUM(last_seen_at >= NOW() - INTERVAL 1 DAY) AS dau,
      SUM(last_seen_at >= NOW() - INTERVAL 7 DAY) AS wau
    FROM app_users`);

  const subs = await query(`
    SELECT period, COUNT(*) AS n FROM subscriptions WHERE status = 'active' GROUP BY period`);

  const signups: DayCount[] = (
    await query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day, COUNT(*) AS n
      FROM app_users
      WHERE created_at >= NOW() - INTERVAL 30 DAY
      GROUP BY day ORDER BY day`)
  ).map((r: any) => ({ day: r.day, n: Number(r.n) }));

  const activity: DayCount[] = (
    await query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day, COUNT(DISTINCT device_id) AS n
      FROM app_events
      WHERE created_at >= NOW() - INTERVAL 30 DAY
      GROUP BY day ORDER BY day`)
  ).map((r: any) => ({ day: r.day, n: Number(r.n) }));

  const events = await query(`
    SELECT event, COUNT(*) AS n
    FROM app_events
    WHERE created_at >= NOW() - INTERVAL 7 DAY
    GROUP BY event ORDER BY n DESC`);

  const recent = await query(`
    SELECT device_id, plan, platform, app_version,
           onboarded_at IS NOT NULL AS onboarded,
           DATE_FORMAT(last_seen_at, '%b %e, %H:%i') AS last_seen,
           DATE_FORMAT(created_at, '%b %e') AS joined
    FROM app_users ORDER BY last_seen_at DESC LIMIT 12`);

  // Per-device visibility (ported from relift 2026-07-31): the aggregates hid WHO does what — a
  // user could look like a ghost while practicing daily. Two grouped queries, tiny at this scale,
  // no new endpoint (server-rendered like everything else here).
  const weekByDevice = await query(`
    SELECT device_id, event, COUNT(*) AS n
    FROM app_events WHERE created_at >= NOW() - INTERVAL 7 DAY
    GROUP BY device_id, event`);
  const activityMap: Record<string, Record<string, number>> = {};
  for (const r of weekByDevice as any[]) {
    (activityMap[r.device_id] ??= {})[r.event] = Number(r.n);
  }
  // Which LANGUAGE·LEVEL each install practices, from session_completed events. Deliberately
  // coarse: the words a user studies never leave the phone (the privacy promise) — the language
  // and CEFR level already ride the telemetry event and are the most the server knows.
  const langsByDevice = await query(`
    SELECT device_id,
           CONCAT(JSON_UNQUOTE(JSON_EXTRACT(data, '$.language')), ' ',
                  JSON_UNQUOTE(JSON_EXTRACT(data, '$.level'))) AS ll
    FROM app_events WHERE event = 'session_completed' AND data IS NOT NULL
    GROUP BY device_id, ll`);
  const langsMap: Record<string, string[]> = {};
  for (const r of langsByDevice as any[]) {
    if (r.ll && !r.ll.includes('null')) (langsMap[r.device_id] ??= []).push(String(r.ll));
  }

  return { totals, subs, signups, activity, events, recent, activityMap, langsMap };
}

function Stat({ label, value, sub, tint, hint }: { label: string; value: string; sub?: string; tint?: string; hint?: string }) {
  return (
    <div
      title={hint}
      style={{
        background: BRAND.surface,
        border: `1px solid ${BRAND.line}`,
        borderRadius: 20,
        padding: '20px 24px',
        flex: 1,
        minWidth: 160,
        cursor: hint ? 'help' : undefined,
      }}
    >
      <div style={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: BRAND.inkSoft, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 34, fontFamily: FONT.display, fontWeight: 800, letterSpacing: -0.5, color: tint ?? BRAND.ink, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: BRAND.inkSoft, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// Tab bar — server-rendered links (state lives in ?tab=). Each tab fetches only its own data.
type TabKey = 'dashboard' | 'funnel' | 'support';
function Tabs({ active }: { active: TabKey }) {
  const tabs = [
    { key: 'dashboard' as const, label: 'Dashboard', href: '/langtoll-adm' },
    { key: 'funnel' as const, label: 'Funnel', href: '/langtoll-adm?tab=funnel' },
    { key: 'support' as const, label: 'Support', href: '/langtoll-adm?tab=support' },
  ];
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${BRAND.line}`, margin: '0 0 28px' }}>
      {tabs.map((t) => (
        <a
          key={t.key}
          href={t.href}
          style={{
            padding: '10px 18px',
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
            color: t.key === active ? BRAND.ink : BRAND.inkSoft,
            borderBottom: `2px solid ${t.key === active ? BRAND.accent : 'transparent'}`,
            marginBottom: -1,
          }}
        >
          {t.label}
        </a>
      ))}
    </div>
  );
}

// DASHBOARD tab — the operational/business numbers (users, subs, MRR, AI usage, events, pricing).
async function DashboardTab() {
  const [{ totals, subs, signups, activity, events, recent, activityMap, langsMap }, pricing, usage] = await Promise.all([
    getStats(),
    getPricing(),
    getUsageByDay(30),
  ]);

  // AI usage + rough cost (images + chat turns). See lib/usage COST constants.
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayUsage = usage.find((u) => u.day === todayKey) ?? { topics: 0, tts: 0, tokensIn: 0, tokensOut: 0, ttsChars: 0 };
  const usage7 = usage.filter((u) => u.day >= new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10));
  const sum7 = usage7.reduce(
    (a, u) => ({ topics: a.topics + u.topics, tts: a.tts + u.tts, tokensIn: a.tokensIn + u.tokensIn, tokensOut: a.tokensOut + u.tokensOut, ttsChars: a.ttsChars + u.ttsChars }),
    { topics: 0, tts: 0, tokensIn: 0, tokensOut: 0, ttsChars: 0 }
  );
  const costToday = estimateCostUSD(todayUsage);
  const costPerDay7 = usage7.length ? estimateCostUSD(sum7) / 7 : 0;
  const topicsDays: DayCount[] = usage.map((u) => ({ day: u.day, n: u.topics }));
  const ttsDays: DayCount[] = usage.map((u) => ({ day: u.day, n: u.tts }));

  const monthly = Number(subs.find((s: any) => s.period === 'monthly')?.n ?? 0);
  const yearly = Number(subs.find((s: any) => s.period === 'yearly')?.n ?? 0);
  const otherSubs = subs
    .filter((s: any) => s.period !== 'monthly' && s.period !== 'yearly')
    .reduce((a: number, s: any) => a + Number(s.n), 0);
  const activeSubs = monthly + yearly + otherSubs;
  const mrr = monthly * pricing.monthly + (yearly * pricing.yearly) / 12;

  const users = Number(totals.users ?? 0);
  const onboarded = Number(totals.onboarded ?? 0);
  const onboardRate = users ? Math.round((onboarded / users) * 100) : 0;
  const maxEvent = Math.max(1, ...events.map((e: any) => Number(e.n)));
  const totalEvents = events.reduce((a: number, e: any) => a + Number(e.n), 0);

  return (
    <>
        {/* KPIs */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Stat
            label="Users"
            value={String(users)}
            sub={`${Number(totals.wau ?? 0)} active this week`}
            hint={`${users} total · ${Number(totals.dau ?? 0)} active today · ${Number(totals.wau ?? 0)} active this week`}
          />
          <Stat
            label="Onboarded"
            value={String(onboarded)}
            sub={`${onboardRate}% of installs`}
            tint={BRAND.pine}
            hint={`${onboarded} of ${users} installs completed onboarding (${onboardRate}%)`}
          />
          <Stat
            label="Active subs"
            value={String(activeSubs)}
            sub={`${monthly} monthly · ${yearly} yearly`}
            tint={BRAND.accent}
            hint={`${monthly} monthly + ${yearly} yearly${otherSubs ? ` + ${otherSubs} other` : ''} = ${activeSubs} active`}
          />
          <Stat
            label="MRR"
            value={`$${mrr.toFixed(2)}`}
            sub="estimated"
            tint={BRAND.accent}
            hint={`${monthly} × ${fmtPrice(pricing.monthly, pricing.currency)} + ${yearly} × ${fmtPrice(pricing.yearly, pricing.currency)} ÷ 12 = $${mrr.toFixed(2)}/mo`}
          />
          <Stat label="Active today" value={String(Number(totals.dau ?? 0))} hint={`${Number(totals.dau ?? 0)} devices seen in the last 24h`} />
        </div>

        {/* Charts */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
          <BarChart data={signups} color={BRAND.accent} title="New users · last 30 days" />
          <BarChart data={activity} color={BRAND.pine} title="Daily active devices · last 30 days" />
        </div>

        {/* AI usage & cost */}
        <h2 style={{ fontFamily: FONT.display, fontWeight: 800, letterSpacing: -0.5, fontSize: 24, margin: '36px 0 12px' }}>AI usage &amp; cost</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Stat label="AI packs today" value={String(todayUsage.topics)} sub={`${sum7.topics} in 7 days`} tint={BRAND.amber} hint={`${todayUsage.topics} pack generations today · ${sum7.topics} over the last 7 days`} />
          <Stat label="Audio renders today" value={String(todayUsage.tts)} sub={`${sum7.tts} in 7 days`} tint={BRAND.pine} hint={`${todayUsage.tts} JIT tts files today · ${sum7.tts} over the last 7 days`} />
          <Stat label="Est. cost today" value={`$${costToday.toFixed(2)}`} sub="pack tokens + tts characters" tint={BRAND.accent} hint={`${(todayUsage.tokensIn + todayUsage.tokensOut).toLocaleString()} tokens + ${todayUsage.ttsChars.toLocaleString()} tts chars ≈ $${costToday.toFixed(4)}`} />
          <Stat label="Est. $/day" value={`$${costPerDay7.toFixed(2)}`} sub="7-day average" hint={`$${estimateCostUSD(sum7).toFixed(2)} over 7 days ≈ $${costPerDay7.toFixed(4)}/day`} />
          <Stat label="Chat tokens (7d)" value={`${Math.round((sum7.tokensIn + sum7.tokensOut) / 1000)}k`} sub={`${Math.round(sum7.tokensIn / 1000)}k in · ${Math.round(sum7.tokensOut / 1000)}k out`} hint={`${(sum7.tokensIn + sum7.tokensOut).toLocaleString()} tokens · ${sum7.tokensIn.toLocaleString()} in / ${sum7.tokensOut.toLocaleString()} out`} />
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
          <BarChart data={topicsDays} color={BRAND.amber} title="AI packs generated · last 30 days" />
          <BarChart data={ttsDays} color={BRAND.pine} title="Audio files rendered · last 30 days" />
        </div>
        <div style={{ fontSize: 12, color: BRAND.inkSoft, marginTop: 8 }}>
          Rough estimate from public model prices (gpt-4o ≈ $2.50/$10 per 1M in/out tokens, tts ≈ $15 per 1M characters). Cached packs and already-rendered audio aren’t billed — this counts actual OpenAI calls only.
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16, alignItems: 'flex-start' }}>
          {/* Events 7d */}
          <div style={{ background: BRAND.surface, border: `1px solid ${BRAND.line}`, borderRadius: 20, padding: 24, flex: 1, minWidth: 300 }}>
            <div style={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: BRAND.inkSoft, fontWeight: 600, marginBottom: 16 }}>
              Events · last 7 days
            </div>
            {events.length === 0 && <div style={{ color: BRAND.inkSoft, fontSize: 14 }}>No events yet.</div>}
            {events.map((e: any) => (
              <div
                key={e.event}
                title={`${e.event}: ${Number(e.n).toLocaleString()} events · ${Math.round((Number(e.n) / totalEvents) * 100)}% of last 7 days`}
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, cursor: 'help' }}
              >
                <div style={{ width: 130, fontSize: 13, color: BRAND.ink }}>{e.event}</div>
                <div style={{ flex: 1, height: 8, background: BRAND.line, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(Number(e.n) / maxEvent) * 100}%`, height: '100%', background: BRAND.amber }} />
                </div>
                <div style={{ width: 40, textAlign: 'right', fontSize: 13, color: BRAND.inkSoft }}>{String(e.n)}</div>
              </div>
            ))}
          </div>

          {/* Recent users */}
          <div style={{ background: BRAND.surface, border: `1px solid ${BRAND.line}`, borderRadius: 20, padding: 24, flex: 1.4, minWidth: 380 }}>
            <div style={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: BRAND.inkSoft, fontWeight: 600, marginBottom: 16 }}>
              Recent users
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ color: BRAND.inkSoft, textAlign: 'left' }}>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>Device</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>Plan</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>Learning</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }} title="last 7 days: opens · sessions · unlocks">7d o·s·u</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>Onboarded</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>Joined</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>Last seen</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((u: any) => (
                  <tr key={u.device_id} style={{ borderTop: `1px solid ${BRAND.line}` }}>
                    <td style={{ padding: '8px 4px', fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
                      {/* → the Support drill-down (same page, ?tab=support) — full event timeline */}
                      <a href={`/langtoll-adm?tab=support&code=${String(u.device_id).replace(/^dev_/, '').slice(0, 8)}`} style={{ color: 'inherit' }}>
                        {String(u.device_id).slice(0, 14)}…
                      </a>
                    </td>
                    <td style={{ padding: '8px 4px' }}>
                      <span
                        style={{
                          padding: '2px 10px',
                          borderRadius: 999,
                          fontSize: 12,
                          background: u.plan === 'plus' ? BRAND.accent : BRAND.line,
                          color: u.plan === 'plus' ? '#fff' : BRAND.inkSoft,
                        }}
                      >
                        {u.plan}
                      </span>
                    </td>
                    <td style={{ padding: '8px 4px', color: BRAND.inkSoft, fontSize: 12 }}>
                      {(langsMap[u.device_id] ?? []).join(' · ') || '—'}
                    </td>
                    <td style={{ padding: '8px 4px', color: BRAND.inkSoft, fontSize: 12, fontFamily: 'ui-monospace, monospace' }}>
                      {`${(activityMap[u.device_id] ?? {}).app_open ?? 0}·${(activityMap[u.device_id] ?? {}).session_completed ?? 0}·${(activityMap[u.device_id] ?? {}).unlocked ?? 0}`}
                    </td>
                    <td style={{ padding: '8px 4px' }}>{u.onboarded ? '✓' : '—'}</td>
                    <td style={{ padding: '8px 4px', color: BRAND.inkSoft }}>{u.joined}</td>
                    <td style={{ padding: '8px 4px', color: BRAND.inkSoft }}>{u.last_seen ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing editor — MySQL is the source of truth for the landing card + MRR */}
        <div style={{ background: BRAND.surface, border: `1px solid ${BRAND.line}`, borderRadius: 20, padding: 24, marginTop: 16, maxWidth: 520 }}>
          <div style={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: BRAND.inkSoft, fontWeight: 600, marginBottom: 4 }}>
            Pricing
          </div>
          <div style={{ fontSize: 13, color: BRAND.inkSoft, marginBottom: 14 }}>
            Current: <strong style={{ color: BRAND.ink }}>{fmtPrice(pricing.monthly, pricing.currency)}/mo</strong> ·{' '}
            <strong style={{ color: BRAND.ink }}>{fmtPrice(pricing.yearly, pricing.currency)}/yr</strong>
          </div>
          <form action={updatePricing} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {[
              { name: 'monthly', label: 'Monthly', value: pricing.monthly, w: 110 },
              { name: 'yearly', label: 'Yearly', value: pricing.yearly, w: 110 },
            ].map((f) => (
              <label key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: BRAND.inkSoft }}>
                {f.label}
                <input
                  name={f.name}
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={f.value}
                  required
                  style={{ width: f.w, padding: '8px 10px', border: `1px solid ${BRAND.line}`, borderRadius: 10, fontSize: 15, color: BRAND.ink }}
                />
              </label>
            ))}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: BRAND.inkSoft }}>
              Currency
              <input
                name="currency"
                defaultValue={pricing.currency}
                maxLength={3}
                style={{ width: 70, padding: '8px 10px', border: `1px solid ${BRAND.line}`, borderRadius: 10, fontSize: 15, color: BRAND.ink, textTransform: 'uppercase' }}
              />
            </label>
            <button
              type="submit"
              style={{ padding: '9px 22px', background: BRAND.accent, color: BRAND.onAccent, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Save
            </button>
          </form>
          <div style={{ fontSize: 12, color: BRAND.inkSoft, marginTop: 12 }}>
            Drives the langtoll.app pricing card &amp; the MRR estimate. The app itself always shows the live App Store price.
          </div>
        </div>

        <div style={{ marginTop: 24, fontSize: 12, color: BRAND.inkSoft }}>
          Anonymous telemetry only — learning data never leaves users’ devices.
        </div>
    </>
  );
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ tab?: string; code?: string; days?: string; test?: string }> }) {
  const { tab, code, days, test } = await searchParams;
  const active: TabKey = tab === 'support' ? 'support' : tab === 'funnel' ? 'funnel' : 'dashboard';
  return (
    <main className={adminFontClassName} style={{ minHeight: '100vh', background: BRAND.paper, color: BRAND.ink, padding: '48px 32px', fontFamily: FONT.display }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: BRAND.accent, fontWeight: 700, fontFamily: FONT.mono }}>LangToll</div>
        <h1 style={{ fontFamily: FONT.display, fontWeight: 800, letterSpacing: -0.5, fontSize: 40, margin: '4px 0 20px' }}>Admin</h1>
        <Tabs active={active} />
        {active === 'support' ? await SupportTab(code) : active === 'funnel' ? await FunnelTab(days, test) : await DashboardTab()}
      </div>
    </main>
  );
}

// FUNNEL tab — where installs are lost, step by step (see ./funnel.ts). Every table has its own
// copy button and the whole report downloads as CSV/Markdown, so a number can be pasted into a
// conversation with its context attached. Ported from relift-adm.
async function FunnelTab(daysRaw?: string, testRaw?: string) {
  const days = parseDays(daysRaw);
  const excludeTest = testRaw !== '1';
  const report = await loadFunnel({ days, excludeTest });
  const href = (d: number | null, t: boolean) => `/langtoll-adm?tab=funnel${d ? `&days=${d}` : ''}${t ? '&test=1' : ''}`;
  const exportHref = (fmt: 'csv' | 'txt') => `/langtoll-adm/export?fmt=${fmt}&days=${days ?? 'all'}${excludeTest ? '' : '&test=1'}`;
  const pill = (label: string, on: boolean, to: string) => (
    <a
      key={label}
      href={to}
      style={{
        padding: '6px 12px',
        fontSize: 13,
        fontWeight: 600,
        textDecoration: 'none',
        borderRadius: 999,
        border: `1px solid ${on ? BRAND.accent : BRAND.line}`,
        background: on ? BRAND.accent : BRAND.surface,
        color: on ? BRAND.onAccent : BRAND.ink,
      }}
    >
      {label}
    </a>
  );
  const btn: React.CSSProperties = { padding: '6px 12px', fontSize: 13, fontWeight: 600, textDecoration: 'none', border: `1px solid ${BRAND.line}`, borderRadius: 8, background: BRAND.surface, color: BRAND.ink };
  // One stylesheet for every table cell: the "Every install" table alone is many hundred cells,
  // and a style object per cell is serialized into the RSC payload once per cell.
  const css = `
    .fn-table { border-collapse: collapse; font-size: 13px; min-width: 100%; }
    .fn-table th { padding: 6px 8px; font-weight: 600; text-align: left; white-space: nowrap; color: ${BRAND.inkSoft}; border-bottom: 1px solid ${BRAND.line}; }
    .fn-table td { padding: 6px 8px; border-bottom: 1px solid ${BRAND.line}; white-space: nowrap; vertical-align: top; }
    .fn-table td.mono { font-family: var(--font-jetbrains), ui-monospace, monospace; font-size: 12px; }
    .fn-table td.empty { color: ${BRAND.inkSoft}; }
  `;

  return (
    <div>
      <style>{css}</style>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        {FUNNEL_WINDOWS.map((w) => pill(w ? `${w} days` : 'All time', days === w, href(w, !excludeTest)))}
        <span style={{ width: 12 }} />
        {pill(excludeTest ? 'Test devices hidden' : 'Test devices shown', !excludeTest, href(days, excludeTest))}
        <span style={{ flex: 1 }} />
        <CopyButton text={reportToText(report)} label="Copy whole report" />
        <a href={exportHref('csv')} style={btn}>Download CSV</a>
        <a href={exportHref('txt')} style={btn}>Download .md</a>
      </div>
      <div style={{ fontSize: 13, color: BRAND.inkSoft, marginBottom: 16 }}>
        {report.window} · generated {report.generatedAt.replace('T', ' ').slice(0, 16)} UTC · {report.excludedTest} test device{report.excludedTest === 1 ? '' : 's'} {excludeTest ? 'hidden' : 'included'}
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {report.kpis.map((k) => (
          <Stat key={k.label} label={k.label} value={k.value} sub={k.sub} />
        ))}
      </div>

      {report.sections.map((s) => (
        <div key={s.key} style={{ background: BRAND.surface, border: `1px solid ${BRAND.line}`, borderRadius: 20, padding: 24, marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: s.note ? 4 : 14 }}>
            <h2 style={{ fontFamily: FONT.display, fontWeight: 800, letterSpacing: -0.5, fontSize: 22, margin: 0, flex: 1 }}>{s.title}</h2>
            <CopyButton text={sectionToText(s)} />
          </div>
          {s.note && <div style={{ fontSize: 13, color: BRAND.inkSoft, marginBottom: 14 }}>{s.note}</div>}
          <div style={{ overflowX: 'auto' }}>
            <table className="fn-table">
              <thead>
                <tr>{s.headers.map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {s.rows.length === 0 && (
                  <tr><td className="empty" colSpan={s.headers.length}>nothing yet</td></tr>
                )}
                {s.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j} className={j === 0 && s.key === 'installs' ? 'mono' : undefined}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Support lookup: a user reads their Support code out of Settings (the short form of their
 * anonymous device id) and we resolve everything the server knows — app_users, subscription
 * mirror, attest key + honeymoon verdict, and a LIVE RevenueCat check when an rc_user is on
 * file. No accounts, no PII: the code only exists if the user chooses to share it.
 */
async function SupportTab(rawCode?: string) {
  const code = (rawCode ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
  let result: React.ReactNode = null;

  if (code.length >= 6) {
    const like = `dev_${code}%`;
    const users = await query('SELECT device_id, platform, app_version, plan, onboarded_at, last_seen_at FROM app_users WHERE device_id LIKE ? LIMIT 5', [like]);
    if (!Array.isArray(users) || users.length === 0) {
      result = <p style={{ color: BRAND.inkSoft }}>No device matches code “{code}”.</p>;
    } else if (users.length > 1) {
      result = <p style={{ color: BRAND.inkSoft }}>Code “{code}” is ambiguous ({users.length} devices) — ask the user for the full code.</p>;
    } else {
      const u = users[0] as Record<string, unknown>;
      const deviceId = String(u.device_id);
      const subs = await query('SELECT plan, status, period, rc_user, started_at, ended_at FROM subscriptions WHERE device_id = ? ORDER BY id DESC LIMIT 5', [deviceId]);
      const keys = await query('SELECT key_id, honeymoon_ok, sign_count, created_at FROM attest_keys WHERE device_id = ? ORDER BY created_at DESC LIMIT 5', [deviceId]);
      // The install's whole story, event by event — the view that answers "what is this person
      // actually doing?" without guessing from aggregates. Server-rendered; no extra endpoint.
      const timeline = await query(
        "SELECT event, data, DATE_FORMAT(created_at, '%b %e, %H:%i') AS at FROM app_events WHERE device_id = ? ORDER BY id DESC LIMIT 60",
        [deviceId]
      );
      const rcUser = (Array.isArray(subs) && (subs.find((s: Record<string, unknown>) => s.rc_user) as Record<string, unknown> | undefined)?.rc_user) || null;

      let rcLive: string = rcUser ? 'RC check failed' : 'no RevenueCat id on file (purchase predates rc_user capture, or no purchase)';
      if (rcUser && process.env.REVENUECAT_SECRET_KEY) {
        try {
          const res = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(String(rcUser))}`, {
            headers: { Authorization: `Bearer ${process.env.REVENUECAT_SECRET_KEY}` },
            cache: 'no-store',
          });
          if (res.ok) {
            const body = await res.json();
            const ent = body?.subscriber?.entitlements?.[process.env.REVENUECAT_ENTITLEMENT || 'plus'];
            rcLive = ent
              ? `entitlement '${process.env.REVENUECAT_ENTITLEMENT || 'plus'}' — expires ${ent.expires_date ?? 'never'}${ent.expires_date && new Date(ent.expires_date) > new Date() ? ' (ACTIVE)' : ' (EXPIRED)'}`
              : 'subscriber known, entitlement never granted';
          } else if (res.status === 404) {
            rcLive = 'unknown subscriber at RevenueCat';
          } else {
            rcLive = `RevenueCat HTTP ${res.status}`;
          }
        } catch {
          /* leave the failure message */
        }
      }

      const cell: React.CSSProperties = { padding: '6px 12px', borderBottom: `1px solid ${BRAND.line}`, fontSize: 14, textAlign: 'left' };
      result = (
        <div>
          <h3 style={{ fontFamily: FONT.display, fontWeight: 800, letterSpacing: -0.5, margin: '20px 0 8px' }}>Device</h3>
          <table style={{ borderCollapse: 'collapse' }}><tbody>
            <tr><td style={cell}>device_id</td><td style={cell}><code>{deviceId}</code></td></tr>
            <tr><td style={cell}>platform / version</td><td style={cell}>{String(u.platform ?? '—')} · {String(u.app_version ?? '—')}</td></tr>
            <tr><td style={cell}>plan (mirror)</td><td style={cell}>{String(u.plan ?? 'free')}</td></tr>
            <tr><td style={cell}>onboarded / last seen</td><td style={cell}>{String(u.onboarded_at ?? '—')} · {String(u.last_seen_at ?? '—')}</td></tr>
          </tbody></table>

          <h3 style={{ fontFamily: FONT.display, fontWeight: 800, letterSpacing: -0.5, margin: '20px 0 8px' }}>RevenueCat (live)</h3>
          <p style={{ fontSize: 14 }}>{rcUser ? <><code>{String(rcUser)}</code> — {rcLive}</> : rcLive}</p>

          <h3 style={{ fontFamily: FONT.display, fontWeight: 800, letterSpacing: -0.5, margin: '20px 0 8px' }}>Subscription mirror</h3>
          <table style={{ borderCollapse: 'collapse' }}><tbody>
            {(subs as Record<string, unknown>[]).map((s2, i) => (
              <tr key={i}><td style={cell}>{String(s2.plan)} · {String(s2.period ?? '—')}</td><td style={cell}>{String(s2.status)}</td><td style={cell}>{String(s2.started_at)} → {String(s2.ended_at ?? 'now')}</td></tr>
            ))}
            {(subs as unknown[]).length === 0 ? <tr><td style={cell}>no subscription events</td></tr> : null}
          </tbody></table>

          <h3 style={{ fontFamily: FONT.display, fontWeight: 800, letterSpacing: -0.5, margin: '20px 0 8px' }}>Attest keys (installs)</h3>
          <table style={{ borderCollapse: 'collapse' }}><tbody>
            {(keys as Record<string, unknown>[]).map((k, i) => (
              <tr key={i}><td style={cell}><code>{String(k.key_id).slice(0, 12)}…</code></td><td style={cell}>honeymoon_ok: {k.honeymoon_ok === null ? 'unevaluated' : String(k.honeymoon_ok)}</td><td style={cell}>created {String(k.created_at)}</td></tr>
            ))}
            {(keys as unknown[]).length === 0 ? <tr><td style={cell}>no attest keys for this device (older app version, or never reached a paid route)</td></tr> : null}
          </tbody></table>

          <h3 style={{ fontFamily: FONT.display, fontWeight: 800, letterSpacing: -0.5, margin: '20px 0 8px' }}>Activity — last 60 events</h3>
          <table style={{ borderCollapse: 'collapse' }}><tbody>
            {(timeline as Record<string, unknown>[]).map((ev, i) => (
              <tr key={i}>
                <td style={cell}>{String(ev.at)}</td>
                <td style={cell}><strong>{String(ev.event)}</strong></td>
                <td style={{ ...cell, color: BRAND.inkSoft, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
                  {ev.data ? (typeof ev.data === 'string' ? ev.data : JSON.stringify(ev.data)).slice(0, 90) : ''}
                </td>
              </tr>
            ))}
            {(timeline as unknown[]).length === 0 ? <tr><td style={cell}>no events recorded for this device</td></tr> : null}
          </tbody></table>

          {/* Forget this install: events, subscription mirror, attest keys, user
              row. The app re-registers on its next event, so this is a server-side
              memory wipe, not a remote uninstall. */}
          <form action={deleteDevice} style={{ marginTop: 24 }}>
            <input type="hidden" name="deviceId" value={deviceId} />
            <button
              type="submit"
              style={{
                padding: '8px 16px', borderRadius: 8, border: '1px solid #c33',
                background: 'transparent', color: '#c33', cursor: 'pointer', fontSize: 13,
              }}
            >
              Delete this device (events, keys, subscription)
            </button>
          </form>
        </div>
      );
    }
  }

  return (
    <div>
      <h2 style={{ fontFamily: FONT.display, fontWeight: 800, letterSpacing: -0.5, fontSize: 24, margin: '0 0 12px' }}>Support lookup</h2>
      <form method="get" action="/langtoll-adm">
        <input type="hidden" name="tab" value="support" />
        <input
          name="code"
          defaultValue={rawCode ?? ''}
          placeholder="Support code, e.g. X8K2-M4QX"
          style={{ padding: '10px 14px', fontSize: 15, border: `1px solid ${BRAND.line}`, borderRadius: 8, width: 280, background: BRAND.surface }}
        />
        <button type="submit" style={{ marginLeft: 8, padding: '10px 18px', fontSize: 15, fontWeight: 600, border: 'none', borderRadius: 8, background: BRAND.accent, color: BRAND.onAccent, cursor: 'pointer' }}>
          Look up
        </button>
      </form>
      {result}
    </div>
  );
}
