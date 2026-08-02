'use server';

import { revalidatePath } from 'next/cache';
import { setPricing } from '@/lib/settings';

/** Admin pricing editor. Writes to MySQL, then refreshes the dashboard and the (ISR-cached)
 *  public landing page so the new price shows up immediately rather than at the next window. */
export async function updatePricing(formData: FormData): Promise<void> {
  await setPricing({
    monthly: Number(formData.get('monthly')),
    yearly: Number(formData.get('yearly')),
    currency: String(formData.get('currency') ?? 'USD'),
  });
  revalidatePath('/langtoll-adm');
  revalidatePath('/');
}
