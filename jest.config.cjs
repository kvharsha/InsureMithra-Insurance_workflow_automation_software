module.exports = {
  testEnvironment: 'node',
  // Only run backend JS tests under tests/
  testMatch: ['**/tests/**/*.js'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  globalSetup: '<rootDir>/scripts/jest-global-setup.cjs',
  globalTeardown: '<rootDir>/scripts/jest-global-teardown.cjs',
  setupFiles: ['<rootDir>/scripts/jest-setup.cjs'],
  // Increase default timeout for slower environments
  testTimeout: 10000
};
