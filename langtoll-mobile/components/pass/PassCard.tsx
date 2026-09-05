// The pass — LangToll's hero object. A glass ticket that is VOID while your apps
// are locked and comes alive (lime edge, glow, shimmer sweep, draining time bar)
// when a session has been paid. Everything on it is ticket language: fare,
// perforation, barcode, serial number.
import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Text } from '@/components/ui/Text';
import { useTheme, radius, space, shadow, font } from '@/design/theme';
import { t } from '@/lib/i18n';
import { withAlpha } from '@/lib/color';

// Deterministic pseudo-barcode: widths cycle through a fixed pattern.
const BARCODE = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 2, 1, 4, 1, 3, 1, 2, 1, 1, 3];

function Shimmer() {
  const x = useSharedValue(-1);
  useEffect(() => {
    x.value = withRepeat(
      withDelay(1200, withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.cubic) })),
      -1
    );
  }, [x]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value * 420 }, { rotate: '18deg' }],
  }));
  return (
    <Animated.View pointerEvents="none" style={[styles.shimmer, style]}>
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.09)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

interface Props {
  /** 'active' = an unlock grant is running; 'void' = apps are locked. */
  state: 'active' | 'void';
  remainingMs?: number;
  unlockMinutes: number;
  exercisesPerUnlock: number;
  packLabel: string; // e.g. 'DE · A1'
  serial: number; // sessions completed → ticket number
  /** First name, embossed on the ticket. */
  passenger?: string | null;
}

function formatMs(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function PassCard({
  state,
  remainingMs = 0,
  unlockMinutes,
  exercisesPerUnlock,
  packLabel,
  serial,
  passenger,
}: Props) {
  const theme = useTheme();
  const active = state === 'active';
  // "Through the fare gate" = green. Teal stays the brand/neutral colour (logo, locked state);
  // the live pass and its top-up CTA share the validation green so they read as one state, not
  // two competing accents.
  const activeColor = theme.pine;
  const progress = active ? Math.min(1, remainingMs / (unlockMinutes * 60_000)) : 0;

  const barcode = useMemo(() => BARCODE, []);

  return (
    <Animated.View
      // One spoken sentence for the whole ticket: VoiceOver otherwise reads
      // the barcode-less soup of labels, serial and chip in layout order.
      accessible
      accessibilityRole="summary"
      accessibilityLabel={
        active
          ? `${t('pass.active')}. ${formatMs(remainingMs)} ${t('pass.timeLeft')}`
          : `${t('pass.locked')}. ${t('pass.fare', { ex: exercisesPerUnlock, min: unlockMinutes })}`
      }
      style={[
        styles.wrap,
        shadow.card,
        active && [shadow.glow, { shadowColor: theme.pine }],
        { borderRadius: radius.xxl },
      ]}
    >
      <View
        style={[
          styles.clip,
          {
            borderRadius: radius.xxl,
            borderColor: active ? withAlpha(activeColor, 0.5) : theme.glassBorder,
          },
        ]}
      >
        <BlurView
          intensity={40}
          tint={theme.scheme === 'dark' ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.glassTint }]} />
        {/* specular top light */}
        <LinearGradient
          colors={['rgba(255,255,255,0.10)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.5 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {/* ghost toll stamp — the roundel pressed into the ticket stock itself,
            like the faint validation mark on a real transit pass. Ink turns to
            the validation green while the pass is active. */}
        <View
          pointerEvents="none"
          style={[styles.stampMark, { transform: [{ rotate: '-14deg' }] }]}
        >
          <View
            style={{
              width: 190,
              height: 190,
              borderRadius: 95,
              borderWidth: 26,
              borderColor: withAlpha(active ? activeColor : theme.ink, 0.055),
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 190,
              height: 30,
              borderRadius: 15,
              backgroundColor: withAlpha(active ? activeColor : theme.ink, 0.055),
            }}
          />
        </View>
        {active && <Shimmer />}
        {!active && (
          <View pointerEvents="none" style={[styles.stamp, { borderColor: withAlpha(theme.danger, 0.4) }]}>
            <Text
              variant="overline"
              style={{ color: withAlpha(theme.danger, 0.55), fontSize: 15, letterSpacing: 3 }}
            >
              {t('pass.expired')}
            </Text>
          </View>
        )}

        <View style={styles.pad}>
          {/* header row */}
          <View style={styles.rowBetween}>
            <Text variant="overline" color="inkSoft">
              LangToll
            </Text>
            <View
              style={[
                styles.chip,
                {
                  backgroundColor: active ? withAlpha(activeColor, 0.14) : withAlpha(theme.danger, 0.1),
                  borderColor: active ? withAlpha(activeColor, 0.4) : withAlpha(theme.danger, 0.35),
                },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: active ? activeColor : theme.danger },
                ]}
              />
              <Text
                variant="caption"
                style={{ color: active ? activeColor : theme.danger, letterSpacing: 1 }}
              >
                {active ? t('pass.active') : t('pass.expired')}
              </Text>
            </View>
          </View>

          {/* body */}
          {active ? (
            <View style={{ marginTop: space.lg }}>
              <Text variant="metric" style={{ fontSize: 52, lineHeight: 56, color: activeColor }}>
                {formatMs(remainingMs)}
              </Text>
              <Text variant="callout" color="inkSoft" style={{ marginTop: 2 }}>
                {t('pass.timeLeft')}
              </Text>
              {/* draining time bar */}
              <View style={[styles.track, { backgroundColor: theme.fillStrong }]}>
                <View
                  style={[
                    styles.fill,
                    { width: `${progress * 100}%`, backgroundColor: activeColor },
                  ]}
                />
              </View>
            </View>
          ) : (
            <View style={{ marginTop: space.lg }}>
              <Text variant="metric" style={{ fontFamily: font.display, fontSize: 34, lineHeight: 38, letterSpacing: -0.6 }}>
                {t('pass.locked')}
              </Text>
              <Text variant="callout" color="inkSoft" style={{ marginTop: space.xs }}>
                {t('pass.fare', { ex: exercisesPerUnlock, min: unlockMinutes })}
              </Text>
            </View>
          )}

          {passenger ? (
            <View style={{ marginTop: space.md }}>
              <Text variant="caption" color="inkFaint" style={{ letterSpacing: 2, fontSize: 10 }}>
                {t('pass.passenger')}
              </Text>
              <Text variant="label" style={{ letterSpacing: 1.5, marginTop: 1 }}>
                {passenger.toUpperCase()}
              </Text>
            </View>
          ) : null}

          {/* perforation */}
          <View style={styles.perforation}>
            {Array.from({ length: 24 }).map((_, i) => (
              <View key={i} style={[styles.perfDash, { backgroundColor: theme.line }]} />
            ))}
          </View>

          {/* stub: barcode + meta */}
          <View style={styles.rowBetween}>
            <View style={styles.barcode}>
              {barcode.map((w, i) => (
                <View
                  key={i}
                  style={{
                    width: w,
                    height: 22,
                    borderRadius: 0.5,
                    backgroundColor: active ? theme.ink : theme.inkFaint,
                    opacity: 0.85,
                  }}
                />
              ))}
            </View>
            <View style={{ alignItems: 'flex-end', gap: 2 }}>
              <Text variant="caption" color="inkFaint" style={{ fontFamily: font.semibold, letterSpacing: 1.2 }}>
                {packLabel}
              </Text>
              <Text variant="caption" color="inkFaint" style={{ letterSpacing: 1.2 }}>
                № {String(serial).padStart(4, '0')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: 'transparent' },
  clip: { overflow: 'hidden', borderWidth: 1 },
  pad: { padding: space.xl },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  track: {
    height: 4,
    borderRadius: 2,
    marginTop: space.lg,
    overflow: 'hidden',
  },
  fill: { height: 4, borderRadius: 2 },
  perforation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: space.lg,
  },
  perfDash: { width: 8, height: 1 },
  barcode: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  shimmer: {
    position: 'absolute',
    top: -60,
    bottom: -60,
    left: -120,
    width: 90,
  },
  stamp: {
    position: 'absolute',
    right: 20,
    top: '56%',
    borderWidth: 2,
    borderColor: 'rgba(255,92,122,0.4)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    transform: [{ rotate: '-12deg' }],
    zIndex: 10,
  },
  stampMark: {
    position: 'absolute',
    right: -34,
    top: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
