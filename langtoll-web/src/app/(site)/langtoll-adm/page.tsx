// LangPass admin dashboard — onboarding, engagement, and subscription numbers at a glance.
// Server-rendered straight from MySQL telemetry tables; refresh the page for live data.
import { query } from '@/lib/db';
import { getPricing, fmtPrice } from '@/lib/settings';
import { getUsageByDay, estimateCostUSD } from '@/lib/usage';
import { updatePricing } from './actions';
import { BarChart } from './Charts';

export const dynamic = 'force-dynamic';

// internal dashboard at the deliberately non-obvious /langpass-adm — Basic-auth gated in middleware,
// kept out of search engines, and (unlike /admin) NOT named in robots.txt so the path isn't leaked.
export const metadata = { robots: { index: false, follow: false } };

const BRAND = {
  ink: '#14110E',
  inkSoft: '#6B6258',
  paper: '#F6F3EE',
  surface: '#FFFFFF',
  line: '#E7E1D8',
  accent: '#C8553D',
  pine: '#2E5E4E',
  amber: '#D99A4E',
};

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

  return { totals, subs, signups, activity, events, recent };
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
      <div style={{ fontSize: 34, fontFamily: 'Georgia, serif', color: tint ?? BRAND.ink, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: BRAND.inkSoft, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// Tab bar — server-rendered links (state lives in ?tab=). Each tab fetches only its own data.
function Tabs({ active }: { active: 'dashboard' | 'support' }) {
  const tabs = [
    { key: 'dashboard' as const, label: 'Dashboard', href: '/langpass-adm' },
    { key: 'support' as const, label: 'Support', href: '/langpass-adm?tab=support' },
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
  const [{ totals, subs, signups, activity, events, recent }, pricing, usage] = await Promise.all([
    getStats(),
    getPricing(),
    getUsageByDay(30),
  ]);

  // AI usage + rough cost (images + chat turns). See lib/usage COST constants.
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayUsage = usage.find((u) => u.day === todayKey) ?? { images: 0, chats: 0, tokensIn: 0, tokensOut: 0 };
  const usage7 = usage.filter((u) => u.day >= new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10));
  const sum7 = usage7.reduce(
    (a, u) => ({ images: a.images + u.images, chats: a.chats + u.chats, tokensIn: a.tokensIn + u.tokensIn, tokensOut: a.tokensOut + u.tokensOut }),
    { images: 0, chats: 0, tokensIn: 0, tokensOut: 0 }
  );
  const costToday = estimateCostUSD(todayUsage);
  const costPerDay7 = usage7.length ? estimateCostUSD(sum7) / 7 : 0;
  const imageDays: DayCount[] = usage.map((u) => ({ day: u.day, n: u.images }));
  const chatDays: DayCount[] = usage.map((u) => ({ day: u.day, n: u.chats }));

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
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, margin: '36px 0 12px' }}>AI usage &amp; cost</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Stat label="Images today" value={String(todayUsage.images)} sub={`${sum7.images} in 7 days`} tint={BRAND.amber} hint={`${todayUsage.images} today · ${sum7.images} over the last 7 days`} />
          <Stat label="Chats today" value={String(todayUsage.chats)} sub={`${sum7.chats} in 7 days`} tint={BRAND.pine} hint={`${todayUsage.chats} today · ${sum7.chats} over the last 7 days`} />
          <Stat label="Est. cost today" value={`$${costToday.toFixed(2)}`} sub="images + chat tokens" tint={BRAND.accent} hint={`${todayUsage.images} images + ${(todayUsage.tokensIn + todayUsage.tokensOut).toLocaleString()} tokens ≈ $${costToday.toFixed(4)}`} />
          <Stat label="Est. $/day" value={`$${costPerDay7.toFixed(2)}`} sub="7-day average" hint={`$${estimateCostUSD(sum7).toFixed(2)} over 7 days ≈ $${costPerDay7.toFixed(4)}/day`} />
          <Stat label="Chat tokens (7d)" value={`${Math.round((sum7.tokensIn + sum7.tokensOut) / 1000)}k`} sub={`${Math.round(sum7.tokensIn / 1000)}k in · ${Math.round(sum7.tokensOut / 1000)}k out`} hint={`${(sum7.tokensIn + sum7.tokensOut).toLocaleString()} tokens · ${sum7.tokensIn.toLocaleString()} in / ${sum7.tokensOut.toLocaleString()} out`} />
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
          <BarChart data={imageDays} color={BRAND.amber} title="Images generated · last 30 days" />
          <BarChart data={chatDays} color={BRAND.pine} title="Chat turns · last 30 days" />
        </div>
        <div style={{ fontSize: 12, color: BRAND.inkSoft, marginTop: 8 }}>
          Rough estimate from public model prices (image ≈ $0.04, gpt-4o ≈ $2.50/$10 per 1M in/out tokens). Cached images aren’t billed. Plan-build &amp; swap calls aren’t counted yet.
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
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>Onboarded</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>Joined</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>Last seen</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((u: any) => (
                  <tr key={u.device_id} style={{ borderTop: `1px solid ${BRAND.line}` }}>
                    <td style={{ padding: '8px 4px', fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
                      {String(u.device_id).slice(0, 14)}…
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
              style={{ padding: '9px 22px', background: BRAND.accent, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Save
            </button>
          </form>
          <div style={{ fontSize: 12, color: BRAND.inkSoft, marginTop: 12 }}>
            Drives the langpass.app pricing card &amp; the MRR estimate. The app itself always shows the live App Store price.
          </div>
        </div>

        <div style={{ marginTop: 24, fontSize: 12, color: BRAND.inkSoft }}>
          Anonymous telemetry only — learning data never leaves users’ devices.
        </div>
    </>
  );
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ tab?: string; code?: string }> }) {
  const { tab, code } = await searchParams;
  const active: 'dashboard' | 'support' = tab === 'support' ? 'support' : 'dashboard';
  return (
    <main style={{ minHeight: '100vh', background: BRAND.paper, color: BRAND.ink, padding: '48px 32px', fontFamily: 'ui-sans-serif, system-ui' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: BRAND.accent, fontWeight: 700 }}>LangPass</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 40, margin: '4px 0 20px' }}>Admin</h1>
        <Tabs active={active} />
        {active === 'support' ? await SupportTab(code) : await DashboardTab()}
      </div>
    </main>
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
          <h3 style={{ fontFamily: 'Georgia, serif', margin: '20px 0 8px' }}>Device</h3>
          <table style={{ borderCollapse: 'collapse' }}><tbody>
            <tr><td style={cell}>device_id</td><td style={cell}><code>{deviceId}</code></td></tr>
            <tr><td style={cell}>platform / version</td><td style={cell}>{String(u.platform ?? '—')} · {String(u.app_version ?? '—')}</td></tr>
            <tr><td style={cell}>plan (mirror)</td><td style={cell}>{String(u.plan ?? 'free')}</td></tr>
            <tr><td style={cell}>onboarded / last seen</td><td style={cell}>{String(u.onboarded_at ?? '—')} · {String(u.last_seen_at ?? '—')}</td></tr>
          </tbody></table>

          <h3 style={{ fontFamily: 'Georgia, serif', margin: '20px 0 8px' }}>RevenueCat (live)</h3>
          <p style={{ fontSize: 14 }}>{rcUser ? <><code>{String(rcUser)}</code> — {rcLive}</> : rcLive}</p>

          <h3 style={{ fontFamily: 'Georgia, serif', margin: '20px 0 8px' }}>Subscription mirror</h3>
          <table style={{ borderCollapse: 'collapse' }}><tbody>
            {(subs as Record<string, unknown>[]).map((s2, i) => (
              <tr key={i}><td style={cell}>{String(s2.plan)} · {String(s2.period ?? '—')}</td><td style={cell}>{String(s2.status)}</td><td style={cell}>{String(s2.started_at)} → {String(s2.ended_at ?? 'now')}</td></tr>
            ))}
            {(subs as unknown[]).length === 0 ? <tr><td style={cell}>no subscription events</td></tr> : null}
          </tbody></table>

          <h3 style={{ fontFamily: 'Georgia, serif', margin: '20px 0 8px' }}>Attest keys (installs)</h3>
          <table style={{ borderCollapse: 'collapse' }}><tbody>
            {(keys as Record<string, unknown>[]).map((k, i) => (
              <tr key={i}><td style={cell}><code>{String(k.key_id).slice(0, 12)}…</code></td><td style={cell}>honeymoon_ok: {k.honeymoon_ok === null ? 'unevaluated' : String(k.honeymoon_ok)}</td><td style={cell}>created {String(k.created_at)}</td></tr>
            ))}
            {(keys as unknown[]).length === 0 ? <tr><td style={cell}>no attest keys for this device (older app version, or never reached a paid route)</td></tr> : null}
          </tbody></table>
        </div>
      );
    }
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, margin: '0 0 12px' }}>Support lookup</h2>
      <form method="get" action="/langpass-adm">
        <input type="hidden" name="tab" value="support" />
        <input
          name="code"
          defaultValue={rawCode ?? ''}
          placeholder="Support code, e.g. X8K2-M4QX"
          style={{ padding: '10px 14px', fontSize: 15, border: `1px solid ${BRAND.line}`, borderRadius: 8, width: 280, background: BRAND.surface }}
        />
        <button type="submit" style={{ marginLeft: 8, padding: '10px 18px', fontSize: 15, fontWeight: 600, border: 'none', borderRadius: 8, background: BRAND.accent, color: '#fff', cursor: 'pointer' }}>
          Look up
        </button>
      </form>
      {result}
    </div>
  );
}
