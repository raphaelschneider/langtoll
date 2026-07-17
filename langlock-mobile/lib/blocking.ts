// The real lock: Apple Screen Time (FamilyControls) shielding via
// react-native-device-activity, behind a seam so the rest of the app never
// touches the native module directly.
//
// Why the seam: FamilyControls (a) needs a dev-client build — it can't run in
// Expo Go — (b) needs the Family Controls entitlement (Apple approval per
// bundle id + the three auto-generated extension ids), and (c) DOES NOT WORK
// IN THE SIMULATOR at all. Until a real device + entitlement are in place,
// `stub` mode simulates the shield with the unlock timestamp in the store, so
// every flow (practice → unlock → re-lock) stays testable in the simulator.
//
// Modes:
//   'native' — real device + module present + authorized: actually shields apps.
//   'stub'   — simulator / Expo Go / Android / unauthorized: state lives only
//              in the store's unlockExpiresAt timestamp (UI countdown still works).
//
// The unlock contract either way: completing a session calls the store's
// completeSession() (drives the countdown) AND grantUnlock(minutes) here
// (lifts the real shield + schedules the DeviceActivity re-lock so apps
// re-shield even if LangPass never reopens). maybeRelock() re-shields on
// foreground when the grant has expired.
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export type BlockingMode = 'native' | 'stub';

/** The stable id the user's "distracting apps" selection is persisted under. */
const SELECTION_ID = 'langpass-blocked';
const ACTIVITY_NAME = 'langpass-relock';

// Lazy so the app never crashes when the native module isn't in the binary
// (Expo Go, or before the dev build exists).
let mod: any | null | undefined;
function native(): any | null {
  if (mod !== undefined) return mod;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mod = require('react-native-device-activity');
  } catch {
    mod = null;
  }
  return mod;
}

/**
 * Native shielding is only real on a physical iOS device with the module
 * present. The module loads in the simulator too, but FamilyControls silently
 * fails there — so we treat the simulator as stub and keep the timestamp sim.
 */
export function isNativeAvailable(): boolean {
  return Platform.OS === 'ios' && Device.isDevice && !!native();
}

export function blockingMode(): BlockingMode {
  return isNativeAvailable() ? 'native' : 'stub';
}

// ── authorization ───────────────────────────────────────────────────────────

/** 0 notDetermined · 1 denied · 2 approved (mirrors the native enum). */
export function authorizationStatus(): number {
  const m = native();
  if (!m || !Device.isDevice) return 0;
  try {
    return m.getAuthorizationStatus();
  } catch {
    return 0;
  }
}

export function isAuthorized(): boolean {
  return authorizationStatus() === 2;
}

/** Ask iOS for Screen Time authorization. Resolves true if approved. No-op in stub. */
export async function requestAuthorization(): Promise<boolean> {
  const m = native();
  if (!m || !Device.isDevice) return true; // stub: pretend granted so flows proceed
  try {
    await m.requestAuthorization('individual');
    // status can lag right after the prompt — poll briefly if available.
    if (typeof m.pollAuthorizationStatus === 'function') {
      const status = await m.pollAuthorizationStatus({ pollIntervalMs: 300, maxAttempts: 10 });
      return status === 2;
    }
    return m.getAuthorizationStatus() === 2;
  } catch (e) {
    console.warn('[blocking] authorization failed', e);
    return false;
  }
}

// ── app selection ─────────────────────────────────────────────────────────

export function selectionId(): string {
  return SELECTION_ID;
}

/** Whether the user has picked apps to block (a selection is persisted natively). */
export function hasSelection(): boolean {
  const m = native();
  if (!m || !Device.isDevice) return true; // stub: treat as configured so flows proceed
  try {
    return !!m.getFamilyActivitySelectionId(SELECTION_ID);
  } catch {
    return false;
  }
}

/** Whether the real shield is currently applied (native only). */
export function isShieldActive(): boolean {
  const m = native();
  if (!m || !Device.isDevice) return false;
  try {
    return !!m.isShieldActive();
  } catch {
    return false;
  }
}

// ── the lock ────────────────────────────────────────────────────────────────

/** Shield the selected apps now. No-op without a native selection. */
export function lockNow(): void {
  const m = native();
  if (!isNativeAvailable() || !hasSelection()) return;
  try {
    m.blockSelection({ activitySelectionId: SELECTION_ID }, 'langpass:lockNow');
  } catch (e) {
    console.warn('[blocking] blockSelection failed', e);
  }
}

/**
 * Lift the shield for `minutes` after a completed session. In native mode also
 * schedules the re-lock via a DeviceActivity interval + a shield action, so the
 * shield returns even if the user never reopens LangPass.
 */
export function grantUnlock(minutes: number): void {
  const m = native();
  if (!isNativeAvailable() || !hasSelection()) return;
  try {
    m.unblockSelection({ activitySelectionId: SELECTION_ID }, 'langpass:grantUnlock');

    const now = new Date();
    const end = new Date(now.getTime() + minutes * 60_000);
    // Fresh interval each grant; stop any prior one first.
    try {
      m.stopMonitoring([ACTIVITY_NAME]);
    } catch {
      // no prior monitor — fine
    }
    m.startMonitoring(
      ACTIVITY_NAME,
      {
        intervalStart: { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() },
        intervalEnd: { hour: end.getHours(), minute: end.getMinutes(), second: end.getSeconds() },
        repeats: false,
      },
      []
    );
    // When the interval ends, re-block — runs in the extension even if the app is closed.
    m.configureActions({
      activityName: ACTIVITY_NAME,
      callbackName: 'intervalDidEnd',
      actions: [{ type: 'blockSelection', activitySelectionId: SELECTION_ID }],
    });
  } catch (e) {
    console.warn('[blocking] unblock/schedule failed', e);
  }
}

/**
 * Re-shield if the grant has expired. Call on launch + foreground. `isUnlocked`
 * comes from the store's timestamp (the source of truth for the UI countdown).
 */
export function maybeRelock(isUnlocked: boolean): void {
  if (!isNativeAvailable() || !hasSelection()) return;
  if (!isUnlocked && !isShieldActive()) lockNow();
}

// ── shield appearance ───────────────────────────────────────────────────────

/** Brand the shield — LangPass, on theme. Native only; call once on launch. */
export function configureShieldAppearance(): void {
  const m = native();
  if (!isNativeAvailable()) return;
  try {
    m.updateShield(
      {
        title: 'Erst Deutsch, dann TikTok.',
        subtitle: 'Finish a quick German session in LangPass to earn your pass.',
        primaryButtonLabel: 'Practice now',
        secondaryButtonLabel: 'Not now',
        iconSystemName: 'lock.fill',
        backgroundColor: { red: 10, green: 10, blue: 12, alpha: 1 },
        titleColor: { red: 242, green: 242, blue: 244, alpha: 1 },
        subtitleColor: { red: 166, green: 166, blue: 176, alpha: 1 },
        primaryButtonBackgroundColor: { red: 200, green: 255, blue: 77, alpha: 1 },
        primaryButtonLabelColor: { red: 16, green: 20, blue: 3, alpha: 1 },
      },
      {
        primary: { behavior: 'close', actions: [{ type: 'openApp' }] },
        secondary: { behavior: 'defer' },
      },
      'langpass:configureShield'
    );
  } catch (e) {
    console.warn('[blocking] shield config failed', e);
  }
}
