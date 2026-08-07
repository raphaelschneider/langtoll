#!/usr/bin/env node
/* global require, process, __dirname, Buffer, fetch, console, module */
// Renders every authored word and sentence to MP3 via OpenAI TTS — the source
// of the audio packs lib/audio-pack.ts fetches at runtime.
//
//   OPENAI_API_KEY_TTS=sk-... node scripts/gen-audio.js [lang ...]
//
// Output: ../langtoll-web/public/audio-packs/<lang>/<sha1(lang|text)>.mp3
// (served as static files by the landing host, cached by Cloudflare; the dir
// is gitignored — deploy.sh rsyncs the working tree, so generated audio ships
// on the next deploy without bloating git).
//
// Resumable by design: existing files are skipped, so a crashed or
// rate-limited run just gets re-run. A voice re-audition means deleting the
// language dir and regenerating (~$0.30/language).
//
// The key needs the `api.model.audio.request` scope — the chat-scoped prod key
// is refused (observed 2026-08-07). Falls back to OPENAI_API_KEY_PROD in
// langtoll-web/.env.local if OPENAI_API_KEY_TTS is unset there/in the shell.
const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CACHE = path.join(ROOT, '.audio-build');
const OUT_ROOT = path.join(ROOT, '..', 'langtoll-web', 'public', 'audio-packs');

// Speaker descriptions keyed by the packs' own speechLocale — the accent is a
// CONTENT decision (pt-BR is Brazilian, es-ES Castilian, en-GB British) and is
// read from packFor(lang).speechLocale at runtime, never assumed from the
// language name. "Portuguese" alone once produced European PT samples for a
// Brazilian-Portuguese app.
const LOCALE_SPEAKERS = {
  'de-DE': 'German (Germany)',
  'es-ES': 'Spanish (Spain, Castilian)',
  'fr-FR': 'French (France)',
  'it-IT': 'Italian (Italy)',
  'pt-BR': 'Brazilian Portuguese',
  'en-GB': 'British English',
};
// One consistent voice across all languages — switching voices per language
// would make the app feel like six different apps.
const VOICE = process.env.TTS_VOICE || 'nova';
// Speaker-gendered forms (obrigado/obrigada, encantado/a, désolé(e)) keep the
// SAME voice as everything else: a female teacher doesn't become male to teach
// a man to say "obrigado" (the user's framing, and correct). The teaching
// lives in the content annotations — "(said by men)" / "(said by women)" on
// the items themselves — never in switching narrators.
const MODEL = process.env.TTS_MODEL || 'gpt-4o-mini-tts';
const CONCURRENCY = 4;

function loadKey() {
  if (process.env.OPENAI_API_KEY_TTS) return process.env.OPENAI_API_KEY_TTS;
  const env = path.join(ROOT, '..', 'langtoll-web', '.env.local');
  if (fs.existsSync(env)) {
    for (const name of ['OPENAI_API_KEY_TTS', 'OPENAI_API_KEY_PROD']) {
      const m = fs.readFileSync(env, 'utf8').match(new RegExp(`^\\s*${name}\\s*=\\s*(.+)$`, 'm'));
      if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    }
  }
  return null;
}

function compileContent() {
  // Same trick as the trainer verification harness: content has only type-level
  // imports, so it compiles standalone. Alias errors are noise; JS still emits.
  if (!fs.existsSync(path.join(CACHE, 'content', 'index.js'))) {
    console.log('compiling content …');
    const files = execSync(`find content -name '*.ts'`, { cwd: ROOT }).toString().trim().split('\n');
    execSync(
      `npx tsc --outDir ${CACHE} --module commonjs --target es2020 --skipLibCheck ` +
        `--esModuleInterop --moduleResolution node ${files.join(' ')} lib/locales.ts 2>/dev/null || true`,
      { cwd: ROOT, stdio: 'pipe' }
    );
  }
  const Module = require('module');
  const orig = Module._resolveFilename;
  Module._resolveFilename = function (request, ...rest) {
    if (request.startsWith('@/')) request = path.join(CACHE, request.slice(2));
    return orig.call(this, request, ...rest);
  };
  return require(path.join(CACHE, 'content', 'index.js'));
}

async function synthesize(key, langName, text) {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      voice: VOICE,
      input: text,
      response_format: 'mp3',
      instructions:
        `Speak as a native ${langName} speaker reading one vocabulary item to a language learner: ` +
        `clear, neutral, natural pace, no theatrics.`,
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const key = loadKey();
  if (!key) {
    console.error('no OpenAI key found (OPENAI_API_KEY_TTS or langtoll-web/.env.local)');
    process.exit(1);
  }
  const content = compileContent();
  const langs = process.argv.slice(2).length ? process.argv.slice(2) : content.availableLanguages();

  for (const lang of langs) {
    // Highest authored level carries every lower level's items? It does not —
    // packs are per-level; take the union across all levels, deduped by text.
    const texts = new Map();
    for (const level of ['A1', 'A2', 'B1', 'B2']) {
      let pack;
      try {
        pack = content.packFor(lang, level);
      } catch {
        continue;
      }
      if (!pack || pack.level !== level) continue; // packFor falls back — skip duplicates
      for (const v of pack.vocab) texts.set(v.de, true);
      for (const s of pack.sentences) texts.set(s.de, true);
    }
    const speechLocale = (() => {
      try { return content.packFor(lang, 'A1').speechLocale; } catch { return null; }
    })();
    const speaker = LOCALE_SPEAKERS[speechLocale];
    if (!speaker) {
      console.error(`${lang}: no speaker mapping for speechLocale ${speechLocale} — SKIPPING (add it to LOCALE_SPEAKERS)`);
      continue;
    }
    const outDir = path.join(OUT_ROOT, lang);
    fs.mkdirSync(outDir, { recursive: true });

    const todo = [...texts.keys()].filter(
      (t) => !fs.existsSync(path.join(outDir, `${crypto.createHash('sha1').update(`${lang}|${t}`).digest('hex')}.mp3`))
    );
    console.log(`${lang}: ${texts.size} items, ${todo.length} to render`);

    let done = 0, failed = 0;
    const queue = [...todo];
    await Promise.all(
      Array.from({ length: CONCURRENCY }, async () => {
        for (;;) {
          const text = queue.shift();
          if (text === undefined) return;
          const hash = crypto.createHash('sha1').update(`${lang}|${text}`).digest('hex');
          // 401s here are usually TRANSIENT: a scope change propagates unevenly
          // across OpenAI's edge for a while, so the same key alternates between
          // success and "missing scopes" (observed 2026-08-07: 3 renders, then a
          // 401, then renders again). Retry with backoff; only a persistently
          // failing item aborts the queue — that's a genuinely bad key.
          let lastErr = null;
          for (let attempt = 0; attempt < 5; attempt++) {
            try {
              const audio = await synthesize(key, speaker, text);
              fs.writeFileSync(path.join(outDir, `${hash}.mp3`), audio);
              if (++done % 50 === 0) console.log(`  ${lang}: ${done}/${todo.length}`);
              lastErr = null;
              break;
            } catch (e) {
              lastErr = e;
              const transient =
                String(e.message).startsWith('401') || String(e.message).startsWith('429') ||
                String(e.message).startsWith('5');
              if (!transient) break;
              await new Promise((r) => setTimeout(r, 15000 * (attempt + 1)));
            }
          }
          if (lastErr) {
            failed++;
            console.error(`  FAIL ${lang} ${JSON.stringify(text)}: ${lastErr.message}`);
            if (String(lastErr.message).startsWith('401')) {
              queue.length = 0; // five 401s in a row across 2.5 min — the key really is bad
            }
          }
        }
      })
    );
    console.log(`${lang}: rendered ${done}, failed ${failed}`);
  }
}

main();
