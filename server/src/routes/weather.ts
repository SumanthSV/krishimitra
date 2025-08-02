import express from 'express';
import { query, validationResult } from 'express-validator';
import { getWeatherService } from '../services/weatherService';
import Weather from '../models/Weather';
import logger from '../utils/logger';

const router = express.Router();

/**
 * GET /api/weather/current
 * Get current weather by coordinates or location
 */
router.get('/current', [
  query('lat').optional().isFloat({ min: -90, max: 90 }),
  query('lon').optional().isFloat({ min: -180, max: 180 }),
  query('state').optional().isString(),
  query('district').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { lat, lon, state, district } = req.query;
    const weatherService = getWeatherService();

    let weatherData;

    if (lat && lon) {
      weatherData = await weatherService.getCurrentWeather(
        parseFloat(lat as string),
        parseFloat(lon as string)
      );
    } else if (state && district) {
      weatherData = await weatherService.getWeatherByLocation(
        state as string,
        district as string
      );
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either coordinates (lat, lon) or location (state, district) is required'
      });
    }

    if (!weatherData) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not found for the specified location'
      });
    }

    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    logger.error('Error getting current weather:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get weather data'
    });
  }
});

/**
 * GET /api/weather/forecast
 * Get weather forecast
 */
router.get('/forecast', [
  query('lat').optional().isFloat({ min: -90, max: 90 }),
  query('lon').optional().isFloat({ min: -180, max: 180 }),
  query('state').optional().isString(),
  query('district').optional().isString(),
  query('days').optional().isInt({ min: 1, max: 14 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { lat, lon, state, district, days = 7 } = req.query;
    const weatherService = getWeatherService();

    let forecastData;

    if (lat && lon) {
      forecastData = await weatherService.getWeatherForecast(
        parseFloat(lat as string),
        parseFloat(lon as string),
        parseInt(days as string)
      );
    } else if (state && district) {
      const weatherData = await weatherService.getWeatherByLocation(
        state as string,
        district as string
      );
      forecastData = weatherData?.forecast;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either coordinates (lat, lon) or location (state, district) is required'
      });
    }

    if (!forecastData) {
      return res.status(404).json({
        success: false,
        message: 'Forecast data not found for the specified location'
      });
    }

    res.json({
      success: true,
      data: forecastData
    });
  } catch (error) {
    logger.error('Error getting weather forecast:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get weather forecast'
    });
  }
});

/**
 * GET /api/weather/alerts
 * Get weather alerts for a region
 */
router.get('/alerts', [
  query('state').notEmpty().withMessage('State is required'),
  query('district').optional().isString(),
  query('severity').optional().isIn(['minor', 'moderate', 'severe', 'extreme'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { state, district, severity } = req.query;
    const weatherService = getWeatherService();

    const alerts = await weatherService.getWeatherAlerts(
      state as string,
      district as string
    );

    // Filter by severity if specified
    let filteredAlerts = alerts;
    if (severity) {
      filteredAlerts = alerts.filter(alert => alert.severity === severity);
    }

    res.json({
      success: true,
      data: filteredAlerts
    });
  } catch (error) {
    logger.error('Error getting weather alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get weather alerts'
    });
  }
});

/**
 * GET /api/weather/advisory
 * Get agricultural advisory based on weather
 */
router.get('/advisory', [
  query('state').notEmpty().withMessage('State is required'),
  query('district').notEmpty().withMessage('District is required'),
  query('crops').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { state, district, crops } = req.query;
    const weatherService = getWeatherService();

    const cropsArray = crops ? (crops as string).split(',').map(c => c.trim()) : undefined;

    const advisory = await weatherService.getAgriculturalAdvisory(
      state as string,
      district as string,
      cropsArray
    );

    res.json({
      success: true,
      data: advisory
    });
  } catch (error) {
    logger.error('Error getting agricultural advisory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get agricultural advisory'
    });
  }
});

/**
 * GET /api/weather/historical
 * Get historical weather data
 */
router.get('/historical', [
  query('state').notEmpty().withMessage('State is required'),
  query('district').notEmpty().withMessage('District is required'),
  query('startDate').isISO8601().withMessage('Valid start date is required'),
  query('endDate').isISO8601().withMessage('Valid end date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { state, district, startDate, endDate } = req.query;

    const historicalData = await Weather.find({
      'location.state': state,
      'location.district': district,
      'current.timestamp': {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      }
    })
    .sort({ 'current.timestamp': -1 })
    .limit(100);

    res.json({
      success: true,
      data: historicalData
    });
  } catch (error) {
    logger.error('Error getting historical weather data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get historical weather data'
    });
  }
});

/**
 * GET /api/weather/locations
 * Get available weather locations
 */
router.get('/locations', async (req, res) => {
  try {
    const locations = await Weather.distinct('location', { isActive: true });
    
    // Group by state
    const groupedLocations = locations.reduce((acc: any, location: any) => {
      if (!acc[location.state]) {
        acc[location.state] = [];
      }
      acc[location.state].push({
        district: location.district,
        name: location.name,
        coordinates: location.coordinates
      });
      return acc;
    }, {});

    res.json({
      success: true,
      data: groupedLocations
    });
  } catch (error) {
    logger.error('Error getting weather locations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get weather locations'
    });
  }
});

export default router;