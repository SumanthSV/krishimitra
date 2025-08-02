import express from 'express';
import { query, validationResult } from 'express-validator';
import { getWeatherService } from '../services/weatherService';
import { getAIService } from '../services/aiService';
import Crop from '../models/Crop';
import logger from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * GET /api/advisories/crop
 * Get crop-specific advisories
 */
router.get('/crop', [
  query('cropId').notEmpty().withMessage('Crop ID is required'),
  query('state').notEmpty().withMessage('State is required'),
  query('district').notEmpty().withMessage('District is required'),
  query('stage').optional().isString()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { cropId, state, district, stage } = req.query;

  // Get crop information
  const crop = await Crop.findById(cropId);
  if (!crop) {
    return res.status(404).json({
      success: false,
      message: 'Crop not found'
    });
  }

  // Get weather data
  const weatherService = getWeatherService();
  const weatherData = await weatherService.getWeatherByLocation(state as string, district as string);

  // Generate advisories
  const advisories = [];

  // Weather-based advisories
  if (weatherData) {
    const currentTemp = weatherData.current.temperature;
    const humidity = weatherData.current.humidity;
    const precipitation = weatherData.current.precipitation;

    // Temperature advisories
    if (currentTemp > crop.climate.temperature.max) {
      advisories.push({
        type: 'weather',
        priority: 'high',
        title: 'High Temperature Alert',
        description: `Current temperature (${currentTemp}°C) is above optimal range for ${crop.name.en}. Consider increasing irrigation frequency and providing shade.`,
        actionItems: [
          'Increase irrigation frequency',
          'Apply mulch to conserve soil moisture',
          'Provide shade nets if possible'
        ]
      });
    }

    if (currentTemp < crop.climate.temperature.min) {
      advisories.push({
        type: 'weather',
        priority: 'high',
        title: 'Low Temperature Warning',
        description: `Current temperature (${currentTemp}°C) is below optimal range for ${crop.name.en}. Protect crops from cold damage.`,
        actionItems: [
          'Cover young plants',
          'Use frost protection methods',
          'Delay irrigation if frost is expected'
        ]
      });
    }

    // Humidity advisories
    if (humidity > 80) {
      advisories.push({
        type: 'disease',
        priority: 'medium',
        title: 'High Humidity Alert',
        description: 'High humidity increases risk of fungal diseases. Monitor crops closely.',
        actionItems: [
          'Improve air circulation',
          'Monitor for disease symptoms',
          'Consider preventive fungicide application'
        ]
      });
    }

    // Precipitation advisories
    if (precipitation > 20) {
      advisories.push({
        type: 'irrigation',
        priority: 'medium',
        title: 'Heavy Rainfall Advisory',
        description: 'Heavy rainfall expected. Ensure proper drainage and postpone fertilizer application.',
        actionItems: [
          'Check drainage systems',
          'Postpone fertilizer application',
          'Protect crops from waterlogging'
        ]
      });
    }
  }

  // Stage-specific advisories
  if (stage) {
    const stageAdvisories = generateStageSpecificAdvisories(crop, stage as string);
    advisories.push(...stageAdvisories);
  }

  // Pest management advisories
  const pestAdvisories = generatePestAdvisories(crop, weatherData);
  advisories.push(...pestAdvisories);

  res.json({
    success: true,
    data: {
      crop: crop.name,
      location: { state, district },
      advisories,
      lastUpdated: new Date()
    }
  });
}));

/**
 * GET /api/advisories/seasonal
 * Get seasonal advisories for a region
 */
router.get('/seasonal', [
  query('state').notEmpty().withMessage('State is required'),
  query('district').optional().isString(),
  query('month').optional().isInt({ min: 1, max: 12 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { state, district, month } = req.query;
  const currentMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;

  // Determine season
  let season;
  if (currentMonth >= 6 && currentMonth <= 10) season = 'kharif';
  else if (currentMonth >= 11 || currentMonth <= 3) season = 'rabi';
  else season = 'zaid';

  // Get suitable crops for the season and region
  const suitableCrops = await Crop.find({
    season,
    'regions.majorStates': state,
    isActive: true
  }).limit(10);

  // Generate seasonal advisories
  const advisories = [];

  // Sowing advisories
  if ((season === 'kharif' && currentMonth >= 6 && currentMonth <= 7) ||
      (season === 'rabi' && currentMonth >= 10 && currentMonth <= 12) ||
      (season === 'zaid' && currentMonth >= 3 && currentMonth <= 4)) {
    
    advisories.push({
      type: 'sowing',
      priority: 'high',
      title: `${season.charAt(0).toUpperCase() + season.slice(1)} Sowing Season`,
      description: `This is the optimal time for sowing ${season} crops in your region.`,
      crops: suitableCrops.map(crop => crop.name.en),
      actionItems: [
        'Prepare land for sowing',
        'Arrange quality seeds',
        'Check soil moisture',
        'Plan irrigation schedule'
      ]
    });
  }

  // Weather-based seasonal advisories
  const weatherService = getWeatherService();
  const weatherData = await weatherService.getWeatherByLocation(state as string, district as string);
  
  if (weatherData) {
    const seasonalWeatherAdvisories = generateSeasonalWeatherAdvisories(season, weatherData, currentMonth);
    advisories.push(...seasonalWeatherAdvisories);
  }

  res.json({
    success: true,
    data: {
      season,
      month: currentMonth,
      location: { state, district },
      suitableCrops: suitableCrops.map(crop => ({
        id: crop._id,
        name: crop.name,
        category: crop.category,
        duration: crop.duration
      })),
      advisories,
      lastUpdated: new Date()
    }
  });
}));

/**
 * GET /api/advisories/personalized
 * Get personalized advisories for authenticated user
 */
router.get('/personalized', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const advisories = [];

  // Location-based advisories
  if (user.profile?.farmLocation?.state && user.profile?.farmLocation?.district) {
    const weatherService = getWeatherService();
    const weatherData = await weatherService.getWeatherByLocation(
      user.profile.farmLocation.state,
      user.profile.farmLocation.district
    );

    if (weatherData) {
      const weatherAdvisories = await weatherService.getAgriculturalAdvisory(
        user.profile.farmLocation.state,
        user.profile.farmLocation.district,
        user.profile.crops
      );
      advisories.push(...weatherAdvisories);
    }
  }

  // Crop-specific advisories
  if (user.profile?.crops && user.profile.crops.length > 0) {
    for (const cropName of user.profile.crops) {
      const crop = await Crop.findOne({
        $or: [
          { 'name.en': new RegExp(cropName, 'i') },
          { 'name.hi': new RegExp(cropName, 'i') }
        ],
        isActive: true
      });

      if (crop) {
        const cropAdvisories = generateCropSpecificAdvisories(crop, user);
        advisories.push(...cropAdvisories);
      }
    }
  }

  // Experience-based advisories
  if (user.profile?.experience !== undefined) {
    const experienceAdvisories = generateExperienceBasedAdvisories(user.profile.experience);
    advisories.push(...experienceAdvisories);
  }

  res.json({
    success: true,
    data: {
      user: {
        name: user.name,
        location: user.profile?.farmLocation,
        crops: user.profile?.crops,
        experience: user.profile?.experience
      },
      advisories,
      lastUpdated: new Date()
    }
  });
}));

// Helper functions
function generateStageSpecificAdvisories(crop: any, stage: string): any[] {
  const advisories = [];

  switch (stage.toLowerCase()) {
    case 'sowing':
      advisories.push({
        type: 'cultivation',
        priority: 'high',
        title: 'Sowing Guidelines',
        description: `Follow proper sowing practices for ${crop.name.en}`,
        actionItems: [
          `Sow at depth: ${crop.cultivation.sowing.depth}`,
          `Maintain spacing: ${crop.cultivation.sowing.spacing}`,
          `Use seed rate: ${crop.cultivation.sowing.seedRate}`
        ]
      });
      break;

    case 'vegetative':
      advisories.push({
        type: 'nutrition',
        priority: 'medium',
        title: 'Vegetative Growth Care',
        description: 'Focus on nutrition and pest monitoring during vegetative growth',
        actionItems: [
          'Apply nitrogen fertilizer',
          'Monitor for pest damage',
          'Ensure adequate water supply'
        ]
      });
      break;

    case 'flowering':
      advisories.push({
        type: 'critical',
        priority: 'high',
        title: 'Flowering Stage Care',
        description: 'Critical stage requiring careful management',
        actionItems: [
          'Avoid water stress',
          'Monitor for flower drop',
          'Apply potassium fertilizer'
        ]
      });
      break;

    case 'harvest':
      advisories.push({
        type: 'harvest',
        priority: 'high',
        title: 'Harvest Timing',
        description: 'Optimal harvest timing for maximum yield and quality',
        actionItems: crop.harvest.indicators
      });
      break;
  }

  return advisories;
}

function generatePestAdvisories(crop: any, weatherData: any): any[] {
  const advisories = [];

  if (crop.cultivation?.pestManagement) {
    crop.cultivation.pestManagement.forEach((pest: any) => {
      // Weather-based pest risk assessment
      let riskLevel = 'low';
      
      if (weatherData) {
        const humidity = weatherData.current.humidity;
        const temperature = weatherData.current.temperature;

        if (pest.type === 'disease' && humidity > 80) {
          riskLevel = 'high';
        } else if (pest.type === 'insect' && temperature > 30) {
          riskLevel = 'medium';
        }
      }

      if (riskLevel !== 'low') {
        advisories.push({
          type: 'pest',
          priority: riskLevel,
          title: `${pest.pest} Risk Alert`,
          description: `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} risk of ${pest.pest} due to current weather conditions.`,
          symptoms: pest.symptoms,
          actionItems: [
            pest.prevention,
            pest.organicControl,
            'Monitor crops regularly'
          ]
        });
      }
    });
  }

  return advisories;
}

function generateSeasonalWeatherAdvisories(season: string, weatherData: any, month: number): any[] {
  const advisories = [];

  if (season === 'kharif' && month >= 6 && month <= 7) {
    advisories.push({
      type: 'seasonal',
      priority: 'medium',
      title: 'Monsoon Preparation',
      description: 'Prepare for monsoon season and kharif crop cultivation',
      actionItems: [
        'Clean drainage channels',
        'Prepare seedbeds',
        'Stock quality seeds',
        'Service farm equipment'
      ]
    });
  }

  if (season === 'rabi' && month >= 10 && month <= 11) {
    advisories.push({
      type: 'seasonal',
      priority: 'medium',
      title: 'Winter Crop Preparation',
      description: 'Optimal time for rabi crop sowing',
      actionItems: [
        'Prepare land after kharif harvest',
        'Apply organic manure',
        'Plan irrigation schedule',
        'Select appropriate varieties'
      ]
    });
  }

  return advisories;
}

function generateCropSpecificAdvisories(crop: any, user: any): any[] {
  const advisories = [];
  const currentMonth = new Date().getMonth() + 1;

  // Check if it's the right season for the crop
  const cropSeasons = {
    kharif: [6, 7, 8, 9, 10],
    rabi: [10, 11, 12, 1, 2, 3],
    zaid: [3, 4, 5, 6]
  };

  const seasonMonths = cropSeasons[crop.season as keyof typeof cropSeasons] || [];
  
  if (seasonMonths.includes(currentMonth)) {
    advisories.push({
      type: 'timing',
      priority: 'medium',
      title: `${crop.name.en} Season Active`,
      description: `Current month is suitable for ${crop.name.en} cultivation activities`,
      actionItems: [
        'Check soil preparation',
        'Monitor weather conditions',
        'Plan cultivation activities'
      ]
    });
  }

  return advisories;
}

function generateExperienceBasedAdvisories(experience: number): any[] {
  const advisories = [];

  if (experience < 2) {
    advisories.push({
      type: 'education',
      priority: 'low',
      title: 'Beginner Farmer Tips',
      description: 'Essential tips for new farmers',
      actionItems: [
        'Start with easy-to-grow crops',
        'Focus on soil health',
        'Learn about local weather patterns',
        'Connect with experienced farmers'
      ]
    });
  }

  return advisories;
}

export default router;