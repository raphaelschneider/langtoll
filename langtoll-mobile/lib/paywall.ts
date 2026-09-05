// One door to the paywall, and it remembers which gate the user came through.
// Every locked lever used to call router.push('/paywall') bare, so the
// paywall_viewed event could not say WHICH gate converts and which one only
// annoys — the single most useful number for tuning what Plus gates.
import { router } from 'expo-router';

export type PaywallSource =
  | 'settings'
  | 'settings_fare'
  | 'settings_strict'
  | 'settings_voice'
  | 'settings_topics'
  | 'settings_apps'
  | 'session_voice'
  | 'wallet_voice'
  | 'onboarding'
  | 'notification'
  | 'unknown';

export function openPaywall(source: PaywallSource): void {
  router.push({ pathname: '/paywall', params: { from: source } });
}
