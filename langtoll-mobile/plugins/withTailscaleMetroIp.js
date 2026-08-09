// ios/ is gitignored (prebuild-managed), so the .xcode.env override that makes
// Debug device builds advertise the Tailscale address in ip.txt would be wiped
// by `expo prebuild --clean`. This plugin re-appends it on every prebuild.
//
// Why the override exists: react-native-xcode.sh writes ip.txt by probing
// en0-en8 (it ignores REACT_NATIVE_PACKAGER_HOSTNAME as of RN 0.81), so it
// always bakes the LAN IP — which the router's client isolation makes
// unreachable from the phone. See [[expo-device-debug-setup]] memory and the
// ATS half of this story in app.config.js.
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const MARKER = 'tailscale-metro-ip';

const SNIPPET = `
# BEGIN ${MARKER} (managed by plugins/withTailscaleMetroIp.js)
# Debug device builds: react-native-xcode.sh writes ip.txt by probing en0-en8,
# which yields the LAN IP — unreachable from the phone (router client
# isolation). Advertise the Tailscale address instead, derived live at build
# time. Falls back to stock behavior when tailscale is absent or down.
if [[ "$CONFIGURATION" = *Debug* && "$PLATFORM_NAME" != *simulator* ]]; then
  _ts_bin="$(command -v tailscale || echo /usr/local/bin/tailscale)"
  _ts_ip="$("$_ts_bin" ip -4 2>/dev/null | head -n 1)"
  if [[ -n "$_ts_ip" && -n "$CONFIGURATION_BUILD_DIR" ]]; then
    export SKIP_BUNDLING_METRO_IP=1
    mkdir -p "$CONFIGURATION_BUILD_DIR/$UNLOCALIZED_RESOURCES_FOLDER_PATH"
    echo "$_ts_ip" > "$CONFIGURATION_BUILD_DIR/$UNLOCALIZED_RESOURCES_FOLDER_PATH/ip.txt"
  fi
fi
# END ${MARKER}
`;

module.exports = function withTailscaleMetroIp(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const envPath = path.join(cfg.modRequest.platformProjectRoot, '.xcode.env');
      let contents = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
      if (!contents.includes(MARKER)) {
        fs.writeFileSync(envPath, contents + SNIPPET);
      }
      return cfg;
    },
  ]);
};
