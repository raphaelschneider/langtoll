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
import { strictModeActive } from '@/lib/plans';

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
/** Cap on rotation monitors. Each one launches the monitor EXTENSION twice
 *  (interval start and end), and that extension lives under a hard 6 MB
 *  memory ceiling while importing ActivityKit to touch the Live Activity. At
 *  14 per pass that was up to 28 extra launches sharing the process budget of
 *  the re-lock — and a memory-killed extension is one iOS stops trusting. The
 *  re-lock is the product; three rotations early in the pass are decoration.
 *  Longer passes still refresh on every foregrounding. */
const ROTATION_MAX_WAKEUPS = 3;

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
    // KEY NAME MATTERS (again): the native parser reads `activitySelectionToken`
    // for a serialized selection. `familyActivitySelection` was silently ignored,
    // so this returned 0/0/0 for every real selection — which also meant the
    // free tier's one-app limit never saw a count to enforce.
    const meta = m.activitySelectionMetadata({ activitySelectionToken: selection });
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
 * arms the background re-lock (see armRelock), so the shield returns even if
 * the user never reopens LangToll.
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
    const now = Date.now();
    armRelock(now, now + minutes * 60_000);
  } catch (e) {
    console.warn('[blocking] unblock/schedule failed', e);
  }
}

/** Every monitor name this module owns — re-lock machinery and word rotation. */
function ownedMonitors(m: any): string[] {
  const active: string[] = m.getActivities?.() ?? [];
  return active.filter(
    (n: string) => n.startsWith(ACTIVITY_PREFIX) || n.startsWith(WORD_MONITOR_PREFIX)
  );
}

/** Whether a re-lock monitor is registered with iOS right now. */
function relockArmed(m: any): boolean {
  return ownedMonitors(m).some((n) => n.startsWith(ACTIVITY_PREFIX));
}

/**
 * Schedule the shield's return for a pass that ends at `endMs`. Runs in the
 * DeviceActivity monitor extension even if the app is closed — and that is the
 * whole problem: on iOS 26 the extension's callbacks are not reliably delivered
 * (Apple's forums carry reports of exactly this pattern, a non-repeating timed
 * unlock whose intervalDidEnd never arrives; an Apple engineer there says their
 * own apps do not rely on that callback). Build 24 hung the entire re-lock on
 * that one callback, and on Ralph's phone the gate simply stayed open until
 * LangToll was next foregrounded.
 *
 * So the deadline is armed FOUR ways. Every one of them is idempotent — the
 * blocklist is a set and the extension re-applies it whole — so the first to
 * fire wins and the rest are no-ops:
 *
 *   1. `main`      — an interval that ENDS at the deadline (intervalDidEnd).
 *                    Apple's 15-minute floor applies to its length, so a short
 *                    pass is late here; the others are exact.
 *   2. `gate`      — an interval that STARTS at the deadline (intervalDidStart).
 *                    A different callback, delivered on a different code path.
 *   3. `gate`'s usage events — the moment the user has spent one minute inside
 *                    a blocked app after the deadline, eventDidReachThreshold
 *                    fires. This is the callback that survives even when the
 *                    interval ones are dropped: it is driven by actual usage of
 *                    the very apps that should be shut.
 *   4. the app itself — maybeRelock on every foregrounding (and the expiry
 *                    notification that brings the user there).
 *
 * The "2 more minutes" hatch gets the same treatment: its whitelist is cleared
 * by an interval END, an interval START, and a usage threshold, each two
 * minutes after the deadline.
 */
function armRelock(nowMs: number, endMs: number): void {
  const m = native();
  if (!isNativeAvailable() || !hasSelection()) return;
  try {
    const now = new Date(nowMs);
    const end = new Date(endMs);
    // The shield does NOT slam mid-flow: the pass expires on time (UI, island and
    // countdown all use the store's timestamp), but the re-lock lands GRACE
    // minutes later, so whatever the user is in the middle of gets an off-ramp.
    // A notification at true expiry makes the window legible. Strict Mode
    // (Plus) sets the grace to zero — that IS the feature — and the notice is
    // skipped with it: it exists to explain a delayed shield, and in strict
    // there is no delay to explain.
    const grace = strictModeActive() ? 0 : RELOCK_GRACE_MINUTES;
    const relockAt = new Date(end.getTime() + grace * 60_000);
    if (grace > 0 && endMs > nowMs) schedulePassExpiryNotice(end.getTime(), grace);
    const lastCallAt = new Date(relockAt.getTime() + LASTCALL_MINUTES * 60_000);

    // FULL date components, not just hour/minute. With time-of-day only,
    // DeviceActivity reads the schedule as a daily wall-clock pattern — so an
    // unlock crossing midnight (23:50 + 30min → end "00:20") is inverted and the
    // re-lock never fires. This was the first background-relock bug: apps stayed
    // open until LangToll was next foregrounded and maybeRelock ran.
    const dc = (d: Date) => ({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes(),
      second: d.getSeconds(),
    });
    const MIN_INTERVAL_MS = 15 * 60_000; // Apple rejects shorter intervals outright
    const atLeast15 = (from: Date, to: Date) =>
      to.getTime() - from.getTime() < MIN_INTERVAL_MS
        ? new Date(from.getTime() + MIN_INTERVAL_MS)
        : to;
    // How long the deadline-start monitors stay registered. Long enough that a
    // usage threshold reached hours later still fires; the next grant tears them
    // down regardless.
    const GATE_WINDOW_MS = 24 * 60 * 60_000;

    // Neutralize EVERY prior monitor of ours: wipe its actions first (so a
    // mid-flight callback that can't be cancelled fires into a no-op), then stop
    // it. stopMonitoring alone was proven insufficient — a stale intervalDidEnd
    // from the previous pass re-blocked a freshly paid one on Ralph's phone.
    const stamp = Date.now();
    try {
      const prior = ownedMonitors(m);
      for (const name of prior) {
        try {
          m.cleanUpAfterActivity?.(name);
          m.configureActions({ activityName: name, callbackName: 'intervalDidEnd', actions: [] });
          m.configureActions({ activityName: name, callbackName: 'intervalDidStart', actions: [] });
        } catch {
          // best-effort — stopMonitoring below is the second line of defense
        }
      }
      if (prior.length) m.stopMonitoring(prior);
    } catch {
      // no prior monitor — fine
    }

    const names = {
      main: `${ACTIVITY_PREFIX}.main.${stamp}`,
      gate: `${ACTIVITY_PREFIX}.gate.${stamp}`,
      lastCall: `${ACTIVITY_PREFIX}.lastcall.${stamp}`,
      lastGate: `${ACTIVITY_PREFIX}.lastgate.${stamp}`,
    };
    const block = { type: 'blockSelection', familyActivitySelectionId: SELECTION_ID };
    const closeHatch = { type: 'clearWhitelistAndUpdateBlock' };
    // Actions are written BEFORE the monitors start: a monitor whose interval
    // begins now can fire intervalDidStart immediately, and it must find its
    // action list already in place.
    //
    // KEY NAME MATTERS: generic ACTION dicts are read by the extension as
    // action["familyActivitySelectionId"]. The direct blockSelection() CALL uses
    // a different parser that takes `activitySelectionId`, and copying that key
    // here made the action a silent no-op — intervalDidEnd fired on schedule for
    // days while the extension found no selection id in the dict and did
    // nothing. That was the second background-relock bug.
    m.configureActions({ activityName: names.main, callbackName: 'intervalDidEnd', actions: [block] });
    m.configureActions({ activityName: names.gate, callbackName: 'intervalDidStart', actions: [block] });
    m.configureActions({
      activityName: names.gate,
      callbackName: 'eventDidReachThreshold',
      eventName: 'used',
      actions: [block],
    });
    // Last call: whatever the hatch whitelisted goes back behind the gate. The
    // block is re-applied in the same breath — one more chance for the shield
    // to land if every deadline callback was dropped.
    m.configureActions({ activityName: names.lastCall, callbackName: 'intervalDidEnd', actions: [closeHatch, block] });
    m.configureActions({ activityName: names.lastGate, callbackName: 'intervalDidStart', actions: [closeHatch, block] });
    m.configureActions({
      activityName: names.gate,
      callbackName: 'eventDidReachThreshold',
      eventName: 'lastcall',
      actions: [closeHatch, block],
    });

    // The usage events watch the user's own selection: one minute of use after
    // the deadline shuts the gate; three minutes closes the hatch too.
    const selection: string | null = m.getFamilyActivitySelectionId(SELECTION_ID);
    const usageEvents = selection
      ? [
          { eventName: 'used', familyActivitySelection: selection, threshold: { minute: 1 } },
          {
            eventName: 'lastcall',
            familyActivitySelection: selection,
            threshold: { minute: LASTCALL_MINUTES + 1 },
          },
        ]
      : [];

    void (async () => {
      const armed: string[] = [];
      const failed: string[] = [];
      const start = async (name: string, from: Date, to: Date, events: any[] = []) => {
        try {
          await m.startMonitoring(name, { intervalStart: dc(from), intervalEnd: dc(to), repeats: false }, events);
          armed.push(name);
        } catch (e) {
          failed.push(`${name.split('.')[1]}: ${e instanceof Error ? e.message : String(e)}`);
        }
      };
      // Deadline-start monitors first: they are the exact ones.
      await start(names.gate, relockAt, new Date(relockAt.getTime() + GATE_WINDOW_MS), usageEvents);
      await start(names.main, now, atLeast15(now, relockAt));
      await start(names.lastGate, lastCallAt, new Date(lastCallAt.getTime() + GATE_WINDOW_MS));
      await start(names.lastCall, now, atLeast15(now, lastCallAt));

      // Trust nothing: read back what iOS actually registered.
      const active: string[] = m.getActivities?.() ?? [];
      const live = Object.values(names).filter((n) => active.includes(n));
      const ok = live.includes(names.gate) || live.includes(names.main);
      lastRelock = {
        at: new Date().toLocaleTimeString(),
        ok,
        detail: ok
          ? `${live.length}/4 monitors armed for ${relockAt.toLocaleTimeString()}${failed.length ? ` (${failed.join('; ')})` : ''}`
          : `NOT armed — registered: ${live.join(',') || 'none'}; ${failed.join('; ') || 'startMonitoring resolved but monitors are missing'}`,
      };
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
            { intervalStart: dc(at), intervalEnd: dc(new Date(at.getTime() + MIN_INTERVAL_MS)), repeats: false },
            []
          );
        }
      } catch (e) {
        console.log('[blocking] word rotation monitors failed (non-fatal):', e);
      }
    })();
  } catch (e) {
    console.warn('[blocking] relock scheduling failed', e);
  }
}

/**
 * Re-shield if the grant has expired. Call on launch + foreground. `isUnlocked`
 * comes from the store's timestamp (the source of truth for the UI countdown);
 * `expiresAtMs` is that timestamp, so a live pass whose background re-lock has
 * gone missing can be re-armed for what remains of it.
 */
export function maybeRelock(isUnlocked: boolean, expiresAtMs?: number | null): void {
  if (!isNativeAvailable() || !hasSelection()) return;
  const m = native();
  // Preserve what the EXTENSION last did before this app-side pass overwrites
  // `lastBlockUpdate` — the diagnostics need the background story, not ours.
  try {
    const last = m.userDefaultsGet?.('lastBlockUpdate');
    if (last && typeof last.triggeredBy === 'string' && last.triggeredBy.startsWith('actions_for_')) {
      m.userDefaultsSet?.('langtoll.lastExtensionBlock', last);
    }
  } catch {
    // diagnostics only
  }
  // Expired pass ⇒ any lingering "2 more minutes" hatch is over (covers taps that
  // happened after the last-call monitor already fired).
  if (!isUnlocked) {
    try {
      m?.clearWhitelistAndUpdateBlock?.('langtoll:maybeRelock');
    } catch {
      // best-effort
    }
  }
  if (!isUnlocked && !isShieldActive()) lockNow();
  // Self-heal the opposite direction too: a valid pass with the shield still up
  // means a stale monitor callback slammed it (the pay-during-grace race) — any
  // time the app comes to the foreground, an honest pass lifts the gate.
  if (isUnlocked && isShieldActive()) {
    try {
      m.unblockSelection({ activitySelectionId: SELECTION_ID }, 'langtoll:selfHeal');
    } catch (e) {
      console.warn('[blocking] self-heal unblock failed', e);
    }
  }
  // A live pass with NO re-lock registered (iOS dropped it, or the app was
  // updated or reinstalled mid-pass) would otherwise stay open until the next
  // foregrounding — the exact failure this module exists to prevent. Re-arm
  // for the remaining time.
  if (isUnlocked && expiresAtMs && !relockArmed(m)) {
    console.log('[blocking] live pass with no re-lock monitor — re-arming');
    armRelock(Date.now(), expiresAtMs);
  }
}

// ── diagnostics ─────────────────────────────────────────────────────────────

/**
 * What the gate machinery actually did, read back from the app group — the
 * extension records every callback it receives and every block it applies.
 * Plain text, for a readout in Settings that works in a TestFlight build,
 * where the dev levers are stripped.
 */
export function gateDiagnostics(): string[] {
  const m = native();
  if (!isNativeAvailable()) return ['Simulator / no native module — gate is simulated.'];
  const lines: string[] = [];
  const when = (ms: number) => new Date(ms).toLocaleString();
  try {
    lines.push(`Screen Time: ${['not asked', 'denied', 'authorized'][authorizationStatus()] ?? '?'}`);
    lines.push(`Shield up now: ${isShieldActive() ? 'yes' : 'no'}`);
    const counts = selectionCounts();
    lines.push(
      counts
        ? `Selection: ${counts.applicationCount} apps · ${counts.categoryCount} categories · ${counts.webDomainCount} sites`
        : 'Selection: none'
    );
    lines.push(
      lastRelock
        ? `Last arm @ ${lastRelock.at}: ${lastRelock.detail}`
        : 'Last arm: no unlock this launch yet'
    );
    const monitors = ownedMonitors(m);
    lines.push(
      `Monitors registered: ${monitors.length}` +
        (monitors.length ? ` — ${monitors.map((n) => n.replace(`${ACTIVITY_PREFIX}.`, '').replace(WORD_MONITOR_PREFIX, 'word')).join(', ')}` : '')
    );
    const lastBlock = m.userDefaultsGet?.('lastBlockUpdate') as
      | { triggeredBy?: string; blockedAt?: string; blocklistAppCount?: number; blocklistCategoryCount?: number; whitelistAppCount?: number }
      | undefined;
    lines.push(
      lastBlock
        ? `Last block update: ${lastBlock.blockedAt ?? '?'} by ${lastBlock.triggeredBy ?? '?'} — ${lastBlock.blocklistAppCount ?? 0} apps, ${lastBlock.blocklistCategoryCount ?? 0} categories blocked, ${lastBlock.whitelistAppCount ?? 0} whitelisted`
        : 'Last block update: none recorded'
    );
    const extBlock = m.userDefaultsGet?.('langtoll.lastExtensionBlock') as
      | { triggeredBy?: string; blockedAt?: string; blocklistAppCount?: number; blocklistCategoryCount?: number }
      | undefined;
    lines.push(
      extBlock
        ? `Last EXTENSION block: ${extBlock.blockedAt ?? '?'} by ${(extBlock.triggeredBy ?? '?').replace('actions_for_', '')} — ${extBlock.blocklistAppCount ?? 0} apps, ${extBlock.blocklistCategoryCount ?? 0} categories`
        : 'Last EXTENSION block: none recorded'
    );
    const readback = m.userDefaultsGet?.('langtoll.ext.readback') as
      | { at?: string; triggeredBy?: string; cats?: number; apps?: number; sameStore?: boolean; freshStore?: boolean }
      | undefined;
    lines.push(
      readback
        ? `Extension read-back @ ${readback.at ?? '?'} (${(readback.triggeredBy ?? '?').replace('actions_for_', '')}): wrote ${readback.apps ?? 0} apps/${readback.cats ?? 0} cats · same store says shield ${readback.sameStore ? 'UP' : 'DOWN'} · fresh store says ${readback.freshStore ? 'UP' : 'DOWN'}`
        : 'Extension read-back: none recorded'
    );
    const events: { activityName: string; callbackName: string; eventName?: string; lastCalledAt: Date }[] =
      m.getEvents?.() ?? [];
    const ours = events
      .filter((e) => e.activityName?.startsWith(ACTIVITY_PREFIX))
      .slice(-8)
      .map(
        (e) =>
          `${when(e.lastCalledAt.getTime())} ${e.activityName.replace(`${ACTIVITY_PREFIX}.`, '')} ${e.callbackName}${e.eventName ? `:${e.eventName}` : ''}`
      );
    lines.push(ours.length ? `Extension callbacks (latest ${ours.length}):` : 'Extension callbacks: NONE ever recorded');
    lines.push(...ours);
    const wordWakes = events.filter((e) => e.activityName?.startsWith(WORD_MONITOR_PREFIX)).length;
    lines.push(`Word-rotation wake-ups recorded: ${wordWakes}`);
  } catch (e) {
    lines.push(`Diagnostics failed: ${e instanceof Error ? e.message : String(e)}`);
  }
  return lines;
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
