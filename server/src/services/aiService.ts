import OpenAI from 'openai';
import natural from 'natural';
import compromise from 'compromise';
import Sentiment from 'sentiment';
import logger from '../utils/logger';
import { translateText } from './translationService';
import Crop from '../models/Crop';
import Weather from '../models/Weather';
import Query from '../models/Query';

// Initialize AI services
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sentiment = new Sentiment();

// Query categories and their keywords
const queryCategories = {
  weather: ['weather', 'rain', 'temperature', 'humidity', 'wind', 'forecast', 'climate', 'monsoon', 'drought', 'flood'],
  crop: ['crop', 'plant', 'seed', 'harvest', 'sowing', 'cultivation', 'variety', 'yield', 'growth', 'farming'],
  pest: ['pest', 'disease', 'insect', 'fungus', 'virus', 'bacteria', 'weed', 'control', 'spray', 'treatment'],
  soil: ['soil', 'fertility', 'ph', 'nutrients', 'nitrogen', 'phosphorus', 'potassium', 'organic', 'compost'],
  irrigation: ['water', 'irrigation', 'drip', 'sprinkler', 'flood', 'moisture', 'drought', 'watering'],
  finance: ['loan', 'credit', 'subsidy', 'insurance', 'scheme', 'bank', 'money', 'cost', 'price', 'market'],
  market: ['price', 'market', 'sell', 'buy', 'demand', 'supply', 'mandi', 'trader', 'export', 'import']
};

// Multilingual keywords (Hindi examples)
const hindiKeywords = {
  weather: ['मौसम', 'बारिश', 'तापमान', 'आर्द्रता', 'हवा', 'पूर्वानुमान'],
  crop: ['फसल', 'पौधा', 'बीज', 'कटाई', 'बुवाई', 'खेती', 'किस्म', 'उपज'],
  pest: ['कीट', 'रोग', 'कीड़े', 'फफूंद', 'वायरस', 'खरपतवार', 'नियंत्रण', 'छिड़काव'],
  soil: ['मिट्टी', 'उर्वरता', 'पीएच', 'पोषक', 'नाइट्रोजन', 'फास्फोरस', 'पोटेशियम'],
  irrigation: ['पानी', 'सिंचाई', 'ड्रिप', 'स्प्रिंकलर', 'नमी', 'सूखा'],
  finance: ['ऋण', 'क्रेडिट', 'सब्सिडी', 'बीमा', 'योजना', 'बैंक', 'पैसा', 'कीमत'],
  market: ['मूल्य', 'बाजार', 'बेचना', 'खरीदना', 'मांग', 'आपूर्ति', 'मंडी']
};

export interface AIResponse {
  text: string;
  confidence: number;
  category: string;
  sources: Array<{
    type: string;
    title: string;
    url?: string;
    relevance: number;
  }>;
  relatedQueries: string[];
  actionItems?: Array<{
    type: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }>;
}

export class AIService {
  private tokenizer: any;
  private stemmer: any;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
  }

  /**
   * Process a natural language query and generate response
   */
  async processQuery(
    queryText: string,
    language: string = 'en',
    context?: {
      location?: { state: string; district: string; coordinates?: { latitude: number; longitude: number } };
      userId?: string;
      sessionId: string;
    }
  ): Promise<AIResponse> {
    try {
      const startTime = Date.now();

      // Preprocess the query
      const preprocessedQuery = await this.preprocessQuery(queryText, language);
      
      // Classify the query
      const category = this.classifyQuery(preprocessedQuery, language);
      
      // Extract entities and intent
      const entities = this.extractEntities(preprocessedQuery);
      const intent = this.extractIntent(preprocessedQuery, category);
      
      // Get relevant data based on category and context
      const relevantData = await this.getRelevantData(category, entities, context);
      
      // Generate response using AI
      const response = await this.generateResponse(
        preprocessedQuery,
        category,
        intent,
        entities,
        relevantData,
        language,
        context
      );
      
      const processingTime = Date.now() - startTime;
      
      // Save query and response to database
      if (context?.sessionId) {
        await this.saveQuery(queryText, response, category, context, processingTime, language);
      }
      
      return response;
    } catch (error) {
      logger.error('Error processing query:', error);
      throw new Error('Failed to process query');
    }
  }

  /**
   * Preprocess query text
   */
  private async preprocessQuery(text: string, language: string): Promise<string> {
    // Translate to English if not already
    let processedText = text;
    if (language !== 'en') {
      try {
        processedText = await translateText(text, language, 'en');
      } catch (error) {
        logger.warn('Translation failed, using original text:', error);
      }
    }

    // Clean and normalize text
    processedText = processedText.toLowerCase().trim();
    
    // Remove special characters but keep spaces and basic punctuation
    processedText = processedText.replace(/[^\w\s.,?!-]/g, '');
    
    // Handle common abbreviations and expansions
    const expansions: Record<string, string> = {
      'temp': 'temperature',
      'humid': 'humidity',
      'fert': 'fertilizer',
      'irrig': 'irrigation',
      'govt': 'government',
      'agri': 'agriculture',
      'veg': 'vegetable'
    };
    
    Object.entries(expansions).forEach(([abbr, full]) => {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
      processedText = processedText.replace(regex, full);
    });

    return processedText;
  }

  /**
   * Classify query into categories
   */
  private classifyQuery(text: string, language: string): string {
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    const categoryScores: Record<string, number> = {};

    // Initialize scores
    Object.keys(queryCategories).forEach(category => {
      categoryScores[category] = 0;
    });

    // Score based on English keywords
    tokens.forEach((token: string) => {
      Object.entries(queryCategories).forEach(([category, keywords]) => {
        keywords.forEach(keyword => {
          if (token.includes(keyword) || keyword.includes(token)) {
            categoryScores[category] += 1;
          }
        });
      });
    });

    // Score based on language-specific keywords (Hindi example)
    if (language === 'hi') {
      tokens.forEach((token: string) => {
        Object.entries(hindiKeywords).forEach(([category, keywords]) => {
          keywords.forEach(keyword => {
            if (token.includes(keyword) || keyword.includes(token)) {
              categoryScores[category] += 1.5; // Higher weight for native language
            }
          });
        });
      });
    }

    // Find category with highest score
    const bestCategory = Object.entries(categoryScores).reduce((a, b) => 
      categoryScores[a[0]] > categoryScores[b[0]] ? a : b
    )[0];

    return categoryScores[bestCategory] > 0 ? bestCategory : 'general';
  }

  /**
   * Extract entities from query
   */
  private extractEntities(text: string): Record<string, any> {
    const doc = compromise(text);
    
    const entities = {
      crops: [] as string[],
      locations: [] as string[],
      dates: [] as string[],
      numbers: [] as number[],
      seasons: [] as string[],
      months: [] as string[]
    };

    // Extract crops (common crop names)
    const cropNames = ['rice', 'wheat', 'cotton', 'sugarcane', 'maize', 'soybean', 'potato', 'tomato', 'onion'];
    cropNames.forEach(crop => {
      if (text.includes(crop)) {
        entities.crops.push(crop);
      }
    });

    // Extract locations
    const places = doc.places().out('array');
    entities.locations = places;

    // Extract dates
    const dates = doc.dates().out('array');
    entities.dates = dates;

    // Extract numbers
    const numbers = doc.values().out('array').map(Number).filter(n => !isNaN(n));
    entities.numbers = numbers;

    // Extract seasons
    const seasons = ['kharif', 'rabi', 'zaid', 'summer', 'winter', 'monsoon', 'spring'];
    seasons.forEach(season => {
      if (text.includes(season)) {
        entities.seasons.push(season);
      }
    });

    // Extract months
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                   'july', 'august', 'september', 'october', 'november', 'december'];
    months.forEach(month => {
      if (text.includes(month)) {
        entities.months.push(month);
      }
    });

    return entities;
  }

  /**
   * Extract intent from query
   */
  private extractIntent(text: string, category: string): string {
    const intentKeywords = {
      question: ['what', 'when', 'where', 'why', 'how', 'which', 'who'],
      advice: ['should', 'recommend', 'suggest', 'advice', 'help', 'guide'],
      information: ['tell', 'show', 'explain', 'describe', 'information', 'details'],
      prediction: ['will', 'predict', 'forecast', 'expect', 'future', 'next'],
      comparison: ['compare', 'difference', 'better', 'best', 'versus', 'vs'],
      calculation: ['calculate', 'compute', 'estimate', 'cost', 'profit', 'loss']
    };

    let bestIntent = 'information';
    let maxScore = 0;

    Object.entries(intentKeywords).forEach(([intent, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (text.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestIntent = intent;
      }
    });

    return bestIntent;
  }

  /**
   * Get relevant data based on category and entities
   */
  private async getRelevantData(
    category: string,
    entities: Record<string, any>,
    context?: any
  ): Promise<any> {
    const data: any = {};

    try {
      switch (category) {
        case 'crop':
          if (entities.crops.length > 0) {
            data.crops = await Crop.find({
              $or: [
                { 'name.en': { $in: entities.crops.map((c: string) => new RegExp(c, 'i')) } },
                { scientificName: { $in: entities.crops.map((c: string) => new RegExp(c, 'i')) } }
              ],
              isActive: true
            }).limit(5);
          } else {
            // Get crops suitable for current season and location
            data.crops = await Crop.find({
              isActive: true,
              ...(context?.location?.state && {
                'regions.majorStates': context.location.state
              })
            }).limit(10);
          }
          break;

        case 'weather':
          if (context?.location) {
            data.weather = await Weather.findOne({
              'location.state': context.location.state,
              'location.district': context.location.district,
              isActive: true
            }).sort({ 'current.timestamp': -1 });
          }
          break;

        case 'finance':
          // Get relevant financial schemes and loans
          data.schemes = []; // Would fetch from finance database
          break;

        default:
          // Get general agricultural data
          data.general = await Crop.find({ isActive: true }).limit(5);
      }
    } catch (error) {
      logger.error('Error fetching relevant data:', error);
    }

    return data;
  }

  /**
   * Generate AI response using OpenAI
   */
  private async generateResponse(
    query: string,
    category: string,
    intent: string,
    entities: Record<string, any>,
    relevantData: any,
    language: string,
    context?: any
  ): Promise<AIResponse> {
    try {
      // Prepare context for AI
      const systemPrompt = this.buildSystemPrompt(category, context);
      const userPrompt = this.buildUserPrompt(query, intent, entities, relevantData);

      // Generate response using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      let responseText = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response for your query.';

      // Translate response back to original language if needed
      if (language !== 'en') {
        try {
          responseText = await translateText(responseText, 'en', language);
        } catch (error) {
          logger.warn('Response translation failed:', error);
        }
      }

      // Calculate confidence based on various factors
      const confidence = this.calculateConfidence(query, category, relevantData);

      // Generate sources
      const sources = this.generateSources(category, relevantData);

      // Generate related queries
      const relatedQueries = this.generateRelatedQueries(category, entities, language);

      // Generate action items
      const actionItems = this.generateActionItems(category, intent, entities);

      return {
        text: responseText,
        confidence,
        category,
        sources,
        relatedQueries,
        actionItems
      };
    } catch (error) {
      logger.error('Error generating AI response:', error);
      
      // Fallback response
      return {
        text: language === 'hi' 
          ? 'मुझे खुशी होगी कि मैं आपकी मदद कर सकूं, लेकिन मुझे इस समय आपके प्रश्न का उत्तर देने में कठिनाई हो रही है। कृपया बाद में पुनः प्रयास करें।'
          : 'I would be happy to help you, but I am having difficulty answering your question at this time. Please try again later.',
        confidence: 0.3,
        category,
        sources: [],
        relatedQueries: [],
        actionItems: []
      };
    }
  }

  /**
   * Build system prompt for AI
   */
  private buildSystemPrompt(category: string, context?: any): string {
    const basePrompt = `You are KrishiMitra, an AI agricultural advisor for Indian farmers. You provide helpful, accurate, and practical advice on farming, weather, crops, finance, and agricultural practices. Always be respectful, empathetic, and consider the local context of Indian agriculture.

Key guidelines:
- Provide practical, actionable advice
- Consider local Indian conditions and practices
- Be sensitive to farmer's economic constraints
- Suggest both traditional and modern solutions
- Always prioritize farmer safety and crop health
- Mention relevant government schemes when applicable
- Use simple, clear language`;

    const categorySpecific = {
      weather: 'Focus on weather-related agricultural advice, irrigation timing, and crop protection measures.',
      crop: 'Provide detailed crop cultivation advice, variety selection, and best practices.',
      pest: 'Offer integrated pest management solutions with emphasis on organic and sustainable methods.',
      soil: 'Give soil health improvement advice and nutrient management recommendations.',
      irrigation: 'Suggest efficient water management and irrigation scheduling.',
      finance: 'Explain agricultural loans, subsidies, and government schemes available to farmers.',
      market: 'Provide market insights, pricing trends, and selling strategies.'
    };

    let prompt = basePrompt;
    if (categorySpecific[category as keyof typeof categorySpecific]) {
      prompt += '\n\n' + categorySpecific[category as keyof typeof categorySpecific];
    }

    if (context?.location) {
      prompt += `\n\nUser location: ${context.location.state}, ${context.location.district}. Consider local conditions and practices.`;
    }

    return prompt;
  }

  /**
   * Build user prompt with context
   */
  private buildUserPrompt(
    query: string,
    intent: string,
    entities: Record<string, any>,
    relevantData: any
  ): string {
    let prompt = `User query: "${query}"\n\n`;

    if (Object.keys(entities).some(key => entities[key].length > 0)) {
      prompt += 'Extracted information:\n';
      Object.entries(entities).forEach(([key, values]) => {
        if (Array.isArray(values) && values.length > 0) {
          prompt += `- ${key}: ${values.join(', ')}\n`;
        }
      });
      prompt += '\n';
    }

    if (relevantData.crops && relevantData.crops.length > 0) {
      prompt += 'Relevant crop information:\n';
      relevantData.crops.forEach((crop: any) => {
        prompt += `- ${crop.name.en}: ${crop.category}, ${crop.season} season\n`;
      });
      prompt += '\n';
    }

    if (relevantData.weather) {
      prompt += `Current weather: ${relevantData.weather.current.weather.description}, ${relevantData.weather.current.temperature}°C\n\n`;
    }

    prompt += 'Please provide a helpful, practical response considering the above context.';

    return prompt;
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(query: string, category: string, relevantData: any): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on data availability
    if (relevantData.crops && relevantData.crops.length > 0) confidence += 0.2;
    if (relevantData.weather) confidence += 0.15;
    if (category !== 'general') confidence += 0.1;

    // Decrease confidence for very short or unclear queries
    if (query.length < 10) confidence -= 0.2;
    if (query.split(' ').length < 3) confidence -= 0.1;

    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Generate sources for response
   */
  private generateSources(category: string, relevantData: any): Array<{
    type: string;
    title: string;
    url?: string;
    relevance: number;
  }> {
    const sources = [];

    if (relevantData.crops && relevantData.crops.length > 0) {
      relevantData.crops.forEach((crop: any) => {
        sources.push({
          type: 'crop',
          title: `${crop.name.en} Cultivation Guide`,
          relevance: 0.9
        });
      });
    }

    if (relevantData.weather) {
      sources.push({
        type: 'weather',
        title: 'Current Weather Data',
        relevance: 0.8
      });
    }

    // Add government sources
    sources.push({
      type: 'government',
      title: 'Ministry of Agriculture & Farmers Welfare',
      url: 'https://agricoop.nic.in',
      relevance: 0.7
    });

    return sources.slice(0, 5); // Limit to 5 sources
  }

  /**
   * Generate related queries
   */
  private generateRelatedQueries(
    category: string,
    entities: Record<string, any>,
    language: string
  ): string[] {
    const relatedQueries: Record<string, string[]> = {
      en: {
        weather: [
          'What is the weather forecast for next week?',
          'When should I irrigate my crops?',
          'How to protect crops from heavy rain?'
        ],
        crop: [
          'What is the best time to sow this crop?',
          'Which fertilizer should I use?',
          'How to increase crop yield?'
        ],
        pest: [
          'How to identify pest damage?',
          'What are organic pest control methods?',
          'When to spray pesticides?'
        ],
        finance: [
          'How to apply for Kisan Credit Card?',
          'What government schemes are available?',
          'How to get crop insurance?'
        ]
      },
      hi: {
        weather: [
          'अगले सप्ताह का मौसम कैसा रहेगा?',
          'फसल की सिंचाई कब करनी चाहिए?',
          'भारी बारिश से फसल की सुरक्षा कैसे करें?'
        ],
        crop: [
          'इस फसल की बुवाई का सबसे अच्छा समय क्या है?',
          'कौन सा उर्वरक इस्तेमाल करना चाहिए?',
          'फसल की पैदावार कैसे बढ़ाएं?'
        ],
        pest: [
          'कीट क्षति की पहचान कैसे करें?',
          'जैविक कीट नियंत्रण के तरीके क्या हैं?',
          'कीटनाशक का छिड़काव कब करें?'
        ],
        finance: [
          'किसान क्रेडिट कार्ड के लिए आवेदन कैसे करें?',
          'कौन सी सरकारी योजनाएं उपलब्ध हैं?',
          'फसल बीमा कैसे कराएं?'
        ]
      }
    };

    const categoryQueries = relatedQueries[language]?.[category] || relatedQueries.en[category] || [];
    return categoryQueries.slice(0, 3);
  }

  /**
   * Generate action items
   */
  private generateActionItems(
    category: string,
    intent: string,
    entities: Record<string, any>
  ): Array<{
    type: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }> {
    const actionItems = [];

    if (category === 'weather' && intent === 'advice') {
      actionItems.push({
        type: 'monitoring',
        description: 'Check weather forecast daily',
        priority: 'medium' as const,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
      });
    }

    if (category === 'crop' && entities.crops.length > 0) {
      actionItems.push({
        type: 'planning',
        description: 'Plan crop cultivation schedule',
        priority: 'high' as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next week
      });
    }

    if (category === 'pest') {
      actionItems.push({
        type: 'inspection',
        description: 'Inspect crops for pest damage',
        priority: 'high' as const,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Day after tomorrow
      });
    }

    return actionItems;
  }

  /**
   * Save query and response to database
   */
  private async saveQuery(
    queryText: string,
    response: AIResponse,
    category: string,
    context: any,
    processingTime: number,
    language: string
  ): Promise<void> {
    try {
      const query = new Query({
        userId: context.userId,
        sessionId: context.sessionId,
        query: {
          text: queryText,
          language,
          type: 'text'
        },
        response: {
          text: response.text,
          language,
          confidence: response.confidence,
          sources: response.sources,
          relatedQueries: response.relatedQueries,
          actionItems: response.actionItems
        },
        context: {
          category,
          location: context.location
        },
        processingTime,
        isResolved: true,
        isPublic: false,
        tags: [category, language]
      });

      await query.save();
    } catch (error) {
      logger.error('Error saving query:', error);
    }
  }

  /**
   * Analyze sentiment of query
   */
  analyzeSentiment(text: string): { score: number; comparative: number; positive: string[]; negative: string[] } {
    return sentiment.analyze(text);
  }

  /**
   * Get query suggestions based on user history and context
   */
  async getQuerySuggestions(
    userId?: string,
    location?: { state: string; district: string },
    language: string = 'en'
  ): Promise<string[]> {
    try {
      const suggestions = [];

      // Get popular queries from database
      const popularQueries = await Query.aggregate([
        {
          $match: {
            'query.language': language,
            isPublic: true,
            'feedback.rating': { $gte: 4 }
          }
        },
        {
          $group: {
            _id: '$query.text',
            count: { $sum: 1 },
            avgRating: { $avg: '$feedback.rating' }
          }
        },
        {
          $sort: { count: -1, avgRating: -1 }
        },
        {
          $limit: 10
        }
      ]);

      suggestions.push(...popularQueries.map(q => q._id));

      // Add location-specific suggestions
      if (location) {
        const locationQueries = await Query.find({
          'context.location.state': location.state,
          'query.language': language,
          'feedback.rating': { $gte: 4 }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('query.text');

        suggestions.push(...locationQueries.map(q => q.query.text));
      }

      // Remove duplicates and return
      return [...new Set(suggestions)].slice(0, 8);
    } catch (error) {
      logger.error('Error getting query suggestions:', error);
      return [];
    }
  }
}

// Initialize AI service
let aiService: AIService;

export const initializeAIService = async (): Promise<void> => {
  try {
    aiService = new AIService();
    logger.info('AI Service initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize AI Service:', error);
    throw error;
  }
};

export const getAIService = (): AIService => {
  if (!aiService) {
    throw new Error('AI Service not initialized');
  }
  return aiService;
};

export { AIService };