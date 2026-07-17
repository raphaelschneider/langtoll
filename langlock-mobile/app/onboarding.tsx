// Onboarding — the fare-gate flow. One route, a step machine, instant transitions.
// Structure follows the converting-onboarding playbook: hook → mechanic → questions
// (name first, used everywhere after) → emotional mirror → plan-printing loading →
// personalized summary → transformation paywall. Skip on every optional step.
// All copy via lib/i18n; target-language flavor comes from the content pack.
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { PassCard } from '@/components/pass/PassCard';
import { Entrance } from '@/components/ui/Entrance';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { PlusOffer } from '@/components/paywall/PlusOffer';
import { useTheme, space, radius, font } from '@/design/theme';
import { activePack, levelForDifficulty } from '@/lib/pack';
import { updateProfile } from '@/lib/store';
import { useT, type StringKey } from '@/lib/i18n';

const STEPS = [
  'hook',
  'how',
  'name',
  'language',
  'difficulty',
  'apps',
  'mirror',
  'fare',
  'goal',
  'printing',
  'summary',
  'paywall',
] as const;
type Step = (typeof STEPS)[number];

const APPS = ['TikTok', 'Instagram', 'YouTube', 'Reddit', 'X', 'Games', 'Netflix'];
const GOAL_KEYS = ['ob.goalTravel', 'ob.goalLove', 'ob.goalWork', 'ob.goalBrain'] as const;
const LANGS = [
  { key: 'de', ready: true },
  { key: 'es', ready: false },
  { key: 'fr', ready: false },
  { key: 'it', ready: false },
] as const;
const FARE_EXERCISES = [3, 5, 8];
const FARE_MINUTES = [15, 30, 45];

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
          backgroundColor: selected ? 'rgba(200,255,77,0.10)' : theme.fill,
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
          backgroundColor: selected ? 'rgba(200,255,77,0.12)' : theme.fill,
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
          { backgroundColor: 'rgba(200,255,77,0.10)', borderColor: 'rgba(200,255,77,0.3)' },
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
  const pack = activePack();
  const lang = t(`lang.${pack.language}` as StringKey);

  const [stepIdx, setStepIdx] = useState(0);
  const step: Step = STEPS[stepIdx];

  // answers
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [apps, setApps] = useState<string[]>(['TikTok', 'Instagram']);
  const [goal, setGoal] = useState<string | null>(null);
  const [fareEx, setFareEx] = useState(5);
  const [fareMin, setFareMin] = useState(30);

  // printing-step stage ticker
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

  const firstName = name.trim().split(/\s+/)[0] || null;
  const dailyMinutes = 25 + apps.length * 20; // playful, plausible estimate
  const dailyH = Math.floor(dailyMinutes / 60);
  const dailyM = dailyMinutes % 60;
  const daysPerYear = Math.round((dailyMinutes * 365) / 1440);

  const skippable: Step[] = ['name', 'apps', 'goal'];
  const showSkip = skippable.includes(step);
  const progress = stepIdx / (STEPS.length - 1);

  function next() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  }
  function back() {
    if (stepIdx === 0) return;
    setStepIdx((i) => i - 1);
  }
  const derivedLevel = levelForDifficulty(difficulty);

  function finish() {
    updateProfile({
      onboarded: true,
      name: firstName,
      difficulty,
      level: derivedLevel,
      blockedApps: apps,
      goal,
      exercisesPerUnlock: fareEx,
      unlockMinutes: fareMin,
    });
    router.replace('/');
  }

  const printLines = [t('ob.print1'), t('ob.print2'), t('ob.print3')];

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
                  LangPass
                </Text>
                <Text variant="hero" style={{ marginTop: space.md }}>
                  {t('ob.hookTitle', { lang })}
                </Text>
                <Text variant="serif" color="inkSoft" style={{ marginTop: space.lg }}>
                  {t('ob.hookSub')}
                </Text>
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
                  {LANGS.map((l) => (
                    <OptionRow
                      key={l.key}
                      label={t(`lang.${l.key}` as StringKey)}
                      selected={l.key === pack.language}
                      disabled={!l.ready}
                      tag={l.ready ? undefined : t('ob.soon')}
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
                            d <= difficulty ? 'rgba(200,255,77,0.16)' : theme.fill,
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
                <View style={[styles.levelBadge, { borderColor: 'rgba(200,255,77,0.4)', backgroundColor: 'rgba(200,255,77,0.08)' }]}>
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
                  {dailyH ? `${dailyH}h ` : ''}
                  {dailyM}m
                </Text>
                <Text variant="title" style={{ marginTop: space.md }}>
                  {firstName
                    ? t('ob.mirrorTitleNamed', { name: firstName })
                    : t('ob.mirrorTitle')}
                </Text>
                <Text variant="serif" color="inkSoft" style={{ marginTop: space.lg }}>
                  {t('ob.mirrorSub', { days: daysPerYear, lang })}
                </Text>
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
                <View style={styles.chipWrap}>
                  {FARE_MINUTES.map((n) => (
                    <Chip key={n} label={`${n}`} selected={fareMin === n} onPress={() => setFareMin(n)} />
                  ))}
                </View>
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
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: space.xl }}>
                <Text variant="overline" color="accent">
                  {t('ob.payOver')}
                </Text>
                <Text variant="headline" style={{ marginTop: space.xs }}>
                  {firstName
                    ? t('ob.payTitleNamed', { name: firstName, lang })
                    : t('ob.payTitle', { lang })}
                </Text>
                <View style={{ marginTop: space.lg }}>
                  <PlusOffer onDone={finish} />
                </View>
              </ScrollView>
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
                        : t('common.continue')
                }
                glow
                full
                onPress={next}
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
