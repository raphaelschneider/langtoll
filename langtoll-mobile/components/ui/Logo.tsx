// The LangToll logo — Tolly's face locked up with the two-tone grotesque wordmark
// (the roundel now lives on his cap, the splash and the web mark). "Lang" sits in
// ink, "Toll" in the rail accent, set in the display grotesque. One knob —
// `height` — scales the whole lockup.
import { View, Text, Image } from 'react-native';
import { useTheme } from '@/design/theme';
import { font } from '@/design/tokens';

// The official mark: fare-paid Tolly (full body, stamped ticket) — 620x640.
const TOLLY_ASPECT = 620 / 640;

export function Logo({ height = 28, wordmark = true }: { height?: number; wordmark?: boolean }) {
  const theme = useTheme();

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="LangToll"
      style={{ flexDirection: 'row', alignItems: 'flex-end', gap: Math.round(height * 0.28) }}
    >
      <Image
        source={require('../../assets/tolly/tolly-happy.png')}
        style={{ height, width: Math.round(height * TOLLY_ASPECT) }}
        resizeMode="contain"
      />

      {wordmark && (
        <Text
          style={{
            fontFamily: font.display,
            fontSize: Math.round(height * 0.72),
            letterSpacing: -0.5,
            includeFontPadding: false,
            // Sit the wordmark on Tolly's chin line rather than centering against
            // the cap — the face reads as peeking up beside the name.
            marginBottom: Math.round(height * 0.06),
          }}
        >
          <Text style={{ color: theme.ink }}>Lang</Text>
          <Text style={{ color: theme.accent }}>Toll</Text>
        </Text>
      )}
    </View>
  );
}
