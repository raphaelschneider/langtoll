// The first fare, paid before the paywall. Three real multiple-choice exercises
// from the learner's own A1 pack — the thing the app does, felt once, before
// anyone is asked for money. A promise and a feeling are different things
// (founder call, 2026-09-24: the questionnaire showed damage and promised
// value; nobody had touched the product).
//
// Deliberately small: no typing, no audio (audio is Plus, and a permission
// prompt here would break the forty seconds), no session bookkeeping. Nothing
// here writes progress — the real first session still counts as the first.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Entrance } from '@/components/ui/Entrance';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { Tolly, type TollyMood } from '@/components/ui/Tolly';
import { useTheme, space, radius } from '@/design/theme';
import { useT } from '@/lib/i18n';
import { buildSession, type Exercise } from '@/lib/trainer/engine';
import type { LanguagePack } from '@/content/german/types';

const COUNT = 3;
const MC = new Set(['mc_de_en', 'mc_en_de']);

/** Three tap exercises from the pack: word → meaning, meaning → word. */
function pickTaste(pack: LanguagePack, seed: number): Exercise[] {
  // A generous plan, filtered down: buildSession seats sentences too, and only
  // the two tap types belong here.
  const plan = buildSession(pack, [], COUNT * 4, seed, { audio: false, fullCurriculum: false });
  return plan.exercises.filter((e) => MC.has(e.type) && e.options?.length).slice(0, COUNT);
}

export function TasteFare({
  pack,
  onDone,
}: {
  pack: LanguagePack;
  /** Fired once, when the third answer has been shown. */
  onDone: () => void;
}) {
  const theme = useTheme();
  const t = useT();
  const seed = useRef(Math.floor(Math.random() * 2 ** 31)).current;
  const exercises = useMemo(() => pickTaste(pack, seed), [pack, seed]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const startedAt = useRef(Date.now()).current;
  const [done, setDone] = useState(false);

  const ex = exercises[idx];
  const feedback = picked !== null;
  // Tolly watches every answer: stern until it lands, then happy or sad, and
  // celebrating at the end — the same arc as the sentence builder.
  const mood: TollyMood = done ? 'celebrate' : !feedback ? 'stern' : picked === ex?.answer ? 'happy' : 'sad';

  useEffect(() => {
    if (!feedback) return;
    // Long enough to read the tick, short enough that three fit in forty seconds.
    const id = setTimeout(() => {
      if (idx + 1 >= exercises.length) {
        setDone(true);
        onDone();
      } else {
        setIdx(idx + 1);
        setPicked(null);
      }
    }, 900);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  // A pack too small for three tap exercises (never for the bundled A1s) still
  // lets the flow continue: nothing to pay, straight on.
  useEffect(() => {
    if (!exercises.length) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function answer(opt: string) {
    if (feedback || !ex) return;
    const ok = opt === ex.answer;
    Haptics.notificationAsync(ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
    if (ok) setCorrect((c) => c + 1);
    setPicked(opt);
  }

  if (done || !ex) {
    const secs = Math.max(5, Math.round((Date.now() - startedAt) / 1000));
    return (
      <Entrance key="taste-done" style={{ flex: 1 }}>
        <Text variant="overline" color="accent">
          {t('ob.tasteDoneOver')}
        </Text>
        <Text variant="title" style={{ marginTop: space.sm }}>
          {t('ob.tasteDoneTitle')}
        </Text>
        <Text variant="serif" color="inkSoft" style={{ marginTop: space.lg }}>
          {/* The score is a boast only when it is perfect; a 1 of 3 under a
              celebrating Tolly reads as a scold, so the time alone carries it. */}
          {correct === exercises.length
            ? t('ob.tasteDoneSub', { n: correct, of: exercises.length, secs })
            : t('ob.tasteDoneSubTime', { secs })}
        </Text>
        <Text variant="callout" color="inkSoft" style={{ marginTop: space.md }}>
          {t('ob.tasteDoneNote')}
        </Text>
        <View style={styles.slot}>
          <Tolly mood="celebrate" size={184} />
        </View>
      </Entrance>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text variant="overline" color="accent">
            {t('ob.tasteOver', { n: idx + 1, of: exercises.length })}
          </Text>
          <Text variant="caption" color="inkFaint" style={{ marginTop: space.xs }}>
            {ex.type === 'mc_de_en' ? t('ob.tasteAskMeaning') : t('ob.tasteAskWord')}
          </Text>
        </View>
      </View>
      <Entrance key={`prompt:${ex.key}`} from={8}>
        <Text variant="hero" style={{ marginTop: space.lg, fontSize: 40, lineHeight: 46 }}>
          {ex.prompt}
        </Text>
      </Entrance>
      <View style={styles.options}>
        {ex.options!.map((opt, i) => {
          const isPicked = feedback && picked === opt;
          const isAnswer = feedback && opt === ex.answer;
          const bg = isAnswer ? theme.accent : isPicked ? theme.danger : theme.surface;
          const fg = isAnswer ? theme.onAccent : isPicked ? '#FFFFFF' : theme.ink;
          const bystander = feedback && !isAnswer && !isPicked;
          return (
            <Entrance key={`${ex.key}-${opt}-${i}`} delay={40 * i} from={8}>
              <PressableScale
                onPress={() => answer(opt)}
                disabled={feedback}
                accessibilityRole="button"
                accessibilityState={{ disabled: feedback, selected: isPicked }}
                style={[
                  styles.option,
                  { backgroundColor: bg, borderColor: isAnswer || isPicked ? bg : theme.line, opacity: bystander ? 0.4 : 1 },
                ]}
              >
                <Text variant="bodyMedium" center style={{ color: fg }}>
                  {opt}
                </Text>
                {(isAnswer || isPicked) && (
                  <View style={styles.glyph}>
                    <Ionicons name={isAnswer ? 'checkmark' : 'close'} size={18} color={fg} />
                  </View>
                )}
              </PressableScale>
            </Entrance>
          );
        })}
      </View>
      {/* Tolly watches from the space under the options — the same seat as the
          sentence builder's, taking whatever height the options leave. */}
      <View style={styles.slot} pointerEvents="none">
        <Entrance key={`tolly:${idx}:${mood}`} from={6}>
          <Tolly mood={mood} size={144} />
        </Entrance>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  // The done card's Tolly owns the height the copy leaves, centred — no void
  // between him and the CTA.
  slot: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', minHeight: 170, marginTop: space.lg },
  options: { marginTop: space.xl, gap: space.sm },
  option: {
    minHeight: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  glyph: { position: 'absolute', right: space.lg, top: 0, bottom: 0, justifyContent: 'center' },
});
