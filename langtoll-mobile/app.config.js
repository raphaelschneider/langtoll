// Dynamic Expo config layered over app.json (Expo passes app.json's expo block in as `config`).
//
// App Transport Security. A Debug device build loads the Metro bundle over cleartext HTTP from the
// Mac. That connection cannot use the LAN here — the router does client isolation — so it goes over
// Tailscale, and Tailscale's 100.64/10 CGNAT range is NOT covered by the narrower
// NSAllowsLocalNetworking, which only exempts the RFC1918 private ranges, link-local and .local.
// Safari ignores ATS entirely, which is why the packager is reachable in the browser but not from
// the app. Hence NSAllowsArbitraryLoads, for dev builds only.
//
// Production gets NOTHING here: ATS stays fully enforced, so a store build is never relaxed and
// cannot draw an ATS-justification question at review.
//
// The signal is EXPO_PUBLIC_DEV_TOOLS — the same flag that gates mock purchases, the in-app dev
// levers and telemetry suppression. scripts/check-release-config.js fails a production build that
// sets it, so ATS cannot silently drift open on a build headed for the store.
//
// Ported from relift-mobile/app.config.js, which solved this first. That version also switches the
// App Attest environment off the same signal; App Attest is not wired into this app yet, so that
// half is deliberately omitted rather than copied dead.
const isDev = process.env.EXPO_PUBLIC_DEV_TOOLS === '1';

module.exports = ({ config }) => ({
  ...config,
  ios: {
    ...config.ios,
    infoPlist: {
      ...(config.ios && config.ios.infoPlist),
      // dev only — omitted entirely from production builds
      ...(isDev ? { NSAppTransportSecurity: { NSAllowsArbitraryLoads: true } } : {}),
    },
  },
});
