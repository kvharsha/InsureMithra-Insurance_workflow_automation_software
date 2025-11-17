const express = require('express');
const Downtime = require('../models/downtime.model');
const { runHealthCheck, getConfig } = require('../scheduler/downtimeMonitor');
const { getAllServiceStates } = require('../services/downtime.service');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleAuth');
const { logger } = require('../config/logger');

const router = express.Router();

/**
 * GET /admin/downtimes
 * Get downtime history (admin only)
 */
router.get('/downtimes', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50, service, status } = req.query;
    
    const query = {};
    if (service) query.service = service;
    if (status) query.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [incidents, total] = await Promise.all([
      Downtime.find(query)
        .sort({ startAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Downtime.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: {
        incidents,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    logger.error('Error fetching downtimes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch downtime history'
    });
  }
});

/**
 * POST /admin/downtimes/test
 * Manually trigger health check (admin only)
 */
router.post('/downtimes/test', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    logger.info(`Manual health check triggered by admin: ${req.user.email}`);
    
    // Run health check asynchronously
    const results = await runHealthCheck();
    
    res.json({
      success: true,
      message: 'Health check completed',
      data: {
        timestamp: new Date(),
        results,
        triggeredBy: req.user.email
      }
    });
    
  } catch (error) {
    logger.error('Error running manual health check:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run health check'
    });
  }
});

/**
 * GET /admin/downtimes/monitor/config
 * Get monitor configuration and status
 */
router.get('/downtimes/monitor/config', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const config = getConfig();
    const serviceStates = getAllServiceStates();
    
    res.json({
      success: true,
      data: {
        config,
        serviceStates,
        timestamp: new Date()
      }
    });
    
  } catch (error) {
    logger.error('Error fetching monitor config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch monitor configuration'
    });
  }
});

/**
 * GET /admin/downtimes/stats
 * Get downtime statistics
 */
router.get('/downtimes/stats', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const [
      totalIncidents,
      ongoingIncidents,
      recoveredIncidents,
      avgDuration
    ] = await Promise.all([
      Downtime.countDocuments({ startAt: { $gte: startDate } }),
      Downtime.countDocuments({ status: { $in: ['down', 'ongoing'] }, endAt: null }),
      Downtime.countDocuments({ status: 'recovered', startAt: { $gte: startDate } }),
      Downtime.aggregate([
        { $match: { status: 'recovered', durationMs: { $ne: null }, startAt: { $gte: startDate } } },
        { $group: { _id: null, avgDuration: { $avg: '$durationMs' } } }
      ])
    ]);
    
    // Get incidents grouped by service
    const byService = await Downtime.aggregate([
      { $match: { startAt: { $gte: startDate } } },
      { 
        $group: { 
          _id: '$service', 
          count: { $sum: 1 },
          totalDowntime: { $sum: '$durationMs' }
        } 
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        period: `Last ${days} days`,
        totalIncidents,
        ongoingIncidents,
        recoveredIncidents,
        avgDurationMs: avgDuration[0]?.avgDuration || 0,
        byService
      }
    });
    
  } catch (error) {
    logger.error('Error fetching downtime stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

/**
 * GET /admin/downtimes/:id
 * Get specific downtime incident details
 */
router.get('/downtimes/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  try {
    const incident = await Downtime.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({
        success: false,
        error: 'Incident not found'
      });
    }
    
    res.json({
      success: true,
      data: incident
    });
    
  } catch (error) {
    logger.error('Error fetching incident:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch incident details'
    });
  }
});

module.exports = router;
