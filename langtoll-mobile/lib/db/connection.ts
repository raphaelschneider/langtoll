// Opens the on-device SQLite database and applies user-data migrations.
//
// Unlike relift there is no bundled knowledge DB: langpass's content (language packs)
// ships as TypeScript modules in content/, so the database holds ONLY user data —
// profile, practice sessions, per-item progress, unlock grants, badges.
//
// Kept separate from the barrel (index.ts) so queries.ts can depend on getDb()
// without creating an import cycle.

import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';
import { migrate } from './schema';

const DB_NAME = 'langlock.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let opening: Promise<SQLite.SQLiteDatabase> | null = null;

async function open(): Promise<SQLite.SQLiteDatabase> {
  const db = SQLite.openDatabaseSync(DB_NAME);
  db.execSync('PRAGMA journal_mode = WAL;');
  db.execSync('PRAGMA foreign_keys = ON;');
  migrate(db);
  dbInstance = db;
  return db;
}

/** Opens (and migrates) the database. Safe to call multiple times. */
export function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);
  if (!opening) {
    opening = open().catch((e) => {
      opening = null;
      throw e;
    });
  }
  return opening;
}

/** Returns the already-opened handle. Throws if openDatabase() hasn't completed. */
export function getDb(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    throw new Error('Database not opened yet — call openDatabase() during app init.');
  }
  return dbInstance;
}

/** Wipe the on-device DB so it starts fresh next launch. Backs the user-facing
 *  "Erase everything" in Settings AND the dev "fresh user" reset. */
export async function resetDatabase(): Promise<void> {
  const path = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
  try {
    dbInstance?.closeSync();
  } catch {}
  dbInstance = null;
  opening = null;
  // Delete the WAL sidecars too — a leftover -wal gets replayed onto a fresh file,
  // resurrecting old data.
  for (const p of [path, `${path}-wal`, `${path}-shm`, `${path}-journal`]) {
    const info = await FileSystem.getInfoAsync(p);
    if (info.exists) await FileSystem.deleteAsync(p, { idempotent: true });
  }
}
