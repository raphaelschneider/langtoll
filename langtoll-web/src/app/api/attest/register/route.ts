// One-time per install: the app sends its keyId + attestation object (over a fresh challenge);
// we verify it against Apple's App Attest chain and store the device's public key. After this,
// the app can sign assertions that the AI routes accept (see requireAttestation).
import { NextRequest, NextResponse } from 'next/server';
import { registerAttestation, attestConfigured } from '@/lib/attest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RegisterBody {
  keyId?: string;
  attestation?: string; // base64
  challenge?: string;
  deviceId?: string;
}

export async function POST(req: NextRequest) {
  if (!attestConfigured()) {
    return NextResponse.json({ ok: true, skipped: true }); // no-op when not configured
  }
  let body: RegisterBody;
  try {
    body = (await req.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  if (!body.keyId || !body.attestation || !body.challenge) {
    return NextResponse.json({ error: 'keyId, attestation and challenge are required' }, { status: 400 });
  }
  try {
    await registerAttestation({
      keyId: body.keyId,
      attestation: body.attestation,
      challenge: body.challenge,
      deviceId: body.deviceId ?? null,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Loud — this is the moment a device's attestation is rejected. The message names the cause
    // (cert chain, bundle/team mismatch, or the dev-vs-production environment flag).
    console.warn(`[attest] register REJECTED for key ${body.keyId.slice(0, 12)}…: ${err instanceof Error ? err.message : String(err)}`);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'attestation failed' },
      { status: 401 }
    );
  }
}
