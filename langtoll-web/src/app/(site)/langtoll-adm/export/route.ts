// Funnel export — the same report the Funnel tab renders, as a downloadable CSV or the
// Markdown text the copy button uses. Lives under /langtoll-adm so the middleware's Basic-auth
// gate covers it exactly like the page.
//   GET /langtoll-adm/export?fmt=csv|txt&days=30|all&test=1
import { NextRequest, NextResponse } from 'next/server';
import { loadFunnel, parseDays, reportToCsv, reportToText } from '../funnel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const days = parseDays(sp.get('days') ?? undefined);
  const excludeTest = sp.get('test') !== '1';
  const fmt = sp.get('fmt') === 'txt' ? 'txt' : 'csv';
  const report = await loadFunnel({ days, excludeTest });
  const body = fmt === 'csv' ? reportToCsv(report) : reportToText(report);
  const stamp = report.generatedAt.slice(0, 10);
  const name = `langtoll-funnel-${days ?? 'all'}-${stamp}.${fmt}`;
  return new NextResponse(body, {
    headers: {
      'Content-Type': fmt === 'csv' ? 'text/csv; charset=utf-8' : 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${name}"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
