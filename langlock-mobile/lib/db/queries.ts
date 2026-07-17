// All SQL lives here, exported as the `q` namespace (import { q } from '@/lib/db').
// Synchronous expo-sqlite calls — the DB is tiny and local.

import { getDb } from './connection';
import type {
  ProfileRow,
  PracticeSessionRow,
  ItemProgressRow,
  BadgeRow,
  PracticeStats,
  AnswerRow,
} from './types';

// ── profile ───────────────────────────────────────────────────────────────

export function getProfile(): ProfileRow {
  const row = getDb().getFirstSync<ProfileRow>('SELECT * FROM profile WHERE id = 1');
  if (!row) throw new Error('profile row missing');
  return row;
}

export function updateProfile(patch: Partial<Omit<ProfileRow, 'id' | 'device_id'>>): void {
  const keys = Object.keys(patch) as (keyof typeof patch)[];
  if (!keys.length) return;
  const sets = keys.map((k) => `${k} = ?`).join(', ');
  const values = keys.map((k) => patch[k] ?? null);
  getDb().runSync(`UPDATE profile SET ${sets} WHERE id = 1`, values as any[]);
}

export function getDeviceId(): string {
  return getProfile().device_id;
}

// ── practice sessions ─────────────────────────────────────────────────────

export function startSession(kind: 'unlock' | 'free', date: string): number {
  const res = getDb().runSync(
    'INSERT INTO practice_sessions (kind, date) VALUES (?, ?)',
    [kind, date]
  );
  return Number(res.lastInsertRowId);
}

export function completeSession(
  id: number,
  totals: { total: number; correct: number; durationSeconds: number }
): void {
  getDb().runSync(
    `UPDATE practice_sessions
     SET completed_at = datetime('now'), total = ?, correct = ?, duration_seconds = ?
     WHERE id = ?`,
    [totals.total, totals.correct, totals.durationSeconds, id]
  );
}

export function recordAnswer(a: {
  sessionId: number;
  itemId: string;
  exerciseType: AnswerRow['exercise_type'];
  correct: boolean;
  answer?: string;
}): void {
  const db = getDb();
  db.runSync(
    'INSERT INTO answers (session_id, item_id, exercise_type, correct, answer) VALUES (?, ?, ?, ?, ?)',
    [a.sessionId, a.itemId, a.exerciseType, a.correct ? 1 : 0, a.answer ?? null]
  );
  db.runSync(
    `INSERT INTO item_progress (item_id, seen, correct, streak, last_seen_at)
     VALUES (?, 1, ?, ?, datetime('now'))
     ON CONFLICT(item_id) DO UPDATE SET
       seen = seen + 1,
       correct = correct + ${a.correct ? 1 : 0},
       streak = ${a.correct ? 'streak + 1' : '0'},
       last_seen_at = datetime('now')`,
    [a.itemId, a.correct ? 1 : 0, a.correct ? 1 : 0]
  );
}

export function sessionsOn(date: string): PracticeSessionRow[] {
  return getDb().getAllSync<PracticeSessionRow>(
    'SELECT * FROM practice_sessions WHERE date = ? AND completed_at IS NOT NULL ORDER BY id',
    [date]
  );
}

export function allItemProgress(): ItemProgressRow[] {
  return getDb().getAllSync<ItemProgressRow>('SELECT * FROM item_progress');
}

// ── unlock grants ─────────────────────────────────────────────────────────

export function recordUnlockGrant(sessionId: number, expiresAtISO: string | null): void {
  getDb().runSync('INSERT INTO unlock_grants (session_id, expires_at) VALUES (?, ?)', [
    sessionId,
    expiresAtISO,
  ]);
}

export function latestUnlockGrant(): { granted_at: string; expires_at: string | null } | null {
  return (
    getDb().getFirstSync<{ granted_at: string; expires_at: string | null }>(
      'SELECT granted_at, expires_at FROM unlock_grants ORDER BY id DESC LIMIT 1'
    ) ?? null
  );
}

// ── streaks & stats ───────────────────────────────────────────────────────

/** Distinct local dates with at least one completed session, newest first. */
export function activeDays(): string[] {
  return getDb()
    .getAllSync<{ date: string }>(
      'SELECT DISTINCT date FROM practice_sessions WHERE completed_at IS NOT NULL ORDER BY date DESC'
    )
    .map((r) => r.date);
}

/** Current streak counts back from today (or yesterday, so it doesn't break before
 *  today's practice); longest scans the whole history. */
export function computeStreak(datesDesc: string[], todayISO: string): { current: number; longest: number } {
  if (!datesDesc.length) return { current: 0, longest: 0 };
  const dayMs = 86400000;
  const toMs = (d: string) => new Date(`${d}T00:00:00`).getTime();

  let current = 0;
  let cursor = toMs(todayISO);
  const set = new Set(datesDesc.map(toMs));
  if (!set.has(cursor)) cursor -= dayMs; // allow "yesterday" anchor
  while (set.has(cursor)) {
    current += 1;
    cursor -= dayMs;
  }

  let longest = 1;
  let run = 1;
  const asc = [...datesDesc].reverse().map(toMs);
  for (let i = 1; i < asc.length; i++) {
    run = asc[i] - asc[i - 1] === dayMs ? run + 1 : 1;
    if (run > longest) longest = run;
  }
  return { current, longest };
}

export function practiceStats(todayISO: string): PracticeStats {
  const db = getDb();
  const days = activeDays();
  const { current, longest } = computeStreak(days, todayISO);
  const totalSessions =
    db.getFirstSync<{ n: number }>(
      'SELECT COUNT(*) AS n FROM practice_sessions WHERE completed_at IS NOT NULL'
    )?.n ?? 0;
  const wordsSeen =
    db.getFirstSync<{ n: number }>('SELECT COUNT(*) AS n FROM item_progress')?.n ?? 0;
  const wordsMastered =
    db.getFirstSync<{ n: number }>('SELECT COUNT(*) AS n FROM item_progress WHERE streak >= 3')
      ?.n ?? 0;
  const acc = db.getFirstSync<{ total: number; right: number }>(
    `SELECT COUNT(*) AS total, SUM(correct) AS right FROM answers
     WHERE answered_at >= datetime('now', '-7 days')`
  );
  return {
    currentStreak: current,
    longestStreak: longest,
    totalSessions,
    totalActiveDays: days.length,
    wordsSeen,
    wordsMastered,
    accuracy7d: acc && acc.total > 0 ? (acc.right ?? 0) / acc.total : null,
  };
}

/** First day the user ever practiced (or profile creation) — anchors the honeymoon clock. */
export function journeyStartDate(): string | null {
  const first = getDb().getFirstSync<{ date: string }>(
    'SELECT date FROM practice_sessions ORDER BY date ASC LIMIT 1'
  )?.date;
  if (first) return first;
  const created = getProfile().created_at;
  return created ? created.slice(0, 10) : null;
}

// ── badges ────────────────────────────────────────────────────────────────

export function listBadges(): BadgeRow[] {
  return getDb().getAllSync<BadgeRow>('SELECT * FROM badges ORDER BY earned_at');
}

export function hasBadge(id: string): boolean {
  return !!getDb().getFirstSync('SELECT 1 FROM badges WHERE id = ?', [id]);
}

export function awardBadge(id: string): void {
  getDb().runSync('INSERT OR IGNORE INTO badges (id) VALUES (?)', [id]);
}
