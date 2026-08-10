'use server';

import { revalidatePath } from 'next/cache';
import { setPricing } from '@/lib/settings';
import { query } from '@/lib/db';

/** Admin pricing editor. Writes to MySQL, then refreshes the dashboard and the (ISR-cached)
 *  public landing page so the new price shows up immediately rather than at the next window. */
/** Forget one install completely: its events, subscription mirror, attest keys
 *  and user row. Ported from relift-adm. Test devices and GDPR-style requests
 *  both land here; the app itself keeps working (device re-registers on next
 *  event) — this only clears the server's memory of it. */
export async function deleteDevice(formData: FormData): Promise<void> {
  const deviceId = String(formData.get('deviceId') ?? '').trim();
  if (!deviceId) return;
  await query('DELETE FROM app_events WHERE device_id = ?', [deviceId]);
  await query('DELETE FROM subscriptions WHERE device_id = ?', [deviceId]);
  await query('DELETE FROM attest_keys WHERE device_id = ?', [deviceId]);
  await query('DELETE FROM app_users WHERE device_id = ?', [deviceId]);
  revalidatePath('/langtoll-adm');
}

export async function updatePricing(formData: FormData): Promise<void> {
  await setPricing({
    monthly: Number(formData.get('monthly')),
    yearly: Number(formData.get('yearly')),
    currency: String(formData.get('currency') ?? 'USD'),
  });
  revalidatePath('/langtoll-adm');
  revalidatePath('/');
}
