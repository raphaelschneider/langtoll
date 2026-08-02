// Live Activity widget: the pass countdown in the Dynamic Island / lock screen.
// Picked up by @kingstinct/expo-apple-targets (already in the build via
// react-native-device-activity's plugin) from this directory on prebuild.
// ActivityKit needs 16.2; the app itself stays at 15.1 — only this target rises.
/** @type {import('@kingstinct/expo-apple-targets/build/config-plugin').ConfigFunction} */
module.exports = (config) => ({
  type: 'widget',
  name: 'PassActivity',
  deploymentTarget: '16.2',
  entitlements: {
    'com.apple.security.application-groups': ['group.com.langtoll.app'],
  },
});
