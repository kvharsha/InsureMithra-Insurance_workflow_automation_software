const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
  getActivityLog,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  getSystemStats
} = require('../controllers/profile.controller');
const { authenticate, requireAdmin, validateTokenFormat } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  
  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Street address cannot exceed 100 characters'),
  
  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('City cannot exceed 50 characters'),
  
  body('address.state')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('State cannot exceed 50 characters'),
  
  body('address.zipCode')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('ZIP code cannot exceed 10 characters'),
  
  body('address.country')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Country cannot exceed 50 characters')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const deactivateAccountValidation = [
  body('password')
    .notEmpty()
    .withMessage('Password is required to deactivate account')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// All profile routes require authentication
router.use(validateTokenFormat);
router.use(authenticate);

// Profile management routes
router.get('/', getProfile);
router.put('/', updateProfile); // Removed validation middleware
router.post('/change-password', changePasswordValidation, handleValidationErrors, changePassword);
router.post('/deactivate', deactivateAccountValidation, handleValidationErrors, deactivateAccount);

// Admin only routes
router.get('/activity-log', requireAdmin, getActivityLog);
router.get('/admin/users', requireAdmin, getAllUsers);
router.get('/admin/users/:userId', requireAdmin, getUserById);
router.put('/admin/users/:userId/role', requireAdmin, updateUserRole);
router.put('/admin/users/:userId/status', requireAdmin, toggleUserStatus);
router.get('/admin/stats', requireAdmin, getSystemStats);

module.exports = router;
