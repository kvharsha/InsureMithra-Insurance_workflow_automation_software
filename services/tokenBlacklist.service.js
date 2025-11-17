const Redis = require('ioredis');

// Simple in-memory blacklist with optional Redis backing
class TokenBlacklist {
  constructor() {
    this.store = new Map(); // token -> expireAt(ms)

    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL);
    }
  }

  async add(token, ttlSeconds = 3600) {
    if (this.redis) {
      await this.redis.setex(`blacklist:${token}`, ttlSeconds, '1');
      return true;
    }

    const expireAt = Date.now() + ttlSeconds * 1000;
    this.store.set(token, expireAt);
    // schedule cleanup
    setTimeout(() => {
      this.store.delete(token);
    }, ttlSeconds * 1000 + 1000);
    return true;
  }

  async has(token) {
    if (!token) return false;
    if (this.redis) {
      const v = await this.redis.get(`blacklist:${token}`);
      return !!v;
    }

    const expireAt = this.store.get(token);
    if (!expireAt) return false;
    if (Date.now() > expireAt) {
      this.store.delete(token);
      return false;
    }
    return true;
  }

  // helper for tests
  clearAll() {
    this.store.clear();
    if (this.redis) return this.redis.flushdb();
    return Promise.resolve();
  }
}

module.exports = new TokenBlacklist();
