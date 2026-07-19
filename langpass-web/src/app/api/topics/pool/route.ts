// The shared content pool: the catalogue's generated packs for one
// (language, level), served to EVERY user.
//
// This is what fixes exercise repetition. The bundled packs hold ~130 items per
// language/level, so a user doing ten unlocks a day exhausts them in days. The
// pool adds the catalogue on top — generated once, cached in `topic_packs`,
// then read from the database forever.
//
// DELIBERATELY NOT ENTITLEMENT-GATED. The custom-topic route is a Plus feature
// because it generates on demand for one person. This is the opposite: a fixed
// catalogue whose cost does not scale with users, and content variety is not
// something to withhold from the free tier — repetition is the thing most likely
// to make someone uninstall. Attestation, rate limiting and the budget cap still
// apply.
//
// WARMING. A request never generates more than ONE missing pack, so the first
// users through a (language, level) warm the cache gradually instead of one
// unlucky request paying for the whole catalogue. scripts/warm-pool.ts fills it
// ahead of launch so real users only ever see cache hits.
import { NextRequest, NextResponse } from 'next/server';
import { requireAttestation } from '@/lib/attest';
import { rateLimit, LIMITS } from '@/lib/ratelimit';
import { requireBudget } from '@/lib/usage';
import { query } from '@/lib/db';
import { TOPIC_CATALOGUE, topicSlug } from '@/lib/ai/catalogue';
import { generateTopicPack, LANGS, LEVELS } from '@/lib/ai/generate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const gate = await requireAttestation(req);
  if (gate) return gate;
  const limited = await rateLimit(req, 'topics', LIMITS.topics);
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const language = (searchParams.get('language') ?? 'de').toLowerCase();
  const level = (searchParams.get('level') ?? 'A1').toUpperCase();
  if (!LANGS[language] || !LEVELS.includes(level)) {
    return NextResponse.json({ error: 'invalid language/level' }, { status: 400 });
  }

  // Everything already generated for this pair.
  let cached: { content_key: string; pack: unknown }[] = [];
  try {
    const rows = await query(
      'SELECT content_key, pack FROM topic_packs WHERE language = ? AND level = ?',
      [language, level]
    );
    cached = Array.isArray(rows) ? (rows as typeof cached) : [];
  } catch {
    // DB unavailable — report an empty pool rather than failing the app's sync.
    return NextResponse.json({ packs: [], complete: false, catalogue: TOPIC_CATALOGUE.length });
  }

  const have = new Set(cached.map((r) => r.content_key));
  const packs = cached.map((r) => (typeof r.pack === 'string' ? JSON.parse(r.pack) : r.pack));

  // Warm exactly one missing topic, budget permitting. Ordered by the catalogue
  // so every client agrees on which topic comes next and concurrent requests
  // converge on the same one rather than racing to generate different ones.
  const missing = TOPIC_CATALOGUE.find((t) => !have.has(`${language}:${level}:${topicSlug(t)}`));
  if (missing && !(await requireBudget())) {
    try {
      packs.push(await generateTopicPack(missing, language, level));
    } catch (err) {
      console.warn('[pool] warm failed for', missing, err instanceof Error ? err.message : err);
    }
  }

  return NextResponse.json({
    packs,
    complete: packs.length >= TOPIC_CATALOGUE.length,
    catalogue: TOPIC_CATALOGUE.length,
  });
}
