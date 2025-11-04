const Policy = require('../models/policy.model');
const { logger } = require('../config/logger');

// GET /api/policies/search
// Query params supported: type, model, insurer, minPrice, maxPrice
const searchPolicies = async (req, res) => {
  try {
    const { type, model, insurer, minPrice, maxPrice } = req.query;

    const filters = {};

    if (type) {
      // Exact match for type (case-insensitive)
      filters.type = new RegExp(`^${String(type).trim()}$`, 'i');
    }

    if (model) {
      // Partial match on model
      filters.model = new RegExp(String(model).trim(), 'i');
    }

    if (insurer) {
      filters.insurer = new RegExp(String(insurer).trim(), 'i');
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter = {};
      if (minPrice !== undefined && minPrice !== '') priceFilter.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') priceFilter.$lte = Number(maxPrice);
      if (Object.keys(priceFilter).length) filters.premium = priceFilter;
    }

    const policies = await Policy.find(filters).sort({ premium: 1 }).limit(1000);

    return res.status(200).json({ success: true, count: policies.length, data: policies });
  } catch (error) {
    logger.error('Error fetching policies:', error);
    return res.status(500).json({ success: false, message: 'Error fetching policies', error: error.message });
  }
};

module.exports = { searchPolicies };


