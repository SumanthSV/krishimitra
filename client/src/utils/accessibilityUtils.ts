// Utilities for accessibility features

import { getLanguage } from './languageUtils';

// Local storage keys
const FONT_SIZE_STORAGE_KEY = 'krishimitra_font_size';
const HIGH_CONTRAST_STORAGE_KEY = 'krishimitra_high_contrast';
const REDUCED_MOTION_STORAGE_KEY = 'krishimitra_reduced_motion';
const SCREEN_READER_HINTS_STORAGE_KEY = 'krishimitra_screen_reader_hints';

// Default values
const DEFAULT_FONT_SIZE = 'medium';
const DEFAULT_HIGH_CONTRAST = false;
const DEFAULT_REDUCED_MOTION = false;
const DEFAULT_SCREEN_READER_HINTS = true;

// Font size options
export type FontSize = 'small' | 'medium' | 'large' | 'x-large';

// Font size scale factors
export const fontSizeScales: Record<FontSize, number> = {
  'small': 0.85,
  'medium': 1,
  'large': 1.15,
  'x-large': 1.3,
};

// Font size names in different languages
export const fontSizeNames: Record<FontSize, Record<string, string>> = {
  'small': {
    en: 'Small',
    hi: 'छोटा',
  },
  'medium': {
    en: 'Medium',
    hi: 'मध्यम',
  },
  'large': {
    en: 'Large',
    hi: 'बड़ा',
  },
  'x-large': {
    en: 'Extra Large',
    hi: 'बहुत बड़ा',
  },
};

/**
 * Get the current font size setting
 * @returns The current font size
 */
export const getFontSize = (): FontSize => {
  try {
    const storedSize = localStorage.getItem(FONT_SIZE_STORAGE_KEY) as FontSize;
    if (storedSize && fontSizeScales[storedSize]) {
      return storedSize;
    }
  } catch (error) {
    console.error('Error retrieving font size setting:', error);
  }
  
  return DEFAULT_FONT_SIZE;
};

/**
 * Set the font size setting
 * @param size The font size to set
 */
export const setFontSize = (size: FontSize): void => {
  try {
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, size);
    applyFontSize(size);
  } catch (error) {
    console.error('Error saving font size setting:', error);
  }
};

/**
 * Apply the font size to the document
 * @param size The font size to apply
 */
export const applyFontSize = (size: FontSize = getFontSize()): void => {
  const scale = fontSizeScales[size];
  document.documentElement.style.setProperty('--font-size-scale', scale.toString());
  
  // Add a class to the body for CSS targeting
  document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-x-large');
  document.body.classList.add(`font-${size}`);
};

/**
 * Get the current high contrast setting
 * @returns Whether high contrast mode is enabled
 */
export const getHighContrast = (): boolean => {
  try {
    const storedValue = localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY);
    if (storedValue !== null) {
      return storedValue === 'true';
    }
  } catch (error) {
    console.error('Error retrieving high contrast setting:', error);
  }
  
  return DEFAULT_HIGH_CONTRAST;
};

/**
 * Set the high contrast setting
 * @param enabled Whether high contrast mode should be enabled
 */
export const setHighContrast = (enabled: boolean): void => {
  try {
    localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, enabled.toString());
    applyHighContrast(enabled);
  } catch (error) {
    console.error('Error saving high contrast setting:', error);
  }
};

/**
 * Apply the high contrast setting to the document
 * @param enabled Whether high contrast mode should be enabled
 */
export const applyHighContrast = (enabled: boolean = getHighContrast()): void => {
  if (enabled) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }
};

/**
 * Get the current reduced motion setting
 * @returns Whether reduced motion mode is enabled
 */
export const getReducedMotion = (): boolean => {
  try {
    const storedValue = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY);
    if (storedValue !== null) {
      return storedValue === 'true';
    }
    
    // Check if the user has set a system preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return true;
    }
  } catch (error) {
    console.error('Error retrieving reduced motion setting:', error);
  }
  
  return DEFAULT_REDUCED_MOTION;
};

/**
 * Set the reduced motion setting
 * @param enabled Whether reduced motion mode should be enabled
 */
export const setReducedMotion = (enabled: boolean): void => {
  try {
    localStorage.setItem(REDUCED_MOTION_STORAGE_KEY, enabled.toString());
    applyReducedMotion(enabled);
  } catch (error) {
    console.error('Error saving reduced motion setting:', error);
  }
};

/**
 * Apply the reduced motion setting to the document
 * @param enabled Whether reduced motion mode should be enabled
 */
export const applyReducedMotion = (enabled: boolean = getReducedMotion()): void => {
  if (enabled) {
    document.body.classList.add('reduced-motion');
  } else {
    document.body.classList.remove('reduced-motion');
  }
};

/**
 * Get the current screen reader hints setting
 * @returns Whether screen reader hints are enabled
 */
export const getScreenReaderHints = (): boolean => {
  try {
    const storedValue = localStorage.getItem(SCREEN_READER_HINTS_STORAGE_KEY);
    if (storedValue !== null) {
      return storedValue === 'true';
    }
  } catch (error) {
    console.error('Error retrieving screen reader hints setting:', error);
  }
  
  return DEFAULT_SCREEN_READER_HINTS;
};

/**
 * Set the screen reader hints setting
 * @param enabled Whether screen reader hints should be enabled
 */
export const setScreenReaderHints = (enabled: boolean): void => {
  try {
    localStorage.setItem(SCREEN_READER_HINTS_STORAGE_KEY, enabled.toString());
  } catch (error) {
    console.error('Error saving screen reader hints setting:', error);
  }
};

/**
 * Create a screen reader only element
 * @param text The text content for screen readers
 * @returns The created element
 */
export const createScreenReaderOnly = (text: string): HTMLElement => {
  const element = document.createElement('span');
  element.className = 'sr-only';
  element.textContent = text;
  return element;
};

/**
 * Add a screen reader hint to an element
 * @param element The element to add the hint to
 * @param hint The hint text
 */
export const addScreenReaderHint = (element: HTMLElement, hint: string): void => {
  if (!getScreenReaderHints()) {
    return;
  }
  
  const srHint = createScreenReaderOnly(hint);
  element.appendChild(srHint);
};

/**
 * Set the ARIA label for an element
 * @param element The element to set the label for
 * @param label The label text
 */
export const setAriaLabel = (element: HTMLElement, label: string): void => {
  element.setAttribute('aria-label', label);
};

/**
 * Set the ARIA described by attribute for an element
 * @param element The element to set the attribute for
 * @param id The ID of the describing element
 */
export const setAriaDescribedBy = (element: HTMLElement, id: string): void => {
  element.setAttribute('aria-describedby', id);
};

/**
 * Create an element with a description for screen readers
 * @param elementType The type of element to create
 * @param text The visible text content
 * @param description The description for screen readers
 * @returns The created element and description element
 */
export const createElementWithDescription = (
  elementType: string,
  text: string,
  description: string
): { element: HTMLElement; descriptionElement: HTMLElement } => {
  const element = document.createElement(elementType);
  element.textContent = text;
  
  const descriptionId = `desc-${Math.random().toString(36).substr(2, 9)}`;
  const descriptionElement = document.createElement('span');
  descriptionElement.id = descriptionId;
  descriptionElement.className = 'sr-only';
  descriptionElement.textContent = description;
  
  setAriaDescribedBy(element, descriptionId);
  
  return { element, descriptionElement };
};

/**
 * Announce a message to screen readers
 * @param message The message to announce
 * @param assertive Whether the announcement should be assertive
 */
export const announceToScreenReader = (message: string, assertive: boolean = false): void => {
  const announcer = document.getElementById('screen-reader-announcer');
  
  if (!announcer) {
    // Create the announcer element if it doesn't exist
    const newAnnouncer = document.createElement('div');
    newAnnouncer.id = 'screen-reader-announcer';
    newAnnouncer.className = 'sr-only';
    newAnnouncer.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
    document.body.appendChild(newAnnouncer);
    
    // Wait a moment before setting the text to ensure the element is registered
    setTimeout(() => {
      newAnnouncer.textContent = message;
    }, 100);
  } else {
    // Clear the announcer and set the new message
    announcer.textContent = '';
    
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }
};

/**
 * Get a localized accessibility label
 * @param key The label key
 * @param params Optional parameters to replace in the label
 * @returns The localized label
 */
export const getAccessibilityLabel = (key: string, params?: Record<string, any>): string => {
  const language = getLanguage();
  const labels: Record<string, Record<string, string>> = {
    closeButton: {
      en: 'Close',
      hi: 'बंद करें',
    },
    menuButton: {
      en: 'Menu',
      hi: 'मेनू',
    },
    searchButton: {
      en: 'Search',
      hi: 'खोजें',
    },
    nextButton: {
      en: 'Next',
      hi: 'अगला',
    },
    previousButton: {
      en: 'Previous',
      hi: 'पिछला',
    },
    expandButton: {
      en: 'Expand',
      hi: 'विस्तार करें',
    },
    collapseButton: {
      en: 'Collapse',
      hi: 'संकुचित करें',
    },
    loading: {
      en: 'Loading',
      hi: 'लोड हो रहा है',
    },
    required: {
      en: 'Required',
      hi: 'आवश्यक',
    },
    optional: {
      en: 'Optional',
      hi: 'वैकल्पिक',
    },
    error: {
      en: 'Error',
      hi: 'त्रुटि',
    },
    success: {
      en: 'Success',
      hi: 'सफलता',
    },
    warning: {
      en: 'Warning',
      hi: 'चेतावनी',
    },
    info: {
      en: 'Information',
      hi: 'जानकारी',
    },
  };
  
  let label = labels[key]?.[language] || labels[key]?.['en'] || key;
  
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      label = label.replace(`{${param}}`, value.toString());
    });
  }
  
  return label;
};

/**
 * Initialize accessibility features
 */
export const initAccessibility = (): void => {
  // Apply font size
  applyFontSize();
  
  // Apply high contrast
  applyHighContrast();
  
  // Apply reduced motion
  applyReducedMotion();
  
  // Add screen reader announcer
  if (!document.getElementById('screen-reader-announcer')) {
    const announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', 'polite');
    document.body.appendChild(announcer);
  }
  
  // Add CSS for screen reader only elements
  if (!document.getElementById('accessibility-styles')) {
    const style = document.createElement('style');
    style.id = 'accessibility-styles';
    style.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      .high-contrast {
        --contrast-text: #000000;
        --contrast-background: #ffffff;
        --contrast-primary: #0000ff;
        --contrast-secondary: #800080;
        --contrast-success: #008000;
        --contrast-error: #ff0000;
        --contrast-warning: #ff8000;
        --contrast-info: #0080ff;
      }
      
      .high-contrast * {
        background-color: var(--contrast-background) !important;
        color: var(--contrast-text) !important;
        border-color: var(--contrast-text) !important;
      }
      
      .high-contrast a {
        color: var(--contrast-primary) !important;
        text-decoration: underline !important;
      }
      
      .high-contrast button,
      .high-contrast [role="button"] {
        background-color: var(--contrast-background) !important;
        color: var(--contrast-text) !important;
        border: 2px solid var(--contrast-text) !important;
        outline: 2px solid transparent !important;
      }
      
      .high-contrast button:focus,
      .high-contrast [role="button"]:focus,
      .high-contrast a:focus,
      .high-contrast input:focus,
      .high-contrast select:focus,
      .high-contrast textarea:focus {
        outline: 2px solid var(--contrast-primary) !important;
        outline-offset: 2px !important;
      }
      
      .reduced-motion * {
        animation-duration: 0.001s !important;
        transition-duration: 0.001s !important;
      }
      
      body {
        --base-font-size: 16px;
      }
      
      .font-small {
        font-size: calc(var(--base-font-size) * 0.85);
      }
      
      .font-medium {
        font-size: var(--base-font-size);
      }
      
      .font-large {
        font-size: calc(var(--base-font-size) * 1.15);
      }
      
      .font-x-large {
        font-size: calc(var(--base-font-size) * 1.3);
      }
    `;
    document.head.appendChild(style);
  }
  
  // Listen for system preference changes
  const reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotionMediaQuery.addEventListener('change', (e) => {
    // Only change the setting if the user hasn't explicitly set a preference
    if (!localStorage.getItem(REDUCED_MOTION_STORAGE_KEY)) {
      applyReducedMotion(e.matches);
    }
  });
};