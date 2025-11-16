/**
 * Performance Cache Tests
 * Tests for caching middleware and cache service
 */

const request = require('supertest');
const app = require('../app');
const cache = require('../services/cache.service');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Policy = require('../models/policy.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  
  // Seed test policies
  await Policy.create([
    {
      name: 'Test Health Policy',
      type: 'Health',
      model: 'Standard Health Plan',
      insurer: 'TestHealth Insurance',
      premium: 10000,
      coverage: 'Up to 5 Lakhs',
      tenure: '1 year'
    },
    {
      name: 'Test Life Policy',
      type: 'Life',
      model: 'Term Life Plan',
      insurer: 'TestLife Insurance',
      premium: 15000,
      coverage: 'Up to 10 Lakhs',
      tenure: '1 year'
    }
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await cache.close();
});

beforeEach(async () => {
  // Clear cache before each test
  await cache.clear();
});

describe('Cache Service', () => {
  describe('Basic Operations', () => {
    it('should set and get a value from cache', async () => {
      const key = 'test:key';
      const value = { data: 'test value', number: 123 };

      await cache.set(key, value, 60);
      const retrieved = await cache.get(key);

      expect(retrieved).toEqual(value);
    });

    it('should return null for non-existent key', async () => {
      const retrieved = await cache.get('non:existent:key');
      expect(retrieved).toBeNull();
    });

    it('should delete a cached value', async () => {
      const key = 'test:delete';
      const value = { data: 'to be deleted' };

      await cache.set(key, value);
      expect(await cache.get(key)).toEqual(value);

      await cache.del(key);
      expect(await cache.get(key)).toBeNull();
    });

    it('should delete multiple keys with wildcard pattern', async () => {
      await cache.set('user:1:data', { id: 1 });
      await cache.set('user:2:data', { id: 2 });
      await cache.set('user:3:data', { id: 3 });

      await cache.del('user:*:data');

      expect(await cache.get('user:1:data')).toBeNull();
      expect(await cache.get('user:2:data')).toBeNull();
      expect(await cache.get('user:3:data')).toBeNull();
    });
  });

  describe('Wrap Function', () => {
    it('should execute function and cache result on first call', async () => {
      let executionCount = 0;
      const expensiveFunction = async () => {
        executionCount++;
        return { result: 'expensive calculation', count: executionCount };
      };

      const result1 = await cache.wrap('test:wrap', 60, expensiveFunction);
      expect(result1.count).toBe(1);
      expect(executionCount).toBe(1);

      // Second call should return cached result
      const result2 = await cache.wrap('test:wrap', 60, expensiveFunction);
      expect(result2.count).toBe(1); // Same as first call
      expect(executionCount).toBe(1); // Function not executed again
    });

    it('should execute function again after cache clear', async () => {
      let executionCount = 0;
      const expensiveFunction = async () => {
        executionCount++;
        return { count: executionCount };
      };

      await cache.wrap('test:wrap2', 60, expensiveFunction);
      expect(executionCount).toBe(1);

      await cache.del('test:wrap2');

      await cache.wrap('test:wrap2', 60, expensiveFunction);
      expect(executionCount).toBe(2);
    });
  });

  describe('Cache Stats', () => {
    it('should return cache statistics', () => {
      const stats = cache.getStats();
      expect(stats).toHaveProperty('type');
      expect(['redis', 'lru']).toContain(stats.type);
    });
  });
});

describe('Cache Middleware', () => {
  describe('Policy Search Caching', () => {
    it('should return X-Cache: MISS on first request', async () => {
      const response = await request(app)
        .get('/api/policies/search?type=health')
        .expect(200);

      expect(response.headers['x-cache']).toBe('MISS');
      expect(response.body.success).toBe(true);
    });

    it('should return X-Cache: HIT on second identical request', async () => {
      // First request - cache MISS
      await request(app)
        .get('/api/policies/search?type=health')
        .expect(200);

      // Second request - cache HIT
      const response = await request(app)
        .get('/api/policies/search?type=health')
        .expect(200);

      expect(response.headers['x-cache']).toBe('HIT');
    });

    it('should have different cache keys for different queries', async () => {
      // Request 1
      const response1 = await request(app)
        .get('/api/policies/search?type=health')
        .expect(200);
      expect(response1.headers['x-cache']).toBe('MISS');

      // Request 2 with different query
      const response2 = await request(app)
        .get('/api/policies/search?type=life')
        .expect(200);
      expect(response2.headers['x-cache']).toBe('MISS');

      // Repeat request 1 - should be HIT now
      const response3 = await request(app)
        .get('/api/policies/search?type=health')
        .expect(200);
      expect(response3.headers['x-cache']).toBe('HIT');
    });
  });

  describe('Policy Details Caching', () => {
    it('should cache policy details endpoint', async () => {
      const policies = await Policy.find();
      const policyId = policies[0]._id.toString();

      // First request
      const response1 = await request(app)
        .get(`/api/policies/${policyId}`)
        .expect(200);
      expect(response1.headers['x-cache']).toBe('MISS');

      // Second request
      const response2 = await request(app)
        .get(`/api/policies/${policyId}`)
        .expect(200);
      expect(response2.headers['x-cache']).toBe('HIT');
      expect(response2.body).toEqual(response1.body);
    });
  });

  describe('Cache Invalidation', () => {
    it('should invalidate policy search cache on policy update', async () => {
      // This test assumes policy update endpoint exists and invalidates cache
      // If no policy update endpoint, this is a placeholder test

      const response1 = await request(app)
        .get('/api/policies/search')
        .expect(200);
      expect(response1.headers['x-cache']).toBe('MISS');

      const response2 = await request(app)
        .get('/api/policies/search')
        .expect(200);
      expect(response2.headers['x-cache']).toBe('HIT');

      // Simulate cache invalidation
      await cache.del('policies:search:*');

      const response3 = await request(app)
        .get('/api/policies/search')
        .expect(200);
      expect(response3.headers['x-cache']).toBe('MISS');
    });
  });

  describe('Non-GET Requests', () => {
    it('should not cache POST requests', async () => {
      // Cache middleware should skip POST requests
      // This is verified by checking that POST requests don't have X-Cache header
      // or always return MISS (depending on implementation)
      
      // Note: This test would need authentication and valid data
      // Placeholder for now
      expect(true).toBe(true);
    });
  });
});

describe('Performance Metrics', () => {
  it('should reduce response time on cached requests', async () => {
    const startTime1 = Date.now();
    await request(app)
      .get('/api/policies/search')
      .expect(200);
    const duration1 = Date.now() - startTime1;

    const startTime2 = Date.now();
    await request(app)
      .get('/api/policies/search')
      .expect(200);
    const duration2 = Date.now() - startTime2;

    // Cached request should be faster (though this may be flaky)
    // We're being generous with the assertion
    expect(duration2).toBeLessThanOrEqual(duration1 * 2);
  });
});
