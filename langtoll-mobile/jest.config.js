// Unit tests for the pure modules under lib/ — the arithmetic and the date
// rules a simulator walk would never exercise at their edges. Only *.test.ts
// files run; screens and native modules are out of scope here. Native
// packages the store pulls in at load time are stubbed under test/mocks.
process.env.TZ = 'Europe/Lisbon';

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/ios/', '/android/', '/build/'],
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$': '<rootDir>/test/mocks/async-storage.ts',
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { diagnostics: false, tsconfig: { isolatedModules: true, jsx: 'react', module: 'commonjs' } }],
  },
};
