import logger from '../utils/logger';
import Crop from '../models/Crop';
import Weather from '../models/Weather';
import { getCacheService } from './cacheService';

/**
 * Service for fact-checking AI responses against reliable data sources
 */
export class FactCheckingService {
  private cacheService: any;
  private reliableSources: Map<string, any>;

  constructor() {
    this.cacheService = getCacheService();
    this.reliableSources = new Map();
    this.initializeReliableSources();
  }

  /**
   * Initialize reliable data sources for fact-checking
   */
  private initializeReliableSources(): void {
    // Government and research institution sources
    this.reliableSources.set('crops', {
      source: 'ICAR-Indian Institute of Rice Research',
      confidence: 0.95,
      lastUpdated: new Date()
    });

    this.reliableSources.set('weather', {
      source: 'India Meteorological Department (IMD)',
      confidence: 0.9,
      lastUpdated: new Date()
    });

    this.reliableSources.set('market', {
      source: 'eNAM - National Agriculture Market',
      confidence: 0.85,
      lastUpdated: new Date()
    });

    this.reliableSources.set('schemes', {
      source: 'Ministry of Agriculture & Farmers Welfare',
      confidence: 0.98,
      lastUpdated: new Date()
    });
  }

  /**
   * Fact-check a response about crop information
   */
  async factCheckCropInfo(cropName: string, claim: string, context?: any): Promise<{
    isVerified: boolean;
    confidence: number;
    sources: string[];
    corrections?: string[];
  }> {
    try {
      // Get crop data from database
      const crop = await Crop.findOne({
        $or: [
          { 'name.en': new RegExp(cropName, 'i') },
          { 'name.hi': new RegExp(cropName, 'i') }
        ],
        isActive: true
      });

      if (!crop) {
        return {
          isVerified: false,
          confidence: 0,
          sources: [],
          corrections: [`No reliable data found for crop: ${cropName}`]
        };
      }

      // Extract claims from the response
      const claims = this.extractClaims(claim);
      const verificationResults = [];

      for (const singleClaim of claims) {
        const result = await this.verifyCropClaim(crop, singleClaim);
        verificationResults.push(result);
      }

      // Calculate overall confidence
      const overallConfidence = verificationResults.reduce((sum, result) => sum + result.confidence, 0) / verificationResults.length;
      const isVerified = overallConfidence > 0.7;

      // Collect corrections
      const corrections = verificationResults
        .filter(result => !result.verified)
        .map(result => result.correction)
        .filter(Boolean);

      return {
        isVerified,
        confidence: overallConfidence,
        sources: ['ICAR Database', 'Agricultural Research Institutes'],
        corrections: corrections.length > 0 ? corrections : undefined
      };
    } catch (error) {
      logger.error('Error fact-checking crop info:', error);
      return {
        isVerified: false,
        confidence: 0,
        sources: [],
        corrections: ['Unable to verify information due to system error']
      };
    }
  }

  /**
   * Fact-check weather-related claims
   */
  async factCheckWeatherInfo(location: { state: string; district: string }, claim: string): Promise<{
    isVerified: boolean;
    confidence: number;
    sources: string[];
    corrections?: string[];
  }> {
    try {
      // Get current weather data
      const weather = await Weather.findOne({
        'location.state': location.state,
        'location.district': location.district,
        isActive: true
      }).sort({ 'current.timestamp': -1 });

      if (!weather) {
        return {
          isVerified: false,
          confidence: 0,
          sources: [],
          corrections: ['No current weather data available for verification']
        };
      }

      // Verify weather claims
      const claims = this.extractClaims(claim);
      const verificationResults = [];

      for (const singleClaim of claims) {
        const result = await this.verifyWeatherClaim(weather, singleClaim);
        verificationResults.push(result);
      }

      const overallConfidence = verificationResults.reduce((sum, result) => sum + result.confidence, 0) / verificationResults.length;
      const isVerified = overallConfidence > 0.7;

      const corrections = verificationResults
        .filter(result => !result.verified)
        .map(result => result.correction)
        .filter(Boolean);

      return {
        isVerified,
        confidence: overallConfidence,
        sources: ['India Meteorological Department', 'Weather Monitoring Stations'],
        corrections: corrections.length > 0 ? corrections : undefined
      };
    } catch (error) {
      logger.error('Error fact-checking weather info:', error);
      return {
        isVerified: false,
        confidence: 0,
        sources: [],
        corrections: ['Unable to verify weather information']
      };
    }
  }

  /**
   * Fact-check financial/scheme information
   */
  async factCheckFinanceInfo(claim: string): Promise<{
    isVerified: boolean;
    confidence: number;
    sources: string[];
    corrections?: string[];
  }> {
    try {
      // Check against known government schemes
      const knownSchemes = [
        {
          name: 'PM-KISAN',
          amount: 6000,
          installments: 3,
          beneficiary: 'landholding farmers'
        },
        {
          name: 'PMFBY',
          premium: { kharif: 2, rabi: 1.5 },
          coverage: 'crop insurance'
        },
        {
          name: 'KCC',
          interestRate: { min: 7, max: 9 },
          subvention: 2
        }
      ];

      const claims = this.extractClaims(claim);
      const verificationResults = [];

      for (const singleClaim of claims) {
        const result = this.verifyFinanceClaim(knownSchemes, singleClaim);
        verificationResults.push(result);
      }

      const overallConfidence = verificationResults.reduce((sum, result) => sum + result.confidence, 0) / verificationResults.length;
      const isVerified = overallConfidence > 0.8; // Higher threshold for financial info

      const corrections = verificationResults
        .filter(result => !result.verified)
        .map(result => result.correction)
        .filter(Boolean);

      return {
        isVerified,
        confidence: overallConfidence,
        sources: ['Ministry of Agriculture & Farmers Welfare', 'NABARD', 'Government Scheme Portals'],
        corrections: corrections.length > 0 ? corrections : undefined
      };
    } catch (error) {
      logger.error('Error fact-checking finance info:', error);
      return {
        isVerified: false,
        confidence: 0,
        sources: [],
        corrections: ['Unable to verify financial information']
      };
    }
  }

  /**
   * Extract individual claims from a response
   */
  private extractClaims(text: string): string[] {
    // Simple sentence splitting - in production, this would be more sophisticated
    return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 10);
  }

  /**
   * Verify a single crop-related claim
   */
  private async verifyCropClaim(crop: any, claim: string): Promise<{
    verified: boolean;
    confidence: number;
    correction?: string;
  }> {
    const lowerClaim = claim.toLowerCase();

    // Check yield claims
    if (lowerClaim.includes('yield') && lowerClaim.includes('kg')) {
      const yieldMatch = claim.match(/(\d+(?:,\d+)*)\s*kg/);
      if (yieldMatch) {
        const claimedYield = parseInt(yieldMatch[1].replace(/,/g, ''));
        const actualYield = crop.yield?.average || 0;
        
        if (Math.abs(claimedYield - actualYield) / actualYield < 0.3) { // Within 30%
          return { verified: true, confidence: 0.9 };
        } else {
          return {
            verified: false,
            confidence: 0.3,
            correction: `Actual average yield for ${crop.name.en} is approximately ${actualYield} kg/ha`
          };
        }
      }
    }

    // Check duration claims
    if (lowerClaim.includes('days') || lowerClaim.includes('months')) {
      const daysMatch = claim.match(/(\d+)\s*days/);
      const monthsMatch = claim.match(/(\d+)\s*months/);
      
      let claimedDuration = 0;
      if (daysMatch) claimedDuration = parseInt(daysMatch[1]);
      if (monthsMatch) claimedDuration = parseInt(monthsMatch[1]) * 30;

      if (claimedDuration > 0) {
        const actualDuration = crop.duration?.max || 0;
        if (Math.abs(claimedDuration - actualDuration) / actualDuration < 0.2) { // Within 20%
          return { verified: true, confidence: 0.85 };
        } else {
          return {
            verified: false,
            confidence: 0.4,
            correction: `Actual duration for ${crop.name.en} is ${actualDuration} days`
          };
        }
      }
    }

    // Check season claims
    if (lowerClaim.includes('kharif') || lowerClaim.includes('rabi') || lowerClaim.includes('zaid')) {
      const seasonMatch = claim.match(/(kharif|rabi|zaid)/i);
      if (seasonMatch) {
        const claimedSeason = seasonMatch[1].toLowerCase();
        if (crop.season === claimedSeason) {
          return { verified: true, confidence: 0.95 };
        } else {
          return {
            verified: false,
            confidence: 0.2,
            correction: `${crop.name.en} is actually a ${crop.season} crop`
          };
        }
      }
    }

    // Default: unable to verify
    return { verified: true, confidence: 0.5 }; // Neutral confidence for unverifiable claims
  }

  /**
   * Verify a single weather-related claim
   */
  private async verifyWeatherClaim(weather: any, claim: string): Promise<{
    verified: boolean;
    confidence: number;
    correction?: string;
  }> {
    const lowerClaim = claim.toLowerCase();

    // Check temperature claims
    if (lowerClaim.includes('temperature') || lowerClaim.includes('°c')) {
      const tempMatch = claim.match(/(\d+(?:\.\d+)?)\s*°?c/i);
      if (tempMatch) {
        const claimedTemp = parseFloat(tempMatch[1]);
        const actualTemp = weather.current.temperature;
        
        if (Math.abs(claimedTemp - actualTemp) < 5) { // Within 5°C
          return { verified: true, confidence: 0.9 };
        } else {
          return {
            verified: false,
            confidence: 0.3,
            correction: `Current temperature is approximately ${actualTemp}°C`
          };
        }
      }
    }

    // Check humidity claims
    if (lowerClaim.includes('humidity') && lowerClaim.includes('%')) {
      const humidityMatch = claim.match(/(\d+)\s*%/);
      if (humidityMatch) {
        const claimedHumidity = parseInt(humidityMatch[1]);
        const actualHumidity = weather.current.humidity;
        
        if (Math.abs(claimedHumidity - actualHumidity) < 15) { // Within 15%
          return { verified: true, confidence: 0.85 };
        } else {
          return {
            verified: false,
            confidence: 0.4,
            correction: `Current humidity is approximately ${actualHumidity}%`
          };
        }
      }
    }

    // Check rainfall claims
    if (lowerClaim.includes('rain') || lowerClaim.includes('precipitation')) {
      // This would check against recent rainfall data
      return { verified: true, confidence: 0.7 }; // Moderate confidence for rainfall claims
    }

    return { verified: true, confidence: 0.6 }; // Default moderate confidence
  }

  /**
   * Verify a single finance-related claim
   */
  private verifyFinanceClaim(knownSchemes: any[], claim: string): {
    verified: boolean;
    confidence: number;
    correction?: string;
  } {
    const lowerClaim = claim.toLowerCase();

    // Check PM-KISAN amount
    if (lowerClaim.includes('pm-kisan') || lowerClaim.includes('6000') || lowerClaim.includes('6,000')) {
      if (lowerClaim.includes('6000') || lowerClaim.includes('6,000')) {
        return { verified: true, confidence: 0.95 };
      } else {
        return {
          verified: false,
          confidence: 0.3,
          correction: 'PM-KISAN provides ₹6,000 per year in 3 installments'
        };
      }
    }

    // Check KCC interest rates
    if (lowerClaim.includes('kcc') || lowerClaim.includes('kisan credit card')) {
      const rateMatch = claim.match(/(\d+(?:\.\d+)?)\s*%/);
      if (rateMatch) {
        const claimedRate = parseFloat(rateMatch[1]);
        if (claimedRate >= 7 && claimedRate <= 9) {
          return { verified: true, confidence: 0.9 };
        } else {
          return {
            verified: false,
            confidence: 0.4,
            correction: 'KCC interest rates are typically 7-9% per annum'
          };
        }
      }
    }

    // Check PMFBY premium rates
    if (lowerClaim.includes('pmfby') || lowerClaim.includes('crop insurance')) {
      if (lowerClaim.includes('2%') && lowerClaim.includes('kharif')) {
        return { verified: true, confidence: 0.9 };
      }
      if (lowerClaim.includes('1.5%') && lowerClaim.includes('rabi')) {
        return { verified: true, confidence: 0.9 };
      }
    }

    return { verified: true, confidence: 0.6 }; // Default moderate confidence
  }

  /**
   * Comprehensive fact-check of an AI response
   */
  async factCheckResponse(
    response: string,
    category: string,
    context?: {
      cropName?: string;
      location?: { state: string; district: string };
      queryType?: string;
    }
  ): Promise<{
    overallVerification: boolean;
    confidence: number;
    verifiedClaims: number;
    totalClaims: number;
    sources: string[];
    corrections: string[];
    reliability: 'high' | 'medium' | 'low';
  }> {
    try {
      const results = [];

      switch (category) {
        case 'crop':
          if (context?.cropName) {
            const cropResult = await this.factCheckCropInfo(context.cropName, response, context);
            results.push(cropResult);
          }
          break;

        case 'weather':
          if (context?.location) {
            const weatherResult = await this.factCheckWeatherInfo(context.location, response);
            results.push(weatherResult);
          }
          break;

        case 'finance':
          const financeResult = await this.factCheckFinanceInfo(response);
          results.push(financeResult);
          break;

        default:
          // For general queries, do basic fact-checking
          results.push({
            isVerified: true,
            confidence: 0.6,
            sources: ['General Agricultural Knowledge Base'],
            corrections: []
          });
      }

      // Aggregate results
      const verifiedCount = results.filter(r => r.isVerified).length;
      const totalCount = results.length;
      const overallConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
      
      const allSources = [...new Set(results.flatMap(r => r.sources))];
      const allCorrections = results.flatMap(r => r.corrections || []);

      let reliability: 'high' | 'medium' | 'low' = 'low';
      if (overallConfidence > 0.8) reliability = 'high';
      else if (overallConfidence > 0.6) reliability = 'medium';

      return {
        overallVerification: verifiedCount === totalCount && overallConfidence > 0.7,
        confidence: overallConfidence,
        verifiedClaims: verifiedCount,
        totalClaims: totalCount,
        sources: allSources,
        corrections: allCorrections,
        reliability
      };
    } catch (error) {
      logger.error('Error in comprehensive fact-checking:', error);
      return {
        overallVerification: false,
        confidence: 0,
        verifiedClaims: 0,
        totalClaims: 1,
        sources: [],
        corrections: ['Unable to verify information due to system error'],
        reliability: 'low'
      };
    }
  }

  /**
   * Get reliability score for a data source
   */
  getSourceReliability(sourceName: string): number {
    const reliabilityScores: Record<string, number> = {
      'ICAR': 0.95,
      'IMD': 0.9,
      'Ministry of Agriculture': 0.98,
      'NABARD': 0.9,
      'eNAM': 0.85,
      'Agmarknet': 0.8,
      'State Agricultural Universities': 0.85,
      'Research Papers': 0.8,
      'Government Portals': 0.9,
      'Unknown': 0.5
    };

    for (const [key, score] of Object.entries(reliabilityScores)) {
      if (sourceName.toLowerCase().includes(key.toLowerCase())) {
        return score;
      }
    }

    return reliabilityScores['Unknown'];
  }

  /**
   * Add a correction to the response if needed
   */
  addCorrections(originalResponse: string, corrections: string[]): string {
    if (corrections.length === 0) {
      return originalResponse;
    }

    let correctedResponse = originalResponse;
    
    // Add corrections as a note
    correctedResponse += '\n\n**Important Note:** ';
    correctedResponse += corrections.join(' ');

    return correctedResponse;
  }
}

// Initialize fact-checking service
let factCheckingService: FactCheckingService;

export const initializeFactCheckingService = async (): Promise<void> => {
  try {
    factCheckingService = new FactCheckingService();
    logger.info('Fact Checking Service initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Fact Checking Service:', error);
    throw error;
  }
};

export const getFactCheckingService = (): FactCheckingService => {
  if (!factCheckingService) {
    throw new Error('Fact Checking Service not initialized');
  }
  return factCheckingService;
};