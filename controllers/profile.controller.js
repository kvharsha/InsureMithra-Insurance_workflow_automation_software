const User = require('../models/user.model');
const { logger, auditLog } = require('../config/logger');

/**
 * Get user profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get user profile.',
      code: 'PROFILE_ERROR'
    });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    console.log('Profile update request body:', req.body);
    console.log('Profile update request headers:', req.headers);
    const { firstName, lastName, phone, dateOfBirth, address } = req.body;
    
    // Get current user data for comparison
    const currentUser = await User.findById(req.user.id);
    const changes = {};

    // Prepare update object
    const updateData = {};
    
    if (firstName !== undefined) {
      updateData.firstName = firstName;
      if (currentUser.firstName !== firstName) changes.firstName = { from: currentUser.firstName, to: firstName };
    }
    
    if (lastName !== undefined) {
      updateData.lastName = lastName;
      if (currentUser.lastName !== lastName) changes.lastName = { from: currentUser.lastName, to: lastName };
    }
    
    if (phone !== undefined) {
      updateData.phone = phone;
      if (currentUser.phone !== phone) changes.phone = { from: currentUser.phone, to: phone };
    }
    
    if (dateOfBirth !== undefined) {
      updateData.dateOfBirth = dateOfBirth;
      if (currentUser.dateOfBirth?.toString() !== dateOfBirth) {
        changes.dateOfBirth = { from: currentUser.dateOfBirth, to: dateOfBirth };
      }
    }
    
    if (address !== undefined) {
      updateData.address = address;
      if (JSON.stringify(currentUser.address) !== JSON.stringify(address)) {
        changes.address = { from: currentUser.address, to: address };
      }
    }

    // Check if there are any changes
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'No changes provided.',
        code: 'NO_CHANGES'
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Log profile update
    auditLog.profileUpdate(req.user.id, req.user.email, changes, req.ip);

    logger.info(`Profile updated for user: ${req.user.email}`);

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        address: updatedUser.address,
        role: updatedUser.role,
        isEmailVerified: updatedUser.isEmailVerified,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Failed to update profile.',
      code: 'UPDATE_ERROR'
    });
  }
};

/**
 * Change password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Current password is incorrect.',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log password change
    auditLog.profileUpdate(req.user.id, req.user.email, { action: 'PASSWORD_CHANGE' }, req.ip);

    logger.info(`Password changed for user: ${req.user.email}`);

    res.json({
      message: 'Password changed successfully.'
    });

  } catch (error) {
    logger.error('Change password error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Failed to change password.',
      code: 'PASSWORD_CHANGE_ERROR'
    });
  }
};

/**
 * Deactivate account
 */
const deactivateAccount = async (req, res) => {
  try {
    const { password } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Password is incorrect.',
        code: 'INVALID_PASSWORD'
      });
    }

    // Deactivate account
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    // Log account deactivation
    auditLog.profileUpdate(req.user.id, req.user.email, { action: 'ACCOUNT_DEACTIVATED' }, req.ip);

    logger.info(`Account deactivated for user: ${req.user.email}`);

    res.json({
      message: 'Account deactivated successfully.'
    });

  } catch (error) {
    logger.error('Deactivate account error:', error);
    res.status(500).json({
      error: 'Failed to deactivate account.',
      code: 'DEACTIVATION_ERROR'
    });
  }
};

/**
 * Get user activity log (admin only)
 */
const getActivityLog = async (req, res) => {
  try {
    // This would typically fetch from an audit log collection
    // For now, we'll return a placeholder
    res.json({
      message: 'Activity log feature will be implemented in the monitoring module.',
      note: 'This endpoint is reserved for future implementation of user activity tracking.'
    });

  } catch (error) {
    logger.error('Get activity log error:', error);
    res.status(500).json({
      error: 'Failed to get activity log.',
      code: 'ACTIVITY_LOG_ERROR'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
  getActivityLog
};
