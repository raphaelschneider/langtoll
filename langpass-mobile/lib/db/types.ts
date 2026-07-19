// Row shapes as returned by expo-sqlite (INTEGER booleans stay 0/1).

export interface ProfileRow {
  id: 1;
  device_id: string;
  name: string | null;
  onboarded: 0 | 1;
  created_at: string;
  plan: 'free' | 'plus';
  plan_since: string | null;
  grace_revoked: 0 | 1;
  language: 'de';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  daily_goal_sessions: number;
  exercises_per_unlock: number;
  unlock_minutes: number;
  strict_mode: 0 | 1;
  blocking_enabled: 0 | 1;
  family_selection_id: string | null;
}

export interface PracticeSessionRow {
  id: number;
  kind: 'unlock' | 'free';
  date: string;
  started_at: string;
  completed_at: string | null;
  total: number;
  correct: number;
  duration_seconds: number | null;
}

export interface AnswerRow {
  id: number;
  session_id: number;
  item_id: string;
  exercise_type: 'mc_de_en' | 'mc_en_de' | 'type_de' | 'cloze';
  correct: 0 | 1;
  answer: string | null;
  answered_at: string;
}

export interface ItemProgressRow {
  item_id: string;
  seen: number;
  correct: number;
  streak: number;
  last_seen_at: string | null;
}

export interface UnlockGrantRow {
  id: number;
  session_id: number | null;
  granted_at: string;
  expires_at: string | null;
}

export interface BadgeRow {
  id: string;
  earned_at: string;
}

export interface PracticeStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalActiveDays: number;
  wordsSeen: number;
  wordsMastered: number; // streak >= 3
  accuracy7d: number | null; // 0..1 over last 7 days, null if no answers
}
