const Policy = require('../models/policy.model');
const { logger } = require('../config/logger');

// GET /api/policies/search
// Query: type, insurer, minPremium, maxPremium
const searchPolicies = async (req, res) => {
  try {
    const { type, insurer, minPremium, maxPremium } = req.query;

    const filter = { isActive: true };
    if (type) filter.type = new RegExp(`^${String(type).trim()}$`, 'i');
    if (insurer) filter.insurer = new RegExp(String(insurer).trim(), 'i');

    const price = {};
    if (minPremium !== undefined && minPremium !== '') price.$gte = Number(minPremium);
    if (maxPremium !== undefined && maxPremium !== '') price.$lte = Number(maxPremium);
    if (Object.keys(price).length) filter.premium = price;

    const results = await Policy.find(filter).sort({ premium: 1 }).limit(100);

    res.json({ results, count: results.length });
  } catch (error) {
    logger.error('Policy search failed:', error);
    res.status(500).json({ error: 'Policy search failed' });
  }
};

module.exports = { searchPolicies };


