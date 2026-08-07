// Self-healing server schema. The web service owns a small set of tables (telemetry, media-cache
// index, attest keys, settings, subscription mirror — NOT user recovery data, which is on-device).
// Rather than depend on a manual SQL load (and on the DB firewall trusting an operator's IP), the
// app ensures its own schema on first DB use: every statement is CREATE TABLE IF NOT EXISTS, so
// it's idempotent and cheap. This is the single source of truth for the server schema; keep
// infra/cloud-init.yaml.tftpl's inline copy (the droplet path) in sync, or retire it in favour of
// this. Called (memoized) from db.ts before the first query.

export const SERVER_SCHEMA: string[] = [
  `CREATE TABLE IF NOT EXISTS app_users (
     device_id    VARCHAR(64) PRIMARY KEY,
     platform     VARCHAR(20) DEFAULT 'ios',
     app_version  VARCHAR(20),
     plan         VARCHAR(20) DEFAULT 'free',
     onboarded_at TIMESTAMP NULL,
     last_seen_at TIMESTAMP NULL,
     created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   )`,
  `CREATE TABLE IF NOT EXISTS app_events (
     id         BIGINT AUTO_INCREMENT PRIMARY KEY,
     device_id  VARCHAR(64) NOT NULL,
     event      VARCHAR(50) NOT NULL,
     data       JSON,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     INDEX idx_event_time (event, created_at),
     INDEX idx_device (device_id, created_at)
   )`,
  `CREATE TABLE IF NOT EXISTS subscriptions (
     id          BIGINT AUTO_INCREMENT PRIMARY KEY,
     device_id   VARCHAR(64) NOT NULL,
     plan        VARCHAR(20) NOT NULL,
     status      VARCHAR(20) NOT NULL DEFAULT 'active',
     period      VARCHAR(20),
     rc_user     VARCHAR(80) NULL,
     started_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     ended_at    TIMESTAMP NULL,
     INDEX idx_sub_device (device_id),
     INDEX idx_sub_status (status, plan)
   )`,
  `CREATE TABLE IF NOT EXISTS device_status (
     device_id         VARCHAR(64) PRIMARY KEY,
     honeymoon_status  VARCHAR(20) NOT NULL DEFAULT 'active',
     honeymoon_start   DATE NULL,
     devicecheck_used  TINYINT(1) NOT NULL DEFAULT 0,
     plan              VARCHAR(20) NOT NULL DEFAULT 'free',
     platform          VARCHAR(20) NOT NULL DEFAULT 'ios',
     app_version       VARCHAR(20),
     first_seen_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     last_seen_at      TIMESTAMP NULL,
     updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     INDEX idx_devstatus_status (honeymoon_status),
     INDEX idx_devstatus_dcheck (devicecheck_used)
   )`,
  // AI-generated topic packs, cached so a given (language, level, topic) is generated once and
  // served to every user who asks for it — the app then caches the pack locally and drills offline.
  `CREATE TABLE IF NOT EXISTS topic_packs (
     content_key VARCHAR(190) PRIMARY KEY,
     language    VARCHAR(8) NOT NULL,
     level       VARCHAR(8) NOT NULL,
     topic       VARCHAR(120) NOT NULL,
     pack        JSON NOT NULL,
     created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     INDEX idx_topic_lang_level (language, level)
   )`,
  // honeymoon_ok caches this install's DeviceCheck verdict for the free week: NULL = not yet
  // evaluated, 1 = genuine first honeymoon (claimed on this physical device), 0 = device already
  // used its honeymoon in a prior install (reinstall abuse — denied). See lib/entitlement.ts.
  `CREATE TABLE IF NOT EXISTS attest_keys (
     key_id       VARCHAR(120) PRIMARY KEY,
     public_key   TEXT NOT NULL,
     sign_count   BIGINT UNSIGNED NOT NULL DEFAULT 0,
     device_id    VARCHAR(64),
     honeymoon_ok TINYINT NULL,
     created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     INDEX idx_attest_device (device_id)
   )`,
  `CREATE TABLE IF NOT EXISTS app_settings (
     k          VARCHAR(64) PRIMARY KEY,
     v          JSON NOT NULL,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   )`,
  `CREATE TABLE IF NOT EXISTS usage_log (
     id         BIGINT AUTO_INCREMENT PRIMARY KEY,
     kind       VARCHAR(16) NOT NULL,
     model      VARCHAR(64) NULL,
     tokens_in  INT NULL,
     tokens_out INT NULL,
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     INDEX idx_usage_created (created_at),
     INDEX idx_usage_kind_created (kind, created_at)
   )`,
  // Shared fixed-window rate-limit counters (cost backstop on the paid routes). Lives in the DB so
  // the limit holds across the prod App Platform's >=2 instances (an in-process map would give each
  // instance its own budget). bucket = "route:tag:identity:windowStart"; expired rows are swept.
  `CREATE TABLE IF NOT EXISTS rate_limits (
     bucket   VARCHAR(190) PRIMARY KEY,
     count    INT NOT NULL DEFAULT 0,
     reset_at BIGINT NOT NULL,
     INDEX idx_rl_reset (reset_at)
   )`,

  // Texts /api/audio is allowed to synthesize — written by pack generation
  // (registerPackAudio), read by the audio route. This registry is the abuse
  // boundary: an unregistered (lang, hash) is a 404, so arbitrary text can
  // never reach the TTS spend. hash = sha1("<lang>|<text>"), the same
  // addressing as the pre-rendered corpus and the app's cache.
  `CREATE TABLE IF NOT EXISTS jit_audio (
     lang       VARCHAR(8)  NOT NULL,
     hash       CHAR(40)    NOT NULL,
     text       VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (lang, hash)
   )`,
];

// Idempotent column adds for tables that already exist on a deployed DB (CREATE TABLE IF NOT EXISTS
// won't alter them). Applied after SERVER_SCHEMA, each only runs when the column is actually missing
// (checked via information_schema), so it's safe to run on every boot. Keep the matching column in
// the CREATE TABLE above too, for fresh databases.
export const COLUMN_MIGRATIONS: { table: string; column: string; ddl: string }[] = [
  { table: 'attest_keys', column: 'honeymoon_ok', ddl: 'ALTER TABLE attest_keys ADD COLUMN honeymoon_ok TINYINT NULL' },
  // Support lookups: the RevenueCat anonymous id reported by the app on purchase/restore, so a
  // user's support code (device id) can resolve to a LIVE RevenueCat subscription check.
  { table: 'subscriptions', column: 'rc_user', ddl: 'ALTER TABLE subscriptions ADD COLUMN rc_user VARCHAR(80) NULL' },
];
