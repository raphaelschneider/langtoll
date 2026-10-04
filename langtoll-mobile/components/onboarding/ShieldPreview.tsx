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
import { Canvas, RoundedRect, LinearGradient, Shadow, vec, rrect, rect, Group } from '@shopify/react-native-skia';
import { Text } from '@/components/ui/Text';
import { Tolly } from '@/components/ui/Tolly';
import { radius } from '@/design/theme';
import { font } from '@/design/tokens';
import { withAlpha } from '@/lib/color';
import { SHIELD_COPY } from '@/lib/blocking';

// The shield's night-service palette (lib/blocking.ts, configureShieldAppearance).
const SHIELD_BG = '#0F161B';
const SHIELD_TITLE = '#ECE7D8';
const SHIELD_SUB = '#A2B2B6';
const SHIELD_BTN = '#5CBDCD';
const SHIELD_BTN_INK = '#0B1417';

/** Phone aspect (6.1-inch class), used to size the mock from whichever edge is known. */
export const PHONE_ASPECT = 2.05;

export function ShieldPreview({ word, translation, width = 196 }: { word: string; translation: string; width?: number }) {
  const height = Math.round(width * PHONE_ASPECT);
  // Bezel geometry: the Skia canvas is the phone body (with shadow margin), the
  // RN screen sits inset in it. Proportions follow a 6.1-inch iPhone.
  const M = 18; // shadow margin around the body
  const bezel = Math.max(5, Math.round(width * 0.034));
  const bodyR = Math.round(width * 0.17);
  const screenR = bodyR - bezel;
  const bodyW = width;
  const bodyH = height;
  const canvasW = bodyW + M * 2;
  const canvasH = bodyH + M * 2;
  const btnW = Math.max(2, Math.round(width * 0.016));
  return (
    <View style={{ width: canvasW, height: canvasH, alignSelf: 'center' }}>
      <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* body: titanium gradient, soft drop shadow, a hairline sheen on the edge */}
        <Group>
          <RoundedRect x={M} y={M} width={bodyW} height={bodyH} r={bodyR}>
            <LinearGradient start={vec(M, M)} end={vec(M + bodyW, M + bodyH)} colors={['#4A4F56', '#23272C', '#15181C', '#2C3137']} />
            <Shadow dx={0} dy={10} blur={18} color="rgba(0,0,0,0.55)" />
          </RoundedRect>
          <RoundedRect x={M + 0.75} y={M + 0.75} width={bodyW - 1.5} height={bodyH - 1.5} r={bodyR - 0.75} style="stroke" strokeWidth={1}>
            <LinearGradient start={vec(M, M)} end={vec(M, M + bodyH)} colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.25)']} />
          </RoundedRect>
          {/* side buttons: action + volume on the left, power on the right */}
          <RoundedRect x={M - btnW} y={M + bodyH * 0.16} width={btnW} height={bodyH * 0.035} r={1} color="#2A2E33" />
          <RoundedRect x={M - btnW} y={M + bodyH * 0.22} width={btnW} height={bodyH * 0.07} r={1} color="#2A2E33" />
          <RoundedRect x={M - btnW} y={M + bodyH * 0.305} width={btnW} height={bodyH * 0.07} r={1} color="#2A2E33" />
          <RoundedRect x={M + bodyW} y={M + bodyH * 0.24} width={btnW} height={bodyH * 0.11} r={1} color="#2A2E33" />
          {/* screen: pure black under the content, its own rounded corners */}
          <RoundedRect rect={rrect(rect(M + bezel, M + bezel, bodyW - bezel * 2, bodyH - bezel * 2), screenR, screenR)} color={SHIELD_BG} />
        </Group>
      </Canvas>
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${SHIELD_COPY.title} ${word}, ${translation}`}
      style={[styles.phone, { position: 'absolute', left: M + bezel, top: M + bezel, width: bodyW - bezel * 2, height: bodyH - bezel * 2, borderRadius: screenR }]}
    >
      {/* a sliver of the feed at the top, the rest under the shield, as on the phone */}
      <View style={styles.feed} pointerEvents="none">
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.tile, { backgroundColor: withAlpha('#FFFFFF', i === 1 ? 0.07 : 0.045) }]} />
        ))}
      </View>
      <View style={[styles.cover, { backgroundColor: withAlpha(SHIELD_BG, 0.94) }]} pointerEvents="none" />
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
        <Tolly mood="stern" size={Math.round(width * 0.36)} />
        <Text variant="bodyMedium" center style={{ color: SHIELD_TITLE, fontSize: Math.round(width * 0.075), lineHeight: Math.round(width * 0.095), marginTop: 10 }}>
          {SHIELD_COPY.title}
        </Text>
        <Text variant="caption" center style={{ color: SHIELD_SUB, fontFamily: font.body, letterSpacing: 0, fontSize: Math.round(width * 0.056), lineHeight: Math.round(width * 0.074), marginTop: 6 }}>
          {SHIELD_COPY.subtitle}
        </Text>
        <View style={[styles.btn, { backgroundColor: SHIELD_BTN, paddingHorizontal: Math.round(width * 0.09), paddingVertical: Math.round(width * 0.045) }]}>
          <Text variant="caption" style={{ color: SHIELD_BTN_INK, fontFamily: font.semibold, letterSpacing: 0, fontSize: Math.round(width * 0.062) }}>
            {SHIELD_COPY.button}
          </Text>
        </View>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phone: { overflow: 'hidden' },
  feed: { ...StyleSheet.absoluteFillObject, paddingTop: 44, paddingHorizontal: 10, gap: 8 },
  tile: { flex: 1, borderRadius: radius.md },
  island: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    maxWidth: '78%',
  },
  cover: { ...StyleSheet.absoluteFillObject, top: 46 },
  shield: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  btn: { marginTop: 14, borderRadius: 999 },
});
