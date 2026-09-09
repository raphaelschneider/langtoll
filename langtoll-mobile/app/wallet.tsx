// The wallet — your collection of words as ticket stubs. Every word you've MET shows up; the
// ones you've mastered (streak ≥ 3, right three times running) are "collected" — full colour,
// a green validation stamp. The rest are in-progress: faded, with a 3-dot streak meter showing
// how close they are to being collected. So the wallet is always populated and reads as a
// collection filling up, not an empty list. CEFR/word data comes from the pack; nothing hardcoded.
import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/PressableScale';
import { Entrance } from '@/components/ui/Entrance';
import { Tolly } from '@/components/ui/Tolly';
import { useTheme, space } from '@/design/theme';
import { useLayout, band } from '@/design/layout';
import { activePack } from '@/lib/pack';
import { useT } from '@/lib/i18n';
import { canUseAudio } from '@/lib/plans';
import { MASTER, TicketRow, ticketsForActivePack } from '@/components/wallet/TicketRow';

export default function Wallet() {
  const theme = useTheme();
  const L = useLayout();
  const t = useT();
  const pack = useMemo(() => activePack(), []);
  const audioAllowed = canUseAudio();

  // Shared with the iPad home screen — see components/wallet/TicketRow.
  const tickets = useMemo(() => ticketsForActivePack(), []);

  const collected = tickets.filter((x) => x.streak >= MASTER);
  const pending = tickets.filter((x) => x.streak < MASTER);
  const share = tickets.length ? collected.length / tickets.length : 0;

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={0.3} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.header, band(L)]}>
          <PressableScale
            onPress={() => router.back()}
            style={styles.close}
            haptic={null}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
          >
            <Ionicons name="close" size={22} color={theme.inkSoft} />
          </PressableScale>
          <Text variant="overline" color="inkFaint">
            {t('wallet.title')}
          </Text>
          <View style={styles.close} />
        </View>

        <ScrollView contentContainerStyle={[styles.scroll, band(L)]} showsVerticalScrollIndicator={false}>
          <Entrance>
            {/* Nested <Text> is our themed component, which resets to the body
                scale — the count used to render at body size inside a hero. */}
            <Text variant="hero">
              <Text variant="hero" style={{ color: theme.accent }}>{collected.length}</Text>
              <Text variant="hero" style={{ color: theme.inkFaint }}> / {tickets.length}</Text>
            </Text>
            <Text variant="callout" color="inkSoft" style={{ marginTop: 2 }}>
              {t('home.statMastered')} · {pack.name}
            </Text>
            {/* the collection filling up, as a bar */}
            <View style={[styles.bar, { backgroundColor: theme.fillStrong }]}>
              <View style={[styles.barFill, { backgroundColor: theme.accent, width: `${share * 100}%` }]} />
            </View>
            {audioAllowed && tickets.length > 0 && (
              <View style={styles.hintRow}>
                <Ionicons name="volume-medium-outline" size={14} color={theme.inkFaint} />
                <Text variant="caption" color="inkFaint">
                  {t('wallet.tapHint')}
                </Text>
              </View>
            )}
          </Entrance>

          {tickets.length === 0 ? (
            <Entrance delay={80} style={styles.empty}>
              <Tolly mood="asleep" size={120} />
              <Text variant="body" color="inkFaint" center style={{ marginTop: space.lg }}>
                {t('wallet.empty')}
              </Text>
            </Entrance>
          ) : (
            <>
              {collected.length > 0 && (
                <>
                  <View style={styles.sectionRow}>
                    <Text variant="overline" color="inkFaint">
                      {t('wallet.sectionCollected')}
                    </Text>
                    <Text variant="caption" color="inkFaint">
                      {collected.length}
                    </Text>
                  </View>
                  <View style={{ gap: space.md }}>
                    {collected.map(({ v, streak }, i) => (
                      <TicketRow key={v.id} v={v} streak={streak} index={i} />
                    ))}
                  </View>
                </>
              )}
              {pending.length > 0 && (
                <>
                  <View style={styles.sectionRow}>
                    <Text variant="overline" color="inkFaint">
                      {t('wallet.sectionProgress')}
                    </Text>
                    <Text variant="caption" color="inkFaint">
                      {pending.length}
                    </Text>
                  </View>
                  <View style={{ gap: space.md }}>
                    {pending.map(({ v, streak }, i) => (
                      <TicketRow key={v.id} v={v} streak={streak} index={collected.length + i} />
                    ))}
                  </View>
                </>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
  },
  close: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: space.xl, paddingTop: space.lg, paddingBottom: space.xxxl },
  bar: { height: 4, borderRadius: 2, overflow: 'hidden', marginTop: space.md },
  barFill: { height: 4, borderRadius: 2 },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: space.sm },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: space.xl,
    marginBottom: space.md,
  },
  empty: { alignItems: 'center', marginTop: space.xxxl },
});
