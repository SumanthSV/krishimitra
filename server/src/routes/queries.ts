import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getAIService } from '../services/aiService';
import { detectLanguage } from '../services/translationService';
import Query from '../models/Query';
import logger from '../utils/logger';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/queries/ask
 * Process a natural language query
 */
router.post('/ask', [
  body('query').notEmpty().withMessage('Query is required'),
  body('language').optional().isIn(['en', 'hi', 'pa', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml']),
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('location').optional().isObject(),
  body('context').optional().isObject()
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

    const { query: queryText, language, sessionId, location, context } = req.body;
    const userId = req.user?.id;

    // Detect language if not provided
    let detectedLanguage = language;
    if (!detectedLanguage) {
      detectedLanguage = await detectLanguage(queryText);
    }

    // Process query with AI service
    const aiService = getAIService();
    const response = await aiService.processQuery(queryText, detectedLanguage, {
      userId,
      sessionId,
      location,
      ...context
    });

    res.json({
      success: true,
      data: {
        query: queryText,
        language: detectedLanguage,
        response: response.text,
        confidence: response.confidence,
        category: response.category,
        sources: response.sources,
        relatedQueries: response.relatedQueries,
        actionItems: response.actionItems
      }
    });
  } catch (error) {
    logger.error('Error processing query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process query',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/queries/suggestions
 * Get query suggestions
 */
router.get('/suggestions', [
  query('language').optional().isIn(['en', 'hi', 'pa', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml']),
  query('location').optional().isObject()
], async (req, res) => {
  try {
    const { language = 'en', location } = req.query;
    const userId = req.user?.id;

    const aiService = getAIService();
    const suggestions = await aiService.getQuerySuggestions(
      userId,
      location as any,
      language as string
    );

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    logger.error('Error getting query suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get query suggestions'
    });
  }
});

/**
 * GET /api/queries/history
 * Get user's query history
 */
router.get('/history', authMiddleware, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isIn(['weather', 'crop', 'finance', 'market', 'pest', 'soil', 'irrigation', 'general'])
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

    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;

    const filter: any = { userId };
    if (category) {
      filter['context.category'] = category;
    }

    const queries = await Query.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-response.sources -response.actionItems'); // Exclude large fields

    const total = await Query.countDocuments(filter);

    res.json({
      success: true,
      data: {
        queries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error getting query history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get query history'
    });
  }
});

/**
 * POST /api/queries/:id/feedback
 * Submit feedback for a query response
 */
router.post('/:id/feedback', authMiddleware, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('helpful').isBoolean().withMessage('Helpful must be a boolean'),
  body('comments').optional().isString().isLength({ max: 500 })
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

    const queryId = req.params.id;
    const userId = req.user.id;
    const { rating, helpful, comments } = req.body;

    const queryDoc = await Query.findOne({ _id: queryId, userId });
    if (!queryDoc) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    queryDoc.feedback = {
      rating,
      helpful,
      comments,
      timestamp: new Date()
    };

    await queryDoc.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    logger.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

/**
 * GET /api/queries/popular
 * Get popular queries
 */
router.get('/popular', [
  query('language').optional().isIn(['en', 'hi', 'pa', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml']),
  query('category').optional().isIn(['weather', 'crop', 'finance', 'market', 'pest', 'soil', 'irrigation', 'general']),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { language = 'en', category, limit = 10 } = req.query;

    const matchStage: any = {
      isPublic: true,
      'feedback.rating': { $gte: 4 }
    };

    if (language) {
      matchStage['query.language'] = language;
    }

    if (category) {
      matchStage['context.category'] = category;
    }

    const popularQueries = await Query.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$query.text',
          count: { $sum: 1 },
          avgRating: { $avg: '$feedback.rating' },
          category: { $first: '$context.category' },
          sampleResponse: { $first: '$response.text' }
        }
      },
      {
        $sort: { count: -1, avgRating: -1 }
      },
      {
        $limit: parseInt(limit as string)
      }
    ]);

    res.json({
      success: true,
      data: popularQueries
    });
  } catch (error) {
    logger.error('Error getting popular queries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get popular queries'
    });
  }
});

/**
 * GET /api/queries/analytics
 * Get query analytics (admin only)
 */
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const analytics = await Query.aggregate([
      {
        $group: {
          _id: {
            category: '$context.category',
            language: '$query.language'
          },
          count: { $sum: 1 },
          avgConfidence: { $avg: '$response.confidence' },
          avgProcessingTime: { $avg: '$processingTime' },
          avgRating: { $avg: '$feedback.rating' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalQueries = await Query.countDocuments();
    const resolvedQueries = await Query.countDocuments({ isResolved: true });
    const avgRating = await Query.aggregate([
      { $match: { 'feedback.rating': { $exists: true } } },
      { $group: { _id: null, avgRating: { $avg: '$feedback.rating' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalQueries,
        resolvedQueries,
        resolutionRate: (resolvedQueries / totalQueries) * 100,
        avgRating: avgRating[0]?.avgRating || 0,
        categoryBreakdown: analytics
      }
    });
  } catch (error) {
    logger.error('Error getting query analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get query analytics'
    });
  }
});

export default router;