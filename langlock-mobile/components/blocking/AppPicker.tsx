// Real Screen Time controls, shown only when native shielding is available
// (physical iOS device + module). Handles the two-step gate: authorize, then
// pick apps via Apple's own FamilyActivityPicker sheet. In stub mode this
// component renders nothing — settings falls back to the demo chip list.
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme, space, radius } from '@/design/theme';
import {
  isNativeAvailable,
  isAuthorized,
  requestAuthorization,
  hasSelection,
  selectionId,
  configureShieldAppearance,
} from '@/lib/blocking';

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
  const [authed, setAuthed] = useState(isAuthorized());
  const [picking, setPicking] = useState(false);
  const [configured, setConfigured] = useState(hasSelection());
  const [busy, setBusy] = useState(false);

  if (!isNativeAvailable()) return null;
  const mod = nativeModule();
  if (!mod) return null;

  async function authorize() {
    setBusy(true);
    const ok = await requestAuthorization();
    setAuthed(ok);
    if (ok) configureShieldAppearance();
    setBusy(false);
  }

  if (!authed) {
    return (
      <View>
        <Text variant="callout" color="inkSoft">
          LangPass needs Screen Time access to lock your apps.
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
      <Button
        label={configured ? 'Change blocked apps' : 'Choose apps to block'}
        variant={configured ? 'ghost' : 'primary'}
        onPress={() => setPicking(true)}
        full
        style={{ marginTop: space.md }}
      />
      {picking && SheetView && (
        <SheetView
          familyActivitySelectionId={selectionId()}
          onDismissRequest={() => {
            setPicking(false);
            setConfigured(hasSelection());
          }}
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
});
