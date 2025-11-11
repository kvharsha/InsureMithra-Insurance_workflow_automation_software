const Claim = require('../models/claim.model');
const Purchase = require('../models/purchase.model');
const generateClaimId = require('../utils/claimIdGenerator');
const storageService = require('../services/storage.service');
const { logger } = require('../config/logger');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const claimsLogPath = path.join(logsDir, 'claims.log');

/**
 * Log claim submission to claims.log
 */
function logClaimSubmission(userId, claimId, policyId, ipAddress) {
  const logEntry = JSON.stringify({
    timestamp: new Date().toISOString(),
    userId: userId.toString(),
    claimId,
    policyId: policyId.toString(),
    ip: ipAddress,
    action: 'CLAIM_SUBMITTED'
  }) + '\n';

  fs.appendFileSync(claimsLogPath, logEntry, 'utf8');
}

/**
 * POST /api/claims
 * Submit a new insurance claim with documents
 */
const submitClaim = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { policyId, reason } = req.body;
    const files = req.files;

    // Validation
    if (!policyId) {
      return res.status(400).json({ success: false, message: 'policyId is required' });
    }

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'reason is required' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one document is required' });
    }

    // Verify policy ownership - check if user has purchased this policy
    const purchase = await Purchase.findOne({ userId, policyId, status: 'success' });
    if (!purchase) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only submit claims for policies you have purchased' 
      });
    }

    // Generate unique claim ID
    const claimId = generateClaimId();

    // Store documents
    let documentMetadata;
    try {
      documentMetadata = await storageService.storeClaimDocuments(claimId, files);
    } catch (storageError) {
      logger.error('Error storing claim documents:', storageError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to store claim documents', 
        error: storageError.message 
      });
    }

    // Create claim record
    const claim = new Claim({
      claimId,
      userId,
      policyId,
      reason: reason.trim(),
      documents: documentMetadata,
      status: 'Submitted',
      audit: {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        submissionLocation: req.get('x-forwarded-for') || req.connection.remoteAddress
      }
    });

    await claim.save();

    // Log the submission
    logClaimSubmission(userId, claimId, policyId, claim.audit.ipAddress);

    logger.info(`Claim submitted successfully: ${claimId} by user ${userId}`);

    return res.status(200).json({
      success: true,
      claimId,
      message: 'Claim submitted successfully. You will be notified about the status.',
      data: {
        claimId,
        status: claim.status,
        submittedAt: claim.submittedAt,
        documentCount: documentMetadata.length
      }
    });

  } catch (error) {
    logger.error('Error submitting claim:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error submitting claim', 
      error: error.message 
    });
  }
};

/**
 * GET /api/claims
 * Get all claims for the authenticated user
 */
const getUserClaims = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const claims = await Claim.find({ userId })
      .populate('policyId', 'name type insurer premium')
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      count: claims.length,
      data: claims
    });

  } catch (error) {
    logger.error('Error fetching user claims:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching claims', 
      error: error.message 
    });
  }
};

/**
 * GET /api/claims/:claimId
 * Get details of a specific claim
 */
const getClaimById = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { claimId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const claim = await Claim.findOne({ claimId })
      .populate('policyId', 'name type insurer premium coverage')
      .populate('userId', 'firstName lastName email');

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    // Verify ownership (or admin access)
    if (claim.userId._id.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.status(200).json({
      success: true,
      data: claim
    });

  } catch (error) {
    logger.error('Error fetching claim:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching claim details', 
      error: error.message 
    });
  }
};

module.exports = {
  submitClaim,
  getUserClaims,
  getClaimById
};
