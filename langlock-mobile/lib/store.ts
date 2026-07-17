// Simulator-first app state. One JSON blob in AsyncStorage instead of the SQLite
// layer — enough to iterate on the product loop (practice → unlock → re-lock).
// The sqlite/native plumbing in lib/db + lib/blocking is parked (tsconfig-excluded)
// until we decide we want it.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import type { ItemProgressRow } from '@/lib/db/types';
import type { Level, Language, VocabItem, SentenceItem } from '@/content/german/types';
import { todayISO, addDays } from '@/lib/date';

const STORAGE_KEY = 'langpass:v1';

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
  /** UI locale override; 'system' follows the device language. */
  locale: 'system' | 'en' | 'de';
  /** Appearance override; 'system' follows the device color scheme. */
  appearance: 'dark' | 'light' | 'system';
  /** AI-generated topic pack (lib/ai) merged into training when enabled. */
  customTopic: CustomTopic | null;
  useCustomTopic: boolean;
  /** Subscription plan, mirrored live from RevenueCat's 'plus' entitlement. */
  plan: 'free' | 'plus';
  planSince: string | null;
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
  locale: 'system',
  appearance: 'dark',
  customTopic: null,
  useCustomTopic: false,
  plan: 'free',
  planSince: null,
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
      if (!['A1', 'A2', 'B1'].includes(state.level as string)) state.level = 'A1';
    }
  } catch {
    // corrupted / missing — start fresh
  }
  hydrated = true;
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
export function completeSession(): void {
  const today = todayISO();
  let { streak } = state;
  if (state.lastPassDate !== today) {
    const yesterday = addDays(today, -1);
    streak = state.lastPassDate === yesterday ? streak + 1 : 1;
  }
  setState({
    sessionsCompleted: state.sessionsCompleted + 1,
    unlockExpiresAt: Date.now() + state.unlockMinutes * 60_000,
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
      | 'exercisesPerUnlock'
      | 'unlockMinutes'
      | 'onboarded'
      | 'locale'
      | 'appearance'
      | 'customTopic'
      | 'useCustomTopic'
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
  }
}

/** Dev helper: wipe the profile and return to onboarding. */
export function resetProfile(): void {
  state = { ...initialState };
  persist();
  emit();
}
