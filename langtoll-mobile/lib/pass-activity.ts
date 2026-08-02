// One place that knows how to (re)present the pass as a Live Activity. Called on
// session completion AND on app launch: iOS ends an app's Live Activities on
// every app update (and reboot), so a still-valid pass must re-adopt its island
// countdown when the app comes back — otherwise any update mid-pass silently
// loses it (found the hard way on Ralph's phone, 2026-08-01).
import { getState, isUnlocked } from '@/lib/store';
import { activePack } from '@/lib/pack';
import { startPassActivity } from '@/modules/langtoll-activity/src';

export function syncPassActivity(): void {
  const s = getState();
  if (!isUnlocked(s) || !s.unlockExpiresAt) return;
  const pack = activePack();
  startPassActivity(
    s.unlockExpiresAt,
    (s.name ?? 'PASSENGER').toUpperCase(),
    `${pack.language.toUpperCase()} · ${pack.level}`,
    `№ ${String(s.sessionsCompleted).padStart(4, '0')}`
  );
}
