// Utilities for analytics and tracking

import { getLanguage } from './languageUtils.ts';

// Event categories
export enum EventCategory {
  Navigation = 'navigation',
  Engagement = 'engagement',
  Weather = 'weather',
  Crop = 'crop',
  Finance = 'finance',
  Query = 'query',
  Error = 'error',
  Performance = 'performance',
  Offline = 'offline',
  FEEDBACK = 'feedback',
}

// Event actions
export enum EventAction {
  // Navigation actions
  PageView = 'page_view',
  Click = 'click',
  Search = 'search',
  Filter = 'filter',
  Sort = 'sort',
  
  // Engagement actions
  Login = 'login',
  Signup = 'signup',
  Share = 'share',
  Download = 'download',
  Print = 'print',
  Bookmark = 'bookmark',
  LanguageChange = 'language_change',
  LocationChange = 'location_change',
  Feedback = 'feedback',
  
  // Weather actions
  WeatherView = 'weather_view',
  ForecastView = 'forecast_view',
  AdvisoryView = 'advisory_view',
  
  // Crop actions
  CropView = 'crop_view',
  CropSearch = 'crop_search',
  CropRecommendation = 'crop_recommendation',
  
  // Finance actions
  LoanView = 'loan_view',
  SchemeView = 'scheme_view',
  InsuranceView = 'insurance_view',
  CalculatorUse = 'calculator_use',
  
  // Query actions
  QuerySubmit = 'query_submit',
  QueryResponse = 'query_response',
  VoiceInput = 'voice_input',
  SuggestedQueryUse = 'suggested_query_use',
  
  // Error actions
  ApiError = 'api_error',
  AppError = 'app_error',
  ValidationError = 'validation_error',
  
  // Performance actions
  AppLoad = 'app_load',
  ComponentLoad = 'component_load',
  ApiCall = 'api_call',
  
  // Offline actions
  OfflineMode = 'offline_mode',
  DataSync = 'data_sync',
  CacheUse = 'cache_use',
  
  // Feedback actions
  SUBMIT_FEEDBACK = 'submit_feedback',
  SAVE_OFFLINE_FEEDBACK = 'save_offline_feedback',
  SUBMIT_SURVEY = 'submit_survey',
  SAVE_OFFLINE_SURVEY = 'save_offline_survey',
  SYNC_FEEDBACK = 'sync_feedback',
  SYNC_SURVEY = 'sync_survey',
}

// Interface for analytics event
export interface AnalyticsEvent {
  category: EventCategory;
  action: EventAction;
  label?: string;
  value?: number;
  timestamp: Date;
  properties?: Record<string, any>;
}

// Local storage key for events queue
const EVENTS_QUEUE_STORAGE_KEY = 'krishimitra_analytics_queue';

// Maximum number of events to store in the queue
const MAX_QUEUE_SIZE = 100;

// Flag to indicate if analytics is enabled
let analyticsEnabled = true;

/**
 * Enable or disable analytics
 * @param enabled Whether analytics should be enabled
 */
export const setAnalyticsEnabled = (enabled: boolean): void => {
  analyticsEnabled = enabled;
  
  // If analytics is disabled, clear the queue
  if (!enabled) {
    clearEventsQueue();
  }
};

/**
 * Check if analytics is enabled
 * @returns True if analytics is enabled, false otherwise
 */
export const isAnalyticsEnabled = (): boolean => {
  return analyticsEnabled;
};

/**
 * Get the events queue from local storage
 * @returns Array of analytics events
 */
export const getEventsQueue = (): AnalyticsEvent[] => {
  try {
    const storedQueue = localStorage.getItem(EVENTS_QUEUE_STORAGE_KEY);
    if (storedQueue) {
      const parsedQueue = JSON.parse(storedQueue);
      
      // Convert timestamp strings back to Date objects
      return parsedQueue.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp),
      }));
    }
  } catch (error) {
    console.error('Error retrieving events queue:', error);
  }
  
  return [];
};

/**
 * Save the events queue to local storage
 * @param queue The events queue to save
 */
const saveEventsQueue = (queue: AnalyticsEvent[]): void => {
  try {
    localStorage.setItem(EVENTS_QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error saving events queue:', error);
  }
};

/**
 * Clear the events queue
 */
export const clearEventsQueue = (): void => {
  saveEventsQueue([]);
};

/**
 * Add an event to the queue
 * @param event The event to add
 */
const addEventToQueue = (event: AnalyticsEvent): void => {
  if (!analyticsEnabled) {
    return;
  }
  
  const queue = getEventsQueue();
  
  // Add the event to the queue
  queue.push(event);
  
  // If the queue is too large, remove the oldest events
  if (queue.length > MAX_QUEUE_SIZE) {
    queue.splice(0, queue.length - MAX_QUEUE_SIZE);
  }
  
  saveEventsQueue(queue);
  
  // Try to send the events immediately if online
  if (navigator.onLine) {
    sendQueuedEvents();
  }
};

/**
 * Send queued events to the analytics server
 * @param retryCount Number of retry attempts (default: 0)
 * @param maxRetries Maximum number of retries (default: 3)
 * @returns A promise that resolves when the events are sent
 */
export const sendQueuedEvents = async (retryCount: number = 0, maxRetries: number = 3): Promise<void> => {
  if (!analyticsEnabled || !navigator.onLine) {
    return;
  }
  
  const queue = getEventsQueue();
  if (queue.length === 0) {
    return;
  }
  
  try {
    // In a real app, you would send the events to your analytics server
    // For this demo, we'll just log them to the console and clear the queue
    console.log('Sending analytics events:', queue);
    
    // Simulate a successful API call
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random failures for testing retry mechanism
        if (Math.random() > 0.9) {
          reject(new Error('Random network error'));
        } else {
          resolve(true);
        }
      }, 500);
    });
    
    // Clear the queue after successful send
    clearEventsQueue();
    console.log('Analytics events sent successfully');
  } catch (error) {
    console.error(`Error sending analytics events (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);
    
    // Retry with exponential backoff if we haven't reached the maximum retries
    if (retryCount < maxRetries) {
      const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with 30s max
      console.log(`Retrying in ${backoffTime}ms...`);
      
      setTimeout(() => {
        sendQueuedEvents(retryCount + 1, maxRetries).catch(e => {
          console.error('Retry failed:', e);
        });
      }, backoffTime);
    } else {
      console.error('Maximum retry attempts reached. Events will remain in queue for next attempt.');
      // Keep the events in the queue to try again later
    }
  }
};

/**
 * Track an event
 * @param category The event category
 * @param action The event action
 * @param label Optional event label
 * @param value Optional event value
 * @param properties Optional additional properties
 */
export const trackEvent = (
  category: EventCategory,
  action: EventAction,
  label?: string,
  value?: number,
  properties?: Record<string, any>
): void => {
  if (!analyticsEnabled) {
    return;
  }
  
  const event: AnalyticsEvent = {
    category,
    action,
    label,
    value,
    timestamp: new Date(),
    properties: {
      ...properties,
      language: getLanguage(),
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      isOnline: navigator.onLine,
    },
  };
  
  addEventToQueue(event);
};

/**
 * Track a page view
 * @param pageName The name of the page
 * @param properties Optional additional properties
 */
export const trackPageView = (pageName: string, properties?: Record<string, any>): void => {
  trackEvent(EventCategory.Navigation, EventAction.PageView, pageName, undefined, properties);
};

/**
 * Track a click event
 * @param elementName The name of the clicked element
 * @param properties Optional additional properties
 */
export const trackClick = (elementName: string, properties?: Record<string, any>): void => {
  trackEvent(EventCategory.Navigation, EventAction.Click, elementName, undefined, properties);
};

/**
 * Track a search event
 * @param searchTerm The search term
 * @param resultsCount The number of search results
 * @param properties Optional additional properties
 */
export const trackSearch = (
  searchTerm: string,
  resultsCount: number,
  properties?: Record<string, any>
): void => {
  trackEvent(
    EventCategory.Navigation,
    EventAction.Search,
    searchTerm,
    resultsCount,
    properties
  );
};

/**
 * Track a filter event
 * @param filterName The name of the filter
 * @param filterValue The filter value
 * @param properties Optional additional properties
 */
export const trackFilter = (
  filterName: string,
  filterValue: string,
  properties?: Record<string, any>
): void => {
  trackEvent(
    EventCategory.Navigation,
    EventAction.Filter,
    `${filterName}:${filterValue}`,
    undefined,
    properties
  );
};

/**
 * Track a language change event
 * @param newLanguage The new language
 * @param oldLanguage The old language
 */
export const trackLanguageChange = (newLanguage: string, oldLanguage: string): void => {
  trackEvent(
    EventCategory.Engagement,
    EventAction.LanguageChange,
    `${oldLanguage} -> ${newLanguage}`,
    undefined,
    { newLanguage, oldLanguage }
  );
};

/**
 * Track a location change event
 * @param newLocation The new location
 * @param oldLocation The old location
 */
export const trackLocationChange = (
  newLocation: { lat: number; lng: number; name?: string },
  oldLocation?: { lat: number; lng: number; name?: string }
): void => {
  trackEvent(
    EventCategory.Engagement,
    EventAction.LocationChange,
    newLocation.name || `${newLocation.lat},${newLocation.lng}`,
    undefined,
    { newLocation, oldLocation }
  );
};

/**
 * Track a weather view event
 * @param locationType The type of location (current, saved, manual)
 * @param locationName The name of the location
 */
export const trackWeatherView = (locationType: string, locationName: string): void => {
  trackEvent(
    EventCategory.Weather,
    EventAction.WeatherView,
    locationName,
    undefined,
    { locationType }
  );
};

/**
 * Track a crop view event
 * @param cropName The name of the crop
 * @param cropId The ID of the crop
 */
export const trackCropView = (cropName: string, cropId: string): void => {
  trackEvent(
    EventCategory.Crop,
    EventAction.CropView,
    cropName,
    undefined,
    { cropId }
  );
};

/**
 * Track a loan view event
 * @param loanName The name of the loan
 * @param loanId The ID of the loan
 */
export const trackLoanView = (loanName: string, loanId: string): void => {
  trackEvent(
    EventCategory.Finance,
    EventAction.LoanView,
    loanName,
    undefined,
    { loanId }
  );
};

/**
 * Track a scheme view event
 * @param schemeName The name of the scheme
 * @param schemeId The ID of the scheme
 */
export const trackSchemeView = (schemeName: string, schemeId: string): void => {
  trackEvent(
    EventCategory.Finance,
    EventAction.SchemeView,
    schemeName,
    undefined,
    { schemeId }
  );
};

/**
 * Track a calculator use event
 * @param calculatorType The type of calculator
 * @param inputValues The input values
 */
export const trackCalculatorUse = (
  calculatorType: string,
  inputValues: Record<string, any>
): void => {
  trackEvent(
    EventCategory.Finance,
    EventAction.CalculatorUse,
    calculatorType,
    undefined,
    { inputValues }
  );
};

/**
 * Track a query submit event
 * @param query The query text
 * @param queryType The type of query (text, voice)
 */
export const trackQuerySubmit = (query: string, queryType: 'text' | 'voice'): void => {
  trackEvent(
    EventCategory.Query,
    EventAction.QuerySubmit,
    query,
    undefined,
    { queryType, queryLength: query.length }
  );
};

/**
 * Track a voice input event
 * @param duration The duration of the voice input in seconds
 * @param success Whether the voice input was successful
 */
export const trackVoiceInput = (duration: number, success: boolean): void => {
  trackEvent(
    EventCategory.Query,
    EventAction.VoiceInput,
    success ? 'success' : 'failure',
    duration,
    { success }
  );
};

/**
 * Track an API error event
 * @param endpoint The API endpoint
 * @param errorMessage The error message
 * @param statusCode The HTTP status code
 */
export const trackApiError = (
  endpoint: string,
  errorMessage: string,
  statusCode?: number
): void => {
  trackEvent(
    EventCategory.Error,
    EventAction.ApiError,
    endpoint,
    statusCode,
    { errorMessage, statusCode }
  );
};

/**
 * Track an app error event
 * @param errorMessage The error message
 * @param componentName The name of the component where the error occurred
 * @param stackTrace The error stack trace
 */
export const trackAppError = (
  errorMessage: string,
  componentName?: string,
  stackTrace?: string
): void => {
  trackEvent(
    EventCategory.Error,
    EventAction.AppError,
    componentName || 'unknown',
    undefined,
    { errorMessage, stackTrace }
  );
};

/**
 * Track app load performance
 * @param loadTime The load time in milliseconds
 */
export const trackAppLoad = (loadTime: number): void => {
  trackEvent(
    EventCategory.Performance,
    EventAction.AppLoad,
    undefined,
    loadTime,
    { loadTime }
  );
};

/**
 * Track component load performance
 * @param componentName The name of the component
 * @param loadTime The load time in milliseconds
 */
export const trackComponentLoad = (componentName: string, loadTime: number): void => {
  trackEvent(
    EventCategory.Performance,
    EventAction.ComponentLoad,
    componentName,
    loadTime,
    { loadTime }
  );
};

/**
 * Track API call performance
 * @param endpoint The API endpoint
 * @param responseTime The response time in milliseconds
 * @param success Whether the API call was successful
 */
export const trackApiCall = (
  endpoint: string,
  responseTime: number,
  success: boolean
): void => {
  trackEvent(
    EventCategory.Performance,
    EventAction.ApiCall,
    endpoint,
    responseTime,
    { responseTime, success }
  );
};

/**
 * Track offline mode usage
 * @param duration The duration of offline mode in seconds
 */
export const trackOfflineMode = (duration: number): void => {
  trackEvent(
    EventCategory.Offline,
    EventAction.OfflineMode,
    undefined,
    duration,
    { duration }
  );
};

/**
 * Track data sync event
 * @param dataType The type of data being synced
 * @param itemCount The number of items synced
 * @param success Whether the sync was successful
 */
export const trackDataSync = (
  dataType: string,
  itemCount: number,
  success: boolean
): void => {
  trackEvent(
    EventCategory.Offline,
    EventAction.DataSync,
    dataType,
    itemCount,
    { itemCount, success }
  );
};

/**
 * Initialize analytics
 * @param enabled Whether analytics should be enabled by default
 */
export const initAnalytics = (enabled: boolean = true): void => {
  setAnalyticsEnabled(enabled);
  
  // Set up event listeners for online/offline events
  window.addEventListener('online', () => {
    // When the app comes online, try to send queued events
    sendQueuedEvents();
  });
  
  // Track app load performance using modern Performance API
  if (window.performance) {
    // Use Navigation Timing API Level 2 if available
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry) {
      const loadTime = navEntry.domContentLoadedEventEnd - navEntry.startTime;
      trackAppLoad(loadTime);
    } else if (performance.timing) {
      // Fallback to deprecated Navigation Timing API Level 1
      // Note: This is deprecated but kept for backward compatibility
      const loadTime = performance.timing.domContentLoadedEventEnd - 
                       performance.timing.navigationStart;
      trackAppLoad(loadTime);
    }
  }
  
  // Track initial page view
  trackPageView(window.location.pathname);
  
  // Set up navigation tracking with proper type safety
  const originalPushState = window.history.pushState;
  window.history.pushState = function(state: any, title: string, url?: string | URL | null) {
    originalPushState.apply(this, [state, title, url]);
    // Only track if URL is provided and it's different from current path
    if (url) {
      const newPath = typeof url === 'string' ? new URL(url, window.location.origin).pathname : url.pathname;
      if (newPath !== window.location.pathname) {
        trackPageView(newPath);
      }
    }
  };
  
  // Handle browser back/forward navigation
  window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname);
  });
  
  // Handle initial page load and direct navigation
  window.addEventListener('load', () => {
    trackPageView(window.location.pathname);
  });
};