// Settings — every lever in one place, in the ticket language: passenger,
// course (level + difficulty), fare, voice, app language, blocked apps, and
// the AI topic pack generator (lib/ai/topics behind a demo-mode fallback).
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { GlassCard } from '@/components/glass/GlassCard';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme, space, radius, font } from '@/design/theme';
import {
  useAppState,
  updateProfile,
  resetProfile,
  lockNow,
  isPlus,
  applyEntitlement,
} from '@/lib/store';
import { generateTopicPack, aiAvailable } from '@/lib/ai/topics';
import { isNativeAvailable } from '@/lib/blocking';
import { AppPicker } from '@/components/blocking/AppPicker';
import { useT } from '@/lib/i18n';
import type { Level } from '@/content/german';

const APPS = ['TikTok', 'Instagram', 'YouTube', 'Reddit', 'X', 'Games', 'Netflix'];
const LEVELS: Level[] = ['A1', 'A2', 'B1'];
const FARE_EXERCISES = [3, 5, 8];
const FARE_MINUTES = [15, 30, 45];
const LOCALES = [
  { key: 'system' as const, labelKey: 'settings.system' as const },
  { key: 'en' as const, label: 'English' },
  { key: 'de' as const, label: 'Deutsch' },
];

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard solid style={{ marginTop: space.lg }}>
      <Text variant="overline" color="inkFaint">
        {title}
      </Text>
      <View style={{ marginTop: space.md }}>{children}</View>
    </GlassCard>
  );
}

export default function Settings() {
  const theme = useTheme();
  const t = useT();
  const state = useAppState();

  const [nameDraft, setNameDraft] = useState(state.name ?? '');
  const [topicDraft, setTopicDraft] = useState('');
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState(false);

  const plus = isPlus(state);

  async function generate() {
    if (!plus) {
      router.push('/paywall');
      return;
    }
    const topic = topicDraft.trim();
    if (!topic || generating) return;
    setGenerating(true);
    setAiError(false);
    try {
      const pack = await generateTopicPack(topic, state.level, state.learningLanguage);
      updateProfile({ customTopic: pack, useCustomTopic: true });
      setTopicDraft('');
    } catch {
      setAiError(true);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <AuroraBackground mood={0.3} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} style={styles.back} haptic={null}>
            <Ionicons name="arrow-back" size={22} color={theme.inkSoft} />
          </PressableScale>
          <Text variant="headline">{t('settings.title')}</Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* plan */}
          <Section title={t('settings.plan')}>
            {plus ? (
              <View style={styles.planRow}>
                <Ionicons name="checkmark-circle" size={20} color={theme.accent} />
                <Text variant="bodyMedium" style={{ color: theme.accent }}>
                  {t('settings.planPlus')}
                </Text>
              </View>
            ) : (
              <>
                <Text variant="callout" color="inkSoft" style={{ marginBottom: space.md }}>
                  {t('settings.planFree')}
                </Text>
                <Button
                  label={t('settings.upgrade')}
                  icon="sparkles"
                  glow
                  full
                  onPress={() => router.push('/paywall')}
                />
              </>
            )}
          </Section>

          {/* passenger */}
          <Section title={t('settings.passenger')}>
            <TextInput
              value={nameDraft}
              onChangeText={setNameDraft}
              onEndEditing={() =>
                updateProfile({ name: nameDraft.trim().split(/\s+/)[0] || null })
              }
              placeholder={t('ob.namePlaceholder')}
              placeholderTextColor={theme.inkFaint}
              selectionColor={theme.accent}
              keyboardAppearance="dark"
              autoCapitalize="words"
              style={[
                styles.input,
                { backgroundColor: theme.fill, borderColor: theme.line, color: theme.ink },
              ]}
            />
          </Section>

          {/* course */}
          <Section title={t('settings.course')}>
            <Text variant="caption" color="inkFaint">
              {t('settings.level')}
            </Text>
            <View style={styles.chipRow}>
              {LEVELS.map((l) => (
                <Chip
                  key={l}
                  label={l}
                  selected={state.level === l}
                  onPress={() => updateProfile({ level: l })}
                />
              ))}
            </View>
            <Text variant="caption" color="inkFaint" style={{ marginTop: space.lg }}>
              {t('settings.difficulty')}
            </Text>
            <View style={styles.diffRow}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((d) => (
                <PressableScale
                  key={d}
                  haptic={null}
                  onPress={() => updateProfile({ difficulty: d })}
                  style={[
                    styles.diffDot,
                    {
                      backgroundColor:
                        d <= state.difficulty ? 'rgba(200,255,77,0.16)' : theme.fill,
                      borderColor: d <= state.difficulty ? theme.accent : theme.line,
                    },
                  ]}
                >
                  <View />
                </PressableScale>
              ))}
            </View>
            <View style={styles.diffLabels}>
              <Text variant="caption" color="inkFaint">
                {t('settings.easier')}
              </Text>
              <Text variant="caption" color="inkFaint">
                {t('settings.harder')}
              </Text>
            </View>
          </Section>

          {/* fare */}
          <Section title={t('settings.fare')}>
            <Text variant="caption" color="inkFaint">
              {t('settings.fareEx')}
            </Text>
            <View style={styles.chipRow}>
              {FARE_EXERCISES.map((n) => (
                <Chip
                  key={n}
                  label={`${n}`}
                  selected={state.exercisesPerUnlock === n}
                  onPress={() => updateProfile({ exercisesPerUnlock: n })}
                />
              ))}
            </View>
            <Text variant="caption" color="inkFaint" style={{ marginTop: space.lg }}>
              {t('settings.fareMin')}
            </Text>
            <View style={styles.chipRow}>
              {FARE_MINUTES.map((n) => (
                <Chip
                  key={n}
                  label={`${n}`}
                  selected={state.unlockMinutes === n}
                  onPress={() => updateProfile({ unlockMinutes: n })}
                />
              ))}
            </View>
          </Section>

          {/* voice */}
          <Section title={t('settings.voice')}>
            <View style={styles.switchRow}>
              <Text variant="callout" color="inkSoft" style={{ flex: 1 }}>
                {t('settings.voiceDetail')}
              </Text>
              <Switch
                value={state.soundEnabled}
                onValueChange={(v) => updateProfile({ soundEnabled: v })}
                trackColor={{ true: theme.accent, false: 'rgba(255,255,255,0.15)' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Section>

          {/* appearance */}
          <Section title={t('settings.appearance')}>
            <View style={styles.chipRow}>
              {(['dark', 'light', 'system'] as const).map((a) => (
                <Chip
                  key={a}
                  label={t(`settings.${a}` as const)}
                  selected={state.appearance === a}
                  onPress={() => updateProfile({ appearance: a })}
                />
              ))}
            </View>
          </Section>

          {/* app language */}
          <Section title={t('settings.uiLanguage')}>
            <View style={styles.chipRow}>
              {LOCALES.map((l) => (
                <Chip
                  key={l.key}
                  label={'labelKey' in l && l.labelKey ? t(l.labelKey) : (l as any).label}
                  selected={state.locale === l.key}
                  onPress={() => updateProfile({ locale: l.key })}
                />
              ))}
            </View>
          </Section>

          {/* blocked apps — real Screen Time picker on device, demo chips on simulator */}
          <Section title={t('settings.apps')}>
            {isNativeAvailable() ? (
              <AppPicker />
            ) : (
              <View style={styles.chipRow}>
                {APPS.map((a) => (
                  <Chip
                    key={a}
                    label={a}
                    selected={state.blockedApps.includes(a)}
                    onPress={() =>
                      updateProfile({
                        blockedApps: state.blockedApps.includes(a)
                          ? state.blockedApps.filter((x) => x !== a)
                          : [...state.blockedApps, a],
                      })
                    }
                  />
                ))}
              </View>
            )}
          </Section>

          {/* AI topic pack */}
          <Section title={t('settings.topics')}>
            <Text variant="callout" color="inkSoft">
              {t('settings.topicHint')}
            </Text>
            {!aiAvailable() && (
              <Text variant="caption" color="amber" style={{ marginTop: space.sm }}>
                {t('settings.noKey')}
              </Text>
            )}
            <TextInput
              value={topicDraft}
              onChangeText={setTopicDraft}
              placeholder={t('settings.topicPlaceholder')}
              placeholderTextColor={theme.inkFaint}
              selectionColor={theme.accent}
              keyboardAppearance="dark"
              editable={!generating}
              onSubmitEditing={generate}
              style={[
                styles.input,
                {
                  backgroundColor: theme.fill,
                  borderColor: theme.line,
                  color: theme.ink,
                  marginTop: space.md,
                },
              ]}
            />
            <Button
              label={generating ? t('settings.generating') : t('settings.generate')}
              onPress={generate}
              loading={generating}
              disabled={!topicDraft.trim() || generating}
              full
              style={{ marginTop: space.md }}
            />
            {aiError && (
              <Text variant="caption" color="danger" style={{ marginTop: space.sm }}>
                {t('settings.aiError')}
              </Text>
            )}
            {state.customTopic && (
              <View style={[styles.topicRow, { borderColor: theme.line }]}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMedium">{state.customTopic.name}</Text>
                  <Text variant="caption" color="inkFaint">
                    {state.customTopic.vocab.length} · {state.customTopic.sentences.length} —{' '}
                    {t('settings.trainTopic')}
                  </Text>
                </View>
                <Switch
                  value={state.useCustomTopic}
                  onValueChange={(v) => updateProfile({ useCustomTopic: v })}
                  trackColor={{ true: theme.accent, false: 'rgba(255,255,255,0.15)' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            )}
          </Section>

          {/* dev */}
          {__DEV__ && (
            <View style={{ marginTop: space.xl, gap: space.sm }}>
              <Button
                label={plus ? 'Downgrade to free (dev)' : 'Grant Plus (dev)'}
                variant="ghost"
                onPress={() => applyEntitlement(!plus)}
              />
              <Button label={t('home.lockDev')} variant="ghost" onPress={lockNow} />
              <Button
                label={t('settings.reset')}
                variant="ghost"
                onPress={() => {
                  resetProfile();
                  router.replace('/onboarding');
                }}
              />
            </View>
          )}
        </ScrollView>
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
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
  },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: space.xl, paddingBottom: space.xxxl },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.sm },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  input: {
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: space.lg,
    fontFamily: font.body,
    fontSize: 16,
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  diffRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.sm },
  diffDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 1 },
  diffLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.xs },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderTopWidth: 1,
    marginTop: space.lg,
    paddingTop: space.md,
  },
});
