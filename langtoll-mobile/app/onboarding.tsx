// Onboarding — the fare-gate flow. One route, a step machine, instant transitions.
// Structure follows the converting-onboarding playbook: hook → mechanic → questions
// (name first, used everywhere after) → emotional mirror → plan-printing loading →
// personalized summary → transformation paywall. Skip on every optional step.
// All copy via lib/i18n; target-language flavor comes from the content pack.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  AppState,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { PassCard } from '@/components/pass/PassCard';
import { Entrance } from '@/components/ui/Entrance';
import { PressableScale } from '@/components/ui/PressableScale';
import { Chip } from '@/components/ui/Chip';
import { OptionRow } from '@/components/ui/OptionRow';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { LockSetup } from '@/components/blocking/LockSetup';
import { lockNow } from '@/lib/blocking';
import {
  scheduleDailyNudge,
  scheduleTrialEndNotice,
  requestNotificationPermission,
  notificationPermissionState,
  openSystemSettings,
} from '@/lib/notify';
import { Tolly } from '@/components/ui/Tolly';
import { ShieldPreview, PHONE_ASPECT } from '@/components/onboarding/ShieldPreview';
import { useTheme, space, radius, font } from '@/design/theme';
import { useLayout, band, opticalBias, opticalCenter } from '@/design/layout';
import { withAlpha } from '@/lib/color';
import { levelForDifficulty, localizePack } from '@/lib/pack';
import { estimateDailyMinutes, damage, projection, HORIZON_YEARS } from '@/lib/projection';
import { learnableLanguages, soonLanguages, packFor } from '@/content';
import type { Language } from '@/content/german/types';
import { updateProfile, getState, saveOnboardingDraft, startPreview } from '@/lib/store';
import { refreshGoalPack } from '@/lib/ai/topics';
import {
  SPEAKER_FORM_EXAMPLES,
  FARE_EXERCISES,
  FARE_MINUTE_STOPS,
  FREE_FARE_EXERCISES,
  FREE_FARE_MINUTES,
  FREE_LEVELS,
  TRIAL_DAYS,
  freeExercises,
  freeMinutes,
  expressWillApply,
  expressEndsWeekday,
} from '@/lib/plans';
import { FareDial } from '@/components/ui/FareDial';
import { formatDuration } from '@/lib/format';
import { DifficultyScale } from '@/components/ui/DifficultyScale';
import { track } from '@/lib/telemetry';
import { useT, resolvedLocale, type StringKey } from '@/lib/i18n';
import { LOCALE_ENDONYMS } from '@/lib/locales';

import { STEPS, STEP_ORDER, stepsFor, resumeIndex, type Step } from '@/lib/onboarding-steps';

const APPS = ['TikTok', 'Instagram', 'YouTube', 'Reddit', 'X', 'Games', 'Netflix'];
/** The languages people usually come for that the picker does not have, in their own names. */
const OTHER_LANGUAGES = ['日本語', '한국어', '中文', 'العربية', 'Русский', 'Türkçe', 'Nederlands', 'Polski'];

// The damage and the other side are computed in lib/projection.ts (pure,
// tested); this screen only shows the numbers.
const GOAL_KEYS = ['ob.goalTravel', 'ob.goalLove', 'ob.goalWork', 'ob.goalBrain'] as const;

// Daypart → the hour the daily nudge fires (relift's v22 mapping: remind at the
// moment the USER named, never a default morning slot).
type Daypart = 'morning' | 'midday' | 'evening';
const DAYPARTS: { key: Daypart; label: `ob.when${'Morning' | 'Midday' | 'Evening'}`; hour: number }[] = [
  { key: 'morning', label: 'ob.whenMorning', hour: 9 },
  { key: 'midday', label: 'ob.whenMidday', hour: 12 },
  { key: 'evening', label: 'ob.whenEvening', hour: 18 },
];

// ── shared bits ────────────────────────────────────────────────────────────

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

// The pitch for notification permission, shown on the lock step: the shield's
// "Practice now" button reaches the user THROUGH a notification (a
// ShieldActionExtension cannot open its app — see lib/notify.ts), so a denial
// quietly breaks the core loop. The card makes the case before the system
// prompt appears (LockSetup fires it right after Screen Time auth), reflects a
// grant, and — since iOS never re-prompts — routes an "asked and denied" state
// to Settings instead.
function NotifyNudge() {
  const theme = useTheme();
  const t = useT();
  const [perm, setPerm] = useState<{ granted: boolean; canAskAgain: boolean } | null>(null);
  const refresh = useCallback(() => {
    void notificationPermissionState().then(setPerm);
  }, []);
  useEffect(() => {
    refresh();
    // Re-check on foreground: the user may return from the system prompt,
    // Screen Time's sheet, or the Settings toggle this card points at.
    const sub = AppState.addEventListener('change', (s) => s === 'active' && refresh());
    return () => sub.remove();
  }, [refresh]);

  if (!perm) return null;

  if (perm.granted) {
    return (
      <View
        style={[
          styles.notifyDone,
          { backgroundColor: withAlpha(theme.accent, 0.10), borderColor: theme.accent },
        ]}
      >
        <Ionicons name="checkmark-circle" size={22} color={theme.accent} />
        <Text variant="bodyMedium" style={{ flex: 1, color: theme.accent }}>
          {t('ob.notifyOn')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.notifyCard, { backgroundColor: theme.fill, borderColor: theme.line }]}>
      <View style={styles.notifyHead}>
        <Ionicons name="notifications" size={18} color={theme.accent} />
        <Text variant="bodyMedium" style={{ flex: 1 }}>
          {t('ob.notifyTitle')}
        </Text>
      </View>
      <Text variant="callout" color="inkSoft" style={{ marginTop: space.xs }}>
        {t('ob.notifyBody')}
      </Text>
      <Button
        label={perm.canAskAgain ? t('ob.notifyCta') : t('ob.notifySettings')}
        variant="ghost"
        full
        style={{ marginTop: space.md }}
        onPress={async () => {
          if (perm.canAskAgain) {
            await requestNotificationPermission();
            refresh();
          } else {
            openSystemSettings();
          }
        }}
      />
    </View>
  );
}

// ── the flow ───────────────────────────────────────────────────────────────

export default function Onboarding() {
  const theme = useTheme();
  const L = useLayout();
  const t = useT();

  // DEV ?step= jumps straight to any step (QA / store shoots — relift's rig):
  // langtoll:///onboarding?step=paywall. Ignored entirely in production builds.
  const jump = useLocalSearchParams<{ step?: string }>().step;
  // Unfinished onboarding from a previous launch: answers and screen come back,
  // so leaving the paywall to think no longer costs the whole questionnaire.
  const draft = useRef(getState().onboardingDraft).current;
  const [stepIdx, setStepIdx] = useState(() => {
    if (process.env.EXPO_PUBLIC_DEV_TOOLS === '1' && jump) {
      const i = STEPS.indexOf(jump as Step);
      if (i >= 0) return i;
    }
    return draft ? resumeIndex(draft, stepsFor(draft.language)) : 0;
  });

  // answers
  const [name, setName] = useState(draft?.name ?? '');
  // Default to the first language we'd actually offer this user. Hardcoding
  // 'de' would leave a German-UI user pre-selected on a language the picker
  // (correctly) refuses to show them.
  const [language, setLanguage] = useState<Language>(
    () => draft?.language ?? learnableLanguages(resolvedLocale())[0] ?? 'de'
  );
  const steps = stepsFor(language);
  const step: Step = steps[stepIdx];

  // Funnel visibility (relift's capture_step pattern): one event per screen
  // actually SEEN, including the initial hook — this is how we learn where
  // people stop instead of guessing. Early on, every lost step matters.
  // The first step seen after a relaunch carries resumed: true, so the funnel
  // can tell a comeback from a fresh walk.
  // `from` is the screen before this one, so the funnel can tell a back tap from a
  // forward one; `language` is the course chosen so far, so an exit on or after the
  // language screen says which course the person was looking at when they left.
  const resumedRef = useRef(!!draft && stepIdx > 0);
  const prevStepRef = useRef<Step | null>(null);
  useEffect(() => {
    const from = prevStepRef.current;
    track('onboarding_step', {
      step,
      ...(from ? { from } : {}),
      language,
      ...(resumedRef.current ? { resumed: true } : {}),
    });
    resumedRef.current = false;
    prevStepRef.current = step;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  // "Another language?" on the picker: open, which one, and the free field.
  const [langOtherOpen, setLangOtherOpen] = useState(false);
  const [langWanted, setLangWanted] = useState<string | null>(null);
  const [langOtherText, setLangOtherText] = useState('');
  function wantLanguage(name: string) {
    setLangWanted(name);
    track('language_wanted', { lang: name.slice(0, 40) });
  }
  const [difficulty, setDifficulty] = useState(draft?.difficulty ?? 3);
  const [apps, setApps] = useState<string[]>(draft?.apps ?? ['TikTok', 'Instagram']);
  const [goal, setGoal] = useState<string | null>(draft?.goal ?? null);
  const [forms, setForms] = useState<'m' | 'f' | null>(draft?.forms ?? null);
  const goalScrollRef = useRef<ScrollView>(null);
  const [daypart, setDaypart] = useState<Daypart | null>((draft?.daypart as Daypart | null) ?? null);
  const [fareEx, setFareEx] = useState(draft?.fareEx ?? 5);
  const [fareMin, setFareMin] = useState(draft?.fareMin ?? 30);
  // The custom-goal field has the keyboard: the suggestion rows step aside
  // until it is dismissed, so field, keyboard and CTA are all that is on
  // screen (2026-09-25: the four rows, the field and the CTA fought for the
  // half a screen the keyboard leaves).
  const [goalTyping, setGoalTyping] = useState(false);

  // Save as they go. Debounced so a slider drag is one write, not fifty; the
  // finished flag stops a late write from resurrecting the draft after finish().
  const finishedRef = useRef(false);
  useEffect(() => {
    if (finishedRef.current) return;
    const id = setTimeout(() => {
      if (finishedRef.current) return;
      saveOnboardingDraft({ step, name, language, difficulty, apps, goal, forms, daypart, fareEx, fareMin, order: STEP_ORDER });
    }, 250);
    return () => clearTimeout(id);
  }, [step, name, language, difficulty, apps, goal, forms, daypart, fareEx, fareMin]);
  const [lockReady, setLockReady] = useState(false);

  // Which steps centre their body vertically.
  //
  // NOT the paywall: its content is a flex:1 View that must fill the body for
  // PlusOffer to pin its purchase controls to the bottom, and a paddingBottom
  // would just shorten it. (An earlier attempt wrapped the body's children to
  // measure them; the wrapper had no height, so that flex:1 collapsed and the
  // paywall step rendered BLANK. Nothing here may sit between the body and its
  // children again.)
  //
  // 'printing' centres at EVERY size — it is a 2.7s loading beat with no CTA,
  // and three ticking lines pinned to the top of an empty screen read as a
  // broken page rather than a pause. Everything else centres at iPad width in
  // BOTH orientations: the body scrolls, so a step taller than a short
  // landscape window scrolls instead of losing its top.
  const centreStep = step === 'printing' || L.regular;
  const centreStyle = { justifyContent: 'center' as const, paddingBottom: opticalBias(L) };

  // printing-step stage ticker — pure theater, and FAST: the paywall must
  // arrive without a download in front of it (founder call, 2026-08-08). The
  // real audio download runs during the LOCK step below, after the trial
  // decision — every path (trial or skip) passes through it,
  // so the first session still never falls back to the robot voice.
  const [printStage, setPrintStage] = useState(0);
  useEffect(() => {
    if (step !== 'printing') return;
    setPrintStage(0);
    const t1 = setTimeout(() => setPrintStage(1), 800);
    const t2 = setTimeout(() => setPrintStage(2), 1700);
    const t3 = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStepIdx((i) => i + 1);
    }, 2700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [step]);

  // No audio download here, and none anywhere else in onboarding. Builds up to
  // 21 pulled a whole level's audio on this step and disabled the finish button
  // until it landed — App Review rejected that under 4.2.3(ii) (a required
  // download whose size was never disclosed and which the user was never asked
  // about). Pronunciation audio is now fetched one file at a time as each
  // exercise needs it; see lib/audio-pack.ts. Nothing may gate onboarding on a
  // network fetch again.

  const firstName = name.trim().split(/\s+/)[0] || null;
  const dailyMinutes = estimateDailyMinutes(apps);
  const dailyH = Math.floor(dailyMinutes / 60);
  const dailyM = dailyMinutes % 60;
  const { daysPerYear, yearsLost, hoursPerYear, fluentHours } = damage(dailyMinutes, language);
  // The other side of the mirror, from the fare they just set (lib/projection.ts).
  const { faresPerDay, practiceMinutes, words30, level6, level12 } = projection(dailyMinutes, fareEx, fareMin);
  // The year-12 line follows the goal, which is asked just before these screens.
  const future12Key: StringKey =
    goal === 'ob.goalTravel'
      ? 'ob.future12Travel'
      : goal === 'ob.goalLove'
        ? 'ob.future12Love'
        : goal === 'ob.goalWork'
          ? 'ob.future12Work'
          : goal === 'ob.goalBrain'
            ? 'ob.future12Brain'
            : 'ob.future12Generic';

  // Since 1.0.8 there is no wall in here: onboarding ends at the lock and the
  // first fare is real and free (store.startPreview); the wall waits on home
  // until that pass runs out.
  const skippable: Step[] = ['name', 'apps', 'when', 'goal', 'forms'];
  const showSkip = skippable.includes(step);
  // Front-loaded: the early screens move the bar the most, where most people leave
  // (hook, name, language). Bars that run fast then slow cut drop-off; linear over
  // 18 steps barely moved at the start (Villar et al. 2013; conversion pass 2026-09-29).
  const progress = Math.pow(stepIdx / (steps.length - 1), 0.6);

  function next() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Leaving "when" with a time picked is the moment to ask for notifications: they
    // have just said when they want the nudge, so Apple's prompt reads as the obvious
    // next step. It is also the only way to reach someone who later leaves the
    // paywall (founder call, 2026-09-28). Skip = no time = no prompt.
    // No permission prompt here. Notifications are asked ONCE, on the lock step
    // after the app picker closes, where the screen has just explained what they
    // are for (the shield's button). Asked on "when", nobody knew why the app
    // wanted them (founder, 2026-10-04: "I wouldn't allow it at that step").
    setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  }

  // No way back from the lock: the plan is printed and the first fare is waiting.
  // The arrow hid itself on 'printing' only, so on launch day (2026-09-22) an ad
  // install tapped back from the end, landed on summary, tapped back again, and
  // was bounced by the loader five times.
  const canGoBack = stepIdx > 0 && step !== 'printing' && step !== 'lock';
  function back() {
    if (!canGoBack) return;
    setStepIdx((i) => {
      let j = i - 1;
      // 'printing' is a 2.7s loader that auto-advances to summary, so landing on
      // it from summary is a trap: back → printing → summary → back → … Skip it.
      while (j > 0 && steps[j] === 'printing') j -= 1;
      return j;
    });
  }
  const derivedLevel = levelForDifficulty(difficulty);
  const pack = packFor(language, derivedLevel);
  // The fare is played in the UI language's glosses, like a real session.
  // The hook's preview word: the first word of the course the picker will
  // preselect, glossed in the phone's language.
  const [hookSlotH, setHookSlotH] = useState(0);
  const previewWord = React.useMemo(() => {
    const course = learnableLanguages(resolvedLocale())[0] ?? 'de';
    const v = localizePack(packFor(course, 'A1'), resolvedLocale()).vocab[0];
    return { word: v?.de ?? 'hola', translation: v?.en?.[0] ?? 'hello' };
  }, []);
  const lang = t(`lang.${language}` as StringKey);
  // es/fr/it/pt write language names lowercase mid-sentence ("en español").
  const langMid = ['es', 'fr', 'it', 'pt'].includes(resolvedLocale()) ? lang.toLowerCase() : lang;

  function finish() {
    finishedRef.current = true;
    saveOnboardingDraft(null);
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
    // Launch-time scheduling ran before notification permission existed; now it might.
    scheduleTrialEndNotice();
    lockNow(); // shield the chosen apps immediately so home lands in the "locked" state
    // The first fare is on us: full access for a day at most, cut to the first
    // pass's expiry once it is paid. The wall waits on home for that moment.
    startPreview();
    track('onboarded', { language, level: derivedLevel, difficulty, exercises: fareEx, minutes: fareMin, preview: true });
    router.replace('/');
  }

  const printLines = [t('ob.print1'), t('ob.print2'), t('ob.print3')];

  // The step's action. On a phone it is pinned to the bottom edge — the thumb
  // zone. On iPad that is the WORST place for it: the bottom edge of a 13-inch
  // screen is the longest reach, and with the body centred the button ends up
  // hundreds of points from the content it belongs to, reading as a stray bar.
  // So on regular widths it travels WITH the content instead (founder call,
  // 2026-09-09: "I don't know about this button really down there").
  const footerCta =
    step === 'printing' ? null : (
      <View style={[styles.footer, band(L)]}>
        <Button
          label={
            step === 'hook'
              ? t('ob.hookCta')
              : step === 'mirror'
                ? t('ob.mirrorCta')
                : step === 'summary'
                  ? t('ob.sumCta')
                  : step === 'lock'
                    ? !lockReady
                      ? t('ob.lockCtaWait')
                      : t('ob.lockCta')
                    : step === 'tease'
                      ? t('ob.teaseCta')
                      : step === 'future'
                        ? t('ob.futureCta')
                        : t('common.continue')
          }
          glow
          full
          disabled={step === 'lock' && !lockReady}
          onPress={step === 'lock' ? finish : next}
        />
      </View>
    );

  const stepBody = (
    <>
            {step === 'hook' && (
              <Entrance key="hook" style={{ flex: 1 }}>
                <Text variant="overline" color="accent">
                  LangToll
                </Text>
                {/* One promise for everyone. The headline used to rotate through the
                    languages ("…into Spanish." → "…into German."), and whoever caught
                    the wrong one first read it as "this app is for Spanish" and left
                    (8 of 62 installs quit on this screen; founder, 2026-10-01). */}
                {/* Their day, not our concept: "scroll" names what everyone does and no
                    single app, so nobody reads the screen as "for TikTok users" (founder,
                    2026-10-04). */}
                <Text variant="hero" style={{ marginTop: space.md, fontSize: 36, lineHeight: 40 }}>
                  {t('ob.hookHeadline')}
                </Text>
                <Text variant="serif" color="inkSoft" style={{ marginTop: space.md }}>
                  {t('ob.hookSub')}
                </Text>
                {/* The mechanic, shown: a phone with the shield up and a word on the
                    island. Replaces Tolly's portrait, which said nothing about what
                    the app does (founder, 2026-10-04). */}
                {/* The mock takes whatever height the copy leaves and is sized to it,
                    so there is no dead band above the button (layout rule: the
                    illustration absorbs the slack). */}
                <View
                  style={[styles.tollySlot, { marginTop: space.md }]}
                  onLayout={(e) => setHookSlotH(Math.round(e.nativeEvent.layout.height))}
                >
                  <ShieldPreview
                    word={previewWord.word}
                    translation={previewWord.translation}
                    width={Math.max(140, Math.min(210, Math.floor((hookSlotH - 40) / PHONE_ASPECT)))}
                  />
                </View>
              </Entrance>
            )}

            {step === 'how' && (
              <Entrance key="how" style={{ flex: 1 }}>
                <Text variant="title">{t('ob.howTitle')}</Text>
                <View style={{ marginTop: space.xl, gap: space.lg }}>
                  <HowRow icon="lock-closed" title={t('ob.how1')} detail={t('ob.how1d')} />
                  <HowRow icon="flash" title={t('ob.how2')} detail={t('ob.how2d')} />
                  <HowRow icon="time" title={t('ob.how3')} detail={t('ob.how3d')} />
                </View>
                {/* The operator who runs this deal, arms crossed, filling the
                    half of the screen the three rows leave. */}
                <View style={styles.tollySlot}>
                  <Tolly mood="stern" size={168} />
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
                  keyboardAppearance={theme.scheme}
                  onSubmitEditing={() => next()}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.surface,
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
                      // The language's own name under the translated one: the
                      // first word of the course, and a check that "German"
                      // really is the Deutsch you meant.
                      sub={LOCALE_ENDONYMS[l]}
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
                  {/* The language they came for is not here. Until 2026-10-06 that person
                      bounced between the hook and this list and left, and we never learned
                      which language it was. One row opens the usual asks and a field; a tap
                      records language_wanted and says plainly it is not here yet. */}
                  <OptionRow label={t('ob.langOther')} selected={false} onPress={() => setLangOtherOpen((o) => !o)} />
                  {langOtherOpen && (
                    <View style={{ gap: space.sm, paddingTop: space.xs }}>
                      <Text variant="callout" color="inkSoft">
                        {t('ob.langOtherHint')}
                      </Text>
                      <View style={styles.chipWrap}>
                        {OTHER_LANGUAGES.map((name) => (
                          <Chip
                            key={name}
                            label={name}
                            selected={langWanted === name}
                            onPress={() => wantLanguage(name)}
                          />
                        ))}
                      </View>
                      <TextInput
                        value={langOtherText}
                        onChangeText={setLangOtherText}
                        onSubmitEditing={() => langOtherText.trim() && wantLanguage(langOtherText.trim())}
                        placeholder={t('ob.langOtherField')}
                        placeholderTextColor={theme.inkFaint}
                        returnKeyType="done"
                        autoCapitalize="words"
                        style={[styles.input, { color: theme.ink, borderColor: theme.line, backgroundColor: theme.surface }]}
                      />
                      {langWanted ? (
                        <Text variant="callout" color="accent">
                          {t('ob.langOtherThanks')}
                        </Text>
                      ) : null}
                    </View>
                  )}
                </View>
              </Entrance>
            )}

            {step === 'difficulty' && (
              <Entrance key="difficulty">
                <Text variant="title">{t('ob.diffTitle')}</Text>
                <Text variant="callout" color="inkSoft" style={{ marginTop: space.sm }}>
                  {t('ob.diffSub')}
                </Text>
                <View style={{ marginTop: space.xxl }}>
                  <DifficultyScale
                    value={difficulty}
                    onChange={setDifficulty}
                    easierLabel={t('ob.diffEasier')}
                    harderLabel={t('ob.diffHarder')}
                    accessibilityLabel={t('ob.diffTitle')}
                  />
                </View>
                <View style={[styles.levelBadge, { borderColor: withAlpha(theme.accent, 0.4), backgroundColor: withAlpha(theme.accent, 0.08) }]}>
                  <Text variant="label" style={{ color: theme.accent }}>
                    {t('ob.diffLevel', { level: derivedLevel })}
                  </Text>
                </View>
                {/* Same honesty as the fare note: the route beyond A1 is the
                    trial's, and this says so where the choice is made. */}
                {!(FREE_LEVELS as readonly string[]).includes(derivedLevel) && (
                  <View style={[styles.fareNote, { borderColor: withAlpha(theme.accent, 0.4), backgroundColor: withAlpha(theme.accent, 0.08) }]}>
                    <Ionicons name="sparkles" size={16} color={theme.accent} />
                    <Text variant="caption" style={{ flex: 1, color: theme.accent }}>
                      {t('ob.levelNeedsPlus', { level: derivedLevel, days: TRIAL_DAYS, free: FREE_LEVELS[0] })}
                    </Text>
                  </View>
                )}
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
              <Entrance key="mirror" style={{ flex: 1 }}>
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
                  {t('ob.mirrorSub', { days: daysPerYear, years: yearsLost, horizon: HORIZON_YEARS })}
                </Text>
                <Text variant="callout" color="ink" style={{ marginTop: space.md }}>
                  {t('ob.mirrorFluent', { hours: hoursPerYear.toLocaleString(), fluent: fluentHours, lang })}
                </Text>
                <Text variant="caption" color="inkFaint" style={{ marginTop: space.md }}>
                  {t('ob.mirrorNote')}
                </Text>
                {/* The operator takes the damage personally. */}
                <View style={styles.tollySlot}>
                  <Tolly mood="sad" size={144} />
                </View>
              </Entrance>
            )}

            {step === 'when' && (
              <Entrance key="when">
                <Text variant="title">{t('ob.whenTitle')}</Text>
                <Text variant="callout" color="inkSoft" style={{ marginTop: space.sm }}>
                  {t('ob.whenSub')}
                </Text>
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
                <FareDial
                  value={fareMin}
                  stops={FARE_MINUTE_STOPS}
                  onChange={setFareMin}
                  format={formatDuration}
                  caption={t('ob.fareDialCaption')}
                />
                {/* Said at the moment of choice, not discovered on day 8: the full
                    range is the trial's, and this is what free keeps. */}
                {(freeExercises(fareEx) !== fareEx || freeMinutes(fareMin) !== fareMin) && (
                  <View style={[styles.fareNote, { borderColor: withAlpha(theme.accent, 0.4), backgroundColor: withAlpha(theme.accent, 0.08) }]}>
                    <Ionicons name="sparkles" size={16} color={theme.accent} />
                    <Text variant="caption" style={{ flex: 1, color: theme.accent }}>
                      {t('ob.fareNeedsPlus', {
                        days: TRIAL_DAYS,
                        exs: FREE_FARE_EXERCISES.join(` ${t('common.or')} `),
                        mins: FREE_FARE_MINUTES.join(` ${t('common.or')} `),
                      })}
                    </Text>
                  </View>
                )}
              </Entrance>
            )}

            {step === 'tease' && (
              <Entrance key="tease" style={{ flex: 1 }}>
                <Text variant="overline" color="accent">
                  {t('ob.teaseOver')}
                </Text>
                <Text variant="title" style={{ marginTop: space.md }}>
                  {t('ob.teaseTitle', { lang: langMid })}
                </Text>
                <Text variant="serif" color="inkSoft" style={{ marginTop: space.lg }}>
                  {faresPerDay === 1
                    ? t('ob.teaseSubOne', { ex: fareEx, mins: practiceMinutes, lang: langMid })
                    : t('ob.teaseSub', { fares: faresPerDay, ex: fareEx, mins: practiceMinutes, lang: langMid })}
                </Text>
                {/* Where the numbers come from, so they read as theirs and not as a
                    template: their apps' estimated daily time, their unlock minutes. */}
                <Text variant="callout" color="inkSoft" style={{ marginTop: space.md }}>
                  {t('ob.teaseWhy', {
                    time: dailyH > 0 ? (dailyM > 0 ? `${dailyH} h ${dailyM} min` : `${dailyH} h`) : `${dailyM} min`,
                    min: fareMin,
                  })}
                </Text>
                <Text variant="caption" color="inkFaint" style={{ marginTop: space.md }}>
                  {t('ob.teaseNote')}
                </Text>
                {/* The lookout: binoculars on the horizon the next screen shows. */}
                <View style={styles.tollySlot}>
                  <Tolly mood="lookout" size={168} />
                </View>
              </Entrance>
            )}

            {step === 'future' && (
              <Entrance key="future" style={{ flex: 1 }}>
                <Text variant="overline" color="accent">
                  {t('ob.futureOver')}
                </Text>
                <Text variant="title" style={{ marginTop: space.md }}>
                  {t('ob.futureTitle', { lang: langMid })}
                </Text>
                <View style={{ marginTop: space.xl, gap: space.lg }}>
                  {(
                    [
                      ['ob.futureDay30', t('ob.futureWords', { words: words30.toLocaleString() }), t('ob.futureWordsLine')],
                      ['ob.futureMonth6', t('ob.futureLevel', { level: level6 }), t('ob.future6Line')],
                      ['ob.futureMonth12', t('ob.futureLevel', { level: level12 }), t(future12Key)],
                    ] as const
                  ).map(([when, head, line], i) => (
                    <Entrance key={when} delay={120 * i} from={8}>
                      <View style={{ flexDirection: 'row', gap: space.md }}>
                        <Text variant="label" color="accent" style={{ width: 84, paddingTop: 3 }}>
                          {t(when)}
                        </Text>
                        <View style={{ flex: 1 }}>
                          <Text variant="bodyMedium">{head}</Text>
                          <Text variant="callout" color="inkSoft" style={{ marginTop: 2 }}>
                            {line}
                          </Text>
                        </View>
                      </View>
                    </Entrance>
                  ))}
                </View>
                <View style={styles.tollySlot}>
                  <Tolly mood="celebrate" size={144} />
                </View>
              </Entrance>
            )}

            {step === 'goal' && (
              <Entrance key="goal">
                {/* The body scrolls (see below), so focusing the custom-goal
                    input can scroll it clear of the keyboard and the CTA. */}
                <Text variant="title">{t('ob.goalTitle', { lang })}</Text>
                {!goalTyping && (
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
                )}
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
                  onFocus={() => setGoalTyping(true)}
                  onBlur={() => setGoalTyping(false)}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                {goalTyping && (
                  <Text variant="caption" color="inkFaint" style={{ marginTop: space.md }}>
                    {t('ob.goalTypingHint')}
                  </Text>
                )}

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
                  {/* The first three days cost three exercises a fare (lib/plans
                      expressFareActive) — said here, so day four's jump to their
                      own number is a promise kept, not a surprise. */}
                  {expressWillApply(fareEx) && (
                    <Text variant="callout" color="inkSoft">
                      • {t('express.summary', { day: expressEndsWeekday(), n: fareEx })}
                    </Text>
                  )}
                  <Text variant="callout" color="inkSoft">
                    • {difficulty <= 3 ? t('ob.sumFromZero', { lang }) : t('ob.sumFromBasics', { lang })}
                  </Text>
                </View>
              </Entrance>
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
                <Text variant="callout" color="accent" style={{ marginTop: space.sm }}>
                  {t('preview.lockLine')}
                </Text>
                <View style={{ marginTop: space.xl }}>
                  <LockSetup apps={apps} onReady={setLockReady} />
                </View>
                <View style={{ marginTop: space.lg }}>
                  <NotifyNudge />
                </View>
              </Entrance>
            )}
    </>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={step === 'summary' ? 0.7 : 0.35} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* header: back + progress + skip */}
          <View style={[styles.header, band(L)]}>
            {/* Only a VISIBLE control may be tappable. Both slots used to be
                pressables on every step with the label hidden, so the empty top
                right advanced past the hard paywall (seen in telemetry
                2026-09-23). An empty slot is a plain View that holds the layout. */}
            {canGoBack ? (
              <PressableScale onPress={back} style={styles.headerBtn} haptic={null}>
                <Ionicons name="arrow-back" size={20} color={theme.inkSoft} />
              </PressableScale>
            ) : (
              <View style={styles.headerBtn} />
            )}
            <View style={[styles.track, { backgroundColor: theme.fillStrong }]}>
              <View
                style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: theme.accent }]}
              />
            </View>
            {showSkip ? (
              <PressableScale onPress={next} style={styles.headerBtn} haptic={null}>
                <Text variant="label" color="inkFaint">
                  {t('common.skip')}
                </Text>
              </PressableScale>
            ) : (
              <View style={styles.headerBtn} />
            )}
          </View>

          {/* Every step scrolls, which is what lets the body centre when it fits and
              scroll when it does not, in EITHER orientation, with no height guard. */}
          {(
            <ScrollView
              ref={goalScrollRef}
              style={{ flex: 1 }}
              contentContainerStyle={[styles.bodyScroll, band(L), centreStep && centreStyle]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              // The fare dial is turned by dragging; on a real phone the page scrolled
              // along with the finger (TestFlight 50, 2026-10-01). The step fits one
              // screen, so it simply does not scroll.
              scrollEnabled={step !== 'fare'}
            >
              {stepBody}
              {L.regular ? <View style={{ marginTop: space.xxl }}>{footerCta}</View> : null}
            </ScrollView>
          )}
          {L.regular ? null : footerCta}

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
  // Takes whatever height the copy leaves and centres Tolly in it (the
  // session's orderTolly): the figure absorbs the slack, never a blank band
  // above the CTA.
  tollySlot: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', minHeight: 170, marginTop: space.lg },
  bodyScroll: { flexGrow: 1, paddingHorizontal: space.xl, paddingTop: space.xxl },
  footer: { paddingHorizontal: space.xl, paddingBottom: space.lg, gap: space.sm },
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
  notifyCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
  },
  notifyHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  notifyDone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
  },
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
  fareNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    marginTop: space.lg,
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
