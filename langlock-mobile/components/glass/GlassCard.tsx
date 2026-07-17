// A raised, lightly-frosted surface with a gradient hairline and warm soft shadow.
import React from 'react';
import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, radius as R, shadow } from '@/design/theme';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  intensity?: number;
  /** Solid surface instead of blur (cheaper; for dense lists). */
  solid?: boolean;
  padded?: boolean;
}

export function GlassCard({
  children,
  style,
  radius = R.xl,
  intensity = 24,
  solid = false,
  padded = true,
}: Props) {
  const theme = useTheme();

  const inner = (
    <View style={[padded && styles.pad, { borderRadius: radius }]}>{children}</View>
  );

  return (
    <View style={[styles.shadowWrap, shadow.card, { borderRadius: radius }, style]}>
      <View style={[styles.clip, { borderRadius: radius, borderColor: theme.glassBorder }]}>
        {solid ? (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.surface }]} />
        ) : (
          <>
            <BlurView
              intensity={intensity}
              tint={theme.scheme === 'dark' ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: theme.glassTint }]}
            />
          </>
        )}
        <LinearGradient
          colors={[
            theme.scheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {inner}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: { backgroundColor: 'transparent' },
  clip: { overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  pad: { padding: 18 },
});
