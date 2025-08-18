// Language utilities for the application

// Supported languages in the application
export type SupportedLanguage = 'en' | 'hi' | 'pa' | 'bn' | 'te' | 'ta' | 'mr' | 'gu' | 'kn' | 'ml';

// Language names for display in the UI
export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)',
  bn: 'বাংলা (Bengali)',
  te: 'తెలుగు (Telugu)',
  ta: 'தமிழ் (Tamil)',
  mr: 'मराठी (Marathi)',
  gu: 'ગુજરાતી (Gujarati)',
  kn: 'ಕನ್ನಡ (Kannada)',
  ml: 'മലയാളം (Malayalam)',
};

// RTL (Right-to-Left) languages
export const rtlLanguages: SupportedLanguage[] = [];

// Default language
export const defaultLanguage: SupportedLanguage = 'en';

// Get the current language from local storage or use default
export const getLanguage = (): SupportedLanguage => {
  const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
  return savedLanguage && Object.keys(languageNames).includes(savedLanguage)
    ? savedLanguage
    : defaultLanguage;
};

// Set the language in local storage
export const setLanguage = (language: SupportedLanguage): void => {
  localStorage.setItem('language', language);
  
  // Set the HTML lang attribute
  document.documentElement.lang = language;
  
  // Set the text direction (RTL or LTR)
  document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
};

// Get text based on the current language
export const getText = <T extends Record<SupportedLanguage, string>>(textObj: T): string => {
  const currentLanguage = getLanguage();
  return textObj[currentLanguage] || textObj[defaultLanguage];
};

// Format date based on the current language
export const formatDate = (date: Date | number): string => {
  const currentLanguage = getLanguage();
  const dateObj = typeof date === 'number' ? new Date(date) : date;
  
  try {
    return new Intl.DateTimeFormat(languageToLocale(currentLanguage), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return dateObj.toLocaleDateString();
  }
};

// Format time based on the current language
export const formatTime = (date: Date | number): string => {
  const currentLanguage = getLanguage();
  const dateObj = typeof date === 'number' ? new Date(date) : date;
  
  try {
    return new Intl.DateTimeFormat(languageToLocale(currentLanguage), {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(dateObj);
  } catch (error) {
    console.warn('Error formatting time:', error);
    return dateObj.toLocaleTimeString();
  }
};

// Format number based on the current language
export const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
  const currentLanguage = getLanguage();
  
  try {
    return new Intl.NumberFormat(languageToLocale(currentLanguage), options).format(num);
  } catch (error) {
    console.warn('Error formatting number:', error);
    return num.toString();
  }
};

// Format currency based on the current language
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const currentLanguage = getLanguage();
  
  try {
    return new Intl.NumberFormat(languageToLocale(currentLanguage), {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.warn('Error formatting currency:', error);
    return `${currency} ${amount}`;
  }
};

// Convert language code to locale
export const languageToLocale = (language: SupportedLanguage): string => {
  const localeMap: Record<SupportedLanguage, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    pa: 'pa-IN',
    bn: 'bn-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
  };
  
  return localeMap[language] || 'en-IN';
};

// Get text direction for the current language
export const getTextDirection = (): 'rtl' | 'ltr' => {
  const currentLanguage = getLanguage();
  return rtlLanguages.includes(currentLanguage) ? 'rtl' : 'ltr';
};

// Check if the current language is RTL
export const isRTL = (): boolean => {
  return getTextDirection() === 'rtl';
};

// Get appropriate font family based on language
export const getFontFamily = (): string => {
  const currentLanguage = getLanguage();
  
  // Define font families for different language groups
  switch (currentLanguage) {
    case 'hi':
    case 'mr':
      return '"Noto Sans Devanagari", "Roboto", sans-serif';
    case 'pa':
      return '"Noto Sans Gurmukhi", "Roboto", sans-serif';
    case 'bn':
      return '"Noto Sans Bengali", "Roboto", sans-serif';
    case 'te':
      return '"Noto Sans Telugu", "Roboto", sans-serif';
    case 'ta':
      return '"Noto Sans Tamil", "Roboto", sans-serif';
    case 'gu':
      return '"Noto Sans Gujarati", "Roboto", sans-serif';
    case 'kn':
      return '"Noto Sans Kannada", "Roboto", sans-serif';
    case 'ml':
      return '"Noto Sans Malayalam", "Roboto", sans-serif';
    default:
      return '"Roboto", "Helvetica", "Arial", sans-serif';
  }
};

// Detect user's preferred language from browser settings
export const detectUserLanguage = (): SupportedLanguage => {
  const browserLanguages = navigator.languages || [navigator.language];
  
  // Try to match browser languages with our supported languages
  for (const browserLang of browserLanguages) {
    const langCode = browserLang.split('-')[0].toLowerCase();
    if (langCode in languageNames) {
      return langCode as SupportedLanguage;
    }
  }
  
  return defaultLanguage;
};

// Initialize language settings
export const initializeLanguage = (): void => {
  // If no language is set in local storage, detect user's preferred language
  if (!localStorage.getItem('language')) {
    const detectedLanguage = detectUserLanguage();
    setLanguage(detectedLanguage);
  } else {
    // Otherwise, apply the saved language
    const savedLanguage = getLanguage();
    setLanguage(savedLanguage);
  }
};