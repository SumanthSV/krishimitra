import Redis from 'redis';
import logger from '../utils/logger';

export class CacheService {
  private client: any;
  private isConnected: boolean = false;

  constructor() {
    this.client = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          logger.error('Redis server connection refused');
          return new Error('Redis server connection refused');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          logger.error('Redis retry time exhausted');
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          logger.error('Redis max retry attempts reached');
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    this.client.on('connect', () => {
      logger.info('Redis client connected');
      this.isConnected = true;
    });

    this.client.on('error', (error: Error) => {
      logger.error('Redis client error:', error);
      this.isConnected = false;
    });

    this.client.on('end', () => {
      logger.info('Redis client disconnected');
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
    } catch (error) {
      logger.error('Failed to disconnect from Redis:', error);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.isConnected) return null;
      return await this.client.get(key);
    } catch (error) {
      logger.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      if (!this.isConnected) return false;
      
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      logger.error('Redis SET error:', error);
      return false;
    }
  }

  async setex(key: string, seconds: number, value: string): Promise<boolean> {
    return this.set(key, value, seconds);
  }

  async del(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) return false;
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) return false;
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS error:', error);
      return false;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      if (!this.isConnected) return [];
      return await this.client.keys(pattern);
    } catch (error) {
      logger.error('Redis KEYS error:', error);
      return [];
    }
  }

  async flushall(): Promise<boolean> {
    try {
      if (!this.isConnected) return false;
      await this.client.flushAll();
      return true;
    } catch (error) {
      logger.error('Redis FLUSHALL error:', error);
      return false;
    }
  }

  async hget(key: string, field: string): Promise<string | null> {
    try {
      if (!this.isConnected) return null;
      return await this.client.hGet(key, field);
    } catch (error) {
      logger.error('Redis HGET error:', error);
      return null;
    }
  }

  async hset(key: string, field: string, value: string): Promise<boolean> {
    try {
      if (!this.isConnected) return false;
      await this.client.hSet(key, field, value);
      return true;
    } catch (error) {
      logger.error('Redis HSET error:', error);
      return false;
    }
  }

  async hgetall(key: string): Promise<Record<string, string> | null> {
    try {
      if (!this.isConnected) return null;
      return await this.client.hGetAll(key);
    } catch (error) {
      logger.error('Redis HGETALL error:', error);
      return null;
    }
  }

  isReady(): boolean {
    return this.isConnected;
  }
}

// Initialize cache service
let cacheService: CacheService;

export const initializeCacheService = async (): Promise<void> => {
  try {
    cacheService = new CacheService();
    await cacheService.connect();
    logger.info('Cache Service initialized successfully');
  } catch (error) {
    logger.warn('Cache Service initialization failed, continuing without cache:', error);
    // Create a mock cache service for development
    cacheService = {
      get: async () => null,
      set: async () => true,
      setex: async () => true,
      del: async () => true,
      exists: async () => false,
      keys: async () => [],
      flushall: async () => true,
      hget: async () => null,
      hset: async () => true,
      hgetall: async () => null,
      isReady: () => false,
      connect: async () => {},
      disconnect: async () => {}
    } as any;
  }
};

export const getCacheService = (): CacheService => {
  if (!cacheService) {
    throw new Error('Cache Service not initialized');
  }
  return cacheService;
};