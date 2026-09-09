// Standalone paywall — reached from Settings ("Upgrade to Plus") and from any
// gated feature. Same PlusOffer as onboarding; closes on purchase or dismiss.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { PlusOffer } from '@/components/paywall/PlusOffer';
import { useTheme, space } from '@/design/theme';
import { useLayout, band } from '@/design/layout';
import { useT } from '@/lib/i18n';
import type { PaywallSource } from '@/lib/paywall';

export default function Paywall() {
  const theme = useTheme();
  const L = useLayout();
  const t = useT();
  // Which gate opened us — see lib/paywall. Missing means an untagged path.
  const { from } = useLocalSearchParams<{ from?: PaywallSource }>();

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={0.7} />
      <SafeAreaView style={styles.safe}>
        <View style={[styles.header, band(L)]}>
          <PressableScale onPress={close} style={styles.close} haptic={null}>
            <Ionicons name="close" size={24} color={theme.inkSoft} />
          </PressableScale>
        </View>
        {/* PlusOffer scrolls its own feature list and pins the purchase controls to
            the bottom — an outer ScrollView would put the CTA below the fold again. */}
        <View style={[styles.content, band(L)]}>
          <Text variant="overline" color="accent">
            {t('ob.payOver')}
          </Text>
          <Text variant="hero" style={{ marginTop: space.md }}>
            {t('plus.title')}
          </Text>
          <View style={{ marginTop: space.xl, flex: 1 }}>
            <PlusOffer onDone={close} source={from ?? 'unknown'} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: space.lg, paddingTop: space.sm },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, paddingHorizontal: space.xl, paddingBottom: space.xl },
});
