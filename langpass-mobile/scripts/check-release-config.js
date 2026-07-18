#!/usr/bin/env node
// Build-time tripwire, run by EAS as `eas-build-pre-install`.
//
// Why this exists: lib/purchases.ts falls back to a MOCK that grants Plus for
// free when EXPO_PUBLIC_REVENUECAT_IOS_KEY is unset. That fallback is correct in
// dev and catastrophic in a store build — and it is INVISIBLE at runtime, since
// the paywall renders identically either way. The only reliable place to catch a
// missing key is before the binary exists.
//
// Fails the build only for the `production` profile; dev/preview builds are meant
// to run mocked (they set EXPO_PUBLIC_DEV_TOOLS=1).
//
// Set the key as an EAS secret, never in eas.json — that file is committed:
//   eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value appl_xxx

const profile = process.env.EAS_BUILD_PROFILE;
if (profile !== 'production') {
  console.log(`[check-release-config] profile "${profile ?? 'local'}" — skipping production checks.`);
  process.exit(0);
}

const problems = [];

const rcKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
if (!rcKey) {
  problems.push(
    'EXPO_PUBLIC_REVENUECAT_IOS_KEY is not set. The app would ship with purchases\n' +
      '    mocked, granting Plus to every user for free and sending no purchase to Apple.\n' +
      '    Fix: eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value appl_xxx'
  );
} else if (!rcKey.startsWith('appl_')) {
  problems.push(
    `EXPO_PUBLIC_REVENUECAT_IOS_KEY does not look like an iOS SDK key (expected "appl_" prefix, got "${rcKey.slice(0, 6)}…").\n` +
      '    A secret/server key here would fail at runtime, not at build time.'
  );
}

if (process.env.EXPO_PUBLIC_DEV_TOOLS === '1') {
  problems.push(
    'EXPO_PUBLIC_DEV_TOOLS=1 in a production build. That re-enables the mock purchase\n' +
      '    path and the in-app dev controls. Remove it from the production profile.'
  );
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
if (!apiUrl) {
  problems.push('EXPO_PUBLIC_API_URL is not set — AI topic generation would have no backend.');
} else if (!apiUrl.startsWith('https://')) {
  problems.push(`EXPO_PUBLIC_API_URL is not https (got "${apiUrl}") — ATS will block it.`);
} else if (apiUrl.includes('-dev.')) {
  problems.push(`EXPO_PUBLIC_API_URL points at dev ("${apiUrl}") in a production build.`);
}

if (problems.length) {
  console.error('\n✗ Production build blocked — release configuration is unsafe:\n');
  problems.forEach((p, i) => console.error(`  ${i + 1}) ${p}\n`));
  process.exit(1);
}

console.log('✓ [check-release-config] production release configuration OK.');
