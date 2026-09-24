// Simulator-first app state. One JSON blob in AsyncStorage instead of the SQLite
// layer — enough to iterate on the product loop (practice → unlock → re-lock).
// The sqlite plumbing in lib/db is parked (tsconfig-excluded) until we decide we
// want it. lib/blocking is NOT parked — it is the live Screen Time shield.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import type { ItemProgressRow } from '@/lib/db/types';
import type { Level, Language, VocabItem, SentenceItem } from '@/content/german/types';
import type { LocaleCode } from '@/lib/locales';
import { todayISO, addDays } from '@/lib/date';

const STORAGE_KEY = 'langtoll:v1';

/** An AI-generated (or bundled demo) topic pack, merged into training when enabled. */
export interface CustomTopic {
  name: string;
  vocab: VocabItem[];
  sentences: SentenceItem[];
  createdAt: string;
  /** Course the pack was generated for — used to invalidate the goal pack on
   *  language/level change. Optional: packs stored before this field exist. */
  language?: string;
  level?: string;
}

/**
 * Onboarding answers so far, and the screen the person was on. Saved as they
 * go so a relaunch resumes instead of restarting: on launch day an ad install
 * left the paywall, came back three minutes later and was sent to screen one.
 * Cleared when onboarding finishes.
 */
export interface OnboardingDraft {
  step: string;
  name: string;
  language: Language;
  difficulty: number;
  apps: string[];
  goal: string | null;
  forms: 'm' | 'f' | null;
  daypart: string | null;
  fareEx: number;
  fareMin: number;
}

export interface AppState {
  /** ms epoch when the current unlock grant expires; null = locked. */
  unlockExpiresAt: number | null;
  /** Per-item learning progress, keyed by item id (feeds the trainer engine). */
  progress: Record<string, ItemProgressRow>;
  sessionsCompleted: number;
  totalAnswered: number;
  /**
   * The weekly recap's counters — the story of the week, said back to the
   * user on Sunday evening (notification) and on the Monday home screen
   * (card). ISO date of the Monday the counters belong to; the first fare of
   * a new week rolls them into `recapLast` (see bumpRecap / rollRecap).
   */
  recapWeekStart: string | null;
  recapFares: number;
  recapWords: number;
  /** Unlock minutes earned — "hours of scrolling paid for". */
  recapMinutes: number;
  recapLast: { weekStart: string; fares: number; words: number; minutes: number } | null;
  /** weekStart of the last recap card the user dismissed. */
  recapDismissedWeek: string | null;
  totalCorrect: number;
  exercisesPerUnlock: number;
  unlockMinutes: number;
  // onboarding answers
  onboarded: boolean;
  /** First name — printed on the pass, used in copy. */
  name: string | null;
  /** The language the user is learning (packs resolve via content registry). */
  learningLanguage: Language;
  /** CEFR level, derived from difficulty at onboarding, adjustable in settings. */
  level: Level;
  /** 1–10 difficulty from onboarding; drives the exercise mix. */
  difficulty: number;
  /** Voice mode: German TTS on prompts / taps / listening exercises. */
  soundEnabled: boolean;
  /**
   * Strict mode (Plus): the re-lock lands at the exact pass expiry instead of
   * after the grace window. Stored raw; whether it APPLIES is plans.ts's
   * strictModeActive(), which also checks the entitlement.
   */
  strictMode: boolean;
  /** Consecutive days with at least one completed session. */
  streak: number;
  lastPassDate: string | null;
  /** Labels of the apps the user says steal their time (real picker comes with the dev build). */
  blockedApps: string[];
  goal: string | null;
  /**
   * Which speaker-gendered forms to teach (pt obrigado/obrigada …): 'm', 'f',
   * or null = show both variants. A grammar preference, not an identity —
   * asked as "which forms should we teach you?".
   */
  forms: 'm' | 'f' | null;
  /**
   * When we spent this install's one App Store review prompt (ISO), or null if
   * we never have. Deliberately not reset by resetProfile — a dev reset must not
   * let us pester a real user twice.
   */
  reviewPromptedAt: string | null;
  /**
   * Hour (0-23) the user said they lose the most time — the daily nudge fires
   * then (relift's v22 idea: remind at the moment the USER named, not at a
   * default 9:00). Null = never asked / skipped → no daily nudge scheduled.
   */
  nudgeHour: number | null;
  /** UI locale override; 'system' follows the device language. */
  locale: 'system' | LocaleCode;
  /** Appearance override; 'system' follows the device color scheme. */
  appearance: 'dark' | 'light' | 'system';
  /** AI-generated topic pack (lib/ai) merged into training when enabled. */
  customTopic: CustomTopic | null;
  /**
   * The goal, made real: a pack generated FROM state.goal itself and merged
   * into every session. Without this the goal only seasoned manually generated
   * topics — the user set "Pass the B1 exam" and saw zero difference.
   */
  goalPack: CustomTopic | null;
  useCustomTopic: boolean;
  /** Subscription plan, mirrored live from RevenueCat's 'plus' entitlement. */
  plan: 'free' | 'plus';
  planSince: string | null;
  /**
   * The live entitlement's shape, from the same RevenueCat mirror: when it
   * ends, whether it will renew, and whether it is the free trial. Null when
   * unknown (mock, or a legacy record) — every reader treats null as "no
   * warning to give", never as "about to lapse".
   */
  plusExpiresAt: string | null;
  plusWillRenew: boolean | null;
  plusIsTrial: boolean | null;
  /**
   * Dev-only voice override (voice lab). When set and the identifier matches
   * the active pack's language, it wins over automatic voice selection so the
   * lab's choice is what sessions actually use. Null = auto-select.
   */
  voiceOverride: string | null;
  /** Voice-lab rate/pitch overrides. Null = use the SPEECH_RATE / 1.0 defaults. */
  voiceRate: number | null;
  voicePitch: number | null;
  /**
   * EQ / de-ess chain for the native speech path, persisted so the tuning you
   * settle on in the voice lab is what real sessions use — it must be re-applied
   * to the native module on every launch, since that lives in process memory.
   */
  voiceShaping: Record<string, number> | null;
  /**
   * ISO timestamp of the first launch on this device, stamped once by hydrate().
   * Install age for telemetry and review timing; it no longer gates anything
   * (the free preview week was removed 2026-09-05 — Plus is the trial, only).
   */
  firstLaunchAt: string | null;
  /**
   * Epoch ms until which the lock is deliberately OFF — a "night off" taken
   * instead of turning the lock off or deleting the app (the one churn path
   * this product has). Null when the lock runs normally. The shield comes
   * back on its own at this time (the native re-lock is armed for it) and
   * the field is cleared on the next launch/foreground after it has passed.
   */
  lockPausedUntil: number | null;
  /** Unfinished onboarding, see OnboardingDraft. Null once onboarded. */
  onboardingDraft: OnboardingDraft | null;
}

const initialState: AppState = {
  unlockExpiresAt: null,
  progress: {},
  sessionsCompleted: 0,
  totalAnswered: 0,
  recapWeekStart: null,
  recapFares: 0,
  recapWords: 0,
  recapMinutes: 0,
  recapLast: null,
  recapDismissedWeek: null,
  totalCorrect: 0,
  exercisesPerUnlock: 5,
  unlockMinutes: 30,
  onboarded: false,
  name: null,
  learningLanguage: 'de',
  level: 'A1',
  difficulty: 3,
  soundEnabled: true,
  strictMode: false,
  streak: 0,
  lastPassDate: null,
  blockedApps: [],
  goal: null,
  forms: null,
  reviewPromptedAt: null,
  nudgeHour: null,
  locale: 'system',
  appearance: 'dark',
  customTopic: null,
  goalPack: null,
  useCustomTopic: false,
  plan: 'free',
  planSince: null,
  plusExpiresAt: null,
  plusWillRenew: null,
  plusIsTrial: null,
  firstLaunchAt: null,
  lockPausedUntil: null,
  onboardingDraft: null,
  voiceOverride: null,
  voiceRate: null,
  voicePitch: null,
  voiceShaping: null,
};

let state: AppState = initialState;
let hydrated = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const l of listeners) l();
}

function persist(): void {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
}

function setState(patch: Partial<AppState>): void {
  state = { ...state, ...patch };
  persist();
  emit();
}

/** Load persisted state once at startup. Safe to call repeatedly. */
export async function hydrate(): Promise<void> {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = { ...initialState, ...JSON.parse(raw) };
      // migrate pre-CEFR level values ('zero'/'a1' → 'A1')
      if (!['A1', 'A2', 'B1', 'B2'].includes(state.level as string)) state.level = 'A1';
    }
  } catch {
    // corrupted / missing — start fresh
  }
  hydrated = true;
  // Stamp the install date on first ever launch (existing installs that
  // predate the field get today).
  if (!state.firstLaunchAt) {
    state.firstLaunchAt = new Date().toISOString();
    persist();
  }
  emit();
}

/** True once the persisted state has been loaded — before that, `plan` is the default, not the user's. */
export function isHydrated(): boolean {
  return hydrated;
}

export function getState(): AppState {
  return state;
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state
  );
}

// ── derived ───────────────────────────────────────────────────────────────

export function isUnlocked(s: AppState = state, nowMs = Date.now()): boolean {
  return s.unlockExpiresAt !== null && s.unlockExpiresAt > nowMs;
}

export function unlockRemainingMs(s: AppState = state, nowMs = Date.now()): number {
  return s.unlockExpiresAt ? Math.max(0, s.unlockExpiresAt - nowMs) : 0;
}

export function progressRows(s: AppState = state): ItemProgressRow[] {
  return Object.values(s.progress);
}

export function wordsSeen(s: AppState = state): number {
  return Object.keys(s.progress).length;
}

export function wordsMastered(s: AppState = state): number {
  return Object.values(s.progress).filter((p) => p.streak >= 3).length;
}

// ── actions ───────────────────────────────────────────────────────────────

export function recordAnswer(itemId: string, correct: boolean): void {
  const prev = state.progress[itemId] ?? {
    item_id: itemId,
    seen: 0,
    correct: 0,
    streak: 0,
    last_seen_at: null,
  };
  const next: ItemProgressRow = {
    ...prev,
    seen: prev.seen + 1,
    correct: prev.correct + (correct ? 1 : 0),
    streak: correct ? prev.streak + 1 : 0,
    last_seen_at: new Date().toISOString(),
  };
  setState({
    progress: { ...state.progress, [itemId]: next },
    totalAnswered: state.totalAnswered + 1,
    totalCorrect: state.totalCorrect + (correct ? 1 : 0),
  });
}

/**
 * Completing a session grants phone time and advances the day streak. The
 * caller passes the TOTAL minutes (effective fare + any collect bonus) — the
 * store can't compute the effective fare itself without importing plans and
 * creating a cycle, and reading state.unlockMinutes raw here would bypass the
 * free-tier fare gate.
 */
export function completeSession(totalMinutes: number): void {
  const today = todayISO();
  let { streak } = state;
  if (state.lastPassDate !== today) {
    const yesterday = addDays(today, -1);
    streak = state.lastPassDate === yesterday ? streak + 1 : 1;
  }
  setState({
    sessionsCompleted: state.sessionsCompleted + 1,
    unlockExpiresAt: Date.now() + totalMinutes * 60_000,
    streak,
    lastPassDate: today,
  });
}

/** Whether a night off is running: the shield is down without a pass. */
export function isLockPaused(s: AppState = state, nowMs = Date.now()): boolean {
  return s.lockPausedUntil !== null && s.lockPausedUntil > nowMs;
}

/** Forget a pause that has run out. Call before any re-lock decision. */
export function expireLockPause(nowMs = Date.now()): void {
  if (state.lockPausedUntil !== null && state.lockPausedUntil <= nowMs) setState({ lockPausedUntil: null });
}

/**
 * Take the lock off until `untilMs`. Lifts the real shield through the same
 * grant path a paid fare uses, so the native re-lock is armed for the end of
 * the pause and the apps close again even if LangToll is never reopened.
 */
export function pauseLock(untilMs: number): void {
  setState({ lockPausedUntil: untilMs, unlockExpiresAt: null });
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    (require('@/lib/blocking') as typeof import('@/lib/blocking')).grantUnlock(
      Math.max(1, Math.ceil((untilMs - Date.now()) / 60_000))
    );
  } catch {
    // blocking unavailable — the timestamp alone carries the pause in the UI
  }
}

/** End a night off early: the shield returns now. */
export function resumeLock(): void {
  setState({ lockPausedUntil: null });
  lockNow();
}

/** ISO date of the Monday of the week holding `iso` (device-local weeks). */
export function weekStartISO(iso: string = todayISO()): string {
  const d = new Date(`${iso}T12:00:00`); // noon: DST can't push it across a day
  const back = (d.getDay() + 6) % 7; // Mon → 0 … Sun → 6
  return addDays(iso, -back);
}

/**
 * Close a finished recap week. Counters from a past week become `recapLast`
 * (only if there is something to tell — an empty week is no story) and the
 * current week starts clean. Called before every bump and by the home card,
 * so a week that ended while the app slept is still rolled when it wakes.
 */
export function rollRecap(): void {
  const week = weekStartISO();
  if (state.recapWeekStart === week) return;
  const had = state.recapWeekStart !== null && state.recapFares > 0;
  setState({
    recapLast: had
      ? {
          weekStart: state.recapWeekStart as string,
          fares: state.recapFares,
          words: state.recapWords,
          minutes: state.recapMinutes,
        }
      : state.recapLast,
    recapWeekStart: week,
    recapFares: 0,
    recapWords: 0,
    recapMinutes: 0,
  });
}

/** One paid fare: count it, its distinct words and the minutes it bought. */
export function bumpRecap(words: number, minutes: number): void {
  rollRecap();
  setState({
    recapFares: state.recapFares + 1,
    recapWords: state.recapWords + words,
    recapMinutes: state.recapMinutes + minutes,
  });
}

export function dismissRecap(weekStart: string): void {
  setState({ recapDismissedWeek: weekStart });
}

/** Expire the grant now — clears the countdown and re-applies the real shield (native only). */
export function lockNow(): void {
  setState({ unlockExpiresAt: null });
  // Lazy require avoids an import cycle (blocking never imports the store).
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    (require('@/lib/blocking') as typeof import('@/lib/blocking')).lockNow();
  } catch {
    // blocking unavailable — timestamp sim already handled above
  }
}

/** Merge onboarding answers / settings into the profile. */
export function updateProfile(
  patch: Partial<
    Pick<
      AppState,
      | 'name'
      | 'learningLanguage'
      | 'level'
      | 'difficulty'
      | 'soundEnabled'
      | 'strictMode'
      | 'blockedApps'
      | 'goal'
      | 'forms'
      | 'nudgeHour'
      | 'reviewPromptedAt'
      | 'exercisesPerUnlock'
      | 'unlockMinutes'
      | 'onboarded'
      | 'locale'
      | 'appearance'
      | 'customTopic'
      | 'goalPack'
      | 'useCustomTopic'
      | 'voiceOverride'
      | 'voiceRate'
      | 'voicePitch'
      | 'voiceShaping'
    >
  >
): void {
  setState(patch);
}

/** Save (or with null, clear) the unfinished onboarding. */
export function saveOnboardingDraft(draft: OnboardingDraft | null): void {
  setState({ onboardingDraft: draft });
}

export function isPlus(s: AppState = state): boolean {
  return s.plan === 'plus';
}

/**
 * Apply the live subscription entitlement — the single seam RevenueCat calls
 * (on launch, on purchase, and on every renewal/expiry). Downgrading just flips
 * the plan; every isPlus() gate re-evaluates live.
 */
export interface EntitlementMeta {
  expiresAt: string | null;
  willRenew: boolean | null;
  isTrial: boolean | null;
}

export function applyEntitlement(active: boolean, meta?: EntitlementMeta): void {
  if (active) {
    setState({
      plan: 'plus',
      planSince: state.planSince ?? new Date().toISOString(),
      plusExpiresAt: meta?.expiresAt ?? null,
      plusWillRenew: meta?.willRenew ?? null,
      plusIsTrial: meta?.isTrial ?? null,
    });
  } else {
    setState({ plan: 'free', planSince: null, plusExpiresAt: null, plusWillRenew: null, plusIsTrial: null });
    // Lapse edge: a former Plus user may be blocking multiple apps / a whole category / websites,
    // which the free tier doesn't allow. A Family Controls selection is opaque, so we can't trim it
    // to one app — we clear it and let them re-pick a single app. No-op in stub/sim (counts null) and
    // for legit free selections (≤1 app). Lazy require avoids a store↔blocking/plans import cycle.
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const blocking = require('./blocking');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { selectionExceedsFreeLimit } = require('./plans');
      const counts = blocking.selectionCounts?.();
      if (counts && selectionExceedsFreeLimit(counts, false)) blocking.clearSelection?.();
    } catch {
      // native module absent (Expo Go / simulator) — nothing to enforce
    }
  }
}

/** Dev helper: wipe the profile and return to onboarding. */
export function resetProfile(): void {
  // The review prompt survives a reset: Apple gives ~3 asks per user per YEAR,
  // and a dev/user reset must never buy us a second bite at the same person.
  const { reviewPromptedAt, firstLaunchAt } = state;
  state = { ...initialState, reviewPromptedAt, firstLaunchAt };
  persist();
  emit();
}

/** Spend this install's single review ask. */
export function markReviewPrompted(): void {
  setState({ reviewPromptedAt: new Date().toISOString() });
}
