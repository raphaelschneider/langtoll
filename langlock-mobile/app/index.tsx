// Home — the pass screen. One glance: is my pass active? One tap: pay the fare.
// (Lock is simulated in-app for now; the real Screen Time shield comes later
// via lib/blocking.)
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Redirect } from 'expo-router';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { PassCard } from '@/components/pass/PassCard';
import { Entrance } from '@/components/ui/Entrance';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme, space, radius, font } from '@/design/theme';
import { activePack } from '@/lib/pack';
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

  if (!state.onboarded) return <Redirect href="/onboarding" />;

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={unlocked ? 0.7 : 0.35} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          {/* brand row */}
          <Entrance>
            <View style={styles.brandRow}>
              <Text style={{ fontFamily: font.serifItalic, fontSize: 20, color: theme.ink }}>
                langpass
              </Text>
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
              <PassCard
                state={unlocked ? 'active' : 'void'}
                remainingMs={unlockRemainingMs(state, now)}
                unlockMinutes={state.unlockMinutes}
                exercisesPerUnlock={state.exercisesPerUnlock}
                packLabel={`${pack.language.toUpperCase()} · ${pack.level}`}
                serial={state.sessionsCompleted}
                passenger={state.name}
              />
            </View>
          </Entrance>

          <Entrance delay={220}>
            <Button
              label={unlocked ? t('home.topUp', { min: state.unlockMinutes }) : t('home.practice')}
              variant={unlocked ? 'pine' : 'primary'}
              icon={unlocked ? 'flash' : 'lock-open'}
              glow={!unlocked}
              onPress={() => router.push('/session')}
              full
              style={{ marginTop: space.xl }}
            />
          </Entrance>

          {/* stats */}
          <Entrance delay={300}>
            <View style={styles.statsRow}>
              <Stat value={wordsSeen(state)} label={t('home.statWords')} />
              <Stat value={wordsMastered(state)} label={t('home.statMastered')} />
              <Stat value={state.streak} label={t('home.statStreak')} />
            </View>
          </Entrance>
        </View>

        {__DEV__ && unlocked && (
          <View style={styles.devRow}>
            <Button label={t('home.lockDev')} variant="ghost" onPress={lockNow} />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
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
