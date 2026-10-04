// The product in one picture, for the hook screen: a phone with a feed behind
// LangToll's shield, and a word riding the Dynamic Island. Shows the mechanic
// instead of describing it (founder, 2026-10-04: "we're not being as convincing
// as we can on the hook"). Everything here mirrors what the phone really shows:
// the shield's title and button are the strings configureShieldAppearance sets,
// in the shield's own colours; the island pill is the Live Activity's word line.
// No third-party logo: the feed behind the shield is anonymous tiles, so nobody
// reads the app as "only for TikTok users".
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Tolly } from '@/components/ui/Tolly';
import { useTheme, radius } from '@/design/theme';
import { font } from '@/design/tokens';
import { withAlpha } from '@/lib/color';
import { SHIELD_COPY } from '@/lib/blocking';

// The shield's night-service palette (lib/blocking.ts, configureShieldAppearance).
const SHIELD_BG = '#0F161B';
const SHIELD_TITLE = '#ECE7D8';
const SHIELD_SUB = '#A2B2B6';
const SHIELD_BTN = '#5CBDCD';
const SHIELD_BTN_INK = '#0B1417';

export function ShieldPreview({ word, translation, width = 196 }: { word: string; translation: string; width?: number }) {
  const theme = useTheme();
  const height = Math.round(width * 2.05);
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${SHIELD_COPY.title} ${word}, ${translation}`}
      style={[styles.phone, { width, height, borderColor: withAlpha(theme.ink, 0.5), backgroundColor: SHIELD_BG }]}
    >
      {/* the feed, dimmed behind the shield */}
      <View style={styles.feed} pointerEvents="none">
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.tile, { backgroundColor: withAlpha('#FFFFFF', i === 1 ? 0.07 : 0.045) }]} />
        ))}
      </View>
      {/* Dynamic Island with the word of the moment */}
      <View style={[styles.island, { backgroundColor: '#000' }]}>
        <Text variant="caption" numberOfLines={1} style={{ color: SHIELD_TITLE, fontFamily: font.semibold, letterSpacing: 0, fontSize: 11 }}>
          {word}
        </Text>
        <Text variant="caption" numberOfLines={1} style={{ color: SHIELD_SUB, fontFamily: font.body, letterSpacing: 0, fontSize: 11 }}>
          {translation}
        </Text>
      </View>
      {/* the shield */}
      <View style={styles.shield}>
        <Tolly mood="stern" size={Math.round(width * 0.3)} />
        <Text variant="bodyMedium" center style={{ color: SHIELD_TITLE, fontSize: 13, lineHeight: 17, marginTop: 8 }}>
          {SHIELD_COPY.title}
        </Text>
        <Text variant="caption" center style={{ color: SHIELD_SUB, fontFamily: font.body, letterSpacing: 0, fontSize: 10, lineHeight: 13, marginTop: 4 }}>
          {SHIELD_COPY.subtitle}
        </Text>
        <View style={[styles.btn, { backgroundColor: SHIELD_BTN }]}>
          <Text variant="caption" style={{ color: SHIELD_BTN_INK, fontFamily: font.semibold, letterSpacing: 0, fontSize: 11 }}>
            {SHIELD_COPY.button}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phone: { borderRadius: 34, borderWidth: 3, overflow: 'hidden', alignSelf: 'center' },
  feed: { ...StyleSheet.absoluteFillObject, paddingTop: 44, paddingHorizontal: 10, gap: 8 },
  tile: { flex: 1, borderRadius: radius.md },
  island: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    maxWidth: '78%',
  },
  shield: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  btn: { marginTop: 12, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 },
});
