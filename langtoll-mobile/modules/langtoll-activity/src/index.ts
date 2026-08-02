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
    serial: string
  ): boolean;
  endPassActivity(): void;
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
  serial: string
): boolean {
  try {
    return native?.startPassActivity(expiresAtMs, passenger, packLabel, serial) ?? false;
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
