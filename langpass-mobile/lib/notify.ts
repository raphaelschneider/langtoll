// Notifications exist for exactly one reason: a ShieldActionExtension cannot open
// its containing app (Apple's position; see FB17261679), so the shield's
// "Practice now" posts a local notification and tapping it foregrounds LangPass
// on the practice screen. Without permission, that button does nothing at all —
// which is the bug this replaces.
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

/**
 * Ask for notification permission. Called right after Screen Time authorization,
 * where the user is already granting the app control over their apps — a second
 * prompt there reads as part of the same setup rather than an ambush at launch.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') return true;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.status === 'granted';
  } catch {
    return false;
  }
}

/**
 * Route a tapped shield notification to the practice screen.
 *
 * The shield writes `userInfo.url` into the payload; iOS does NOT follow it on
 * its own, so the app has to. Returns an unsubscribe function.
 */
export function handleNotificationTaps(): () => void {
  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as { url?: string } | undefined;
    if (typeof data?.url === 'string' && data.url.startsWith('langpass://')) {
      // Strip the scheme — expo-router navigates by path, not by URL.
      const path = data.url.replace(/^langpass:\/\/+/, '/');
      router.push(path as never);
    }
  });
  return () => sub.remove();
}
