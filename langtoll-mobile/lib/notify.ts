// Notifications exist for exactly one reason: a ShieldActionExtension cannot open
// its containing app (Apple's position; see FB17261679), so the shield's
// "Practice now" posts a local notification and tapping it foregrounds LangToll
// on the practice screen. Without permission, that button does nothing at all —
// which is the bug this replaces.
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Linking } from 'react-native';
import { t } from '@/lib/i18n';

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
    if (typeof data?.url === 'string' && data.url.startsWith('langtoll://')) {
      // Strip the scheme — expo-router navigates by path, not by URL.
      const path = data.url.replace(/^langtoll:\/\/+/, '/');
      router.push(path as never);
    }
  });
  return () => sub.remove();
}

/**
 * Whether notifications are currently allowed. The shield's "Practice now"
 * button posts one — with permission denied it does nothing at all, silently,
 * which is indistinguishable from the bug this whole flow replaced. So the app
 * has to be able to SEE the denial and say so.
 */
export async function notificationsGranted(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

/** Deep-link into this app's iOS settings page, where the toggle actually lives. */
export function openSystemSettings(): void {
  void Linking.openSettings();
}

const NUDGE_ID = 'daily-nudge';
const EXPIRY_ID = 'pass-expiry';

/** Resolve a bundled Tolly PNG into a notification attachment (best-effort). */
async function tollyAttachment(
  art: number
): Promise<Notifications.NotificationContentAttachmentIos[]> {
  try {
    const { Asset } = require('expo-asset');
    const asset = Asset.fromModule(art);
    await asset.downloadAsync();
    if (asset.localUri) return [{ identifier: 'tolly', url: asset.localUri, type: 'png' }];
  } catch {
    // text-only notification
  }
  return [];
}

/**
 * Heads-up at the TRUE expiry: the pass is done, the shield lands in
 * `graceMinutes`. Makes the re-lock grace legible — without it the delayed
 * shield reads as "the lock is broken". Replaces any pending notice.
 */
export function schedulePassExpiryNotice(expiresAtMs: number, graceMinutes: number): void {
  void (async () => {
    try {
      await Notifications.cancelScheduledNotificationAsync(EXPIRY_ID);
      const date = new Date(expiresAtMs);
      if (date <= new Date() || !(await notificationsGranted())) return;
      // Sad Tolly delivers the bad news himself.
      const attachments = await tollyAttachment(require('../assets/tolly/tolly-sad.png'));
      await Notifications.scheduleNotificationAsync({
        identifier: EXPIRY_ID,
        content: {
          title: t('expiry.title'),
          body: t('expiry.body', { mins: graceMinutes }),
          data: { url: 'langtoll://session' },
          interruptionLevel: 'timeSensitive',
          attachments,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
      });
    } catch {
      // best-effort — the re-lock itself never depends on this notice
    }
  })();
}

/** A manual/early lock or a fresh grant makes the pending notice moot. */
export function cancelPassExpiryNotice(): void {
  void Notifications.cancelScheduledNotificationAsync(EXPIRY_ID).catch(() => {});
}

/**
 * Sweep OUR delivered notifications out of Notification Center. Called when a
 * new pass is issued: a fresh countdown next to last run's "your pass expired"
 * banner reads as a contradiction (dismiss only touches this app's items).
 */
export function clearDeliveredNotifications(): void {
  void Notifications.dismissAllNotificationsAsync().catch(() => {});
}

/**
 * Daily practice nudge at the hour the USER named in onboarding ("when do you
 * lose the most time?") — the reminder lands at the moment of craving, not at a
 * generic morning slot (relift's v22 idea). Replaces any previous schedule so
 * an hour change never stacks notifications. Pass null to cancel outright.
 *
 * Fire-and-forget safe: silently does nothing without permission — the shield
 * setup already surfaces the denial where it matters.
 */
export async function scheduleDailyNudge(hour: number | null): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(NUDGE_ID);
    if (hour === null || !(await notificationsGranted())) return;
    // Stern Tolly rides along as the notification image (best-effort).
    const attachments = await tollyAttachment(require('../assets/tolly/tolly-stern.png'));
    await Notifications.scheduleNotificationAsync({
      identifier: NUDGE_ID,
      content: {
        title: t('nudge.title'),
        body: t('nudge.body'),
        data: { url: 'langtoll://session' },
        attachments,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });
  } catch {
    // best-effort — a failed schedule must never break onboarding or settings
  }
}
