const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user.model');

// Ensure the test route is registered on the app
const { requireAdmin } = require('../middleware/roleAuth');
// Register a simple protected route for testing
app.get('/__test/admin-only', requireAdmin, (req, res) => {
  res.json({ success: true, message: 'Admin access granted' });
});

describe('middleware/roleAuth', () => {
  let regularUser, adminUser, regularToken, adminToken;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/insuremithra_test');
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});

    regularUser = new User({
      firstName: 'Reg',
      lastName: 'User',
      email: 'reg.user@test.com',
      password: 'TestPass123!',
      role: 'user'
    });
    await regularUser.save();

    adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin.user@test.com',
      password: 'AdminPass123!',
      role: 'admin'
    });
    await adminUser.save();

    const regRes = await request(app).post('/api/auth/login').send({ email: regularUser.email, password: 'TestPass123!' });
    regularToken = regRes.body.token;

    const adminRes = await request(app).post('/api/auth/login').send({ email: adminUser.email, password: 'AdminPass123!' });
    adminToken = adminRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('allows admin to access admin-only route', async () => {
    const res = await request(app)
      .get('/__test/admin-only')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Admin access granted');
  });

  it('blocks regular user with 403', async () => {
    const res = await request(app)
      .get('/__test/admin-only')
      .set('Authorization', `Bearer ${regularToken}`)
      .expect(403);

    expect(res.body.message).toBe('Access denied');
  });

  it('blocks unauthenticated request with 401', async () => {
    const res = await request(app)
      .get('/__test/admin-only')
      .expect(401);

    // The authenticate middleware returns a structured error
    expect(res.body.error).toBeDefined();
  });
});
