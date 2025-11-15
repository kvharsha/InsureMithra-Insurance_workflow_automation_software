/* eslint-env node,jest */
const mongoose = require('mongoose');

// This script runs once per test file (setupFilesAfterEnv).
// We drop the database at the start of each test file to ensure test file
// isolation and to avoid duplicate-key errors when tests create users
// with identical emails across different test files.

module.exports = async () => {
  // Use the Jest global hooks which are available when this file is
  // executed as setupFilesAfterEnv. We register a beforeAll hook here.
  beforeAll(async () => {
    try {
      if (mongoose && mongoose.connection && mongoose.connection.readyState) {
        // Drop the database used by the current test process. This clears
        // any collections created by previous test files in the same
        // in-memory MongoDB instance.
        await mongoose.connection.dropDatabase();
      }
    } catch (e) {
      // Log but don't fail; tests will surface any real problems.
      console.warn('jest-setup-after-env: dropDatabase failed (ignored):', e && e.message);
    }
  });
  
  // Also drop the database before each individual test to avoid cases
  // where tests in the same file reuse identical seeded data and cause
  // duplicate-key errors. This ensures a clean slate for every `it`.
  beforeEach(async () => {
    try {
      if (mongoose && mongoose.connection && mongoose.connection.readyState) {
        await mongoose.connection.dropDatabase();
      }
    } catch (e) {
      console.warn('jest-setup-after-env: dropDatabase (beforeEach) failed (ignored):', e && e.message);
    }
  });

  // Ensure collections are cleared after each test. Using deleteMany on each
  // collection is more resilient than dropDatabase when Jest runs workers in
  // parallel or when other processes share the same in-memory server instance.
  // This avoids duplicate-key errors and reduces flakiness under coverage runs.
  afterEach(async () => {
    try {
      if (mongoose && mongoose.connection && mongoose.connection.readyState) {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
          // Skip internal system collections if present
          if (collection.collectionName.startsWith('system.')) continue;
          await collection.deleteMany({});
        }
      }
    } catch (e) {
      console.warn('jest-setup-after-env: afterEach cleanup failed (ignored):', e && e.message);
    }
  });
};
