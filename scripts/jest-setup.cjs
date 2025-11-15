/* eslint-env node,jest */
const fs = require('fs');
const path = require('path');

// Read the URI written by globalSetup and set process.env.MONGODB_URI synchronously
const infoPath = path.resolve(__dirname, '..', '.mongo-info.json');
if (fs.existsSync(infoPath)) {
  try {
    const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
    if (info && info.uri) {
        let uri = info.uri;
        // If Jest provides a worker id, use a worker-specific database name to
        // avoid cross-worker collisions when Jest runs tests in parallel or
        // when coverage spawns additional workers. We do this by appending
        // `-worker-<id>` to the database name in the URI.
        const workerId = process.env.JEST_WORKER_ID;
        if (workerId) {
          try {
            // Find the path start (after the host/port). Example: mongodb://host:27017/dbname?opts
            const idx = uri.indexOf('/', uri.indexOf('://') + 3);
            if (idx !== -1) {
              const before = uri.substring(0, idx + 1); // includes '/'
              const after = uri.substring(idx + 1);
              // after may contain 'dbname' or 'dbname?opts' or be empty
              const [dbAndMaybeOpts] = after.split('?');
              const currentDb = dbAndMaybeOpts || 'test';
              const rest = after.substring(dbAndMaybeOpts.length);
              const workerDb = `${currentDb}-worker-${workerId}`;
              uri = `${before}${workerDb}${rest}`;
            }
          } catch (e) {
            // If parsing fails, fall back to the provided URI; tests will still run
          }
        }
        process.env.MONGODB_URI = uri;
        // Also set a secondary env used elsewhere
        process.env.MONGO_URL = uri;
      // log for visibility in tests
      // console.log('jest-setup: set MONGODB_URI to', info.uri);
    }
  } catch {
    // ignore; tests will fallback to localhost
  }
}
