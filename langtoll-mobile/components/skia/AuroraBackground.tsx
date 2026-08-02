// A slow, living mesh-gradient rendered with a Skia SkSL shader. Sits behind the
// content as calm ambient motion. Colors come from the active theme's `aurora`
// stops and can be nudged warmer/cooler by `mood`.
//
// Fail-safe: the shader is compiled lazily (not at module scope) and guarded, so
// on a device/Release build where Skia isn't ready at import time it can never
// crash the app — it falls back to a plain vertical gradient of the same stops.
import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { LinearGradient } from 'expo-linear-gradient';
import { useDerivedValue } from 'react-native-reanimated';
import { useTheme } from '@/design/theme';
import { hexToRgb01 } from '@/lib/color';

const SKSL = `
uniform float  u_time;
uniform float2 u_res;
uniform float  u_warm;
uniform float3 c0;
uniform float3 c1;
uniform float3 c2;
uniform float3 c3;

half4 main(float2 fragCoord) {
  float2 uv = fragCoord / u_res;
  float t = u_time * 0.05;

  float2 p = uv * 3.0;
  float w = sin(p.x * 1.3 + t)
          + sin(p.y * 1.7 - t * 1.1)
          + sin((p.x + p.y) * 1.1 + t * 0.7);
  float m = (w / 3.0) * 0.5 + 0.5;

  float v = clamp(uv.y * 0.55 + m * (0.55 + 0.2 * u_warm), 0.0, 1.0);

  float3 col;
  if (v < 0.34)      col = mix(c0, c1, v / 0.34);
  else if (v < 0.67) col = mix(c1, c2, (v - 0.34) / 0.33);
  else               col = mix(c2, c3, (v - 0.67) / 0.33);

  float d = distance(uv, float2(0.5, 0.42));
  col *= 1.0 - d * 0.18;

  return half4(col, 1.0);
}
`;

// Compiled lazily on first use, then cached. Never runs at import time.
let cachedSource: ReturnType<typeof Skia.RuntimeEffect.Make> | null | undefined;
function shaderSource() {
  if (cachedSource !== undefined) return cachedSource;
  try {
    cachedSource = Skia.RuntimeEffect.Make(SKSL) ?? null;
  } catch {
    cachedSource = null;
  }
  return cachedSource;
}

export function AuroraBackground({ mood = 0.4 }: { mood?: number }) {
  const { width, height } = useWindowDimensions();
  const theme = useTheme();
  const clock = useClock();

  const source = useMemo(() => shaderSource(), []);
  const colors = useMemo(
    () => theme.aurora.map((c) => hexToRgb01(c)) as [number, number, number][],
    [theme]
  );

  const uniforms = useDerivedValue(() => ({
    u_time: clock.value / 1000,
    u_res: [width, height],
    u_warm: mood,
    c0: colors[0],
    c1: colors[1],
    c2: colors[2],
    c3: colors[3],
  }));

  // Fallback when Skia can't compile the shader (never crash the whole app).
  if (!source) {
    return (
      <LinearGradient
        colors={theme.aurora}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    );
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Canvas style={StyleSheet.absoluteFill}>
        <Fill>
          <Shader source={source} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </View>
  );
}
