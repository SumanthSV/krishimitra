import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface KrishiMitraDB extends DBSchema {
  crops: {
    key: string;
    value: any;
  };
  weather: {
    key: string;
    value: any;
  };
  queries: {
    key: string;
    value: any;
  };
  market: {
    key: string;
    value: any;
  };
  finance: {
    key: string;
    value: any;
  };
  advisories: {
    key: string;
    value: any;
  };
}

export class OfflineService {
  private db: IDBPDatabase<KrishiMitraDB> | null = null;
  private dbName = 'KrishiMitraDB';
  private dbVersion = 1;

  async initialize(): Promise<void> {
    try {
      this.db = await openDB<KrishiMitraDB>(this.dbName, this.dbVersion, {
        upgrade(db) {
          // Create object stores
          if (!db.objectStoreNames.contains('crops')) {
            db.createObjectStore('crops', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('weather')) {
            db.createObjectStore('weather', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('queries')) {
            db.createObjectStore('queries', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('market')) {
            db.createObjectStore('market', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('finance')) {
            db.createObjectStore('finance', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('advisories')) {
            db.createObjectStore('advisories', { keyPath: 'id' });
          }
        },
      });
    } catch (error) {
      console.error('Failed to initialize offline database:', error);
      throw error;
    }
  }

  // Crop data methods
  async saveCrops(crops: any[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const tx = this.db.transaction('crops', 'readwrite');
    for (const crop of crops) {
      await tx.store.put({ ...crop, id: crop._id || crop.id, lastUpdated: Date.now() });
    }
    await tx.done;
  }

  async getCrops(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.getAll('crops');
  }

  async getCropById(id: string): Promise<any | null> {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.get('crops', id);
  }

  // Weather data methods
  async saveWeather(weatherData: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const id = `${weatherData.location.state}_${weatherData.location.district}`;
    await this.db.put('weather', { ...weatherData, id, lastUpdated: Date.now() });
  }

  async getWeather(state: string, district: string): Promise<any | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const id = `${state}_${district}`;
    return await this.db.get('weather', id);
  }

  // Query history methods
  async saveQuery(query: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const id = query.id || `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await this.db.put('queries', { ...query, id, timestamp: Date.now() });
  }

  async getQueries(limit: number = 50): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const queries = await this.db.getAll('queries');
    return queries
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Market data methods
  async saveMarketData(marketData: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const id = `market_${marketData.crop}_${marketData.state || 'all'}_${Date.now()}`;
    await this.db.put('market', { ...marketData, id, lastUpdated: Date.now() });
  }

  async getMarketData(crop?: string, state?: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const allData = await this.db.getAll('market');
    
    return allData.filter(data => {
      if (crop && !data.crop.toLowerCase().includes(crop.toLowerCase())) return false;
      if (state && data.state && !data.state.toLowerCase().includes(state.toLowerCase())) return false;
      return true;
    });
  }

  // Finance data methods
  async saveFinanceData(financeData: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const id = financeData.id || `finance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await this.db.put('finance', { ...financeData, id, lastUpdated: Date.now() });
  }

  async getFinanceData(type?: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const allData = await this.db.getAll('finance');
    
    if (type) {
      return allData.filter(data => data.type === type);
    }
    
    return allData;
  }

  // Advisory data methods
  async saveAdvisories(advisories: any[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const tx = this.db.transaction('advisories', 'readwrite');
    for (const advisory of advisories) {
      const id = advisory.id || `advisory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await tx.store.put({ ...advisory, id, lastUpdated: Date.now() });
    }
    await tx.done;
  }

  async getAdvisories(type?: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const allData = await this.db.getAll('advisories');
    
    if (type) {
      return allData.filter(data => data.type === type);
    }
    
    return allData;
  }

  // Sync methods
  async getPendingSyncData(): Promise<{
    queries: any[];
    feedback: any[];
    userUpdates: any[];
  }> {
    if (!this.db) throw new Error('Database not initialized');
    
    // Get data that needs to be synced when online
    const queries = await this.db.getAll('queries');
    const pendingQueries = queries.filter(q => !q.synced);

    return {
      queries: pendingQueries,
      feedback: [], // Would implement feedback storage
      userUpdates: [] // Would implement user update storage
    };
  }

  async markAsSynced(type: string, ids: string[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const tx = this.db.transaction(type as any, 'readwrite');
    for (const id of ids) {
      const item = await tx.store.get(id);
      if (item) {
        await tx.store.put({ ...item, synced: true });
      }
    }
    await tx.done;
  }

  // Utility methods
  async clearExpiredData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const expiryTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
    
    const stores = ['weather', 'market', 'advisories'];
    
    for (const storeName of stores) {
      const tx = this.db.transaction(storeName as any, 'readwrite');
      const allData = await tx.store.getAll();
      
      for (const item of allData) {
        if (item.lastUpdated < expiryTime) {
          await tx.store.delete(item.id);
        }
      }
      
      await tx.done;
    }
  }

  async getStorageUsage(): Promise<{
    used: number;
    available: number;
    percentage: number;
  }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const available = estimate.quota || 0;
      
      return {
        used,
        available,
        percentage: available > 0 ? (used / available) * 100 : 0
      };
    }
    
    return { used: 0, available: 0, percentage: 0 };
  }
}

// Singleton instance
let offlineService: OfflineService | null = null;

export const getOfflineService = async (): Promise<OfflineService> => {
  if (!offlineService) {
    offlineService = new OfflineService();
    await offlineService.initialize();
  }
  return offlineService;
};

export default OfflineService;