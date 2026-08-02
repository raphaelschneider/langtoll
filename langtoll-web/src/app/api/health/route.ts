import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { attestEnforced } from '@/lib/attest';
import { entitlementEnforced } from '@/lib/entitlement';
import { deviceCheckConfigured } from '@/lib/devicecheck';

export async function GET(request: NextRequest) {
  // Armed-status of the paid-surface defences. Booleans only — never the secret VALUES, so this is
  // safe to expose publicly. Lets a deploy verify the honeymoon/reinstall gate is actually live in
  // prod (attestation enforced + entitlement enforced + DeviceCheck configured) without reading env.
  const gates = {
    attestEnforced: attestEnforced(),
    entitlementEnforced: entitlementEnforced(),
    deviceCheckConfigured: deviceCheckConfigured(),
  };
  try {
    // Test database connection
    const result = await query('SELECT 1 as test');

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      gates,
      test: result
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      gates,
      error: (error as Error).message
    }, { status: 500 });
  }
}
