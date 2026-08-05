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
// re-shield even if LangToll never reopens). maybeRelock() re-shields on
// foreground when the grant has expired.
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { endPassActivity } from '@/modules/langtoll-activity/src';
import { schedulePassExpiryNotice, cancelPassExpiryNotice } from '@/lib/notify';

/**
 * Minutes between the pass expiring and the shield actually landing. The pass
 * itself is honest (countdown, island and home flip at the true expiry) — this
 * only softens the re-lock so it never cuts someone off mid-video. Strict Mode
 * (Plus) will set this to zero; that IS the "no mercy" it advertises.
 */
const RELOCK_GRACE_MINUTES = 2;

/**
 * How long the shield's "2 more minutes" hatch lasts. Tapping it whitelists
 * exactly the app being interrupted (the shield-action extension is the one
 * place iOS hands us the current app's token); this cap re-blocks it via the
 * last-call monitor armed at grant time.
 */
const LASTCALL_MINUTES = 2;

export type BlockingMode = 'native' | 'stub';

/**
 * Result of the LAST attempt to schedule the background re-lock. startMonitoring
 * is async and was previously fire-and-forget, so an iOS rejection vanished as
 * an unhandled promise rejection — the monitor silently didn't exist and apps
 * never re-locked in the background. The dev screen renders this so a scheduling
 * failure is visible on the device the moment a session completes.
 */
let lastRelock: { at: string; ok: boolean; detail: string } | null = null;
export function relockStatus(): { at: string; ok: boolean; detail: string } | null {
  return lastRelock;
}

/** The stable id the user's "distracting apps" selection is persisted under. */
const SELECTION_ID = 'langtoll-blocked';
// Prefix, not a fixed name: every grant gets a UNIQUE activity. Reusing one name
// let a stale intervalDidEnd from the PREVIOUS pass re-block a freshly paid one —
// the grace window invites paying during the old interval, so the race went from
// theoretical to Ralph's phone within a day. With unique names the old monitor's
// actions are explicitly emptied on re-grant; even if stopMonitoring can't cancel
// a mid-flight interval, its callback fires into a no-op.
const ACTIVITY_PREFIX = 'langtoll-relock';
// Wake-ups that advance the island's vocabulary card — handled entirely inside
// the extension (PassRotation.swift); they carry no actions.
const WORD_MONITOR_PREFIX = 'langtoll-word';
/** Minutes between island vocabulary rotations. 2 is the practical floor:
 *  DeviceActivity wake-ups are minute-granularity and each one spawns the
 *  whole extension process — denser would show up as LangToll battery drain
 *  in iOS Settings, which is a delete-the-app event. Seconds-level rotation
 *  is not possible on iOS at all: island content is static between updates
 *  and only Text(timerInterval:) self-animates. */
const ROTATION_MINUTES = 2;
/** Cap on rotation monitors: iOS allows ~20 concurrent monitors, the re-lock
 *  machinery needs its two, and headroom matters more than coverage — a
 *  re-lock that fails to arm because vocabulary ate its slot would be the
 *  tail wagging the dog. 14 covers a 28-minute pass at 2-minute cadence;
 *  longer passes stop rotating near the end (the app also rotates on every
 *  foregrounding, so a long pass still refreshes whenever LangToll opens). */
const ROTATION_MAX_WAKEUPS = 14;

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

/** Counts of what the persisted selection blocks (apps / categories / websites), without
 *  revealing their identities. Returns null in stub mode or when there's no selection —
 *  callers treat null as "can't tell", so enforcement only kicks in on a real device. */
export function selectionCounts(): { applicationCount: number; categoryCount: number; webDomainCount: number } | null {
  const m = native();
  if (!m || !Device.isDevice) return null;
  try {
    const selection = m.getFamilyActivitySelectionId(SELECTION_ID);
    if (!selection) return null;
    const meta = m.activitySelectionMetadata({ familyActivitySelection: selection });
    if (!meta) return null;
    return {
      applicationCount: meta.applicationCount ?? 0,
      categoryCount: meta.categoryCount ?? 0,
      webDomainCount: meta.webDomainCount ?? 0,
    };
  } catch {
    return null;
  }
}

/** Clear the persisted app selection (and lift any active shield). Used to discard a
 *  selection a free user isn't allowed to keep. No-op in stub mode. */
export function clearSelection(): void {
  const m = native();
  if (!m || !Device.isDevice) return;
  try {
    m.unblockSelection({ activitySelectionId: SELECTION_ID }, 'langtoll:clearSelection');
    m.setFamilyActivitySelectionId({ id: SELECTION_ID, familyActivitySelection: null });
  } catch (e) {
    console.warn('[blocking] clearSelection failed', e);
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
  // Locked ⇒ no countdown: the island activity ends with the grant, native or not.
  endPassActivity();
  // A manual/early lock supersedes the pending "gate closes in N minutes" notice.
  cancelPassExpiryNotice();
  const m = native();
  if (!isNativeAvailable() || !hasSelection()) return;
  try {
    m.blockSelection({ activitySelectionId: SELECTION_ID }, 'langtoll:lockNow');
  } catch (e) {
    console.warn('[blocking] blockSelection failed', e);
  }
}

/**
 * Lift the shield for `minutes` after a completed session. In native mode also
 * schedules the re-lock via a DeviceActivity interval + a shield action, so the
 * shield returns even if the user never reopens LangToll.
 */
export function grantUnlock(minutes: number): void {
  const m = native();
  if (!isNativeAvailable() || !hasSelection()) return;
  try {
    m.unblockSelection({ activitySelectionId: SELECTION_ID }, 'langtoll:grantUnlock');
    // A fresh pass voids any "2 more minutes" hatch from the previous cycle.
    // Safe here: the blocklist was just emptied, so updating the block is a no-op.
    try {
      m.clearWhitelistAndUpdateBlock?.('langtoll:grantUnlock');
    } catch {
      // hatch cleanup is best-effort
    }

    const now = new Date();
    const end = new Date(now.getTime() + minutes * 60_000);
    // The shield does NOT slam mid-flow: the pass expires on time (UI, island and
    // countdown all use the store's timestamp), but the re-lock lands GRACE
    // minutes later, so whatever the user is in the middle of gets an off-ramp.
    // A notification at true expiry makes the window legible. When Strict Mode
    // ships (Plus), strict sets the grace to zero — that IS the feature.
    const relockAt = new Date(end.getTime() + RELOCK_GRACE_MINUTES * 60_000);
    schedulePassExpiryNotice(end.getTime(), RELOCK_GRACE_MINUTES);

    // FULL date components, not just hour/minute. With time-of-day only,
    // DeviceActivity reads the schedule as a daily wall-clock pattern — so an
    // unlock crossing midnight (23:50 + 30min → end "00:20") is inverted and the
    // re-lock never fires. This was the background-relock bug: apps stayed open
    // until LangToll was next foregrounded and maybeRelock ran.
    const dc = (d: Date) => ({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes(),
      second: d.getSeconds(),
    });

    // Apple rejects DeviceActivity intervals under 15 minutes outright. Plus can
    // customise the unlock length, so clamp the MONITOR (not the store's
    // countdown): a 10-minute pass still re-locks, at most 15 minutes in — and
    // maybeRelock on foreground stays the earlier bound.
    const monitorEnd =
      relockAt.getTime() - now.getTime() < 15 * 60_000
        ? new Date(now.getTime() + 15 * 60_000)
        : relockAt;

    // Neutralize EVERY prior relock monitor: empty its actions first (so a
    // mid-flight interval that can't be stopped fires into a no-op), then stop it.
    const stamp = Date.now();
    const activityName = `${ACTIVITY_PREFIX}.main.${stamp}`;
    const lastCallName = `${ACTIVITY_PREFIX}.lastcall.${stamp}`;
    try {
      const prior: string[] = (m.getActivities?.() ?? []).filter(
        (n: string) => n.startsWith(ACTIVITY_PREFIX) || n.startsWith(WORD_MONITOR_PREFIX)
      );
      for (const name of prior) {
        try {
          m.configureActions({ activityName: name, callbackName: 'intervalDidEnd', actions: [] });
        } catch {
          // best-effort — stopMonitoring below is the second line of defense
        }
      }
      if (prior.length) m.stopMonitoring(prior);
    } catch {
      // no prior monitor — fine
    }
    // The "2 more minutes" hatch is time-boxed by its own monitor: whenever the
    // shield's secondary button whitelists the app being interrupted, this interval
    // re-blocks it LASTCALL_MINUTES after the main re-lock. Armed in advance —
    // an extension cannot start monitors — and harmless if the hatch is never used
    // (clearing an empty whitelist is a no-op). Apple's 15-minute floor applies.
    const lastCallEnd =
      new Date(
        Math.max(
          relockAt.getTime() + LASTCALL_MINUTES * 60_000,
          now.getTime() + 15 * 60_000
        )
      );
    void (async () => {
      try {
        await m.startMonitoring(
          activityName,
          { intervalStart: dc(now), intervalEnd: dc(monitorEnd), repeats: false },
          []
        );
        await m.startMonitoring(
          lastCallName,
          { intervalStart: dc(now), intervalEnd: dc(lastCallEnd), repeats: false },
          []
        );
        // Trust nothing: read back whether iOS actually registered the monitor.
        const active: string[] = m.getActivities?.() ?? [];
        const ok = active.includes(activityName);
        lastRelock = {
          at: new Date().toLocaleTimeString(),
          ok,
          detail: ok
            ? `armed until ${monitorEnd.toLocaleTimeString()}`
            : `startMonitoring resolved but monitor is MISSING (activities: ${active.join(',') || 'none'})`,
        };
      } catch (e) {
        lastRelock = {
          at: new Date().toLocaleTimeString(),
          ok: false,
          detail: `startMonitoring REJECTED: ${e instanceof Error ? e.message : String(e)}`,
        };
      }
      console.log('[blocking] relock:', JSON.stringify(lastRelock));

      // Island vocabulary wake-ups: one future-dated monitor per rotation. The
      // extension advances the deck at each intervalDidStart (PassRotation.swift);
      // no actions are configured, so a stray wake after a re-lock does nothing
      // visible. Strictly best-effort and AFTER the re-lock monitors: rotation
      // must never compete with, delay, or fail the machinery that puts the
      // shield back.
      try {
        for (let k = 1; k <= ROTATION_MAX_WAKEUPS; k++) {
          const at = new Date(now.getTime() + k * ROTATION_MINUTES * 60_000);
          if (at >= end) break; // pass expired — nothing left to teach on it
          // Apple's 15-minute minimum applies to the interval LENGTH; only its
          // START matters to us, and starts may be staggered freely.
          await m.startMonitoring(
            `${WORD_MONITOR_PREFIX}.${k}.${stamp}`,
            { intervalStart: dc(at), intervalEnd: dc(new Date(at.getTime() + 15 * 60_000)), repeats: false },
            []
          );
        }
      } catch (e) {
        console.log('[blocking] word rotation monitors failed (non-fatal):', e);
      }
    })();
    // When the interval ends, re-block — runs in the extension even if the app is closed.
    //
    // KEY NAME MATTERS: generic ACTION dicts are read by the extension as
    // action["familyActivitySelectionId"]. The direct blockSelection() CALL uses
    // a different parser that takes `activitySelectionId`, and copying that key
    // here made the action a silent no-op — intervalDidEnd fired on schedule for
    // days while the extension found no selection id in the dict and did
    // nothing. This was the background-relock bug.
    m.configureActions({
      activityName,
      callbackName: 'intervalDidEnd',
      actions: [{ type: 'blockSelection', familyActivitySelectionId: SELECTION_ID }],
    });
    // Last call: whatever the hatch whitelisted goes back behind the gate.
    m.configureActions({
      activityName: lastCallName,
      callbackName: 'intervalDidEnd',
      actions: [{ type: 'clearWhitelistAndUpdateBlock' }],
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
  // Expired pass ⇒ any lingering "2 more minutes" hatch is over (covers taps that
  // happened after the last-call monitor already fired).
  if (!isUnlocked) {
    try {
      native()?.clearWhitelistAndUpdateBlock?.('langtoll:maybeRelock');
    } catch {
      // best-effort
    }
  }
  if (!isUnlocked && !isShieldActive()) lockNow();
  // Self-heal the opposite direction too: a valid pass with the shield still up
  // means a stale monitor callback slammed it (the pay-during-grace race) — any
  // time the app comes to the foreground, an honest pass lifts the gate.
  if (isUnlocked && isShieldActive()) {
    const m = native();
    try {
      m.unblockSelection({ activitySelectionId: SELECTION_ID }, 'langtoll:selfHeal');
    } catch (e) {
      console.warn('[blocking] self-heal unblock failed', e);
    }
  }
}

// ── shield appearance ───────────────────────────────────────────────────────

const TOLLY_SHIELD_FILE = 'tolly-stern.png';

/**
 * Stage Tolly's stern portrait in the app group container so the shield
 * EXTENSION (a separate process that cannot read our bundle) can render him.
 * Best-effort: if the copy fails the shield falls back to the SF Symbol below.
 */
async function stageShieldIcon(m: any): Promise<boolean> {
  try {
    const { Asset } = require('expo-asset');
    const asset = Asset.fromModule(require('../assets/tolly/tolly-stern.png'));
    await asset.downloadAsync();
    if (!asset.localUri) return false;
    const dir: string = m.getAppGroupFileDirectory();
    if (!dir) return false;
    // dir is a file:// URL string; trailing slash is not guaranteed across versions.
    m.copyFile(asset.localUri, `${dir}${dir.endsWith('/') ? '' : '/'}${TOLLY_SHIELD_FILE}`, true);
    return true;
  } catch {
    return false;
  }
}

/** Brand the shield — LangToll, on theme. Native only; call once on launch. */
export async function configureShieldAppearance(): Promise<void> {
  const m = native();
  if (!isNativeAvailable()) return;
  try {
    const hasTolly = await stageShieldIcon(m);
    m.updateShield(
      {
        // Language-neutral: this text is shown to every learner, and the shield is
        // configured once at launch rather than per-pack, so naming a language
        // here showed "Erst Deutsch" to someone studying Spanish.
        title: 'Locked until you practise.',
        subtitle: 'Finish a quick session in LangToll to earn your pass.',
        primaryButtonLabel: 'Practice now',
        secondaryButtonLabel: '2 more minutes',
        // Tolly, stern, collecting the fare — the operator IS the shield. SF-Symbol
        // fallback only if staging the image into the app group failed.
        ...(hasTolly
          ? { iconAppGroupRelativePath: TOLLY_SHIELD_FILE }
          : { iconSystemName: 'lock.fill' }),
        // Night-service theme (rail navy + teal), not the pre-rebrand lime.
        backgroundColor: { red: 15, green: 22, blue: 27, alpha: 1 },
        titleColor: { red: 236, green: 231, blue: 216, alpha: 1 },
        subtitleColor: { red: 162, green: 178, blue: 182, alpha: 1 },
        primaryButtonBackgroundColor: { red: 92, green: 189, blue: 205, alpha: 1 },
        primaryButtonLabelColor: { red: 11, green: 20, blue: 23, alpha: 1 },
      },
      {
        // A shield extension CANNOT open its containing app. That is Apple's
        // position, not a shortcoming of this library: Frameworks engineers have
        // said so repeatedly since 2022 and FB17261679 tracks the enhancement
        // request. Verified here the hard way — NSExtensionContext.open(), which
        // is what both `openApp` and `openUrlWithDispatch` call underneath, fails
        // SILENTLY on device. The shield closed and the blocked app simply went
        // to the background.
        //
        // Apps that do launch directly are understood to use LSApplicationWorkspace,
        // a private API, and there is a documented App Store rejection for it
        // under guideline 2.5.1. Not a risk worth taking on an app that already
        // carries Family Controls review scrutiny.
        //
        // So: the documented, compliant workaround. Post a local notification
        // carrying the deep link; tapping it foregrounds the app on /session.
        // One extra tap, and it actually works.
        primary: {
          behavior: 'close',
          type: 'sendNotification',
          payload: {
            title: 'Your pass is expired',
            body: 'Tap to practise and unlock your apps.',
            sound: 'default',
            interruptionLevel: 'timeSensitive',
            userInfo: { url: 'langtoll://session' },
          },
        },
        // The escape hatch: the ONE moment iOS reveals the current app is this
        // button press (the shield-action extension holds its token). Tapping
        // whitelists exactly the interrupted app — everything else stays locked —
        // and the last-call monitor re-blocks it a couple of minutes later.
        secondary: {
          behavior: 'close',
          actions: [{ type: 'addCurrentToWhitelist' }],
        },
      },
      'langtoll:configureShield'
    );
  } catch (e) {
    console.warn('[blocking] shield config failed', e);
  }
}
