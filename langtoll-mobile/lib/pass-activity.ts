// One place that knows how to (re)present the pass as a Live Activity. Called on
// session completion AND on app launch: iOS ends an app's Live Activities on
// every app update (and reboot), so a still-valid pass must re-adopt its island
// countdown when the app comes back — otherwise any update mid-pass silently
// loses it (found the hard way on Ralph's phone, 2026-08-01).
import { getState, isUnlocked } from '@/lib/store';
import { activePack } from '@/lib/pack';
import { startPassActivity, setWordRotation } from '@/modules/langtoll-activity/src';
import { pickRotationDeck } from '@/lib/word-rotation';
import { t } from '@/lib/i18n';

/** Returns whether the Live Activity actually started — callers that only
 *  fire-and-forget can ignore it; the dev rig surfaces it for diagnosis. */
export function syncPassActivity(): boolean {
  const s = getState();
  if (!isUnlocked(s) || !s.unlockExpiresAt) return false;
  const pack = activePack();

  // The island's vocabulary rotation: the activity launches showing card 0 and
  // the DeviceActivity extension advances through the stored deck on its
  // background wake-ups (armed in blocking.ts). An empty deck (fresh install)
  // degrades to the plain countdown island.
  const deck = pickRotationDeck();
  setWordRotation(deck);
  const first = deck[0] ?? null;

  return startPassActivity(
    s.unlockExpiresAt,
    (s.name ?? 'PASSENGER').toUpperCase(),
    `${pack.language.toUpperCase()} · ${pack.level}`,
    `№ ${String(s.sessionsCompleted).padStart(4, '0')}`,
    first ? first[0] : null,
    first?.[1] ?? null,
    // The widget can't read the JS catalogs, so it gets its words in the app's
    // language here. Fixed per start; launch re-syncs, so a locale switch
    // reaches the card on the next app launch.
    {
      active: t('pass.active'),
      expired: t('pass.expired'),
      timeLeft: t('pass.timeLeft'),
      left: t('activity.left'),
      expiredShort: t('activity.expiredShort'),
      expiredCta: t('activity.expiredCta'),
    }
  );
}
