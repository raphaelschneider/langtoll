// Voice mode: on-device TTS via expo-speech in the language being learned. Free,
// offline, no API. The locale follows the active pack (de-DE, pt-BR, …). All
// entry points respect the profile's soundEnabled toggle so callers can just
// call speakGerman() unconditionally.
//
// We pick the VOICE explicitly rather than passing only a language. Two reasons:
//
//  1. Quality. iOS ships a "compact" voice per language and only uses a better
//     "enhanced" one if you ask for it by identifier. Passing just a language
//     gets you the robotic default even when a good voice is sitting installed
//     on the device.
//  2. Correctness. If no voice for the target language exists, iOS does NOT
//     fail — it happily reads the text with whatever default it has, so a
//     Portuguese word comes out in an American accent. For a pronunciation
//     teacher that is worse than silence, so we stay quiet instead.
import * as Speech from 'expo-speech';
import { setAudioModeAsync } from 'expo-audio';
import { getState, updateProfile } from '@/lib/store';
import { activePack } from '@/lib/pack';
import { canUseAudio } from '@/lib/plans';
import {
  isNativeSpeechAvailable,
  speak as nativeSpeak,
  stop as nativeStop,
  configureSession as nativeConfigureSession,
  setShaping as nativeSetShaping,
  type Shaping,
} from '@/modules/langtoll-speech/src';

/**
 * Speaking rate; 1.0 is iOS's conversational speed. Learners at A1–B1 need the
 * word boundaries to survive, and native-pace speech blurs them. 0.6 was chosen
 * by ear on device: deliberately slow, because the learner is trying to
 * reproduce the sound, not follow a conversation. Users can shift this one step
 * either way via Settings → Speech speed; nothing else is exposed to them.
 */
const SPEECH_RATE = 0.7;

let voices: Speech.Voice[] | null = null;
let loading: Promise<void> | null = null;

/**
 * Load the device's voice list once. Called at startup so the first tap doesn't
 * race the lookup; safe to call repeatedly. Until it resolves, speak() falls
 * back to language-only selection rather than blocking on it.
 */
/**
 * Configure the audio session for speech playback. Without this the app runs on
 * iOS's default `soloAmbient` session, which means TTS is SILENCED BY THE RINGER
 * SWITCH — a learner with their phone on mute hears nothing and concludes the
 * app is broken. Pronunciation audio is the content, not a notification sound,
 * so it should play like a podcast does.
 *
 * Deliberately does NOT change lib/sound.ts's chime behaviour in spirit — that
 * comment says it respects the silent switch, but the session is global, so this
 * now applies to the chime too. That's the right trade: a muted phone should
 * still teach, and the chime is quiet enough not to be objectionable.
 */
export async function configureAudioSession(): Promise<void> {
  try {
    // Native gets us AVAudioSession MODE (.spokenAudio), which expo-audio cannot set.
    if (isNativeSpeechAvailable()) {
      await nativeConfigureSession();
      return;
    }
    await setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
      shouldPlayInBackground: false,
      allowsRecording: false,
    });
  } catch {
    // Non-fatal: worst case we keep the default session.
  }
}

export function primeVoices(): Promise<void> {
  if (voices) return Promise.resolve();
  if (!loading) {
    loading = Speech.getAvailableVoicesAsync()
      .then((v) => {
        voices = v ?? [];
      })
      .catch(() => {
        // Older simulators and some devices reject this outright. An empty list
        // means "we know nothing", and we degrade to letting iOS choose.
        voices = [];
      });
  }
  return loading;
}

type VoicePick = { identifier?: string; missing: boolean };

/**
 * Rank a voice by how good it will actually sound. We cannot trust the `quality`
 * field: expo-speech's iOS bridge collapses it to
 *   voice.quality == .enhanced ? "Enhanced" : "Default"
 * so iOS 16+'s PREMIUM tier — the best voices on the device — is reported as
 * "Default", indistinguishable from the robotic compact ones. The identifier
 * does carry the tier, so we read it from there instead.
 *
 * The other trap is Apple's Eloquence voices (com.apple.eloquence.*), the retro
 * novelty set shipped by default. They sort BEFORE com.apple.voice.* alphabetically,
 * so any naive tie-break picks a deliberately robotic voice. They rank last here.
 */
function voiceRank(v: Speech.Voice): number {
  const id = v.identifier.toLowerCase();
  if (id.includes('eloquence')) return 0; // novelty/retro — never if anything else exists
  if (id.includes('premium')) return 4;
  if (id.includes('enhanced') || v.quality === Speech.VoiceQuality.Enhanced) return 3;
  if (id.includes('siri')) return 2; // usually good, but not always selectable
  return 1; // compact / unknown
}

/**
 * Best installed voice for a BCP-47 locale. Prefers an exact locale match
 * (pt-BR over pt-PT), then the highest tier per voiceRank(), then sorts by
 * identifier so the choice is stable across launches — a voice that changes
 * between sessions sounds like a bug to the user.
 */
function pickVoice(locale: string): VoicePick {
  // List not loaded yet: let iOS pick. Not "missing" — we simply don't know.
  if (!voices || voices.length === 0) return { missing: false };

  const want = locale.toLowerCase();
  const lang = want.split('-')[0];
  const sameLanguage = voices.filter((v) => v.language?.toLowerCase().split('-')[0] === lang);
  if (sameLanguage.length === 0) return { missing: true };

  // Voice-lab override wins — but only if it belongs to the language we're
  // about to speak. A leftover German identifier must never read Portuguese.
  const override = getState().voiceOverride;
  if (override && sameLanguage.some((v) => v.identifier === override)) {
    return { identifier: override, missing: false };
  }

  const exact = sameLanguage.filter((v) => v.language?.toLowerCase() === want);
  const pool = exact.length ? exact : sameLanguage;
  const best = pool
    .slice()
    .sort((a, b) => voiceRank(b) - voiceRank(a) || a.identifier.localeCompare(b.identifier))[0];

  return { identifier: best?.identifier, missing: false };
}

/** Every installed voice for the active pack's language, best first — for the dev voice lab. */
export function voicesForActivePack(): { identifier: string; name: string; rank: number }[] {
  const want = activePack().speechLocale.toLowerCase();
  const lang = want.split('-')[0];
  return (voices ?? [])
    .filter((v) => v.language?.toLowerCase().split('-')[0] === lang)
    .slice()
    .sort((a, b) => voiceRank(b) - voiceRank(a) || a.identifier.localeCompare(b.identifier))
    .map((v) => ({ identifier: v.identifier, name: v.name, rank: voiceRank(v) }));
}

/** Speak with an explicit voice/rate/pitch, bypassing selection — dev voice lab only. */
export function speakWith(
  text: string,
  opts: { voice?: string; rate?: number; pitch?: number }
): void {
  try {
    const locale = activePack().speechLocale;
    // Must take the same path as real playback, or the lab auditions something
    // the app will never actually produce — in particular it would bypass the
    // EQ/de-ess chain entirely and every band would appear to do nothing.
    if (isNativeSpeechAvailable()) {
      void nativeStop();
      void nativeSpeak(text, {
        language: locale,
        voice: opts.voice,
        rate: opts.rate ?? SPEECH_RATE,
        pitch: opts.pitch ?? 1.0,
      });
      return;
    }
    Speech.stop();
    Speech.speak(text, {
      language: locale,
      ...(opts.voice ? { voice: opts.voice } : {}),
      rate: opts.rate ?? SPEECH_RATE,
      pitch: opts.pitch ?? 1.0,
    });
  } catch {
    // ignore
  }
}

/** True when the device has no voice at all for the active pack's language. */
export function voiceMissingForActivePack(): boolean {
  return pickVoice(activePack().speechLocale).missing;
}

/**
 * True when the best available voice is only the compact default — the hook for
 * prompting the user to install the enhanced voice in iOS Settings.
 */
export function voiceIsCompact(): boolean {
  const locale = activePack().speechLocale.toLowerCase();
  const lang = locale.split('-')[0];
  if (!voices || voices.length === 0) return false;
  const matches = voices.filter((v) => v.language?.toLowerCase().split('-')[0] === lang);
  return matches.length > 0 && !matches.some((v) => v.quality === Speech.VoiceQuality.Enhanced);
}

export function voiceEnabled(): boolean {
  return getState().soundEnabled;
}

/** Speak target-language text in the active pack's locale. No-op when voice is off. */
export function speakGerman(text: string, opts?: { force?: boolean; rate?: number }): void {
  // Plan gate first, and deliberately ahead of the `force` check: the replay
  // buttons pass force:true to bypass the user's mute toggle, and must not be
  // able to bypass the entitlement with it.
  if (!canUseAudio()) return;
  if (!opts?.force && !voiceEnabled()) return;
  try {
    const locale = activePack().speechLocale;
    const { identifier, missing } = pickVoice(locale);
    // Wrong-accent playback teaches the wrong thing; silence is the safer bug.
    if (missing) return;
    const s = getState();
    const rate = opts?.rate ?? s.voiceRate ?? SPEECH_RATE;
    const pitch = s.voicePitch ?? 1.0;

    // Native path renders to a buffer and pushes it through our EQ/de-ess chain
    // (modules/langtoll-speech). expo-speech is the fallback for a stale binary
    // that predates the module — same voice, just unprocessed.
    if (isNativeSpeechAvailable()) {
      void nativeStop();
      void nativeSpeak(text, { language: locale, voice: identifier, rate, pitch });
      return;
    }

    Speech.stop();
    Speech.speak(text, {
      language: locale,
      ...(identifier ? { voice: identifier } : {}),
      rate,
      pitch,
    });
  } catch {
    // TTS unavailable (some simulators) — stay silent
  }
}

/** Update the EQ/de-ess chain live AND persist it, so sessions use the same tuning. */
export function setSpeechShaping(shaping: Shaping): void {
  updateProfile({ voiceShaping: shaping as Record<string, number> });
  void nativeSetShaping(shaping);
}

/**
 * Push the persisted EQ back into the native module. The Swift side holds its
 * shaping in process memory, so without this every launch silently reverts to
 * the built-in defaults while the UI still shows the user's tuning.
 */
export function applyStoredShaping(): void {
  const stored = getState().voiceShaping;
  if (stored && isNativeSpeechAvailable()) void nativeSetShaping(stored as Shaping);
}

export function speechIsNative(): boolean {
  return isNativeSpeechAvailable();
}

export function stopSpeaking(): void {
  if (isNativeSpeechAvailable()) void nativeStop();
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}
