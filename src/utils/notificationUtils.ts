// Utilities for handling notifications

import { getLanguage } from './languageUtils';

// Interface for notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  category: NotificationCategory;
  actionUrl?: string;
  expiresAt?: Date;
}

// Enum for notification types
export enum NotificationType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

// Enum for notification categories
export enum NotificationCategory {
  Weather = 'weather',
  Crop = 'crop',
  Finance = 'finance',
  System = 'system',
}

// Category names in different languages
export const categoryNames: Record<NotificationCategory, Record<string, string>> = {
  [NotificationCategory.Weather]: {
    en: 'Weather',
    hi: 'मौसम',
  },
  [NotificationCategory.Crop]: {
    en: 'Crop',
    hi: 'फसल',
  },
  [NotificationCategory.Finance]: {
    en: 'Finance',
    hi: 'वित्त',
  },
  [NotificationCategory.System]: {
    en: 'System',
    hi: 'सिस्टम',
  },
};

// Type names in different languages
export const typeNames: Record<NotificationType, Record<string, string>> = {
  [NotificationType.Info]: {
    en: 'Information',
    hi: 'जानकारी',
  },
  [NotificationType.Success]: {
    en: 'Success',
    hi: 'सफलता',
  },
  [NotificationType.Warning]: {
    en: 'Warning',
    hi: 'चेतावनी',
  },
  [NotificationType.Error]: {
    en: 'Error',
    hi: 'त्रुटि',
  },
};

// Local storage key for notifications
const NOTIFICATIONS_STORAGE_KEY = 'krishimitra_notifications';

/**
 * Get all notifications from local storage
 * @returns Array of notifications
 */
export const getNotifications = (): Notification[] => {
  try {
    const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      
      // Convert timestamp strings back to Date objects
      return parsedNotifications.map((notification: any) => ({
        ...notification,
        timestamp: new Date(notification.timestamp),
        expiresAt: notification.expiresAt ? new Date(notification.expiresAt) : undefined,
      }));
    }
  } catch (error) {
    console.error('Error retrieving notifications:', error);
  }
  
  return [];
};

/**
 * Save notifications to local storage
 * @param notifications Array of notifications to save
 */
const saveNotifications = (notifications: Notification[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
};

/**
 * Add a new notification
 * @param notification The notification to add
 * @returns The added notification
 */
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification => {
  const notifications = getNotifications();
  
  const newNotification: Notification = {
    ...notification,
    id: generateNotificationId(),
    timestamp: new Date(),
    read: false,
  };
  
  notifications.unshift(newNotification);
  saveNotifications(notifications);
  
  // Show browser notification if supported
  showBrowserNotification(newNotification);
  
  return newNotification;
};

/**
 * Generate a unique ID for a notification
 * @returns A unique ID string
 */
const generateNotificationId = (): string => {
  return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Mark a notification as read
 * @param id The ID of the notification to mark as read
 * @returns True if the notification was found and updated, false otherwise
 */
export const markNotificationAsRead = (id: string): boolean => {
  const notifications = getNotifications();
  const notificationIndex = notifications.findIndex(notification => notification.id === id);
  
  if (notificationIndex !== -1) {
    notifications[notificationIndex].read = true;
    saveNotifications(notifications);
    return true;
  }
  
  return false;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = (): void => {
  const notifications = getNotifications();
  
  const updatedNotifications = notifications.map(notification => ({
    ...notification,
    read: true,
  }));
  
  saveNotifications(updatedNotifications);
};

/**
 * Delete a notification
 * @param id The ID of the notification to delete
 * @returns True if the notification was found and deleted, false otherwise
 */
export const deleteNotification = (id: string): boolean => {
  const notifications = getNotifications();
  const filteredNotifications = notifications.filter(notification => notification.id !== id);
  
  if (filteredNotifications.length !== notifications.length) {
    saveNotifications(filteredNotifications);
    return true;
  }
  
  return false;
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = (): void => {
  saveNotifications([]);
};

/**
 * Get unread notifications count
 * @returns The number of unread notifications
 */
export const getUnreadNotificationsCount = (): number => {
  const notifications = getNotifications();
  return notifications.filter(notification => !notification.read).length;
};

/**
 * Filter notifications by category
 * @param category The category to filter by
 * @returns Filtered notifications
 */
export const getNotificationsByCategory = (category: NotificationCategory): Notification[] => {
  const notifications = getNotifications();
  return notifications.filter(notification => notification.category === category);
};

/**
 * Filter notifications by type
 * @param type The type to filter by
 * @returns Filtered notifications
 */
export const getNotificationsByType = (type: NotificationType): Notification[] => {
  const notifications = getNotifications();
  return notifications.filter(notification => notification.type === type);
};

/**
 * Remove expired notifications
 * @returns The number of removed notifications
 */
export const removeExpiredNotifications = (): number => {
  const notifications = getNotifications();
  const now = new Date();
  
  const validNotifications = notifications.filter(
    notification => !notification.expiresAt || notification.expiresAt > now
  );
  
  const removedCount = notifications.length - validNotifications.length;
  
  if (removedCount > 0) {
    saveNotifications(validNotifications);
  }
  
  return removedCount;
};

/**
 * Show a browser notification if supported
 * @param notification The notification to show
 */
export const showBrowserNotification = (notification: Notification): void => {
  // Check if browser notifications are supported
  if (!('Notification' in window)) {
    return;
  }
  
  // Check if permission is already granted
  if (Notification.permission === 'granted') {
    createBrowserNotification(notification);
  }
  // Otherwise, request permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        createBrowserNotification(notification);
      }
    });
  }
};

/**
 * Create and show a browser notification
 * @param notification The notification data
 */
const createBrowserNotification = (notification: Notification): void => {
  const language = getLanguage();
  const categoryText = categoryNames[notification.category]?.[language] || 
                      categoryNames[notification.category]?.['en'] || 
                      notification.category;
  
  const browserNotification = new window.Notification(notification.title, {
    body: notification.message,
    tag: notification.id,
    icon: '/logo192.png', // Assuming the app has this icon
    badge: '/logo192.png',
    lang: language,
    dir: language === 'hi' ? 'rtl' : 'ltr',
  });
  
  // Handle click on notification
  browserNotification.onclick = () => {
    // Focus on window if it's not in focus
    window.focus();
    
    // Navigate to action URL if provided
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    
    // Close the notification
    browserNotification.close();
    
    // Mark as read
    markNotificationAsRead(notification.id);
  };
};

/**
 * Request permission for browser notifications
 * @returns A promise that resolves to the permission status
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    return 'denied';
  }
  
  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
};

/**
 * Check if browser notifications are supported
 * @returns True if supported, false otherwise
 */
export const areNotificationsSupported = (): boolean => {
  return 'Notification' in window;
};

/**
 * Get notification permission status
 * @returns The current permission status
 */
export const getNotificationPermission = (): NotificationPermission => {
  if (!('Notification' in window)) {
    return 'denied';
  }
  
  return Notification.permission;
};

/**
 * Create a weather alert notification
 * @param title The notification title
 * @param message The notification message
 * @param type The notification type
 * @param expiryHours Number of hours until the notification expires
 * @returns The created notification
 */
export const createWeatherAlert = (
  title: string,
  message: string,
  type: NotificationType = NotificationType.Warning,
  expiryHours: number = 24
): Notification => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiryHours);
  
  return addNotification({
    title,
    message,
    type,
    category: NotificationCategory.Weather,
    actionUrl: '/weather',
    expiresAt,
  });
};

/**
 * Create a crop advisory notification
 * @param title The notification title
 * @param message The notification message
 * @param type The notification type
 * @param expiryHours Number of hours until the notification expires
 * @returns The created notification
 */
export const createCropAdvisory = (
  title: string,
  message: string,
  type: NotificationType = NotificationType.Info,
  expiryHours: number = 72
): Notification => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiryHours);
  
  return addNotification({
    title,
    message,
    type,
    category: NotificationCategory.Crop,
    actionUrl: '/crops',
    expiresAt,
  });
};

/**
 * Create a financial alert notification
 * @param title The notification title
 * @param message The notification message
 * @param type The notification type
 * @param expiryHours Number of hours until the notification expires
 * @returns The created notification
 */
export const createFinancialAlert = (
  title: string,
  message: string,
  type: NotificationType = NotificationType.Info,
  expiryHours: number = 168 // 7 days
): Notification => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiryHours);
  
  return addNotification({
    title,
    message,
    type,
    category: NotificationCategory.Finance,
    actionUrl: '/finance',
    expiresAt,
  });
};

/**
 * Create a system notification
 * @param title The notification title
 * @param message The notification message
 * @param type The notification type
 * @param expiryHours Number of hours until the notification expires
 * @returns The created notification
 */
export const createSystemNotification = (
  title: string,
  message: string,
  type: NotificationType = NotificationType.Info,
  expiryHours?: number
): Notification => {
  let expiresAt: Date | undefined;
  
  if (expiryHours !== undefined) {
    expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiryHours);
  }
  
  return addNotification({
    title,
    message,
    type,
    category: NotificationCategory.System,
    expiresAt,
  });
};