// Utilities for error handling, tracking, and logging

import { getLanguage } from './languageUtils.ts';
import { trackAppError, trackApiError } from './analyticsUtils.ts';

// Error severity levels
export enum ErrorSeverity {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical',
}

// Error categories
export enum ErrorCategory {
  Network = 'network',
  API = 'api',
  UI = 'ui',
  Data = 'data',
  Authentication = 'authentication',
  Permission = 'permission',
  Validation = 'validation',
  Storage = 'storage',
  Offline = 'offline',
  Unknown = 'unknown',
}

// Interface for error context
export interface ErrorContext {
  componentName?: string;
  functionName?: string;
  userId?: string;
  location?: string;
  additionalData?: Record<string, any>;
}

// Interface for error details
export interface ErrorDetails {
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: Date;
  context?: ErrorContext;
  originalError?: Error;
  stackTrace?: string;
}

// Error messages in different languages
export const errorMessages: Record<string, Record<string, string>> = {
  networkError: {
    en: 'Network error. Please check your internet connection.',
    hi: 'नेटवर्क त्रुटि। कृपया अपने इंटरनेट कनेक्शन की जांच करें।',
  },
  serverError: {
    en: 'Server error. Please try again later.',
    hi: 'सर्वर त्रुटि। कृपया बाद में पुन: प्रयास करें।',
  },
  authError: {
    en: 'Authentication error. Please log in again.',
    hi: 'प्रमाणीकरण त्रुटि। कृपया फिर से लॉग इन करें।',
  },
  permissionError: {
    en: 'Permission denied. You do not have access to this feature.',
    hi: 'अनुमति अस्वीकृत। आपके पास इस सुविधा तक पहुंच नहीं है।',
  },
  validationError: {
    en: 'Validation error. Please check your input.',
    hi: 'मान्यता त्रुटि। कृपया अपना इनपुट जांचें।',
  },
  dataError: {
    en: 'Data error. The requested information is not available.',
    hi: 'डेटा त्रुटि। अनुरोधित जानकारी उपलब्ध नहीं है।',
  },
  storageError: {
    en: 'Storage error. Unable to save data locally.',
    hi: 'स्टोरेज त्रुटि। डेटा को स्थानीय रूप से सहेजने में असमर्थ।',
  },
  offlineError: {
    en: 'You are offline. Some features may not be available.',
    hi: 'आप ऑफ़लाइन हैं। कुछ सुविधाएँ उपलब्ध नहीं हो सकती हैं।',
  },
  unknownError: {
    en: 'An unknown error occurred. Please try again.',
    hi: 'एक अज्ञात त्रुटि हुई। कृपया पुन: प्रयास करें।',
  },
};

// Maximum number of errors to store in history
const MAX_ERROR_HISTORY = 50;

// Local storage key for error history
const ERROR_HISTORY_STORAGE_KEY = 'krishimitra_error_history';

// Global error handler function
let globalErrorHandler: ((error: ErrorDetails) => void) | null = null;

/**
 * Set a global error handler function
 * @param handler The error handler function
 */
export const setGlobalErrorHandler = (handler: (error: ErrorDetails) => void): void => {
  globalErrorHandler = handler;
};

/**
 * Get a localized error message
 * @param key The error message key
 * @returns The localized error message
 */
export const getErrorMessage = (key: string): string => {
  const language = getLanguage();
  return errorMessages[key]?.[language] || errorMessages[key]?.['en'] || key;
};

/**
 * Create an error details object
 * @param message The error message
 * @param severity The error severity
 * @param category The error category
 * @param context The error context
 * @param originalError The original error object
 * @returns The error details object
 */
export const createErrorDetails = (
  message: string,
  severity: ErrorSeverity = ErrorSeverity.Error,
  category: ErrorCategory = ErrorCategory.Unknown,
  context?: ErrorContext,
  originalError?: Error
): ErrorDetails => {
  return {
    message,
    severity,
    category,
    timestamp: new Date(),
    context,
    originalError,
    stackTrace: originalError?.stack,
  };
};

/**
 * Log an error to the console
 * @param error The error details
 */
export const logError = (error: ErrorDetails): void => {
  const { severity, category, message, context, originalError, stackTrace } = error;
  
  const logObject = {
    severity,
    category,
    message,
    timestamp: error.timestamp.toISOString(),
    context,
    originalError,
    stackTrace,
  };
  
  switch (severity) {
    case ErrorSeverity.Info:
      console.info(`[${category}] ${message}`, logObject);
      break;
    case ErrorSeverity.Warning:
      console.warn(`[${category}] ${message}`, logObject);
      break;
    case ErrorSeverity.Error:
    case ErrorSeverity.Critical:
      console.error(`[${category}] ${message}`, logObject);
      break;
    default:
      console.log(`[${category}] ${message}`, logObject);
  }
};

/**
 * Track an error using analytics
 * @param error The error details
 */
export const trackError = (error: ErrorDetails): void => {
  const { message, category, context, originalError } = error;
  
  if (category === ErrorCategory.API) {
    trackApiError(
      context?.functionName || 'unknown',
      message,
      context?.additionalData?.statusCode
    );
  } else {
    trackAppError(
      message,
      context?.componentName,
      originalError?.stack
    );
  }
};

/**
 * Get the error history from local storage
 * @returns Array of error details
 */
export const getErrorHistory = (): ErrorDetails[] => {
  try {
    const storedHistory = localStorage.getItem(ERROR_HISTORY_STORAGE_KEY);
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      
      // Convert timestamp strings back to Date objects
      return parsedHistory.map((error: any) => ({
        ...error,
        timestamp: new Date(error.timestamp),
      }));
    }
  } catch (error) {
    console.error('Error retrieving error history:', error);
  }
  
  return [];
};

/**
 * Save the error history to local storage
 * @param history The error history to save
 */
const saveErrorHistory = (history: ErrorDetails[]): void => {
  try {
    localStorage.setItem(ERROR_HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving error history:', error);
  }
};

/**
 * Add an error to the history
 * @param error The error details to add
 */
export const addErrorToHistory = (error: ErrorDetails): void => {
  const history = getErrorHistory();
  
  // Add the error to the history
  history.unshift(error);
  
  // If the history is too large, remove the oldest errors
  if (history.length > MAX_ERROR_HISTORY) {
    history.splice(MAX_ERROR_HISTORY);
  }
  
  saveErrorHistory(history);
};

/**
 * Clear the error history
 */
export const clearErrorHistory = (): void => {
  saveErrorHistory([]);
};

/**
 * Handle an error
 * @param error The error object or message
 * @param severity The error severity
 * @param category The error category
 * @param context The error context
 * @returns The error details object
 */
export const handleError = (
  error: Error | string,
  severity: ErrorSeverity = ErrorSeverity.Error,
  category: ErrorCategory = ErrorCategory.Unknown,
  context?: ErrorContext
): ErrorDetails => {
  const message = typeof error === 'string' ? error : error.message;
  const originalError = typeof error === 'string' ? undefined : error;
  
  const errorDetails = createErrorDetails(message, severity, category, context, originalError);
  
  // Log the error
  logError(errorDetails);
  
  // Track the error
  trackError(errorDetails);
  
  // Add to history
  addErrorToHistory(errorDetails);
  
  // Call the global error handler if set
  if (globalErrorHandler) {
    globalErrorHandler(errorDetails);
  }
  
  return errorDetails;
};

/**
 * Handle a network error
 * @param error The error object or message
 * @param context The error context
 * @returns The error details object
 */
export const handleNetworkError = (error: Error | string, context?: ErrorContext): ErrorDetails => {
  return handleError(
    error,
    ErrorSeverity.Error,
    ErrorCategory.Network,
    context
  );
};

/**
 * Handle an API error
 * @param error The error object or message
 * @param endpoint The API endpoint
 * @param statusCode The HTTP status code
 * @param context The error context
 * @returns The error details object
 */
export const handleApiError = (
  error: Error | string,
  endpoint: string,
  statusCode?: number,
  context?: ErrorContext
): ErrorDetails => {
  const updatedContext = {
    ...context,
    functionName: endpoint,
    additionalData: {
      ...context?.additionalData,
      endpoint,
      statusCode,
    },
  };
  
  return handleError(
    error,
    statusCode && statusCode >= 500 ? ErrorSeverity.Error : ErrorSeverity.Warning,
    ErrorCategory.API,
    updatedContext
  );
};

/**
 * Handle a validation error
 * @param error The error object or message
 * @param context The error context
 * @returns The error details object
 */
export const handleValidationError = (error: Error | string, context?: ErrorContext): ErrorDetails => {
  return handleError(
    error,
    ErrorSeverity.Warning,
    ErrorCategory.Validation,
    context
  );
};

/**
 * Handle a storage error
 * @param error The error object or message
 * @param context The error context
 * @returns The error details object
 */
export const handleStorageError = (error: Error | string, context?: ErrorContext): ErrorDetails => {
  return handleError(
    error,
    ErrorSeverity.Warning,
    ErrorCategory.Storage,
    context
  );
};

/**
 * Handle an offline error
 * @param feature The feature that is not available offline
 * @param context The error context
 * @returns The error details object
 */
export const handleOfflineError = (feature: string, context?: ErrorContext): ErrorDetails => {
  const message = `Feature not available offline: ${feature}`;
  
  return handleError(
    message,
    ErrorSeverity.Warning,
    ErrorCategory.Offline,
    context
  );
};

/**
 * Initialize error handling
 */
export const initErrorHandling = (): void => {
  // Set up global error event listener
  window.addEventListener('error', (event) => {
    handleError(
      event.error || new Error(event.message),
      ErrorSeverity.Error,
      ErrorCategory.Unknown,
      {
        location: event.filename,
        additionalData: {
          lineNumber: event.lineno,
          columnNumber: event.colno,
        },
      }
    );
  });
  
  // Set up unhandled promise rejection listener
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    
    handleError(
      error,
      ErrorSeverity.Error,
      ErrorCategory.Unknown,
      {
        functionName: 'unhandledPromiseRejection',
      }
    );
  });
};