// The "collected!" moment — fires mid-session the instant a word hits mastery (streak 3). A
// ticket stamps in from the top with the word, a green COLLECTED stamp, and the +min bonus it
// just earned, plus the stamp SFX + a success haptic. This is what turns the wallet from a
// passive ledger into a felt reward: you SEE and HEAR each word get collected. Auto-dismisses.
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  ReduceMotion,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { playStamp } from '@/lib/sound';
import { useTheme, font, space, radius, shadow } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { t } from '@/lib/i18n';

export function CollectBadge({
  word,
  bonusMin,
  onDone,
}: {
  word: string | null;
  bonusMin: number;
  onDone: () => void;
}) {
  const theme = useTheme();
  const scale = useSharedValue(1.5);
  const opacity = useSharedValue(0);
  const y = useSharedValue(-10);

  useEffect(() => {
    if (!word) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    playStamp();
    scale.value = 1.5;
    scale.value = withSpring(1, { damping: 9, stiffness: 180, reduceMotion: ReduceMotion.Never });
    y.value = -10;
    y.value = withSpring(0, { damping: 13 });
    opacity.value = withSequence(
      withTiming(1, { duration: 120 }),
      withDelay(1500, withTiming(0, { duration: 320 }, (finished) => {
        if (finished) runOnJS(onDone)();
      }))
    );
  }, [word]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }, { scale: scale.value }],
  }));

  if (!word) return null;

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Animated.View style={[styles.badge, shadow.soft, { backgroundColor: theme.surface, borderColor: withAlpha(theme.pine, 0.6) }, style]}>
        <View style={[styles.check, { backgroundColor: withAlpha(theme.pine, 0.15), borderColor: withAlpha(theme.pine, 0.5) }]}>
          <Ionicons name="checkmark" size={18} color={theme.pine} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 1.6, color: theme.pine, textTransform: 'uppercase' }}>
            {t('wallet.collected')}
          </Text>
          <Text style={{ fontFamily: font.display, fontSize: 19, color: theme.ink, marginTop: 1 }} numberOfLines={1}>
            {word}
          </Text>
        </View>
        <View style={[styles.bonus, { backgroundColor: withAlpha(theme.pine, 0.14) }]}>
          <Text style={{ fontFamily: font.mono, fontSize: 13, color: theme.pine, letterSpacing: 0.5 }}>
            {t('wallet.bonus', { min: bonusMin })}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 92, left: space.xl, right: space.xl, alignItems: 'center', zIndex: 30 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignSelf: 'stretch',
  },
  check: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  bonus: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
});
