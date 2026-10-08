// "Your Plus has ended." The one screen that says what just happened: the free
// week ran out, a subscription was cancelled and reached its end, a refund, a
// failed renewal. One wording for all of them (founder, 2026-10-08).
//
// When Plus lapsed, the app quietly fell back to the free plan: A1 exercises,
// one locked app. Nothing said why, so a learner who had been at B1 opened a
// session full of "hallo" and "bitte" with no idea what had changed (founder,
// 2026-10-08). This card sits at the top of home until it is read: what ended,
// what the free plan is, that their course, fare and apps are kept, and the way
// back. Shown once per lapse; the store records the lapse in applyEntitlement.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Entrance } from '@/components/ui/Entrance';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { useTheme, space, radius } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { useT } from '@/lib/i18n';
import { openPaywall } from '@/lib/paywall';
import { FREE_LEVELS } from '@/lib/plans';
import { dismissLapsedNotice, isPlus, useAppState } from '@/lib/store';

export function LapsedNotice() {
  const theme = useTheme();
  const t = useT();
  const s = useAppState();
  if (isPlus(s) || !s.lapsedAt) return null;

  // The stored level is kept through a lapse; only the trained level falls to A1.
  const hadHigherLevel = !(FREE_LEVELS as readonly string[]).includes(s.level);
  const body = hadHigherLevel
    ? t('lapsed.bodyLevel', { level: s.level, free: FREE_LEVELS[0] })
    : t('lapsed.body', { free: FREE_LEVELS[0] });

  return (
    <Entrance delay={120}>
      <View style={[styles.card, { borderColor: withAlpha(theme.amber, 0.5), backgroundColor: withAlpha(theme.amber, 0.08) }]}>
        <Text variant="bodyMedium">{t('lapsed.title')}</Text>
        <Text variant="callout" color="inkSoft" style={{ marginTop: space.xs }}>
          {body}
        </Text>
        <Button
          label={t('lapsed.cta')}
          icon="sparkles"
          glow
          full
          style={{ marginTop: space.md }}
          onPress={() => openPaywall('lapsed')}
        />
        <PressableScale onPress={dismissLapsedNotice} haptic={null} style={styles.notNow}>
          <Text variant="callout" color="inkFaint" center>
            {t('lapsed.keepFree')}
          </Text>
        </PressableScale>
      </View>
    </Entrance>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: radius.md, padding: space.md, marginTop: space.xl },
  notNow: { marginTop: space.sm, paddingVertical: space.xs },
});
