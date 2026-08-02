import mysql from 'mysql2/promise';
import { SERVER_SCHEMA, COLUMN_MIGRATIONS } from './schema';

// All connection settings come from the environment. The defaults match a local dev
// MySQL (root, no password) so `npm run dev` works with zero setup; deployed/DO setups
// override DB_USER/DB_PASSWORD/DB_HOST via the env file (see infra/). Switching targets
// is just a matter of which env is present — no code changes.
// DigitalOcean Managed MySQL REQUIRES TLS — a plaintext connection just hangs. Auto-enable SSL for
// managed hosts (*.ondigitalocean.com) or when DB_SSL=1; local dev (127.0.0.1) stays plaintext so
// `npm run dev` needs zero setup. We don't ship the DO CA cert yet, so rejectUnauthorized=false:
// the connection is ENCRYPTED but the server cert isn't verified — acceptable because the app
// reaches the DB over DO's PRIVATE network. Harden later with the DO CA cert + rejectUnauthorized
// (DB_CA_CERT) — see docs/TECH_DEBT.md.
const dbHost = process.env.DB_HOST || '127.0.0.1';
const useSsl = process.env.DB_SSL === '1' || /\.ondigitalocean\.com$/.test(dbHost);
const dbConfig = {
  host: dbHost,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'langpass',
  connectionLimit: 10,
  connectTimeout: 60000,
  keepAliveInitialDelay: 0,
  enableKeepAlive: true,
  waitForConnections: true,
  queueLimit: 0,
  ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
};

// Lazily-connecting pool. We deliberately do NOT open a connection at import time: that
// fires during `next build` (where the DB env isn't loaded) and floods logs with bogus
// "access denied for root" errors. Connections open on the first query() instead.
const pool = mysql.createPool(dbConfig);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing database pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing database pool...');
  await pool.end();
  process.exit(0);
});

// Self-healing schema: ensure the server tables exist before the first query. Best-effort and
// memoized — every statement is CREATE TABLE IF NOT EXISTS. If it fails (e.g. DB briefly down on
// the very first request) we DON'T cache the failure, so the next query retries; and we never let
// it block a query (the query itself will surface any genuinely-missing-table error normally).
let schemaReady: Promise<void> | null = null;
async function ensureSchema(): Promise<void> {
  let anyOk = false;
  for (const stmt of SERVER_SCHEMA) {
    try {
      await pool.query(stmt);
      anyOk = true;
    } catch (error) {
      console.error('[schema] ensure failed for a statement:', error);
    }
  }
  if (!anyOk) throw new Error('[schema] ensure: every statement failed (DB unreachable?)');
  // Idempotent column adds for already-existing tables (only ALTER when truly missing).
  for (const m of COLUMN_MIGRATIONS) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) AS n FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
        [m.table, m.column]
      );
      const present = Array.isArray(rows) && (rows[0] as { n?: number })?.n;
      if (!present) await pool.query(m.ddl);
    } catch (error) {
      console.error(`[schema] column ensure failed for ${m.table}.${m.column}:`, error);
    }
  }
}
function ensureSchemaOnce(): Promise<void> {
  if (!schemaReady) {
    schemaReady = ensureSchema().catch((e) => {
      schemaReady = null; // allow a retry on the next query
      throw e;
    });
  }
  return schemaReady;
}

export async function query(sql: string, params?: any[], retries = 3): Promise<any> {
  try {
    await ensureSchemaOnce();
  } catch {
    // proceed anyway — a real missing-table error will surface below and the next call retries
  }
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error(`Database query attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

// Types for our database tables
export interface BodyPart {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface Injury {
  id: number;
  name: string;
  nickname: string | null;
  description: string;
  body_part_id: number;
  created_at: Date;
  updated_at: Date;
}
