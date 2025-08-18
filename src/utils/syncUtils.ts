// Utilities for data synchronization between online and offline modes

import { isOnline, saveToCache, getFromCache, clearCache } from './offlineUtils';
import { trackEvent, EventCategory, EventAction } from './analyticsUtils';
import { logError, ErrorCategory, ErrorSeverity } from './errorUtils';

// Local storage keys
const SYNC_QUEUE_STORAGE_KEY = 'krishimitra_sync_queue';
const LAST_SYNC_STORAGE_KEY = 'krishimitra_last_sync';

// Types of sync operations
export enum SyncOperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

// Sync operation interface
export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  endpoint: string;
  data: any;
  timestamp: number;
  retryCount: number;
  priority: number; // Higher number = higher priority
}

// Sync status interface
export interface SyncStatus {
  lastSyncTime: number | null;
  pendingOperations: number;
  isSyncing: boolean;
}

// Default sync interval in milliseconds (15 minutes)
const DEFAULT_SYNC_INTERVAL = 15 * 60 * 1000;

// Maximum retry attempts for sync operations
const MAX_RETRY_ATTEMPTS = 5;

// Sync in progress flag
let isSyncing = false;

/**
 * Get the sync queue from local storage
 * @returns Array of sync operations
 */
export const getSyncQueue = (): SyncOperation[] => {
  try {
    const queueString = localStorage.getItem(SYNC_QUEUE_STORAGE_KEY);
    if (queueString) {
      return JSON.parse(queueString);
    }
  } catch (error) {
    logError({
      message: 'Failed to get sync queue from local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
  }
  
  return [];
};

/**
 * Save the sync queue to local storage
 * @param queue The sync queue to save
 */
export const saveSyncQueue = (queue: SyncOperation[]): void => {
  try {
    localStorage.setItem(SYNC_QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (error) {
    logError({
      message: 'Failed to save sync queue to local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
  }
};

/**
 * Add an operation to the sync queue
 * @param operation The operation to add
 */
export const addToSyncQueue = (operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>): void => {
  try {
    const queue = getSyncQueue();
    
    const newOperation: SyncOperation = {
      ...operation,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };
    
    queue.push(newOperation);
    saveSyncQueue(queue);
    
    // Track the event
    trackEvent({
      category: EventCategory.SYNC,
      action: EventAction.ADD_TO_SYNC_QUEUE,
      label: operation.endpoint,
    });
    
    // Try to sync immediately if online
    if (isOnline()) {
      syncData();
    }
  } catch (error) {
    logError({
      message: 'Failed to add operation to sync queue',
      error: error as Error,
      category: ErrorCategory.SYNC,
      severity: ErrorSeverity.WARNING,
      context: { operation },
    });
  }
};

/**
 * Remove an operation from the sync queue
 * @param operationId The ID of the operation to remove
 */
export const removeFromSyncQueue = (operationId: string): void => {
  try {
    const queue = getSyncQueue();
    const updatedQueue = queue.filter(op => op.id !== operationId);
    saveSyncQueue(updatedQueue);
  } catch (error) {
    logError({
      message: 'Failed to remove operation from sync queue',
      error: error as Error,
      category: ErrorCategory.SYNC,
      severity: ErrorSeverity.WARNING,
      context: { operationId },
    });
  }
};

/**
 * Clear the sync queue
 */
export const clearSyncQueue = (): void => {
  try {
    saveSyncQueue([]);
  } catch (error) {
    logError({
      message: 'Failed to clear sync queue',
      error: error as Error,
      category: ErrorCategory.SYNC,
      severity: ErrorSeverity.WARNING,
    });
  }
};

/**
 * Get the last sync time
 * @returns The timestamp of the last successful sync or null if never synced
 */
export const getLastSyncTime = (): number | null => {
  try {
    const lastSyncString = localStorage.getItem(LAST_SYNC_STORAGE_KEY);
    if (lastSyncString) {
      return parseInt(lastSyncString, 10);
    }
  } catch (error) {
    logError({
      message: 'Failed to get last sync time from local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
  }
  
  return null;
};

/**
 * Set the last sync time
 * @param timestamp The timestamp to set
 */
export const setLastSyncTime = (timestamp: number): void => {
  try {
    localStorage.setItem(LAST_SYNC_STORAGE_KEY, timestamp.toString());
  } catch (error) {
    logError({
      message: 'Failed to save last sync time to local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
  }
};

/**
 * Get the current sync status
 * @returns The current sync status
 */
export const getSyncStatus = (): SyncStatus => {
  return {
    lastSyncTime: getLastSyncTime(),
    pendingOperations: getSyncQueue().length,
    isSyncing,
  };
};

/**
 * Process a single sync operation
 * @param operation The operation to process
 * @returns Promise that resolves to true if successful, false otherwise
 */
const processSyncOperation = async (operation: SyncOperation): Promise<boolean> => {
  try {
    let url = operation.endpoint;
    let method = 'POST';
    
    // Determine HTTP method based on operation type
    switch (operation.type) {
      case SyncOperationType.CREATE:
        method = 'POST';
        break;
      case SyncOperationType.UPDATE:
        method = 'PUT';
        break;
      case SyncOperationType.DELETE:
        method = 'DELETE';
        break;
    }
    
    // Make the API request
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'DELETE' ? JSON.stringify(operation.data) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    // Track successful sync
    trackEvent({
      category: EventCategory.SYNC,
      action: EventAction.SYNC_OPERATION_SUCCESS,
      label: operation.endpoint,
    });
    
    return true;
  } catch (error) {
    // Increment retry count
    operation.retryCount++;
    
    // Log the error
    logError({
      message: 'Failed to process sync operation',
      error: error as Error,
      category: ErrorCategory.SYNC,
      severity: operation.retryCount >= MAX_RETRY_ATTEMPTS ? ErrorSeverity.ERROR : ErrorSeverity.WARNING,
      context: { operation },
    });
    
    // Track failed sync
    trackEvent({
      category: EventCategory.SYNC,
      action: EventAction.SYNC_OPERATION_FAILURE,
      label: operation.endpoint,
    });
    
    return false;
  }
};

/**
 * Synchronize data with the server
 * @param force Force synchronization even if already syncing
 * @returns Promise that resolves when sync is complete
 */
export const syncData = async (force: boolean = false): Promise<void> => {
  // Check if already syncing and not forced
  if (isSyncing && !force) {
    return;
  }
  
  // Check if online
  if (!isOnline()) {
    return;
  }
  
  try {
    isSyncing = true;
    
    // Track sync start
    trackEvent({
      category: EventCategory.SYNC,
      action: EventAction.SYNC_START,
    });
    
    // Get the sync queue
    let queue = getSyncQueue();
    
    // Sort by priority (higher first) and then by timestamp (older first)
    queue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.timestamp - b.timestamp;
    });
    
    // Process each operation
    const successfulOperations: string[] = [];
    const failedOperations: SyncOperation[] = [];
    
    for (const operation of queue) {
      // Skip operations that have exceeded retry attempts
      if (operation.retryCount >= MAX_RETRY_ATTEMPTS) {
        failedOperations.push(operation);
        continue;
      }
      
      const success = await processSyncOperation(operation);
      
      if (success) {
        successfulOperations.push(operation.id);
      } else {
        failedOperations.push(operation);
      }
    }
    
    // Remove successful operations from the queue
    queue = queue.filter(op => !successfulOperations.includes(op.id));
    
    // Update failed operations in the queue
    queue = queue.map(op => {
      const failedOp = failedOperations.find(failed => failed.id === op.id);
      return failedOp || op;
    });
    
    // Save the updated queue
    saveSyncQueue(queue);
    
    // Update last sync time if any operation was successful
    if (successfulOperations.length > 0) {
      setLastSyncTime(Date.now());
    }
    
    // Track sync completion
    trackEvent({
      category: EventCategory.SYNC,
      action: EventAction.SYNC_COMPLETE,
      value: successfulOperations.length,
    });
  } catch (error) {
    logError({
      message: 'Failed to synchronize data',
      error: error as Error,
      category: ErrorCategory.SYNC,
      severity: ErrorSeverity.ERROR,
    });
    
    // Track sync error
    trackEvent({
      category: EventCategory.SYNC,
      action: EventAction.SYNC_ERROR,
    });
  } finally {
    isSyncing = false;
  }
};

/**
 * Schedule periodic data synchronization
 * @param interval The interval in milliseconds (default: 15 minutes)
 * @returns The interval ID
 */
export const scheduleSync = (interval: number = DEFAULT_SYNC_INTERVAL): number => {
  // Perform initial sync
  syncData();
  
  // Schedule periodic sync
  return window.setInterval(() => {
    syncData();
  }, interval);
};

/**
 * Cancel scheduled synchronization
 * @param intervalId The interval ID to cancel
 */
export const cancelScheduledSync = (intervalId: number): void => {
  window.clearInterval(intervalId);
};

/**
 * Create data with offline support
 * @param endpoint The API endpoint
 * @param data The data to create
 * @param cacheKey The cache key for offline storage
 * @returns Promise that resolves with the created data
 */
export const createWithOfflineSupport = async<T>(
  endpoint: string,
  data: any,
  cacheKey: string
): Promise<T> => {
  try {
    if (isOnline()) {
      // Online mode: Send to server
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Update cache
      const cachedData = getFromCache<T[]>(cacheKey) || [];
      cachedData.push(responseData);
      saveToCache(cacheKey, cachedData);
      
      return responseData;
    } else {
      // Offline mode: Add to sync queue and update local cache
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const tempData = { ...data, id: tempId, _tempId: true };
      
      // Add to sync queue
      addToSyncQueue({
        type: SyncOperationType.CREATE,
        endpoint,
        data,
        priority: 1,
      });
      
      // Update cache
      const cachedData = getFromCache<T[]>(cacheKey) || [];
      cachedData.push(tempData as unknown as T);
      saveToCache(cacheKey, cachedData);
      
      return tempData as unknown as T;
    }
  } catch (error) {
    logError({
      message: 'Failed to create data with offline support',
      error: error as Error,
      category: ErrorCategory.SYNC,
      severity: ErrorSeverity.ERROR,
      context: { endpoint, data },
    });
    
    // Fallback to offline mode
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempData = { ...data, id: tempId, _tempId: true };
    
    // Add to sync queue
    addToSyncQueue({
      type: SyncOperationType.CREATE,
      endpoint,
      data,
      priority: 1,
    });
    
    // Update cache
    const cachedData = getFromCache<T[]>(cacheKey) || [];
    cachedData.push(tempData as unknown as T);
    saveToCache(cacheKey, cachedData);
    
    return tempData as unknown as T;
  }
};

/**
 * Update data with offline support
 * @param endpoint The API endpoint
 * @param id The ID of the data to update
 * @param data The updated data
 * @param cacheKey The cache key for offline storage
 * @returns Promise that resolves with the updated data
 */
export const updateWithOfflineSupport = async<T extends { id: string }>(
  endpoint: string,
  id: string,
  data: any,
  cacheKey: string
): Promise<T> => {
  try {
    if (isOnline()) {
      // Online mode: Send to server
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Update cache
      const cachedData = getFromCache<T[]>(cacheKey) || [];
      const updatedCache = cachedData.map(item => item.id === id ? responseData : item);
      saveToCache(cacheKey, updatedCache);
      
      return responseData;
    } else {
      // Offline mode: Add to sync queue and update local cache
      const updatedData = { ...data, id };
      
      // Add to sync queue
      addToSyncQueue({
        type: SyncOperationType.UPDATE,
        endpoint: `${endpoint}/${id}`,
        data,
        priority: 2,
      });
      
      // Update cache
      const cachedData = getFromCache<T[]>(cacheKey) || [];
      const updatedCache = cachedData.map(item => item.id === id ? updatedData as unknown as T : item);
      saveToCache(cacheKey, updatedCache);
      
      return updatedData as unknown as T;
    }
  } catch (error) {
    logError({
      message: 'Failed to update data with offline support',
      error: error as Error,
      category: ErrorCategory.SYNC,
      severity: ErrorSeverity.ERROR,
      context: { endpoint, id, data },
    });
    
    // Fallback to offline mode
    const updatedData = { ...data, id };
    
    // Add to sync queue
    addToSyncQueue({
      type: SyncOperationType.UPDATE,
      endpoint: `${endpoint}/${id}`,
      data,
      priority: 2,
    });
    
    // Update cache
    const cachedData = getFromCache<T[]>(cacheKey) || [];
    const updatedCache = cachedData.map(item => item.id === id ? updatedData as unknown as T : item);
    saveToCache(cacheKey, updatedCache);
    
    return updatedData as unknown as T;
  }
};

/**
 * Delete data with offline support
 * @param endpoint The API endpoint
 * @param id The ID of the data to delete
 * @param cacheKey The cache key for offline storage
 * @returns Promise that resolves when the data is deleted
 */
export const deleteWithOfflineSupport = async(
  endpoint: string,
  id: string,
  cacheKey: string
): Promise<void> => {
  try {
    if (isOnline()) {
      // Online mode: Send to server
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      // Update cache
      const cachedData = getFromCache<any[]>(cacheKey) || [];
      const updatedCache = cachedData.filter(item => item.id !== id);
      saveToCache(cacheKey, updatedCache);
    } else {
      // Offline mode: Add to sync queue and update local cache
      
      // Add to sync queue
      addToSyncQueue({
        type: SyncOperationType.DELETE,
        endpoint: `${endpoint}/${id}`,
        data: { id },
        priority: 3,
      });
      
      // Update cache
      const cachedData = getFromCache<any[]>(cacheKey) || [];
      const updatedCache = cachedData.filter(item => item.id !== id);
      saveToCache(cacheKey, updatedCache);
    }
  } catch (error) {
    logError({
      message: 'Failed to delete data with offline support',
      error: error as Error,
      category: ErrorCategory.SYNC,
      severity: ErrorSeverity.ERROR,
      context: { endpoint, id },
    });
    
    // Fallback to offline mode
    
    // Add to sync queue
    addToSyncQueue({
      type: SyncOperationType.DELETE,
      endpoint: `${endpoint}/${id}`,
      data: { id },
      priority: 3,
    });
    
    // Update cache
    const cachedData = getFromCache<any[]>(cacheKey) || [];
    const updatedCache = cachedData.filter(item => item.id !== id);
    saveToCache(cacheKey, updatedCache);
  }
};

/**
 * Initialize the sync system
 * @param syncInterval The interval in milliseconds for periodic sync
 * @returns The interval ID for the scheduled sync
 */
export const initSync = (syncInterval: number = DEFAULT_SYNC_INTERVAL): number => {
  // Listen for online/offline events
  window.addEventListener('online', () => {
    // When coming back online, try to sync
    syncData();
  });
  
  // Schedule periodic sync
  return scheduleSync(syncInterval);
};