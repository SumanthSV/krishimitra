import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import logger from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['farmer', 'advisor', 'vendor', 'financier', 'agri_expert', 'government_officer']),
  
  // Common profile fields
  body('profile.preferredLanguage').optional().isIn(['en', 'hi', 'pa', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml']),
  
  // Farmer-specific fields
  body('profile.farmLocation.state').optional().isString(),
  body('profile.farmLocation.district').optional().isString(),
  body('profile.farmLocation.village').optional().isString(),
  body('profile.farmSize').optional().isNumeric(),
  body('profile.farmParcels').optional().isNumeric(),
  body('profile.farmingType').optional().isIn(['crop', 'livestock', 'mixed', 'other']),
  body('profile.hasIrrigation').optional().isBoolean(),
  body('profile.hasSmartphone').optional().isBoolean(),
  
  // Financier-specific fields
  body('profile.organizationName').optional().isString(),
  body('profile.operationAreas').optional().isArray(),
  body('profile.loanTypes').optional().isArray(),
  
  // Vendor-specific fields
  body('profile.businessName').optional().isString(),
  body('profile.productTypes').optional().isArray(),
  body('profile.operatingLocations').optional().isArray()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { name, email, phone, password, role = 'farmer', profile } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email or phone number'
    });
  }

  // Create new user
  const user = new User({
    name,
    email,
    phone,
    password,
    role,
    profile: {
      ...profile,
      preferredLanguage: profile?.preferredLanguage || 'en'
    }
  });

  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.toJSON(),
      token
    }
  });
}));

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toJSON(),
      token
    }
  });
}));

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 */
router.post('/refresh', asyncHandler(async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Generate new token
    const newToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      data: { token: newToken }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}));

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

export default router;