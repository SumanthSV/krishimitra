import express from 'express';
import { query, validationResult } from 'express-validator';
import axios from 'axios';
import logger from '../utils/logger';
import { getCacheService } from '../services/cacheService';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * GET /api/market/prices
 * Get current market prices for crops
 */
router.get('/prices', [
  query('crop').optional().isString(),
  query('state').optional().isString(),
  query('district').optional().isString(),
  query('market').optional().isString()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { crop, state, district, market } = req.query;
  const cacheService = getCacheService();

  // Build cache key
  const cacheKey = `market:prices:${crop || 'all'}:${state || 'all'}:${district || 'all'}:${market || 'all'}`;
  
  // Check cache first
  const cachedData = await cacheService.get(cacheKey);
  if (cachedData) {
    return res.json({
      success: true,
      data: JSON.parse(cachedData),
      cached: true
    });
  }

  // Mock market data (in production, this would fetch from government APIs)
  const marketData = generateMockMarketData(crop as string, state as string, district as string);

  // Cache for 1 hour
  await cacheService.setex(cacheKey, 3600, JSON.stringify(marketData));

  res.json({
    success: true,
    data: marketData,
    cached: false
  });
}));

/**
 * GET /api/market/trends
 * Get price trends for crops
 */
router.get('/trends', [
  query('crop').notEmpty().withMessage('Crop name is required'),
  query('days').optional().isInt({ min: 7, max: 365 }),
  query('state').optional().isString()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { crop, days = 30, state } = req.query;

  // Generate mock trend data
  const trendData = generateMockTrendData(crop as string, parseInt(days as string), state as string);

  res.json({
    success: true,
    data: trendData
  });
}));

/**
 * GET /api/market/forecast
 * Get price forecast for crops
 */
router.get('/forecast', [
  query('crop').notEmpty().withMessage('Crop name is required'),
  query('days').optional().isInt({ min: 1, max: 30 }),
  query('state').optional().isString()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { crop, days = 7, state } = req.query;

  // Generate mock forecast data
  const forecastData = generateMockForecastData(crop as string, parseInt(days as string), state as string);

  res.json({
    success: true,
    data: forecastData
  });
}));

/**
 * GET /api/market/mandis
 * Get nearby mandis/markets
 */
router.get('/mandis', [
  query('state').notEmpty().withMessage('State is required'),
  query('district').optional().isString(),
  query('radius').optional().isFloat({ min: 1, max: 200 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { state, district, radius = 50 } = req.query;

  // Mock mandi data
  const mandis = generateMockMandiData(state as string, district as string);

  res.json({
    success: true,
    data: mandis
  });
}));

// Helper functions to generate mock data
function generateMockMarketData(crop?: string, state?: string, district?: string) {
  const crops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'Potato', 'Onion', 'Tomato'];
  const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu'];
  
  const data = [];
  const targetCrops = crop ? [crop] : crops.slice(0, 5);

  targetCrops.forEach(cropName => {
    const basePrice = {
      'Rice': 2500,
      'Wheat': 2100,
      'Cotton': 6500,
      'Sugarcane': 350,
      'Maize': 1800,
      'Soybean': 4200,
      'Potato': 1200,
      'Onion': 2000,
      'Tomato': 2500
    }[cropName] || 2000;

    // Add some randomness
    const variation = (Math.random() - 0.5) * 0.3; // ±15%
    const currentPrice = Math.round(basePrice * (1 + variation));

    data.push({
      crop: cropName,
      variety: 'FAQ', // Fair Average Quality
      price: currentPrice,
      unit: 'quintal',
      market: `${district || 'Main'} Mandi, ${state || 'Punjab'}`,
      date: new Date().toISOString().split('T')[0],
      trend: Math.random() > 0.5 ? 'up' : 'down',
      change: Math.round((Math.random() - 0.5) * 200), // ±100 INR change
      volume: Math.round(Math.random() * 1000 + 100) // 100-1100 quintals
    });
  });

  return {
    prices: data,
    lastUpdated: new Date(),
    source: 'Government Market Data Portal'
  };
}

function generateMockTrendData(crop: string, days: number, state?: string) {
  const data = [];
  const basePrice = 2000;
  let currentPrice = basePrice;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Simulate price movement
    const change = (Math.random() - 0.5) * 100; // ±50 INR daily change
    currentPrice = Math.max(basePrice * 0.7, Math.min(basePrice * 1.3, currentPrice + change));

    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice),
      volume: Math.round(Math.random() * 500 + 100)
    });
  }

  return {
    crop,
    state: state || 'All India',
    period: `${days} days`,
    trends: data,
    analysis: {
      averagePrice: Math.round(data.reduce((sum, item) => sum + item.price, 0) / data.length),
      highestPrice: Math.max(...data.map(item => item.price)),
      lowestPrice: Math.min(...data.map(item => item.price)),
      volatility: 'Medium',
      recommendation: currentPrice > basePrice ? 'Good time to sell' : 'Consider holding'
    }
  };
}

function generateMockForecastData(crop: string, days: number, state?: string) {
  const data = [];
  const currentPrice = 2000;

  for (let i = 1; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    // Simulate forecast with some trend
    const trend = Math.sin(i / 7) * 50; // Weekly cycle
    const randomness = (Math.random() - 0.5) * 30;
    const forecastPrice = Math.round(currentPrice + trend + randomness);

    data.push({
      date: date.toISOString().split('T')[0],
      predictedPrice: forecastPrice,
      confidence: Math.round((0.9 - i * 0.02) * 100), // Decreasing confidence over time
      factors: [
        'Weather conditions',
        'Supply-demand balance',
        'Government policies',
        'Export demand'
      ]
    });
  }

  return {
    crop,
    state: state || 'All India',
    forecast: data,
    methodology: 'AI-based price prediction using historical data and market factors',
    disclaimer: 'Forecasts are estimates and actual prices may vary'
  };
}

function generateMockMandiData(state: string, district?: string) {
  const mandis = [
    {
      name: `${district || 'Central'} Mandi`,
      state,
      district: district || 'Main District',
      address: `Mandi Road, ${district || 'Central Area'}, ${state}`,
      coordinates: {
        latitude: 28.6139 + (Math.random() - 0.5) * 2,
        longitude: 77.2090 + (Math.random() - 0.5) * 2
      },
      facilities: ['Weighing', 'Storage', 'Banking', 'Transportation'],
      operatingHours: '6:00 AM - 6:00 PM',
      contact: {
        phone: '+91-98765-43210',
        email: `${district?.toLowerCase() || 'central'}.mandi@gov.in`
      },
      crops: ['Rice', 'Wheat', 'Cotton', 'Vegetables'],
      distance: Math.round(Math.random() * 30 + 5) // 5-35 km
    },
    {
      name: `${state} Agricultural Market`,
      state,
      district: district || 'Main District',
      address: `Market Complex, ${state}`,
      coordinates: {
        latitude: 28.6139 + (Math.random() - 0.5) * 2,
        longitude: 77.2090 + (Math.random() - 0.5) * 2
      },
      facilities: ['Weighing', 'Storage', 'Banking', 'Transportation', 'Quality Testing'],
      operatingHours: '5:00 AM - 8:00 PM',
      contact: {
        phone: '+91-98765-43211',
        email: `${state.toLowerCase()}.market@gov.in`
      },
      crops: ['All Major Crops'],
      distance: Math.round(Math.random() * 50 + 10) // 10-60 km
    }
  ];

  return mandis;
}

export default router;