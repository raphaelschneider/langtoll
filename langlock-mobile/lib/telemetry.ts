// Anonymous product telemetry. Fire-and-forget: never blocks the UI, never throws,
// silently drops events when offline or when no backend is configured (the beta has
// no server — events only flow once EXPO_PUBLIC_API_URL points at one). Only the
// anonymous install id + coarse events leave the device.
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getDeviceId } from './db/queries';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? null;

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
  if (!API_BASE) return;
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
