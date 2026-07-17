// Voice mode: on-device German TTS via expo-speech. Free, offline, no API.
// All entry points respect the profile's soundEnabled toggle so callers can
// just call speakGerman() unconditionally.
import * as Speech from 'expo-speech';
import { getState } from '@/lib/store';

export function voiceEnabled(): boolean {
  return getState().soundEnabled;
}

/** Speak a German string (stops anything already playing). No-op when voice is off. */
export function speakGerman(text: string, opts?: { force?: boolean; rate?: number }): void {
  if (!opts?.force && !voiceEnabled()) return;
  try {
    Speech.stop();
    Speech.speak(text, {
      language: 'de-DE',
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
