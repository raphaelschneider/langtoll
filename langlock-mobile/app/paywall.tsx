// Standalone paywall — reached from Settings ("Upgrade to Plus") and from any
// gated feature. Same PlusOffer as onboarding; closes on purchase or dismiss.
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { PlusOffer } from '@/components/paywall/PlusOffer';
import { useTheme, space } from '@/design/theme';
import { useT } from '@/lib/i18n';

export default function Paywall() {
  const theme = useTheme();
  const t = useT();

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={0.7} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <PressableScale onPress={close} style={styles.close} haptic={null}>
            <Ionicons name="close" size={24} color={theme.inkSoft} />
          </PressableScale>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text variant="overline" color="accent">
            {t('ob.payOver')}
          </Text>
          <Text variant="hero" style={{ marginTop: space.md }}>
            {t('plus.title')}
          </Text>
          <View style={{ marginTop: space.xl, flex: 1 }}>
            <PlusOffer onDone={close} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: space.lg, paddingTop: space.sm },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: space.xl, paddingBottom: space.xxl },
});
