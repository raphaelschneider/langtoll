// Lightweight usage tracking for cost estimation (see /langpass-adm). Records each ACTUAL OpenAI call —
// image generations (cache misses) and agent chat turns — into `usage_log`. Every function here
// is best-effort: it must never break a user request, so writes/reads swallow errors (e.g. if the
// table hasn't been migrated yet — run database/create_usage_log_table.sql).
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export type UsageKind = 'image' | 'chat';

/** Fire-and-forget: record one billable call. Never throws. */
export async function logUsage(
  kind: UsageKind,
  opts: { model?: string; tokensIn?: number; tokensOut?: number } = {}
): Promise<void> {
  try {
    await query('INSERT INTO usage_log (kind, model, tokens_in, tokens_out) VALUES (?, ?, ?, ?)', [
      kind,
      opts.model ?? null,
      opts.tokensIn ?? null,
      opts.tokensOut ?? null,
    ]);
  } catch {
    // best-effort telemetry — ignore (table missing, db blip, etc.)
  }
}

// Rough public USD prices for a back-of-envelope estimate. Update as model pricing changes.
export const COST = {
  imageUSD: 0.04, // gpt-image-1, medium quality 1024×1024 (approx)
  chatInPer1k: 0.0025, // gpt-4o input ≈ $2.50 / 1M tokens
  chatOutPer1k: 0.01, // gpt-4o output ≈ $10 / 1M tokens
};

export function estimateCostUSD(d: { images: number; tokensIn: number; tokensOut: number }): number {
  return (
    d.images * COST.imageUSD +
    (d.tokensIn / 1000) * COST.chatInPer1k +
    (d.tokensOut / 1000) * COST.chatOutPer1k
  );
}

export interface UsageDay {
  day: string;
  images: number;
  chats: number;
  tokensIn: number;
  tokensOut: number;
}

// ── Global spend cap ──────────────────────────────────────────────────────────────────────────
// A hard backstop against a launch-day spike running up an uncapped OpenAI bill: once the estimated
// spend for the current day or month crosses a configured USD cap, the paid routes shed load
// gracefully (503 "at capacity") instead of calling OpenAI. The per-device rate limiter bounds one
// abuser; THIS bounds the aggregate across everyone. Inert unless a cap is set, so it's off by
// default and flipped on for production. Set the matching hard limit in the OpenAI dashboard too —
// this is the friendly first line, that's the absolute backstop.
const DAILY_CAP = Number(process.env.OPENAI_DAILY_USD_CAP || '0');
const MONTHLY_CAP = Number(process.env.OPENAI_MONTHLY_USD_CAP || '0');

export function budgetCapsConfigured(): boolean {
  return DAILY_CAP > 0 || MONTHLY_CAP > 0;
}

// Cache the verdict so we run one aggregate query per minute, not one per request.
let budgetCache = { over: false, at: 0 };
const BUDGET_TTL_MS = 60_000;

/** True when estimated spend has crossed the day or month cap. Cheap (cached); false if no cap is
 *  configured or on any metering error (never block users because metering hiccuped). */
export async function isOverBudget(): Promise<boolean> {
  if (!budgetCapsConfigured()) return false;
  if (Date.now() - budgetCache.at < BUDGET_TTL_MS) return budgetCache.over;
  try {
    const rows = await query(
      `SELECT
         COALESCE(SUM(kind = 'image' AND created_at >= CURDATE()), 0)                      AS d_img,
         COALESCE(SUM(IF(created_at >= CURDATE(), tokens_in, 0)), 0)                       AS d_tin,
         COALESCE(SUM(IF(created_at >= CURDATE(), tokens_out, 0)), 0)                      AS d_tout,
         COALESCE(SUM(kind = 'image'), 0)                                                  AS m_img,
         COALESCE(SUM(tokens_in), 0)                                                       AS m_tin,
         COALESCE(SUM(tokens_out), 0)                                                      AS m_tout
       FROM usage_log
       WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')`
    );
    const r = (Array.isArray(rows) ? rows[0] : {}) ?? {};
    const day = estimateCostUSD({ images: Number(r.d_img || 0), tokensIn: Number(r.d_tin || 0), tokensOut: Number(r.d_tout || 0) });
    const month = estimateCostUSD({ images: Number(r.m_img || 0), tokensIn: Number(r.m_tin || 0), tokensOut: Number(r.m_tout || 0) });
    const over = (DAILY_CAP > 0 && day >= DAILY_CAP) || (MONTHLY_CAP > 0 && month >= MONTHLY_CAP);
    budgetCache = { over, at: Date.now() };
    if (over) {
      console.warn(`[budget] OpenAI spend cap hit — day $${day.toFixed(2)}/${DAILY_CAP || '∞'}, month $${month.toFixed(2)}/${MONTHLY_CAP || '∞'} — shedding paid routes`);
    }
    return over;
  } catch {
    return false;
  }
}

/** Route guard: 503 when over the spend cap, else null. Place before the OpenAI call on paid routes. */
export async function requireBudget(): Promise<NextResponse | null> {
  return (await isOverBudget())
    ? NextResponse.json({ error: 'temporarily at capacity' }, { status: 503 })
    : null;
}

/** Per-day usage for the last `days` days. Returns [] if the table isn't there yet. */
export async function getUsageByDay(days = 30): Promise<UsageDay[]> {
  try {
    const rows = await query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day,
              SUM(kind = 'image') AS images,
              SUM(kind = 'chat')  AS chats,
              COALESCE(SUM(tokens_in), 0)  AS tin,
              COALESCE(SUM(tokens_out), 0) AS tout
       FROM usage_log
       WHERE created_at >= NOW() - INTERVAL ? DAY
       GROUP BY day ORDER BY day`,
      [days]
    );
    return rows.map((r: any) => ({
      day: r.day,
      images: Number(r.images ?? 0),
      chats: Number(r.chats ?? 0),
      tokensIn: Number(r.tin ?? 0),
      tokensOut: Number(r.tout ?? 0),
    }));
  } catch {
    return [];
  }
}
