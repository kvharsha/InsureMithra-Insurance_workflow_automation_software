const Purchase = require('../models/purchase.model');
const Policy = require('../models/policy.model');
const User = require('../models/user.model');
const generateTransactionId = require('../utils/generateTransactionId');
const generatePolicyPDF = require('../utils/generatePolicyPDF');
const { logger } = require('../config/logger');

// POST /api/purchase/initiate
// Body: { policyId }
const initiatePurchase = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { policyId } = req.body;
    if (!policyId) return res.status(400).json({ success: false, message: 'policyId is required' });

    const policy = await Policy.findById(policyId);
    if (!policy) return res.status(404).json({ success: false, message: 'Policy not found' });

    const transactionId = generateTransactionId('TX_');
    const purchase = new Purchase({ userId, policyId, transactionId, status: 'initiated', amount: policy.premium });
    await purchase.save();

    // Simulate processing asynchronously
    process.nextTick(() => simulateProcessing(purchase._id));

    return res.status(201).json({ success: true, message: 'Purchase initiated', data: { purchaseId: purchase._id, transactionId } });
  } catch (err) {
    logger.error('Error initiating purchase:', err);
    return res.status(500).json({ success: false, message: 'Error initiating purchase', error: err.message });
  }
};

// POST /api/purchase/complete
// Body: { purchaseId }
const completePurchase = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { purchaseId } = req.body;
    if (!purchaseId) return res.status(400).json({ success: false, message: 'purchaseId is required' });

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) return res.status(404).json({ success: false, message: 'Purchase not found' });
    if (purchase.userId.toString() !== userId.toString()) return res.status(403).json({ success: false, message: 'Forbidden' });

    // If already processed
    if (purchase.status === 'success') return res.status(200).json({ success: true, message: 'Already completed', data: purchase });
    if (purchase.status === 'failed') return res.status(400).json({ success: false, message: 'Purchase already failed' });

    // Mark success and generate policy number + PDF
    purchase.status = 'processing';
    await purchase.save();

    const policy = await Policy.findById(purchase.policyId);
    const user = await User.findById(purchase.userId);

    purchase.policyNumber = `POL${Date.now()}`;
    purchase.status = 'success';

    // Generate PDF
    try {
      const pdfPath = await generatePolicyPDF({ purchase, user, policy });
      purchase.pdfPath = pdfPath;
    } catch (pdfErr) {
      logger.error('PDF generation failed:', pdfErr);
      // allow purchase to be success even if pdf fails
    }

    await purchase.save();

    return res.status(200).json({ success: true, message: 'Purchase completed', data: purchase });
  } catch (err) {
    logger.error('Error completing purchase:', err);
    return res.status(500).json({ success: false, message: 'Error completing purchase', error: err.message });
  }
};

// GET /api/purchase/:id
const getPurchase = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const { id } = req.params;
    const purchase = await Purchase.findById(id);
    if (!purchase) return res.status(404).json({ success: false, message: 'Purchase not found' });
    if (!userId || purchase.userId.toString() !== userId.toString()) return res.status(403).json({ success: false, message: 'Forbidden' });
    return res.status(200).json({ success: true, data: purchase });
  } catch (err) {
    logger.error('Error fetching purchase:', err);
    return res.status(500).json({ success: false, message: 'Error fetching purchase', error: err.message });
  }
};

// GET /api/purchase/:id/download
const downloadPDF = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    const { id } = req.params;
    const purchase = await Purchase.findById(id);
    if (!purchase) return res.status(404).json({ success: false, message: 'Purchase not found' });
    if (!userId || purchase.userId.toString() !== userId.toString()) return res.status(403).json({ success: false, message: 'Forbidden' });
    if (!purchase.pdfPath) return res.status(404).json({ success: false, message: 'PDF not available yet' });

    return res.sendFile(purchase.pdfPath);
  } catch (err) {
    logger.error('Error downloading PDF:', err);
    return res.status(500).json({ success: false, message: 'Error downloading PDF', error: err.message });
  }
};

// Simulate asynchronous processing with random delay 10-30s, fail if >120s from creation
async function simulateProcessing(purchaseId) {
  try {
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) return;

    // random delay
    const delay = 10000 + Math.floor(Math.random() * 20000); // 10-30s

    // if already processed, skip
    if (purchase.status !== 'initiated') return;

    // mark processing
    purchase.status = 'processing';
    await purchase.save();

    setTimeout(async () => {
      const now = Date.now();
      const created = new Date(purchase.createdAt).getTime();
      if ((now - created) > 120000) {
        purchase.status = 'failed';
        await purchase.save();
        return;
      }

      // complete purchase
      purchase.policyNumber = `POL${Date.now()}`;
      purchase.status = 'success';

      const policy = await Policy.findById(purchase.policyId);
      const user = await User.findById(purchase.userId);
      try {
        const pdfPath = await generatePolicyPDF({ purchase, user, policy });
        purchase.pdfPath = pdfPath;
      } catch (pdfErr) {
        logger.error('PDF generation failed during simulateProcessing:', pdfErr);
      }

      await purchase.save();
    }, delay);
  } catch (err) {
    logger.error('simulateProcessing error:', err);
  }
}

/**
 * GET /api/purchase/my
 * Get all purchases for the authenticated user
 */
const getUserPurchases = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const purchases = await Purchase.find({ userId })
      .populate('policyId', 'name type insurer premium model coverage')
      .sort({ createdAt: -1 });

    return res.status(200).json({ 
      success: true, 
      count: purchases.length,
      data: purchases 
    });
  } catch (err) {
    logger.error('Error fetching user purchases:', err);
    return res.status(500).json({ success: false, message: 'Error fetching purchases', error: err.message });
  }
};

module.exports = { initiatePurchase, completePurchase, getPurchase, downloadPDF, getUserPurchases };
