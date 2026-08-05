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
} | null = null;

if (Platform.OS === 'ios') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    native = require('expo-modules-core').requireNativeModule('LangTollActivity');
  } catch {
    native = null; // Expo Go / stale binary — feature quietly absent
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

/** End the countdown (pass expired or re-locked). */
export function endPassActivity(): void {
  try {
    native?.endPassActivity();
  } catch {
    // no-op
  }
}
