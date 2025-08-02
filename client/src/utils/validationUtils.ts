// Utilities for form validation

import { getLanguage } from './languageUtils';

// Error messages in different languages
export const errorMessages: Record<string, Record<string, string>> = {
  required: {
    en: 'This field is required',
    hi: 'यह फ़ील्ड आवश्यक है',
  },
  email: {
    en: 'Please enter a valid email address',
    hi: 'कृपया एक वैध ईमेल पता दर्ज करें',
  },
  phone: {
    en: 'Please enter a valid phone number',
    hi: 'कृपया एक वैध फोन नंबर दर्ज करें',
  },
  minLength: {
    en: 'Must be at least {min} characters',
    hi: 'कम से कम {min} अक्षर होने चाहिए',
  },
  maxLength: {
    en: 'Must be at most {max} characters',
    hi: 'अधिकतम {max} अक्षर होने चाहिए',
  },
  min: {
    en: 'Must be at least {min}',
    hi: 'कम से कम {min} होना चाहिए',
  },
  max: {
    en: 'Must be at most {max}',
    hi: 'अधिकतम {max} होना चाहिए',
  },
  pattern: {
    en: 'Invalid format',
    hi: 'अमान्य प्रारूप',
  },
  match: {
    en: 'Fields do not match',
    hi: 'फ़ील्ड मेल नहीं खाते',
  },
  integer: {
    en: 'Must be an integer',
    hi: 'एक पूर्णांक होना चाहिए',
  },
  decimal: {
    en: 'Must be a decimal number',
    hi: 'एक दशमलव संख्या होनी चाहिए',
  },
  positiveNumber: {
    en: 'Must be a positive number',
    hi: 'एक सकारात्मक संख्या होनी चाहिए',
  },
  date: {
    en: 'Please enter a valid date',
    hi: 'कृपया एक वैध तिथि दर्ज करें',
  },
  futureDate: {
    en: 'Date must be in the future',
    hi: 'तिथि भविष्य में होनी चाहिए',
  },
  pastDate: {
    en: 'Date must be in the past',
    hi: 'तिथि अतीत में होनी चाहिए',
  },
  pincode: {
    en: 'Please enter a valid 6-digit PIN code',
    hi: 'कृपया एक वैध 6-अंकों का पिन कोड दर्ज करें',
  },
  aadhaar: {
    en: 'Please enter a valid 12-digit Aadhaar number',
    hi: 'कृपया एक वैध 12-अंकों का आधार नंबर दर्ज करें',
  },
  pan: {
    en: 'Please enter a valid 10-character PAN',
    hi: 'कृपया एक वैध 10-अक्षर का पैन दर्ज करें',
  },
  ifsc: {
    en: 'Please enter a valid IFSC code',
    hi: 'कृपया एक वैध IFSC कोड दर्ज करें',
  },
  accountNumber: {
    en: 'Please enter a valid account number',
    hi: 'कृपया एक वैध खाता संख्या दर्ज करें',
  },
};

/**
 * Get a localized error message
 * @param key The error message key
 * @param params Optional parameters to replace in the message
 * @returns The localized error message
 */
export const getErrorMessage = (key: string, params?: Record<string, any>): string => {
  const language = getLanguage();
  let message = errorMessages[key]?.[language] || errorMessages[key]?.['en'] || key;
  
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      message = message.replace(`{${param}}`, value.toString());
    });
  }
  
  return message;
};

/**
 * Check if a value is empty
 * @param value The value to check
 * @returns True if the value is empty, false otherwise
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
};

/**
 * Validate that a value is not empty
 * @param value The value to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateRequired = (value: any): string | undefined => {
  return isEmpty(value) ? getErrorMessage('required') : undefined;
};

/**
 * Validate an email address
 * @param value The email address to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateEmail = (value: string): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  // More comprehensive email regex that handles:
  // - International characters in local part
  // - Subdomains
  // - Top-level domains with 2+ characters
  // - Special characters in local part (with proper positioning)
  // - Length limits according to standards
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  // Additional length check (local part max 64 chars, domain max 255 chars)
  const parts = value.split('@');
  const localPartValid = parts[0] && parts[0].length <= 64;
  const domainValid = parts[1] && parts[1].length <= 255;
  
  return emailRegex.test(value) && localPartValid && domainValid ? undefined : getErrorMessage('email');
};

/**
 * Validate a phone number (Indian format)
 * @param value The phone number to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validatePhone = (value: string): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  // Remove all non-digit characters except + for processing
  const cleanedValue = value.replace(/[^\d+]/g, '');
  
  // Indian phone number formats:
  // 1. 10 digits starting with 6-9 (standard mobile number)
  // 2. +91 followed by 10 digits starting with 6-9 (international format)
  // 3. 0 followed by 10 digits starting with 6-9 (national format)
  // 4. 91 followed by 10 digits starting with 6-9 (alternative international format)
  
  // Check for standard 10-digit format
  const tenDigitRegex = /^[6-9]\d{9}$/;
  
  // Check for international format with +91 prefix
  const intlFormatRegex = /^\+91[6-9]\d{9}$/;
  
  // Check for national format with 0 prefix
  const nationalFormatRegex = /^0[6-9]\d{9}$/;
  
  // Check for alternative international format with 91 prefix
  const altIntlFormatRegex = /^91[6-9]\d{9}$/;
  
  return (
    tenDigitRegex.test(cleanedValue) ||
    intlFormatRegex.test(cleanedValue) ||
    nationalFormatRegex.test(cleanedValue) ||
    altIntlFormatRegex.test(cleanedValue)
  ) ? undefined : getErrorMessage('phone');
};

/**
 * Validate minimum length
 * @param value The value to validate
 * @param min The minimum length
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateMinLength = (value: string, min: number): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  return value.length >= min ? undefined : getErrorMessage('minLength', { min });
};

/**
 * Validate maximum length
 * @param value The value to validate
 * @param max The maximum length
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateMaxLength = (value: string, max: number): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  return value.length <= max ? undefined : getErrorMessage('maxLength', { max });
};

/**
 * Validate minimum value
 * @param value The value to validate
 * @param min The minimum value
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateMin = (value: number, min: number): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }
  
  return value >= min ? undefined : getErrorMessage('min', { min });
};

/**
 * Validate maximum value
 * @param value The value to validate
 * @param max The maximum value
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateMax = (value: number, max: number): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }
  
  return value <= max ? undefined : getErrorMessage('max', { max });
};

/**
 * Validate a pattern
 * @param value The value to validate
 * @param pattern The regular expression pattern
 * @returns An error message if validation fails, undefined otherwise
 */
export const validatePattern = (value: string, pattern: RegExp): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  return pattern.test(value) ? undefined : getErrorMessage('pattern');
};

/**
 * Validate that two values match
 * @param value The value to validate
 * @param compareValue The value to compare against
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateMatch = (value: any, compareValue: any): string | undefined => {
  if (isEmpty(value) || isEmpty(compareValue)) {
    return undefined;
  }
  
  return value === compareValue ? undefined : getErrorMessage('match');
};

/**
 * Validate an integer
 * @param value The value to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateInteger = (value: string | number): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  const numberValue = typeof value === 'string' ? Number(value) : value;
  return Number.isInteger(numberValue) ? undefined : getErrorMessage('integer');
};

/**
 * Validate a decimal number
 * @param value The value to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateDecimal = (value: string | number): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  // Handle both standard decimal notation and scientific notation
  // This regex matches:
  // - Optional negative sign
  // - Digits (optional before decimal point)
  // - Optional decimal point followed by digits
  // - Optional scientific notation (e or E followed by optional sign and digits)
  const decimalRegex = /^-?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
  
  // Convert to string if it's a number
  const stringValue = typeof value === 'number' ? value.toString() : value;
  
  // Additional check to ensure it's a valid number (handles edge cases)
  const isValidNumber = !isNaN(Number(stringValue));
  
  return decimalRegex.test(stringValue) && isValidNumber ? undefined : getErrorMessage('decimal');
};

/**
 * Validate a positive number
 * @param value The value to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validatePositiveNumber = (value: string | number): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  const numberValue = typeof value === 'string' ? Number(value) : value;
  return !isNaN(numberValue) && numberValue > 0 ? undefined : getErrorMessage('positiveNumber');
};

/**
 * Validate a date
 * @param value The value to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateDate = (value: string | Date): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  const date = value instanceof Date ? value : new Date(value);
  return !isNaN(date.getTime()) ? undefined : getErrorMessage('date');
};

/**
 * Validate a future date
 * @param value The value to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateFutureDate = (value: string | Date): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  const dateError = validateDate(value);
  if (dateError) {
    return dateError;
  }
  
  const date = value instanceof Date ? value : new Date(value);
  const now = new Date();
  
  return date > now ? undefined : getErrorMessage('futureDate');
};

/**
 * Validate a past date
 * @param value The value to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validatePastDate = (value: string | Date): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  const dateError = validateDate(value);
  if (dateError) {
    return dateError;
  }
  
  const date = value instanceof Date ? value : new Date(value);
  const now = new Date();
  
  return date < now ? undefined : getErrorMessage('pastDate');
};

/**
 * Validate an Indian PIN code
 * @param value The PIN code to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validatePincode = (value: string): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(value) ? undefined : getErrorMessage('pincode');
};

/**
 * Validate an Aadhaar number
 * @param value The Aadhaar number to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateAadhaar = (value: string): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  // Basic validation for 12 digits
  const aadhaarRegex = /^[2-9][0-9]{11}$/;
  return aadhaarRegex.test(value) ? undefined : getErrorMessage('aadhaar');
};

/**
 * Validate a PAN (Permanent Account Number)
 * @param value The PAN to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validatePAN = (value: string): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  // PAN format: AAAAA9999A (5 letters, 4 numbers, 1 letter)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(value) ? undefined : getErrorMessage('pan');
};

/**
 * Validate an IFSC code
 * @param value The IFSC code to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateIFSC = (value: string): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  // IFSC format: AAAA0XXXXXX (4 letters, 0, 6 alphanumeric characters)
  // Corrected regex to match actual IFSC format: 4 letters followed by a digit (not just 0) followed by 6 alphanumeric characters
  const ifscRegex = /^[A-Z]{4}[0-9][A-Z0-9]{6}$/;
  return ifscRegex.test(value) ? undefined : getErrorMessage('ifsc');
};

/**
 * Validate a bank account number
 * @param value The account number to validate
 * @returns An error message if validation fails, undefined otherwise
 */
export const validateAccountNumber = (value: string): string | undefined => {
  if (isEmpty(value)) {
    return undefined;
  }
  
  // Basic validation for account numbers (between 9 and 18 digits)
  const accountRegex = /^[0-9]{9,18}$/;
  return accountRegex.test(value) ? undefined : getErrorMessage('accountNumber');
};

/**
 * Combine multiple validators
 * @param validators Array of validator functions
 * @returns A function that runs all validators and returns the first error message
 */
export const combineValidators = (
  ...validators: Array<(value: any, ...args: any[]) => string | undefined>
) => {
  return (value: any, ...args: any[]): string | undefined => {
    for (const validator of validators) {
      const error = validator(value, ...args);
      if (error) {
        return error;
      }
    }
    return undefined;
  };
};

/**
 * Create a required field validator with additional validators
 * @param validators Additional validators to run after the required check
 * @returns A function that runs all validators and returns the first error message
 */
export const createRequiredValidator = (
  ...validators: Array<(value: any, ...args: any[]) => string | undefined>
) => {
  return combineValidators(validateRequired, ...validators);
};

/**
 * Validate a form object
 * @param values The form values
 * @param validationSchema The validation schema
 * @returns An object with error messages
 */
export const validateForm = (
  values: Record<string, any>,
  validationSchema: Record<string, (value: any, allValues?: Record<string, any>) => string | undefined>
): Record<string, string | undefined> => {
  const errors: Record<string, string | undefined> = {};
  
  Object.entries(validationSchema).forEach(([field, validator]) => {
    const error = validator(values[field], values);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
};

/**
 * Check if a form has errors
 * @param errors The form errors object
 * @returns True if the form has errors, false otherwise
 */
export const hasErrors = (errors: Record<string, string | undefined>): boolean => {
  return Object.values(errors).some(error => error !== undefined);
};