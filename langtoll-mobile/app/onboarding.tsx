// Onboarding — the fare-gate flow. One route, a step machine, instant transitions.
// Structure follows the converting-onboarding playbook: hook → mechanic → questions
// (name first, used everywhere after) → emotional mirror → plan-printing loading →
// personalized summary → transformation paywall. Skip on every optional step.
// All copy via lib/i18n; target-language flavor comes from the content pack.
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { PassCard } from '@/components/pass/PassCard';
import { Entrance } from '@/components/ui/Entrance';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { PlusOffer } from '@/components/paywall/PlusOffer';
import { LockSetup } from '@/components/blocking/LockSetup';
import { lockNow } from '@/lib/blocking';
import { scheduleDailyNudge } from '@/lib/notify';
import { Tolly } from '@/components/ui/Tolly';
import { useTheme, space, radius, font } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { levelForDifficulty } from '@/lib/pack';
import { downloadPackAudio } from '@/lib/audio-pack';
import { learnableLanguages, soonLanguages, packFor } from '@/content';
import type { Language } from '@/content/german/types';
import { updateProfile } from '@/lib/store';
import { refreshGoalPack } from '@/lib/ai/topics';
import {
  SPEAKER_FORM_EXAMPLES,
  FARE_EXERCISES,
  FARE_MINUTES_MIN,
  FARE_MINUTES_MAX,
  FARE_MINUTES_STEP,
} from '@/lib/plans';
import { FareSlider } from '@/components/ui/FareSlider';
import { track } from '@/lib/telemetry';
import { useT, resolvedLocale, type StringKey } from '@/lib/i18n';

const STEPS = [
  'hook',
  'how',
  'name',
  'language',
  'difficulty',
  'apps',
  'mirror',
  'when',
  'fare',
  'goal',
  'forms',
  'printing',
  'summary',
  'paywall',
  'lock',
] as const;
type Step = (typeof STEPS)[number];

const APPS = ['TikTok', 'Instagram', 'YouTube', 'Reddit', 'X', 'Games', 'Netflix'];

// Published 2026 averages, minutes/day *per daily active user of that app*. The
// mirror step presents these as what the average user spends, never as the
// reader's own measured time — iOS does not expose Screen Time figures to us
// (DeviceActivityReport can only render them inside its own extension sandbox).
// Netflix is deliberately below its ~2.5h/account figure: that number is
// TV-inclusive and we are estimating phone time.
const APP_MINUTES: Record<string, number> = {
  TikTok: 90,
  YouTube: 80,
  Netflix: 75,
  Games: 70,
  Instagram: 60,
  X: 32,
  Reddit: 30,
};

// Per-app averages cannot simply be summed: each is conditioned on being a daily
// user of that app, and total social time (~2h21m) is far below the sum of the
// big three. So we decay each additional app — the heaviest counts fully, the
// rest progressively less. Picking all seven lands ~4h25m, which sits sensibly
// under the 4-5h total-phone-time figure rather than above it.
const OVERLAP_DECAY = [1, 0.7, 0.55, 0.45, 0.35, 0.3, 0.25];
// Shown when the user skips app selection: the reported all-in social average.
const SOCIAL_AVERAGE_MINUTES = 141;

function estimateDailyMinutes(selected: string[]): number {
  if (selected.length === 0) return roundToQuarterHour(SOCIAL_AVERAGE_MINUTES);
  const weights = selected
    .map((a) => APP_MINUTES[a] ?? 45)
    .sort((a, b) => b - a);
  const total = weights.reduce(
    (sum, mins, i) => sum + mins * (OVERLAP_DECAY[i] ?? OVERLAP_DECAY[OVERLAP_DECAY.length - 1]),
    0
  );
  return roundToQuarterHour(total);
}

// A precise-looking 2h 59m reads as arithmetic; 3h reads as a fact. Snapping to
// the quarter hour keeps the headline blunt, and the estimate is nowhere near
// precise enough for the spare minutes to have meant anything anyway.
function roundToQuarterHour(minutes: number): number {
  return Math.round(minutes / 15) * 15;
}
const GOAL_KEYS = ['ob.goalTravel', 'ob.goalLove', 'ob.goalWork', 'ob.goalBrain'] as const;

// Daypart → the hour the daily nudge fires (relift's v22 mapping: remind at the
// moment the USER named, never a default morning slot).
type Daypart = 'morning' | 'midday' | 'evening';
const DAYPARTS: { key: Daypart; label: `ob.when${'Morning' | 'Midday' | 'Evening'}`; hour: number }[] = [
  { key: 'morning', label: 'ob.whenMorning', hour: 9 },
  { key: 'midday', label: 'ob.whenMidday', hour: 12 },
  { key: 'evening', label: 'ob.whenEvening', hour: 18 },
];

// A full cycle should finish inside the time someone spends reading the hook.
// At six packs, 1500ms lands the whole set in ~9s. The fade tightens with it so
// the word still holds ~1s fully settled rather than being in motion half the
// time.
const HOOK_ROTATE_MS = 1500;
const HOOK_FADE_MS = 260;

// The hook is step 0 — the user hasn't picked a language yet, so the headline
// rotates through what we actually teach, same beat as the web landing hero.
// Driven off availableLanguages() (the content registry), so a new pack joins
// the rotation on its own and we never advertise a language we can't teach.
//
// Only the language word cross-fades; the rest of the sentence holds still.
// We get the prefix/suffix by interpolating a sentinel into the ALREADY
// TRANSLATED string and splitting on it, so each locale keeps its own word
// order for free — English breaks as "…teach you |German|.", German as
// "…bringt dir jetzt |Deutsch| bei." No per-locale layout knowledge needed.
const LANG_SLOT = '\u0000';
function RotatingHook() {
  const t = useT();
  // Same filter as the picker two steps later: never promise to teach someone
  // the language their phone is already in.
  const langs = learnableLanguages(resolvedLocale());
  // Start somewhere random so the language a given user sees first isn't always
  // whichever pack happens to sit first in the registry. Someone who taps
  // through in four seconds only ever sees two or three of them, and this is
  // what spreads that exposure across the catalogue instead of favouring one.
  const [i, setI] = useState(() => Math.floor(Math.random() * Math.max(1, langs.length)));
  const [reduceMotion, setReduceMotion] = useState(false);
  const opacity = useSharedValue(1);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((on) => alive && setReduceMotion(on));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  const advance = useCallback(() => {
    setI((v) => (v + 1) % langs.length);
    opacity.value = withTiming(1, { duration: HOOK_FADE_MS });
  }, [langs.length, opacity]);

  useEffect(() => {
    // Nothing to rotate through until a second pack ships — don't run a timer.
    if (langs.length < 2) return;
    const id = setInterval(() => {
      if (reduceMotion) {
        setI((v) => (v + 1) % langs.length);
        return;
      }
      opacity.value = withTiming(0, { duration: HOOK_FADE_MS }, (done) => {
        if (done) runOnJS(advance)();
      });
    }, HOOK_ROTATE_MS);
    return () => clearInterval(id);
  }, [langs.length, reduceMotion, advance, opacity]);

  const fade = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const word = t(`lang.${langs[i] ?? 'de'}` as StringKey);
  // Split the translated sentence around the slot the language sits in. A locale
  // that drops the placeholder still renders: suffix falls back to empty and the
  // word simply trails the line rather than throwing.
  const [prefix, suffix = ''] = t('ob.hookTitle', { lang: LANG_SLOT }).split(LANG_SLOT);

  // Language names differ in length, so the sentence can gain a line as it
  // rotates and shove the CTA down mid-fade. An invisible copy built from the
  // longest name holds the box at its worst case; the live line sits on top.
  const longest = langs
    .map((l) => t(`lang.${l}` as StringKey))
    .reduce((a, b) => (b.length > a.length ? b : a), '');

  return (
    <View>
      <Text variant="hero" style={{ marginTop: space.md, opacity: 0 }} accessibilityElementsHidden>
        {t('ob.hookTitle', { lang: longest })}
      </Text>
      <View style={StyleSheet.absoluteFill}>
        <Text variant="hero" style={{ marginTop: space.md }} accessibilityLabel={prefix + word + suffix}>
          {prefix}
          <Animated.Text style={fade}>{word}</Animated.Text>
          {suffix}
        </Text>
      </View>
    </View>
  );
}

// ── shared bits ────────────────────────────────────────────────────────────

function OptionRow({
  label,
  selected,
  disabled,
  tag,
  onPress,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  tag?: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.option,
        {
          backgroundColor: selected ? withAlpha(theme.accent, 0.10) : theme.fill,
          borderColor: selected ? theme.accent : theme.line,
          opacity: disabled ? 0.45 : 1,
        },
      ]}
    >
      <Text variant="bodyMedium" style={{ color: selected ? theme.accent : theme.ink, flex: 1 }}>
        {label}
      </Text>
      {tag ? (
        <Text variant="caption" color="inkFaint" style={{ letterSpacing: 1 }}>
          {tag}
        </Text>
      ) : selected ? (
        <Ionicons name="checkmark-circle" size={20} color={theme.accent} />
      ) : null}
    </PressableScale>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? withAlpha(theme.accent, 0.12) : theme.fill,
          borderColor: selected ? theme.accent : theme.line,
        },
      ]}
    >
      <Text variant="bodyMedium" style={{ color: selected ? theme.accent : theme.ink }}>
        {label}
      </Text>
    </PressableScale>
  );
}

function HowRow({ icon, title, detail }: { icon: any; title: string; detail: string }) {
  const theme = useTheme();
  return (
    <View style={styles.howRow}>
      <View
        style={[
          styles.howIcon,
          { backgroundColor: withAlpha(theme.accent, 0.10), borderColor: withAlpha(theme.accent, 0.3) },
        ]}
      >
        <Ionicons name={icon} size={20} color={theme.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodyMedium">{title}</Text>
        <Text variant="callout" color="inkSoft" style={{ marginTop: 1 }}>
          {detail}
        </Text>
      </View>
    </View>
  );
}

// ── the flow ───────────────────────────────────────────────────────────────

export default function Onboarding() {
  const theme = useTheme();
  const t = useT();

  // DEV ?step= jumps straight to any step (QA / store shoots — relift's rig):
  // langtoll:///onboarding?step=paywall. Ignored entirely in production builds.
  const jump = useLocalSearchParams<{ step?: string }>().step;
  const [stepIdx, setStepIdx] = useState(() => {
    if (process.env.EXPO_PUBLIC_DEV_TOOLS === '1' && jump) {
      const i = STEPS.indexOf(jump as Step);
      if (i >= 0) return i;
    }
    return 0;
  });

  // answers
  const [name, setName] = useState('');
  // Default to the first language we'd actually offer this user. Hardcoding
  // 'de' would leave a German-UI user pre-selected on a language the picker
  // (correctly) refuses to show them.
  const [language, setLanguage] = useState<Language>(
    () => learnableLanguages(resolvedLocale())[0] ?? 'de'
  );
  // The step list adapts to the chosen language: the speaker-forms question
  // only exists where the language HAS speaker-gendered forms — a German
  // learner once got a Portuguese grammar lesson here.
  const steps = (SPEAKER_FORM_EXAMPLES[language ?? 'de']
    ? STEPS
    : STEPS.filter((x) => x !== 'forms')) as readonly Step[];
  const step: Step = steps[stepIdx];
  const [difficulty, setDifficulty] = useState(3);
  const [apps, setApps] = useState<string[]>(['TikTok', 'Instagram']);
  const [goal, setGoal] = useState<string | null>(null);
  const [forms, setForms] = useState<'m' | 'f' | null>(null);
  const [daypart, setDaypart] = useState<Daypart | null>(null);
  const [fareEx, setFareEx] = useState(5);
  const [fareMin, setFareMin] = useState(30);
  const [lockReady, setLockReady] = useState(false);

  // printing-step: two cosmetic beats, then the REAL work — downloading the
  // chosen language's studio audio. The step does not advance until the pack
  // is on the device: install-time connectivity is guaranteed (you cannot get
  // the app without internet), so the first session never falls back to the
  // robot TTS voice. Founder decision, 2026-08-08.
  const [printStage, setPrintStage] = useState(0);
  const [audioPct, setAudioPct] = useState(0);
  useEffect(() => {
    if (step !== 'printing') return;
    let cancelled = false;
    setPrintStage(0);
    setAudioPct(0);
    const t1 = setTimeout(() => setPrintStage(1), 800);
    const t2 = setTimeout(() => setPrintStage(2), 1700);
    (async () => {
      try {
        const lvl = levelForDifficulty(difficulty);
        const pack = packFor(language ?? 'de', lvl);
        await downloadPackAudio(
          pack.vocab.map((v) => v.de),
          pack.sentences.map((x) => x.de),
          pack.language,
          (done, totalFiles) => {
            if (!cancelled) setAudioPct(Math.round((100 * done) / totalFiles));
          }
        );
      } catch {
        // network died mid-download — background prefetch heals the gap later
      }
      if (cancelled) return;
      setPrintStage(3);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setStepIdx((i) => i + 1), 500);
    })();
    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [step]);

  const firstName = name.trim().split(/\s+/)[0] || null;
  const dailyMinutes = estimateDailyMinutes(apps);
  const dailyH = Math.floor(dailyMinutes / 60);
  const dailyM = dailyMinutes % 60;
  const daysPerYear = Math.round((dailyMinutes * 365) / 1440);

  // 'paywall' skips via the header — a quiet exit in the corner instead of a
  // "Maybe later" advertised under the CTA (relift dropped theirs for the same
  // reason: the exit must exist, not be promoted).
  const skippable: Step[] = ['name', 'apps', 'when', 'goal', 'forms', 'paywall'];
  const showSkip = skippable.includes(step);
  const progress = stepIdx / (STEPS.length - 1);

  function next() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  }
  function back() {
    if (stepIdx === 0) return;
    setStepIdx((i) => i - 1);
  }
  const derivedLevel = levelForDifficulty(difficulty);
  const pack = packFor(language, derivedLevel);
  const lang = t(`lang.${language}` as StringKey);

  function finish() {
    const nudgeHour = DAYPARTS.find((d) => d.key === daypart)?.hour ?? null;
    updateProfile({
      onboarded: true,
      name: firstName,
      learningLanguage: language,
      difficulty,
      level: derivedLevel,
      blockedApps: apps,
      goal,
      forms,
      nudgeHour,
      exercisesPerUnlock: fareEx,
      unlockMinutes: fareMin,
    });
    // The goal's session pack generates in the background while the user
    // finishes the paywall/lock steps — first session already carries it.
    void refreshGoalPack();
    // At the hour THEY named — permission was just granted (or denied) during
    // lock setup, and the scheduler quietly no-ops without it.
    void scheduleDailyNudge(nudgeHour);
    lockNow(); // shield the chosen apps immediately so home lands in the "locked" state
    track('onboarded', { language, level: derivedLevel, difficulty });
    router.replace('/');
  }

  const printLines = [
    t('ob.print1'),
    t('ob.print2'),
    audioPct < 100 ? t('ob.printAudio', { pct: audioPct }) : t('ob.printAudioDone'),
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={step === 'paywall' || step === 'summary' ? 0.7 : 0.35} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* header: back + progress + skip */}
          <View style={styles.header}>
            <PressableScale onPress={back} style={styles.headerBtn} haptic={null}>
              {stepIdx > 0 && step !== 'printing' ? (
                <Ionicons name="arrow-back" size={20} color={theme.inkSoft} />
              ) : null}
            </PressableScale>
            <View style={[styles.track, { backgroundColor: theme.fillStrong }]}>
              <View
                style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: theme.accent }]}
              />
            </View>
            <PressableScale onPress={next} style={styles.headerBtn} haptic={null}>
              {showSkip ? (
                <Text variant="label" color="inkFaint">
                  {t('common.skip')}
                </Text>
              ) : null}
            </PressableScale>
          </View>

          <View style={styles.body}>
            {step === 'hook' && (
              <Entrance key="hook">
                <Text variant="overline" color="accent">
                  LangToll
                </Text>
                <RotatingHook />
                <Text variant="serif" color="inkSoft" style={{ marginTop: space.lg }}>
                  {t('ob.hookSub')}
                </Text>
                {/* Tolly greets under the copy, matching the mirror step's composition —
                    a still portrait (relift's lesson: motion on the hook reads as gimmick). */}
                <Tolly mood="happy" size={132} style={{ alignSelf: 'center', marginTop: space.xxl }} />
              </Entrance>
            )}

            {step === 'how' && (
              <Entrance key="how">
                <Text variant="title">{t('ob.howTitle')}</Text>
                <View style={{ marginTop: space.xl, gap: space.lg }}>
                  <HowRow icon="lock-closed" title={t('ob.how1')} detail={t('ob.how1d')} />
                  <HowRow icon="flash" title={t('ob.how2')} detail={t('ob.how2d')} />
                  <HowRow icon="time" title={t('ob.how3')} detail={t('ob.how3d')} />
                </View>
              </Entrance>
            )}

            {step === 'name' && (
              <Entrance key="name">
                <Text variant="title">{t('ob.nameTitle')}</Text>
                <Text variant="callout" color="inkSoft" style={{ marginTop: space.sm }}>
                  {t('ob.nameSub')}
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholder={t('ob.namePlaceholder')}
                  placeholderTextColor={theme.inkFaint}
                  selectionColor={theme.accent}
                  keyboardAppearance="dark"
                  onSubmitEditing={() => next()}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.fill,
                      borderColor: theme.line,
                      color: theme.ink,
                    },
                  ]}
                />
              </Entrance>
            )}

            {step === 'language' && (
              <Entrance key="language">
                <Text variant="title">{t('ob.langTitle')}</Text>
                <View style={{ marginTop: space.xl, gap: space.sm }}>
                  {learnableLanguages(resolvedLocale()).map((l) => (
                    <OptionRow
                      key={l}
                      label={t(`lang.${l}` as StringKey)}
                      selected={l === language}
                      onPress={() => setLanguage(l)}
                    />
                  ))}
                  {soonLanguages(resolvedLocale()).map((l) => (
                    <OptionRow
                      key={l}
                      label={t(`lang.${l}` as StringKey)}
                      selected={false}
                      disabled
                      tag={t('ob.soon')}
                      onPress={() => {}}
                    />
                  ))}
                </View>
              </Entrance>
            )}

            {step === 'difficulty' && (
              <Entrance key="difficulty">
                <Text variant="title">{t('ob.diffTitle')}</Text>
                <Text variant="callout" color="inkSoft" style={{ marginTop: space.sm }}>
                  {t('ob.diffSub')}
                </Text>
                <View style={styles.diffRow}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((d) => (
                    <PressableScale
                      key={d}
                      haptic={null}
                      onPress={() => setDifficulty(d)}
                      style={[
                        styles.diffDot,
                        {
                          backgroundColor:
                            d <= difficulty ? withAlpha(theme.accent, 0.16) : theme.fill,
                          borderColor: d <= difficulty ? theme.accent : theme.line,
                        },
                      ]}
                    >
                      {d === difficulty && (
                        <View style={[styles.diffCore, { backgroundColor: theme.accent }]} />
                      )}
                    </PressableScale>
                  ))}
                </View>
                <View style={styles.diffLabels}>
                  <Text variant="caption" color="inkFaint">
                    {t('ob.diffEasier')}
                  </Text>
                  <Text variant="caption" color="inkFaint">
                    {t('ob.diffHarder')}
                  </Text>
                </View>
                <View style={[styles.levelBadge, { borderColor: withAlpha(theme.accent, 0.4), backgroundColor: withAlpha(theme.accent, 0.08) }]}>
                  <Text variant="label" style={{ color: theme.accent }}>
                    {t('ob.diffLevel', { level: derivedLevel })}
                  </Text>
                </View>
              </Entrance>
            )}

            {step === 'apps' && (
              <Entrance key="apps">
                <Text variant="title">{t('ob.appsTitle')}</Text>
                <Text variant="callout" color="inkSoft" style={{ marginTop: space.sm }}>
                  {t('ob.appsSub')}
                </Text>
                <View style={styles.chipWrap}>
                  {APPS.map((a) => (
                    <Chip
                      key={a}
                      label={a}
                      selected={apps.includes(a)}
                      onPress={() =>
                        setApps((cur) =>
                          cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]
                        )
                      }
                    />
                  ))}
                </View>
              </Entrance>
            )}

            {step === 'mirror' && (
              <Entrance key="mirror">
                <Text variant="overline" color="danger">
                  {t('ob.mirrorOver')}
                </Text>
                <Text variant="hero" style={{ marginTop: space.md, fontSize: 56, lineHeight: 60 }}>
                  {dailyH ? `${dailyH}h` : ''}
                  {dailyH && dailyM ? ' ' : ''}
                  {dailyM ? `${dailyM}m` : ''}
                </Text>
                <Text variant="title" style={{ marginTop: space.md }}>
                  {firstName
                    ? t('ob.mirrorTitleNamed', { name: firstName })
                    : t('ob.mirrorTitle')}
                </Text>
                <Text variant="serif" color="inkSoft" style={{ marginTop: space.lg }}>
                  {t('ob.mirrorSub', { days: daysPerYear, lang })}
                </Text>
                <Text variant="caption" color="inkFaint" style={{ marginTop: space.md }}>
                  {t('ob.mirrorNote')}
                </Text>
                {/* The operator takes the damage personally. */}
                <Tolly mood="sad" size={104} style={{ alignSelf: 'center', marginTop: space.xl }} />
              </Entrance>
            )}

            {step === 'when' && (
              <Entrance key="when">
                <Text variant="title">{t('ob.whenTitle')}</Text>
                <View style={{ marginTop: space.xl, gap: space.sm }}>
                  {DAYPARTS.map((d) => (
                    <OptionRow
                      key={d.key}
                      label={t(d.label)}
                      selected={daypart === d.key}
                      onPress={() => setDaypart(d.key)}
                    />
                  ))}
                </View>
              </Entrance>
            )}

            {step === 'fare' && (
              <Entrance key="fare">
                <Text variant="title">{t('ob.fareTitle')}</Text>
                <Text variant="callout" color="inkSoft" style={{ marginTop: space.sm }}>
                  {t('ob.fareSub')}
                </Text>
                <Text variant="overline" color="inkFaint" style={{ marginTop: space.xl }}>
                  {t('ob.fareEx')}
                </Text>
                <View style={styles.chipWrap}>
                  {FARE_EXERCISES.map((n) => (
                    <Chip key={n} label={`${n}`} selected={fareEx === n} onPress={() => setFareEx(n)} />
                  ))}
                </View>
                <Text variant="overline" color="inkFaint" style={{ marginTop: space.lg }}>
                  {t('ob.fareMin')}
                </Text>
                <FareSlider
                  value={fareMin}
                  min={FARE_MINUTES_MIN}
                  max={FARE_MINUTES_MAX}
                  step={FARE_MINUTES_STEP}
                  onChange={setFareMin}
                  format={(n) => t('settings.fareMinValue', { min: n })}
                  minLabel={t('settings.fareMinValue', { min: FARE_MINUTES_MIN })}
                  maxLabel={t('settings.fareMinValue', { min: FARE_MINUTES_MAX })}
                />
              </Entrance>
            )}

            {step === 'goal' && (
              <Entrance key="goal">
                <Text variant="title">{t('ob.goalTitle', { lang })}</Text>
                <View style={{ marginTop: space.xl, gap: space.sm }}>
                  {GOAL_KEYS.map((k) => (
                    <OptionRow
                      key={k}
                      label={t(k)}
                      selected={goal === k}
                      onPress={() => setGoal(k)}
                    />
                  ))}
                </View>
                {/* A typed goal ("Pass the B1 exam") gears every AI-generated
                    pack toward it — the chips only flavor the copy. Chip and
                    text are one field: typing replaces the chip, tapping a
                    chip replaces the text, and t() renders both (unknown keys
                    pass through verbatim). */}
                <TextInput
                  value={goal && !GOAL_KEYS.includes(goal as (typeof GOAL_KEYS)[number]) ? goal : ''}
                  onChangeText={(text) => setGoal(text || null)}
                  placeholder={t('ob.goalCustom')}
                  placeholderTextColor={theme.inkFaint}
                  style={[styles.input, { borderColor: theme.line, color: theme.ink, marginTop: space.md }]}
                  maxLength={120}
                  returnKeyType="done"
                />
              </Entrance>
            )}

            {/* Speaker-gendered forms (pt obrigado/obrigada, es encantado/a …):
                asked as a GRAMMAR question, never an identity one. Skipping or
                "both" keeps every variant with its "(said by men/women)" note.
                The teacher's voice is the same in all three cases. */}
            {step === 'forms' && (
              <Entrance key="forms">
                <Text variant="title">{t('ob.formsTitle')}</Text>
                <Text variant="callout" color="inkSoft" style={{ marginTop: space.sm }}>
                  {t('ob.formsSub', {
                    m: SPEAKER_FORM_EXAMPLES[language ?? 'de']?.m ?? '',
                    f: SPEAKER_FORM_EXAMPLES[language ?? 'de']?.f ?? '',
                  })}
                </Text>
                <View style={{ marginTop: space.xl, gap: space.sm }}>
                  <OptionRow
                    label={t('ob.formsM', { m: SPEAKER_FORM_EXAMPLES[language ?? 'de']?.m ?? '' })}
                    selected={forms === 'm'}
                    onPress={() => setForms('m')}
                  />
                  <OptionRow
                    label={t('ob.formsF', { f: SPEAKER_FORM_EXAMPLES[language ?? 'de']?.f ?? '' })}
                    selected={forms === 'f'}
                    onPress={() => setForms('f')}
                  />
                  <OptionRow label={t('ob.formsBoth')} selected={forms === null} onPress={() => setForms(null)} />
                </View>
              </Entrance>
            )}

            {step === 'printing' && (
              <View style={styles.printWrap}>
                <Entrance key="printing">
                  <Text variant="overline" color="accent" center>
                    {t('ob.printOver')}
                  </Text>
                  <Text variant="title" center style={{ marginTop: space.md }}>
                    {firstName
                      ? t('ob.printTitleNamed', { name: firstName })
                      : t('ob.printTitle')}
                  </Text>
                  <View style={{ marginTop: space.xxl, gap: space.md, alignSelf: 'center' }}>
                    {printLines.map((line, i) => (
                      <View key={line} style={styles.printRow}>
                        <Ionicons
                          name={i < printStage ? 'checkmark-circle' : 'ellipse-outline'}
                          size={18}
                          color={i < printStage ? theme.accent : theme.inkFaint}
                        />
                        <Text
                          variant="bodyMedium"
                          style={{ color: i <= printStage ? theme.ink : theme.inkFaint }}
                        >
                          {line}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Entrance>
              </View>
            )}

            {step === 'summary' && (
              <Entrance key="summary">
                <Text variant="overline" color="accent">
                  {firstName ? t('ob.sumOverNamed', { name: firstName }) : t('ob.sumOver')}
                </Text>
                <Text variant="title" style={{ marginTop: space.sm }}>
                  {t('ob.sumTitle')}
                </Text>
                <View style={{ marginTop: space.xl }}>
                  <PassCard
                    state="void"
                    unlockMinutes={fareMin}
                    exercisesPerUnlock={fareEx}
                    packLabel={`${pack.language.toUpperCase()} · ${derivedLevel}`}
                    serial={0}
                    passenger={firstName}
                  />
                </View>
                <View style={{ marginTop: space.lg, gap: 6 }}>
                  <Text variant="callout" color="inkSoft">
                    •{' '}
                    {apps.length
                      ? t('ob.sumApps', {
                          count: apps.length,
                          list: `${apps.slice(0, 3).join(', ')}${apps.length > 3 ? '…' : ''}`,
                        })
                      : t('ob.sumAppsNone')}
                  </Text>
                  <Text variant="callout" color="inkSoft">
                    • {t('ob.sumFare', { ex: fareEx, min: fareMin })}
                  </Text>
                  <Text variant="callout" color="inkSoft">
                    • {difficulty <= 3 ? t('ob.sumFromZero', { lang }) : t('ob.sumFromBasics', { lang })}
                  </Text>
                </View>
              </Entrance>
            )}

            {step === 'paywall' && (
              <View style={{ flex: 1 }}>
                <Text variant="overline" color="accent">
                  {t('ob.payOver')}
                </Text>
                <Text variant="headline" style={{ marginTop: space.xs }}>
                  {firstName
                    ? t('ob.payTitleNamed', { name: firstName, lang })
                    : t('ob.payTitle', { lang })}
                </Text>
                {/* Quote the dream back (relift's move): their own answer, at the moment of the ask. */}
                {goal && (
                  <Text variant="callout" color="inkSoft" style={{ marginTop: space.sm }}>
                    {t('ob.payDream', { goal: t(goal as StringKey) })}
                  </Text>
                )}
                <View style={{ marginTop: space.lg, flex: 1 }}>
                  <PlusOffer onDone={next} />
                </View>
              </View>
            )}

            {step === 'lock' && (
              <Entrance key="lock">
                <Text variant="overline" color="accent">
                  {t('ob.lockOver')}
                </Text>
                <Text variant="title" style={{ marginTop: space.sm }}>
                  {t('ob.lockTitle')}
                </Text>
                <Text variant="serif" color="inkSoft" style={{ marginTop: space.md }}>
                  {t('ob.lockSub')}
                </Text>
                <View style={{ marginTop: space.xl }}>
                  <LockSetup apps={apps} onReady={setLockReady} />
                </View>
              </Entrance>
            )}
          </View>

          {/* footer CTA (paywall provides its own via PlusOffer) */}
          {step !== 'printing' && step !== 'paywall' && (
            <View style={styles.footer}>
              <Button
                label={
                  step === 'hook'
                    ? t('ob.hookCta')
                    : step === 'mirror'
                      ? t('ob.mirrorCta')
                      : step === 'summary'
                        ? t('ob.sumCta')
                        : step === 'lock'
                          ? lockReady
                            ? t('ob.lockCta')
                            : t('ob.lockCtaWait')
                          : t('common.continue')
                }
                glow
                full
                disabled={step === 'lock' && !lockReady}
                onPress={step === 'lock' ? finish : next}
              />
            </View>
          )}
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
    gap: space.md,
  },
  headerBtn: { width: 48, height: 40, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 3, borderRadius: 1.5, overflow: 'hidden' },
  fill: { height: 3, borderRadius: 1.5 },
  body: { flex: 1, paddingHorizontal: space.xl, paddingTop: space.xxl },
  footer: { paddingHorizontal: space.xl, paddingBottom: space.lg, gap: space.sm },
  option: {
    minHeight: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    gap: space.sm,
  },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginTop: space.md,
  },
  input: {
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: space.lg,
    fontFamily: font.body,
    fontSize: 18,
    marginTop: space.xl,
  },
  howRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  howIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  printWrap: { flex: 1, justifyContent: 'center', paddingBottom: 80 },
  printRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  ghostLink: { paddingVertical: space.sm },
  diffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space.xxl,
  },
  diffDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffCore: { width: 12, height: 12, borderRadius: 6 },
  diffLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space.sm,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: space.xl,
  },
});
