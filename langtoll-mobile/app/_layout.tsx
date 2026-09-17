// Root layout: fonts + theme + store hydration behind the splash screen, plus
// the shield lifecycle — brand the shield on launch, and re-lock on every
// foreground when a grant has expired (native only; no-op in stub/simulator).
import React, { useEffect, useRef, useState } from 'react';
import { AppState, View, type AppStateStatus } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_800ExtraBold,
} from '@expo-google-fonts/archivo';
import { JetBrainsMono_500Medium, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import { ThemeProvider, useTheme } from '@/design/theme';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { hydrate, getState, isUnlocked } from '@/lib/store';
import { initDeviceId } from '@/lib/device';
import { syncPassActivity } from '@/lib/pass-activity';
import { track } from '@/lib/telemetry';
import { configureShieldAppearance, maybeRelock } from '@/lib/blocking';
import { advanceWordRotation } from '@/modules/langtoll-activity/src';
import { configurePurchases } from '@/lib/purchases';
import { initPool } from '@/lib/ai/pool';
import { refreshGoalPack } from '@/lib/ai/topics';
import { effectiveLevel } from '@/lib/plans';
import { handleNotificationTaps, scheduleTrialEndNotice } from '@/lib/notify';
import { primeVoices, configureAudioSession, applyStoredShaping, stopSpeaking } from '@/lib/tts';

SplashScreen.preventAutoHideAsync().catch(() => {});
// Belt-and-suspenders: force-hide the native splash after a hard ceiling,
// independent of React state — so the splash can never be the thing that's
// "stuck" even if the render gate or hideAsync-in-effect path misbehaves.
setTimeout(() => {
  SplashScreen.hideAsync().catch(() => {});
}, 2500);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_800ExtraBold,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
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
    // Identity before events: telemetry drops anything fired pre-init, so resolve
    // the install id first, then report the open. Not awaited by the UI.
    void initDeviceId().then(() => track('app_open'));
    // Shaping must be re-applied AFTER hydrate — it is read from the store.
    hydrate().finally(() => {
      setStoreReady(true);
      applyStoredShaping();
      // Generated pool for the user's current language/level: reads the on-device
      // cache first so the very next session already has it, then refreshes in the
      // background. Must run AFTER hydrate — it needs the persisted language and
      // level. Deliberately not awaited: the lock never waits on a network call.
      const s = getState();
      void initPool(s.learningLanguage, effectiveLevel());
      // The goal's own pack — generated once per (goal, language, level) and
      // merged into sessions. Fire-and-forget like the pool.
      void refreshGoalPack();
      // Re-adopt the island countdown if a pass is still running — iOS ends Live
      // Activities on every app update/reboot, and the pass must survive both.
      syncPassActivity();
      // Trial-end downgrade warning: re-evaluated every launch from the
      // hydrated entitlement shape; cancels itself when nothing will change.
      scheduleTrialEndNotice();
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
    void configureShieldAppearance(); // async now: stages Tolly into the app group first
    maybeRelock(isUnlocked(getState()), getState().unlockExpiresAt);
    // The shield's button posts a notification instead of opening the app —
    // iOS gives an extension no way to do the latter. This routes the tap.
    const stopTaps = handleNotificationTaps();
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      // Leaving the app must never leave the audio focus behind: stop any word
      // in flight and give the session back, or the video the user switched to
      // stays ducked.
      if (next.match(/inactive|background/)) stopSpeaking();
      if (appState.current.match(/inactive|background/) && next === 'active') {
        maybeRelock(isUnlocked(getState()), getState().unlockExpiresAt);
        // Fresh card on the island every time LangToll comes forward mid-pass.
        // This is the DOCUMENTED activity-update path, so the rotation works
        // even if the extension's background updates turn out to be blocked.
        if (isUnlocked(getState())) advanceWordRotation();
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
  // Speech is screen-scoped: whatever screen started it, leaving that screen
  // silences it. Individual screens also stop audio at their own transition
  // points, but this is the app-wide backstop — no navigation, however it was
  // triggered, may carry audio onto the next screen.
  const pathname = usePathname();
  useEffect(() => {
    stopSpeaking();
  }, [pathname]);
  return (
    <>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.paper } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="session" options={{ gestureEnabled: false }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="wallet" options={{ presentation: 'modal' }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
