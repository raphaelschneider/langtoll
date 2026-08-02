// Reanimated 4 / Skia rely on the worklets Babel plugin, which must be listed last.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-worklets/plugin'],
  };
};
