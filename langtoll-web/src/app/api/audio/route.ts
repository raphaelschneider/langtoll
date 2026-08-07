// JIT pronunciation audio for AI-generated pack items.
//
// GET /api/audio?lang=de&hash=<sha1> → audio/mpeg
//
// The authored corpus is static files under /audio-packs (pre-rendered,
// Cloudflare-cached); this route covers only texts that didn't exist until a
// user generated them. The app asks by HASH — the text itself never travels —
// and only hashes registered by pack generation (`jit_audio`) are
// synthesizable, so this can't be farmed as a free TTS proxy: unknown hash,
// plain 404. First request synthesizes and caches to disk; every later one is
// a file read.
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { rateLimit, LIMITS } from '@/lib/ratelimit';
import { ensureAudioFile } from '@/lib/ai/tts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, 'audio', LIMITS.audio);
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const lang = (searchParams.get('lang') ?? '').toLowerCase();
  const hash = (searchParams.get('hash') ?? '').toLowerCase();
  if (!/^[a-z]{2}$/.test(lang) || !/^[0-9a-f]{40}$/.test(hash)) {
    return NextResponse.json({ error: 'invalid lang/hash' }, { status: 400 });
  }

  const file = await ensureAudioFile(lang, hash);
  if (!file) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const audio = fs.readFileSync(file);
  return new NextResponse(audio, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(audio.length),
      // Content-addressed: the same hash can never mean different audio, so
      // cache as immutable at every layer (device, Cloudflare).
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
