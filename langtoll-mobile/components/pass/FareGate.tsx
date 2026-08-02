// The fare-gate moment — the full cinematic when the pass changes state.
//   • 'validate' (paid → through): scrim flash, the two gate arms PART (sweep open), then a
//     green ring-burst + the stamp thunks into the cleared centre. Success haptic + gate/stamp SFX.
//   • 'void' (locked / expired): the gate arms SLAM shut from the edges, a vermilion VOID stamp
//     hits, then the arms dissolve. Warning haptic + "doors closing" SFX.
// Full-screen, non-interactive, plays once and clears itself. Colours follow the state system
// (green = through, vermilion = blocked); wording from COPY[locale].pass. Reduced motion → the
// spring is disabled and it degrades to a brief fade.
import { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { playGate, playStamp, playVoid } from '@/lib/sound';
import { useTheme, font } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { t } from '@/lib/i18n';

export type FareGateTrigger = 'validate' | 'void' | null;

const HALF = Dimensions.get('window').width / 2;
const GATE = 'rgba(10,13,17,0.97)'; // dark gate-arm material, reads on both themes

export function FareGate({ trigger, onDone }: { trigger: FareGateTrigger; onDone: () => void }) {
  const theme = useTheme();
  const scrim = useSharedValue(0);
  const sweep = useSharedValue(0); // 0 = arms closed (covering), 1 = arms open (off-screen)
  const panelO = useSharedValue(1);
  const ringScale = useSharedValue(0.3);
  const ringOpacity = useSharedValue(0);
  const stampScale = useSharedValue(1.7);
  const stampOpacity = useSharedValue(0);

  useEffect(() => {
    if (!trigger) return;
    const valid = trigger === 'validate';
    const stampDelay = valid ? 420 : 190; // stamp lands after the arms finish moving

    Haptics.notificationAsync(
      valid ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
    ).catch(() => {});

    if (valid) {
      playGate();
    } else {
      playVoid();
    }

    scrim.value = withSequence(
      withTiming(1, { duration: 110, easing: Easing.out(Easing.quad) }),
      withDelay(560, withTiming(0, { duration: 320 }))
    );

    // gate arms
    if (valid) {
      sweep.value = 0;
      sweep.value = withDelay(120, withTiming(1, { duration: 480, easing: Easing.out(Easing.cubic) }));
      panelO.value = 1;
    } else {
      sweep.value = 1;
      sweep.value = withTiming(0, { duration: 240, easing: Easing.out(Easing.quad) });
      panelO.value = 1;
      panelO.value = withDelay(560, withTiming(0, { duration: 300 })); // dissolve the closed arms
    }

    // ring-burst, synced to the stamp
    ringScale.value = 0.3;
    ringScale.value = withDelay(stampDelay, withTiming(2.5, { duration: 680, easing: Easing.out(Easing.cubic) }));
    ringOpacity.value = withDelay(
      stampDelay,
      withSequence(withTiming(0.42, { duration: 80 }), withTiming(0, { duration: 600 }))
    );

    // stamp thunk (and it drives onDone at the very end)
    stampScale.value = 1.7;
    stampScale.value = withDelay(
      stampDelay,
      withSpring(1, { damping: 8, stiffness: 170, reduceMotion: ReduceMotion.Never })
    );
    stampOpacity.value = withDelay(
      stampDelay,
      withSequence(
        withTiming(1, { duration: 90 }),
        withDelay(560, withTiming(0, { duration: 300 }, (finished) => {
          if (finished) runOnJS(onDone)();
        }))
      )
    );
    if (valid) setTimeout(playStamp, stampDelay + 40);
  }, [trigger]);

  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.value }));
  const leftGate = useAnimatedStyle(() => ({
    opacity: panelO.value,
    transform: [{ translateX: -sweep.value * HALF }],
  }));
  const rightGate = useAnimatedStyle(() => ({
    opacity: panelO.value,
    transform: [{ translateX: sweep.value * HALF }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));
  const stampStyle = useAnimatedStyle(() => ({
    opacity: stampOpacity.value,
    transform: [{ scale: stampScale.value }, { rotate: '-12deg' }],
  }));

  if (!trigger) return null;
  const valid = trigger === 'validate';
  const color = valid ? theme.pine : theme.danger;
  const label = valid ? t('pass.active') : t('pass.expired');

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: withAlpha(color, 0.18) }, scrimStyle]} />

      {/* gate arms — dark panels with a lit inner edge */}
      <Animated.View style={[styles.gate, { left: 0, width: HALF + 1, borderRightWidth: 4, borderRightColor: color }, leftGate]} />
      <Animated.View style={[styles.gate, { left: HALF, width: HALF + 1, borderLeftWidth: 4, borderLeftColor: color }, rightGate]} />

      <View style={styles.center}>
        <Animated.View style={[styles.ring, { borderColor: color }, ringStyle]} />
      </View>
      <View style={styles.center}>
        <Animated.View style={[styles.stamp, { borderColor: color }, stampStyle]}>
          <Text style={{ fontFamily: font.display, color, fontSize: 34, letterSpacing: 3 }}>
            {label.toUpperCase()}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gate: { position: 'absolute', top: 0, bottom: 0, backgroundColor: GATE },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  ring: { width: 200, height: 200, borderRadius: 100, borderWidth: 3 },
  stamp: { borderWidth: 4, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
});
