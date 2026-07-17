// User-data schema + migration engine. Same pattern as relift: PRAGMA user_version
// tracks the schema version; V1 creates everything with IF NOT EXISTS; every later
// version is an idempotent applyVN() that inspects real schema state before altering,
// so a torn migration self-heals on the next launch.

import type { SQLiteDatabase } from 'expo-sqlite';

export const SCHEMA_VERSION = 1;

// v1 — initial schema.
//
// profile          singleton row (CHECK id=1): identity, onboarding, plan/entitlement,
//                  and the lock settings (how many exercises per unlock, how long an
//                  unlock lasts, which native app-selection to shield).
// practice_sessions one row per completed (or abandoned) practice run. An "unlock"
//                  session is the phone-unlock flow; a "free" session is voluntary
//                  practice from the Home tab. completed_at NULL = abandoned.
// answers          one row per exercise answered, for stats and difficulty tuning.
// item_progress    SRS-light per content item (vocab/sentence id): how often seen,
//                  how often correct, when last seen — drives item selection.
// unlock_grants    every time apps were actually unshielded: when, why, until when.
// badges           gamification awards, one row per badge id.
const V1 = `
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  device_id TEXT NOT NULL,
  name TEXT,
  onboarded INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  -- entitlement
  plan TEXT NOT NULL DEFAULT 'free',
  plan_since TEXT,
  grace_revoked INTEGER NOT NULL DEFAULT 0,
  -- training config
  language TEXT NOT NULL DEFAULT 'de',
  level TEXT NOT NULL DEFAULT 'A1',
  daily_goal_sessions INTEGER NOT NULL DEFAULT 1,
  -- lock settings
  exercises_per_unlock INTEGER NOT NULL DEFAULT 5,
  unlock_minutes INTEGER NOT NULL DEFAULT 30,
  strict_mode INTEGER NOT NULL DEFAULT 0,
  blocking_enabled INTEGER NOT NULL DEFAULT 0,
  family_selection_id TEXT
);
INSERT OR IGNORE INTO profile (id, device_id)
  VALUES (1, lower(hex(randomblob(16))));

CREATE TABLE IF NOT EXISTS practice_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL DEFAULT 'unlock',      -- 'unlock' | 'free'
  date TEXT NOT NULL,                        -- local YYYY-MM-DD
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT,
  total INTEGER NOT NULL DEFAULT 0,          -- exercises presented
  correct INTEGER NOT NULL DEFAULT 0,        -- answered right (first try)
  duration_seconds INTEGER
);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON practice_sessions (date);

CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,                     -- content item id (v001 / s001)
  exercise_type TEXT NOT NULL,               -- 'mc_de_en' | 'mc_en_de' | 'type_de' | 'cloze'
  correct INTEGER NOT NULL,
  answer TEXT,
  answered_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_answers_session ON answers (session_id);

CREATE TABLE IF NOT EXISTS item_progress (
  item_id TEXT PRIMARY KEY,
  seen INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,         -- consecutive correct
  last_seen_at TEXT
);

CREATE TABLE IF NOT EXISTS unlock_grants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER REFERENCES practice_sessions(id),
  granted_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT
);

CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  earned_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export function migrate(db: SQLiteDatabase): void {
  const current =
    db.getFirstSync<{ user_version: number }>('PRAGMA user_version')?.user_version ?? 0;
  if (current < 1) db.execSync(V1);
  // future: applyV2(db); applyV3(db); … — each idempotent, run unconditionally
  if (current !== SCHEMA_VERSION) {
    db.execSync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  }
}
