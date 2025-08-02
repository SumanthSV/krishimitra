import axios from 'axios';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';
import Crop from '../models/Crop';
import Weather from '../models/Weather';
import { getCacheService } from './cacheService';

/**
 * Service for ingesting data from public agricultural datasets
 */
export class DataIngestionService {
  private cacheService: any;

  constructor() {
    this.cacheService = getCacheService();
  }

  /**
   * Ingest crop data from government sources
   */
  async ingestCropData(): Promise<void> {
    try {
      logger.info('Starting crop data ingestion...');

      // Mock data sources (in production, these would be real government APIs)
      const dataSources = [
        {
          name: 'Ministry of Agriculture Crop Data',
          url: 'https://api.data.gov.in/resource/crops',
          type: 'json'
        },
        {
          name: 'ICAR Crop Varieties',
          url: 'https://api.icar.gov.in/varieties',
          type: 'json'
        }
      ];

      for (const source of dataSources) {
        try {
          await this.processCropDataSource(source);
        } catch (error) {
          logger.error(`Error processing data source ${source.name}:`, error);
        }
      }

      logger.info('Crop data ingestion completed');
    } catch (error) {
      logger.error('Error in crop data ingestion:', error);
      throw error;
    }
  }

  /**
   * Ingest weather data from meteorological sources
   */
  async ingestWeatherData(): Promise<void> {
    try {
      logger.info('Starting weather data ingestion...');

      // Mock weather stations data
      const weatherStations = [
        { state: 'Punjab', district: 'Ludhiana', lat: 30.9010, lon: 75.8573 },
        { state: 'Haryana', district: 'Karnal', lat: 29.6857, lon: 76.9905 },
        { state: 'Uttar Pradesh', district: 'Lucknow', lat: 26.8467, lon: 80.9462 },
        { state: 'Maharashtra', district: 'Pune', lat: 18.5204, lon: 73.8567 },
        { state: 'Karnataka', district: 'Bangalore', lat: 12.9716, lon: 77.5946 }
      ];

      for (const station of weatherStations) {
        try {
          await this.ingestWeatherForLocation(station);
        } catch (error) {
          logger.error(`Error ingesting weather for ${station.state}, ${station.district}:`, error);
        }
      }

      logger.info('Weather data ingestion completed');
    } catch (error) {
      logger.error('Error in weather data ingestion:', error);
      throw error;
    }
  }

  /**
   * Ingest market price data
   */
  async ingestMarketData(): Promise<void> {
    try {
      logger.info('Starting market data ingestion...');

      // Mock market data sources
      const marketSources = [
        {
          name: 'eNAM Market Prices',
          url: 'https://api.enam.gov.in/prices',
          type: 'json'
        },
        {
          name: 'Agmarknet Prices',
          url: 'https://api.agmarknet.gov.in/prices',
          type: 'json'
        }
      ];

      for (const source of marketSources) {
        try {
          await this.processMarketDataSource(source);
        } catch (error) {
          logger.error(`Error processing market source ${source.name}:`, error);
        }
      }

      logger.info('Market data ingestion completed');
    } catch (error) {
      logger.error('Error in market data ingestion:', error);
      throw error;
    }
  }

  /**
   * Ingest soil health data
   */
  async ingestSoilData(): Promise<void> {
    try {
      logger.info('Starting soil data ingestion...');

      // Mock soil health data from Soil Health Card scheme
      const soilDataSources = [
        {
          name: 'Soil Health Card Data',
          url: 'https://api.soilhealth.dac.gov.in/data',
          type: 'json'
        }
      ];

      for (const source of soilDataSources) {
        try {
          await this.processSoilDataSource(source);
        } catch (error) {
          logger.error(`Error processing soil source ${source.name}:`, error);
        }
      }

      logger.info('Soil data ingestion completed');
    } catch (error) {
      logger.error('Error in soil data ingestion:', error);
      throw error;
    }
  }

  /**
   * Process crop data from a source
   */
  private async processCropDataSource(source: any): Promise<void> {
    // Mock implementation - in production, this would fetch real data
    logger.info(`Processing crop data from ${source.name}`);
    
    // Simulate data processing
    const mockCropData = [
      {
        name: 'Rice',
        variety: 'IR-64',
        state: 'Punjab',
        yield: 5200,
        duration: 120,
        season: 'kharif'
      },
      {
        name: 'Wheat',
        variety: 'HD-2967',
        state: 'Punjab',
        yield: 4800,
        duration: 135,
        season: 'rabi'
      }
    ];

    // Process and update database
    for (const cropData of mockCropData) {
      await this.updateCropInDatabase(cropData);
    }
  }

  /**
   * Process weather data for a location
   */
  private async ingestWeatherForLocation(station: any): Promise<void> {
    try {
      // This would typically fetch from IMD or other weather APIs
      const mockWeatherData = {
        location: {
          name: `${station.district}, ${station.state}`,
          state: station.state,
          district: station.district,
          coordinates: {
            latitude: station.lat,
            longitude: station.lon
          }
        },
        current: {
          temperature: 25 + Math.random() * 15, // 25-40°C
          humidity: 50 + Math.random() * 40, // 50-90%
          pressure: 1010 + Math.random() * 20, // 1010-1030 hPa
          windSpeed: Math.random() * 20, // 0-20 km/h
          precipitation: Math.random() * 10, // 0-10 mm
          timestamp: new Date()
        }
      };

      await this.updateWeatherInDatabase(mockWeatherData);
    } catch (error) {
      logger.error('Error processing weather data:', error);
    }
  }

  /**
   * Process market data from a source
   */
  private async processMarketDataSource(source: any): Promise<void> {
    logger.info(`Processing market data from ${source.name}`);
    
    // Mock market data processing
    const mockMarketData = [
      { crop: 'Rice', price: 2500, market: 'Ludhiana Mandi', date: new Date() },
      { crop: 'Wheat', price: 2100, market: 'Karnal Mandi', date: new Date() },
      { crop: 'Cotton', price: 6500, market: 'Guntur Mandi', date: new Date() }
    ];

    // Cache market data
    for (const data of mockMarketData) {
      const cacheKey = `market:${data.crop}:${data.market}`;
      await this.cacheService.setex(cacheKey, 3600, JSON.stringify(data));
    }
  }

  /**
   * Process soil data from a source
   */
  private async processSoilDataSource(source: any): Promise<void> {
    logger.info(`Processing soil data from ${source.name}`);
    
    // Mock soil data processing
    const mockSoilData = [
      {
        state: 'Punjab',
        district: 'Ludhiana',
        ph: 7.2,
        organicCarbon: 0.45,
        nitrogen: 280,
        phosphorus: 18,
        potassium: 165
      }
    ];

    // Cache soil data
    for (const data of mockSoilData) {
      const cacheKey = `soil:${data.state}:${data.district}`;
      await this.cacheService.setex(cacheKey, 86400, JSON.stringify(data)); // Cache for 24 hours
    }
  }

  /**
   * Update crop information in database
   */
  private async updateCropInDatabase(cropData: any): Promise<void> {
    try {
      const existingCrop = await Crop.findOne({
        'name.en': cropData.name,
        'varieties.name': cropData.variety
      });

      if (existingCrop) {
        // Update existing crop variety data
        const variety = existingCrop.varieties.find(v => v.name === cropData.variety);
        if (variety) {
          variety.yield = cropData.yield;
          variety.duration = cropData.duration;
          await existingCrop.save();
        }
      }
      // If crop doesn't exist, it would be created through the seed data
    } catch (error) {
      logger.error('Error updating crop in database:', error);
    }
  }

  /**
   * Update weather information in database
   */
  private async updateWeatherInDatabase(weatherData: any): Promise<void> {
    try {
      // Update or create weather record
      await Weather.findOneAndUpdate(
        {
          'location.state': weatherData.location.state,
          'location.district': weatherData.location.district
        },
        {
          ...weatherData,
          dataSource: {
            provider: 'IMD',
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 30 * 60 * 1000),
            reliability: 0.9
          },
          isActive: true
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      logger.error('Error updating weather in database:', error);
    }
  }

  /**
   * Schedule regular data ingestion
   */
  scheduleDataIngestion(): void {
    // Schedule crop data ingestion (daily)
    setInterval(async () => {
      try {
        await this.ingestCropData();
      } catch (error) {
        logger.error('Scheduled crop data ingestion failed:', error);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    // Schedule weather data ingestion (every 30 minutes)
    setInterval(async () => {
      try {
        await this.ingestWeatherData();
      } catch (error) {
        logger.error('Scheduled weather data ingestion failed:', error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    // Schedule market data ingestion (every 2 hours)
    setInterval(async () => {
      try {
        await this.ingestMarketData();
      } catch (error) {
        logger.error('Scheduled market data ingestion failed:', error);
      }
    }, 2 * 60 * 60 * 1000); // 2 hours

    logger.info('Data ingestion schedules initialized');
  }
}

// Initialize data ingestion service
let dataIngestionService: DataIngestionService;

export const initializeDataIngestionService = async (): Promise<void> => {
  try {
    dataIngestionService = new DataIngestionService();
    dataIngestionService.scheduleDataIngestion();
    
    // Initial data ingestion
    await dataIngestionService.ingestCropData();
    await dataIngestionService.ingestWeatherData();
    await dataIngestionService.ingestMarketData();
    await dataIngestionService.ingestSoilData();
    
    logger.info('Data Ingestion Service initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Data Ingestion Service:', error);
    throw error;
  }
};

export const getDataIngestionService = (): DataIngestionService => {
  if (!dataIngestionService) {
    throw new Error('Data Ingestion Service not initialized');
  }
  return dataIngestionService;
};