// Utilities for handling geolocation and location-based services

import { logError, ErrorCategory, ErrorSeverity } from './errorUtils';
import { trackEvent, EventCategory, EventAction } from './analyticsUtils';
import { getLanguage } from './languageUtils';
import { isOnline } from './offlineUtils';

// Coordinate interface
export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
}

// Location interface
export interface Location {
  coordinates: Coordinates;
  address?: Address;
  name?: string;
  type?: LocationType;
  isFavorite?: boolean;
  lastUpdated?: Date;
}

// Address interface
export interface Address {
  formattedAddress?: string;
  street?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  landmark?: string;
}

// Location type enum
export enum LocationType {
  CURRENT = 'current',
  HOME = 'home',
  FARM = 'farm',
  MARKET = 'market',
  CUSTOM = 'custom',
}

// Geolocation options
export interface GeoLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

// Distance units
export enum DistanceUnit {
  KILOMETERS = 'km',
  MILES = 'mi',
  METERS = 'm',
}

// Area units
export enum AreaUnit {
  SQUARE_METERS = 'sqm',
  HECTARES = 'ha',
  ACRES = 'ac',
  SQUARE_KILOMETERS = 'sqkm',
}

// Translations for geolocation messages
const geoTranslations: Record<string, Record<string, string>> = {
  permissionDenied: {
    en: 'Location permission denied. Please enable location services to use this feature.',
    hi: 'स्थान अनुमति अस्वीकृत। इस सुविधा का उपयोग करने के लिए कृपया स्थान सेवाओं को सक्षम करें।',
    pa: 'ਟਿਕਾਣਾ ਅਨੁਮਤੀ ਤੋਂ ਇਨਕਾਰ ਕੀਤਾ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਵਿਸ਼ੇਸ਼ਤਾ ਦੀ ਵਰਤੋਂ ਕਰਨ ਲਈ ਟਿਕਾਣਾ ਸੇਵਾਵਾਂ ਨੂੰ ਯੋਗ ਕਰੋ।',
    bn: 'অবস্থান অনুমতি অস্বীকৃত। এই বৈশিষ্ট্যটি ব্যবহার করতে অনুগ্রহ করে অবস্থান পরিষেবাগুলি সক্ষম করুন।',
    te: 'స్థాన అనుమతి నిరాకరించబడింది. దయచేసి ఈ ఫీచర్‌ని ఉపయోగించడానికి స్థాన సేవలను ప్రారంభించండి.',
    ta: 'இருப்பிட அனுமதி மறுக்கப்பட்டது. இந்த அம்சத்தைப் பயன்படுத்த இருப்பிடச் சேவைகளை இயக்கவும்.',
    mr: 'स्थान परवानगी नाकारली. कृपया हे वैशिष्ट्य वापरण्यासाठी स्थान सेवा सक्षम करा.',
    gu: 'સ્થાન પરવાનગી નકારી. કૃપા કરીને આ સુવિધાનો ઉપયોગ કરવા માટે સ્થાન સેવાઓને સક્ષમ કરો.',
    kn: 'ಸ್ಥಳ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಈ ವೈಶಿಷ್ಟ್ಯವನ್ನು ಬಳಸಲು ಸ್ಥಳ ಸೇವೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.',
    ml: 'ലൊക്കേഷൻ അനുമതി നിഷേധിച്ചു. ഈ ഫീച്ചർ ഉപയോഗിക്കാൻ ദയവായി ലൊക്കേഷൻ സേവനങ്ങൾ പ്രവർത്തനക്ഷമമാക്കുക.',
  },
  positionUnavailable: {
    en: 'Location information is unavailable. Please try again later.',
    hi: 'स्थान जानकारी उपलब्ध नहीं है। कृपया बाद में पुनः प्रयास करें।',
    pa: 'ਟਿਕਾਣਾ ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    bn: 'অবস্থান তথ্য অনুপলব্ধ। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
    te: 'స్థాన సమాచారం అందుబాటులో లేదు. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.',
    ta: 'இருப்பிடத் தகவல் கிடைக்கவில்லை. பிறகு மீண்டும் முயற்சிக்கவும்.',
    mr: 'स्थान माहिती उपलब्ध नाही. कृपया नंतर पुन्हा प्रयत्न करा.',
    gu: 'સ્થાન માહિતી ઉપલબ્ધ નથી. કૃપા કરીને પછી ફરી પ્રયાસ કરો.',
    kn: 'ಸ್ಥಳ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    ml: 'ലൊക്കേഷൻ വിവരങ്ങൾ ലഭ്യമല്ല. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക.',
  },
  timeout: {
    en: 'Location request timed out. Please try again.',
    hi: 'स्थान अनुरोध का समय समाप्त हो गया। कृपया पुनः प्रयास करें।',
    pa: 'ਟਿਕਾਣਾ ਬੇਨਤੀ ਦਾ ਸਮਾਂ ਸਮਾਪਤ ਹੋ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    bn: 'অবস্থান অনুরোধের সময় শেষ হয়ে গেছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    te: 'స్థాన అభ్యర్థన సమయం ముగిసింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    ta: 'இருப்பிட கோரிக்கை நேரம் முடிந்தது. மீண்டும் முயற்சிக்கவும்.',
    mr: 'स्थान विनंतीची वेळ संपली. कृपया पुन्हा प्रयत्न करा.',
    gu: 'સ્થાન વિનંતી સમય સમાપ્ત થયો. કૃપા કરીને ફરી પ્રયાસ કરો.',
    kn: 'ಸ್ಥಳ ವಿನಂತಿ ಸಮಯ ಮೀರಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    ml: 'ലൊക്കേഷൻ അഭ്യർത്ഥന ടൈംഔട്ട് ആയി. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
  },
  unsupportedBrowser: {
    en: 'Geolocation is not supported by your browser. Please use a modern browser.',
    hi: 'आपके ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है। कृपया एक आधुनिक ब्राउज़र का उपयोग करें।',
    pa: 'ਜੀਓਲੋਕੇਸ਼ਨ ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਦੁਆਰਾ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਆਧੁਨਿਕ ਬ੍ਰਾਊਜ਼ਰ ਦੀ ਵਰਤੋਂ ਕਰੋ।',
    bn: 'আপনার ব্রাউজার দ্বারা জিওলোকেশন সমর্থিত নয়। অনুগ্রহ করে একটি আধুনিক ব্রাউজার ব্যবহার করুন।',
    te: 'జియోలొకేషన్ మీ బ్రౌజర్ ద్వారా మద్దతు లేదు. దయచేసి ఆధునిక బ్రౌజర్‌ని ఉపయోగించండి.',
    ta: 'ஜியோலொகேஷன் உங்கள் உலாவியால் ஆதரிக்கப்படவில்லை. தயவுசெய்து நவீன உலாவியைப் பயன்படுத்தவும்.',
    mr: 'जिओलोकेशन आपल्या ब्राउझरद्वारे समर्थित नाही. कृपया आधुनिक ब्राउझर वापरा.',
    gu: 'જિયોલોકેશન તમારા બ્રાઉઝર દ્વારા સમર્થિત નથી. કૃપા કરીને આધુનિક બ્રાઉઝરનો ઉપયોગ કરો.',
    kn: 'ಜಿಯೋಲೊಕೇಷನ್ ನಿಮ್ಮ ಬ್ರೌಸರ್ ಮೂಲಕ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಆಧುನಿಕ ಬ್ರೌಸರ್ ಬಳಸಿ.',
    ml: 'ജിയോലൊക്കേഷൻ നിങ്ങളുടെ ബ്രൗസർ പിന്തുണയ്ക്കുന്നില്ല. ദയവായി ഒരു ആധുനിക ബ്രൗസർ ഉപയോഗിക്കുക.',
  },
  locationSaved: {
    en: 'Location saved successfully.',
    hi: 'स्थान सफलतापूर्वक सहेजा गया।',
    pa: 'ਟਿਕਾਣਾ ਸਫਲਤਾਪੂਰਵਕ ਸੁਰੱਖਿਅਤ ਕੀਤਾ ਗਿਆ।',
    bn: 'অবস্থান সফলভাবে সংরক্ষিত হয়েছে।',
    te: 'స్థానం విజయవంతంగా సేవ్ చేయబడింది.',
    ta: 'இருப்பிடம் வெற்றிகரமாக சேமிக்கப்பட்டது.',
    mr: 'स्थान यशस्वीरित्या जतन केले.',
    gu: 'સ્થાન સફળતાપૂર્વક સાચવ્યું.',
    kn: 'ಸ್ಥಳವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ.',
    ml: 'ലൊക്കേഷൻ വിജയകരമായി സംരക്ഷിച്ചു.',
  },
  locationRemoved: {
    en: 'Location removed successfully.',
    hi: 'स्थान सफलतापूर्वक हटा दिया गया।',
    pa: 'ਟਿਕਾਣਾ ਸਫਲਤਾਪੂਰਵਕ ਹਟਾ ਦਿੱਤਾ ਗਿਆ।',
    bn: 'অবস্থান সফলভাবে সরানো হয়েছে।',
    te: 'స్థానం విజయవంతంగా తొలగించబడింది.',
    ta: 'இருப்பிடம் வெற்றிகரமாக அகற்றப்பட்டது.',
    mr: 'स्थान यशस्वीरित्या काढले.',
    gu: 'સ્થાન સફળતાપૂર્વક દૂર કર્યું.',
    kn: 'ಸ್ಥಳವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ತೆಗೆದುಹಾಕಲಾಗಿದೆ.',
    ml: 'ലൊക്കേഷൻ വിജയകരമായി നീക്കം ചെയ്തു.',
  },
  locationUpdated: {
    en: 'Location updated successfully.',
    hi: 'स्थान सफलतापूर्वक अपडेट किया गया।',
    pa: 'ਟਿਕਾਣਾ ਸਫਲਤਾਪੂਰਵਕ ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ।',
    bn: 'অবস্থান সফলভাবে আপডেট করা হয়েছে।',
    te: 'స్థానం విజయవంతంగా నవీకరించబడింది.',
    ta: 'இருப்பிடம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது.',
    mr: 'स्थान यशस्वीरित्या अपडेट केले.',
    gu: 'સ્થાન સફળતાપૂર્વક અપડેટ થયું.',
    kn: 'ಸ್ಥಳವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ.',
    ml: 'ലൊക്കേഷൻ വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു.',
  },
};

/**
 * Get a translated geolocation message
 * @param key The translation key
 * @returns The translated message
 */
export const getGeoMessage = (key: string): string => {
  const language = getLanguage();
  return geoTranslations[key]?.[language] || geoTranslations[key]?.['en'] || key;
};

/**
 * Check if geolocation is supported by the browser
 * @returns Whether geolocation is supported
 */
export const isGeolocationSupported = (): boolean => {
  return 'geolocation' in navigator;
};

/**
 * Get the current position
 * @param options Geolocation options
 * @returns Promise that resolves with the current position
 */
export const getCurrentPosition = (options?: GeoLocationOptions): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      trackEvent({
        category: EventCategory.GEOLOCATION,
        action: EventAction.GEOLOCATION_ERROR,
        label: 'unsupported_browser',
      });
      
      reject(new Error(getGeoMessage('unsupportedBrowser')));
      return;
    }
    
    const defaultOptions: GeoLocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };
    
    const geoOptions = { ...defaultOptions, ...options };
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        };
        
        trackEvent({
          category: EventCategory.GEOLOCATION,
          action: EventAction.GET_LOCATION,
          label: 'success',
        });
        
        resolve(coordinates);
      },
      (error) => {
        let errorMessage: string;
        let errorLabel: string;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = getGeoMessage('permissionDenied');
            errorLabel = 'permission_denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = getGeoMessage('positionUnavailable');
            errorLabel = 'position_unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = getGeoMessage('timeout');
            errorLabel = 'timeout';
            break;
          default:
            errorMessage = error.message;
            errorLabel = 'unknown';
        }
        
        trackEvent({
          category: EventCategory.GEOLOCATION,
          action: EventAction.GEOLOCATION_ERROR,
          label: errorLabel,
        });
        
        logError({
          message: `Geolocation error: ${errorMessage}`,
          error: error,
          category: ErrorCategory.GEOLOCATION,
          severity: ErrorSeverity.WARNING,
        });
        
        reject(new Error(errorMessage));
      },
      geoOptions
    );
  });
};

/**
 * Watch position changes
 * @param successCallback Callback for position updates
 * @param errorCallback Callback for errors
 * @param options Geolocation options
 * @returns Watch ID that can be used to clear the watch
 */
export const watchPosition = (
  successCallback: (coordinates: Coordinates) => void,
  errorCallback?: (error: Error) => void,
  options?: GeoLocationOptions
): number => {
  if (!isGeolocationSupported()) {
    if (errorCallback) {
      errorCallback(new Error(getGeoMessage('unsupportedBrowser')));
    }
    return -1;
  }
  
  const defaultOptions: GeoLocationOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };
  
  const geoOptions = { ...defaultOptions, ...options };
  
  return navigator.geolocation.watchPosition(
    (position) => {
      const coordinates: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp,
      };
      
      successCallback(coordinates);
    },
    (error) => {
      let errorMessage: string;
      let errorLabel: string;
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = getGeoMessage('permissionDenied');
          errorLabel = 'permission_denied';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = getGeoMessage('positionUnavailable');
          errorLabel = 'position_unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = getGeoMessage('timeout');
          errorLabel = 'timeout';
          break;
        default:
          errorMessage = error.message;
          errorLabel = 'unknown';
      }
      
      trackEvent({
        category: EventCategory.GEOLOCATION,
        action: EventAction.GEOLOCATION_ERROR,
        label: errorLabel,
      });
      
      logError({
        message: `Geolocation watch error: ${errorMessage}`,
        error: error,
        category: ErrorCategory.GEOLOCATION,
        severity: ErrorSeverity.WARNING,
      });
      
      if (errorCallback) {
        errorCallback(new Error(errorMessage));
      }
    },
    geoOptions
  );
};

/**
 * Clear a position watch
 * @param watchId The watch ID to clear
 */
export const clearPositionWatch = (watchId: number): void => {
  if (isGeolocationSupported() && watchId !== -1) {
    navigator.geolocation.clearWatch(watchId);
  }
};

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @param unit Distance unit (default: kilometers)
 * @returns Distance between the coordinates in the specified unit
 */
export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates,
  unit: DistanceUnit = DistanceUnit.KILOMETERS
): number => {
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInKm = R * c;
  
  switch (unit) {
    case DistanceUnit.MILES:
      return distanceInKm * 0.621371; // Convert km to miles
    case DistanceUnit.METERS:
      return distanceInKm * 1000; // Convert km to meters
    case DistanceUnit.KILOMETERS:
    default:
      return distanceInKm;
  }
};

/**
 * Convert degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Convert radians to degrees
 * @param radians Angle in radians
 * @returns Angle in degrees
 */
const toDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * Calculate the bearing between two coordinates
 * @param coord1 First coordinate (starting point)
 * @param coord2 Second coordinate (destination point)
 * @returns Bearing in degrees (0-360)
 */
export const calculateBearing = (coord1: Coordinates, coord2: Coordinates): number => {
  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  let bearing = toDegrees(Math.atan2(y, x));
  
  // Normalize to 0-360
  bearing = (bearing + 360) % 360;
  
  return bearing;
};

/**
 * Get the cardinal direction (N, NE, E, etc.) from a bearing
 * @param bearing Bearing in degrees
 * @returns Cardinal direction
 */
export const getCardinalDirection = (bearing: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

/**
 * Calculate the midpoint between two coordinates
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Midpoint coordinates
 */
export const calculateMidpoint = (coord1: Coordinates, coord2: Coordinates): Coordinates => {
  const lat1 = toRadians(coord1.latitude);
  const lon1 = toRadians(coord1.longitude);
  const lat2 = toRadians(coord2.latitude);
  const lon2 = toRadians(coord2.longitude);
  
  const Bx = Math.cos(lat2) * Math.cos(lon2 - lon1);
  const By = Math.cos(lat2) * Math.sin(lon2 - lon1);
  
  const lat3 = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By)
  );
  
  const lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
  
  return {
    latitude: toDegrees(lat3),
    longitude: toDegrees(lon3),
  };
};

/**
 * Calculate the destination point given a starting point, bearing, and distance
 * @param startCoord Starting coordinate
 * @param bearing Bearing in degrees
 * @param distance Distance to travel
 * @param unit Distance unit (default: kilometers)
 * @returns Destination coordinates
 */
export const calculateDestination = (
  startCoord: Coordinates,
  bearing: number,
  distance: number,
  unit: DistanceUnit = DistanceUnit.KILOMETERS
): Coordinates => {
  // Convert distance to kilometers if needed
  let distanceInKm = distance;
  switch (unit) {
    case DistanceUnit.MILES:
      distanceInKm = distance * 1.60934; // Convert miles to km
      break;
    case DistanceUnit.METERS:
      distanceInKm = distance / 1000; // Convert meters to km
      break;
  }
  
  const R = 6371; // Earth's radius in kilometers
  const bearingRad = toRadians(bearing);
  
  const lat1 = toRadians(startCoord.latitude);
  const lon1 = toRadians(startCoord.longitude);
  
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distanceInKm / R) +
      Math.cos(lat1) * Math.sin(distanceInKm / R) * Math.cos(bearingRad)
  );
  
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(distanceInKm / R) * Math.cos(lat1),
      Math.cos(distanceInKm / R) - Math.sin(lat1) * Math.sin(lat2)
    );
  
  return {
    latitude: toDegrees(lat2),
    longitude: toDegrees(lon2),
  };
};

/**
 * Calculate the area of a polygon defined by an array of coordinates
 * @param coordinates Array of coordinates forming a polygon
 * @param unit Area unit (default: square kilometers)
 * @returns Area of the polygon in the specified unit
 */
export const calculatePolygonArea = (
  coordinates: Coordinates[],
  unit: AreaUnit = AreaUnit.SQUARE_KILOMETERS
): number => {
  if (coordinates.length < 3) {
    return 0; // A polygon needs at least 3 points
  }
  
  const R = 6371; // Earth's radius in kilometers
  
  // Ensure the polygon is closed
  const closedCoords = [...coordinates];
  if (
    closedCoords[0].latitude !== closedCoords[closedCoords.length - 1].latitude ||
    closedCoords[0].longitude !== closedCoords[closedCoords.length - 1].longitude
  ) {
    closedCoords.push(closedCoords[0]);
  }
  
  let area = 0;
  
  for (let i = 0; i < closedCoords.length - 1; i++) {
    const lat1 = toRadians(closedCoords[i].latitude);
    const lon1 = toRadians(closedCoords[i].longitude);
    const lat2 = toRadians(closedCoords[i + 1].latitude);
    const lon2 = toRadians(closedCoords[i + 1].longitude);
    
    area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  
  area = Math.abs(area * R * R / 2);
  
  switch (unit) {
    case AreaUnit.HECTARES:
      return area * 100; // Convert sq km to hectares
    case AreaUnit.ACRES:
      return area * 247.105; // Convert sq km to acres
    case AreaUnit.SQUARE_METERS:
      return area * 1000000; // Convert sq km to sq meters
    case AreaUnit.SQUARE_KILOMETERS:
    default:
      return area;
  }
};

/**
 * Check if a point is inside a polygon
 * @param point The point to check
 * @param polygon Array of coordinates forming a polygon
 * @returns Whether the point is inside the polygon
 */
export const isPointInPolygon = (point: Coordinates, polygon: Coordinates[]): boolean => {
  if (polygon.length < 3) {
    return false; // A polygon needs at least 3 points
  }
  
  let isInside = false;
  const x = point.longitude;
  const y = point.latitude;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].longitude;
    const yi = polygon[i].latitude;
    const xj = polygon[j].longitude;
    const yj = polygon[j].latitude;
    
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    
    if (intersect) {
      isInside = !isInside;
    }
  }
  
  return isInside;
};

/**
 * Get saved locations from local storage
 * @returns Array of saved locations
 */
export const getSavedLocations = (): Location[] => {
  try {
    const savedLocations = localStorage.getItem('krishimitra_locations');
    return savedLocations ? JSON.parse(savedLocations) : [];
  } catch (error) {
    logError({
      message: 'Failed to get saved locations from local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
    
    return [];
  }
};

/**
 * Save a location to local storage
 * @param location The location to save
 * @returns The saved location with generated ID if not provided
 */
export const saveLocation = (location: Location): Location => {
  try {
    const locations = getSavedLocations();
    
    // Generate a unique ID if not provided
    const locationToSave: Location = {
      ...location,
      lastUpdated: new Date(),
    };
    
    locations.push(locationToSave);
    
    localStorage.setItem('krishimitra_locations', JSON.stringify(locations));
    
    trackEvent({
      category: EventCategory.GEOLOCATION,
      action: EventAction.SAVE_LOCATION,
      label: location.type || 'custom',
    });
    
    return locationToSave;
  } catch (error) {
    logError({
      message: 'Failed to save location to local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Update a saved location
 * @param location The location to update
 * @returns The updated location
 */
export const updateLocation = (location: Location): Location => {
  try {
    const locations = getSavedLocations();
    
    const index = locations.findIndex(
      (loc) =>
        loc.coordinates.latitude === location.coordinates.latitude &&
        loc.coordinates.longitude === location.coordinates.longitude
    );
    
    if (index === -1) {
      return saveLocation(location);
    }
    
    const updatedLocation: Location = {
      ...location,
      lastUpdated: new Date(),
    };
    
    locations[index] = updatedLocation;
    
    localStorage.setItem('krishimitra_locations', JSON.stringify(locations));
    
    trackEvent({
      category: EventCategory.GEOLOCATION,
      action: EventAction.UPDATE_LOCATION,
      label: location.type || 'custom',
    });
    
    return updatedLocation;
  } catch (error) {
    logError({
      message: 'Failed to update location in local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Remove a saved location
 * @param location The location to remove
 */
export const removeLocation = (location: Location): void => {
  try {
    const locations = getSavedLocations();
    
    const updatedLocations = locations.filter(
      (loc) =>
        loc.coordinates.latitude !== location.coordinates.latitude ||
        loc.coordinates.longitude !== location.coordinates.longitude
    );
    
    localStorage.setItem('krishimitra_locations', JSON.stringify(updatedLocations));
    
    trackEvent({
      category: EventCategory.GEOLOCATION,
      action: EventAction.REMOVE_LOCATION,
      label: location.type || 'custom',
    });
  } catch (error) {
    logError({
      message: 'Failed to remove location from local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Get the current location with address information
 * @returns Promise that resolves with the current location
 */
export const getCurrentLocationWithAddress = async (): Promise<Location> => {
  try {
    const coordinates = await getCurrentPosition();
    const address = await reverseGeocode(coordinates);
    
    return {
      coordinates,
      address,
      type: LocationType.CURRENT,
      lastUpdated: new Date(),
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Reverse geocode coordinates to get address information
 * @param coordinates The coordinates to reverse geocode
 * @returns Promise that resolves with the address information
 */
export const reverseGeocode = async (coordinates: Coordinates): Promise<Address> => {
  // In a real implementation, this would call a geocoding API
  // For now, we'll return a mock address
  
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Mock address based on coordinates
  const mockAddress: Address = {
    formattedAddress: `Mock Address near ${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`,
    street: 'Mock Street',
    city: 'Mock City',
    district: 'Mock District',
    state: 'Mock State',
    country: 'India',
    postalCode: '123456',
  };
  
  return mockAddress;
};

/**
 * Geocode an address to get coordinates
 * @param address The address to geocode
 * @returns Promise that resolves with the coordinates
 */
export const geocodeAddress = async (address: string): Promise<Coordinates> => {
  // In a real implementation, this would call a geocoding API
  // For now, we'll return mock coordinates
  
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Generate mock coordinates based on the address string
  // This is just for demonstration and will not produce meaningful results
  const hash = address.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // Generate coordinates in India (roughly between 8-37°N, 68-97°E)
  const latitude = 8 + (hash % 29);
  const longitude = 68 + (hash % 29);
  
  return {
    latitude,
    longitude,
    accuracy: 100, // Mock accuracy in meters
  };
};

/**
 * Format coordinates as a string
 * @param coordinates The coordinates to format
 * @param format The format to use (default: 'decimal')
 * @returns Formatted coordinates string
 */
export const formatCoordinates = (
  coordinates: Coordinates,
  format: 'decimal' | 'dms' = 'decimal'
): string => {
  if (format === 'decimal') {
    return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
  } else {
    // Convert to degrees, minutes, seconds
    const latDegrees = Math.floor(Math.abs(coordinates.latitude));
    const latMinutes = Math.floor((Math.abs(coordinates.latitude) - latDegrees) * 60);
    const latSeconds = ((Math.abs(coordinates.latitude) - latDegrees - latMinutes / 60) * 3600).toFixed(2);
    const latDirection = coordinates.latitude >= 0 ? 'N' : 'S';
    
    const lonDegrees = Math.floor(Math.abs(coordinates.longitude));
    const lonMinutes = Math.floor((Math.abs(coordinates.longitude) - lonDegrees) * 60);
    const lonSeconds = ((Math.abs(coordinates.longitude) - lonDegrees - lonMinutes / 60) * 3600).toFixed(2);
    const lonDirection = coordinates.longitude >= 0 ? 'E' : 'W';
    
    return `${latDegrees}° ${latMinutes}' ${latSeconds}" ${latDirection}, ${lonDegrees}° ${lonMinutes}' ${lonSeconds}" ${lonDirection}`;
  }
};

/**
 * Get nearby locations within a specified radius
 * @param center Center coordinates
 * @param radius Radius in kilometers
 * @returns Array of locations within the radius
 */
export const getNearbyLocations = (center: Coordinates, radius: number): Location[] => {
  const savedLocations = getSavedLocations();
  
  return savedLocations.filter((location) => {
    const distance = calculateDistance(center, location.coordinates);
    return distance <= radius;
  });
};

/**
 * Get the nearest location to a point
 * @param point The reference point
 * @param locations Array of locations to check
 * @returns The nearest location and its distance
 */
export const getNearestLocation = (
  point: Coordinates,
  locations: Location[]
): { location: Location; distance: number } | null => {
  if (locations.length === 0) {
    return null;
  }
  
  let nearestLocation = locations[0];
  let minDistance = calculateDistance(point, locations[0].coordinates);
  
  for (let i = 1; i < locations.length; i++) {
    const distance = calculateDistance(point, locations[i].coordinates);
    if (distance < minDistance) {
      minDistance = distance;
      nearestLocation = locations[i];
    }
  }
  
  return {
    location: nearestLocation,
    distance: minDistance,
  };
};

/**
 * Initialize geolocation services
 */
export const initGeolocation = (): void => {
  // Check if geolocation is supported
  if (!isGeolocationSupported()) {
    logError({
      message: 'Geolocation is not supported by this browser',
      category: ErrorCategory.GEOLOCATION,
      severity: ErrorSeverity.WARNING,
    });
  }
};