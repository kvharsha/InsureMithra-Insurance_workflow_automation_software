module.exports = {
  testEnvironment: 'node',
  // Only run backend JS tests under tests/
  testMatch: ['**/tests/**/*.js'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  globalSetup: '<rootDir>/scripts/jest-global-setup.cjs',
  globalTeardown: '<rootDir>/scripts/jest-global-teardown.cjs',
  setupFiles: ['<rootDir>/scripts/jest-setup.cjs'],
  // Run after the test framework is installed in each test file. This file
  // will ensure a clean database per test file to avoid cross-suite state
  // (duplicate-key errors) and other flakiness.
  setupFilesAfterEnv: ['<rootDir>/scripts/jest-setup-after-env.cjs'],
  // Increase default timeout for slower environments
  testTimeout: 10000
};
