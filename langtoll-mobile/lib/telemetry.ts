// Anonymous product telemetry. Fire-and-forget: never blocks the UI, never throws,
// silently drops events when offline, when no backend is configured, or when this
// is a dev/local build (see REPORTING_ENABLED — dev runs must not pollute prod). Only the
// anonymous install id + coarse events leave the device.
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getDeviceId } from './db/queries';

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
  | 'badge_earned'
  | 'paywall_viewed'
  | 'purchase_tapped'
  | 'purchase_cancelled'
  | 'purchase_failed'
  | 'purchase_unavailable'
  | 'restored'
  | 'subscribed'
  | 'unsubscribed';

export function track(event: TelemetryEvent, data?: Record<string, unknown>): void {
  if (!API_BASE || !REPORTING_ENABLED) return;
  try {
    const deviceId = getDeviceId();
    fetch(`${API_BASE}/api/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId,
        event,
        data,
        platform: Platform.OS,
        appVersion: Constants.expoConfig?.version ?? null,
      }),
    }).catch(() => {});
  } catch {
    // DB not open yet or other non-critical failure — drop the event.
  }
}
