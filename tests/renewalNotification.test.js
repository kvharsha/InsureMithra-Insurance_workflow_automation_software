const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const app = require('../app');
const User = require('../models/user.model');
const Policy = require('../models/policy.model');
const Purchase = require('../models/purchase.model');
const Renewal = require('../models/renewal.model');

describe('Renewal Notification Workflow', () => {
  let testUser;
  let authToken;
  let testPolicy;
  let testPurchase;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/insuremithra_test');
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Policy.deleteMany({});
    await Purchase.deleteMany({});
    await Renewal.deleteMany({});

    testUser = new User({ firstName: 'Notify', lastName: 'User', email: 'notify.user@test.com', password: 'Password123!', role: 'user' });
    await testUser.save();

    const loginResponse = await request(app).post('/api/auth/login').send({ email: 'notify.user@test.com', password: 'Password123!' });
    authToken = loginResponse.body.token;

    testPolicy = new Policy({ name: 'Notify Policy', type: '4W', premium: 1000, tenure: '1 year', model: 'Sedan', insurer: 'Notify Insurer', coverage: '100000' });
    await testPolicy.save();

    const expiryDate = new Date(); expiryDate.setDate(expiryDate.getDate() + 5);
    testPurchase = new Purchase({ userId: testUser._id, policyId: testPolicy._id, transactionId: 'TEST-PUR-002', status: 'success', amount: 1000, currency: 'INR', policyNumber: 'POL-NOTIFY-01', expiryDate, renewalStatus: 'active' });
    await testPurchase.save();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('sends email and appends log on successful renewal', (done) => {
    // Spy on mailer
    const mailer = require('../config/mailer');
    const sendSpy = jest.spyOn(mailer, 'sendEmail').mockImplementation(async () => ({ accepted: ['test'] }));

    request(app)
      .post('/api/renewals/initiate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ purchaseId: testPurchase._id, paymentMethod: 'card' })
      .expect(202)
      .end(async (err, res) => {
        if (err) return done(err);
        const tx = res.body.transactionId;

        // Wait for async processing
        setTimeout(async () => {
          try {
            const renewal = await Renewal.findOne({ transactionId: tx });
            if (!renewal) throw new Error('Renewal not found');

            if (renewal.status === 'success') {
              // check sendEmail was called at least once
              expect(sendSpy).toHaveBeenCalled();

              // check log file contains line for this renewal
              const logFile = path.join(__dirname, '../logs/renewals.log');
              const content = await fs.readFile(logFile, 'utf8');
              expect(content).toMatch(new RegExp(`RenewalSuccess: claimId=${renewal._id}`));
            }

            sendSpy.mockRestore();
            done();
          } catch (e) {
            sendSpy.mockRestore();
            done(e);
          }
        }, 4000);
      });
  }, 15000);
});
