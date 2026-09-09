// Home — the pass screen. One glance: is my pass active? One tap: pay the fare.
// (The lock itself lives in lib/blocking: real Screen Time shielding on a
// physical device, simulated via the store's timestamp in the simulator.)
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Redirect } from 'expo-router';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { PassCard } from '@/components/pass/PassCard';
import { Entrance } from '@/components/ui/Entrance';
import { Tolly } from '@/components/ui/Tolly';
import { endPassActivity, activitySupported, areActivitiesEnabled } from '@/modules/langtoll-activity/src';
import { openSystemSettings } from '@/lib/notify';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PressableScale } from '@/components/ui/PressableScale';
import { Logo } from '@/components/ui/Logo';
import { FareGate, type FareGateTrigger } from '@/components/pass/FareGate';
import { JourneyLine, nextStop } from '@/components/home/JourneyLine';
import { useTheme, space, radius } from '@/design/theme';
import { useLayout, opticalCenter, MAX_WIDE_CONTENT } from '@/design/layout';
import { TicketRow, ticketsForActivePack } from '@/components/wallet/TicketRow';
import { withAlpha } from '@/lib/color';
import { activePack } from '@/lib/pack';
import { packFor } from '@/content';
import { effectiveExercisesPerUnlock, effectiveUnlockMinutes, effectiveLevel, canUseLevel, describePlusLoss } from '@/lib/plans';
import { openPaywall } from '@/lib/paywall';
import { useT, type StringKey } from '@/lib/i18n';
import {
  useAppState,
  isUnlocked,
  unlockRemainingMs,
  wordsSeen,
  wordsMastered,
  lockNow,
} from '@/lib/store';

function Stat({ value, label, divider }: { value: number; label: string; divider?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.stat, divider && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: theme.line }]}>
      <Text variant="headline" center style={{ fontSize: 24 }}>
        {value}
      </Text>
      <Text variant="caption" color="inkFaint" center style={{ marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}

export default function Home() {
  const theme = useTheme();
  const L = useLayout();
  const state = useAppState();
  const t = useT();
  const [now, setNow] = useState(() => Date.now());
  const pack = activePack();
  const langName = t(`lang.${pack.language}` as StringKey);

  const unlocked = isUnlocked(state, now);
  // How far through THIS level's words: drives the journey line's creep toward
  // the next station. Pack-scoped on purpose — words from a previous level or
  // an AI pack don't move you along the A1→B2 route.
  // The BUNDLED level pack, not activePack(): that one carries the generated
  // pool too, which put "4683 words" on the route caption. The route is the
  // authored curriculum; the pool is extra practice, not extra distance.
  const levelVocab = packFor(state.learningLanguage, effectiveLevel()).vocab;
  const levelMastered = levelVocab.filter((v) => (state.progress[v.id]?.streak ?? 0) >= 3).length;
  const levelProgress = levelVocab.length === 0 ? 0 : levelMastered / levelVocab.length;
  const nextLevel = nextStop(pack.level);
  // The most recently-earned ticket stubs, for the room iPad has and the phone
  // doesn't (founder call, 2026-09-09: "show more, not bigger"). Closest to
  // collected first, so what's nearly won is what's on screen. Deliberately NO
  // empty state: a learner with nothing collected gets no section at all
  // rather than a box explaining its own emptiness ("just don't show anything
  // if there's nothing to show").
  const recentTickets = L.regular ? ticketsForActivePack().slice(0, 3) : [];

  // What a lapse would change, as one localized clause — shared with the notification.
  const lapseChanges = describePlusLoss(t);
  // Hours until a cancelled trial ends, or null when nothing is ending.
  const trialEndsIn =
    state.plan === 'plus' && state.plusWillRenew === false && state.plusExpiresAt
      ? (Date.parse(state.plusExpiresAt) - now) / 3_600_000
      : null;

  // Tick the countdown once a second while a grant is active.
  useEffect(() => {
    if (!unlocked) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [unlocked]);

  // Fare-gate cinematic: fire on the void<->active transition (fare paid → validate; locked → void).
  const [gate, setGate] = useState<FareGateTrigger>(null);
  const prevUnlocked = useRef(unlocked);
  useEffect(() => {
    if (prevUnlocked.current !== unlocked) {
      setGate(unlocked ? 'validate' : 'void');
      // Pass just expired while the app is open — take the island countdown down with it.
      if (!unlocked) endPassActivity();
      prevUnlocked.current = unlocked;
    }
  }, [unlocked]);

  if (!state.onboarded) return <Redirect href="/onboarding" />;

  // Home's sections, declared once and composed below into either the phone's
  // single column or the iPad's two panes. Extracted rather than duplicated so
  // the two layouts can never drift apart.
  const secBrand = (
    <>
      {/* brand row */}
      <Entrance>
        <View style={styles.brandRow}>
          <Logo height={22} />
          <View style={styles.brandRight}>
            <PressableScale
              onPress={() => router.push('/settings')}
              haptic={null}
              accessibilityRole="button"
              style={[styles.packChip, { borderColor: theme.line }]}
            >
              <Text variant="overline" color="inkSoft">
                {langName} · {pack.level}
              </Text>
            </PressableScale>
            <PressableScale
              onPress={() => router.push('/settings')}
              style={styles.gear}
              haptic={null}
            >
              <Ionicons name="settings-outline" size={20} color={theme.inkSoft} />
            </PressableScale>
          </View>
        </View>
      </Entrance>
    </>
  );
  const secHero = (
    <>
      {/* hero */}
      <Entrance delay={60}>
        <Text variant="hero" style={{ marginTop: space.xxl }}>
          {unlocked ? pack.flavor.heroUnlocked : pack.flavor.heroLocked}
        </Text>
      </Entrance>
    </>
  );
  const secPass = (
    <>
      {/* the pass */}
      <Entrance delay={140}>
        <View style={{ marginTop: space.xl }}>
          {/* Tolly at the booth, always — the original brief: happy when the toll is
              paid, sad when it isn't. Paws on the card's top edge, in the clear right
              third above it (the headline never reaches there). */}
          <Tolly
            mood={unlocked ? 'peek' : 'peekSad'}
            size={64}
            style={{ position: 'absolute', top: -41, right: space.lg, zIndex: 1, height: 44 }}
          />
          <PassCard
            state={unlocked ? 'active' : 'void'}
            remainingMs={unlockRemainingMs(state, now)}
            unlockMinutes={effectiveUnlockMinutes()}
            exercisesPerUnlock={effectiveExercisesPerUnlock()}
            packLabel={`${pack.language.toUpperCase()} · ${pack.level}`}
            serial={state.sessionsCompleted}
            passenger={state.name}
          />
        </View>
      </Entrance>
    </>
  );
  const secBanners = (
    <>
      {/* A pass is running but iOS won't show its countdown: the user hit
          "Turn Off" while clearing the Live Activity (one swipe away from
          "Clear" — easy to hit by mistake, founder did it too). The app
          cannot re-enable it; this row explains and jumps straight to
          LangToll's settings page. Renders only where the feature exists
          (real build), and self-clears on the next countdown tick after
          they flip it back. */}
      {unlocked && activitySupported() && !areActivitiesEnabled() && (
        <Entrance delay={180}>
          <PressableScale
            onPress={openSystemSettings}
            style={[styles.activityOff, { borderColor: theme.amber, backgroundColor: withAlpha(theme.amber, 0.08) }]}
          >
            <Ionicons name="notifications-off-outline" size={18} color={theme.amber} />
            <Text variant="caption" style={{ flex: 1, color: theme.amber }}>
              {t('home.activityOff')}
            </Text>
            <Ionicons name="chevron-forward" size={14} color={theme.amber} />
          </PressableScale>
        </Entrance>
      )}

      {/* A cancelled trial about to take the fare with it: the same warning
          as the notification, for the phone where notifications are off. */}
      {trialEndsIn !== null && trialEndsIn <= 48 && lapseChanges && (
        <Entrance delay={180}>
          <PressableScale
            onPress={() => openPaywall('trial_end')}
            style={[styles.activityOff, { borderColor: theme.amber, backgroundColor: withAlpha(theme.amber, 0.08) }]}
          >
            <Ionicons name="hourglass-outline" size={18} color={theme.amber} />
            <Text variant="caption" style={{ flex: 1, color: theme.amber }}>
              {t('home.trialEnds', {
                when: trialEndsIn <= 24 ? t('common.today') : t('common.tomorrow'),
                changes: lapseChanges,
              })}
            </Text>
            <Ionicons name="chevron-forward" size={14} color={theme.amber} />
          </PressableScale>
        </Entrance>
      )}
    </>
  );
  const secCta = (
    <>
      <Entrance delay={220}>
        <Button
          label={unlocked ? t('home.topUp', { min: effectiveUnlockMinutes() }) : t('home.practice')}
          variant={unlocked ? 'pine' : 'primary'}
          icon={unlocked ? 'flash' : 'lock-open'}
          glow={!unlocked}
          onPress={() => router.push('/session')}
          full
          style={{ marginTop: L.wide ? 0 : space.xl }}
        />
      </Entrance>
    </>
  );
  const secWallet = (
    <>
      {/* the wallet strip — one tappable row, chevron says so. Reads as a
          single object (the wallet) rather than three unrelated buttons. */}
      <Entrance delay={300}>
        <PressableScale
          onPress={() => router.push('/wallet')}
          haptic={null}
          accessibilityRole="button"
          accessibilityLabel={t('home.wallet')}
          style={[styles.walletStrip, { borderColor: theme.line, backgroundColor: theme.fill }]}
        >
          <Stat value={wordsSeen(state)} label={t('home.statWords')} />
          <Stat value={wordsMastered(state)} label={t('home.statMastered')} divider />
          <Stat value={state.streak} label={t('home.statStreak')} divider />
          <View style={styles.walletChevron}>
            <Ionicons name="chevron-forward" size={16} color={theme.inkFaint} />
          </View>
        </PressableScale>
      </Entrance>
    </>
  );
  const secTickets =
    recentTickets.length === 0 ? null : (
      <>
        <View style={styles.ticketHead}>
          <Text variant="overline" color="inkFaint">
            {t('home.recent')}
          </Text>
          <Text variant="caption" color="inkFaint">
            {wordsSeen(state)}
          </Text>
        </View>
        {/* Across on a wide window, stacked otherwise. Three stubs side by side
            fill the band under the panes; the same three in a 640pt column
            would be a narrow ladder with a word and a translation squeezed
            into a third of the width. */}
        <View style={L.wide ? styles.ticketRow : { gap: space.md }}>
          {recentTickets.map(({ v, streak }, i) => (
            <View key={v.id} style={L.wide ? { flex: 1 } : undefined}>
              <TicketRow v={v} streak={streak} index={i} />
            </View>
          ))}
        </View>
      </>
    );

  const secJourney = (
    <>
      {/* your journey — the CEFR route line (A1 → B2) */}
      <Entrance delay={360}>
        <JourneyLine
          level={pack.level}
          progress={levelProgress}
          label={t('home.route')}
          trailing={
            !nextLevel
              ? undefined
              : canUseLevel(nextLevel)
                ? t('home.nextStop', { level: nextLevel, n: Math.max(0, levelVocab.length - levelMastered) })
                : t('home.nextStopPlus', { level: nextLevel })
          }
        />
      </Entrance>
    </>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={unlocked ? 0.7 : 0.35} />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: L.gutter },
            L.regular && styles.contentCentered,
          ]}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
        >
          {/* The content column. On a phone this is simply the screen width; on
              iPad it caps and centres, because a 1180pt-wide pass card and a
              full-bleed button are the "crowded / hard to use" rejection. */}
          <View
            style={[
              styles.column,
              { maxWidth: L.wide ? MAX_WIDE_CONTENT : L.maxContent },
              L.regular && styles.columnFill,
            ]}
          >
            {secBrand}
            <View style={[styles.centeredBody, opticalCenter(L)]}>
            {L.wide ? (
              /* Wide window: the pass is the object you look at, the wallet and
                 route are what you act on — so they sit beside it rather than
                 a screen-height scroll below it. The headline stays full width
                 above both, which is what lets the card and the CTA start on
                 the same line; with the hero inside the left pane the button
                 lined up against the headline instead, and read as a caption
                 to it. Narrower windows keep the single column. */
              <>
                {secHero}
                <View style={styles.panes}>
                  <View style={styles.paneLeft}>{secPass}</View>
                  <View style={styles.paneRight}>
                    {secBanners}
                    {secCta}
                    {secWallet}
                    {secJourney}
                  </View>
                </View>
                {secTickets}
              </>
            ) : (
              <>
                {secHero}
                {secPass}
                {secBanners}
                {secCta}
                {secWallet}
                {secJourney}
                {secTickets}
              </>
            )}
            </View>
          </View>
        </ScrollView>

        {__DEV__ && unlocked && (
          <View style={styles.devRow}>
            <Button label={t('home.lockDev')} variant="ghost" onPress={lockNow} />
          </View>
        )}
      </SafeAreaView>
      <FareGate trigger={gate} onDone={() => setGate(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  // The capped, centred content column — the whole iPad story in three lines.
  column: { width: '100%', alignSelf: 'center' },
  panes: { flexDirection: 'row', gap: space.xxl, alignItems: 'flex-start' },
  // The pass gets the larger share: it is the object the screen is about.
  paneLeft: { flex: 1.15 },
  // Matches the pass block's own marginTop so both panes start on one line.
  paneRight: { flex: 1, marginTop: space.xl },
  activityOff: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    marginTop: space.md,
  },
  // No paddingHorizontal here — the gutter is responsive and set at the call site.
  content: { paddingTop: space.lg, paddingBottom: space.xl },
  // iPad screens are far taller than this content. Left at the top it reads as
  // a phone layout stranded on a big display; centred, it reads as composed.
  // Only the body centres — the brand row stays where a header belongs, at the
  // top. Centring it too left the logo floating a third of the way down.
  contentCentered: { flexGrow: 1 },
  columnFill: { flexGrow: 1 },
  // The flex half of optical centring; opticalCenter(L) supplies the rest.
  centeredBody: { flexGrow: 1 },
  ticketRow: { flexDirection: 'row', gap: space.md, alignItems: 'stretch' },
  ticketHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: space.xl,
    marginBottom: space.md,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRight: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  gear: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  packChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  walletStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    marginTop: space.lg,
    paddingRight: space.sm,
  },
  stat: {
    flex: 1,
    paddingVertical: space.md,
  },
  walletChevron: { width: 20, alignItems: 'center' },
  devRow: { paddingHorizontal: space.xl, paddingBottom: space.sm },
});
