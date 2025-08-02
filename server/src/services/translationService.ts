import { Translate } from '@google-cloud/translate/build/src/v2';
import logger from '../utils/logger';

// Initialize Google Translate
const translate = new Translate({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
});

// Language mappings
const languageMap: Record<string, string> = {
  'en': 'en',
  'hi': 'hi',
  'pa': 'pa',
  'bn': 'bn',
  'te': 'te',
  'ta': 'ta',
  'mr': 'mr',
  'gu': 'gu',
  'kn': 'kn',
  'ml': 'ml'
};

// Fallback translations for common agricultural terms
const fallbackTranslations: Record<string, Record<string, string>> = {
  'weather': {
    'hi': 'मौसम',
    'pa': 'ਮੌਸਮ',
    'bn': 'আবহাওয়া',
    'te': 'వాతావరణం',
    'ta': 'வானிலை',
    'mr': 'हवामान',
    'gu': 'હવામાન',
    'kn': 'ಹವಾಮಾನ',
    'ml': 'കാലാവസ്ഥ'
  },
  'crop': {
    'hi': 'फसल',
    'pa': 'ਫਸਲ',
    'bn': 'ফসল',
    'te': 'పంట',
    'ta': 'பயிர்',
    'mr': 'पीक',
    'gu': 'પાક',
    'kn': 'ಬೆಳೆ',
    'ml': 'വിള'
  },
  'irrigation': {
    'hi': 'सिंचाई',
    'pa': 'ਸਿੰਜਾਈ',
    'bn': 'সেচ',
    'te': 'నీటిపారుదల',
    'ta': 'நீர்ப்பாசனம்',
    'mr': 'सिंचन',
    'gu': 'સિંચાઈ',
    'kn': 'ನೀರಾವರಿ',
    'ml': 'ജലസേചനം'
  },
  'fertilizer': {
    'hi': 'उर्वरक',
    'pa': 'ਖਾਦ',
    'bn': 'সার',
    'te': 'ఎరువు',
    'ta': 'உரம்',
    'mr': 'खत',
    'gu': 'ખાતર',
    'kn': 'ಗೊಬ್ಬರ',
    'ml': 'വളം'
  },
  'pest': {
    'hi': 'कीट',
    'pa': 'ਕੀਟ',
    'bn': 'কীটপতঙ্গ',
    'te': 'కీటకాలు',
    'ta': 'பூச்சி',
    'mr': 'कीटक',
    'gu': 'જીવાત',
    'kn': 'ಕೀಟ',
    'ml': 'കീടം'
  },
  'soil': {
    'hi': 'मिट्टी',
    'pa': 'ਮਿੱਟੀ',
    'bn': 'মাটি',
    'te': 'మట్టి',
    'ta': 'மண்',
    'mr': 'माती',
    'gu': 'માટી',
    'kn': 'ಮಣ್ಣು',
    'ml': 'മണ്ണ്'
  },
  'farmer': {
    'hi': 'किसान',
    'pa': 'ਕਿਸਾਨ',
    'bn': 'কৃষক',
    'te': 'రైతు',
    'ta': 'விவசாயி',
    'mr': 'शेतकरी',
    'gu': 'ખેડૂત',
    'kn': 'ರೈತ',
    'ml': 'കർഷകൻ'
  }
};

/**
 * Translate text from one language to another
 */
export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  try {
    // If source and target are the same, return original text
    if (sourceLanguage === targetLanguage) {
      return text;
    }

    // Map language codes
    const sourceLang = languageMap[sourceLanguage] || sourceLanguage;
    const targetLang = languageMap[targetLanguage] || targetLanguage;

    // Try Google Translate first
    if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_CLOUD_KEY_FILE) {
      const [translation] = await translate.translate(text, {
        from: sourceLang,
        to: targetLang
      });
      
      return translation;
    }

    // Fallback to simple word replacement for common terms
    let translatedText = text;
    
    Object.entries(fallbackTranslations).forEach(([englishTerm, translations]) => {
      if (sourceLanguage === 'en' && translations[targetLanguage]) {
        const regex = new RegExp(`\\b${englishTerm}\\b`, 'gi');
        translatedText = translatedText.replace(regex, translations[targetLanguage]);
      } else if (targetLanguage === 'en' && translations[sourceLanguage]) {
        const regex = new RegExp(`\\b${translations[sourceLanguage]}\\b`, 'gi');
        translatedText = translatedText.replace(regex, englishTerm);
      }
    });

    return translatedText;
  } catch (error) {
    logger.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

/**
 * Detect language of text
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_CLOUD_KEY_FILE) {
      const [detection] = await translate.detect(text);
      return Array.isArray(detection) ? detection[0].language : detection.language;
    }

    // Simple fallback language detection based on script
    const hindiRegex = /[\u0900-\u097F]/;
    const bengaliRegex = /[\u0980-\u09FF]/;
    const teluguRegex = /[\u0C00-\u0C7F]/;
    const tamilRegex = /[\u0B80-\u0BFF]/;
    const gujaratiRegex = /[\u0A80-\u0AFF]/;
    const kannadaRegex = /[\u0C80-\u0CFF]/;
    const malayalamRegex = /[\u0D00-\u0D7F]/;
    const punjabiRegex = /[\u0A00-\u0A7F]/;

    if (hindiRegex.test(text)) return 'hi';
    if (bengaliRegex.test(text)) return 'bn';
    if (teluguRegex.test(text)) return 'te';
    if (tamilRegex.test(text)) return 'ta';
    if (gujaratiRegex.test(text)) return 'gu';
    if (kannadaRegex.test(text)) return 'kn';
    if (malayalamRegex.test(text)) return 'ml';
    if (punjabiRegex.test(text)) return 'pa';

    return 'en'; // Default to English
  } catch (error) {
    logger.error('Language detection error:', error);
    return 'en';
  }
}

/**
 * Translate agricultural terms with context
 */
export async function translateAgriculturalTerms(
  terms: string[],
  sourceLanguage: string,
  targetLanguage: string
): Promise<Record<string, string>> {
  const translations: Record<string, string> = {};

  for (const term of terms) {
    try {
      translations[term] = await translateText(term, sourceLanguage, targetLanguage);
    } catch (error) {
      logger.error(`Error translating term "${term}":`, error);
      translations[term] = term; // Keep original if translation fails
    }
  }

  return translations;
}

/**
 * Get supported languages
 */
export function getSupportedLanguages(): Record<string, string> {
  return {
    'en': 'English',
    'hi': 'हिंदी (Hindi)',
    'pa': 'ਪੰਜਾਬੀ (Punjabi)',
    'bn': 'বাংলা (Bengali)',
    'te': 'తెలుగు (Telugu)',
    'ta': 'தமிழ் (Tamil)',
    'mr': 'मराठी (Marathi)',
    'gu': 'ગુજરાતી (Gujarati)',
    'kn': 'ಕನ್ನಡ (Kannada)',
    'ml': 'മലയാളം (Malayalam)'
  };
}

/**
 * Check if language is supported
 */
export function isLanguageSupported(language: string): boolean {
  return language in languageMap;
}