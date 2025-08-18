// Utilities for handling offline functionality

// Types for offline data management
export interface CacheConfig {
  maxAge: number; // Maximum age of cached data in milliseconds
  key: string; // Key to use for storing in localStorage
}

// Default cache configuration
const defaultCacheConfig: CacheConfig = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  key: 'app_cache',
};

// Interface for cached data with timestamp
export interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Save data to cache with timestamp
 * @param data Data to cache
 * @param config Cache configuration
 */
export const saveToCache = <T>(data: T, config: Partial<CacheConfig> = {}): void => {
  const { key } = { ...defaultCacheConfig, ...config };
  
  const cachedData: CachedData<T> = {
    data,
    timestamp: Date.now(),
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(cachedData));
  } catch (error) {
    console.error('Failed to save data to cache:', error);
    // If localStorage is full, try to clear some space
    try {
      clearOldCacheEntries();
      localStorage.setItem(key, JSON.stringify(cachedData));
    } catch (e) {
      console.error('Failed to save data to cache even after clearing old entries:', e);
    }
  }
};

/**
 * Get data from cache if it exists and is not expired
 * @param config Cache configuration
 * @returns The cached data or null if not found or expired
 */
export const getFromCache = <T>(config: Partial<CacheConfig> = {}): T | null => {
  const { key, maxAge } = { ...defaultCacheConfig, ...config };
  
  try {
    const cachedDataJson = localStorage.getItem(key);
    if (!cachedDataJson) return null;
    
    const cachedData: CachedData<T> = JSON.parse(cachedDataJson);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - cachedData.timestamp > maxAge) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cachedData.data;
  } catch (error) {
    console.error('Failed to get data from cache:', error);
    return null;
  }
};

/**
 * Clear a specific cache entry
 * @param config Cache configuration
 */
export const clearCache = (config: Partial<CacheConfig> = {}): void => {
  const { key } = { ...defaultCacheConfig, ...config };
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
};

/**
 * Clear all cache entries that are older than their maxAge
 */
export const clearOldCacheEntries = (): void => {
  try {
    const now = Date.now();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      // Only process keys that look like they might be our cache entries
      if (key.includes('_cache')) {
        try {
          const item = localStorage.getItem(key);
          if (!item) continue;
          
          const cachedData = JSON.parse(item);
          
          // If it has a timestamp property, it's likely our cache entry
          if (cachedData.timestamp) {
            // Assume default maxAge if we don't know the specific config
            if (now - cachedData.timestamp > defaultCacheConfig.maxAge) {
              localStorage.removeItem(key);
            }
          }
        } catch (e) {
          // Skip this item if we can't parse it
          continue;
        }
      }
    }
  } catch (error) {
    console.error('Failed to clear old cache entries:', error);
  }
};

/**
 * Check if the device is online
 * @returns True if online, false otherwise
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Register event listeners for online/offline status changes
 * @param onOnline Callback for when the device goes online
 * @param onOffline Callback for when the device goes offline
 */
export const registerConnectivityListeners = (
  onOnline: () => void,
  onOffline: () => void
): () => void => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // Return a function to remove the event listeners
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

/**
 * Estimate the available storage space in localStorage
 * @returns Approximate available space in bytes
 */
export const getAvailableStorageSpace = (): number => {
  try {
    // Start with a small string and keep doubling until we hit an error
    const testKey = '__storage_test__';
    let size = 1024; // 1KB
    let totalSize = 0;
    
    localStorage.removeItem(testKey);
    
    while (true) {
      try {
        // Generate a string of the current size
        const testString = new Array(size + 1).join('a');
        localStorage.setItem(testKey, testString);
        totalSize += size;
        size *= 2; // Double the size for the next iteration
      } catch (e) {
        break; // We've hit the limit
      }
    }
    
    localStorage.removeItem(testKey);
    return totalSize;
  } catch (error) {
    console.error('Failed to estimate available storage space:', error);
    return 0;
  }
};

/**
 * Check if there's enough storage space for the given data
 * @param data The data to check
 * @returns True if there's enough space, false otherwise
 */
export const hasEnoughStorageSpace = (data: any): boolean => {
  try {
    const serializedData = JSON.stringify(data);
    const dataSize = new Blob([serializedData]).size;
    const availableSpace = getAvailableStorageSpace();
    
    return availableSpace > dataSize * 1.2; // Add 20% buffer
  } catch (error) {
    console.error('Failed to check available storage space:', error);
    return false;
  }
};

/**
 * Fetch data with offline fallback
 * @param fetchFn Function that fetches the data
 * @param cacheConfig Cache configuration
 * @returns The fetched data and a flag indicating if it's from cache
 */
export const fetchWithOfflineFallback = async <T>(
  fetchFn: () => Promise<T>,
  cacheConfig: Partial<CacheConfig> = {}
): Promise<{ data: T; isOffline: boolean }> => {
  const config = { ...defaultCacheConfig, ...cacheConfig };
  
  // If online, try to fetch fresh data
  if (isOnline()) {
    try {
      const data = await fetchFn();
      saveToCache(data, config);
      return { data, isOffline: false };
    } catch (error) {
      console.warn('Failed to fetch data, falling back to cache:', error);
    }
  }
  
  // If offline or fetch failed, try to get from cache
  const cachedData = getFromCache<T>(config);
  if (cachedData) {
    return { data: cachedData, isOffline: true };
  }
  
  // If no cached data, throw an error
  throw new Error('No data available offline and fetch failed');
};

/**
 * Initialize the offline utilities
 */
export const initializeOfflineUtils = (): void => {
  // Clear old cache entries on startup
  clearOldCacheEntries();
  
  // Register connectivity listeners for logging
  registerConnectivityListeners(
    () => console.log('Device is now online'),
    () => console.log('Device is now offline')
  );
};