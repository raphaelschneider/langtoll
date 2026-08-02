// Issues a short-lived, single-window App Attest challenge. The app hashes it (SHA256) and
// signs it with its attested key for the next attestation or assertion.
import { NextResponse } from 'next/server';
import { issueChallenge, attestConfigured } from '@/lib/attest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!attestConfigured()) {
    // Not configured (e.g. local dev) — return an empty 200 so the client can no-op gracefully.
    return NextResponse.json({ challenge: null });
  }
  return NextResponse.json({ challenge: issueChallenge() });
}

export async function POST() {
  return GET();
}
