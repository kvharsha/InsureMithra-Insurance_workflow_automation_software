const express = require('express');
const router = express.Router();

const { searchPolicies, comparePolicies, getPolicyById } = require('../controllers/policy.controller');
const { authenticate, validateTokenFormat } = require('../middleware/auth');

// Public routes for browsing policies
// Search endpoint (public): GET /api/policies/search
router.get('/search', searchPolicies);

// Policy details endpoint (public): GET /api/policies/:id
router.get('/:id', getPolicyById);

// Protect all other policy routes
router.use(validateTokenFormat);
router.use(authenticate);

// Compare endpoint (authenticated): POST /api/policies/compare
router.post('/compare', comparePolicies);

module.exports = router;


