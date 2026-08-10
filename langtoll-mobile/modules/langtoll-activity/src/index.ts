// JS face of the Live Activity bridge. Fail-soft everywhere: on Android, on
// simulators without the module, below iOS 16.2, or with Live Activities off in
// Settings, every call is a silent no-op — the pass works fine without the island.
import { Platform } from 'react-native';

let native: {
  areActivitiesEnabled(): boolean;
  startPassActivity(
    expiresAtMs: number,
    passenger: string,
    packLabel: string,
    serial: string,
    word: string | null,
    translation: string | null
  ): boolean;
  endPassActivity(): void;
  setWordRotation(pairsJson: string): void;
  getRotationDebug(): string | null;
  advanceWordRotation(): boolean;
} | null = null;

if (Platform.OS === 'ios') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    native = require('expo-modules-core').requireNativeModule('LangTollActivity');
  } catch {
    native = null; // Expo Go / stale binary — feature quietly absent
  }
}

/** Whether the native module is present at all (real build, not Expo Go /
 *  simulator stub) — gate any "activities are off" UI on this so a platform
 *  that never had the feature doesn't warn about it. */
export function activitySupported(): boolean {
  return native != null;
}

/** Whether iOS currently allows this app to start Live Activities (the
 *  Settings → Apps → LangToll → Live Activities toggle, surfaced for both
 *  the dev rig and the user-facing re-enable hint). */
export function areActivitiesEnabled(): boolean {
  try {
    return native?.areActivitiesEnabled() ?? false;
  } catch {
    return false;
  }
}

/** Start (or replace) the pass countdown Live Activity. */
export function startPassActivity(
  expiresAtMs: number,
  passenger: string,
  packLabel: string,
  serial: string,
  word: string | null = null,
  translation: string | null = null
): boolean {
  try {
    return (
      native?.startPassActivity(expiresAtMs, passenger, packLabel, serial, word, translation) ??
      false
    );
  } catch {
    return false;
  }
}

/**
 * Store the rotation deck (word/translation pairs) in the app group, where the
 * DeviceActivity extension advances through it on its background wake-ups.
 */
export function setWordRotation(pairs: [string, string][]): void {
  try {
    native?.setWordRotation(JSON.stringify(pairs));
  } catch {
    // no-op — the island simply keeps its first word
  }
}

/** The extension's last rotation report, for the dev tools screen. */
export function getRotationDebug(): string | null {
  try {
    return native?.getRotationDebug() ?? null;
  } catch {
    return null;
  }
}

/** Advance the island's word from the app — the documented update path. */
export function advanceWordRotation(): boolean {
  try {
    return native?.advanceWordRotation() ?? false;
  } catch {
    return false;
  }
}

/** End the countdown (pass expired or re-locked). */
export function endPassActivity(): void {
  try {
    native?.endPassActivity();
  } catch {
    // no-op
  }
}
