const express = require('express');
const router = express.Router();

const { searchPolicies } = require('../controllers/policy.controller');
const { authenticate, validateTokenFormat } = require('../middleware/auth');

// Protect all policy routes
router.use(validateTokenFormat);
router.use(authenticate);

// Search endpoint
router.get('/search', searchPolicies);

module.exports = router;


