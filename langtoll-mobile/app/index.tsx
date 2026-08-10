// Home — the pass screen. One glance: is my pass active? One tap: pay the fare.
// (The lock itself lives in lib/blocking: real Screen Time shielding on a
// physical device, simulated via the store's timestamp in the simulator.)
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
import { JourneyLine } from '@/components/home/JourneyLine';
import { useTheme, space, radius, font } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { activePack } from '@/lib/pack';
import { effectiveExercisesPerUnlock, effectiveUnlockMinutes } from '@/lib/plans';
import { useT, type StringKey } from '@/lib/i18n';
import {
  useAppState,
  isUnlocked,
  unlockRemainingMs,
  wordsSeen,
  wordsMastered,
  lockNow,
} from '@/lib/store';

function Stat({ value, label }: { value: number; label: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.stat, { borderColor: theme.line, backgroundColor: theme.fill }]}>
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
  const state = useAppState();
  const t = useT();
  const [now, setNow] = useState(() => Date.now());
  const pack = activePack();
  const langName = t(`lang.${pack.language}` as StringKey);

  const unlocked = isUnlocked(state, now);

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

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={unlocked ? 0.7 : 0.35} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          {/* brand row */}
          <Entrance>
            <View style={styles.brandRow}>
              <Logo height={22} />
              <View style={styles.brandRight}>
                <View style={[styles.packChip, { borderColor: theme.line }]}>
                  <Text variant="overline" color="inkSoft">
                    {langName} · {pack.level}
                  </Text>
                </View>
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

          {/* hero */}
          <Entrance delay={60}>
            <Text variant="hero" style={{ marginTop: space.xxl }}>
              {unlocked ? pack.flavor.heroUnlocked : pack.flavor.heroLocked}
            </Text>
          </Entrance>

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

          <Entrance delay={220}>
            <Button
              label={unlocked ? t('home.topUp', { min: effectiveUnlockMinutes() }) : t('home.practice')}
              variant={unlocked ? 'pine' : 'primary'}
              icon={unlocked ? 'flash' : 'lock-open'}
              glow={!unlocked}
              onPress={() => router.push('/session')}
              full
              style={{ marginTop: space.xl }}
            />
          </Entrance>

          {/* stats — tap to open the word wallet (the actual words behind these counts) */}
          <Entrance delay={300}>
            <PressableScale onPress={() => router.push('/wallet')} haptic={null}>
              <View style={styles.statsRow}>
                <Stat value={wordsSeen(state)} label={t('home.statWords')} />
                <Stat value={wordsMastered(state)} label={t('home.statMastered')} />
                <Stat value={state.streak} label={t('home.statStreak')} />
              </View>
            </PressableScale>
          </Entrance>

          {/* your journey — the CEFR route line (A1 → B2) */}
          <Entrance delay={360}>
            <JourneyLine level={pack.level} />
          </Entrance>
        </View>

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
  content: { flex: 1, paddingHorizontal: space.xl, paddingTop: space.lg },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRight: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  gear: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  packChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: space.sm,
    marginTop: space.lg,
  },
  stat: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: space.md,
  },
  devRow: { paddingHorizontal: space.xl, paddingBottom: space.sm },
});
