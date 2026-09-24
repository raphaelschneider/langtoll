// Last week's story on the Monday home screen: fares paid, words met, hours
// of scrolling paid for. People stay for a narrative in which they are the
// hero, and these are numbers they produced themselves. Shows Monday and
// Tuesday only, once per week, and only for a week with at least one fare —
// an empty recap is a reproach, not a story.
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entrance } from '@/components/ui/Entrance';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { Tolly } from '@/components/ui/Tolly';
import { useTheme, space, radius } from '@/design/theme';
import { useT } from '@/lib/i18n';
import { useAppState, rollRecap, dismissRecap } from '@/lib/store';
import { recapSpan, recapCardVisible } from '@/lib/recap';
import { track } from '@/lib/telemetry';

export function WeeklyRecap() {
  const theme = useTheme();
  const t = useT();
  const state = useAppState();

  // A week that ended while the app slept is rolled here, not only on the
  // next fare — otherwise a quiet Monday would never get its card.
  useEffect(() => {
    rollRecap();
  }, []);

  const last = state.recapLast;
  const visible = recapCardVisible(last, state.recapDismissedWeek);

  useEffect(() => {
    if (visible && last) track('recap_shown', { fares: last.fares, words: last.words, minutes: last.minutes });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible || !last) return null;
  const span = recapSpan(last.minutes);

  return (
    <Entrance delay={320}>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <Tolly mood="happy" size={56} />
        <View style={{ flex: 1 }}>
          <Text variant="overline" color="accent">
            {t('recap.cardOver')}
          </Text>
          <Text variant="bodyMedium" style={{ marginTop: 2 }}>
            {span.unit === 'minutes'
              ? t('recap.cardBodyMinutes', { fares: last.fares, words: last.words, mins: span.value })
              : t('recap.cardBody', { fares: last.fares, words: last.words, hours: span.value })}
          </Text>
          <Text variant="caption" color="inkSoft" style={{ marginTop: 2 }}>
            {t('recap.cardNote')}
          </Text>
        </View>
        <PressableScale
          onPress={() => dismissRecap(last.weekStart)}
          haptic={null}
          accessibilityRole="button"
          accessibilityLabel={t('recap.dismiss')}
          style={styles.dismiss}
        >
          <Ionicons name="close" size={18} color={theme.inkFaint} />
        </PressableScale>
      </View>
    </Entrance>
  );
}

const styles = StyleSheet.create({
  // Same rhythm as the wallet row above and the route line below: one
  // space.xl step, the card's own padding inside it, nothing floating.
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    marginTop: space.xl,
  },
  dismiss: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
