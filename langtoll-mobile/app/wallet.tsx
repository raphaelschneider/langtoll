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
import { useTheme, space, radius, font } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { activePack } from '@/lib/pack';
import { progressRows } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { speakTarget } from '@/lib/tts';
import { canUseAudio } from '@/lib/plans';
import { openPaywall } from '@/lib/paywall';
import type { VocabItem } from '@/content';

const MASTER = 3; // streak needed to "collect" a word

export default function Wallet() {
  const theme = useTheme();
  const t = useT();
  const pack = useMemo(() => activePack(), []);
  const audioAllowed = canUseAudio();

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

  const collected = tickets.filter((x) => x.streak >= MASTER);
  const pending = tickets.filter((x) => x.streak < MASTER);
  const share = tickets.length ? collected.length / tickets.length : 0;

  // A ticket is a flashcard you can hear. Locked voice routes to the offer,
  // same as the session's speaker — the affordance exists for everyone.
  function hear(v: VocabItem) {
    if (!audioAllowed) {
      openPaywall('wallet_voice');
      return;
    }
    speakTarget(v.de, { force: true });
  }

  function Ticket({ v, streak, index }: { v: VocabItem; streak: number; index: number }) {
    const done = streak >= MASTER;
    return (
      <Entrance delay={Math.min(index, 8) * 35} from={8}>
        <PressableScale
          onPress={() => hear(v)}
          accessibilityRole="button"
          accessibilityLabel={`${v.de}, ${v.en[0]}`}
          style={[
            styles.ticket,
            { backgroundColor: theme.surface, borderColor: theme.line, opacity: done ? 1 : 0.7 },
          ]}
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
        </PressableScale>
      </Entrance>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={0.3} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
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

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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
                      <Ticket key={v.id} v={v} streak={streak} index={i} />
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
                      <Ticket key={v.id} v={v} streak={streak} index={collected.length + i} />
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
