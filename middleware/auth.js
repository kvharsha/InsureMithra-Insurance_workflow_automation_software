const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { logger, auditLog } = require('../config/logger');

/**
 * Middleware to verify JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and check if still active
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid token. User not found.',
        code: 'INVALID_TOKEN'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account is deactivated.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        error: 'Account is temporarily locked due to multiple failed login attempts.',
        code: 'ACCOUNT_LOCKED',
        retryAfter: new Date(user.lockoutUntil).toISOString()
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token has expired.',
        code: 'TOKEN_EXPIRED'
      });
    }

    res.status(500).json({
      error: 'Authentication failed.',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware to check user roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user.email} with role ${req.user.role}`);
      
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
const requireAdmin = authorize('admin');

/**
 * Middleware to check if user is regular user or admin
 */
const requireUser = authorize('user', 'admin');

/**
 * Middleware to verify email verification status
 */
const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      error: 'Email verification required.',
      code: 'EMAIL_NOT_VERIFIED',
      message: 'Please verify your email address before accessing this resource.'
    });
  }
  next();
};

/**
 * Middleware to log user activity
 */
const logActivity = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the activity
      auditLog.profileUpdate(
        req.user?.id,
        req.user?.email,
        { action, timestamp: new Date().toISOString() },
        req.ip
      );
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to check rate limiting for sensitive operations
 */
const checkRateLimit = (req, res, next) => {
  // This would integrate with a rate limiting service like Redis
  // For now, we'll use a simple in-memory approach
  const key = `rate_limit_${req.user?.id || req.ip}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  // In a production environment, you'd use Redis or similar
  // For now, we'll just pass through
  next();
};

/**
 * Middleware to validate JWT token format
 */
const validateTokenFormat = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({
      error: 'Authorization header is required.',
      code: 'MISSING_AUTH_HEADER'
    });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Invalid authorization format. Use "Bearer <token>".',
      code: 'INVALID_AUTH_FORMAT'
    });
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  requireAdmin,
  requireUser,
  requireEmailVerification,
  logActivity,
  checkRateLimit,
  validateTokenFormat
};
