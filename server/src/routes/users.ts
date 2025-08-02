import express from 'express';
import { body, query, validationResult } from 'express-validator';
import User from '../models/User';
import logger from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * GET /api/users/profile
 * Get current user profile
 */
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user.toJSON()
  });
}));

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', [
  body('name').optional().isString().isLength({ min: 1, max: 100 }),
  body('profile.farmSize').optional().isFloat({ min: 0 }),
  body('profile.farmLocation.state').optional().isString(),
  body('profile.farmLocation.district').optional().isString(),
  body('profile.farmLocation.village').optional().isString(),
  body('profile.crops').optional().isArray(),
  body('profile.experience').optional().isInt({ min: 0, max: 100 }),
  body('profile.preferredLanguage').optional().isIn(['en', 'hi', 'pa', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml']),
  body('preferences.notifications.weather').optional().isBoolean(),
  body('preferences.notifications.crops').optional().isBoolean(),
  body('preferences.notifications.market').optional().isBoolean(),
  body('preferences.notifications.finance').optional().isBoolean()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Update user fields
  const allowedFields = ['name', 'profile', 'preferences'];
  allowedFields.forEach(field => {
    if (req.body[field]) {
      if (field === 'profile' || field === 'preferences') {
        user[field] = { ...user[field], ...req.body[field] };
      } else {
        user[field] = req.body[field];
      }
    }
  });

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user.toJSON()
  });
}));

/**
 * GET /api/users/farmers-nearby
 * Get farmers in nearby areas
 */
router.get('/farmers-nearby', [
  query('radius').optional().isFloat({ min: 1, max: 100 }),
  query('state').optional().isString(),
  query('district').optional().isString()
], asyncHandler(async (req, res) => {
  const { radius = 50, state, district } = req.query;
  const currentUser = await User.findById(req.user.id);

  if (!currentUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  let query: any = {
    role: 'farmer',
    isActive: true,
    _id: { $ne: req.user.id }
  };

  // If user has coordinates, find nearby farmers
  if (currentUser.profile?.farmLocation?.coordinates) {
    const { latitude, longitude } = currentUser.profile.farmLocation.coordinates;
    
    query['profile.farmLocation.coordinates'] = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: radius * 1000 // Convert km to meters
      }
    };
  } else {
    // Fallback to state/district matching
    if (state) query['profile.farmLocation.state'] = state;
    if (district) query['profile.farmLocation.district'] = district;
  }

  const farmers = await User.find(query)
    .select('name profile.farmLocation profile.crops profile.experience')
    .limit(20);

  res.json({
    success: true,
    data: farmers
  });
}));

export default router;