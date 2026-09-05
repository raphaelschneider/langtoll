// The journey line — your CEFR route (A1 → B2) drawn as a transit line, with the level you're
// on as the lit "train" station and the track filled up to where you've ridden. The meta-game
// version of the pass metaphor: learning as a route you travel. CEFR codes are universal, so
// nothing here needs localizing.
//
// `progress` (0..1) is how far through the CURRENT level's vocabulary the passenger is; the
// fill runs that fraction of the way into the next segment, so the line visibly creeps toward
// the next station between level changes instead of only jumping when one is reached.
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme, space, font } from '@/design/theme';
import { withAlpha } from '@/lib/color';

const LEVELS = ['A1', 'A2', 'B1', 'B2'];

/** The station after `level`, or null at the terminus. */
export function nextStop(level: string): string | null {
  const i = LEVELS.indexOf(level);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
}

export function JourneyLine({
  level,
  progress = 0,
  label,
  trailing,
}: {
  level: string;
  progress?: number;
  /** Overline above the route, e.g. "Your route". */
  label?: string;
  /** Right-aligned caption, e.g. "Next stop A2 · 312 words". */
  trailing?: string;
}) {
  const theme = useTheme();
  const cur = Math.max(0, LEVELS.indexOf(level));
  const segments = LEVELS.length - 1;
  const p = Math.max(0, Math.min(1, progress));
  // Never run into the last station: B2 is the terminus.
  const fillFrac = Math.min(1, (cur + (cur < segments ? p : 0)) / segments);

  return (
    <View style={styles.wrap}>
      {label ? (
        <View style={styles.labelRow}>
          <Text variant="overline" color="inkFaint">
            {label}
          </Text>
          {trailing ? (
            <Text variant="caption" color="inkFaint">
              {trailing}
            </Text>
          ) : null}
        </View>
      ) : null}
      <View style={styles.route}>
        <View style={[styles.track, { backgroundColor: theme.fillStrong }]} />
        <View style={[styles.trackFill, { backgroundColor: theme.accent, width: `${fillFrac * 100}%` }]} />
        <View style={styles.stations}>
          {LEVELS.map((lv, i) => {
            const lit = i <= cur;
            const current = i === cur;
            return (
              <View key={lv} style={styles.stationWrap}>
                <View style={styles.dotBox}>
                  {current && (
                    <View style={[styles.halo, { backgroundColor: withAlpha(theme.accent, 0.18) }]} />
                  )}
                  <View
                    style={{
                      width: current ? 16 : 11,
                      height: current ? 16 : 11,
                      borderRadius: current ? 8 : 5.5,
                      borderWidth: 2,
                      backgroundColor: lit ? theme.accent : theme.paper,
                      borderColor: lit ? theme.accent : theme.line,
                    }}
                  />
                </View>
                <Text
                  variant="caption"
                  style={{
                    color: current ? theme.accent : theme.inkFaint,
                    marginTop: 8,
                    fontFamily: current ? font.monoBold : font.mono,
                    letterSpacing: 1.5,
                  }}
                >
                  {lv}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: space.xl },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.md,
  },
  route: { position: 'relative', justifyContent: 'center' },
  // Track runs through the dot centres. The dot box is 16 tall, centre at 8 → track top 7.
  track: { position: 'absolute', left: 8, right: 8, top: 7, height: 2, borderRadius: 1 },
  trackFill: { position: 'absolute', left: 8, top: 7, height: 2, borderRadius: 1 },
  stations: { flexDirection: 'row', justifyContent: 'space-between' },
  stationWrap: { alignItems: 'center' },
  dotBox: { height: 16, justifyContent: 'center', alignItems: 'center' },
  halo: { position: 'absolute', width: 30, height: 30, borderRadius: 15 },
});
