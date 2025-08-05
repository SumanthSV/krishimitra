// Utilities for security features

import { logError, ErrorCategory, ErrorSeverity } from './errorUtils.ts';
import { trackEvent, EventCategory, EventAction } from './analyticsUtils.ts';

// Local storage keys
const AUTH_TOKEN_STORAGE_KEY = 'krishimitra_auth_token';
const AUTH_EXPIRY_STORAGE_KEY = 'krishimitra_auth_expiry';
const REFRESH_TOKEN_STORAGE_KEY = 'krishimitra_refresh_token';
const SENSITIVE_DATA_KEYS = ['password', 'token', 'secret', 'key', 'auth', 'credential'];

// Security settings
let csrfToken: string | null = null;
let xssProtectionEnabled = true;

/**
 * Set the authentication token
 * @param token The authentication token
 * @param expiryInSeconds The token expiry time in seconds
 * @param refreshToken Optional refresh token
 */
export const setAuthToken = (
  token: string,
  expiryInSeconds: number,
  refreshToken?: string
): void => {
  try {
    const expiryTime = Date.now() + expiryInSeconds * 1000;
    
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    localStorage.setItem(AUTH_EXPIRY_STORAGE_KEY, expiryTime.toString());
    
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    }
    
    // Track the event
    trackEvent({
      category: EventCategory.AUTH,
      action: EventAction.LOGIN,
    });
  } catch (error) {
    logError({
      message: 'Failed to set authentication token',
      error: error as Error,
      category: ErrorCategory.AUTH,
      severity: ErrorSeverity.ERROR,
    });
  }
};

/**
 * Get the authentication token
 * @returns The authentication token or null if not set or expired
 */
export const getAuthToken = (): string | null => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    const expiryTimeString = localStorage.getItem(AUTH_EXPIRY_STORAGE_KEY);
    
    if (!token || !expiryTimeString) {
      return null;
    }
    
    const expiryTime = parseInt(expiryTimeString, 10);
    
    // Check if token is expired
    if (Date.now() >= expiryTime) {
      // Token is expired, try to refresh
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
      
      if (refreshToken) {
        // Attempt to refresh the token asynchronously
        refreshAuthToken(refreshToken).catch(() => {
          // If refresh fails, clear the tokens
          clearAuthTokens();
        });
      } else {
        // No refresh token, clear the tokens
        clearAuthTokens();
      }
      
      return null;
    }
    
    return token;
  } catch (error) {
    logError({
      message: 'Failed to get authentication token',
      error: error as Error,
      category: ErrorCategory.AUTH,
      severity: ErrorSeverity.ERROR,
    });
    
    return null;
  }
};

/**
 * Clear all authentication tokens
 */
export const clearAuthTokens = (): void => {
  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_EXPIRY_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    
    // Track the event
    trackEvent({
      category: EventCategory.AUTH,
      action: EventAction.LOGOUT,
    });
  } catch (error) {
    logError({
      message: 'Failed to clear authentication tokens',
      error: error as Error,
      category: ErrorCategory.AUTH,
      severity: ErrorSeverity.ERROR,
    });
  }
};

/**
 * Refresh the authentication token
 * @param refreshToken The refresh token
 * @returns Promise that resolves when the token is refreshed
 */
export const refreshAuthToken = async (refreshToken: string): Promise<void> => {
  try {
    // Make the API request to refresh the token
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Set the new tokens
    setAuthToken(data.token, data.expiresIn, data.refreshToken);
    
    // Track the event
    trackEvent({
      category: EventCategory.AUTH,
      action: EventAction.TOKEN_REFRESH,
    });
  } catch (error) {
    logError({
      message: 'Failed to refresh authentication token',
      error: error as Error,
      category: ErrorCategory.AUTH,
      severity: ErrorSeverity.ERROR,
    });
    
    // Clear the tokens on refresh failure
    clearAuthTokens();
    
    throw error;
  }
};

/**
 * Check if the user is authenticated
 * @returns Whether the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

/**
 * Set the CSRF token
 * @param token The CSRF token
 */
export const setCsrfToken = (token: string): void => {
  csrfToken = token;
};

/**
 * Get the CSRF token
 * @returns The CSRF token
 */
export const getCsrfToken = (): string | null => {
  return csrfToken;
};

/**
 * Create headers with authentication and CSRF tokens
 * @param additionalHeaders Additional headers to include
 * @returns The headers object
 */
export const createAuthHeaders = (additionalHeaders: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = {
    ...additionalHeaders,
    'Content-Type': 'application/json',
  };
  
  const authToken = getAuthToken();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  
  return headers;
};

/**
 * Sanitize HTML to prevent XSS attacks
 * @param html The HTML to sanitize
 * @returns The sanitized HTML
 */
export const sanitizeHtml = (html: string): string => {
  if (!xssProtectionEnabled) {
    return html;
  }
  
  // Simple HTML sanitization
  const tempDiv = document.createElement('div');
  tempDiv.textContent = html;
  return tempDiv.innerHTML;
};

/**
 * Enable or disable XSS protection
 * @param enabled Whether XSS protection should be enabled
 */
export const setXssProtection = (enabled: boolean): void => {
  xssProtectionEnabled = enabled;
};

/**
 * Check if XSS protection is enabled
 * @returns Whether XSS protection is enabled
 */
export const isXssProtectionEnabled = (): boolean => {
  return xssProtectionEnabled;
};

/**
 * Sanitize user input to prevent injection attacks
 * @param input The user input to sanitize
 * @returns The sanitized input
 */
export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous characters
  return input.replace(/[<>"'&]/g, '');
};

/**
 * Validate a URL to prevent open redirect vulnerabilities
 * @param url The URL to validate
 * @param allowedDomains Optional list of allowed domains
 * @returns Whether the URL is valid and safe
 */
export const validateUrl = (url: string, allowedDomains?: string[]): boolean => {
  try {
    const parsedUrl = new URL(url);
    
    // Check if the URL uses a safe protocol
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    
    // If allowed domains are specified, check if the URL's domain is allowed
    if (allowedDomains && allowedDomains.length > 0) {
      return allowedDomains.some(domain => 
        parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
      );
    }
    
    return true;
  } catch (error) {
    // Invalid URL
    return false;
  }
};

/**
 * Generate a secure random string
 * @param length The length of the string
 * @returns The random string
 */
export const generateRandomString = (length: number = 32): string => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  
  return Array.from(array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
};

/**
 * Hash a string using SHA-256
 * @param data The data to hash
 * @returns Promise that resolves with the hash
 */
export const hashString = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Mask sensitive data in objects for logging
 * @param data The data to mask
 * @returns The masked data
 */
export const maskSensitiveData = <T>(data: T): T => {
  if (!data) {
    return data;
  }
  
  if (typeof data !== 'object') {
    return data;
  }
  
  const maskedData = { ...data } as any;
  
  for (const key in maskedData) {
    if (Object.prototype.hasOwnProperty.call(maskedData, key)) {
      // Check if the key contains sensitive information
      const isSensitive = SENSITIVE_DATA_KEYS.some(sensitiveKey => 
        key.toLowerCase().includes(sensitiveKey)
      );
      
      if (isSensitive && typeof maskedData[key] === 'string') {
        // Mask the sensitive data
        maskedData[key] = '********';
      } else if (typeof maskedData[key] === 'object' && maskedData[key] !== null) {
        // Recursively mask nested objects
        maskedData[key] = maskSensitiveData(maskedData[key]);
      }
    }
  }
  
  return maskedData;
};

/**
 * Check for common security vulnerabilities
 * @returns Object with vulnerability check results
 */
export const checkSecurityVulnerabilities = (): Record<string, boolean> => {
  const vulnerabilities: Record<string, boolean> = {};
  
  // Check if running in a secure context (HTTPS)
  vulnerabilities.insecureContext = !window.isSecureContext;
  
  // Check for missing security headers
  const headers = [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security',
    'Referrer-Policy',
  ];
  
  // We can't directly check response headers in the browser,
  // but we can log this for server-side implementation
  console.debug('Security headers should be implemented on the server side:', headers.join(', '));
  
  // Check for localStorage availability (could be disabled in private browsing)
  try {
    localStorage.setItem('security_test', 'test');
    localStorage.removeItem('security_test');
    vulnerabilities.localStorageUnavailable = false;
  } catch (error) {
    vulnerabilities.localStorageUnavailable = true;
  }
  
  // Check for outdated browser features
  vulnerabilities.outdatedBrowser = !('fetch' in window) || !('Promise' in window) || !('Symbol' in window);
  
  return vulnerabilities;
};

/**
 * Initialize security features
 */
export const initSecurity = (): void => {
  // Check for security vulnerabilities
  const vulnerabilities = checkSecurityVulnerabilities();
  
  // Log any found vulnerabilities
  Object.entries(vulnerabilities).forEach(([key, value]) => {
    if (value) {
      logError({
        message: `Security vulnerability detected: ${key}`,
        category: ErrorCategory.SECURITY,
        severity: ErrorSeverity.WARNING,
      });
    }
  });
  
  // Set up CSRF token from meta tag if available
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  if (csrfMeta && csrfMeta.getAttribute('content')) {
    setCsrfToken(csrfMeta.getAttribute('content') as string);
  }
  
  // Check authentication status and refresh token if needed
  const authToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const expiryTimeString = localStorage.getItem(AUTH_EXPIRY_STORAGE_KEY);
  
  if (authToken && expiryTimeString) {
    const expiryTime = parseInt(expiryTimeString, 10);
    const timeUntilExpiry = expiryTime - Date.now();
    
    // If token expires in less than 5 minutes, try to refresh it
    if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
      
      if (refreshToken) {
        refreshAuthToken(refreshToken).catch(() => {
          // If refresh fails, clear the tokens
          clearAuthTokens();
        });
      }
    }
  }
};