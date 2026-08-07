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
}

export interface AppState {
  /** ms epoch when the current unlock grant expires; null = locked. */
  unlockExpiresAt: number | null;
  /** Per-item learning progress, keyed by item id (feeds the trainer engine). */
  progress: Record<string, ItemProgressRow>;
  sessionsCompleted: number;
  totalAnswered: number;
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
  useCustomTopic: boolean;
  /** Subscription plan, mirrored live from RevenueCat's 'plus' entitlement. */
  plan: 'free' | 'plus';
  planSince: string | null;
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
   * Drives the honeymoon window (see lib/plans.ts) — deliberately independent of
   * `planSince` and of any App Store trial, so the grace period starts when the
   * user arrives rather than when they visit the paywall.
   */
  firstLaunchAt: string | null;
}

const initialState: AppState = {
  unlockExpiresAt: null,
  progress: {},
  sessionsCompleted: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  exercisesPerUnlock: 5,
  unlockMinutes: 30,
  onboarded: false,
  name: null,
  learningLanguage: 'de',
  level: 'A1',
  difficulty: 3,
  soundEnabled: true,
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
  useCustomTopic: false,
  plan: 'free',
  planSince: null,
  firstLaunchAt: null,
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
  // Stamp the honeymoon clock on first ever launch. Existing installs that
  // predate this field get stamped now, which starts their window today rather
  // than retroactively expiring it — the generous read, on purpose.
  if (!state.firstLaunchAt) {
    state.firstLaunchAt = new Date().toISOString();
    persist();
  }
  emit();
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

/** Completing a session grants phone time and advances the day streak. */
export function completeSession(bonusMinutes = 0): void {
  const today = todayISO();
  let { streak } = state;
  if (state.lastPassDate !== today) {
    const yesterday = addDays(today, -1);
    streak = state.lastPassDate === yesterday ? streak + 1 : 1;
  }
  setState({
    sessionsCompleted: state.sessionsCompleted + 1,
    // base pass time + bonus earned by mastering words this session (+5 min each)
    unlockExpiresAt: Date.now() + (state.unlockMinutes + bonusMinutes) * 60_000,
    streak,
    lastPassDate: today,
  });
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

export function isPlus(s: AppState = state): boolean {
  return s.plan === 'plus';
}

/**
 * Apply the live subscription entitlement — the single seam RevenueCat calls
 * (on launch, on purchase, and on every renewal/expiry). Downgrading just flips
 * the plan; every isPlus() gate re-evaluates live.
 */
export function applyEntitlement(active: boolean): void {
  if (active) {
    setState({ plan: 'plus', planSince: state.planSince ?? new Date().toISOString() });
  } else {
    setState({ plan: 'free', planSince: null });
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
