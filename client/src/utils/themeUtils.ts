// Utilities for theme and styling

import { createTheme, Theme, PaletteMode } from '@mui/material';
import { getLanguage } from './languageUtils';

// Theme mode storage key
const THEME_MODE_STORAGE_KEY = 'krishimitra_theme_mode';

// Default theme mode
const DEFAULT_THEME_MODE: PaletteMode = 'light';

// Font families for different languages
const fontFamilies: Record<string, string> = {
  en: '"Roboto", "Helvetica", "Arial", sans-serif',
  hi: '"Noto Sans Devanagari", "Roboto", "Helvetica", "Arial", sans-serif',
  pa: '"Noto Sans Gurmukhi", "Roboto", "Helvetica", "Arial", sans-serif',
  bn: '"Noto Sans Bengali", "Roboto", "Helvetica", "Arial", sans-serif',
  te: '"Noto Sans Telugu", "Roboto", "Helvetica", "Arial", sans-serif',
  ta: '"Noto Sans Tamil", "Roboto", "Helvetica", "Arial", sans-serif',
  mr: '"Noto Sans Devanagari", "Roboto", "Helvetica", "Arial", sans-serif',
  gu: '"Noto Sans Gujarati", "Roboto", "Helvetica", "Arial", sans-serif',
  kn: '"Noto Sans Kannada", "Roboto", "Helvetica", "Arial", sans-serif',
  ml: '"Noto Sans Malayalam", "Roboto", "Helvetica", "Arial", sans-serif',
};

// Color palette for the app
const colors = {
  // Primary colors (green shades for agriculture)
  primary: {
    light: '#4caf50',
    main: '#2e7d32',
    dark: '#1b5e20',
    contrastText: '#ffffff',
  },
  // Secondary colors (earthy brown)
  secondary: {
    light: '#8d6e63',
    main: '#5d4037',
    dark: '#321911',
    contrastText: '#ffffff',
  },
  // Error colors
  error: {
    light: '#e57373',
    main: '#f44336',
    dark: '#d32f2f',
    contrastText: '#ffffff',
  },
  // Warning colors
  warning: {
    light: '#ffb74d',
    main: '#ff9800',
    dark: '#f57c00',
    contrastText: '#000000',
  },
  // Info colors
  info: {
    light: '#64b5f6',
    main: '#2196f3',
    dark: '#1976d2',
    contrastText: '#ffffff',
  },
  // Success colors
  success: {
    light: '#81c784',
    main: '#4caf50',
    dark: '#388e3c',
    contrastText: '#ffffff',
  },
};

// Light theme background colors
const lightBackground = {
  default: '#f5f5f5',
  paper: '#ffffff',
  card: '#ffffff',
  divider: 'rgba(0, 0, 0, 0.12)',
};

// Dark theme background colors
const darkBackground = {
  default: '#121212',
  paper: '#1e1e1e',
  card: '#2d2d2d',
  divider: 'rgba(255, 255, 255, 0.12)',
};

// Light theme text colors
const lightText = {
  primary: 'rgba(0, 0, 0, 0.87)',
  secondary: 'rgba(0, 0, 0, 0.6)',
  disabled: 'rgba(0, 0, 0, 0.38)',
  hint: 'rgba(0, 0, 0, 0.38)',
};

// Dark theme text colors
const darkText = {
  primary: 'rgba(255, 255, 255, 0.87)',
  secondary: 'rgba(255, 255, 255, 0.6)',
  disabled: 'rgba(255, 255, 255, 0.38)',
  hint: 'rgba(255, 255, 255, 0.38)',
};

/**
 * Get the current theme mode from local storage
 * @returns The current theme mode
 */
export const getThemeMode = (): PaletteMode => {
  try {
    const storedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY);
    if (storedMode === 'light' || storedMode === 'dark') {
      return storedMode;
    }
  } catch (error) {
    console.error('Error retrieving theme mode:', error);
  }
  
  return DEFAULT_THEME_MODE;
};

/**
 * Set the theme mode in local storage
 * @param mode The theme mode to set
 */
export const setThemeMode = (mode: PaletteMode): void => {
  try {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
  } catch (error) {
    console.error('Error saving theme mode:', error);
  }
};

/**
 * Toggle the theme mode between light and dark
 * @returns The new theme mode
 */
export const toggleThemeMode = (): PaletteMode => {
  const currentMode = getThemeMode();
  const newMode = currentMode === 'light' ? 'dark' : 'light';
  setThemeMode(newMode);
  return newMode;
};

/**
 * Create a theme based on the current language and theme mode
 * @param mode The theme mode (light or dark)
 * @returns The created theme
 */
export const createAppTheme = (mode: PaletteMode = getThemeMode()): Theme => {
  const language = getLanguage();
  const fontFamily = fontFamilies[language] || fontFamilies['en'];
  
  return createTheme({
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
      success: colors.success,
      background: mode === 'light' ? lightBackground : darkBackground,
      text: mode === 'light' ? lightText : darkText,
    },
    typography: {
      fontFamily,
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            textTransform: 'none',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light' 
              ? '0px 2px 8px rgba(0, 0, 0, 0.1)' 
              : '0px 2px 8px rgba(0, 0, 0, 0.4)',
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: 16,
            '&:last-child': {
              paddingBottom: 16,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            marginBottom: 16,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            minWidth: 100,
            fontWeight: 500,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};

/**
 * Get CSS variables for the current theme
 * @param theme The current theme
 * @returns CSS variables as a string
 */
export const getThemeCssVariables = (theme: Theme): string => {
  return `
    :root {
      --primary-main: ${theme.palette.primary.main};
      --primary-light: ${theme.palette.primary.light};
      --primary-dark: ${theme.palette.primary.dark};
      --primary-contrast-text: ${theme.palette.primary.contrastText};
      
      --secondary-main: ${theme.palette.secondary.main};
      --secondary-light: ${theme.palette.secondary.light};
      --secondary-dark: ${theme.palette.secondary.dark};
      --secondary-contrast-text: ${theme.palette.secondary.contrastText};
      
      --error-main: ${theme.palette.error.main};
      --warning-main: ${theme.palette.warning.main};
      --info-main: ${theme.palette.info.main};
      --success-main: ${theme.palette.success.main};
      
      --background-default: ${theme.palette.background.default};
      --background-paper: ${theme.palette.background.paper};
      
      --text-primary: ${theme.palette.text.primary};
      --text-secondary: ${theme.palette.text.secondary};
      --text-disabled: ${theme.palette.text.disabled};
      
      --font-family: ${theme.typography.fontFamily};
      --border-radius: ${theme.shape.borderRadius}px;
    }
  `;
};

/**
 * Apply theme CSS variables to the document
 * @param theme The current theme
 */
export const applyThemeCssVariables = (theme: Theme): void => {
  const styleElement = document.getElementById('theme-variables') || document.createElement('style');
  styleElement.id = 'theme-variables';
  styleElement.innerHTML = getThemeCssVariables(theme);
  
  if (!document.getElementById('theme-variables')) {
    document.head.appendChild(styleElement);
  }
};

/**
 * Get a color with adjusted opacity
 * @param color The color to adjust
 * @param opacity The opacity value (0-1)
 * @returns The color with adjusted opacity
 */
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // For hex colors
  if (color.startsWith('#')) {
    let r = 0, g = 0, b = 0;
    
    if (color.length === 4) {
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    } else if (color.length === 7) {
      r = parseInt(color.substring(1, 3), 16);
      g = parseInt(color.substring(3, 5), 16);
      b = parseInt(color.substring(5, 7), 16);
    }
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // For rgb/rgba colors
  if (color.startsWith('rgb')) {
    const rgbMatch = color.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }
  
  return color;
};

/**
 * Check if the current theme mode is dark
 * @returns True if the current theme mode is dark, false otherwise
 */
export const isDarkMode = (): boolean => {
  return getThemeMode() === 'dark';
};

/**
 * Get a theme color based on the current theme mode
 * @param lightColor The color to use in light mode
 * @param darkColor The color to use in dark mode
 * @returns The appropriate color for the current theme mode
 */
export const getThemeAwareColor = (lightColor: string, darkColor: string): string => {
  return isDarkMode() ? darkColor : lightColor;
};

/**
 * Initialize the theme
 * @param initialMode The initial theme mode
 * @returns The created theme
 */
export const initTheme = (initialMode?: PaletteMode): Theme => {
  // If initialMode is provided, set it as the current theme mode
  if (initialMode) {
    setThemeMode(initialMode);
  }
  
  // Create the theme based on the current mode
  const theme = createAppTheme();
  
  // Apply CSS variables
  applyThemeCssVariables(theme);
  
  // Set up a media query listener for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Only change the theme if the user hasn't explicitly set a preference
    if (!localStorage.getItem(THEME_MODE_STORAGE_KEY)) {
      const newMode = e.matches ? 'dark' : 'light';
      setThemeMode(newMode);
      // You would typically update your React state here
      // For this utility, we'll just log the change
      console.log(`System theme changed to ${newMode} mode`);
    }
  });
  
  return theme;
};