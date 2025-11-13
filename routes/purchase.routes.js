const express = require('express');
const router = express.Router();
const { initiatePurchase, completePurchase, getPurchase, downloadPDF, getUserPurchases, createTestPurchase } = require('../controllers/purchase.controller');
const { authenticate, validateTokenFormat } = require('../middleware/auth');

// All purchase endpoints require valid token
router.use(validateTokenFormat);
router.use(authenticate);

router.post('/initiate', initiatePurchase);
router.post('/complete', completePurchase);
router.post('/create-test-purchase', createTestPurchase); // Test endpoint for renewal testing
router.get('/my', getUserPurchases); // Get user's purchases - must be before /:id route
router.get('/:id', getPurchase);
router.get('/:id/download', downloadPDF);

module.exports = router;
