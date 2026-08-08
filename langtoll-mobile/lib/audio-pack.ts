// Pre-rendered pronunciation audio, fetched silently — the answer to "we're
// not going to make users download this manually."
//
// Apple's good voices exist but sit behind four Settings levels and a 400MB
// manual download (whose compact preview is bad enough that Anna reads as a
// man). There is no API to trigger that install, so the app stops depending
// on it: every authored word and sentence is rendered ONCE by a neural voice
// (scripts/gen-audio.js), hosted as static files, and fetched here on demand.
//
// Files are keyed sha1(lang + '|' + text): derived from the exact string the
// trainer speaks, so the lookup needs no id plumbing and sentences work the
// same as words. A cache hit plays natively; a miss falls back to on-device
// TTS and queues the download — first session may sound robotic, every one
// after is studio audio. AI topic packs have no files by construction and
// simply always fall back.
import * as FileSystem from 'expo-file-system/legacy';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { activePack } from '@/lib/pack';

const BASE_URL = process.env.EXPO_PUBLIC_AUDIO_URL ?? 'https://langtoll.app/audio-packs';
// JIT endpoint for AI-generated pack items — texts that didn't exist when the
// static corpus was rendered. The server synthesizes registered texts on first
// request and caches forever (langtoll-web /api/audio).
const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? null;

// Tiny pure-JS SHA-1 (no expo-crypto in the build). Audio keys only — nothing
// security-relevant hangs off this.
/* eslint-disable no-bitwise */
export function sha1(input: string): string {
  const utf8 = unescape(encodeURIComponent(input));
  const words: number[] = [];
  for (let i = 0; i < utf8.length; i++)
    words[i >> 2] = (words[i >> 2] ?? 0) | (utf8.charCodeAt(i) << (24 - (i % 4) * 8));
  words[utf8.length >> 2] = (words[utf8.length >> 2] ?? 0) | (0x80 << (24 - (utf8.length % 4) * 8));
  const bitLen = utf8.length * 8;
  const w = new Array<number>(80);
  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;
  const blocks = ((words.length + 2 + 15) >> 4) << 4;
  words[blocks - 1] = bitLen;
  words[blocks - 2] = 0;
  for (let b = 0; b < blocks; b += 16) {
    for (let i = 0; i < 16; i++) w[i] = words[b + i] ?? 0;
    for (let i = 16; i < 80; i++) {
      const n = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
      w[i] = (n << 1) | (n >>> 31);
    }
    let [a, bb, c, d, e] = [h0, h1, h2, h3, h4];
    for (let i = 0; i < 80; i++) {
      const f =
        i < 20 ? ((bb & c) | (~bb & d)) + 0x5a827999
        : i < 40 ? (bb ^ c ^ d) + 0x6ed9eba1
        : i < 60 ? ((bb & c) | (bb & d) | (c & d)) + 0x8f1bbcdc
        : (bb ^ c ^ d) + 0xca62c1d6;
      const t = (((a << 5) | (a >>> 27)) + f + e + w[i]) | 0;
      e = d; d = c; c = (bb << 30) | (bb >>> 2); bb = a; a = t;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + bb) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0; h4 = (h4 + e) | 0;
  }
  return [h0, h1, h2, h3, h4].map((n) => (n >>> 0).toString(16).padStart(8, '0')).join('');
}
/* eslint-enable no-bitwise */

function cacheDir(lang: string): string {
  return `${FileSystem.documentDirectory}audio-packs/${lang}/`;
}

function fileFor(lang: string, text: string): string {
  return `${cacheDir(lang)}${sha1(`${lang}|${text}`)}.mp3`;
}

function remoteFor(lang: string, text: string): string {
  return `${BASE_URL}/${lang}/${sha1(`${lang}|${text}`)}.mp3`;
}

// One player at a time — a new word interrupts the previous one, mirroring how
// stopSpeaking() works for TTS.
let player: AudioPlayer | null = null;

/** Misses already fetched this session — a 404 must not be retried per play. */
const misses = new Set<string>();
let downloading = 0;

/**
 * Play the pre-rendered file for `text` if it exists on disk, downloading for
 * next time when it doesn't. Resolves true when the file is playing (caller
 * skips TTS), false when the caller should speak via TTS now.
 *
 * ASYNC ON PURPOSE. The first version was synchronous and could only play
 * files already confirmed in the in-memory memo — so the FIRST play of every
 * text since launch fell back to TTS while the check completed behind it. The
 * trainer deliberately avoids repeating a text within a session, which made
 * "first play" nearly EVERY play: build 12 shipped with 195 correctly
 * downloaded files sitting unused on disk while every exercise spoke TTS.
 * A one-time getInfoAsync costs a few ms; the wrong voice costs the feature.
 */
export async function playPrerendered(text: string, opts?: { rate?: number }): Promise<boolean> {
  const lang = activePack().language;
  const path = fileFor(lang, text);

  let exists = cachedInfo.get(path);
  if (exists === undefined) {
    try {
      exists = (await FileSystem.getInfoAsync(path)).exists;
    } catch {
      exists = false;
    }
    cachedInfo.set(path, exists);
  }
  if (!exists) {
    console.log(`[audio] MISS ${lang} "${text.slice(0, 30)}" -> ${path.slice(-60)}`);
    void download(lang, text); // for next time; TTS covers this play
    return false;
  }
  console.log(`[audio] HIT ${lang} "${text.slice(0, 30)}"`);
  try {
    try {
      player?.remove();
    } catch {
      // replacing a finished player throws harmlessly
    }
    player = createAudioPlayer({ uri: path });
    // Speech-speed setting carries over to file playback where supported.
    if (opts?.rate && opts.rate !== 1) {
      try {
        player.setPlaybackRate(opts.rate);
      } catch {
        // natural speed is an acceptable fallback
      }
    }
    player.play();
    return true;
  } catch (e) {
    console.log(`[audio] PLAY threw: ${e instanceof Error ? e.message : String(e)}`);
    cachedInfo.set(path, false); // corrupt / evicted — refetch next time
    return false;
  }
}

export function stopPrerendered(): void {
  try {
    player?.remove();
  } catch {
    // already stopped
  }
  player = null;
}

/** exists-on-disk memo — getInfoAsync per play would thrash the bridge. */
const cachedInfo = new Map<string, boolean>();

async function download(lang: string, text: string): Promise<void> {
  const path = fileFor(lang, text);
  const key = `${lang}|${text}`;
  if (misses.has(key) || downloading > 6) return;
  downloading++;
  try {
    await FileSystem.makeDirectoryAsync(cacheDir(lang), { intermediates: true });
    // Static corpus first (Cloudflare-cached, covers all authored content) …
    //
    // 304 is the trap that broke TestFlight builds 12/13: iOS's URLCache keeps
    // an entry per audio URL, re-requests go out conditional, the server
    // correctly answers 304 Not Modified — and the old code read non-200 as
    // failure, DELETED the already-good local file, fell through to the JIT
    // route (404 for corpus texts) and marked the word a permanent miss. The
    // origin logs showed 473 x 304 while every exercise spoke robot TTS.
    // A 304 body is empty by spec, so it only counts as success if a real
    // file is already on disk; otherwise retry once with a cache-buster that
    // no URLCache entry can match.
    let res = await FileSystem.downloadAsync(remoteFor(lang, text), path);
    if (res.status === 304) {
      const kept = await FileSystem.getInfoAsync(path);
      if (kept.exists && (kept.size ?? 0) > 512) {
        console.log(`[audio] corpus 304, file intact for "${text.slice(0, 30)}"`);
        cachedInfo.set(path, true);
        return;
      }
      res = await FileSystem.downloadAsync(`${remoteFor(lang, text)}?cb=${Date.now()}`, path);
    }
    console.log(`[audio] corpus fetch ${res.status} for "${text.slice(0, 30)}"`);
    if (res.status === 200) {
      cachedInfo.set(path, true);
      return;
    }
    await FileSystem.deleteAsync(path, { idempotent: true });
    // … then the JIT endpoint for AI-generated items. Server-side it only
    // synthesizes texts registered by pack generation, so a 404 here is
    // final: this text has no audio anywhere.
    if (API_BASE) {
      const hash = sha1(`${lang}|${text}`);
      const jit = await FileSystem.downloadAsync(
        `${API_BASE}/api/audio?lang=${lang}&hash=${hash}`,
        path
      );
      if (jit.status === 200) {
        cachedInfo.set(path, true);
        return;
      }
      await FileSystem.deleteAsync(path, { idempotent: true });
    }
    misses.add(key); // no audio exists for this text — stop asking
  } catch (e) {
    console.log(`[audio] download THREW: ${e instanceof Error ? e.message : String(e)}`);
    // offline — retry naturally on a future play
  } finally {
    downloading--;
  }
}

/**
 * Background-fetch the active pack's audio, current material first. Fire and
 * forget from app launch / language change; bails quietly offline. Words
 * before sentences: they play in every exercise type, sentences only in two.
 */
export async function prefetchActivePack(limit = 400): Promise<void> {
  const pack = activePack();
  const texts = [...pack.vocab.map((v) => v.de), ...pack.sentences.map((s) => s.de)].slice(0, limit);
  for (const text of texts) {
    const path = fileFor(pack.language, text);
    if (cachedInfo.get(path) === true) continue;
    const stat = await FileSystem.getInfoAsync(path);
    cachedInfo.set(path, stat.exists);
    if (!stat.exists) await download(pack.language, text);
  }
}
