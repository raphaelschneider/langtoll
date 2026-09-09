// Settings — every lever in one place, in the ticket language: passenger,
// course (level + difficulty), fare, voice, app language, blocked apps, and
// the AI topic pack generator (lib/ai/topics behind a demo-mode fallback).
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Switch, Alert, AppState, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuroraBackground } from '@/components/skia/AuroraBackground';
import { GlassCard } from '@/components/glass/GlassCard';
import { PressableScale } from '@/components/ui/PressableScale';
import { Chip } from '@/components/ui/Chip';
import { openPaywall } from '@/lib/paywall';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme, space, radius, font } from '@/design/theme';
import { useLayout, band } from '@/design/layout';
import { withAlpha } from '@/lib/color';
import {
  useAppState,
  updateProfile,
  resetProfile,
  completeSession,
  lockNow,
  isPlus,
  isUnlocked,
  applyEntitlement,
} from '@/lib/store';
import { generateTopicPack, aiAvailable, refreshGoalPack } from '@/lib/ai/topics';
import { isNativeAvailable, relockStatus, grantUnlock } from '@/lib/blocking';
import { supportCode, SUPPORT_EMAIL } from '@/lib/device';
import { scheduleTrialEndNotice, openSystemSettings } from '@/lib/notify';
import { AppPicker } from '@/components/blocking/AppPicker';
import { useT } from '@/lib/i18n';
import { LOCALE_CODES, LOCALE_ENDONYMS, type LocaleCode } from '@/lib/locales';
import {
  canUseAudio,
  canUseAiTopics,
  canCustomizeLock,
  canUseStrictMode,
  effectiveExercisesPerUnlock,
  effectiveUnlockMinutes,
  SPEAKER_FORM_EXAMPLES,
  FARE_EXERCISES,
  FARE_MINUTES_MIN,
  FARE_MINUTES_MAX,
  FARE_MINUTES_STEP,
  FREE_FARE_EXERCISES,
  FREE_FARE_MINUTES,
  FREE_LEVELS,
  canUseLevel,
  effectiveLevel,
  levelWillRevert,
  fareWillRevert,
  freeExercises,
  freeMinutes,
} from '@/lib/plans';
import { FareSlider } from '@/components/ui/FareSlider';
import {
  primeVoices,
  voicesForActivePack,
  speakWith,
  setSpeechShaping,
  speechIsNative,
} from '@/lib/tts';
import { getDiagnostics, type SpeechDiagnostics } from '@/modules/langtoll-speech/src';
import { activePack } from '@/lib/pack';
import { availableLanguages } from '@/content';
import { syncPassActivity } from '@/lib/pass-activity';
import { areActivitiesEnabled, activitySupported, setWordRotation, advanceWordRotation } from '@/modules/langtoll-activity/src';
import type { Level } from '@/content/german';

// Dev levers are normally __DEV__-only, which strips them from Release builds.
// EXPO_PUBLIC_DEV_TOOLS=1 keeps them in a local Release build so the plan
// transitions can be exercised on-device against the real API. Safe to leave
// in: .env is gitignored and EAS only uploads git-tracked files, so a cloud
// production build can't inherit the flag.
const DEV_TOOLS = __DEV__ || process.env.EXPO_PUBLIC_DEV_TOOLS === '1';

const APPS = ['TikTok', 'Instagram', 'YouTube', 'Reddit', 'X', 'Games', 'Netflix'];
const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2'];
// 'system' first, then every locale we ship, labelled with its own endonym so
// the picker stays usable when the current UI language is one you can't read.
const LOCALES: { key: 'system' | LocaleCode; label?: string; labelKey?: 'settings.system' }[] = [
  { key: 'system', labelKey: 'settings.system' },
  ...LOCALE_CODES.map((c) => ({ key: c, label: LOCALE_ENDONYMS[c] })),
];

// Sweeps for the native EQ chain. Values chosen to bracket the useful range for
// speech — wide enough to hear the difference, narrow enough to stay usable.
// The ONLY audio control a real user sees. Everything else (voice identity,
// pitch, the whole EQ/de-ess chain) is tuned by us and hidden behind DEV_TOOLS —
// users can't meaningfully judge a 250Hz cut, but they can tell you it's too fast.
const SPEECH_SPEEDS: { rate: number; labelKey: 'settings.speedSlow' | 'settings.speedNormal' | 'settings.speedFast' }[] = [
  { rate: 0.55, labelKey: 'settings.speedSlow' },
  { rate: 0.7, labelKey: 'settings.speedNormal' },
  { rate: 0.9, labelKey: 'settings.speedFast' },
];

const EQ_BANDS: { key: string; label: string; unit: string; values: number[] }[] = [
  { key: 'highPassHz', label: 'High-pass', unit: 'Hz', values: [0, 80, 110, 150, 200] },
  { key: 'lowMidGain', label: 'Low-mid (250Hz)', unit: 'dB', values: [0, -2, -4, -6, -8] },
  { key: 'presenceGain', label: 'Presence (3.2kHz)', unit: 'dB', values: [0, 2, 3, 5, 7] },
  { key: 'deEssHz', label: 'De-ess freq', unit: 'Hz', values: [5000, 6000, 6500, 7500, 8500] },
  { key: 'deEssThresholdDb', label: 'De-ess threshold', unit: 'dB', values: [-40, -34, -28, -22, -16] },
  { key: 'deEssMaxCutDb', label: 'De-ess max cut', unit: 'dB', values: [0, 6, 12, 18] },
  { key: 'deEssRatio', label: 'De-ess ratio', unit: ':1', values: [2, 4, 6, 10] },
];

// Purpose-built probes for the voice lab. Each one stresses ONE thing we tune,
// so a change in a band has something to be audible against. Real pack words are
// a bad test — they rarely contain the sound you are chasing.
const VOICE_TESTS: Record<string, { label: string; text: string; probes: string }[]> = {
  de: [
    { label: 'Sibilance', text: 'Sechsundsechzig süße Schwestern essen Kirschen.', probes: 'de-esser: s / sch / z everywhere' },
    { label: 'Plosive/bass', text: 'Bruder Bodo bringt das braune Brot.', probes: 'high-pass: b / d / g pop and boom' },
    { label: 'Consonants', text: 'Danken, denken, decken, drücken.', probes: 'presence: near-identical words' },
    { label: 'Umlauts', text: 'Frühstück, Schlüssel, Mädchen, Öl.', probes: 'vowel clarity' },
    { label: 'Long', text: 'Das Wetter ist heute schön, deshalb gehe ich nach dem Frühstück spazieren.', probes: 'prosody + rate' },
  ],
  pt: [
    { label: 'Sibilance', text: 'Seis cisnes sussurram sem cessar.', probes: 'de-esser: s / ss / c' },
    { label: 'Nasals', text: 'Não, mãe, amanhã tem pão e maçã.', probes: 'nasal vowels — the pt-BR giveaway' },
    { label: 'Plosive/bass', text: 'O bebê bebeu, o boi bebeu bastante.', probes: 'high-pass: b / p boom' },
    { label: 'Tricky', text: 'Açúcar, coração, açaí, atenção.', probes: 'ç and stressed nasal diphthongs' },
    { label: 'Long', text: 'O restaurante é muito caro, mas a comida está muito boa.', probes: 'prosody + rate' },
  ],
  es: [
    { label: 'Sibilance', text: 'Sesenta y seis serpientes sisean.', probes: 'de-esser: s-heavy' },
    { label: 'Trills', text: 'El perro de Rosa corre por la carretera.', probes: 'rolled r — often mangled' },
    { label: 'Plosive/bass', text: 'Bueno, bebe, boca, bomba.', probes: 'high-pass: b / p' },
    { label: 'Consonants', text: 'Pero, perro, caro, carro.', probes: 'presence: minimal pairs' },
    { label: 'Long', text: 'El restaurante es muy caro, pero la comida está muy buena.', probes: 'prosody + rate' },
  ],
  en: [
    { label: 'Sibilance', text: 'She sells sea shells by the seashore.', probes: 'de-esser' },
    { label: 'Plosive/bass', text: 'Big brown bags bounce badly.', probes: 'high-pass' },
    { label: 'Consonants', text: 'Thin, thing, sing, sink.', probes: 'presence' },
    { label: 'Long', text: 'The restaurant is very expensive, but the food is very good.', probes: 'prosody + rate' },
  ],
};

// Dev-only voice lab: every installed voice for the current pack's language,
// ranked best-first, plus rate/pitch sweeps. Exists because voice quality can
// only be judged by ear, and rebuilding to try a value is far too slow a loop.
function VoiceLab() {
  const theme = useTheme();
  const pack = activePack();
  const state = useAppState();
  const [list, setList] = useState<{ identifier: string; name: string; rank: number }[]>([]);
  const voice = state.voiceOverride ?? undefined;
  // Read from the store, not local state — these must survive leaving Settings
  // and must be what sessions actually speak with.
  const rate = state.voiceRate ?? 0.7;
  const pitch = state.voicePitch ?? 1.0;
  // Store-backed, like voice/rate/pitch: what the lab shows is what sessions use.
  const eq: Record<string, number> = state.voiceShaping ?? {
    highPassHz: 110,
    lowMidGain: -6,
    presenceGain: 5,
    deEssHz: 6500,
    deEssThresholdDb: -22,
    deEssMaxCutDb: 18,
    deEssRatio: 2,
  };

  const [diag, setDiag] = useState<SpeechDiagnostics | null>(null);

  useEffect(() => {
    primeVoices().then(() => setList(voicesForActivePack()));
  }, []);

  // Refreshed on demand rather than polled — it only changes when we speak.
  const refreshDiag = () => getDiagnostics().then(setDiag);

  const sample = pack.sentences[0]?.de ?? pack.vocab[0]?.de ?? 'Hallo';
  const word = pack.vocab[0]?.de ?? 'Hallo';
  const tierLabel = ['eloquence', 'compact', 'siri', 'enhanced', 'PREMIUM'];

  return (
    <Section title={`Voice lab (dev) · ${pack.speechLocale}`}>
      <Text variant="caption" color="inkFaint">
        {list.length} voice{list.length === 1 ? '' : 's'} installed · best first
      </Text>
      <View style={{ gap: space.xs, marginTop: space.sm }}>
        {list.map((v) => (
          <PressableScale
            key={v.identifier}
            haptic={null}
            onPress={() => {
              // Persist: this is what sessions will actually speak with.
              updateProfile({ voiceOverride: v.identifier });
              speakWith(word, { voice: v.identifier, rate, pitch });
            }}
            style={{
              paddingVertical: space.sm,
              paddingHorizontal: space.md,
              borderRadius: radius.sm,
              borderWidth: 1,
              borderColor: voice === v.identifier ? theme.accent : theme.line,
              backgroundColor: voice === v.identifier ? withAlpha(theme.accent, 0.10) : theme.fill,
            }}
          >
            <Text variant="bodyMedium" style={{ color: voice === v.identifier ? theme.accent : theme.ink }}>
              {v.name} · {tierLabel[v.rank] ?? v.rank}
            </Text>
            <Text variant="caption" color="inkFaint">
              {v.identifier}
            </Text>
          </PressableScale>
        ))}
      </View>

      <Text variant="overline" color="inkFaint" style={{ marginTop: space.lg }}>
        Rate {rate.toFixed(2)}
      </Text>
      <View style={styles.chipRow}>
        {[0.6, 0.7, 0.8, 0.9, 1.0].map((r) => (
          <Chip key={r} label={`${r}`} selected={rate === r} onPress={() => { updateProfile({ voiceRate: r }); speakWith(word, { voice, rate: r, pitch }); }} />
        ))}
      </View>

      <Text variant="overline" color="inkFaint" style={{ marginTop: space.md }}>
        Pitch {pitch.toFixed(2)}
      </Text>
      <View style={styles.chipRow}>
        {[0.85, 0.95, 1.0, 1.1, 1.2].map((p) => (
          <Chip key={p} label={`${p}`} selected={pitch === p} onPress={() => { updateProfile({ voicePitch: p }); speakWith(word, { voice, rate, pitch: p }); }} />
        ))}
      </View>

      {speechIsNative() ? (
        <>
          {EQ_BANDS.map((b) => (
            <View key={b.key}>
              <Text variant="overline" color="inkFaint" style={{ marginTop: space.md }}>
                {b.label} {eq[b.key]}{b.unit}
              </Text>
              <View style={styles.chipRow}>
                {b.values.map((v) => (
                  <Chip
                    key={v}
                    label={`${v}`}
                    selected={eq[b.key] === v}
                    onPress={() => {
                      // setSpeechShaping persists AND pushes to native.
                      setSpeechShaping({ ...eq, [b.key]: v });
                      speakWith(word, { voice, rate, pitch });
                    }}
                  />
                ))}
              </View>
            </View>
          ))}
        </>
      ) : (
        <Text variant="caption" color="inkFaint" style={{ marginTop: space.md }}>
          EQ needs the native build — rebuild to enable (currently expo-speech fallback).
        </Text>
      )}

      <Text variant="overline" color="inkFaint" style={{ marginTop: space.lg }}>
        Test cases
      </Text>
      <View style={{ gap: space.xs, marginTop: space.sm }}>
        {(VOICE_TESTS[pack.language] ?? VOICE_TESTS.en).map((tc) => (
          <PressableScale
            key={tc.label}
            haptic={null}
            onPress={() => speakWith(tc.text, { voice, rate, pitch })}
            style={{
              paddingVertical: space.sm,
              paddingHorizontal: space.md,
              borderRadius: radius.sm,
              borderWidth: 1,
              borderColor: theme.line,
              backgroundColor: theme.fill,
            }}
          >
            <Text variant="bodyMedium">{tc.label}</Text>
            <Text variant="caption" color="inkFaint">{tc.probes}</Text>
          </PressableScale>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: space.sm, marginTop: space.lg }}>
        <Button label="Word" variant="ghost" onPress={() => speakWith(word, { voice, rate, pitch })} />
        <Button label="Sentence" variant="ghost" onPress={() => speakWith(sample, { voice, rate, pitch })} />
        <Button label="Diag" variant="ghost" onPress={refreshDiag} />
        <Button label="Auto" variant="ghost" onPress={() => updateProfile({ voiceOverride: null, voiceRate: null, voicePitch: null, voiceShaping: null })} />
      </View>
      {diag && (
        <Text variant="caption" color={diag.lastPlayedThroughEQ ? 'accent' : 'danger'} style={{ marginTop: space.sm }}>
          {`session ${diag.category.replace('AVAudioSessionCategory', '')} / ${diag.mode.replace('AVAudioSessionMode', '')}\n` +
           `engine running=${diag.engineRunning} ready=${diag.engineReady}\n` +
           `last render ${diag.lastRenderFrames} frames · through EQ=${diag.lastPlayedThroughEQ}\n` +
           `de-ess peak cut ${diag.lastDeEssPeakCutDb.toFixed(1)}dB\n` +
           `vol ${diag.outputVolume.toFixed(2)} @ ${diag.sampleRate}Hz${diag.lastError ? ` · ERR ${diag.lastError}` : ''}`}
        </Text>
      )}
      <Text variant="caption" color="inkFaint" style={{ marginTop: space.sm }}>
        {`Sessions use: ${voice ?? 'auto-selected (best rank)'} · rate ${rate.toFixed(2)} · pitch ${pitch.toFixed(2)}`}
      </Text>
    </Section>
  );
}

// Live Activities status: iOS offers "Turn Off" right next to "Clear" when
// dismissing the lock-screen countdown, so users kill the feature by accident
// and the app can't turn it back on. This row says which state they're in and,
// when off, opens LangToll's page in the Settings app (the toggle lives under
// Settings → Apps → LangToll → Live Activities). Re-checks on foreground so it
// updates the moment they come back.
function LiveActivityStatus() {
  const theme = useTheme();
  const t = useT();
  const appState = useAppState();
  const [enabled, setEnabled] = useState(() => areActivitiesEnabled());
  // Permission and presence are different facts: "enabled" without a running
  // pass means nothing is on screen NOW — saying only "enabled" read as "you
  // should be seeing it", which is exactly how it confused its first user.
  const passRunning = isUnlocked(appState);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active') setEnabled(areActivitiesEnabled());
    });
    return () => sub.remove();
  }, []);

  if (enabled) {
    return (
      <View style={styles.switchRow}>
        <Ionicons name="checkmark-circle" size={20} color={theme.accent} />
        <Text variant="callout" color="inkSoft" style={{ flex: 1 }}>
          {t(passRunning ? 'settings.laEnabled' : 'settings.laIdle')}
        </Text>
      </View>
    );
  }
  return (
    <PressableScale onPress={openSystemSettings} style={styles.switchRow}>
      <Ionicons name="notifications-off-outline" size={20} color={theme.amber} />
      <Text variant="callout" style={{ flex: 1, color: theme.amber }}>
        {t('settings.laOff')}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={theme.amber} />
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
  const L = useLayout();
  const t = useT();
  const state = useAppState();

  const [nameDraft, setNameDraft] = useState(state.name ?? '');
  const [topicDraft, setTopicDraft] = useState('');
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState(false);

  const plus = isPlus(state);
  const audioAllowed = canUseAudio();
  const pack = activePack();

  async function generate() {
    if (!canUseAiTopics()) {
      openPaywall('settings_topics');
      return;
    }
    const topic = topicDraft.trim();
    if (!topic || generating) return;
    setGenerating(true);
    setAiError(false);
    try {
      const pack = await generateTopicPack(topic, effectiveLevel(), state.learningLanguage);
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
        <View style={[styles.header, band(L)]}>
          <PressableScale onPress={() => router.back()} style={styles.back} haptic={null}>
            <Ionicons name="arrow-back" size={22} color={theme.inkSoft} />
          </PressableScale>
          <Text variant="headline">{t('settings.title')}</Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.content, band(L)]}
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
                  onPress={() => openPaywall('settings')}
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
              keyboardAppearance={theme.scheme}
              autoCapitalize="words"
              style={[
                styles.input,
                { backgroundColor: theme.fill, borderColor: theme.line, color: theme.ink },
              ]}
            />
          </Section>

          {/* course */}
          <Section title={t('settings.course')}>
            {/* The learner's long-term goal. Free text gears every AI-generated
                pack toward it (lib/goal.ts -> /api/topics/generate); the four
                onboarding chips remain valid values and map to canonical
                phrases. t() renders both — unknown keys pass through. */}
            <Text variant="caption" color="inkFaint">
              {t('settings.goal')}
            </Text>
            <TextInput
              defaultValue={state.goal && !state.goal.startsWith('ob.') ? state.goal : ''}
              onEndEditing={(e) => {
                const text = e.nativeEvent.text.trim();
                // Empty input only clears a typed goal — it must not erase a chip choice.
                if (text || (state.goal && !state.goal.startsWith('ob.'))) {
                  updateProfile({ goal: text || null });
                  // Regenerate the goal's session pack — the visible effect.
                  void refreshGoalPack();
                }
              }}
              placeholder={
                state.goal?.startsWith('ob.')
                  ? t(state.goal as Parameters<typeof t>[0])
                  : t('settings.goalPlaceholder')
              }
              placeholderTextColor={theme.inkFaint}
              style={[styles.input, { borderColor: theme.line, color: theme.ink, marginBottom: space.lg }]}
              maxLength={120}
              returnKeyType="done"
            />
            {/* Speaker-gendered forms — same three-way choice as onboarding,
                editable later. null = show both variants. Hidden entirely for
                languages without the concept (de, en), and the examples follow
                the ACTIVE language — a German learner once saw Portuguese here. */}
            {SPEAKER_FORM_EXAMPLES[pack.language] && (
              <>
                <Text variant="caption" color="inkFaint">
                  {t('ob.formsTitle')}
                </Text>
                <View style={[styles.chipRow, { marginBottom: space.lg }]}>
                  <Chip
                    label={t('ob.formsM', { m: SPEAKER_FORM_EXAMPLES[pack.language]!.m })}
                    selected={state.forms === 'm'}
                    onPress={() => updateProfile({ forms: 'm' })}
                  />
                  <Chip
                    label={t('ob.formsF', { f: SPEAKER_FORM_EXAMPLES[pack.language]!.f })}
                    selected={state.forms === 'f'}
                    onPress={() => updateProfile({ forms: 'f' })}
                  />
                  <Chip
                    label={t('ob.formsBoth')}
                    selected={state.forms === null}
                    onPress={() => updateProfile({ forms: null })}
                  />
                </View>
              </>
            )}
            <Text variant="caption" color="inkFaint">
              {t('settings.level')}
            </Text>
            <View style={styles.chipRow}>
              {LEVELS.map((l) => {
                const locked = !canUseLevel(l);
                return (
                  <Chip
                    key={l}
                    label={l}
                    selected={effectiveLevel() === l}
                    locked={locked}
                    onPress={() => (locked ? openPaywall('settings_level') : updateProfile({ level: l }))}
                  />
                );
              })}
            </View>
            {levelWillRevert() && (
              <Text variant="caption" color="amber" style={{ marginTop: space.sm }}>
                {t('settings.levelRevertNote', { level: FREE_LEVELS[0] })}
              </Text>
            )}
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
                        d <= state.difficulty ? withAlpha(theme.accent, 0.16) : theme.fill,
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

          {/* fare — free can make it harder, only Plus can make it easier
              (lib/plans). Free picks from the free lists; the rest of the range
              is shown locked and routes to the paywall. */}
          <Section title={t('settings.fare')}>
            <Text variant="caption" color="inkFaint">
              {t('settings.fareEx')}
            </Text>
            <View style={styles.chipRow}>
              {FARE_EXERCISES.map((n) => {
                const locked = !canCustomizeLock() && !FREE_FARE_EXERCISES.includes(n);
                return (
                  <Chip
                    key={n}
                    label={`${n}`}
                    selected={effectiveExercisesPerUnlock() === n}
                    locked={locked}
                    onPress={() =>
                      locked ? openPaywall('settings_fare') : updateProfile({ exercisesPerUnlock: n })
                    }
                  />
                );
              })}
            </View>
            <Text variant="caption" color="inkFaint" style={{ marginTop: space.lg }}>
              {t('settings.fareMin')}
            </Text>
            {canCustomizeLock() ? (
              <FareSlider
                value={state.unlockMinutes}
                min={FARE_MINUTES_MIN}
                max={FARE_MINUTES_MAX}
                step={FARE_MINUTES_STEP}
                onChange={(n) => updateProfile({ unlockMinutes: n })}
                format={(n) => t('settings.fareMinValue', { min: n })}
                minLabel={t('settings.fareMinValue', { min: FARE_MINUTES_MIN })}
                maxLabel={t('settings.fareMinValue', { min: FARE_MINUTES_MAX })}
              />
            ) : (
              <View style={styles.chipRow}>
                {FREE_FARE_MINUTES.map((n) => (
                  <Chip
                    key={n}
                    label={t('settings.fareMinValue', { min: n })}
                    selected={effectiveUnlockMinutes() === n}
                    onPress={() => updateProfile({ unlockMinutes: n })}
                  />
                ))}
                <Chip
                  label={t('settings.fareAny', { min: FARE_MINUTES_MIN, max: FARE_MINUTES_MAX })}
                  selected={false}
                  locked
                  onPress={() => openPaywall('settings_fare')}
                />
              </View>
            )}
            {/* The downgrade, stated while it can still be avoided: a Plus fare
                outside the free lists falls back the day the plan lapses. */}
            {fareWillRevert() && (
              <Text variant="caption" color="amber" style={{ marginTop: space.md }}>
                {t('settings.fareRevertNote', {
                  exs: FREE_FARE_EXERCISES.join(` ${t('common.or')} `),
                  mins: FREE_FARE_MINUTES.join(` ${t('common.or')} `),
                  ex: freeExercises(state.exercisesPerUnlock),
                  min: freeMinutes(state.unlockMinutes),
                })}
              </Text>
            )}

            {/* strict mode: zero-grace re-lock (Plus) */}
            <View style={[styles.switchRow, { marginTop: space.lg }]}>
              <View style={{ flex: 1 }}>
                <Text variant="callout">{t('settings.strictMode')}</Text>
                <Text variant="caption" color="inkFaint" style={{ marginTop: 2 }}>
                  {t('settings.strictModeDetail')}
                </Text>
              </View>
              {canUseStrictMode() ? (
                <Switch
                  value={state.strictMode}
                  onValueChange={(v) => updateProfile({ strictMode: v })}
                  trackColor={{ true: theme.accent, false: 'rgba(255,255,255,0.15)' }}
                  thumbColor="#FFFFFF"
                />
              ) : (
                <PressableScale onPress={() => openPaywall('settings_strict')} haptic={null}>
                  <Ionicons name="lock-closed" size={20} color={theme.inkFaint} />
                </PressableScale>
              )}
            </View>
          </Section>

          {/* lock-screen countdown (Live Activity) — status + recovery */}
          {activitySupported() && (
            <Section title={t('settings.liveActivities')}>
              <LiveActivityStatus />
            </Section>
          )}

          {/* voice */}
          <Section title={t('settings.voice')}>
            <View style={styles.switchRow}>
              <Text variant="callout" color="inkSoft" style={{ flex: 1 }}>
                {audioAllowed ? t('settings.voiceDetail') : t('plus.lockedCta')}
              </Text>
              {audioAllowed ? (
                <Switch
                  value={state.soundEnabled}
                  onValueChange={(v) => updateProfile({ soundEnabled: v })}
                  trackColor={{ true: theme.accent, false: 'rgba(255,255,255,0.15)' }}
                  thumbColor="#FFFFFF"
                />
              ) : (
                // Locked, not hidden: the row stays as a paywall entry point.
                <PressableScale onPress={() => openPaywall('settings_voice')} haptic={null}>
                  <Ionicons name="lock-closed" size={20} color={theme.inkFaint} />
                </PressableScale>
              )}
            </View>

            {audioAllowed && state.soundEnabled && (
              <>
                <Text variant="caption" color="inkFaint" style={{ marginTop: space.lg }}>
                  {t('settings.speechSpeed')}
                </Text>
                <View style={styles.chipRow}>
                  {SPEECH_SPEEDS.map((sp) => (
                    <Chip
                      key={sp.rate}
                      label={t(sp.labelKey)}
                      selected={(state.voiceRate ?? 0.7) === sp.rate}
                      onPress={() => updateProfile({ voiceRate: sp.rate })}
                    />
                  ))}
                </View>
              </>
            )}
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
              keyboardAppearance={theme.scheme}
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

          {/* Support code: the short, human-readable form of the anonymous device id. Sharing it
              is the USER'S choice — it's meaningless to anyone but us, and it's the only way
              support can see this install's state server-side (admin → Support lookup). */}
          <Section title={t('settings.support')}>
            <View style={[styles.topicRow, { borderColor: theme.line }]}>
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium">{t('settings.supportCode')}</Text>
                <Text variant="caption" color="inkFaint">
                  {t('settings.supportHint')}
                </Text>
              </View>
              <Text selectable variant="bodyMedium" color="accent" style={{ fontFamily: font.mono }}>
                {supportCode()}
              </Text>
            </View>
            {/* The way to reach a human. The support code rides along in the
                subject so the reply can start from the install, not from "hi". */}
            <PressableScale
              onPress={() =>
                Linking.openURL(
                  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`LangToll · ${supportCode()}`)}`
                )
              }
              haptic={null}
              accessibilityRole="link"
              style={[styles.topicRow, { borderColor: theme.line }]}
            >
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium">{t('settings.contact')}</Text>
                <Text variant="caption" color="inkFaint">
                  {SUPPORT_EMAIL}
                </Text>
              </View>
              <Ionicons name="mail-outline" size={20} color={theme.accent} />
            </PressableScale>
          </Section>

          {/* dev */}
          {DEV_TOOLS && <VoiceLab />}

          {DEV_TOOLS && (
            <View style={{ marginTop: space.xl, gap: space.sm }}>
              {/* Did the last unlock actually arm the background re-lock? iOS can
                  reject the DeviceActivity schedule, and before this was surfaced
                  the rejection vanished as an unhandled promise — the monitor
                  silently didn't exist and apps never re-locked in the background. */}
              <Text variant="caption" color={relockStatus()?.ok === false ? 'amber' : 'inkFaint'}>
                {(() => {
                  const r = relockStatus();
                  return r ? `Relock monitor @ ${r.at}: ${r.detail}` : 'Relock monitor: no unlock this launch yet';
                })()}
              </Text>
              {/* Store-capture rig: jump the course language and mint a pass so
                  the Dynamic Island + lock-screen Live Activity re-render in the
                  target language without replaying onboarding or a session per
                  shot. syncPassActivity rebuilds the deck, the pack label and
                  the activity from whatever the store now says. */}
              <Text variant="caption" color="inkFaint">
                Course language (dev)
              </Text>
              <View style={styles.chipRow}>
                {availableLanguages().map((l) => (
                  <Chip
                    key={l}
                    label={l.toUpperCase()}
                    selected={state.learningLanguage === l}
                    onPress={() => {
                      updateProfile({ learningLanguage: l });
                      syncPassActivity();
                    }}
                  />
                ))}
              </View>
              <Button
                label="Issue pass (dev)"
                variant="ghost"
                onPress={() => {
                  completeSession(effectiveUnlockMinutes());
                  grantUnlock(effectiveUnlockMinutes());
                  const started = syncPassActivity();
                  // The start result vanished silently before; a capture rig
                  // needs to say WHY the island didn't appear.
                  Alert.alert(
                    'Pass issued',
                    started
                      ? 'Live Activity started — check the island and lock screen.'
                      : `Live Activity did NOT start.\nSystem allows activities: ${areActivitiesEnabled() ? 'yes' : 'NO — check Settings → Apps → LangToll → Live Activities'}`
                  );
                }}
              />
              <Button
                label="Island stress test (dev)"
                variant="ghost"
                onPress={() => {
                  // Exactly AT the MAX_ISLAND_CHARS limit on both sides — the
                  // worst case the deck filter lets ship. If this pair renders
                  // whole (no ellipsis) on the real island, every shippable
                  // pair does. Needs a running pass.
                  const big: [string, string] = ['die Übersetzung', 'the translation'];
                  setWordRotation([big, big, big]);
                  advanceWordRotation();
                }}
              />
              <Button
                label={plus ? 'Downgrade to free (dev)' : 'Grant Plus (dev)'}
                variant="ghost"
                onPress={() => { applyEntitlement(!plus); scheduleTrialEndNotice(); }}
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
