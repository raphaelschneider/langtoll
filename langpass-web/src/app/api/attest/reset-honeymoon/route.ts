// DEV/admin tool: clear one physical device's DeviceCheck honeymoon flag so a tester can
// re-experience the free week on their own phone after many reinstalls. This UNDOES the
// reinstall-abuse protection for a single device, so it is gated behind the admin password
// (ADMIN_PASSWORD — the same secret that guards /langpass-adm), sent as x-admin-key. The app's
// dev-tools button prompts for it; it is never embedded in the bundle.
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { clearBit0, deviceCheckConfigured } from '@/lib/devicecheck';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function authorized(req: NextRequest): boolean {
  const pass = process.env.ADMIN_PASSWORD || '';
  if (!pass) return false; // fail closed when unconfigured
  return safeEqual(req.headers.get('x-admin-key') ?? '', pass);
}

interface Body {
  deviceToken?: string; // fresh DCDevice token, generated on the device
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="LangPass admin", charset="UTF-8"' },
    });
  }
  if (!deviceCheckConfigured()) {
    return NextResponse.json({ ok: false, error: 'DeviceCheck not configured' }, { status: 400 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  if (!body.deviceToken) {
    return NextResponse.json({ error: 'deviceToken required' }, { status: 400 });
  }

  // 1) Clear the persistent per-device bit at Apple.
  const cleared = await clearBit0(body.deviceToken);
  // 2) Reset the cached honeymoon verdict for THIS install's key so it re-evaluates (NULL = re-query
  //    bit0, which is now false → granted while within the 7-day install window).
  const keyId = req.headers.get('x-attest-key');
  if (keyId) {
    await query('UPDATE attest_keys SET honeymoon_ok = NULL WHERE key_id = ?', [keyId]).catch(() => {});
  }
  console.warn(`[attest] honeymoon RESET (dev) key:${keyId?.slice(0, 10) ?? '—'}… bit0Cleared:${cleared}`);
  return NextResponse.json({ ok: cleared, bit0Cleared: cleared, keyReset: !!keyId });
}
