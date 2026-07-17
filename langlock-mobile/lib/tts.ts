// Voice mode: on-device TTS via expo-speech in the language being learned. Free,
// offline, no API. The locale follows the active pack (de-DE, pt-BR, …). All
// entry points respect the profile's soundEnabled toggle so callers can just
// call speakGerman() unconditionally.
import * as Speech from 'expo-speech';
import { getState } from '@/lib/store';
import { activePack } from '@/lib/pack';

export function voiceEnabled(): boolean {
  return getState().soundEnabled;
}

/** Speak target-language text in the active pack's locale. No-op when voice is off. */
export function speakGerman(text: string, opts?: { force?: boolean; rate?: number }): void {
  if (!opts?.force && !voiceEnabled()) return;
  try {
    Speech.stop();
    Speech.speak(text, {
      language: activePack().speechLocale,
      rate: opts?.rate ?? 0.92,
      pitch: 1.0,
    });
  } catch {
    // TTS unavailable (some simulators) — stay silent
  }
}

export function stopSpeaking(): void {
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}
