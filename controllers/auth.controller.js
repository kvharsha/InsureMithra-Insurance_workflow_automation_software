const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const { logger, auditLog } = require('../config/logger');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    console.log('Request headers:', req.headers);
    const { firstName, lastName, email, password, phone, dateOfBirth, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists with this email address.',
        code: 'USER_EXISTS'
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      address
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Log registration
    auditLog.profileUpdate(user._id, user.email, { action: 'REGISTRATION' }, req.ip);

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token,
      verificationToken // In production, send this via email
    });

  } catch (error) {
    console.log('Registration error details:', error);
    logger.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', errors);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Registration failed. Please try again.',
      code: 'REGISTRATION_ERROR'
    });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findByEmail(email);
    
    if (!user) {
      auditLog.failedLogin(email, req.ip, 'User not found');
      return res.status(401).json({
        error: 'Invalid email or password.',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      auditLog.accountLockout(email, req.ip);
      return res.status(423).json({
        error: 'Account is temporarily locked due to multiple failed login attempts.',
        code: 'ACCOUNT_LOCKED',
        retryAfter: new Date(user.lockoutUntil).toISOString()
      });
    }

    // Check if account is active
    if (!user.isActive) {
      auditLog.failedLogin(email, req.ip, 'Account deactivated');
      return res.status(401).json({
        error: 'Account is deactivated.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incLoginAttempts();
      auditLog.failedLogin(email, req.ip, 'Invalid password');
      
      return res.status(401).json({
        error: 'Invalid email or password.',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Reset failed login attempts on successful login
    if (user.failedLoginAttempts > 0) {
      await user.resetLoginAttempts();
    }

      const freshUser = await User.findByIdAndUpdate(
        user._id,
        { lastLogin: new Date() },
        { new: true }
      ).select('-password');

    // Generate JWT token
    const token = generateToken(user._id);

    // Log successful login
    auditLog.userLogin(user._id, user.email, req.ip, req.get('User-Agent'));

    logger.info(`User logged in: ${email}`);

    res.json({
      message: 'Login successful',
        user: {
          id: freshUser._id,
          firstName: freshUser.firstName,
          lastName: freshUser.lastName,
          email: freshUser.email,
          role: freshUser.role,
          isEmailVerified: freshUser.isEmailVerified,
          lastLogin: freshUser.lastLogin,
          phone: freshUser.phone,
          dateOfBirth: freshUser.dateOfBirth,
          address: freshUser.address,
          createdAt: freshUser.createdAt,
          updatedAt: freshUser.updatedAt
        },
      token
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed. Please try again.',
      code: 'LOGIN_ERROR'
    });
  }
};

/**
 * Logout user
 */
const logout = async (req, res) => {
  try {
    // Log logout
    auditLog.userLogout(req.user.id, req.user.email, req.ip);
    
    logger.info(`User logged out: ${req.user.email}`);

    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed.',
      code: 'LOGOUT_ERROR'
    });
  }
};

/**
 * Forgot password - send reset email
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Log password reset request
    auditLog.passwordReset(user._id, user.email, req.ip);

    // In production, send email with reset link
    // For now, we'll return the token (remove in production)
    logger.info(`Password reset requested for: ${email}, token: ${resetToken}`);

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
      resetToken // Remove this in production
    });

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Password reset request failed.',
      code: 'RESET_REQUEST_ERROR'
    });
  }
};

/**
 * Reset password with token
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired reset token.',
        code: 'INVALID_RESET_TOKEN'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;

    await user.save();

    // Log password reset
    auditLog.profileUpdate(user._id, user.email, { action: 'PASSWORD_RESET' }, req.ip);

    logger.info(`Password reset successful for: ${user.email}`);

    res.json({
      message: 'Password reset successful. You can now login with your new password.'
    });

  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      error: 'Password reset failed.',
      code: 'RESET_ERROR'
    });
  }
};

/**
 * Verify email with token
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired verification token.',
        code: 'INVALID_VERIFICATION_TOKEN'
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    logger.info(`Email verified for: ${user.email}`);

    res.json({
      message: 'Email verified successfully.'
    });

  } catch (error) {
    logger.error('Email verification error:', error);
    res.status(500).json({
      error: 'Email verification failed.',
      code: 'VERIFICATION_ERROR'
    });
  }
};

/**
 * Get current user profile
 */
const getMe = async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get user profile.',
      code: 'PROFILE_ERROR'
    });
  }
};

// For Story A, we won't send emails, but keep helper available if env exists
const { sendEmail } = require('../config/mailer');
module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getMe
};
