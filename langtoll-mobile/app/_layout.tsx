// Root layout: fonts + theme + store hydration behind the splash screen, plus
// the shield lifecycle — brand the shield on launch, and re-lock on every
// foreground when a grant has expired (native only; no-op in stub/simulator).
import React, { useEffect, useRef, useState } from 'react';
import { AppState, View, type AppStateStatus } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Fraunces_400Regular,
  Fraunces_500Medium_Italic,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { ThemeProvider, useTheme } from '@/design/theme';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { hydrate, getState, isUnlocked } from '@/lib/store';
import { configureShieldAppearance, maybeRelock } from '@/lib/blocking';
import { configurePurchases } from '@/lib/purchases';
import { initPool } from '@/lib/ai/pool';
import { handleNotificationTaps } from '@/lib/notify';
import { primeVoices, configureAudioSession, applyStoredShaping } from '@/lib/tts';

SplashScreen.preventAutoHideAsync().catch(() => {});
// Belt-and-suspenders: force-hide the native splash after a hard ceiling,
// independent of React state — so the splash can never be the thing that's
// "stuck" even if the render gate or hideAsync-in-effect path misbehaves.
setTimeout(() => {
  SplashScreen.hideAsync().catch(() => {});
}, 2500);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_400Regular,
    Fraunces_500Medium_Italic,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const [storeReady, setStoreReady] = useState(false);
  // Hard timeout so a slow/failed font or a hung native storage call can never
  // freeze the app on the splash screen (system font is an acceptable fallback).
  const [timedOut, setTimedOut] = useState(false);
  const appState = useRef(AppState.currentState);

  // Fonts are best-effort; the store is the only thing we truly wait for, and
  // even that is capped by the timeout.
  const fontsReady = fontsLoaded || !!fontError || timedOut;
  const ready = (storeReady || timedOut) && fontsReady;

  useEffect(() => {
    // Never block forever — proceed after 4s no matter what resolved.
    const id = setTimeout(() => setTimedOut(true), 4000);
    // Shaping must be re-applied AFTER hydrate — it is read from the store.
    hydrate().finally(() => {
      setStoreReady(true);
      applyStoredShaping();
      // Generated pool for the user's current language/level: reads the on-device
      // cache first so the very next session already has it, then refreshes in the
      // background. Must run AFTER hydrate — it needs the persisted language and
      // level. Deliberately not awaited: the lock never waits on a network call.
      const s = getState();
      void initPool(s.learningLanguage, s.level);
    });
    configurePurchases(); // no-op in mock; mirrors the live entitlement when keyed
    primeVoices(); // load the device voice list so the first speak() isn't a race
    configureAudioSession(); // play speech even with the ringer switch on silent
    return () => clearTimeout(id);
  }, []);

  // Shield lifecycle: brand it once, re-lock when the app returns to foreground
  // and the last grant has expired. Both no-op unless native shielding is live.
  useEffect(() => {
    if (!ready) return;
    configureShieldAppearance();
    maybeRelock(isUnlocked(getState()));
    // The shield's button posts a notification instead of opening the app —
    // iOS gives an extension no way to do the latter. This routes the tap.
    const stopTaps = handleNotificationTaps();
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        maybeRelock(isUnlocked(getState()));
      }
      appState.current = next;
    });
    return () => {
      sub.remove();
      stopTaps();
    };
  }, [ready]);

  // Hide the splash as soon as JS mounts, so the diagnostic/loading screen
  // below is actually visible (independent of the `ready` gate).
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  // Keep the (paper-colored) screen blank until fonts + store are ready; the
  // native splash covers this, then hands off to the first route.
  if (!ready) return <View style={{ flex: 1, backgroundColor: '#0A0A0C' }} />;

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ThemedShell />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Inside the provider so the status bar + page ground follow the active theme.
function ThemedShell() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.paper } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="session" options={{ gestureEnabled: false }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
