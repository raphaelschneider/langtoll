// The transit sound palette — short, quiet cues that pair with the haptics. All fire-and-forget
// and all respect the iOS silent switch by default (the haptic covers the muted case), so we
// never blast audio at someone who silenced their phone. WAVs are synthesized by
// scripts/gen-sounds.js; message.mp3 is the authored chat chime.
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

const players: Record<string, AudioPlayer> = {};

function play(key: string, mod: number): void {
  try {
    if (!players[key]) players[key] = createAudioPlayer(mod);
    players[key].seekTo(0);
    players[key].play();
    // A chime is under a second; hand the audio focus back right after it so a
    // podcast in the background is not left ducked by a UI tick.
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      (require('@/lib/tts') as typeof import('@/lib/tts')).releaseAudioSession();
    }, 1500);
  } catch {
    // audio unavailable (web / asset / not-yet-linked) — silently skip; the haptic still fires
  }
}

/** Soft chime when a Sage message arrives — the "real chat app" touch. */
export function playMessageChime(): void {
  play('chime', require('../assets/sounds/message.mp3'));
}

/** Fare-gate accept: a rising two-note beep as the pass validates. */
export function playGate(): void {
  play('gate', require('../assets/sounds/gate.wav'));
}

/** The validation stamp landing — a short impact thunk. */
export function playStamp(): void {
  play('stamp', require('../assets/sounds/stamp.wav'));
}

/** Pass voided / locked — a descending "doors closing" two-note. */
export function playVoid(): void {
  play('void', require('../assets/sounds/void.wav'));
}
