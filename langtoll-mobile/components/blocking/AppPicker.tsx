// Real Screen Time controls, shown only when native shielding is available
// (physical iOS device + module). Handles the two-step gate: authorize, then
// pick apps via Apple's own FamilyActivityPicker sheet. In stub mode this
// component renders nothing — settings falls back to the demo chip list.
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme, space, radius } from '@/design/theme';
import {
  isNativeAvailable,
  isAuthorized,
  requestAuthorization,
  hasSelection,
  selectionId,
  selectionCounts,
  clearSelection,
  configureShieldAppearance,
  maybeRelock,
} from '@/lib/blocking';
import { requestNotificationPermission, notificationsGranted, openSystemSettings } from '@/lib/notify';
import { isPlus, isUnlocked, getState } from '@/lib/store';
import { selectionExceedsFreeLimit } from '@/lib/plans';

// The native module (and its view components) only exist in a dev build.
// Required lazily so Expo Go never chokes on the import.
function nativeModule(): any | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-device-activity');
  } catch {
    return null;
  }
}

export function AppPicker() {
  const theme = useTheme();
  const router = useRouter();
  const [authed, setAuthed] = useState(isAuthorized());
  const [picking, setPicking] = useState(false);
  const [configured, setConfigured] = useState(hasSelection());
  const [overLimit, setOverLimit] = useState(false);
  const [busy, setBusy] = useState(false);
  // Null = not checked yet, so nothing is claimed before we know.
  const [notifsOn, setNotifsOn] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    void notificationsGranted().then((ok) => alive && setNotifsOn(ok));
    return () => { alive = false; };
  }, []);

  if (!isNativeAvailable()) return null;
  const mod = nativeModule();
  if (!mod) return null;

  async function authorize() {
    setBusy(true);
    const ok = await requestAuthorization();
    setAuthed(ok);
    if (ok) {
      configureShieldAppearance();
      // The shield button needs this to do anything at all.
      void requestNotificationPermission().then(setNotifsOn);
    }
    setBusy(false);
  }

  // Live feedback while the sheet is open: flag the moment a free user goes past one app
  // (or picks a whole category / website, which Plus-only).
  function onSelectionChange(e: { nativeEvent: { applicationCount?: number; categoryCount?: number; webDomainCount?: number } }) {
    const c = e.nativeEvent ?? {};
    setOverLimit(
      selectionExceedsFreeLimit(
        { applicationCount: c.applicationCount ?? 0, categoryCount: c.categoryCount ?? 0, webDomainCount: c.webDomainCount ?? 0 },
        isPlus()
      )
    );
  }

  // On close: a free selection that's still over the limit is discarded (we can't trim an
  // opaque selection to one app), with a clear prompt to pick one or upgrade. Within-limit
  // selections (and any Plus selection) are kept.
  function onDismiss() {
    setPicking(false);
    const counts = selectionCounts();
    const over = counts ? selectionExceedsFreeLimit(counts, isPlus()) : false;
    if (over) {
      clearSelection();
      setConfigured(false);
      setOverLimit(true);
    } else {
      setOverLimit(false);
      const has = hasSelection();
      setConfigured(has);
      // Apply the shield to the NEW selection right away. Onboarding already did
      // this (LockSetup calls lockNow after its picker), but changing apps later
      // in Settings did not — so newly chosen apps stayed open until the next
      // launch or foreground, whenever maybeRelock happens to run. Selecting an
      // app while the pass is expired should lock it there and then.
      //
      // maybeRelock rather than lockNow: it shields only when the pass is not
      // active, so editing the list during an unlock does not slam the gate on
      // someone who has already paid the fare.
      if (has) maybeRelock(isUnlocked(getState()));
    }
  }

  if (!authed) {
    return (
      <View>
        <Text variant="callout" color="inkSoft">
          LangToll needs Screen Time access to lock your apps.
        </Text>
        <Button
          label="Enable Screen Time"
          onPress={authorize}
          loading={busy}
          full
          style={{ marginTop: space.md }}
        />
      </View>
    );
  }

  const SheetView = mod.DeviceActivitySelectionSheetViewPersisted;
  const plus = isPlus();

  return (
    <View>
      <View style={[styles.statusRow, { borderColor: theme.line }]}>
        <Text variant="bodyMedium" style={{ flex: 1 }}>
          {configured ? 'Apps selected' : 'No apps selected yet'}
        </Text>
        <Text variant="caption" color={configured ? 'pine' : 'amber'}>
          {configured ? 'READY' : 'ACTION NEEDED'}
        </Text>
      </View>
      {!plus && (
        <Text variant="caption" color="inkSoft" style={{ marginTop: space.xs }}>
          Free locks one app. Plus locks unlimited apps, whole categories, and websites.
        </Text>
      )}
      <Button
        label={configured ? 'Change blocked apps' : 'Choose apps to block'}
        variant={configured ? 'ghost' : 'primary'}
        onPress={() => setPicking(true)}
        full
        style={{ marginTop: space.md }}
      />
      {notifsOn === false && (
        <View style={[styles.overLimit, { borderColor: theme.amber, backgroundColor: theme.fill }]}>
          <Text variant="caption" color="amber">
            Notifications are off. The &quot;Practice now&quot; button on the lock screen sends one to bring
            you back here — without it, that button can&apos;t do anything. iOS doesn&apos;t let a lock
            screen open an app any other way.
          </Text>
          <Button
            label="Turn on notifications"
            onPress={openSystemSettings}
            full
            style={{ marginTop: space.sm }}
          />
        </View>
      )}
      {overLimit && !plus && (
        <View style={[styles.overLimit, { borderColor: theme.amber, backgroundColor: theme.fill }]}>
          <Text variant="caption" color="amber">
            That&apos;s more than the free tier locks. Pick a single app, or go Plus to lock everything —
            every app, whole categories, and websites.
          </Text>
          <Button
            label="Unlock unlimited with Plus"
            onPress={() => router.push('/paywall')}
            full
            style={{ marginTop: space.sm }}
          />
        </View>
      )}
      {picking && SheetView && (
        <SheetView
          familyActivitySelectionId={selectionId()}
          // Without this, picking a whole category ("Social") stores a bare
          // category token that does not expand to the apps inside it — so the
          // shield covered only apps picked individually and the category
          // appeared to do nothing. The library's own docs warn that a selection
          // without it means "categories might not be correctly whitelisted".
          // Requires iOS 15.2+; the app already targets 15.1+ via device-activity.
          includeEntireCategory
          onSelectionChange={onSelectionChange}
          onDismissRequest={onDismiss}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: space.md,
    marginBottom: space.xs,
    borderRadius: radius.sm,
  },
  overLimit: {
    marginTop: space.md,
    padding: space.md,
    borderWidth: 1,
    borderRadius: radius.md,
  },
});
