require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const { logger } = require('./config/logger');

const PORT = process.env.PORT || 5001;

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/insuremithra', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('Connected to MongoDB successfully');
  
  // Start server only after successful DB connection
  app.listen(PORT, () => {
    logger.info(`InsureMithra API server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
})
.catch((error) => {
  logger.error('MongoDB connection error:', error);
  process.exit(1);
});
