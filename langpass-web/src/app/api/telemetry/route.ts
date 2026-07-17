// Anonymous usage telemetry from the mobile app. No personal data — only an anonymous
// install id (device_id) and coarse product events, so the admin dashboard can show
// onboarding, engagement, and subscription numbers. All recovery data stays on-device.
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { rateLimit, LIMITS } from '@/lib/ratelimit';
import { readJsonLimited, BODY_LIMITS } from '@/lib/bodylimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KNOWN_EVENTS = new Set([
  'app_open',
  'onboarded',
  'injury_added',
  'checkin',
  'session_logged',
  'plan_completed',
  'badge_earned',
  'paywall_viewed',
  'subscribed',
  'restored',
  'unsubscribed',
]);

interface TelemetryBody {
  deviceId?: string;
  event?: string;
  data?: Record<string, unknown>;
  platform?: string;
  appVersion?: string;
}

export async function POST(req: NextRequest) {
  // Cap DB-write spam (best-effort; the client treats telemetry as fire-and-forget and ignores 429s).
  const limited = await rateLimit(req, 'telemetry', LIMITS.telemetry);
  if (limited) return limited;
  const parsed = await readJsonLimited<TelemetryBody>(req, BODY_LIMITS.telemetry);
  if (!parsed.ok) return parsed.res;
  const body = parsed.data;

  const { deviceId, event, data, platform, appVersion } = body;
  if (!deviceId || !event || !KNOWN_EVENTS.has(event)) {
    return NextResponse.json({ error: 'deviceId and a known event are required' }, { status: 400 });
  }

  try {
    // Upsert the user row and stamp last_seen.
    await query(
      `INSERT INTO app_users (device_id, platform, app_version, last_seen_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         last_seen_at = NOW(),
         app_version = COALESCE(VALUES(app_version), app_version)`,
      [deviceId, platform ?? 'ios', appVersion ?? null]
    );

    await query('INSERT INTO app_events (device_id, event, data) VALUES (?, ?, ?)', [
      deviceId,
      event,
      data ? JSON.stringify(data) : null,
    ]);

    if (event === 'onboarded') {
      await query('UPDATE app_users SET onboarded_at = COALESCE(onboarded_at, NOW()) WHERE device_id = ?', [deviceId]);
    } else if (event === 'subscribed' || event === 'restored') {
      const plan = typeof data?.plan === 'string' ? data.plan : 'plus';
      const period = typeof data?.period === 'string' ? data.period : null;
      // The app's RevenueCat anonymous id — lets a support lookup do a live RC check.
      const rcUser = typeof data?.rcUser === 'string' ? data.rcUser.slice(0, 80) : null;
      await query("UPDATE subscriptions SET status = 'ended', ended_at = NOW() WHERE device_id = ? AND status = 'active'", [deviceId]);
      await query('INSERT INTO subscriptions (device_id, plan, period, rc_user) VALUES (?, ?, ?, ?)', [deviceId, plan, period, rcUser]);
      await query('UPDATE app_users SET plan = ? WHERE device_id = ?', [plan, deviceId]);
    } else if (event === 'unsubscribed') {
      await query("UPDATE subscriptions SET status = 'ended', ended_at = NOW() WHERE device_id = ? AND status = 'active'", [deviceId]);
      await query("UPDATE app_users SET plan = 'free' WHERE device_id = ?", [deviceId]);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'telemetry failed' },
      { status: 500 }
    );
  }
}
