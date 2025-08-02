import express from 'express';
import { query, body, validationResult } from 'express-validator';
import Crop from '../models/Crop';
import logger from '../utils/logger';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/crops
 * Get all crops with filtering and pagination
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isIn(['cereal', 'pulse', 'oilseed', 'vegetable', 'fruit', 'spice', 'cash_crop', 'fodder']),
  query('season').optional().isIn(['kharif', 'rabi', 'zaid', 'perennial']),
  query('state').optional().isString(),
  query('search').optional().isString()
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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const { category, season, state, search } = req.query;

    // Build filter
    const filter: any = { isActive: true };
    
    if (category) filter.category = category;
    if (season) filter.season = season;
    if (state) filter['regions.majorStates'] = state;
    
    if (search) {
      filter.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.hi': { $regex: search, $options: 'i' } },
        { scientificName: { $regex: search, $options: 'i' } }
      ];
    }

    const crops = await Crop.find(filter)
      .sort({ 'name.en': 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-cultivation.pestManagement -varieties -researchLinks'); // Exclude large fields for list view

    const total = await Crop.countDocuments(filter);

    res.json({
      success: true,
      data: {
        crops,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error getting crops:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get crops data'
    });
  }
});

/**
 * GET /api/crops/:id
 * Get detailed information about a specific crop
 */
router.get('/:id', async (req, res) => {
  try {
    const cropId = req.params.id;
    
    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      data: crop
    });
  } catch (error) {
    logger.error('Error getting crop details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get crop details'
    });
  }
});

/**
 * GET /api/crops/recommendations
 * Get crop recommendations based on location and season
 */
router.get('/recommendations', [
  query('state').notEmpty().withMessage('State is required'),
  query('district').optional().isString(),
  query('season').optional().isIn(['kharif', 'rabi', 'zaid', 'perennial']),
  query('soilType').optional().isString(),
  query('farmSize').optional().isFloat({ min: 0 }),
  query('experience').optional().isIn(['beginner', 'intermediate', 'expert'])
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

    const { state, district, season, soilType, farmSize, experience } = req.query;

    // Build recommendation filter
    const filter: any = {
      isActive: true,
      'regions.majorStates': state
    };

    if (season) {
      filter.season = season;
    }

    if (soilType) {
      filter['soil.types'] = { $in: [soilType] };
    }

    // Get suitable crops
    let crops = await Crop.find(filter)
      .select('name scientificName category season yield economics regions')
      .limit(10);

    // Score crops based on various factors
    crops = crops.map((crop: any) => {
      let score = 0;
      
      // Season match
      if (season && crop.season === season) score += 30;
      
      // Profitability
      if (crop.economics?.profitability?.bcRatio > 1.5) score += 25;
      
      // Yield potential
      if (crop.yield?.potential > crop.yield?.average * 1.2) score += 20;
      
      // Experience level
      if (experience === 'beginner' && ['cereal', 'pulse'].includes(crop.category)) score += 15;
      if (experience === 'expert' && ['cash_crop', 'fruit'].includes(crop.category)) score += 15;
      
      // Farm size suitability
      if (farmSize) {
        const size = parseFloat(farmSize as string);
        if (size < 2 && ['vegetable', 'spice'].includes(crop.category)) score += 10;
        if (size > 5 && ['cereal', 'cash_crop'].includes(crop.category)) score += 10;
      }

      return {
        ...crop.toObject(),
        recommendationScore: score
      };
    });

    // Sort by recommendation score
    crops.sort((a, b) => b.recommendationScore - a.recommendationScore);

    res.json({
      success: true,
      data: crops.slice(0, 5) // Return top 5 recommendations
    });
  } catch (error) {
    logger.error('Error getting crop recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get crop recommendations'
    });
  }
});

/**
 * GET /api/crops/calendar
 * Get crop calendar for current month or specified month
 */
router.get('/calendar', [
  query('month').optional().isInt({ min: 1, max: 12 }),
  query('state').optional().isString(),
  query('year').optional().isInt({ min: 2020, max: 2030 })
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

    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const { state } = req.query;

    // Determine season based on month
    let season;
    if (month >= 6 && month <= 10) season = 'kharif';
    else if (month >= 11 || month <= 3) season = 'rabi';
    else season = 'zaid';

    const filter: any = { isActive: true, season };
    if (state) filter['regions.majorStates'] = state;

    const crops = await Crop.find(filter)
      .select('name category season duration cultivation.sowing')
      .limit(20);

    // Generate calendar events
    const calendarEvents = crops.map(crop => {
      const sowingMonths = this.getSowingMonths(crop.season);
      const harvestMonths = this.getHarvestMonths(crop.season, crop.duration);

      return {
        crop: crop.name,
        category: crop.category,
        season: crop.season,
        events: [
          {
            type: 'sowing',
            months: sowingMonths,
            description: `Sowing time for ${crop.name.en}`
          },
          {
            type: 'harvest',
            months: harvestMonths,
            description: `Harvest time for ${crop.name.en}`
          }
        ]
      };
    });

    res.json({
      success: true,
      data: {
        month,
        year,
        season,
        crops: calendarEvents
      }
    });
  } catch (error) {
    logger.error('Error getting crop calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get crop calendar'
    });
  }

  // Helper methods
  function getSowingMonths(season: string): number[] {
    switch (season) {
      case 'kharif': return [6, 7, 8]; // June-August
      case 'rabi': return [10, 11, 12]; // October-December
      case 'zaid': return [3, 4, 5]; // March-May
      default: return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Year-round
    }
  }

  function getHarvestMonths(season: string, duration: any): number[] {
    const sowingMonths = getSowingMonths(season);
    const durationMonths = Math.ceil(duration.max / 30); // Convert days to months
    
    return sowingMonths.map(month => {
      const harvestMonth = (month + durationMonths - 1) % 12 + 1;
      return harvestMonth;
    });
  }
});

/**
 * GET /api/crops/varieties/:cropId
 * Get varieties of a specific crop
 */
router.get('/varieties/:cropId', async (req, res) => {
  try {
    const cropId = req.params.cropId;
    
    const crop = await Crop.findById(cropId).select('name varieties');
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      data: {
        crop: crop.name,
        varieties: crop.varieties
      }
    });
  } catch (error) {
    logger.error('Error getting crop varieties:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get crop varieties'
    });
  }
});

/**
 * GET /api/crops/pest-management/:cropId
 * Get pest management information for a crop
 */
router.get('/pest-management/:cropId', async (req, res) => {
  try {
    const cropId = req.params.cropId;
    
    const crop = await Crop.findById(cropId).select('name cultivation.pestManagement');
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      data: {
        crop: crop.name,
        pestManagement: crop.cultivation.pestManagement
      }
    });
  } catch (error) {
    logger.error('Error getting pest management data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pest management data'
    });
  }
});

/**
 * GET /api/crops/economics/:cropId
 * Get economic analysis for a crop
 */
router.get('/economics/:cropId', [
  query('farmSize').optional().isFloat({ min: 0 }),
  query('location').optional().isString()
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

    const cropId = req.params.cropId;
    const farmSize = parseFloat(req.query.farmSize as string) || 1;
    
    const crop = await Crop.findById(cropId).select('name economics yield');
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Calculate economics for the specified farm size
    const economics = {
      farmSize,
      costOfCultivation: {
        perHectare: crop.economics.costOfCultivation.total,
        total: crop.economics.costOfCultivation.total * farmSize
      },
      expectedYield: {
        perHectare: crop.yield.average,
        total: crop.yield.average * farmSize,
        unit: crop.yield.unit
      },
      revenue: {
        perHectare: crop.economics.profitability.grossReturn,
        total: crop.economics.profitability.grossReturn * farmSize
      },
      profit: {
        perHectare: crop.economics.profitability.netReturn,
        total: crop.economics.profitability.netReturn * farmSize
      },
      bcRatio: crop.economics.profitability.bcRatio,
      breakeven: {
        yield: crop.economics.costOfCultivation.total / crop.economics.marketPrice.average,
        price: crop.economics.costOfCultivation.total / crop.yield.average
      }
    };

    res.json({
      success: true,
      data: {
        crop: crop.name,
        economics
      }
    });
  } catch (error) {
    logger.error('Error getting crop economics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get crop economics'
    });
  }
});

/**
 * POST /api/crops/compare
 * Compare multiple crops
 */
router.post('/compare', [
  body('cropIds').isArray({ min: 2, max: 5 }).withMessage('2-5 crop IDs required'),
  body('criteria').optional().isArray()
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

    const { cropIds, criteria = ['yield', 'profitability', 'duration', 'marketPrice'] } = req.body;

    const crops = await Crop.find({
      _id: { $in: cropIds },
      isActive: true
    }).select('name category season duration yield economics soil climate');

    if (crops.length !== cropIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more crops not found'
      });
    }

    // Prepare comparison data
    const comparison = {
      crops: crops.map(crop => ({
        id: crop._id,
        name: crop.name,
        category: crop.category,
        season: crop.season
      })),
      comparison: criteria.map((criterion: string) => {
        const data: any = { criterion, values: [] };
        
        crops.forEach(crop => {
          let value;
          switch (criterion) {
            case 'yield':
              value = crop.yield?.average || 0;
              data.unit = crop.yield?.unit || 'kg/ha';
              break;
            case 'profitability':
              value = crop.economics?.profitability?.netReturn || 0;
              data.unit = 'INR/ha';
              break;
            case 'duration':
              value = crop.duration?.max || 0;
              data.unit = 'days';
              break;
            case 'marketPrice':
              value = crop.economics?.marketPrice?.average || 0;
              data.unit = crop.economics?.marketPrice?.unit || 'INR/kg';
              break;
            default:
              value = 0;
          }
          
          data.values.push({
            cropId: crop._id,
            value
          });
        });
        
        return data;
      })
    };

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    logger.error('Error comparing crops:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compare crops'
    });
  }
});

/**
 * GET /api/crops/intercropping/:cropId
 * Get intercropping recommendations for a crop
 */
router.get('/intercropping/:cropId', async (req, res) => {
  try {
    const cropId = req.params.cropId;
    
    const crop = await Crop.findById(cropId).select('name intercropping');
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Get details of compatible crops
    const compatibleCrops = await Crop.find({
      'name.en': { $in: crop.intercropping.compatible },
      isActive: true
    }).select('name category yield economics');

    res.json({
      success: true,
      data: {
        mainCrop: crop.name,
        intercropping: {
          benefits: crop.intercropping.benefits,
          spacing: crop.intercropping.spacing,
          compatibleCrops
        }
      }
    });
  } catch (error) {
    logger.error('Error getting intercropping data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get intercropping data'
    });
  }
});

/**
 * GET /api/crops/rotation/:cropId
 * Get crop rotation recommendations
 */
router.get('/rotation/:cropId', async (req, res) => {
  try {
    const cropId = req.params.cropId;
    
    const crop = await Crop.findById(cropId).select('name rotation');
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Get details of rotation crops
    const previousCrops = await Crop.find({
      'name.en': { $in: crop.rotation.previous },
      isActive: true
    }).select('name category season');

    const nextCrops = await Crop.find({
      'name.en': { $in: crop.rotation.next },
      isActive: true
    }).select('name category season');

    res.json({
      success: true,
      data: {
        mainCrop: crop.name,
        rotation: {
          benefits: crop.rotation.benefits,
          previousCrops,
          nextCrops
        }
      }
    });
  } catch (error) {
    logger.error('Error getting crop rotation data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get crop rotation data'
    });
  }
});

export default router;