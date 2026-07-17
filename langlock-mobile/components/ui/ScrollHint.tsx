// The "more below" cue: a bouncing chevron in a glass pill, floated over scrollable content
// while it still overflows. Extracted from the onboarding disclaimer so every long surface
// (terms, the exercise sheet) hints the same way. Render it conditionally from live scroll
// metrics (offset + viewport vs content) — a fixed height comparison misses real overflow.
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/design/theme';

export function ScrollHint({ bottom = 10 }: { bottom?: number }) {
  const theme = useTheme();
  const bounce = useSharedValue(0);
  if (bounce.value === 0) {
    bounce.value = withRepeat(
      withSequence(withTiming(6, { duration: 600 }), withTiming(0, { duration: 600 })),
      -1
    );
  }
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: bounce.value }] }));
  return (
    <Animated.View exiting={FadeOut.duration(200)} style={[styles.hint, { bottom }, style]} pointerEvents="none">
      <View style={[styles.pill, { borderColor: theme.glassBorder }]}>
        <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.glassTint }]} />
        <Ionicons name="chevron-down" size={16} color={theme.accent} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hint: { position: 'absolute', alignSelf: 'center' },
  pill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
