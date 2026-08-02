// Generates the transit sound palette as small 16-bit PCM WAVs, so the app ships real SFX
// without sourcing external audio: a fare-gate accept beep, a stamp thunk, and a "doors
// closing" descending chime. Run once (or after tweaks): `node scripts/gen-sounds.js`.
// Deliberately short and quiet — cues, not jingles. Output lands in assets/sounds/.
const fs = require('fs');
const path = require('path');

const SR = 44100;
const OUT = path.join(__dirname, '..', 'assets', 'sounds');

function writeWav(name, samples) {
  const n = samples.length;
  const dataSize = n * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28); // byte rate
  buf.writeUInt16LE(2, 32); // block align
  buf.writeUInt16LE(16, 34); // bits
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log('wrote', name, `(${(dataSize / 1024).toFixed(1)} KB)`);
}

function tone(freq, ms, { attack = 0.004, release = 0.05, gain = 0.5, type = 'sine' } = {}) {
  const n = Math.floor((ms / 1000) * SR);
  const out = new Float64Array(n);
  const attN = Math.max(1, attack * SR);
  const relN = Math.max(1, release * SR);
  const relStart = n - relN;
  for (let i = 0; i < n; i++) {
    const p = (2 * Math.PI * freq * i) / SR;
    let v = type === 'square' ? Math.sign(Math.sin(p)) * 0.7 : Math.sin(p);
    let env = 1;
    if (i < attN) env = i / attN;
    if (i > relStart) env *= Math.max(0, (n - i) / relN);
    out[i] = v * env * gain;
  }
  return out;
}
function silence(ms) {
  return new Float64Array(Math.floor((ms / 1000) * SR));
}
function noise(ms, gain = 0.5) {
  const n = Math.floor((ms / 1000) * SR);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) out[i] = (Math.random() * 2 - 1) * gain * Math.max(0, (n - i) / n);
  return out;
}
function concat(...arrs) {
  const total = arrs.reduce((a, x) => a + x.length, 0);
  const out = new Float64Array(total);
  let o = 0;
  for (const a of arrs) {
    out.set(a, o);
    o += a.length;
  }
  return out;
}
function mix(a, b) {
  const out = a.slice();
  for (let i = 0; i < b.length && i < out.length; i++) out[i] = Math.max(-1, Math.min(1, out[i] + b[i]));
  return out;
}

fs.mkdirSync(OUT, { recursive: true });

// gate — a clean rising two-note "accepted" beep, like a fare gate opening.
writeWav('gate.wav', concat(
  tone(784, 70, { release: 0.04, gain: 0.42 }),   // G5
  silence(28),
  tone(1046, 120, { release: 0.08, gain: 0.42 }), // C6
));

// stamp — a short impact: a noise transient over a fast-decaying low tone.
writeWav('stamp.wav', mix(
  tone(150, 140, { attack: 0.001, release: 0.13, gain: 0.75 }),
  noise(16, 0.45),
));

// void — a descending "doors closing" two-note (denied / locked).
writeWav('void.wav', concat(
  tone(440, 90, { release: 0.05, gain: 0.4 }),    // A4
  silence(18),
  tone(294, 170, { release: 0.12, gain: 0.4 }),   // D4
));

console.log('done → assets/sounds/');
