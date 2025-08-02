import axios from 'axios';
import cron from 'node-cron';
import logger from '../utils/logger';
import Weather from '../models/Weather';
import { getCacheService } from './cacheService';

export interface WeatherData {
  location: {
    name: string;
    state: string;
    district: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
    uvIndex: number;
    cloudCover: number;
    precipitation: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    timestamp: Date;
  };
  forecast: Array<{
    date: Date;
    temperature: {
      min: number;
      max: number;
      average: number;
    };
    humidity: {
      min: number;
      max: number;
      average: number;
    };
    precipitation: {
      probability: number;
      amount: number;
    };
    wind: {
      speed: number;
      direction: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  }>;
  alerts: Array<{
    type: 'warning' | 'watch' | 'advisory';
    severity: 'minor' | 'moderate' | 'severe' | 'extreme';
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    affectedAreas: string[];
  }>;
}

export class WeatherService {
  private apiKey: string;
  private baseUrl: string;
  private cacheService: any;

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.cacheService = getCacheService();
  }

  /**
   * Get current weather for a location
   */
  async getCurrentWeather(latitude: number, longitude: number): Promise<any> {
    try {
      const cacheKey = `weather:current:${latitude}:${longitude}`;
      
      // Check cache first
      const cachedData = await this.cacheService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const weatherData = this.transformCurrentWeatherData(response.data);
      
      // Cache for 30 minutes
      await this.cacheService.setex(cacheKey, 1800, JSON.stringify(weatherData));
      
      return weatherData;
    } catch (error) {
      logger.error('Error fetching current weather:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  /**
   * Get weather forecast for a location
   */
  async getWeatherForecast(latitude: number, longitude: number, days: number = 7): Promise<any> {
    try {
      const cacheKey = `weather:forecast:${latitude}:${longitude}:${days}`;
      
      // Check cache first
      const cachedData = await this.cacheService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 forecasts per day (3-hour intervals)
        }
      });

      const forecastData = this.transformForecastData(response.data);
      
      // Cache for 1 hour
      await this.cacheService.setex(cacheKey, 3600, JSON.stringify(forecastData));
      
      return forecastData;
    } catch (error) {
      logger.error('Error fetching weather forecast:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }

  /**
   * Get weather by location name
   */
  async getWeatherByLocation(state: string, district: string): Promise<WeatherData | null> {
    try {
      // First try to get from database
      const existingWeather = await Weather.findOne({
        'location.state': state,
        'location.district': district,
        'current.timestamp': {
          $gte: new Date(Date.now() - 30 * 60 * 1000) // Within last 30 minutes
        }
      });

      if (existingWeather) {
        return existingWeather.toObject();
      }

      // Get coordinates for the location
      const coordinates = await this.getCoordinatesForLocation(state, district);
      if (!coordinates) {
        throw new Error('Location not found');
      }

      // Fetch fresh weather data
      const [currentWeather, forecast] = await Promise.all([
        this.getCurrentWeather(coordinates.latitude, coordinates.longitude),
        this.getWeatherForecast(coordinates.latitude, coordinates.longitude)
      ]);

      // Generate agricultural advisories
      const agriculturalAdvisory = this.generateAgriculturalAdvisory(currentWeather, forecast);

      const weatherData: WeatherData = {
        location: {
          name: `${district}, ${state}`,
          state,
          district,
          coordinates
        },
        current: currentWeather,
        forecast: forecast.list,
        alerts: [], // Would be populated from weather alerts API
        agriculturalAdvisory
      };

      // Save to database
      await this.saveWeatherData(weatherData);

      return weatherData;
    } catch (error) {
      logger.error('Error getting weather by location:', error);
      return null;
    }
  }

  /**
   * Transform current weather data from API
   */
  private transformCurrentWeatherData(data: any): any {
    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
      windDirection: data.wind.deg,
      visibility: data.visibility / 1000, // Convert m to km
      uvIndex: data.uvi || 0,
      cloudCover: data.clouds.all,
      precipitation: data.rain?.['1h'] || 0,
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      },
      timestamp: new Date()
    };
  }

  /**
   * Transform forecast data from API
   */
  private transformForecastData(data: any): any {
    const dailyForecasts: Record<string, any> = {};

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];

      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = {
          date,
          temperatures: [],
          humidities: [],
          precipitations: [],
          winds: [],
          weathers: []
        };
      }

      dailyForecasts[dateKey].temperatures.push(item.main.temp);
      dailyForecasts[dateKey].humidities.push(item.main.humidity);
      dailyForecasts[dateKey].precipitations.push(item.rain?.['3h'] || 0);
      dailyForecasts[dateKey].winds.push({
        speed: item.wind.speed * 3.6,
        direction: item.wind.deg
      });
      dailyForecasts[dateKey].weathers.push({
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      });
    });

    // Process daily aggregates
    const list = Object.values(dailyForecasts).map((day: any) => ({
      date: day.date,
      temperature: {
        min: Math.min(...day.temperatures),
        max: Math.max(...day.temperatures),
        average: day.temperatures.reduce((a: number, b: number) => a + b, 0) / day.temperatures.length
      },
      humidity: {
        min: Math.min(...day.humidities),
        max: Math.max(...day.humidities),
        average: day.humidities.reduce((a: number, b: number) => a + b, 0) / day.humidities.length
      },
      precipitation: {
        probability: Math.max(...day.precipitations) > 0 ? 70 : 20, // Simplified
        amount: day.precipitations.reduce((a: number, b: number) => a + b, 0)
      },
      wind: {
        speed: day.winds.reduce((a: number, b: any) => a + b.speed, 0) / day.winds.length,
        direction: day.winds.reduce((a: number, b: any) => a + b.direction, 0) / day.winds.length
      },
      weather: day.weathers[Math.floor(day.weathers.length / 2)] // Middle weather of the day
    }));

    return { list };
  }

  /**
   * Generate agricultural advisory based on weather
   */
  private generateAgriculturalAdvisory(current: any, forecast: any): any[] {
    const advisories = [];

    // High temperature advisory
    if (current.temperature > 35) {
      advisories.push({
        crop: 'all',
        stage: 'all',
        advisory: 'High temperature alert. Increase irrigation frequency and provide shade to sensitive crops.',
        priority: 'high',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
    }

    // Heavy rain advisory
    const heavyRainDays = forecast.list.filter((day: any) => day.precipitation.amount > 20);
    if (heavyRainDays.length > 0) {
      advisories.push({
        crop: 'all',
        stage: 'all',
        advisory: 'Heavy rainfall expected. Ensure proper drainage and postpone fertilizer application.',
        priority: 'high',
        validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000)
      });
    }

    // Drought advisory
    const dryDays = forecast.list.filter((day: any) => day.precipitation.amount < 1);
    if (dryDays.length > 5) {
      advisories.push({
        crop: 'all',
        stage: 'all',
        advisory: 'Dry weather expected. Plan irrigation schedule and conserve water.',
        priority: 'medium',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
    }

    return advisories;
  }

  /**
   * Get coordinates for a location
   */
  private async getCoordinatesForLocation(state: string, district: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      // This would typically use a geocoding service
      // For now, return mock coordinates based on major cities
      const locationCoordinates: Record<string, { latitude: number; longitude: number }> = {
        'Delhi:New Delhi': { latitude: 28.6139, longitude: 77.2090 },
        'Maharashtra:Mumbai': { latitude: 19.0760, longitude: 72.8777 },
        'Karnataka:Bangalore': { latitude: 12.9716, longitude: 77.5946 },
        'Tamil Nadu:Chennai': { latitude: 13.0827, longitude: 80.2707 },
        'West Bengal:Kolkata': { latitude: 22.5726, longitude: 88.3639 },
        'Gujarat:Ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
        'Rajasthan:Jaipur': { latitude: 26.9124, longitude: 75.7873 },
        'Punjab:Ludhiana': { latitude: 30.9010, longitude: 75.8573 },
        'Haryana:Gurgaon': { latitude: 28.4595, longitude: 77.0266 },
        'Uttar Pradesh:Lucknow': { latitude: 26.8467, longitude: 80.9462 }
      };

      const key = `${state}:${district}`;
      return locationCoordinates[key] || { latitude: 20.5937, longitude: 78.9629 }; // Default to center of India
    } catch (error) {
      logger.error('Error getting coordinates:', error);
      return null;
    }
  }

  /**
   * Save weather data to database
   */
  private async saveWeatherData(weatherData: WeatherData): Promise<void> {
    try {
      const weather = new Weather({
        location: weatherData.location,
        current: weatherData.current,
        forecast: weatherData.forecast,
        alerts: weatherData.alerts,
        agriculturalAdvisory: weatherData.agriculturalAdvisory,
        dataSource: {
          provider: 'OpenWeatherMap',
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
          reliability: 0.85
        },
        isActive: true
      });

      await weather.save();
    } catch (error) {
      logger.error('Error saving weather data:', error);
    }
  }

  /**
   * Get weather alerts for a region
   */
  async getWeatherAlerts(state: string, district?: string): Promise<any[]> {
    try {
      const query: any = {
        'location.state': state,
        'alerts.0': { $exists: true },
        isActive: true
      };

      if (district) {
        query['location.district'] = district;
      }

      const weatherData = await Weather.find(query)
        .sort({ 'current.timestamp': -1 })
        .limit(10);

      const alerts = weatherData.flatMap(w => w.alerts);
      
      // Filter active alerts
      const activeAlerts = alerts.filter(alert => 
        new Date() >= alert.startTime && new Date() <= alert.endTime
      );

      return activeAlerts;
    } catch (error) {
      logger.error('Error getting weather alerts:', error);
      return [];
    }
  }

  /**
   * Get agricultural advisory for specific crops
   */
  async getAgriculturalAdvisory(
    state: string,
    district: string,
    crops?: string[]
  ): Promise<any[]> {
    try {
      const weather = await Weather.findOne({
        'location.state': state,
        'location.district': district,
        isActive: true
      }).sort({ 'current.timestamp': -1 });

      if (!weather) {
        return [];
      }

      let advisories = weather.agriculturalAdvisory;

      // Filter by crops if specified
      if (crops && crops.length > 0) {
        advisories = advisories.filter(advisory => 
          crops.includes(advisory.crop) || advisory.crop === 'all'
        );
      }

      // Filter valid advisories
      advisories = advisories.filter(advisory => 
        new Date() <= advisory.validUntil
      );

      return advisories;
    } catch (error) {
      logger.error('Error getting agricultural advisory:', error);
      return [];
    }
  }

  /**
   * Update weather data for all locations
   */
  async updateAllWeatherData(): Promise<void> {
    try {
      logger.info('Starting weather data update for all locations');

      // Get unique locations from database
      const locations = await Weather.distinct('location', { isActive: true });

      for (const location of locations) {
        try {
          await this.getWeatherByLocation(location.state, location.district);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
        } catch (error) {
          logger.error(`Error updating weather for ${location.state}, ${location.district}:`, error);
        }
      }

      logger.info('Weather data update completed');
    } catch (error) {
      logger.error('Error updating weather data:', error);
    }
  }

  /**
   * Schedule weather data updates
   */
  scheduleWeatherUpdates(): void {
    // Update weather data every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
      logger.info('Scheduled weather update started');
      await this.updateAllWeatherData();
    });

    // Update weather alerts every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      logger.info('Checking for weather alerts');
      // Implementation for fetching weather alerts
    });

    logger.info('Weather update schedules initialized');
  }
}

// Initialize weather service
let weatherService: WeatherService;

export const initializeWeatherService = async (): Promise<void> => {
  try {
    weatherService = new WeatherService();
    weatherService.scheduleWeatherUpdates();
    logger.info('Weather Service initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Weather Service:', error);
    throw error;
  }
};

export const getWeatherService = (): WeatherService => {
  if (!weatherService) {
    throw new Error('Weather Service not initialized');
  }
  return weatherService;
};