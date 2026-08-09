// The practice session — the fare gate. N exercises, one at a time; finishing
// issues the pass. Difficulty shapes the mix (see lib/trainer/engine); voice
// mode reads the target language aloud. Answer → feedback (correct answer always shown) →
// Continue. No timers, no auto-advance: predictable while we iterate.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, AppState as RNAppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { PassIssue } from '@/components/pass/PassIssue';
import { CollectBadge } from '@/components/pass/CollectBadge';
import { Entrance } from '@/components/ui/Entrance';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme, space, radius, font, shadow } from '@/design/theme';
import { withAlpha } from '@/lib/color';
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
import { speakTarget, stopSpeaking } from '@/lib/tts';
import { canUseAudio } from '@/lib/plans';
import { grantUnlock } from '@/lib/blocking';
import { track } from '@/lib/telemetry';
import { Tolly } from '@/components/ui/Tolly';
import { syncPassActivity } from '@/lib/pass-activity';
import { OrderBuilder } from '@/components/session/OrderBuilder';
import { ensureAudio } from '@/lib/audio-pack';
import { maybeAskForReview } from '@/lib/review';
import { clearDeliveredNotifications } from '@/lib/notify';

// Same signal as the rest of the dev tooling; a production build cannot set it.
const DEV_TOOLS = process.env.EXPO_PUBLIC_DEV_TOOLS === '1';
const COLLECT_BONUS_MIN = 5; // extra phone-time minutes earned per word mastered in a session
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
        // Gate generation, not just playback: a 'listen' exercise with no audio
        // has no question to answer, so a free user must never be dealt one.
        audio: canUseAudio() && getState().soundEnabled,
      }),
    [pack, seed]
  );

  // One per fare attempt; the completed/abandoned pair closes it out.
  useEffect(() => {
    track('session_started', { language: pack.language, level: pack.level });
  }, [pack]);
  const total = plan.exercises.length;

  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('answer');
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [orderPicked, setOrderPicked] = useState<number[]>([]);
  const [grade, setGrade] = useState<Grade>('wrong');
  const [correctCount, setCorrectCount] = useState(0);
  const [collected, setCollected] = useState<string | null>(null); // word just mastered → collect badge
  const collectedCount = useRef(0); // words mastered this session → +5 min each at completion
  // Pending review ask; cancelled if the user leaves before it fires.
  const reviewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (reviewTimer.current) clearTimeout(reviewTimer.current);
  }, []);

  // Hold the first card briefly until this session's own audio is on disk —
  // corpus files arrive at onboarding, but AI-pack items synthesize on first
  // request (a couple of seconds server-side) and the order exercise speaks
  // individual words. Bounded inside ensureAudio: past the deadline the
  // session starts and TTS covers any straggler. Founder call: the first
  // sound of a session is never the robot voice when audio is obtainable.
  const [audioReady, setAudioReady] = useState(false);
  useEffect(() => {
    const texts = plan.exercises.flatMap((e) => {
      const out: string[] = [];
      if (e.audio) out.push(e.audio);
      if (e.type === 'order' && e.options) out.push(...e.options);
      return out;
    });
    let alive = true;
    ensureAudio(texts).finally(() => alive && setAudioReady(true));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  const ex: Exercise = plan.exercises[idx];
  const audioAllowed = canUseAudio();
  // Locked users still SEE the speaker (it is a paywall entry point); it just
  // routes to the offer instead of speaking.
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

  // Autoplay is the DEFAULT: hear the target language when a target-language
  // prompt appears, and again on reveal so the pronunciation lands with the
  // answer. Both suppressions live inside speakTarget() rather than here —
  // it returns early when the plan doesn't include audio (free, honeymoon
  // over) and when the user has muted it. 'listen' passes force so it beats
  // the mute toggle, since there the audio IS the question.
  //
  // buildSession only plans 'listen' when sound was on at session start, so a
  // free or already-muted user never meets one. A user who mutes MID-session
  // still can — see listenAsText, which renders those as text instead.
  useEffect(() => {
    if (!audioReady) return; // gate below renders a loader; speak nothing yet
    if (phase === 'answer' && (ex.type === 'listen' || ex.type === 'mc_de_en') && ex.audio) {
      // force beats the mute toggle — but NOT once the user has told us they
      // cannot hear. Muting mid-session leaves already-planned 'listen'
      // exercises in the queue; forcing audio at someone who just said they
      // can't hear it would be the one place the app talks over its own user.
      speakTarget(ex.audio, { force: ex.type === 'listen' && sound });
    }
    if (phase === 'feedback' && ex.type !== 'listen' && ex.type !== 'mc_de_en' && ex.audio) {
      speakTarget(ex.audio);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ex.key, phase, audioReady]);

  useEffect(() => () => stopSpeaking(), []);

  // Backgrounding mid-animation freezes Reanimated entering transitions at
  // their start frame (opacity ~0): the user returned to a ghost screen with
  // the prompt invisible. Re-keying the animated content on every return to
  // foreground re-runs the entrances cleanly.
  const [resumeTick, setResumeTick] = useState(0);
  const bodyScrollRef = useRef<ScrollView>(null);

  // Long AI sentences overflow the body; it scrolls now, so the feedback
  // banner can land below the fold — bring it into view when it appears, and
  // reset to the top for each fresh exercise.
  useEffect(() => {
    if (phase === 'feedback') {
      const id = setTimeout(() => bodyScrollRef.current?.scrollToEnd({ animated: true }), 120);
      return () => clearTimeout(id);
    }
    bodyScrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [phase, idx]);
  useEffect(() => {
    const sub = RNAppState.addEventListener('change', (st) => {
      if (st === 'active') setResumeTick((n) => n + 1);
    });
    return () => sub.remove();
  }, []);

  if (!audioReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.paper }}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }


  function finishAnswer(given: string, g: Grade) {
    const ok = g !== 'wrong';
    Haptics.notificationAsync(
      ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
    );
    // Detect the moment a word crosses into mastery (streak 2 → 3): that "collects" it.
    const before = getState().progress[ex.itemId]?.streak ?? 0;
    recordAnswer(ex.itemId, ok);
    const after = getState().progress[ex.itemId]?.streak ?? 0;
    if (ok && before < 3 && after >= 3) {
      const w = pack.vocab.find((v) => v.id === ex.itemId);
      if (w) {
        collectedCount.current += 1;
        setCollected(w.de);
      }
    }
    if (ok) setCorrectCount((c) => c + 1);
    setPicked(given);
    setGrade(g);
    setPhase('feedback');
  }

  function answer(given: string) {
    if (phase !== 'answer') return;
    // Typed answers grade against the canonical form AND its altAnswers —
    // "obrigada" is a fully correct "thank you" from the person who says it,
    // never a typo of "obrigado". Best grade across the variants wins.
    const rank: Record<Grade, number> = { correct: 2, almost: 1, wrong: 0 };
    const g: Grade =
      ex.type === 'type_de'
        ? [ex.answer, ...(ex.altAnswers ?? [])]
            .map((a) => gradeTyped(a, given))
            .reduce((best, cur) => (rank[cur] > rank[best] ? cur : best), 'wrong' as Grade)
        : given === ex.answer
          ? 'correct'
          : 'wrong';
    finishAnswer(given, g);
  }

  function answerOrder() {
    if (phase !== 'answer' || !orderPicked.length) return;
    const words = orderPicked.map((i) => ex.options![i]);
    finishAnswer(words.join(' '), gradeOrder(ex.answer, words));
  }

  function next() {
    if (idx + 1 >= total) {
      const bonus = collectedCount.current * COLLECT_BONUS_MIN; // +5 min per word mastered this session
      completeSession(bonus);
      // Coarse dims only (language + CEFR level) — the words themselves never leave the phone.
      const st = getState();
      track('session_completed', { language: st.learningLanguage, level: st.level });
      track('unlocked', { minutes: st.unlockMinutes + bonus });
      grantUnlock(getState().unlockMinutes + bonus); // lift the real shield + schedule re-lock (native only)
      // The pass, live: countdown in the Dynamic Island / lock screen until the
      // grant expires. Store timestamp is the source of truth (works sans native).
      syncPassActivity();
      // Fare paid — last run's "pass expired" banner is now a lie; sweep it.
      clearDeliveredNotifications();
      // The last exercise's speech must not bleed under the pass-issued
      // screen (the chime plays there, not the lesson audio).
      stopSpeaking();
      playMessageChime();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPhase('done');
      return;
    }
    // Cut whatever is still speaking the moment the user moves on — a long
    // sentence must never bleed over the next exercise's own audio.
    stopSpeaking();
    setIdx(idx + 1);
    setPicked(null);
    setTyped('');
    setOrderPicked([]);
    setPhase('answer');
  }

  if (phase === 'done') {
    const s = getState();
    // The ask rides the celebration, not the work: fired once the PAID stamp has
    // landed (the Entrance below uses the same 1.4s beat), and only if the run
    // was a win. lib/review owns every other guardrail.
    reviewTimer.current ??= setTimeout(() => maybeAskForReview(correctCount, total), 1800);
    return (
      <View style={[styles.root, { backgroundColor: theme.paper }]}>
        <AuroraBackground mood={0.8} />
        <SafeAreaView style={[styles.safe, styles.doneWrap]}>
          <Entrance>
            {/* Tolly celebrates the issue — arrives with the headline, before the
                stamp slam below takes over. */}
            <Tolly mood="celebrate" size={104} style={{ alignSelf: 'center', marginBottom: space.md }} />
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
  // A 'listen' exercise the user cannot hear is unanswerable — and because our
  // own shield holds the phone until the session ends, being stuck here is a
  // trap with no way out. buildSession already excludes these when sound is
  // off, but that decision is made at session START: the user who loses their
  // headphones, boards a train or sits down in a meeting mid-session is
  // exactly the person this protects. Falling back to the text turns it into
  // a normal 'mc_de_en' — the options and answer are already the meanings, so
  // nothing about grading changes. Derived from `sound` rather than local
  // state so one tap covers every remaining listen exercise in the plan.
  const listenAsText = isListen && !sound;

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={0.3} />
      <CollectBadge word={collected} bonusMin={COLLECT_BONUS_MIN} onDone={() => setCollected(null)} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* header: close + route-line progress (each exercise is a stop) + voice toggle */}
          <View style={styles.header}>
            <PressableScale
              onPress={() => {
                track('session_abandoned', { at: idx, of: total });
                router.back();
              }}
              style={styles.close}
              haptic={null}
            >
              <Ionicons name="close" size={22} color={theme.inkSoft} />
            </PressableScale>
            <View style={styles.route}>
              <View style={[styles.track, { backgroundColor: theme.fillStrong }]} />
              <View
                style={[
                  styles.trackFill,
                  {
                    backgroundColor: theme.accent,
                    width: `${(idx / Math.max(1, plan.exercises.length - 1)) * 100}%`,
                  },
                ]}
              />
              <View style={styles.stations}>
                {plan.exercises.map((e, i) => {
                  const done = i < idx || (i === idx && phase === 'feedback');
                  const current = i === idx;
                  const lit = done || current;
                  return (
                    <View
                      key={e.key}
                      style={[
                        styles.station,
                        {
                          backgroundColor: lit ? theme.accent : theme.paper,
                          borderColor: lit ? theme.accent : theme.line,
                          width: current ? 12 : 8,
                          height: current ? 12 : 8,
                          borderRadius: current ? 6 : 4,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            </View>
            <PressableScale
              onPress={() =>
                audioAllowed ? updateProfile({ soundEnabled: !sound }) : router.push('/paywall')
              }
              style={[
                styles.close,
                // Muted must be VISIBLE, not a faint gray ghost: audio-off is a
                // persisted state (the cantHear link sets it too) and the user
                // who muted in yesterday's meeting needs to notice it today.
                // The filled pill reads as "something is switched off — tap me".
                audioAllowed && !sound
                  ? {
                      backgroundColor: withAlpha(theme.accent, 0.15),
                      borderWidth: 1,
                      borderColor: withAlpha(theme.accent, 0.4),
                      borderRadius: radius.pill,
                    }
                  : null,
              ]}
              haptic={null}
              accessibilityLabel={audioAllowed ? t('settings.voice') : t('plus.locked')}
            >
              <Ionicons
                name={!audioAllowed ? 'lock-closed' : sound ? 'volume-high' : 'volume-mute'}
                size={20}
                color={!audioAllowed ? theme.inkFaint : sound ? theme.accent : theme.accent}
              />
            </PressableScale>
          </View>

          {/* prompt */}
          <ScrollView
            ref={bodyScrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            <Entrance key={`${ex.key}:r${resumeTick}`} from={10}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text variant="overline" color="inkFaint">
                  {/* Once the audio is replaced by its text the question is no
                      longer "what do you hear?" — it is the meaning question. */}
                  {listenAsText ? promptLabel.mc_de_en : promptLabel[ex.type]}
                </Text>
                {/* Provenance, dev builds only: is this exercise ours or generated?
                    Gated on the same flag as the rest of the dev tooling, so it can
                    never appear in a store build (the pre-install check fails a
                    production build that sets it). */}
                {DEV_TOOLS && (
                  <View
                    style={{
                      paddingHorizontal: 6,
                      paddingVertical: 1,
                      borderRadius: 4,
                      backgroundColor: ex.source === 'ai' ? withAlpha(theme.accent, 0.18) : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <Text variant="caption" color={ex.source === 'ai' ? 'ink' : 'inkFaint'}>
                      {ex.source === 'ai' ? 'AI' : 'AUTHORED'}
                    </Text>
                  </View>
                )}
              </View>

              {isListen && !listenAsText ? (
                <>
                  <PressableScale
                    onPress={() => ex.audio && speakTarget(ex.audio, { force: true })}
                    style={[styles.listenBtn, shadow.glow, { backgroundColor: theme.accent }]}
                  >
                    <Ionicons name="volume-high" size={40} color={theme.onAccent} />
                  </PressableScale>
                  {/* The escape hatch. Quiet by design — it must be findable in
                      the moment it is needed without inviting everyone to skip
                      listening practice. Turning sound off is the same switch
                      as Settings, so the choice persists instead of having to
                      be made again next session. */}
                  <PressableScale
                    onPress={() => {
                      stopSpeaking();
                      updateProfile({ soundEnabled: false });
                      track('listen_fallback_used');
                    }}
                    haptic={null}
                    style={styles.cantHear}
                  >
                    <Text variant="caption" color="inkFaint" center>
                      {t('session.cantHear')}
                    </Text>
                  </PressableScale>
                </>
              ) : listenAsText ? (
                // Same shape as the normal prompt path: the word we would have
                // spoken, shown instead.
                <View style={styles.promptRow}>
                  <Text variant="hero" style={{ marginTop: space.sm, flexShrink: 1 }}>
                    {ex.audio}
                  </Text>
                </View>
              ) : (
                <View style={styles.promptRow}>
                  <Text
                    // Sentence prompts step down a size once they'd wrap past
                    // ~4 lines — an AI B2 sentence at title size pushed the
                    // feedback banner clean off the screen.
                    variant={
                      ex.type === 'cloze' || isOrder
                        ? ex.prompt.length > 70
                          ? 'headline'
                          : 'title'
                        : 'hero'
                    }
                    style={{ marginTop: space.sm, flexShrink: 1 }}
                  >
                    {ex.prompt}
                  </Text>
                  {sound && ex.type === 'mc_de_en' && (
                    <PressableScale
                      onPress={() =>
                        audioAllowed
                          ? ex.audio && speakTarget(ex.audio, { force: true })
                          : router.push('/paywall')
                      }
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
                  // Placed words: tap sends a word back, DRAG reorders it in
                  // place — changing your mind about the order no longer means
                  // dismantling the sentence.
                  <OrderBuilder
                    words={orderPicked.map((optIdx) => ex.options![optIdx])}
                    interactive={phase === 'answer'}
                    onRemoveAt={(i) =>
                      setOrderPicked((cur) => cur.filter((_, j) => j !== i))
                    }
                    onReorder={(from, to) =>
                      setOrderPicked((cur) => {
                        const next = [...cur];
                        const [moved] = next.splice(from, 1);
                        next.splice(to, 0, moved);
                        return next;
                      })
                    }
                  />
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
          </ScrollView>

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
                          speakTarget(word);
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
                  <Entrance key={`${ex.key}-${opt}-${i}:r${resumeTick}`} delay={40 * i} from={8}>
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
  route: { flex: 1, height: 40, justifyContent: 'center', marginHorizontal: space.sm },
  track: { position: 'absolute', left: 4, right: 4, height: 2, borderRadius: 1, top: 19 },
  trackFill: { position: 'absolute', left: 4, height: 2, borderRadius: 1, top: 19 },
  stations: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  station: { borderWidth: 1.5 },
  body: { paddingHorizontal: space.xl, paddingTop: space.xxl, paddingBottom: space.lg },
  promptRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  speakerSmall: { paddingTop: space.lg },
  cantHear: { paddingTop: space.md, paddingHorizontal: space.md, alignSelf: 'center' },
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
