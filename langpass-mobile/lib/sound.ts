// A soft chime for when a Sage message arrives — the "real chat app" touch. Fire-and-forget, and
// it respects the iOS silent switch by default (the haptic buzz covers the silent case), so we
// never blast sound at someone who muted their phone.
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

let player: AudioPlayer | null = null;

export function playMessageChime(): void {
  try {
    if (!player) player = createAudioPlayer(require('../assets/sounds/message.mp3'));
    player.seekTo(0);
    player.play();
  } catch {
    // audio unavailable (web / asset / not-yet-linked) — silently skip; the haptic still fires
  }
}
