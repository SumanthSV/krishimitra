// Utilities for handling date and time operations

import { getLanguage } from './languageUtils';

// Interface for date range
export interface DateRange {
  start: Date;
  end: Date;
}

// Enum for seasons in India
export enum Season {
  Winter = 'winter',
  Summer = 'summer',
  Monsoon = 'monsoon',
  PostMonsoon = 'postMonsoon',
}

// Season names in different languages
export const seasonNames: Record<Season, Record<string, string>> = {
  [Season.Winter]: {
    en: 'Winter',
    hi: 'सर्दी',
  },
  [Season.Summer]: {
    en: 'Summer',
    hi: 'गर्मी',
  },
  [Season.Monsoon]: {
    en: 'Monsoon',
    hi: 'मानसून',
  },
  [Season.PostMonsoon]: {
    en: 'Post-Monsoon',
    hi: 'मानसून के बाद',
  },
};

// Month names in different languages
export const monthNames: Record<string, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hi: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
};

// Day names in different languages
export const dayNames: Record<string, string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
};

// Short day names in different languages
export const shortDayNames: Record<string, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
};

/**
 * Format a date in the specified format and language
 * @param date The date to format
 * @param format The format string
 * @returns The formatted date string
 */
export const formatDate = (date: Date, format: string = 'YYYY-MM-DD'): string => {
  const language = getLanguage();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const dayOfWeek = date.getDay();

  // Replace format tokens with actual values
  return format
    .replace('YYYY', year.toString())
    .replace('YY', (year % 100).toString().padStart(2, '0'))
    .replace('MMMM', monthNames[language]?.[month] || monthNames['en'][month])
    .replace('MMM', (monthNames[language]?.[month] || monthNames['en'][month]).substring(0, 3))
    .replace('MM', (month + 1).toString().padStart(2, '0'))
    .replace('M', (month + 1).toString())
    .replace('DDDD', dayNames[language]?.[dayOfWeek] || dayNames['en'][dayOfWeek])
    .replace('DDD', shortDayNames[language]?.[dayOfWeek] || shortDayNames['en'][dayOfWeek])
    .replace('DD', day.toString().padStart(2, '0'))
    .replace('D', day.toString())
    .replace('HH', hours.toString().padStart(2, '0'))
    .replace('H', hours.toString())
    .replace('hh', (hours % 12 || 12).toString().padStart(2, '0'))
    .replace('h', (hours % 12 || 12).toString())
    .replace('mm', minutes.toString().padStart(2, '0'))
    .replace('m', minutes.toString())
    .replace('ss', seconds.toString().padStart(2, '0'))
    .replace('s', seconds.toString())
    .replace('A', hours >= 12 ? 'PM' : 'AM')
    .replace('a', hours >= 12 ? 'pm' : 'am');
};

/**
 * Get the current season based on the date
 * @param date The date to check (defaults to current date)
 * @returns The current season
 */
export const getCurrentSeason = (date: Date = new Date()): Season => {
  const month = date.getMonth();
  
  // Seasons in India (approximate)
  if (month >= 10 || month <= 1) { // November to February
    return Season.Winter;
  } else if (month >= 2 && month <= 4) { // March to May
    return Season.Summer;
  } else if (month >= 5 && month <= 8) { // June to September
    return Season.Monsoon;
  } else { // October
    return Season.PostMonsoon;
  }
};

/**
 * Get the date range for a season in the current or specified year
 * @param season The season to get the date range for
 * @param year The year (defaults to current year)
 * @returns The date range for the season
 */
export const getSeasonDateRange = (season: Season, year: number = new Date().getFullYear()): DateRange => {
  switch (season) {
    case Season.Winter:
      return {
        start: new Date(year, 10, 1), // November 1
        end: new Date(year + 1, 1, 28), // February 28/29
      };
    case Season.Summer:
      return {
        start: new Date(year, 2, 1), // March 1
        end: new Date(year, 4, 31), // May 31
      };
    case Season.Monsoon:
      return {
        start: new Date(year, 5, 1), // June 1
        end: new Date(year, 8, 30), // September 30
      };
    case Season.PostMonsoon:
      return {
        start: new Date(year, 9, 1), // October 1
        end: new Date(year, 9, 31), // October 31
      };
    default:
      throw new Error(`Invalid season: ${season}`);
  }
};

/**
 * Check if a date is within a date range
 * @param date The date to check
 * @param range The date range
 * @returns True if the date is within the range, false otherwise
 */
export const isDateInRange = (date: Date, range: DateRange): boolean => {
  return date >= range.start && date <= range.end;
};

/**
 * Get the number of days between two dates
 * @param start The start date
 * @param end The end date
 * @returns The number of days between the two dates
 */
export const getDaysBetween = (start: Date, end: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((start.getTime() - end.getTime()) / oneDay));
  return diffDays;
};

/**
 * Get an array of dates between two dates
 * @param start The start date
 * @param end The end date
 * @returns An array of dates between the two dates (inclusive)
 */
export const getDatesBetween = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(start);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

/**
 * Add days to a date
 * @param date The date to add days to
 * @param days The number of days to add
 * @returns A new date with the days added
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add months to a date
 * @param date The date to add months to
 * @param months The number of months to add
 * @returns A new date with the months added
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Get the start of the day for a date
 * @param date The date
 * @returns A new date set to the start of the day
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get the end of the day for a date
 * @param date The date
 * @returns A new date set to the end of the day
 */
export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Get the start of the month for a date
 * @param date The date
 * @returns A new date set to the start of the month
 */
export const startOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get the end of the month for a date
 * @param date The date
 * @returns A new date set to the end of the month
 */
export const endOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Format a date relative to now (e.g., "2 hours ago", "in 3 days")
 * @param date The date to format
 * @returns A string representing the relative time
 */
export const formatRelativeTime = (date: Date): string => {
  const language = getLanguage();
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffMonths / 12);
  
  const translations: Record<string, Record<string, string>> = {
    now: {
      en: 'just now',
      hi: 'अभी अभी',
    },
    seconds: {
      en: 'seconds',
      hi: 'सेकंड',
    },
    minute: {
      en: 'minute',
      hi: 'मिनट',
    },
    minutes: {
      en: 'minutes',
      hi: 'मिनट',
    },
    hour: {
      en: 'hour',
      hi: 'घंटा',
    },
    hours: {
      en: 'hours',
      hi: 'घंटे',
    },
    day: {
      en: 'day',
      hi: 'दिन',
    },
    days: {
      en: 'days',
      hi: 'दिन',
    },
    month: {
      en: 'month',
      hi: 'महीना',
    },
    months: {
      en: 'months',
      hi: 'महीने',
    },
    year: {
      en: 'year',
      hi: 'साल',
    },
    years: {
      en: 'years',
      hi: 'साल',
    },
    ago: {
      en: 'ago',
      hi: 'पहले',
    },
    in: {
      en: 'in',
      hi: 'में',
    },
  };
  
  const getText = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };
  
  if (Math.abs(diffSecs) < 60) {
    return getText('now');
  }
  
  let value: number;
  let unit: string;
  
  if (Math.abs(diffMins) < 60) {
    value = Math.abs(diffMins);
    unit = value === 1 ? 'minute' : 'minutes';
  } else if (Math.abs(diffHours) < 24) {
    value = Math.abs(diffHours);
    unit = value === 1 ? 'hour' : 'hours';
  } else if (Math.abs(diffDays) < 30) {
    value = Math.abs(diffDays);
    unit = value === 1 ? 'day' : 'days';
  } else if (Math.abs(diffMonths) < 12) {
    value = Math.abs(diffMonths);
    unit = value === 1 ? 'month' : 'months';
  } else {
    value = Math.abs(diffYears);
    unit = value === 1 ? 'year' : 'years';
  }
  
  if (diffMs < 0) {
    // Past
    return `${value} ${getText(unit)} ${getText('ago')}`;
  } else {
    // Future
    return `${getText('in')} ${value} ${getText(unit)}`;
  }
};

/**
 * Get the Indian agricultural season (Kharif, Rabi, Zaid) for a date
 * @param date The date to check
 * @returns The agricultural season name
 */
export const getAgriculturalSeason = (date: Date = new Date()): { en: string; hi: string } => {
  const month = date.getMonth();
  
  if (month >= 5 && month <= 9) { // June to October
    return { en: 'Kharif', hi: 'खरीफ' };
  } else if (month >= 10 || month <= 2) { // November to March
    return { en: 'Rabi', hi: 'रबी' };
  } else { // April to May
    return { en: 'Zaid', hi: 'ज़ायद' };
  }
};

/**
 * Check if a date is a public holiday in India
 * @param date The date to check
 * @returns True if the date is a holiday, false otherwise
 */
export const isPublicHoliday = (date: Date): boolean => {
  // This is a simplified implementation
  // In a real app, you would use an API or a comprehensive list of holidays
  
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Some major Indian holidays (simplified)
  const holidays = [
    { month: 0, day: 26 }, // Republic Day (January 26)
    { month: 7, day: 15 }, // Independence Day (August 15)
    { month: 9, day: 2 },  // Gandhi Jayanti (October 2)
  ];
  
  return holidays.some(holiday => holiday.month === month && holiday.day === day);
};

/**
 * Get the lunar phase for a date
 * @param date The date to check
 * @returns The lunar phase name
 */
export const getLunarPhase = (date: Date): { en: string; hi: string } => {
  // This is a simplified implementation
  // In a real app, you would use a more accurate algorithm or an API
  
  // Approximate lunar cycle (29.53 days)
  const lunarCycle = 29.53;
  
  // New moon reference date (January 6, 2000)
  const newMoonRef = new Date(2000, 0, 6).getTime();
  
  // Calculate days since reference new moon
  const daysSinceNewMoon = (date.getTime() - newMoonRef) / (24 * 60 * 60 * 1000);
  
  // Calculate current position in lunar cycle (0 to 1)
  const position = (daysSinceNewMoon % lunarCycle) / lunarCycle;
  
  // Determine lunar phase based on position
  if (position < 0.025 || position >= 0.975) {
    return { en: 'New Moon', hi: 'अमावस्या' };
  } else if (position < 0.25) {
    return { en: 'Waxing Crescent', hi: 'शुक्ल पक्ष (बढ़ता चाँद)' };
  } else if (position < 0.275) {
    return { en: 'First Quarter', hi: 'प्रथम चतुर्थांश' };
  } else if (position < 0.475) {
    return { en: 'Waxing Gibbous', hi: 'शुक्ल पक्ष (उभरता चाँद)' };
  } else if (position < 0.525) {
    return { en: 'Full Moon', hi: 'पूर्णिमा' };
  } else if (position < 0.725) {
    return { en: 'Waning Gibbous', hi: 'कृष्ण पक्ष (घटता चाँद)' };
  } else if (position < 0.775) {
    return { en: 'Last Quarter', hi: 'अंतिम चतुर्थांश' };
  } else {
    return { en: 'Waning Crescent', hi: 'कृष्ण पक्ष (क्षीण चाँद)' };
  }
};