// The free first fare is over and no trial was started: this IS the home
// screen until one is. No X. The apps stay locked behind the shield, which is
// the point (founder, 2026-10-09: "there's no reason for them to continue using
// the app unless they at least start a trial"). One way out, small, so nobody
// is held: unlock the apps and leave the app walled.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { PlusOffer } from '@/components/paywall/PlusOffer';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { Tolly } from '@/components/ui/Tolly';
import { useTheme, space } from '@/design/theme';
import { useLayout, band } from '@/design/layout';
import { clearSelection } from '@/lib/blocking';
import { useT } from '@/lib/i18n';
import { track } from '@/lib/telemetry';

export function TrialWall() {
  const theme = useTheme();
  const L = useLayout();
  const t = useT();
  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={0.7} />
      <SafeAreaView style={styles.safe}>
        <View style={[styles.content, band(L)]}>
          <View style={styles.headline}>
            <View style={{ flex: 1 }}>
              <Text variant="overline" color="accent">
                {t('preview.payOver')}
              </Text>
              <Text variant="hero" style={{ marginTop: space.md }}>
                {t('preview.payTitle')}
              </Text>
            </View>
            <Tolly mood="celebrate" size={112} style={{ marginLeft: space.sm }} />
          </View>
          <View style={{ marginTop: space.lg, flex: 1 }}>
            <PlusOffer onDone={() => {}} source="first_fare" pitch={t('preview.wallPitch')} />
          </View>
          <PressableScale
            onPress={() => {
              track('lock_released', { where: 'trial_wall' });
              clearSelection();
            }}
            haptic={null}
            style={styles.leave}
          >
            <Text variant="caption" color="inkFaint" center>
              {t('preview.wallUnlock')}
            </Text>
          </PressableScale>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  headline: { flexDirection: 'row', alignItems: 'flex-end', paddingTop: space.lg },
  content: { flex: 1, paddingHorizontal: space.xl, paddingBottom: space.sm },
  leave: { paddingVertical: space.sm },
});
