// AI topic-pack generation — LangToll's only paid AI route.
// Server-side so the OpenAI key never ships in the app. Same gate chain:
//   attestation → rate limit → entitlement (Plus/honeymoon) → global budget.
// Generated packs are cached in `topic_packs` (keyed by language+level+topic,
// partitioned by goal when one is set) so a given request is generated once and
// served to everyone; the app caches it locally and drills it offline.
//
// Generation itself lives in @/lib/ai/generate, SHARED with the pool route.
// This file used to carry its own inline prompt + validation from before that
// extraction — which silently meant custom topics were generated WITHOUT the
// regional guidance (Brazilian PT, Peninsular ES, British EN), level structure
// requirements, and UI-locale glosses the pool packs got. One generator now.
import { NextRequest, NextResponse } from 'next/server';
import { generateTopicPack, cachedPack, LANGS, LEVELS } from '@/lib/ai/generate';
import { requireAttestation } from '@/lib/attest';
import { requireEntitlement } from '@/lib/entitlement';
import { rateLimit, LIMITS } from '@/lib/ratelimit';
import { requireBudget } from '@/lib/usage';
import { readJsonLimited } from '@/lib/bodylimit';
import { screenUserTopic } from '@/lib/ai/moderation';
import { registerPackAudio } from '@/lib/ai/tts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Body {
  topic?: string;
  language?: string;
  level?: string;
  /** The learner's long-term goal ("Pass the B1 exam") — optional free text. */
  goal?: string;
}

export async function POST(req: NextRequest) {
  const gate = await requireAttestation(req);
  if (gate) return gate;
  const limited = await rateLimit(req, 'topics', LIMITS.topics);
  if (limited) return limited;
  const unpaid = await requireEntitlement(req);
  if (unpaid) return unpaid;
  const capped = await requireBudget();
  if (capped) return capped;

  const parsed = await readJsonLimited<Body>(req, 4_000);
  if (!parsed.ok) return parsed.res;
  const topic = (parsed.data.topic ?? '').trim().slice(0, 80);
  const language = (parsed.data.language ?? 'de').toLowerCase();
  const level = (parsed.data.level ?? 'A1').toUpperCase();
  const goal = (parsed.data.goal ?? '').trim().slice(0, 120) || undefined;
  if (!topic || !LANGS[language] || !LEVELS.includes(level)) {
    return NextResponse.json({ error: 'invalid topic/language/level' }, { status: 400 });
  }

  // Screen user input BEFORE it reaches the model or the cache key. Runs after
  // the cheap gates above so abuse can't use it as a free moderation API. The
  // goal is user input exactly like the topic and goes through the same screen.
  const screened = await screenUserTopic(topic);
  if (!screened.ok) {
    return NextResponse.json({ error: screened.reason ?? 'topic rejected' }, { status: 422 });
  }
  let effectiveGoal = goal;
  if (goal) {
    const goalScreened = await screenUserTopic(goal);
    // A bad goal doesn't kill the request — the topic is still generatable
    // ungeared. Silently dropping it beats failing the whole pack.
    if (!goalScreened.ok) effectiveGoal = undefined;
  }

  try {
    return NextResponse.json(await respondWith(topic, language, level, effectiveGoal));
  } catch (err) {
    console.warn('[topics] generation failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'generation failed' }, { status: 502 });
  }
}

async function respondWith(topic: string, language: string, level: string, goal?: string) {
  const hit = await cachedPack(language, level, topic, goal);
  if (hit) {
    // Even a cache hit registers its texts for JIT audio — packs cached before
    // the audio feature existed become renderable on their next serve.
    void registerPackAudio(language, hit);
    return { pack: hit, cached: true };
  }
  const pack = await generateTopicPack(topic, language, level, goal);
  void registerPackAudio(language, pack);
  return { pack, cached: false };
}
