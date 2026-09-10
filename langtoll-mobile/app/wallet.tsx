// The wallet — your collection of words as ticket stubs. Every word you've MET shows up; the
// ones you've mastered (streak ≥ 3, right three times running) are "collected" — full colour,
// a green validation stamp. The rest are in-progress: faded, with a 3-dot streak meter showing
// how close they are to being collected. So the wallet is always populated and reads as a
// collection filling up, not an empty list. CEFR/word data comes from the pack; nothing hardcoded.
import React, { useMemo, useState } from 'react';
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
import { useLayout, band, MAX_WIDE_CONTENT } from '@/design/layout';
import { activePack } from '@/lib/pack';
import { useT } from '@/lib/i18n';
import { canUseAudio } from '@/lib/plans';
import { MASTER, TicketRow, ticketsForActivePack } from '@/components/wallet/TicketRow';

export default function Wallet() {
  const theme = useTheme();
  const L = useLayout();
  // The wallet is a deck of short cards, not prose, so the 640pt reading cap
  // that suits a paragraph just strands them in a column down the middle of a
  // 1032pt sheet. Widen the band where there is room and lay the tickets out
  // across it: three up on a wide window, two on a regular one (an 11" iPad in
  // portrait), one on a phone. Every cell lands near 310pt either way, which is
  // the same stub width the iPad home screen already uses.
  const walletBand = L.wide ? MAX_WIDE_CONTENT : L.maxContent;
  // Columns come from the MEASURED grid width, not from the window. Two reasons.
  // The wallet is a modal sheet — it is inset from the window (936pt inside a
  // 1032pt iPad), so window-derived breakpoints describe a box this content is
  // not in. And percentage flexBasis proved unreliable here: `flexBasis: '30%'`
  // resolved against something wider than the capped container and wrapped
  // three 30% cells onto two rows, so the column count did not match the rule
  // that chose it. Measuring once and handing each cell an exact width removes
  // both guesses. gridW = 0 on the first frame, which renders the phone stack —
  // correct as a starting point, and it settles on the same frame's layout pass.
  const [gridW, setGridW] = useState(0);
  const GAP = space.md;
  const cols = gridW >= 820 ? 3 : gridW >= 540 ? 2 : 1;
  const cellW = cols > 1 ? (gridW - GAP * (cols - 1)) / cols : undefined;
  const cellStyle = cellW ? { width: cellW } : undefined;
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
        <View style={[styles.header, band(L, walletBand)]}>
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

        <ScrollView
          contentContainerStyle={[styles.scroll, band(L, walletBand)]}
          showsVerticalScrollIndicator={false}
        >
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
            <View onLayout={(e) => setGridW(e.nativeEvent.layout.width)}>
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
                  <View style={cols > 1 ? styles.grid : { gap: space.md }}>
                    {collected.map(({ v, streak }, i) => (
                      <View key={v.id} style={cellStyle}>
                        <TicketRow v={v} streak={streak} index={i} />
                      </View>
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
                  <View style={cols > 1 ? styles.grid : { gap: space.md }}>
                    {pending.map(({ v, streak }, i) => (
                      <View key={v.id} style={cellStyle}>
                        <TicketRow v={v} streak={streak} index={collected.length + i} />
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
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
  // 44pt, the minimum comfortable touch target.
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
});
