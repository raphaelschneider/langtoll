// Extends the Expo default Metro config to bundle the SQLite knowledge database
// (.db) as a static asset so it ships inside the app and can be seeded on first launch.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('db');

module.exports = config;
