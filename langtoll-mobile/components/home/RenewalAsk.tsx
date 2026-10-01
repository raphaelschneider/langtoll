// "You've turned off renewal. What would make LangToll worth keeping?"
//
// On 2026-10-01 every RevenueCat customer showed "set to cancel", including two who
// had paid after their trial and were still opening the app daily. The app noticed
// renewal switching off (plusWillRenew false) and said nothing. This asks once per
// cancellation, on the home screen, with one-tap answers, and is gone after an answer
// or "Not now". The answer is the event renewal_off_reason.
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Entrance } from '@/components/ui/Entrance';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { useTheme, space, radius } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { useT } from '@/lib/i18n';
import { isPlus, markRenewalAsked, useAppState } from '@/lib/store';
import { track } from '@/lib/telemetry';

const REASONS = [
  ['price', 'renew.price'],
  ['not_using', 'renew.notUsing'],
  ['too_strict', 'renew.strict'],
  ['missing', 'renew.missing'],
  ['trying', 'renew.trying'],
] as const;

export function RenewalAsk() {
  const theme = useTheme();
  const t = useT();
  const s = useAppState();
  const [thanks, setThanks] = useState(false);

  const key = s.plusExpiresAt;
  const due = isPlus(s) && s.plusWillRenew === false && !!key && s.renewalAskedFor !== key;
  if (!due && !thanks) return null;

  function answer(reason: string) {
    track('renewal_off_reason', { reason, trial: s.plusIsTrial === true });
    if (key) markRenewalAsked(key);
    if (reason !== 'dismissed') setThanks(true);
  }

  return (
    <Entrance delay={200}>
      <View style={[styles.card, { borderColor: withAlpha(theme.accent, 0.35), backgroundColor: withAlpha(theme.accent, 0.06) }]}>
        {thanks ? (
          <Text variant="bodyMedium" center>
            {t('renew.thanks')}
          </Text>
        ) : (
          <>
            <Text variant="bodyMedium">{t('renew.title')}</Text>
            <Text variant="callout" color="inkSoft" style={{ marginTop: 2 }}>
              {t('renew.body')}
            </Text>
            <View style={styles.options}>
              {REASONS.map(([reason, label]) => (
                <PressableScale
                  key={reason}
                  onPress={() => answer(reason)}
                  style={[styles.option, { backgroundColor: theme.surface, borderColor: theme.line }]}
                >
                  <Text variant="callout">{t(label)}</Text>
                </PressableScale>
              ))}
            </View>
            <PressableScale onPress={() => answer('dismissed')} haptic={null} style={styles.notNow}>
              <Text variant="callout" color="inkFaint" center>
                {t('renew.notNow')}
              </Text>
            </PressableScale>
          </>
        )}
      </View>
    </Entrance>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: radius.md, padding: space.md, marginTop: space.xl },
  options: { marginTop: space.md, gap: space.xs },
  option: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md, paddingVertical: space.sm + 2, paddingHorizontal: space.md },
  notNow: { marginTop: space.sm, paddingVertical: space.xs },
});
