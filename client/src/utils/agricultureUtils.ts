// Utilities for agricultural calculations and data

import { getLanguage } from './languageUtils';
import { formatDate, getSeason, getIndianSeason } from './dateUtils';
import { logError, ErrorCategory, ErrorSeverity } from './errorUtils';

// Crop type enum
export enum CropType {
  CEREAL = 'cereal',
  PULSE = 'pulse',
  OILSEED = 'oilseed',
  VEGETABLE = 'vegetable',
  FRUIT = 'fruit',
  SPICE = 'spice',
  CASH_CROP = 'cashCrop',
  FODDER = 'fodder',
  FIBER = 'fiber',
}

// Crop season enum
export enum CropSeason {
  KHARIF = 'kharif',    // Monsoon season (June-October)
  RABI = 'rabi',        // Winter season (October-March)
  ZAID = 'zaid',        // Summer season (March-June)
  PERENNIAL = 'perennial', // Year-round
}

// Soil type enum
export enum SoilType {
  ALLUVIAL = 'alluvial',
  BLACK = 'black',
  RED = 'red',
  LATERITE = 'laterite',
  ARID = 'arid',
  FOREST = 'forest',
  SALINE = 'saline',
  PEATY = 'peaty',
  CLAY = 'clay',
  SANDY = 'sandy',
  LOAMY = 'loamy',
  SILTY = 'silty',
}

// Irrigation method enum
export enum IrrigationMethod {
  FLOOD = 'flood',
  DRIP = 'drip',
  SPRINKLER = 'sprinkler',
  FURROW = 'furrow',
  BASIN = 'basin',
  RAINFED = 'rainfed',
  SUBSURFACE = 'subsurface',
  CENTER_PIVOT = 'centerPivot',
}

// Fertilizer type enum
export enum FertilizerType {
  NITROGEN = 'nitrogen',
  PHOSPHORUS = 'phosphorus',
  POTASSIUM = 'potassium',
  NPK = 'npk',
  ORGANIC = 'organic',
  MICRONUTRIENT = 'micronutrient',
  BIOFERTILIZER = 'biofertilizer',
}

// Pest type enum
export enum PestType {
  INSECT = 'insect',
  DISEASE = 'disease',
  WEED = 'weed',
  RODENT = 'rodent',
  NEMATODE = 'nematode',
  FUNGAL = 'fungal',
  BACTERIAL = 'bacterial',
  VIRAL = 'viral',
}

// Crop interface
export interface Crop {
  id: string;
  name: string;
  scientificName: string;
  localNames: Record<string, string>;
  type: CropType;
  seasons: CropSeason[];
  durationDays: number;
  waterRequirementMm: number;
  soilTypes: SoilType[];
  idealTemperatureRange: {
    min: number;
    max: number;
  };
  idealRainfallRange: {
    min: number;
    max: number;
  };
  idealPhRange: {
    min: number;
    max: number;
  };
  fertilizers: {
    type: FertilizerType;
    amountKgPerHectare: number;
    applicationTiming: string;
  }[];
  commonPests: {
    name: string;
    type: PestType;
    symptoms: string;
    management: string;
  }[];
  yieldPerHectare: {
    min: number;
    max: number;
    unit: string;
  };
  marketValue: {
    min: number;
    max: number;
    currency: string;
  };
  irrigationMethods: IrrigationMethod[];
  intercropping: string[];
  rotationRecommendations: string[];
  nutritionalValue: Record<string, string>;
  storageGuidelines: string;
  processingMethods: string[];
  governmentSchemes?: string[];
  imageUrl?: string;
}

// Soil test result interface
export interface SoilTestResult {
  ph: number;
  organicMatter: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  calcium?: number;
  magnesium?: number;
  sulfur?: number;
  zinc?: number;
  iron?: number;
  manganese?: number;
  copper?: number;
  boron?: number;
  texture?: SoilType;
  electricalConductivity?: number;
  cationExchangeCapacity?: number;
  date: Date;
  location?: string;
}

// Fertilizer recommendation interface
export interface FertilizerRecommendation {
  cropId: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  other?: Record<string, number>;
  organicOptions?: string[];
  applicationSchedule: {
    timing: string;
    percentage: number;
  }[];
  notes?: string;
}

// Irrigation schedule interface
export interface IrrigationSchedule {
  cropId: string;
  method: IrrigationMethod;
  totalWaterRequirement: number;
  schedule: {
    stageName: string;
    daysFromSowing: number;
    waterAmount: number;
    frequency: number;
  }[];
  adjustments?: {
    condition: string;
    adjustment: number;
  }[];
}

// Crop calendar event interface
export interface CropCalendarEvent {
  cropId: string;
  eventType: 'sowing' | 'irrigation' | 'fertilization' | 'pestControl' | 'harvesting' | 'other';
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  completed?: boolean;
}

// Yield prediction interface
export interface YieldPrediction {
  cropId: string;
  predictedYield: number;
  yieldUnit: string;
  confidence: number;
  factors: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    magnitude: number;
  }[];
}

// Translations for agriculture-related terms
const agricultureTranslations: Record<string, Record<string, string>> = {
  // Crop types
  cropType: {
    en: 'Crop Type',
    hi: 'फसल प्रकार',
    pa: 'ਫਸਲ ਕਿਸਮ',
    bn: 'ফসলের ধরন',
    te: 'పంట రకం',
    ta: 'பயிர் வகை',
    mr: 'पीक प्रकार',
    gu: 'પાક પ્રકાર',
    kn: 'ಬೆಳೆ ಪ್ರಕಾರ',
    ml: 'വിള തരം',
  },
  cereal: {
    en: 'Cereal',
    hi: 'अनाज',
    pa: 'ਅਨਾਜ',
    bn: 'শস্য',
    te: 'ధాన్యం',
    ta: 'தானியம்',
    mr: 'धान्य',
    gu: 'અનાજ',
    kn: 'ಧಾನ್ಯ',
    ml: 'ധാന്യം',
  },
  pulse: {
    en: 'Pulse',
    hi: 'दाल',
    pa: 'ਦਾਲ',
    bn: 'ডাল',
    te: 'పప్పు',
    ta: 'பருப்பு',
    mr: 'डाळ',
    gu: 'કઠોળ',
    kn: 'ಬೇಳೆ',
    ml: 'പയർ',
  },
  oilseed: {
    en: 'Oilseed',
    hi: 'तिलहन',
    pa: 'ਤੇਲ ਬੀਜ',
    bn: 'তৈলবীজ',
    te: 'నూనె గింజలు',
    ta: 'எண்ணெய் வித்து',
    mr: 'तेलबिया',
    gu: 'તેલીબિયાં',
    kn: 'ಎಣ್ಣೆ ಕಾಳು',
    ml: 'എണ്ണക്കുരു',
  },
  vegetable: {
    en: 'Vegetable',
    hi: 'सब्जी',
    pa: 'ਸਬਜ਼ੀ',
    bn: 'সবজি',
    te: 'కూరగాయలు',
    ta: 'காய்கறி',
    mr: 'भाजी',
    gu: 'શાકભાજી',
    kn: 'ತರಕಾರಿ',
    ml: 'പച്ചക്കറി',
  },
  fruit: {
    en: 'Fruit',
    hi: 'फल',
    pa: 'ਫਲ',
    bn: 'ফল',
    te: 'పండు',
    ta: 'பழம்',
    mr: 'फळ',
    gu: 'ફળ',
    kn: 'ಹಣ್ಣು',
    ml: 'പഴം',
  },
  spice: {
    en: 'Spice',
    hi: 'मसाला',
    pa: 'ਮਸਾਲਾ',
    bn: 'মশলা',
    te: 'సుగంధ ద్రవ్యం',
    ta: 'மசாலா',
    mr: 'मसाला',
    gu: 'મસાલો',
    kn: 'ಮಸಾಲೆ',
    ml: 'സുഗന്ധവ്യഞ്ജനം',
  },
  cashCrop: {
    en: 'Cash Crop',
    hi: 'नकदी फसल',
    pa: 'ਨਕਦੀ ਫਸਲ',
    bn: 'নগদ ফসল',
    te: 'వాణిజ్య పంట',
    ta: 'பணப்பயிர்',
    mr: 'नगदी पीक',
    gu: 'રોકડિયા પાક',
    kn: 'ನಗದು ಬೆಳೆ',
    ml: 'കാഷ് ക്രോപ്പ്',
  },
  
  // Crop seasons
  cropSeason: {
    en: 'Crop Season',
    hi: 'फसल मौसम',
    pa: 'ਫਸਲ ਮੌਸਮ',
    bn: 'ফসল ঋতু',
    te: 'పంట కాలం',
    ta: 'பயிர் பருவம்',
    mr: 'पीक हंगाम',
    gu: 'પાક ઋતુ',
    kn: 'ಬೆಳೆ ಋತು',
    ml: 'വിള സീസൺ',
  },
  kharif: {
    en: 'Kharif (Monsoon)',
    hi: 'खरीफ (मानसून)',
    pa: 'ਖਰੀਫ (ਮਾਨਸੂਨ)',
    bn: 'খরিফ (বর্ষা)',
    te: 'ఖరీఫ్ (వర్షాకాలం)',
    ta: 'காரிஃப் (பருவமழை)',
    mr: 'खरीप (पावसाळा)',
    gu: 'ખરીફ (ચોમાસું)',
    kn: 'ಖರೀಫ್ (ಮಳೆಗಾಲ)',
    ml: 'ഖരീഫ് (മൺസൂൺ)',
  },
  rabi: {
    en: 'Rabi (Winter)',
    hi: 'रबी (सर्दी)',
    pa: 'ਰਬੀ (ਸਰਦੀ)',
    bn: 'রবি (শীত)',
    te: 'రబీ (శీతాకాలం)',
    ta: 'ரபி (குளிர்காலம்)',
    mr: 'रब्बी (हिवाळा)',
    gu: 'રવિ (શિયાળો)',
    kn: 'ರಬಿ (ಚಳಿಗಾಲ)',
    ml: 'റബി (ശൈത്യകാലം)',
  },
  zaid: {
    en: 'Zaid (Summer)',
    hi: 'जायद (गर्मी)',
    pa: 'ਜ਼ਾਇਦ (ਗਰਮੀ)',
    bn: 'জৈদ (গ্রীষ্ম)',
    te: 'జైద్ (వేసవి)',
    ta: 'ஜைத் (கோடை)',
    mr: 'झायद (उन्हाळा)',
    gu: 'ઝાયદ (ઉનાળો)',
    kn: 'ಜೈದ್ (ಬೇಸಿಗೆ)',
    ml: 'സൈദ് (വേനൽക്കാലം)',
  },
  perennial: {
    en: 'Perennial (Year-round)',
    hi: 'बारहमासी (साल भर)',
    pa: 'ਬਾਰਾਂਮਾਸੀ (ਸਾਲ ਭਰ)',
    bn: 'বারোমাসী (সারা বছর)',
    te: 'సంవత్సరం పొడవునా',
    ta: 'ஆண்டு முழுவதும்',
    mr: 'बारमाही (वर्षभर)',
    gu: 'બારેમાસી (આખા વર્ષ)',
    kn: 'ವರ್ಷಪೂರ್ತಿ',
    ml: 'വർഷം മുഴുവൻ',
  },
  
  // Soil types
  soilType: {
    en: 'Soil Type',
    hi: 'मिट्टी प्रकार',
    pa: 'ਮਿੱਟੀ ਕਿਸਮ',
    bn: 'মাটির ধরন',
    te: 'నేల రకం',
    ta: 'மண் வகை',
    mr: 'मृदा प्रकार',
    gu: 'જમીનનો પ્રકાર',
    kn: 'ಮಣ್ಣಿನ ಪ್ರಕಾರ',
    ml: 'മണ്ണ് തരം',
  },
  alluvial: {
    en: 'Alluvial Soil',
    hi: 'जलोढ़ मिट्टी',
    pa: 'ਕੱਲਰ ਮਿੱਟੀ',
    bn: 'পলিমাটি',
    te: 'ఒండ్రు మట్టి',
    ta: 'வண்டல் மண்',
    mr: 'गाळाची माती',
    gu: 'કાંપવાળી માટી',
    kn: 'ಮೆಕ್ಕಲು ಮಣ್ಣು',
    ml: 'എക്കൽ മണ്ണ്',
  },
  black: {
    en: 'Black Soil',
    hi: 'काली मिट्टी',
    pa: 'ਕਾਲੀ ਮਿੱਟੀ',
    bn: 'কালো মাটি',
    te: 'నల్ల నేల',
    ta: 'கரிசல் மண்',
    mr: 'काळी कसदार माती',
    gu: 'કાળી માટી',
    kn: 'ಕಪ್ಪು ಮಣ್ಣು',
    ml: 'കരിമണ്ണ്',
  },
  red: {
    en: 'Red Soil',
    hi: 'लाल मिट्टी',
    pa: 'ਲਾਲ ਮਿੱਟੀ',
    bn: 'লাল মাটি',
    te: 'ఎర్ర నేల',
    ta: 'செம்மண்',
    mr: 'लाल माती',
    gu: 'લાલ માટી',
    kn: 'ಕೆಂಪು ಮಣ್ಣು',
    ml: 'ചുവന്ന മണ്ണ്',
  },
  
  // Irrigation methods
  irrigationMethod: {
    en: 'Irrigation Method',
    hi: 'सिंचाई विधि',
    pa: 'ਸਿੰਜਾਈ ਵਿਧੀ',
    bn: 'সেচ পদ্ধতি',
    te: 'నీటి పారుదల పద్ధతి',
    ta: 'நீர்ப்பாசன முறை',
    mr: 'सिंचन पद्धती',
    gu: 'સિંચાઈ પદ્ધતિ',
    kn: 'ನೀರಾವರಿ ವಿಧಾನ',
    ml: 'ജലസേചന രീതി',
  },
  flood: {
    en: 'Flood Irrigation',
    hi: 'बाढ़ सिंचाई',
    pa: 'ਫਲੱਡ ਸਿੰਜਾਈ',
    bn: 'বন্যা সেচ',
    te: 'వరద నీటిపారుదల',
    ta: 'வெள்ள நீர்ப்பாசனம்',
    mr: 'पाट पद्धत',
    gu: 'પુર સિંચાઈ',
    kn: 'ಪ್ರವಾಹ ನೀರಾವರಿ',
    ml: 'പ്രളയ ജലസേചനം',
  },
  drip: {
    en: 'Drip Irrigation',
    hi: 'ड्रिप सिंचाई',
    pa: 'ਡ੍ਰਿਪ ਸਿੰਜਾਈ',
    bn: 'ড্রিপ সেচ',
    te: 'బిందు సేద్యం',
    ta: 'சொட்டு நீர்ப்பாசனம்',
    mr: 'ठिबक सिंचन',
    gu: 'ટપક સિંચાઈ',
    kn: 'ತುಂತುರು ನೀರಾವರಿ',
    ml: 'ഡ്രിപ്പ് ജലസേചനം',
  },
  sprinkler: {
    en: 'Sprinkler Irrigation',
    hi: 'स्प्रिंकलर सिंचाई',
    pa: 'ਸਪ੍ਰਿੰਕਲਰ ਸਿੰਜਾਈ',
    bn: 'স্প্রিঙ্কলার সেচ',
    te: 'స్ప్రింక్లర్ నీటిపారుదల',
    ta: 'தெளிப்பான் நீர்ப்பாசனம்',
    mr: 'तुषार सिंचन',
    gu: 'સ્પ્રિંકલર સિંચાઈ',
    kn: 'ಸಿಂಪರಣೆ ನೀರಾವರಿ',
    ml: 'സ്പ്രിങ്കിളർ ജലസേചനം',
  },
  
  // Fertilizer types
  fertilizerType: {
    en: 'Fertilizer Type',
    hi: 'उर्वरक प्रकार',
    pa: 'ਖਾਦ ਕਿਸਮ',
    bn: 'সার প্রকার',
    te: 'ఎరువు రకం',
    ta: 'உர வகை',
    mr: 'खत प्रकार',
    gu: 'ખાતરનો પ્રકાર',
    kn: 'ರಸಗೊಬ್ಬರ ಪ್ರಕಾರ',
    ml: 'വളം തരം',
  },
  nitrogen: {
    en: 'Nitrogen (N)',
    hi: 'नाइट्रोजन (N)',
    pa: 'ਨਾਈਟ੍ਰੋਜਨ (N)',
    bn: 'নাইট্রোজেন (N)',
    te: 'నత్రజని (N)',
    ta: 'நைட்ரஜன் (N)',
    mr: 'नत्र (N)',
    gu: 'નાઇટ્રોજન (N)',
    kn: 'ಸಾರಜನಕ (N)',
    ml: 'നൈട്രജൻ (N)',
  },
  phosphorus: {
    en: 'Phosphorus (P)',
    hi: 'फास्फोरस (P)',
    pa: 'ਫਾਸਫੋਰਸ (P)',
    bn: 'ফসফরাস (P)',
    te: 'భాస్వరం (P)',
    ta: 'பாஸ்பரஸ் (P)',
    mr: 'स्फुरद (P)',
    gu: 'ફોસ્ફરસ (P)',
    kn: 'ರಂಜಕ (P)',
    ml: 'ഫോസ്ഫറസ് (P)',
  },
  potassium: {
    en: 'Potassium (K)',
    hi: 'पोटैशियम (K)',
    pa: 'ਪੋਟਾਸ਼ੀਅਮ (K)',
    bn: 'পটাশিয়াম (K)',
    te: 'పొటాషియం (K)',
    ta: 'பொட்டாசியம் (K)',
    mr: 'पालाश (K)',
    gu: 'પોટેશિયમ (K)',
    kn: 'ಪೊಟ್ಯಾಶಿಯಮ್ (K)',
    ml: 'പൊട്ടാസ്യം (K)',
  },
  
  // Common agricultural terms
  sowing: {
    en: 'Sowing',
    hi: 'बुवाई',
    pa: 'ਬਿਜਾਈ',
    bn: 'বপন',
    te: 'విత్తనాలు నాటడం',
    ta: 'விதைத்தல்',
    mr: 'पेरणी',
    gu: 'વાવણી',
    kn: 'ಬಿತ್ತನೆ',
    ml: 'വിതയ്ക്കൽ',
  },
  harvesting: {
    en: 'Harvesting',
    hi: 'कटाई',
    pa: 'ਵਾਢੀ',
    bn: 'ফসল কাটা',
    te: 'పంట కోత',
    ta: 'அறுவடை',
    mr: 'कापणी',
    gu: 'લણણી',
    kn: 'ಕೊಯ್ಲು',
    ml: 'കൊയ്ത്ത്',
  },
  irrigation: {
    en: 'Irrigation',
    hi: 'सिंचाई',
    pa: 'ਸਿੰਜਾਈ',
    bn: 'সেচ',
    te: 'నీటి పారుదల',
    ta: 'நீர்ப்பாசனம்',
    mr: 'सिंचन',
    gu: 'સિંચાઈ',
    kn: 'ನೀರಾವರಿ',
    ml: 'ജലസേചനം',
  },
  fertilization: {
    en: 'Fertilization',
    hi: 'उर्वरण',
    pa: 'ਖਾਦ ਪਾਉਣਾ',
    bn: 'সার প্রয়োগ',
    te: 'ఎరువు వేయడం',
    ta: 'உரமிடுதல்',
    mr: 'खत देणे',
    gu: 'ખાતર આપવું',
    kn: 'ಗೊಬ್ಬರ ಹಾಕುವುದು',
    ml: 'വളപ്രയോഗം',
  },
  pestControl: {
    en: 'Pest Control',
    hi: 'कीट नियंत्रण',
    pa: 'ਕੀਟ ਨਿਯੰਤਰਣ',
    bn: 'কীটপতঙ্গ নিয়ন্ত্রণ',
    te: 'పురుగు మందుల నియంత్రణ',
    ta: 'பூச்சி கட்டுப்பாடு',
    mr: 'कीटक नियंत्रण',
    gu: 'જીવાત નિયંત્રણ',
    kn: 'ಕೀಟ ನಿಯಂತ್ರಣ',
    ml: 'കീടനിയന്ത്രണം',
  },
  yield: {
    en: 'Yield',
    hi: 'उपज',
    pa: 'ਝਾੜ',
    bn: 'ফলন',
    te: 'దిగుబడి',
    ta: 'மகசூல்',
    mr: 'उत्पादन',
    gu: 'ઉપજ',
    kn: 'ಇಳುವರಿ',
    ml: 'വിളവ്',
  },
  intercropping: {
    en: 'Intercropping',
    hi: 'अंतर फसल',
    pa: 'ਅੰਤਰ ਫਸਲੀ',
    bn: 'আন্তঃফসল',
    te: 'అంతర పంట',
    ta: 'ஊடுபயிர்',
    mr: 'आंतर पीक',
    gu: 'આંતર પાક',
    kn: 'ಅಂತರ ಬೆಳೆ',
    ml: 'ഇടവിള',
  },
  cropRotation: {
    en: 'Crop Rotation',
    hi: 'फसल चक्र',
    pa: 'ਫਸਲ ਚੱਕਰ',
    bn: 'ফসল আবর্তন',
    te: 'పంట మార్పిడి',
    ta: 'பயிர் சுழற்சி',
    mr: 'पीक फेरपालट',
    gu: 'પાક ફેરબદલી',
    kn: 'ಬೆಳೆ ಪರ್ಯಾಯ',
    ml: 'വിള മാറ്റം',
  },
};

/**
 * Get a translated agriculture term
 * @param key The translation key
 * @returns The translated term
 */
export const getAgricultureTerm = (key: string): string => {
  const language = getLanguage();
  return agricultureTranslations[key]?.[language] || agricultureTranslations[key]?.['en'] || key;
};

/**
 * Get the local name of a crop based on the current language
 * @param crop The crop object
 * @returns The localized crop name
 */
export const getLocalCropName = (crop: Crop): string => {
  const language = getLanguage();
  return crop.localNames[language] || crop.name;
};

/**
 * Get the appropriate crop season based on the current date
 * @returns The current crop season
 */
export const getCurrentCropSeason = (): CropSeason => {
  const indianSeason = getIndianSeason();
  
  switch (indianSeason) {
    case 'monsoon':
      return CropSeason.KHARIF;
    case 'winter':
      return CropSeason.RABI;
    case 'summer':
      return CropSeason.ZAID;
    default:
      return CropSeason.KHARIF; // Default to Kharif
  }
};

/**
 * Get crops suitable for the current season
 * @param crops Array of crop objects
 * @returns Array of crops suitable for the current season
 */
export const getCropsForCurrentSeason = (crops: Crop[]): Crop[] => {
  const currentSeason = getCurrentCropSeason();
  return crops.filter(crop => crop.seasons.includes(currentSeason));
};

/**
 * Calculate water requirement for a crop based on area
 * @param crop The crop object
 * @param areaInHectares Area in hectares
 * @returns Water requirement in cubic meters
 */
export const calculateWaterRequirement = (crop: Crop, areaInHectares: number): number => {
  // Convert mm of water to cubic meters per hectare
  // 1 mm of water over 1 hectare = 10 cubic meters
  return crop.waterRequirementMm * 10 * areaInHectares;
};

/**
 * Calculate fertilizer requirement for a crop based on area
 * @param crop The crop object
 * @param areaInHectares Area in hectares
 * @returns Object containing fertilizer requirements in kg
 */
export const calculateFertilizerRequirement = (crop: Crop, areaInHectares: number): Record<string, number> => {
  const requirements: Record<string, number> = {};
  
  crop.fertilizers.forEach(fertilizer => {
    const fertilizerType = fertilizer.type.toString();
    const amountPerHectare = fertilizer.amountKgPerHectare;
    
    requirements[fertilizerType] = (requirements[fertilizerType] || 0) + (amountPerHectare * areaInHectares);
  });
  
  return requirements;
};

/**
 * Calculate expected yield for a crop based on area
 * @param crop The crop object
 * @param areaInHectares Area in hectares
 * @returns Object containing min and max expected yield with unit
 */
export const calculateExpectedYield = (crop: Crop, areaInHectares: number): { min: number; max: number; unit: string } => {
  return {
    min: crop.yieldPerHectare.min * areaInHectares,
    max: crop.yieldPerHectare.max * areaInHectares,
    unit: crop.yieldPerHectare.unit,
  };
};

/**
 * Calculate expected revenue for a crop based on yield and market value
 * @param crop The crop object
 * @param yieldAmount The yield amount in the crop's yield unit
 * @returns Object containing min and max expected revenue with currency
 */
export const calculateExpectedRevenue = (crop: Crop, yieldAmount: number): { min: number; max: number; currency: string } => {
  // Calculate the yield as a percentage of the maximum yield per hectare
  const yieldRatio = yieldAmount / crop.yieldPerHectare.max;
  
  return {
    min: crop.marketValue.min * yieldRatio,
    max: crop.marketValue.max * yieldRatio,
    currency: crop.marketValue.currency,
  };
};

/**
 * Generate a crop calendar for a specific crop and planting date
 * @param crop The crop object
 * @param plantingDate The planting date
 * @returns Array of crop calendar events
 */
export const generateCropCalendar = (crop: Crop, plantingDate: Date): CropCalendarEvent[] => {
  const events: CropCalendarEvent[] = [];
  
  // Add sowing event
  events.push({
    cropId: crop.id,
    eventType: 'sowing',
    title: `${getAgricultureTerm('sowing')} - ${getLocalCropName(crop)}`,
    description: `${getAgricultureTerm('sowing')} ${getLocalCropName(crop)}`,
    startDate: new Date(plantingDate),
  });
  
  // Add irrigation events (simplified example)
  // In a real implementation, this would be based on crop-specific data
  const irrigationIntervalDays = 7; // Weekly irrigation
  for (let day = irrigationIntervalDays; day < crop.durationDays; day += irrigationIntervalDays) {
    const irrigationDate = new Date(plantingDate);
    irrigationDate.setDate(plantingDate.getDate() + day);
    
    events.push({
      cropId: crop.id,
      eventType: 'irrigation',
      title: `${getAgricultureTerm('irrigation')} - ${getLocalCropName(crop)}`,
      description: `${getAgricultureTerm('irrigation')} ${getLocalCropName(crop)}`,
      startDate: irrigationDate,
    });
  }
  
  // Add fertilization events (simplified example)
  // In a real implementation, this would be based on crop-specific data
  const fertilizationDays = [15, 45, 75]; // Days after sowing
  fertilizationDays.forEach(day => {
    if (day < crop.durationDays) {
      const fertilizationDate = new Date(plantingDate);
      fertilizationDate.setDate(plantingDate.getDate() + day);
      
      events.push({
        cropId: crop.id,
        eventType: 'fertilization',
        title: `${getAgricultureTerm('fertilization')} - ${getLocalCropName(crop)}`,
        description: `${getAgricultureTerm('fertilization')} ${getLocalCropName(crop)}`,
        startDate: fertilizationDate,
      });
    }
  });
  
  // Add pest control events (simplified example)
  // In a real implementation, this would be based on crop-specific data
  const pestControlDays = [30, 60]; // Days after sowing
  pestControlDays.forEach(day => {
    if (day < crop.durationDays) {
      const pestControlDate = new Date(plantingDate);
      pestControlDate.setDate(plantingDate.getDate() + day);
      
      events.push({
        cropId: crop.id,
        eventType: 'pestControl',
        title: `${getAgricultureTerm('pestControl')} - ${getLocalCropName(crop)}`,
        description: `${getAgricultureTerm('pestControl')} ${getLocalCropName(crop)}`,
        startDate: pestControlDate,
      });
    }
  });
  
  // Add harvesting event
  const harvestDate = new Date(plantingDate);
  harvestDate.setDate(plantingDate.getDate() + crop.durationDays);
  
  events.push({
    cropId: crop.id,
    eventType: 'harvesting',
    title: `${getAgricultureTerm('harvesting')} - ${getLocalCropName(crop)}`,
    description: `${getAgricultureTerm('harvesting')} ${getLocalCropName(crop)}`,
    startDate: harvestDate,
  });
  
  return events;
};

/**
 * Get fertilizer recommendations based on soil test results and crop
 * @param crop The crop object
 * @param soilTest The soil test results
 * @returns Fertilizer recommendations
 */
export const getFertilizerRecommendations = (crop: Crop, soilTest: SoilTestResult): FertilizerRecommendation => {
  // This is a simplified example
  // In a real implementation, this would use more complex calculations based on soil science
  
  // Calculate nitrogen requirement
  let nitrogenReq = 0;
  if (soilTest.nitrogen < 280) {
    nitrogenReq = 120; // High requirement
  } else if (soilTest.nitrogen < 560) {
    nitrogenReq = 80; // Medium requirement
  } else {
    nitrogenReq = 40; // Low requirement
  }
  
  // Calculate phosphorus requirement
  let phosphorusReq = 0;
  if (soilTest.phosphorus < 10) {
    phosphorusReq = 80; // High requirement
  } else if (soilTest.phosphorus < 25) {
    phosphorusReq = 50; // Medium requirement
  } else {
    phosphorusReq = 20; // Low requirement
  }
  
  // Calculate potassium requirement
  let potassiumReq = 0;
  if (soilTest.potassium < 120) {
    potassiumReq = 80; // High requirement
  } else if (soilTest.potassium < 280) {
    potassiumReq = 50; // Medium requirement
  } else {
    potassiumReq = 20; // Low requirement
  }
  
  // Adjust based on crop type
  if (crop.type === CropType.CEREAL) {
    nitrogenReq *= 1.2;
  } else if (crop.type === CropType.PULSE) {
    nitrogenReq *= 0.5; // Pulses fix nitrogen
  } else if (crop.type === CropType.VEGETABLE) {
    potassiumReq *= 1.3;
  }
  
  // Application schedule
  const applicationSchedule = [
    { timing: 'At sowing', percentage: 30 },
    { timing: '30 days after sowing', percentage: 40 },
    { timing: '60 days after sowing', percentage: 30 },
  ];
  
  // Organic options
  const organicOptions = [
    'Farmyard Manure (FYM)',
    'Compost',
    'Vermicompost',
    'Green Manure',
    'Neem Cake',
  ];
  
  return {
    cropId: crop.id,
    nitrogen: Math.round(nitrogenReq),
    phosphorus: Math.round(phosphorusReq),
    potassium: Math.round(potassiumReq),
    organicOptions,
    applicationSchedule,
    notes: 'Adjust application based on rainfall and irrigation schedule.',
  };
};

/**
 * Generate an irrigation schedule for a crop
 * @param crop The crop object
 * @param soilType The soil type
 * @param rainfallExpected Expected rainfall in mm during the growing period
 * @returns Irrigation schedule
 */
export const generateIrrigationSchedule = (
  crop: Crop,
  soilType: SoilType,
  rainfallExpected: number
): IrrigationSchedule => {
  // Determine the best irrigation method based on crop and soil type
  let method = IrrigationMethod.FLOOD; // Default
  
  if (crop.irrigationMethods.includes(IrrigationMethod.DRIP)) {
    method = IrrigationMethod.DRIP;
  } else if (crop.irrigationMethods.includes(IrrigationMethod.SPRINKLER)) {
    method = IrrigationMethod.SPRINKLER;
  }
  
  // Calculate water requirement
  const totalWaterRequirement = crop.waterRequirementMm;
  
  // Adjust for expected rainfall
  const adjustedWaterRequirement = Math.max(0, totalWaterRequirement - rainfallExpected);
  
  // Adjust for irrigation method efficiency
  let efficiencyFactor = 1.0;
  switch (method) {
    case IrrigationMethod.DRIP:
      efficiencyFactor = 0.9; // 90% efficient
      break;
    case IrrigationMethod.SPRINKLER:
      efficiencyFactor = 0.75; // 75% efficient
      break;
    case IrrigationMethod.FLOOD:
    default:
      efficiencyFactor = 0.5; // 50% efficient
      break;
  }
  
  const waterRequirementWithEfficiency = adjustedWaterRequirement / efficiencyFactor;
  
  // Create irrigation stages
  // This is a simplified example - in reality, different crops have different water needs at different growth stages
  const schedule = [
    {
      stageName: 'Germination',
      daysFromSowing: 0,
      waterAmount: Math.round(waterRequirementWithEfficiency * 0.15),
      frequency: 2, // Every 2 days
    },
    {
      stageName: 'Vegetative Growth',
      daysFromSowing: 15,
      waterAmount: Math.round(waterRequirementWithEfficiency * 0.3),
      frequency: 5, // Every 5 days
    },
    {
      stageName: 'Flowering',
      daysFromSowing: 45,
      waterAmount: Math.round(waterRequirementWithEfficiency * 0.35),
      frequency: 4, // Every 4 days
    },
    {
      stageName: 'Fruit Development',
      daysFromSowing: 75,
      waterAmount: Math.round(waterRequirementWithEfficiency * 0.2),
      frequency: 6, // Every 6 days
    },
  ];
  
  // Adjustments based on soil type
  const adjustments = [];
  
  switch (soilType) {
    case SoilType.SANDY:
      adjustments.push({
        condition: 'Sandy soil - increase frequency, reduce amount per irrigation',
        adjustment: 1.2, // 20% more frequent irrigation
      });
      break;
    case SoilType.CLAY:
      adjustments.push({
        condition: 'Clay soil - decrease frequency, increase amount per irrigation',
        adjustment: 0.8, // 20% less frequent irrigation
      });
      break;
    case SoilType.LOAMY:
      adjustments.push({
        condition: 'Loamy soil - optimal water retention',
        adjustment: 1.0, // No adjustment needed
      });
      break;
    default:
      // No adjustments for other soil types
      break;
  }
  
  return {
    cropId: crop.id,
    method,
    totalWaterRequirement: Math.round(waterRequirementWithEfficiency),
    schedule,
    adjustments,
  };
};

/**
 * Predict crop yield based on various factors
 * @param crop The crop object
 * @param soilTest The soil test results
 * @param rainfall Rainfall in mm during the growing period
 * @param temperature Average temperature during the growing period
 * @param pestIncidence Level of pest incidence (0-1, where 0 is none and 1 is severe)
 * @param areaInHectares Area in hectares
 * @returns Yield prediction
 */
export const predictCropYield = (
  crop: Crop,
  soilTest: SoilTestResult,
  rainfall: number,
  temperature: number,
  pestIncidence: number,
  areaInHectares: number
): YieldPrediction => {
  // This is a simplified yield prediction model
  // In a real implementation, this would use more complex statistical or machine learning models
  
  // Start with the average yield potential
  const baseYield = (crop.yieldPerHectare.min + crop.yieldPerHectare.max) / 2;
  
  // Calculate factors that affect yield
  const factors = [];
  let yieldMultiplier = 1.0;
  
  // Soil fertility factor
  let soilFertilityImpact = 0;
  if (soilTest.ph >= crop.idealPhRange.min && soilTest.ph <= crop.idealPhRange.max) {
    soilFertilityImpact = 0.1; // 10% boost for optimal pH
    factors.push({
      factor: 'Optimal soil pH',
      impact: 'positive',
      magnitude: 0.1,
    });
  } else {
    soilFertilityImpact = -0.15; // 15% reduction for non-optimal pH
    factors.push({
      factor: 'Non-optimal soil pH',
      impact: 'negative',
      magnitude: 0.15,
    });
  }
  
  // Nutrient levels
  let nutrientImpact = 0;
  if (soilTest.nitrogen < 280) {
    nutrientImpact -= 0.1;
    factors.push({
      factor: 'Low nitrogen',
      impact: 'negative',
      magnitude: 0.1,
    });
  }
  
  if (soilTest.phosphorus < 10) {
    nutrientImpact -= 0.1;
    factors.push({
      factor: 'Low phosphorus',
      impact: 'negative',
      magnitude: 0.1,
    });
  }
  
  if (soilTest.potassium < 120) {
    nutrientImpact -= 0.1;
    factors.push({
      factor: 'Low potassium',
      impact: 'negative',
      magnitude: 0.1,
    });
  }
  
  // Rainfall factor
  let rainfallImpact = 0;
  if (rainfall >= crop.idealRainfallRange.min && rainfall <= crop.idealRainfallRange.max) {
    rainfallImpact = 0.15; // 15% boost for optimal rainfall
    factors.push({
      factor: 'Optimal rainfall',
      impact: 'positive',
      magnitude: 0.15,
    });
  } else if (rainfall < crop.idealRainfallRange.min) {
    // Too little rain
    const deficit = (crop.idealRainfallRange.min - rainfall) / crop.idealRainfallRange.min;
    rainfallImpact = -0.2 * deficit;
    factors.push({
      factor: 'Insufficient rainfall',
      impact: 'negative',
      magnitude: 0.2 * deficit,
    });
  } else {
    // Too much rain
    const excess = (rainfall - crop.idealRainfallRange.max) / crop.idealRainfallRange.max;
    rainfallImpact = -0.15 * excess;
    factors.push({
      factor: 'Excessive rainfall',
      impact: 'negative',
      magnitude: 0.15 * excess,
    });
  }
  
  // Temperature factor
  let temperatureImpact = 0;
  if (temperature >= crop.idealTemperatureRange.min && temperature <= crop.idealTemperatureRange.max) {
    temperatureImpact = 0.1; // 10% boost for optimal temperature
    factors.push({
      factor: 'Optimal temperature',
      impact: 'positive',
      magnitude: 0.1,
    });
  } else {
    // Temperature stress
    const tempStress = Math.min(
      Math.abs(temperature - crop.idealTemperatureRange.min),
      Math.abs(temperature - crop.idealTemperatureRange.max)
    ) / 10; // Normalize by 10 degrees
    temperatureImpact = -0.15 * tempStress;
    factors.push({
      factor: 'Temperature stress',
      impact: 'negative',
      magnitude: 0.15 * tempStress,
    });
  }
  
  // Pest incidence factor
  const pestImpact = -0.3 * pestIncidence; // Up to 30% reduction for severe pest incidence
  if (pestIncidence > 0) {
    factors.push({
      factor: 'Pest damage',
      impact: 'negative',
      magnitude: 0.3 * pestIncidence,
    });
  }
  
  // Calculate final yield multiplier
  yieldMultiplier += soilFertilityImpact + nutrientImpact + rainfallImpact + temperatureImpact + pestImpact;
  
  // Ensure multiplier is not negative
  yieldMultiplier = Math.max(0.1, yieldMultiplier);
  
  // Calculate predicted yield
  const predictedYield = baseYield * yieldMultiplier * areaInHectares;
  
  // Calculate confidence based on the number and magnitude of factors
  const totalFactorMagnitude = factors.reduce((sum, factor) => sum + factor.magnitude, 0);
  const confidence = Math.max(0.5, 1 - (totalFactorMagnitude / 2));
  
  return {
    cropId: crop.id,
    predictedYield: Math.round(predictedYield * 100) / 100, // Round to 2 decimal places
    yieldUnit: crop.yieldPerHectare.unit,
    confidence: Math.round(confidence * 100) / 100, // Round to 2 decimal places
    factors,
  };
};

/**
 * Get crop recommendations based on soil, climate, and other factors
 * @param soilType The soil type
 * @param season The crop season
 * @param averageRainfall Average rainfall in mm
 * @param averageTemperature Average temperature in Celsius
 * @param crops Array of available crops
 * @returns Array of recommended crops with suitability scores
 */
export const getCropRecommendations = (
  soilType: SoilType,
  season: CropSeason,
  averageRainfall: number,
  averageTemperature: number,
  crops: Crop[]
): { crop: Crop; suitabilityScore: number }[] => {
  const recommendations = crops
    .filter(crop => crop.seasons.includes(season) && crop.soilTypes.includes(soilType))
    .map(crop => {
      let suitabilityScore = 0.5; // Start with a base score
      
      // Check rainfall suitability
      if (averageRainfall >= crop.idealRainfallRange.min && averageRainfall <= crop.idealRainfallRange.max) {
        suitabilityScore += 0.25; // Perfect rainfall match
      } else {
        // Calculate how far outside the ideal range
        const rainDiff = Math.min(
          Math.abs(averageRainfall - crop.idealRainfallRange.min),
          Math.abs(averageRainfall - crop.idealRainfallRange.max)
        ) / crop.idealRainfallRange.max;
        
        suitabilityScore -= Math.min(0.25, rainDiff); // Reduce score based on difference
      }
      
      // Check temperature suitability
      if (averageTemperature >= crop.idealTemperatureRange.min && averageTemperature <= crop.idealTemperatureRange.max) {
        suitabilityScore += 0.25; // Perfect temperature match
      } else {
        // Calculate how far outside the ideal range
        const tempDiff = Math.min(
          Math.abs(averageTemperature - crop.idealTemperatureRange.min),
          Math.abs(averageTemperature - crop.idealTemperatureRange.max)
        ) / 10; // Normalize by 10 degrees
        
        suitabilityScore -= Math.min(0.25, tempDiff); // Reduce score based on difference
      }
      
      return {
        crop,
        suitabilityScore: Math.max(0, Math.min(1, suitabilityScore)), // Ensure score is between 0 and 1
      };
    });
  
  // Sort by suitability score (highest first)
  return recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
};

/**
 * Calculate the cost of cultivation for a crop
 * @param crop The crop object
 * @param areaInHectares Area in hectares
 * @param laborCostPerDay Labor cost per day
 * @param fertilizerCostPerKg Fertilizer cost per kg
 * @param seedCostPerKg Seed cost per kg
 * @param otherCosts Other costs (irrigation, pesticides, etc.)
 * @returns Total cost of cultivation
 */
export const calculateCostOfCultivation = (
  crop: Crop,
  areaInHectares: number,
  laborCostPerDay: number,
  fertilizerCostPerKg: number,
  seedCostPerKg: number,
  otherCosts: number
): number => {
  // Simplified calculation - in reality, this would be more detailed
  
  // Labor cost (assume 30 days of labor per hectare)
  const laborCost = 30 * laborCostPerDay * areaInHectares;
  
  // Fertilizer cost
  const fertilizerRequirements = calculateFertilizerRequirement(crop, areaInHectares);
  const totalFertilizerKg = Object.values(fertilizerRequirements).reduce((sum, amount) => sum + amount, 0);
  const fertilizerCost = totalFertilizerKg * fertilizerCostPerKg;
  
  // Seed cost (assume 25 kg of seed per hectare)
  const seedCost = 25 * seedCostPerKg * areaInHectares;
  
  // Total cost
  return laborCost + fertilizerCost + seedCost + otherCosts;
};

/**
 * Calculate the profit margin for a crop
 * @param crop The crop object
 * @param yieldAmount The yield amount in the crop's yield unit
 * @param cultivationCost The cost of cultivation
 * @returns Profit margin as a percentage
 */
export const calculateProfitMargin = (
  crop: Crop,
  yieldAmount: number,
  cultivationCost: number
): number => {
  const revenue = calculateExpectedRevenue(crop, yieldAmount);
  const averageRevenue = (revenue.min + revenue.max) / 2;
  
  const profit = averageRevenue - cultivationCost;
  const profitMargin = (profit / averageRevenue) * 100;
  
  return Math.round(profitMargin * 10) / 10; // Round to 1 decimal place
};

/**
 * Check if a crop is suitable for intercropping with another crop
 * @param crop1 The first crop
 * @param crop2 The second crop
 * @returns Boolean indicating if the crops are suitable for intercropping
 */
export const areCropsSuitableForIntercropping = (crop1: Crop, crop2: Crop): boolean => {
  // Check if either crop lists the other as a recommended intercrop
  return crop1.intercropping.includes(crop2.id) || crop2.intercropping.includes(crop1.id);
};

/**
 * Get recommended crop rotation sequence
 * @param currentCrop The current crop
 * @param availableCrops Array of available crops
 * @returns Array of recommended crops for rotation
 */
export const getRecommendedCropRotation = (currentCrop: Crop, availableCrops: Crop[]): Crop[] => {
  // Filter crops based on rotation recommendations
  return availableCrops.filter(crop => 
    currentCrop.rotationRecommendations.includes(crop.id) && crop.id !== currentCrop.id
  );
};

/**
 * Format soil test results for display
 * @param soilTest The soil test results
 * @returns Formatted soil test results as string
 */
export const formatSoilTestResults = (soilTest: SoilTestResult): string => {
  const language = getLanguage();
  const dateStr = formatDate(soilTest.date);
  
  let result = `${dateStr}\n`;
  result += `pH: ${soilTest.ph}\n`;
  result += `${getAgricultureTerm('nitrogen')}: ${soilTest.nitrogen} kg/ha\n`;
  result += `${getAgricultureTerm('phosphorus')}: ${soilTest.phosphorus} kg/ha\n`;
  result += `${getAgricultureTerm('potassium')}: ${soilTest.potassium} kg/ha\n`;
  
  if (soilTest.texture) {
    result += `${getAgricultureTerm('soilType')}: ${getAgricultureTerm(soilTest.texture)}\n`;
  }
  
  return result;
};

/**
 * Format fertilizer recommendations for display
 * @param recommendation The fertilizer recommendation
 * @returns Formatted fertilizer recommendation as string
 */
export const formatFertilizerRecommendation = (recommendation: FertilizerRecommendation): string => {
  let result = `${getAgricultureTerm('nitrogen')}: ${recommendation.nitrogen} kg/ha\n`;
  result += `${getAgricultureTerm('phosphorus')}: ${recommendation.phosphorus} kg/ha\n`;
  result += `${getAgricultureTerm('potassium')}: ${recommendation.potassium} kg/ha\n\n`;
  
  result += `${getAgricultureTerm('applicationSchedule')}:\n`;
  recommendation.applicationSchedule.forEach(schedule => {
    result += `- ${schedule.timing}: ${schedule.percentage}%\n`;
  });
  
  if (recommendation.organicOptions && recommendation.organicOptions.length > 0) {
    result += `\n${getAgricultureTerm('organicOptions')}:\n`;
    recommendation.organicOptions.forEach(option => {
      result += `- ${option}\n`;
    });
  }
  
  if (recommendation.notes) {
    result += `\n${recommendation.notes}`;
  }
  
  return result;
};

/**
 * Format irrigation schedule for display
 * @param schedule The irrigation schedule
 * @returns Formatted irrigation schedule as string
 */
export const formatIrrigationSchedule = (schedule: IrrigationSchedule): string => {
  let result = `${getAgricultureTerm('irrigationMethod')}: ${getAgricultureTerm(schedule.method)}\n`;
  result += `${getAgricultureTerm('totalWaterRequirement')}: ${schedule.totalWaterRequirement} mm\n\n`;
  
  result += `${getAgricultureTerm('schedule')}:\n`;
  schedule.schedule.forEach(stage => {
    result += `- ${stage.stageName} (${getAgricultureTerm('daysFromSowing')}: ${stage.daysFromSowing}):\n`;
    result += `  ${getAgricultureTerm('waterAmount')}: ${stage.waterAmount} mm\n`;
    result += `  ${getAgricultureTerm('frequency')}: ${getAgricultureTerm('every')} ${stage.frequency} ${getAgricultureTerm('days')}\n`;
  });
  
  if (schedule.adjustments && schedule.adjustments.length > 0) {
    result += `\n${getAgricultureTerm('adjustments')}:\n`;
    schedule.adjustments.forEach(adjustment => {
      result += `- ${adjustment.condition}\n`;
    });
  }
  
  return result;
};

/**
 * Format yield prediction for display
 * @param prediction The yield prediction
 * @returns Formatted yield prediction as string
 */
export const formatYieldPrediction = (prediction: YieldPrediction): string => {
  let result = `${getAgricultureTerm('predictedYield')}: ${prediction.predictedYield} ${prediction.yieldUnit}\n`;
  result += `${getAgricultureTerm('confidence')}: ${Math.round(prediction.confidence * 100)}%\n\n`;
  
  result += `${getAgricultureTerm('factors')}:\n`;
  prediction.factors.forEach(factor => {
    const impactSymbol = factor.impact === 'positive' ? '↑' : factor.impact === 'negative' ? '↓' : '→';
    result += `- ${factor.factor} ${impactSymbol} (${Math.round(factor.magnitude * 100)}%)\n`;
  });
  
  return result;
};

/**
 * Format crop calendar for display
 * @param events Array of crop calendar events
 * @returns Formatted crop calendar as string
 */
export const formatCropCalendar = (events: CropCalendarEvent[]): string => {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  
  let result = '';
  sortedEvents.forEach(event => {
    const dateStr = formatDate(event.startDate);
    const completedStr = event.completed ? `[${getAgricultureTerm('completed')}]` : '';
    result += `${dateStr}: ${event.title} ${completedStr}\n`;
    result += `  ${event.description}\n`;
  });
  
  return result;
};

/**
 * Check if a crop is suitable for a given soil pH
 * @param crop The crop object
 * @param soilPh The soil pH value
 * @returns Boolean indicating if the crop is suitable for the soil pH
 */
export const isCropSuitableForSoilPh = (crop: Crop, soilPh: number): boolean => {
  return soilPh >= crop.idealPhRange.min && soilPh <= crop.idealPhRange.max;
};

/**
 * Get common pests for a crop with management recommendations
 * @param crop The crop object
 * @returns Array of pest information with management recommendations
 */
export const getCropPestManagement = (crop: Crop): { name: string; type: PestType; symptoms: string; management: string }[] => {
  return crop.commonPests;
};

/**
 * Calculate the carbon footprint of crop cultivation
 * @param crop The crop object
 * @param areaInHectares Area in hectares
 * @param useOrganicFertilizer Whether organic fertilizer is used
 * @param mechanizedFarming Whether mechanized farming is used
 * @returns Carbon footprint in kg CO2 equivalent
 */
export const calculateCarbonFootprint = (
  crop: Crop,
  areaInHectares: number,
  useOrganicFertilizer: boolean,
  mechanizedFarming: boolean
): number => {
  // This is a simplified calculation - in reality, this would be more complex
  
  // Base carbon footprint per hectare (varies by crop type)
  let baseCarbonFootprint = 1000; // kg CO2 equivalent per hectare
  
  switch (crop.type) {
    case CropType.CEREAL:
      baseCarbonFootprint = 1500;
      break;
    case CropType.PULSE:
      baseCarbonFootprint = 800; // Pulses fix nitrogen, lower footprint
      break;
    case CropType.VEGETABLE:
      baseCarbonFootprint = 1200;
      break;
    case CropType.FRUIT:
      baseCarbonFootprint = 1000;
      break;
    default:
      baseCarbonFootprint = 1000;
  }
  
  // Adjust for fertilizer type
  const fertilizerFactor = useOrganicFertilizer ? 0.7 : 1.2; // Organic fertilizer reduces footprint
  
  // Adjust for farming practices
  const farmingPracticeFactor = mechanizedFarming ? 1.3 : 0.9; // Mechanized farming increases footprint
  
  // Calculate total carbon footprint
  return Math.round(baseCarbonFootprint * areaInHectares * fertilizerFactor * farmingPracticeFactor);
};

/**
 * Calculate water use efficiency for a crop
 * @param crop The crop object
 * @param yieldAmount The yield amount in the crop's yield unit
 * @param waterUsed Total water used in cubic meters
 * @returns Water use efficiency (yield per cubic meter of water)
 */
export const calculateWaterUseEfficiency = (
  crop: Crop,
  yieldAmount: number,
  waterUsed: number
): number => {
  // Water use efficiency = yield / water used
  return Math.round((yieldAmount / waterUsed) * 100) / 100; // Round to 2 decimal places
};

/**
 * Initialize agriculture utilities
 */
export const initAgricultureUtils = (): void => {
  try {
    // Initialize any required resources or data
    console.log('Agriculture utilities initialized');
  } catch (error) {
    logError({
      category: ErrorCategory.INITIALIZATION,
      severity: ErrorSeverity.ERROR,
      message: 'Failed to initialize agriculture utilities',
      error: error as Error,
    });
  }
};