const express = require('express');
const router = express.Router();
const { submitClaim, getUserClaims, getClaimById } = require('../controllers/claim.controller');
const { authenticate, validateTokenFormat } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All claim endpoints require authentication
router.use(validateTokenFormat);
router.use(authenticate);

// POST /api/claims - Submit a new claim with documents
// Expects multipart/form-data with fields: policyId, reason, and files (documents)
router.post('/', upload.array('documents', 5), submitClaim);

// GET /api/claims - Get all claims for authenticated user
router.get('/', getUserClaims);

// GET /api/claims/:claimId - Get specific claim details
router.get('/:claimId', getClaimById);

module.exports = router;
