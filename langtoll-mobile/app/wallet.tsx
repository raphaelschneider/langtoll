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
import { useTheme, space, radius, font } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { activePack } from '@/lib/pack';
import { progressRows } from '@/lib/store';
import { useT } from '@/lib/i18n';
import type { VocabItem } from '@/content';

const MASTER = 3; // streak needed to "collect" a word

export default function Wallet() {
  const theme = useTheme();
  const t = useT();
  const pack = useMemo(() => activePack(), []);

  const byId = useMemo(() => {
    const m = new Map<string, VocabItem>();
    for (const v of pack.vocab) m.set(v.id, v);
    return m;
  }, [pack]);

  const tickets = useMemo(
    () =>
      progressRows()
        .filter((p) => p.seen >= 1)
        .map((p) => ({ v: byId.get(p.item_id), streak: p.streak }))
        .filter((x): x is { v: VocabItem; streak: number } => !!x.v)
        .sort((a, b) => b.streak - a.streak), // closest-to-collected first
    [byId]
  );

  const collected = tickets.filter((x) => x.streak >= MASTER).length;

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={0.3} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} style={styles.close} haptic={null}>
            <Ionicons name="close" size={22} color={theme.inkSoft} />
          </PressableScale>
          <Text variant="overline" color="inkFaint">
            {t('wallet.title')}
          </Text>
          <View style={styles.close} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text variant="hero">
            <Text style={{ color: theme.accent }}>{collected}</Text>
            <Text style={{ color: theme.inkFaint }}> / {tickets.length}</Text>
          </Text>
          <Text variant="callout" color="inkSoft" style={{ marginTop: 2, marginBottom: space.xl }}>
            {t('home.statMastered')} · {pack.name}
          </Text>

          {tickets.length === 0 ? (
            <Text variant="body" color="inkFaint" style={{ marginTop: space.xxl, textAlign: 'center' }}>
              {t('wallet.empty')}
            </Text>
          ) : (
            <View style={{ gap: space.md }}>
              {tickets.map(({ v, streak }) => {
                const done = streak >= MASTER;
                return (
                  <View
                    key={v.id}
                    style={[styles.ticket, { backgroundColor: theme.surface, borderColor: theme.line, opacity: done ? 1 : 0.5 }]}
                  >
                    <View style={[styles.rail, { backgroundColor: done ? theme.accent : theme.inkFaint }]} />
                    <View style={styles.perf}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <View key={i} style={[styles.perfDot, { backgroundColor: theme.paper }]} />
                      ))}
                    </View>
                    <View style={styles.ticketBody}>
                      <Text
                        variant="caption"
                        style={{ fontFamily: font.mono, color: theme.inkFaint, letterSpacing: 1.2, textTransform: 'uppercase' }}
                      >
                        {v.pos}
                      </Text>
                      <Text variant="headline" style={{ marginTop: 2 }} numberOfLines={1}>
                        {v.de}
                      </Text>
                      <Text variant="callout" color="inkSoft" numberOfLines={1}>
                        {v.en[0]}
                      </Text>
                    </View>
                    {done ? (
                      <View style={[styles.stamp, { borderColor: withAlpha(theme.pine, 0.5), backgroundColor: withAlpha(theme.pine, 0.12) }]}>
                        <Ionicons name="checkmark" size={16} color={theme.pine} />
                      </View>
                    ) : (
                      <View style={styles.meter}>
                        {[0, 1, 2].map((i) => (
                          <View
                            key={i}
                            style={[styles.mdot, { backgroundColor: i < streak ? theme.accent : theme.fillStrong }]}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
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
  close: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: space.xl, paddingTop: space.lg, paddingBottom: space.xxxl },
  ticket: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    paddingRight: space.lg,
  },
  rail: { width: 6, alignSelf: 'stretch' },
  perf: { width: 10, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'space-around', paddingVertical: space.md },
  perfDot: { width: 3, height: 3, borderRadius: 1.5 },
  ticketBody: { flex: 1, paddingVertical: space.md, paddingLeft: space.xs },
  stamp: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  meter: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  mdot: { width: 7, height: 7, borderRadius: 3.5 },
});
