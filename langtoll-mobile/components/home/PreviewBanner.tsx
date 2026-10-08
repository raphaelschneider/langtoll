// "Your first fare is on us." Shown on home while the free first fare runs:
// before the first pass, the deal; during the pass, when full access ends.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entrance } from '@/components/ui/Entrance';
import { Text } from '@/components/ui/Text';
import { useTheme, space, radius } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { useT } from '@/lib/i18n';
import { hasRealPlus, previewActive, useAppState } from '@/lib/store';

export function PreviewBanner({ now }: { now: number }) {
  const theme = useTheme();
  const t = useT();
  const s = useAppState();
  if (hasRealPlus(s) || !previewActive(s, now)) return null;
  // Once the first fare is paid the preview ends with the pass; until then it is
  // a day away and the time would mislead, so the line says the deal instead.
  const paid = s.sessionsCompleted > 0 && s.previewUntil != null;
  const time = paid ? new Date(s.previewUntil!).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';
  return (
    <Entrance delay={140}>
      <View style={[styles.card, { borderColor: withAlpha(theme.accent, 0.35), backgroundColor: withAlpha(theme.accent, 0.07) }]}>
        <Ionicons name="gift-outline" size={18} color={theme.accent} />
        <Text variant="callout" style={{ flex: 1 }}>
          {paid ? t('preview.banner', { time }) : t('preview.bannerOpen')}
        </Text>
      </View>
    </Entrance>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: space.sm, borderWidth: 1, borderRadius: radius.md, padding: space.md, marginTop: space.lg },
});
