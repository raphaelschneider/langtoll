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
import { PassIssue } from '@/components/pass/PassIssue';
import { useTheme, space, radius } from '@/design/theme';
import { useT } from '@/lib/i18n';
import { track } from '@/lib/telemetry';
import { speakTaste, stopSpeaking } from '@/lib/tts';
import { buildSession, type Exercise } from '@/lib/trainer/engine';
import type { LanguagePack } from '@/content/german/types';

/** The taste is the fare they just set (3, 5 or 8 exercises), so the first fare
 *  they pay is the one they will pay every day (founder, TestFlight 50). */
const DEFAULT_COUNT = 3;

/**
 * Three "tap the meaning" exercises from the pack: the foreign word, three meanings
 * in their own language. Recognition only. "Tap the word" (meaning → foreign word)
 * asks a beginner to produce a language they have never seen, which is a guess, and
 * too many people stopped on this screen once it shipped (2026-09-30). The reverse
 * direction is only a fallback if a pack is short of the easy kind.
 */
function pickTaste(pack: LanguagePack, seed: number, count: number): Exercise[] {
  // A generous plan, filtered down: buildSession seats sentences too.
  const plan = buildSession(pack, [], count * 8, seed, { audio: false, fullCurriculum: false });
  const withOptions = plan.exercises.filter((e) => e.options?.length);
  const meaning = withOptions.filter((e) => e.type === 'mc_de_en');
  const word = withOptions.filter((e) => e.type === 'mc_en_de');
  return [...meaning, ...word].slice(0, count);
}

export function TasteFare({
  pack,
  count = DEFAULT_COUNT,
  onDone,
  pass,
}: {
  pack: LanguagePack;
  /** How many exercises: the fare they chose. */
  count?: number;
  /** Fired once, when the last answer has been shown. */
  onDone: () => void;
  /** The pass this fare would issue, from the learner's own answers: the same
   *  printed ticket and PAID stamp a real session ends on, so the reward is seen
   *  before the paywall (founder, TestFlight 1.0.4, 2026-09-30). */
  pass?: { unlockMinutes: number; exercisesPerUnlock: number; passenger: string | null; packLabel: string };
}) {
  const theme = useTheme();
  const t = useT();
  const seed = useRef(Math.floor(Math.random() * 2 ** 31)).current;
  const exercises = useMemo(() => pickTaste(pack, seed, count), [pack, seed, count]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const startedAt = useRef(Date.now()).current;
  const [done, setDone] = useState(false);

  const ex = exercises[idx];
  const feedback = picked !== null;
  // Tolly reacts to the answer, as he does in a real fare. He smiled at wrong
  // answers for a day (2026-10-01) and the founder could not tell whether they had
  // been right: "Tolly is smiling regardless, so no."
  const wasRight = feedback && picked === ex?.answer;
  const mood: TollyMood = done ? 'celebrate' : !feedback ? 'stern' : wasRight ? 'happy' : 'sad';
  const shownAt = useRef(Date.now());
  useEffect(() => {
    shownAt.current = Date.now();
    // Hear the word as it appears when it is in the target language; the
    // English-prompt kind is spoken when the answer lands (below).
    if (ex?.audio && ex.type !== 'mc_en_de') speakTaste(ex.audio, pack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);
  useEffect(() => {
    if (feedback && ex?.audio && ex.type === 'mc_en_de') speakTaste(ex.audio, pack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);
  // Leaving the step silences it, whatever was mid-word.
  useEffect(() => () => stopSpeaking(), []);

  useEffect(() => {
    if (!feedback) return;
    // A tick needs a glance; a miss needs time to read the red and the right
    // answer beside it. At 0.9 s for both, a wrong round was gone before it
    // registered (2026-10-01: "I barely can see if I'm right").
    const id = setTimeout(
      () => {
        if (idx + 1 >= exercises.length) {
          setDone(true);
          onDone();
        } else {
          setIdx(idx + 1);
          setPicked(null);
        }
      },
      wasRight ? 900 : 2200,
    );
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
    // One event per answer: which question, right or not, how long it took. The step
    // event alone could not say whether people left at the first question or the last.
    track('taste_answer', { n: idx + 1, correct: ok, ms: Date.now() - shownAt.current, type: ex.type });
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
        {pass ? (
          <View style={{ marginTop: space.xl }}>
            <PassIssue
              state="active"
              remainingMs={pass.unlockMinutes * 60_000}
              unlockMinutes={pass.unlockMinutes}
              exercisesPerUnlock={pass.exercisesPerUnlock}
              packLabel={pass.packLabel}
              serial={1}
              passenger={pass.passenger}
            />
          </View>
        ) : (
          <>
            <Text variant="callout" color="inkSoft" style={{ marginTop: space.md }}>
              {/* Most answers wrong at a level they chose themselves: say the level
                  is adjustable before the wall asks for money, or the wall reads as
                  "pay for things you can't do" (founder, 2026-10-04). */}
              {correct * 2 < exercises.length ? t('ob.tasteTooHard') : t('ob.tasteDoneNote')}
            </Text>
            <View style={styles.slot}>
              <Tolly mood="celebrate" size={184} />
            </View>
          </>
        )}
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
          // The right answer lights up lime; a wrong pick goes stamp-red with a
          // cross, the same marking as a real fare, so right and wrong read at a
          // glance (a dimmed grey wrong pick was invisible on a phone).
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
