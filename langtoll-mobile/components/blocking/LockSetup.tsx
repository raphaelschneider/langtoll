// The lock-setup step — surfaced INSIDE onboarding so the user never has to
// dig through Settings. On a real device it drives Apple's Screen Time flow:
// authorize → pick apps in the native FamilyActivityPicker. On the simulator /
// Expo Go it shows a preview of the apps the user named in onboarding (Apple's
// picker can't be pre-populated with specific apps — it's privacy-sealed — so
// on device they re-pick them there; here we just illustrate the intent).
//
// Reports readiness via onReady so the onboarding CTA can gate on it.
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme, space, radius } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import {
  isNativeAvailable,
  isAuthorized,
  requestAuthorization,
  hasSelection,
  selectionId,
  configureShieldAppearance,
  lockNow,
} from '@/lib/blocking';
import { requestNotificationPermission } from '@/lib/notify';
import { useT } from '@/lib/i18n';

function nativeModule(): any | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-device-activity');
  } catch {
    return null;
  }
}

export function LockSetup({ apps, onReady }: { apps: string[]; onReady: (ready: boolean) => void }) {
  const theme = useTheme();
  const t = useT();
  const native = isNativeAvailable();
  const [authed, setAuthed] = useState(isAuthorized());
  const [picking, setPicking] = useState(false);
  const [configured, setConfigured] = useState(native ? hasSelection() : true);
  const [busy, setBusy] = useState(false);

  // Stub mode is always "ready" (nothing to authorize); native readiness tracks
  // the real selection. Report up so the CTA can enable/disable.
  useEffect(() => {
    onReady(native ? configured : true);
  }, [native, configured, onReady]);

  async function authorize() {
    setBusy(true);
    const ok = await requestAuthorization();
    setAuthed(ok);
    if (ok) {
      configureShieldAppearance();
      // The shield button needs this to do anything at all.
      void requestNotificationPermission();
    }
    setBusy(false);
  }

  // ── stub / simulator: preview the named apps ──────────────────────────────
  if (!native) {
    return (
      <View>
        <View style={styles.previewWrap}>
          {(apps.length ? apps : ['Your apps']).map((a) => (
            <View key={a} style={[styles.chip, { backgroundColor: withAlpha(theme.accent, 0.10), borderColor: theme.accent }]}>
              <Ionicons name="lock-closed" size={14} color={theme.accent} />
              <Text variant="callout" style={{ color: theme.accent }}>
                {a}
              </Text>
            </View>
          ))}
        </View>
        <Text variant="caption" color="inkFaint" style={{ marginTop: space.md }}>
          {t('lock.simNote')}
        </Text>
      </View>
    );
  }

  // ── device: real Screen Time flow ─────────────────────────────────────────
  if (!authed) {
    return (
      <View>
        <Text variant="callout" color="inkSoft">
          {t('lock.authBody')}
        </Text>
        <Button
          label={t('lock.enable')}
          icon="lock-closed"
          onPress={authorize}
          loading={busy}
          glow
          full
          style={{ marginTop: space.lg }}
        />
      </View>
    );
  }

  const SheetView = nativeModule()?.DeviceActivitySelectionSheetViewPersisted;

  return (
    <View>
      <PressableScale
        onPress={() => setPicking(true)}
        style={[
          styles.selectRow,
          {
            backgroundColor: configured ? withAlpha(theme.accent, 0.10) : theme.fill,
            borderColor: configured ? theme.accent : theme.line,
          },
        ]}
      >
        <Ionicons
          name={configured ? 'checkmark-circle' : 'apps'}
          size={22}
          color={configured ? theme.accent : theme.inkSoft}
        />
        <Text variant="bodyMedium" style={{ flex: 1, color: configured ? theme.accent : theme.ink }}>
          {configured ? t('lock.selected') : t('lock.choose')}
        </Text>
        <Ionicons name="chevron-forward" size={18} color={theme.inkFaint} />
      </PressableScale>
      {picking && SheetView && (
        <SheetView
          familyActivitySelectionId={selectionId()}
          onDismissRequest={() => {
            setPicking(false);
            const has = hasSelection();
            setConfigured(has);
            if (has) lockNow(); // shield immediately so home lands "locked"
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  previewWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
  },
});
