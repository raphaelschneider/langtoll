// Anonymous product telemetry. Fire-and-forget: never blocks the UI, never throws,
// silently drops events when offline, when no backend is configured, or when this
// is a dev/local build (see REPORTING_ENABLED — dev runs must not pollute prod). Only the
// anonymous install id + coarse events leave the device.
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getDeviceId } from './device';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? null;

/**
 * Whether this build may report telemetry at all.
 *
 * Dev builds point at the PRODUCTION api by default (see .env), so without this
 * guard every simulator run, every Fast Refresh reload and every dev-tools
 * experiment writes real-looking events into prod analytics — which then get
 * read as user behaviour. Two exclusions:
 *
 *  - __DEV__            : Metro/dev-client builds
 *  - EXPO_PUBLIC_DEV_TOOLS : local Release builds carrying the dev voice lab and
 *                            plan switcher, which are equally not real usage
 *
 * A genuine EAS build has neither, so production reporting is unaffected.
 */
const REPORTING_ENABLED = !__DEV__ && process.env.EXPO_PUBLIC_DEV_TOOLS !== '1';

export type TelemetryEvent =
  | 'app_open'
  | 'onboarded'
  | 'blocking_enabled'
  | 'session_started'
  | 'session_completed'
  | 'session_abandoned'
  | 'locked'
  | 'unlocked'
  // A night off taken instead of turning the lock off (hours until it returns).
  | 'lock_paused'
  | 'badge_earned'
  // Fired when a user tells us mid-session that they cannot hear the audio.
  // Worth counting: if it is common, listening exercises are being planned for
  // people who cannot use them, and the default belongs somewhere else.
  | 'listen_fallback_used'
  // The Monday recap card was shown (fares / words / minutes of the week told).
  | 'recap_shown'
  // Funnel step views: one per onboarding screen seen (step: 'hook'…'lock').
  // Each answer in onboarding's three-question taste: n, correct, ms, type.
  | 'taste_answer'
  // The taste's done screen rendered: a stop after the fifth answer is a choice, not a crash.
  | 'taste_done'
  // A language the picker does not have, tapped on the 'Another language?' row.
  | 'language_wanted'
  // On the trial wall: 'Not now, just unlock my apps' — the shield is released, the wall stays.
  | 'lock_released'
  | 'onboarding_step'
  // The lock step (onboarding) and the app picker: what Screen Time answered when asked
  // (result granted / denied / error, with Apple's error code) and whether apps were
  // picked. Added 2026-09-28 after payers reached the lock step and never finished.
  // Notification permission asked on the "when" screen (granted true/false).
  | 'notify_permission'
  // After cancelling Apple's sheet: the one-tap answer to "what stopped you?".
  | 'purchase_cancel_reason'
  | 'lock_auth'
  | 'lock_apps_picked'
  | 'paywall_viewed'
  | 'purchase_tapped'
  | 'purchase_cancelled'
  | 'purchase_failed'
  | 'purchase_unavailable'
  | 'restored'
  // Once per launch: this install's RevenueCat app user id, so the admin can find
  // the customer at RevenueCat for any install, bought here or not.
  | 'rc_identity'
  // A Plus subscriber who turned off renewal, asked once on the next open: reason.
  | 'renewal_off_reason'
  | 'subscribed'
  | 'unsubscribed';

// Events go out one at a time, in the order they were tracked. As parallel
// fire-and-forget requests, two events from the same second reached the server
// swapped often enough that the admin timeline showed a back-arrow on a plain
// forward tap (2026-10-04). A request that hangs is cut after SEND_TIMEOUT_MS so
// it can never hold the rest of the queue.
const SEND_TIMEOUT_MS = 8000;
let queue: Promise<void> = Promise.resolve();

function send(body: string): Promise<void> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), SEND_TIMEOUT_MS);
  return fetch(`${API_BASE}/api/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal: ctl.signal,
  })
    .then(
      () => undefined,
      () => undefined,
    )
    .finally(() => clearTimeout(timer));
}

export function track(event: TelemetryEvent, data?: Record<string, unknown>): void {
  if (!API_BASE || !REPORTING_ENABLED) return;
  try {
    const deviceId = getDeviceId();
    // Pre-init window (initDeviceId not resolved yet): drop the event rather than
    // attribute it to a shared 'unknown' identity.
    if (deviceId === 'unknown') return;
    const body = JSON.stringify({
      deviceId,
      event,
      data,
      platform: Platform.OS,
      appVersion: Constants.expoConfig?.version ?? null,
    });
    queue = queue.then(() => send(body)).catch(() => undefined);
  } catch {
    // Serialisation or other non-critical failure — drop the event.
  }
}
