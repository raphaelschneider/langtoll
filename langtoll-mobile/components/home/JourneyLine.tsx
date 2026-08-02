// The journey line — your CEFR route (A1 → B2) drawn as a transit line, with the level you're
// on as the lit "train" station and the track filled up to where you've ridden. The meta-game
// version of the pass metaphor: learning as a route you travel. CEFR codes are universal, so
// nothing here needs localizing.
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme, space, font } from '@/design/theme';

const LEVELS = ['A1', 'A2', 'B1', 'B2'];

export function JourneyLine({ level }: { level: string }) {
  const theme = useTheme();
  const cur = Math.max(0, LEVELS.indexOf(level));
  const fillFrac = cur / (LEVELS.length - 1);

  return (
    <View style={styles.wrap}>
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
                    fontFamily: font.mono,
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
  route: { position: 'relative', justifyContent: 'center' },
  // Track runs through the dot centres. The dot box is 16 tall, centre at 8 → track top 7.
  track: { position: 'absolute', left: 8, right: 8, top: 7, height: 2, borderRadius: 1 },
  trackFill: { position: 'absolute', left: 8, top: 7, height: 2, borderRadius: 1 },
  stations: { flexDirection: 'row', justifyContent: 'space-between' },
  stationWrap: { alignItems: 'center' },
  dotBox: { height: 16, justifyContent: 'center', alignItems: 'center' },
});
