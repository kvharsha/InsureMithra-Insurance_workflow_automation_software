const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { logger } = require('./config/logger');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const policyRoutes = require('./routes/policy.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const claimRoutes = require('./routes/claim.routes');
const { requireAdmin } = require('./middleware/roleAuth');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting for authentication endpoints (disabled for development)
if (process.env.NODE_ENV === 'production') {
  const authLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS) || 5, // limit each IP to 5 requests per windowMs
    message: {
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiting to auth routes only in production
  app.use('/api/auth', authLimiter);
} else {
  // Development: More lenient rate limiting
  const devAuthLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute in development
    message: {
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/auth', devAuthLimiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/insuremithra', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('Connected to MongoDB successfully');
})
.catch((error) => {
  logger.error('MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/claims', claimRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'InsureMithra API',
    version: '1.0.0'
  });
});

// Test-only endpoints (registered only in test environment)
if (process.env.NODE_ENV === 'test') {
  // A small test-only admin-protected route used by unit tests
  app.get('/__test/admin-only', requireAdmin, (req, res) => {
    res.json({ success: true, message: 'Admin access granted' });
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((error, req, res, _next) => {
  logger.error('Unhandled error:', error);
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = process.env.PORT || 3001;

// Only start listening when this file is the entry point. This prevents
// Jest or other test runners from keeping the server socket open when
// they `require('./server')` during tests. Tests should import the app
// and manage starting/stopping the server themselves if needed.
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`InsureMithra API server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
