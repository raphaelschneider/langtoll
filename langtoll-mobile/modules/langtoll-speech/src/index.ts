// JS surface for the native speech path. Mirrors what expo-speech gave us
// (voice/rate/pitch/volume) and adds the EQ chain, which is the reason this
// module exists — see the Swift file for why rendering beats speaking.
import { requireOptionalNativeModule } from 'expo';

export interface SpeakOptions {
  language?: string;
  /** AVSpeechSynthesisVoice identifier, e.g. com.apple.voice.enhanced.de-DE.Anna */
  voice?: string;
  /** Multiplier on AVSpeechUtteranceDefaultSpeechRate, matching expo-speech's scale. */
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * EQ chain applied to every utterance. Frequencies in Hz, gains in dB.
 * Defaults are set in Swift; anything omitted here keeps its current value.
 */
export interface Shaping {
  highPassHz?: number;
  lowMidHz?: number;
  lowMidGain?: number;
  presenceHz?: number;
  presenceGain?: number;
  /** Dynamic de-esser: band-split compression on the sibilance band only. */
  deEssHz?: number;
  deEssThresholdDb?: number;
  deEssRatio?: number;
  deEssMaxCutDb?: number;
  deEssAttackMs?: number;
  deEssReleaseMs?: number;
  outputGain?: number;
}

export interface SpeechDiagnostics {
  category: string;
  mode: string;
  sampleRate: number;
  outputVolume: number;
  engineRunning: boolean;
  engineReady: boolean;
  lastRenderFrames: number;
  lastPlayedThroughEQ: boolean;
  lastError: string;
  /** Peak gain reduction the de-esser applied to the last utterance, in dB. */
  lastDeEssPeakCutDb: number;
}

interface NativeSpeech {
  getDiagnostics(): Promise<SpeechDiagnostics>;
  configureSession(): Promise<void>;
  setShaping(opts: Shaping): Promise<void>;
  speak(text: string, opts: SpeakOptions): Promise<boolean>;
  stop(): Promise<void>;
}

// Optional: the module only exists in a dev/native build. On a stale binary or
// in Expo Go this is null, and callers fall back to expo-speech.
const native = requireOptionalNativeModule<NativeSpeech>('LangPassSpeech');

export const isNativeSpeechAvailable = (): boolean => native != null;

export async function configureSession(): Promise<void> {
  await native?.configureSession();
}

export async function setShaping(opts: Shaping): Promise<void> {
  await native?.setShaping(opts);
}

export async function speak(text: string, opts: SpeakOptions = {}): Promise<boolean> {
  return (await native?.speak(text, opts)) ?? false;
}

export async function getDiagnostics(): Promise<SpeechDiagnostics | null> {
  return (await native?.getDiagnostics()) ?? null;
}

export async function stop(): Promise<void> {
  await native?.stop();
}
