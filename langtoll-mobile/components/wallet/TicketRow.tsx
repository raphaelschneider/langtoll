// One word as a ticket stub — the wallet's unit, and now home's too.
//
// Extracted from app/wallet.tsx when the iPad home screen started showing the
// most recent stubs beside the pass (founder call, 2026-09-09: "show more, not
// bigger"). It lives here rather than in two screens because the stub carries
// real meaning — colour and the validation stamp say COLLECTED, faded with a
// 3-dot meter says in progress — and two copies would drift the moment either
// screen was touched.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/PressableScale';
import { Entrance } from '@/components/ui/Entrance';
import { useTheme, space, radius, font } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { activePack } from '@/lib/pack';
import { progressRows } from '@/lib/store';
import { speakTarget } from '@/lib/tts';
import { canUseAudio } from '@/lib/plans';
import { openPaywall } from '@/lib/paywall';
import type { VocabItem } from '@/content';

/** Streak needed to "collect" a word — right three times running. */
export const MASTER = 3;

export interface Ticket {
  v: VocabItem;
  streak: number;
}

/**
 * Every word the learner has MET, closest-to-collected first. Words with no
 * item in the active pack are dropped: a pack or level change must not leave
 * stubs for words the course no longer teaches.
 */
export function ticketsForActivePack(): Ticket[] {
  const pack = activePack();
  const byId = new Map<string, VocabItem>();
  for (const v of pack.vocab) byId.set(v.id, v);
  return progressRows()
    .filter((p) => p.seen >= 1)
    .map((p) => ({ v: byId.get(p.item_id), streak: p.streak }))
    .filter((x): x is Ticket => !!x.v)
    .sort((a, b) => b.streak - a.streak);
}

/**
 * A ticket is a flashcard you can hear. Locked voice routes to the offer, the
 * same as the session's speaker — the affordance exists for everyone.
 */
export function hearVocab(v: VocabItem): void {
  if (!canUseAudio()) {
    openPaywall('wallet_voice');
    return;
  }
  speakTarget(v.de, { force: true });
}

export function TicketRow({
  v,
  streak,
  index = 0,
  onPress,
}: Ticket & { index?: number; onPress?: () => void }) {
  const theme = useTheme();
  const done = streak >= MASTER;
  return (
    <Entrance delay={Math.min(index, 8) * 35} from={8}>
      <PressableScale
        onPress={onPress ?? (() => hearVocab(v))}
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

const styles = StyleSheet.create({
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
