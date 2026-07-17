// The practice session — the fare gate. N exercises, one at a time; finishing
// issues the pass. Difficulty shapes the mix (see lib/trainer/engine); voice
// mode reads German aloud. Answer → feedback (correct answer always shown) →
// Continue. No timers, no auto-advance: predictable while we iterate.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { PassIssue } from '@/components/pass/PassIssue';
import { Entrance } from '@/components/ui/Entrance';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme, space, radius, font, shadow } from '@/design/theme';
import { activePack } from '@/lib/pack';
import { buildSession, gradeTyped, gradeOrder, type Exercise, type Grade } from '@/lib/trainer';
import {
  getState,
  useAppState,
  progressRows,
  recordAnswer,
  completeSession,
  unlockRemainingMs,
  updateProfile,
} from '@/lib/store';
import { playMessageChime } from '@/lib/sound';
import { speakGerman, stopSpeaking } from '@/lib/tts';
import { grantUnlock } from '@/lib/blocking';
import { useT, type StringKey } from '@/lib/i18n';

type Phase = 'answer' | 'feedback' | 'done';

export default function Session() {
  const theme = useTheme();
  const t = useT();
  const appState = useAppState();
  const pack = useMemo(() => activePack(), []);
  const langName = t(`lang.${pack.language}` as StringKey);

  const seed = useRef(Math.floor(Math.random() * 2 ** 31)).current;
  const plan = useMemo(
    () =>
      buildSession(pack, progressRows(), getState().exercisesPerUnlock, seed, {
        difficulty: getState().difficulty,
        audio: getState().soundEnabled,
      }),
    [pack, seed]
  );
  const total = plan.exercises.length;

  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('answer');
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [orderPicked, setOrderPicked] = useState<number[]>([]);
  const [grade, setGrade] = useState<Grade>('wrong');
  const [correctCount, setCorrectCount] = useState(0);

  const ex: Exercise = plan.exercises[idx];
  const sound = appState.soundEnabled;

  const promptLabel: Record<Exercise['type'], string> = {
    cloze: t('session.cloze'),
    mc_de_en: t('session.whatMean'),
    mc_en_de: t('session.sayIt', { lang: langName }),
    type_de: t('session.typeIt', { lang: langName }),
    article: t('session.article'),
    order: t('session.order'),
    listen: t('session.listen'),
  };

  // Voice: hear the German when a German prompt appears, and again on reveal.
  useEffect(() => {
    if (phase === 'answer' && (ex.type === 'listen' || ex.type === 'mc_de_en') && ex.audio) {
      speakGerman(ex.audio, { force: ex.type === 'listen' });
    }
    if (phase === 'feedback' && ex.type !== 'listen' && ex.type !== 'mc_de_en' && ex.audio) {
      speakGerman(ex.audio);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ex.key, phase]);

  useEffect(() => () => stopSpeaking(), []);

  function finishAnswer(given: string, g: Grade) {
    const ok = g !== 'wrong';
    Haptics.notificationAsync(
      ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
    );
    recordAnswer(ex.itemId, ok);
    if (ok) setCorrectCount((c) => c + 1);
    setPicked(given);
    setGrade(g);
    setPhase('feedback');
  }

  function answer(given: string) {
    if (phase !== 'answer') return;
    const g: Grade =
      ex.type === 'type_de' ? gradeTyped(ex.answer, given) : given === ex.answer ? 'correct' : 'wrong';
    finishAnswer(given, g);
  }

  function answerOrder() {
    if (phase !== 'answer' || !orderPicked.length) return;
    const words = orderPicked.map((i) => ex.options![i]);
    finishAnswer(words.join(' '), gradeOrder(ex.answer, words));
  }

  function next() {
    if (idx + 1 >= total) {
      completeSession();
      grantUnlock(getState().unlockMinutes); // lift the real shield + schedule re-lock (native only)
      playMessageChime();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPhase('done');
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
    setTyped('');
    setOrderPicked([]);
    setPhase('answer');
  }

  if (phase === 'done') {
    const s = getState();
    return (
      <View style={[styles.root, { backgroundColor: theme.paper }]}>
        <AuroraBackground mood={0.8} />
        <SafeAreaView style={[styles.safe, styles.doneWrap]}>
          <Entrance>
            <Text variant="overline" color="accent" center>
              {t('session.passIssued')}
            </Text>
            <Text variant="hero" center style={{ marginTop: space.md }}>
              {pack.flavor.sessionDone}
            </Text>
            <Text variant="body" color="inkSoft" center style={{ marginTop: space.sm }}>
              {t('session.correctCount', { correct: correctCount, total })}
            </Text>
          </Entrance>
          <View style={{ alignSelf: 'stretch', marginTop: space.xxl }}>
            <PassIssue
              state="active"
              remainingMs={unlockRemainingMs(s)}
              unlockMinutes={s.unlockMinutes}
              exercisesPerUnlock={s.exercisesPerUnlock}
              packLabel={`${pack.language.toUpperCase()} · ${pack.level}`}
              serial={s.sessionsCompleted}
              passenger={s.name}
            />
          </View>
          <Entrance delay={1400} style={{ alignSelf: 'stretch', marginTop: space.xxl }}>
            <Button label={t('session.back')} glow full onPress={() => router.dismissTo('/')} />
          </Entrance>
        </SafeAreaView>
      </View>
    );
  }

  const isTyped = ex.type === 'type_de';
  const isOrder = ex.type === 'order';
  const isListen = ex.type === 'listen';

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={0.3} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* header: close + segmented progress + voice toggle */}
          <View style={styles.header}>
            <PressableScale onPress={() => router.back()} style={styles.close} haptic={null}>
              <Ionicons name="close" size={22} color={theme.inkSoft} />
            </PressableScale>
            <View style={styles.segments}>
              {plan.exercises.map((e, i) => {
                const done = i < idx || (i === idx && phase === 'feedback');
                return (
                  <View
                    key={e.key}
                    style={[
                      styles.segment,
                      {
                        backgroundColor: done
                          ? theme.accent
                          : i === idx
                            ? theme.inkFaint
                            : theme.fillStrong,
                      },
                    ]}
                  />
                );
              })}
            </View>
            <PressableScale
              onPress={() => updateProfile({ soundEnabled: !sound })}
              style={styles.close}
              haptic={null}
            >
              <Ionicons
                name={sound ? 'volume-high' : 'volume-mute'}
                size={20}
                color={sound ? theme.accent : theme.inkFaint}
              />
            </PressableScale>
          </View>

          {/* prompt */}
          <View style={styles.body}>
            <Entrance key={ex.key} from={10}>
              <Text variant="overline" color="inkFaint">
                {promptLabel[ex.type]}
              </Text>

              {isListen ? (
                <PressableScale
                  onPress={() => ex.audio && speakGerman(ex.audio, { force: true })}
                  style={[styles.listenBtn, shadow.glow, { backgroundColor: theme.accent }]}
                >
                  <Ionicons name="volume-high" size={40} color={theme.onAccent} />
                </PressableScale>
              ) : (
                <View style={styles.promptRow}>
                  <Text
                    variant={ex.type === 'cloze' || isOrder ? 'title' : 'hero'}
                    style={{ marginTop: space.sm, flexShrink: 1 }}
                  >
                    {ex.prompt}
                  </Text>
                  {sound && ex.type === 'mc_de_en' && (
                    <PressableScale
                      onPress={() => ex.audio && speakGerman(ex.audio, { force: true })}
                      style={styles.speakerSmall}
                      haptic={null}
                    >
                      <Ionicons name="volume-high" size={20} color={theme.inkSoft} />
                    </PressableScale>
                  )}
                </View>
              )}

              {ex.hint && (
                <Text variant="serif" color="inkSoft" style={{ marginTop: space.sm }}>
                  {ex.hint}
                </Text>
              )}
              {isOrder && phase === 'answer' && (
                <Text variant="caption" color="inkFaint" style={{ marginTop: space.sm }}>
                  {t('session.orderHint')}
                </Text>
              )}
            </Entrance>

            {/* order: the sentence being built */}
            {isOrder && (
              <View style={[styles.orderLine, { borderColor: theme.line }]}>
                {orderPicked.length === 0 ? (
                  <Text variant="body" color="inkFaint">
                    …
                  </Text>
                ) : (
                  <View style={styles.orderWrap}>
                    {orderPicked.map((optIdx, i) => (
                      <PressableScale
                        key={`${optIdx}-${i}`}
                        haptic={null}
                        onPress={() =>
                          phase === 'answer' &&
                          setOrderPicked((cur) => cur.filter((_, j) => j !== i))
                        }
                        style={[styles.orderChip, { backgroundColor: 'rgba(200,255,77,0.12)', borderColor: 'rgba(200,255,77,0.4)' }]}
                      >
                        <Text variant="bodyMedium" style={{ color: theme.accent }}>
                          {ex.options![optIdx]}
                        </Text>
                      </PressableScale>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* feedback banner */}
            {phase === 'feedback' && (
              <Entrance from={6} style={{ marginTop: space.lg }}>
                <View
                  style={[
                    styles.feedback,
                    {
                      backgroundColor:
                        grade === 'correct'
                          ? theme.accent
                          : grade === 'almost'
                            ? theme.amber
                            : theme.danger,
                    },
                  ]}
                >
                  <Ionicons
                    name={grade === 'wrong' ? 'close-circle' : 'checkmark-circle'}
                    size={20}
                    color={grade === 'wrong' ? '#FFFFFF' : theme.onAccent}
                  />
                  <Text
                    variant="bodyMedium"
                    style={{ color: grade === 'wrong' ? '#FFFFFF' : theme.onAccent, flex: 1 }}
                  >
                    {grade === 'correct' ? `${pack.flavor.correct} ` : grade === 'almost' ? t('session.almost') : ''}
                    {ex.reveal}
                  </Text>
                </View>
              </Entrance>
            )}
          </View>

          {/* answers */}
          <View style={styles.answers}>
            {isTyped ? (
              <>
                <TextInput
                  value={typed}
                  onChangeText={setTyped}
                  editable={phase === 'answer'}
                  autoFocus
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder={pack.flavor.typedPlaceholder}
                  placeholderTextColor={theme.inkFaint}
                  selectionColor={theme.accent}
                  keyboardAppearance="dark"
                  onSubmitEditing={() => typed.trim() && answer(typed)}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.fill,
                      borderColor: theme.line,
                      color: theme.ink,
                    },
                  ]}
                />
                {phase === 'answer' && (
                  <Button
                    label={t('session.check')}
                    onPress={() => answer(typed)}
                    disabled={!typed.trim()}
                    glow={!!typed.trim()}
                    full
                    style={{ marginTop: space.md }}
                  />
                )}
              </>
            ) : isOrder ? (
              <>
                <View style={styles.orderWrap}>
                  {ex.options!.map((word, i) => {
                    const used = orderPicked.includes(i);
                    return (
                      <PressableScale
                        key={`${word}-${i}`}
                        disabled={phase !== 'answer' || used}
                        onPress={() => {
                          speakGerman(word);
                          setOrderPicked((cur) => [...cur, i]);
                        }}
                        style={[
                          styles.orderChip,
                          {
                            backgroundColor: theme.fill,
                            borderColor: theme.line,
                            opacity: used ? 0.25 : 1,
                          },
                        ]}
                      >
                        <Text variant="bodyMedium">{word}</Text>
                      </PressableScale>
                    );
                  })}
                </View>
                {phase === 'answer' && (
                  <Button
                    label={t('session.check')}
                    onPress={answerOrder}
                    disabled={!orderPicked.length}
                    glow={!!orderPicked.length}
                    full
                    style={{ marginTop: space.md }}
                  />
                )}
              </>
            ) : (
              ex.options!.map((opt, i) => {
                const isPicked = phase === 'feedback' && picked === opt;
                const isAnswer = phase === 'feedback' && opt === ex.answer;
                const bg = isAnswer
                  ? theme.accent
                  : isPicked
                    ? theme.danger
                    : theme.fill;
                const fg = isAnswer ? theme.onAccent : isPicked ? '#FFFFFF' : theme.ink;
                return (
                  <Entrance key={`${ex.key}-${opt}-${i}`} delay={40 * i} from={8}>
                    <PressableScale
                      onPress={() => answer(opt)}
                      disabled={phase !== 'answer'}
                      style={[
                        styles.option,
                        {
                          backgroundColor: bg,
                          borderColor: isAnswer || isPicked ? bg : theme.line,
                        },
                      ]}
                    >
                      <Text variant="bodyMedium" center style={{ color: fg }}>
                        {opt}
                      </Text>
                    </PressableScale>
                  </Entrance>
                );
              })
            )}

            {phase === 'feedback' && (
              <Button
                label={idx + 1 >= total ? t('session.finish') : t('common.continue')}
                glow
                onPress={next}
                full
                style={{ marginTop: space.md }}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
  },
  close: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  segments: { flex: 1, flexDirection: 'row', gap: 5, paddingHorizontal: space.sm },
  segment: { flex: 1, height: 3, borderRadius: 1.5 },
  body: { flex: 1, paddingHorizontal: space.xl, paddingTop: space.xxl },
  promptRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  speakerSmall: { paddingTop: space.lg },
  listenBtn: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.xl,
    alignSelf: 'flex-start',
  },
  answers: { paddingHorizontal: space.xl, paddingBottom: space.lg, gap: space.sm },
  option: {
    minHeight: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  orderLine: {
    minHeight: 56,
    borderBottomWidth: 1,
    marginTop: space.xl,
    justifyContent: 'center',
    paddingBottom: space.sm,
  },
  orderWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  orderChip: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: {
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: space.lg,
    fontFamily: font.body,
    fontSize: 18,
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  doneWrap: { justifyContent: 'center', paddingHorizontal: space.xl },
});
