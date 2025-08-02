// Utilities for sharing functionality

import { logError, ErrorCategory, ErrorSeverity } from './errorUtils';
import { trackEvent, EventCategory, EventAction } from './analyticsUtils';
import { getLanguage } from './languageUtils';
import { isOnline } from './offlineUtils';

// Share content types
export enum ShareContentType {
  WEATHER = 'weather',
  CROP = 'crop',
  FINANCE = 'finance',
  ADVISORY = 'advisory',
  LOCATION = 'location',
  CUSTOM = 'custom',
}

// Share method types
export enum ShareMethod {
  NATIVE = 'native',
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
  EMAIL = 'email',
  COPY = 'copy',
  QR = 'qr',
  PRINT = 'print',
  DOWNLOAD = 'download',
}

// Share content interface
export interface ShareContent {
  type: ShareContentType;
  title: string;
  text: string;
  url?: string;
  imageUrl?: string;
  file?: File;
  data?: any;
}

// Translations for share messages
const shareTranslations: Record<string, Record<string, string>> = {
  shareWeather: {
    en: 'Check out the weather forecast for {location}: {summary}. View more details on KrishiMitra app.',
    hi: '{location} के लिए मौसम का पूर्वानुमान देखें: {summary}। कृषिमित्र ऐप पर अधिक जानकारी देखें।',
    pa: '{location} ਲਈ ਮੌਸਮ ਦਾ ਪੂਰਵਾਨੁਮਾਨ ਵੇਖੋ: {summary}। ਕ੍ਰਿਸ਼ੀਮਿਤਰ ਐਪ 'ਤੇ ਹੋਰ ਜਾਣਕਾਰੀ ਵੇਖੋ।',
    bn: '{location} এর জন্য আবহাওয়ার পূর্বাভাস দেখুন: {summary}। কৃষিমিত্র অ্যাপে আরও বিবরণ দেখুন।',
    te: '{location} కోసం వాతావరణ సూచన చూడండి: {summary}. కృషిమిత్ర యాప్‌లో మరిన్ని వివరాలను వీక్షించండి.',
    ta: '{location} க்கான வானிலை முன்னறிவிப்பைப் பார்க்கவும்: {summary}. கிருஷிமித்ரா பயன்பாட்டில் மேலும் விவரங்களைக் காணலாம்.',
    mr: '{location} साठी हवामान अंदाज तपासा: {summary}. कृषिमित्र अॅपवर अधिक तपशील पहा.',
    gu: '{location} માટે હવામાન આગાહી તપાસો: {summary}. કૃષિમિત્ર એપ પર વધુ વિગતો જુઓ.',
    kn: '{location} ಗಾಗಿ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಯನ್ನು ಪರಿಶೀಲಿಸಿ: {summary}. ಕೃಷಿಮಿತ್ರ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಹೆಚ್ಚಿನ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ.',
    ml: '{location} എന്നതിനുള്ള കാലാവസ്ഥാ പ്രവചനം പരിശോധിക്കുക: {summary}. കൃഷിമിത്ര ആപ്പിൽ കൂടുതൽ വിശദാംശങ്ങൾ കാണുക.',
  },
  shareCrop: {
    en: 'Learn about {cropName}: {summary}. Get cultivation tips, market info, and more on KrishiMitra app.',
    hi: '{cropName} के बारे में जानें: {summary}। कृषिमित्र ऐप पर खेती के टिप्स, बाजार की जानकारी और अधिक प्राप्त करें।',
    pa: '{cropName} ਬਾਰੇ ਜਾਣੋ: {summary}। ਕ੍ਰਿਸ਼ੀਮਿਤਰ ਐਪ 'ਤੇ ਖੇਤੀ ਦੇ ਨੁਕਤੇ, ਮਾਰਕੀਟ ਜਾਣਕਾਰੀ, ਅਤੇ ਹੋਰ ਪ੍ਰਾਪਤ ਕਰੋ।',
    bn: '{cropName} সম্পর্কে জানুন: {summary}। কৃষিমিত্র অ্যাপে চাষের টিপস, বাজার তথ্য, এবং আরও অনেক কিছু পান।',
    te: '{cropName} గురించి తెలుసుకోండి: {summary}. కృషిమిత్ర యాప్‌లో సాగు చిట్కాలు, మార్కెట్ సమాచారం మరియు మరిన్ని పొందండి.',
    ta: '{cropName} பற்றி அறிந்து கொள்ளுங்கள்: {summary}. கிருஷிமித்ரா பயன்பாட்டில் பயிர் குறிப்புகள், சந்தை தகவல்கள் மற்றும் பலவற்றைப் பெறுங்கள்.',
    mr: '{cropName} बद्दल जाणून घ्या: {summary}. कृषिमित्र अॅपवर लागवड टिप्स, बाजार माहिती आणि अधिक मिळवा.',
    gu: '{cropName} વિશે જાણો: {summary}. કૃષિમિત્ર એપ પર ખેતી ટિપ્સ, બજાર માહિતી, અને વધુ મેળવો.',
    kn: '{cropName} ಬಗ್ಗೆ ತಿಳಿಯಿರಿ: {summary}. ಕೃಷಿಮಿತ್ರ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಬೇಸಾಯ ಸಲಹೆಗಳು, ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಮತ್ತು ಇನ್ನೂ ಹೆಚ್ಚಿನದನ್ನು ಪಡೆಯಿರಿ.',
    ml: '{cropName} എന്നതിനെക്കുറിച്ച് മനസ്സിലാക്കുക: {summary}. കൃഷിമിത്ര ആപ്പിൽ കൃഷി നുറുങ്ങുകൾ, വിപണി വിവരങ്ങൾ, കൂടാതെ മറ്റനവധി കാര്യങ്ങൾ നേടുക.',
  },
  shareFinance: {
    en: 'Financial opportunity for farmers: {title}. {summary}. Explore more financial options on KrishiMitra app.',
    hi: 'किसानों के लिए वित्तीय अवसर: {title}। {summary}। कृषिमित्र ऐप पर अधिक वित्तीय विकल्प देखें।',
    pa: 'ਕਿਸਾਨਾਂ ਲਈ ਵਿੱਤੀ ਮੌਕਾ: {title}। {summary}। ਕ੍ਰਿਸ਼ੀਮਿਤਰ ਐਪ 'ਤੇ ਹੋਰ ਵਿੱਤੀ ਵਿਕਲਪਾਂ ਦੀ ਪੜਚੋਲ ਕਰੋ।',
    bn: 'কৃষকদের জন্য আর্থিক সুযোগ: {title}। {summary}। কৃষিমিত্র অ্যাপে আরও আর্থিক বিকল্প অন্বেষণ করুন।',
    te: 'రైతులకు ఆర్థిక అవకాశం: {title}. {summary}. కృషిమిత్ర యాప్‌లో మరిన్ని ఆర్థిక ఎంపికలను అన్వేషించండి.',
    ta: 'விவசாயிகளுக்கான நிதி வாய்ப்பு: {title}. {summary}. கிருஷிமித்ரா பயன்பாட்டில் மேலும் நிதி விருப்பங்களை ஆராயுங்கள்.',
    mr: 'शेतकऱ्यांसाठी आर्थिक संधी: {title}. {summary}. कृषिमित्र अॅपवर अधिक आर्थिक पर्याय शोधा.',
    gu: 'ખેડૂતો માટે નાણાકીય તક: {title}. {summary}. કૃષિમિત્ર એપ પર વધુ નાણાકીય વિકલ્પો શોધો.',
    kn: 'ರೈತರಿಗೆ ಹಣಕಾಸು ಅವಕಾಶ: {title}. {summary}. ಕೃಷಿಮಿತ್ರ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಹೆಚ್ಚಿನ ಹಣಕಾಸು ಆಯ್ಕೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.',
    ml: 'കർഷകർക്കുള്ള സാമ്പത്തിക അവസരം: {title}. {summary}. കൃഷിമിത്ര ആപ്പിൽ കൂടുതൽ സാമ്പത്തിക ഓപ്ഷനുകൾ പര്യവേക്ഷണം ചെയ്യുക.',
  },
  shareAdvisory: {
    en: 'Agricultural Advisory: {title}. {summary}. Get more farming advisories on KrishiMitra app.',
    hi: 'कृषि सलाह: {title}। {summary}। कृषिमित्र ऐप पर अधिक कृषि सलाह प्राप्त करें।',
    pa: 'ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ: {title}। {summary}। ਕ੍ਰਿਸ਼ੀਮਿਤਰ ਐਪ 'ਤੇ ਹੋਰ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਪ੍ਰਾਪਤ ਕਰੋ।',
    bn: 'কৃষি পরামর্শ: {title}। {summary}। কৃষিমিত্র অ্যাপে আরও কৃষি পরামর্শ পান।',
    te: 'వ్యవసాయ సలహా: {title}. {summary}. కృషిమిత్ర యాప్‌లో మరిన్ని వ్యవసాయ సలహాలను పొందండి.',
    ta: 'விவசாய ஆலோசனை: {title}. {summary}. கிருஷிமித்ரா பயன்பாட்டில் மேலும் விவசாய ஆலோசனைகளைப் பெறுங்கள்.',
    mr: 'कृषी सल्ला: {title}. {summary}. कृषिमित्र अॅपवर अधिक शेती सल्ला मिळवा.',
    gu: 'કૃષિ સલાહ: {title}. {summary}. કૃષિમિત્ર એપ પર વધુ ખેતી સલાહ મેળવો.',
    kn: 'ಕೃಷಿ ಸಲಹೆ: {title}. {summary}. ಕೃಷಿಮಿತ್ರ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಹೆಚ್ಚಿನ ಕೃಷಿ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ.',
    ml: 'കാർഷിക ഉപദേശം: {title}. {summary}. കൃഷിമിത്ര ആപ്പിൽ കൂടുതൽ കാർഷിക ഉപദേശങ്ങൾ നേടുക.',
  },
  shareLocation: {
    en: 'Check out this location: {name} at {coordinates}. View on KrishiMitra app for agricultural information specific to this area.',
    hi: 'इस स्थान को देखें: {name} {coordinates} पर। इस क्षेत्र के लिए विशिष्ट कृषि जानकारी के लिए कृषिमित्र ऐप पर देखें।',
    pa: 'ਇਸ ਸਥਾਨ ਨੂੰ ਦੇਖੋ: {name} {coordinates} 'ਤੇ। ਇਸ ਖੇਤਰ ਲਈ ਵਿਸ਼ੇਸ਼ ਖੇਤੀਬਾੜੀ ਜਾਣਕਾਰੀ ਲਈ ਕ੍ਰਿਸ਼ੀਮਿਤਰ ਐਪ' ਤੇ ਦੇਖੋ।',
    bn: 'এই অবস্থান দেখুন: {name} {coordinates} এ। এই এলাকার জন্য নির্দিষ্ট কৃষি তথ্যের জন্য কৃষিমিত্র অ্যাপে দেখুন।',
    te: 'ఈ స్థానాన్ని తనిఖీ చేయండి: {name} {coordinates} వద్ద. ఈ ప్రాంతానికి నిర్దిష్టమైన వ్యవసాయ సమాచారం కోసం కృషిమిత్ర యాప్‌లో చూడండి.',
    ta: 'இந்த இடத்தைப் பார்க்கவும்: {name} {coordinates} இல். இந்த பகுதிக்கு குறிப்பிட்ட விவசாய தகவலுக்கு கிருஷிமித்ரா பயன்பாட்டில் பார்க்கவும்.',
    mr: 'हे स्थान तपासा: {name} {coordinates} येथे. या क्षेत्रासाठी विशिष्ट कृषी माहितीसाठी कृषिमित्र अॅपवर पहा.',
    gu: 'આ સ્થાન તપાસો: {name} {coordinates} પર. આ વિસ્તાર માટે ચોક્કસ કૃષિ માહિતી માટે કૃષિમિત્ર એપ પર જુઓ.',
    kn: 'ಈ ಸ್ಥಳವನ್ನು ಪರಿಶೀಲಿಸಿ: {name} {coordinates} ನಲ್ಲಿ. ಈ ಪ್ರದೇಶಕ್ಕೆ ನಿರ್ದಿಷ್ಟವಾದ ಕೃಷಿ ಮಾಹಿತಿಗಾಗಿ ಕೃಷಿಮಿತ್ರ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ.',
    ml: 'ഈ സ്ഥലം പരിശോധിക്കുക: {name} {coordinates} ൽ. ഈ പ്രദേശത്തിന് പ്രത്യേകമായ കാർഷിക വിവരങ്ങൾക്കായി കൃഷിമിത്ര ആപ്പിൽ കാണുക.',
  },
  appDownload: {
    en: 'Download the KrishiMitra app for more information: https://krishimitra.app',
    hi: 'अधिक जानकारी के लिए कृषिमित्र ऐप डाउनलोड करें: https://krishimitra.app',
    pa: 'ਵਧੇਰੇ ਜਾਣਕਾਰੀ ਲਈ ਕ੍ਰਿਸ਼ੀਮਿਤਰ ਐਪ ਡਾਊਨਲੋਡ ਕਰੋ: https://krishimitra.app',
    bn: 'আরও তথ্যের জন্য কৃষিমিত্র অ্যাপ ডাউনলোড করুন: https://krishimitra.app',
    te: 'మరింత సమాచారం కోసం కృషిమిత్ర యాప్‌ను డౌన్‌లోడ్ చేసుకోండి: https://krishimitra.app',
    ta: 'மேலும் தகவலுக்கு கிருஷிமித்ரா பயன்பாட்டைப் பதிவிறக்கவும்: https://krishimitra.app',
    mr: 'अधिक माहितीसाठी कृषिमित्र अॅप डाउनलोड करा: https://krishimitra.app',
    gu: 'વધુ માહિતી માટે કૃષિમિત્ર એપ ડાઉનલોડ કરો: https://krishimitra.app',
    kn: 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಕೃಷಿಮಿತ್ರ ಅಪ್ಲಿಕೇಶನ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ: https://krishimitra.app',
    ml: 'കൂടുതൽ വിവരങ്ങൾക്ക് കൃഷിമിത്ര ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക: https://krishimitra.app',
  },
  shareSuccess: {
    en: 'Content shared successfully',
    hi: 'सामग्री सफलतापूर्वक साझा की गई',
    pa: 'ਸਮੱਗਰੀ ਸਫਲਤਾਪੂਰਵਕ ਸਾਂਝੀ ਕੀਤੀ ਗਈ',
    bn: 'বিষয়বস্তু সফলভাবে শেয়ার করা হয়েছে',
    te: 'కంటెంట్ విజయవంతంగా భాగస్వామ్యం చేయబడింది',
    ta: 'உள்ளடக்கம் வெற்றிகரமாக பகிரப்பட்டது',
    mr: 'सामग्री यशस्वीरित्या शेअर केली',
    gu: 'સામગ્રી સફળતાપૂર્વક શેર કરી',
    kn: 'ವಿಷಯವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ',
    ml: 'ഉള്ളടക്കം വിജയകരമായി പങ്കിട്ടു',
  },
  shareError: {
    en: 'Failed to share content',
    hi: 'सामग्री साझा करने में विफल',
    pa: 'ਸਮੱਗਰੀ ਸਾਂਝੀ ਕਰਨ ਵਿੱਚ ਅਸਫਲ',
    bn: 'বিষয়বস্তু শেয়ার করতে ব্যর্থ হয়েছে',
    te: 'కంటెంట్‌ను భాగస్వామ్యం చేయడంలో విఫలమైంది',
    ta: 'உள்ளடக்கத்தைப் பகிர முடியவில்லை',
    mr: 'सामग्री शेअर करण्यात अयशस्वी',
    gu: 'સામગ્રી શેર કરવામાં નિષ્ફળ',
    kn: 'ವಿಷಯವನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ವಿಫಲವಾಗಿದೆ',
    ml: 'ഉള്ളടക്കം പങ്കിടുന്നതിൽ പരാജയപ്പെട്ടു',
  },
  copySuccess: {
    en: 'Copied to clipboard',
    hi: 'क्लिपबोर्ड पर कॉपी किया गया',
    pa: 'ਕਲਿੱਪਬੋਰਡ 'ਤੇ ਕਾਪੀ ਕੀਤਾ ਗਿਆ',
    bn: 'ক্লিপবোর্ডে কপি করা হয়েছে',
    te: 'క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది',
    ta: 'கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது',
    mr: 'क्लिपबोर्डवर कॉपी केले',
    gu: 'ક્લિપબોર્ડ પર કૉપિ કર્યું',
    kn: 'ಕ್ಲಿಪ್‌ಬೋರ್ಡ್‌ಗೆ ನಕಲಿಸಲಾಗಿದೆ',
    ml: 'ക്ലിപ്പ്ബോർഡിലേക്ക് പകർത്തി',
  },
};

/**
 * Get a translated share message
 * @param key The translation key
 * @param params Optional parameters to replace in the message
 * @returns The translated message
 */
export const getShareMessage = (key: string, params?: Record<string, any>): string => {
  const language = getLanguage();
  let message = shareTranslations[key]?.[language] || shareTranslations[key]?.['en'] || key;
  
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      message = message.replace(`{${param}}`, value.toString());
    });
  }
  
  return message;
};

/**
 * Format content for sharing
 * @param content The content to format
 * @returns Formatted content for sharing
 */
export const formatShareContent = (content: ShareContent): { title: string; text: string; url?: string; files?: File[] } => {
  let formattedText = '';
  let formattedUrl = content.url;
  const files: File[] = [];
  
  switch (content.type) {
    case ShareContentType.WEATHER:
      formattedText = getShareMessage('shareWeather', {
        location: content.data?.location?.name || 'your location',
        summary: content.data?.current?.weather?.[0]?.description || 'weather forecast',
      });
      break;
      
    case ShareContentType.CROP:
      formattedText = getShareMessage('shareCrop', {
        cropName: content.data?.name || 'this crop',
        summary: content.data?.shortDescription || 'cultivation information',
      });
      break;
      
    case ShareContentType.FINANCE:
      formattedText = getShareMessage('shareFinance', {
        title: content.title,
        summary: content.text,
      });
      break;
      
    case ShareContentType.ADVISORY:
      formattedText = getShareMessage('shareAdvisory', {
        title: content.title,
        summary: content.text,
      });
      break;
      
    case ShareContentType.LOCATION:
      formattedText = getShareMessage('shareLocation', {
        name: content.data?.name || 'this location',
        coordinates: content.data?.coordinates || '',
      });
      break;
      
    case ShareContentType.CUSTOM:
    default:
      formattedText = content.text;
      break;
  }
  
  // Add app download link if not already included
  if (!formattedText.includes('krishimitra.app')) {
    formattedText += '\n\n' + getShareMessage('appDownload');
  }
  
  // Add image as file if available
  if (content.imageUrl && content.file) {
    files.push(content.file);
  }
  
  return {
    title: content.title,
    text: formattedText,
    url: formattedUrl,
    files: files.length > 0 ? files : undefined,
  };
};

/**
 * Check if Web Share API is available
 * @returns Whether the Web Share API is available
 */
export const isWebShareAvailable = (): boolean => {
  return !!navigator.share;
};

/**
 * Share content using the Web Share API
 * @param content The content to share
 * @returns Promise that resolves when the content is shared
 */
export const shareWithNative = async (content: ShareContent): Promise<void> => {
  if (!isWebShareAvailable()) {
    throw new Error('Web Share API is not available');
  }
  
  const formattedContent = formatShareContent(content);
  
  try {
    await navigator.share({
      title: formattedContent.title,
      text: formattedContent.text,
      url: formattedContent.url,
      files: formattedContent.files,
    } as any);
    
    // Track the event
    trackEvent({
      category: EventCategory.SHARE,
      action: EventAction.SHARE_CONTENT,
      label: `${content.type}:native`,
    });
  } catch (error) {
    // User cancelled or share failed
    if ((error as Error).name !== 'AbortError') {
      logError({
        message: 'Failed to share content using Web Share API',
        error: error as Error,
        category: ErrorCategory.UI,
        severity: ErrorSeverity.WARNING,
      });
      
      throw error;
    }
  }
};

/**
 * Share content via WhatsApp
 * @param content The content to share
 */
export const shareWithWhatsApp = (content: ShareContent): void => {
  const formattedContent = formatShareContent(content);
  let shareText = formattedContent.text;
  
  if (formattedContent.url) {
    shareText += `\n${formattedContent.url}`;
  }
  
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  
  try {
    window.open(whatsappUrl, '_blank');
    
    // Track the event
    trackEvent({
      category: EventCategory.SHARE,
      action: EventAction.SHARE_CONTENT,
      label: `${content.type}:whatsapp`,
    });
  } catch (error) {
    logError({
      message: 'Failed to share content via WhatsApp',
      error: error as Error,
      category: ErrorCategory.UI,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Share content via SMS
 * @param content The content to share
 */
export const shareWithSMS = (content: ShareContent): void => {
  const formattedContent = formatShareContent(content);
  let shareText = formattedContent.text;
  
  if (formattedContent.url) {
    shareText += `\n${formattedContent.url}`;
  }
  
  const smsUrl = `sms:?body=${encodeURIComponent(shareText)}`;
  
  try {
    window.open(smsUrl, '_blank');
    
    // Track the event
    trackEvent({
      category: EventCategory.SHARE,
      action: EventAction.SHARE_CONTENT,
      label: `${content.type}:sms`,
    });
  } catch (error) {
    logError({
      message: 'Failed to share content via SMS',
      error: error as Error,
      category: ErrorCategory.UI,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Share content via email
 * @param content The content to share
 */
export const shareWithEmail = (content: ShareContent): void => {
  const formattedContent = formatShareContent(content);
  let shareText = formattedContent.text;
  
  if (formattedContent.url) {
    shareText += `\n\n${formattedContent.url}`;
  }
  
  const emailUrl = `mailto:?subject=${encodeURIComponent(formattedContent.title)}&body=${encodeURIComponent(shareText)}`;
  
  try {
    window.open(emailUrl, '_blank');
    
    // Track the event
    trackEvent({
      category: EventCategory.SHARE,
      action: EventAction.SHARE_CONTENT,
      label: `${content.type}:email`,
    });
  } catch (error) {
    logError({
      message: 'Failed to share content via email',
      error: error as Error,
      category: ErrorCategory.UI,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Copy content to clipboard
 * @param content The content to copy
 * @returns Promise that resolves when the content is copied
 */
export const copyToClipboard = async (content: ShareContent): Promise<void> => {
  const formattedContent = formatShareContent(content);
  let copyText = formattedContent.text;
  
  if (formattedContent.url) {
    copyText += `\n\n${formattedContent.url}`;
  }
  
  try {
    await navigator.clipboard.writeText(copyText);
    
    // Track the event
    trackEvent({
      category: EventCategory.SHARE,
      action: EventAction.COPY_TO_CLIPBOARD,
      label: content.type,
    });
  } catch (error) {
    // Fallback for browsers that don't support clipboard API
    const textarea = document.createElement('textarea');
    textarea.value = copyText;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        throw new Error('Copy command was unsuccessful');
      }
      
      // Track the event
      trackEvent({
        category: EventCategory.SHARE,
        action: EventAction.COPY_TO_CLIPBOARD,
        label: content.type,
      });
    } catch (err) {
      logError({
        message: 'Failed to copy content to clipboard',
        error: err as Error,
        category: ErrorCategory.UI,
        severity: ErrorSeverity.WARNING,
      });
      
      throw err;
    } finally {
      document.body.removeChild(textarea);
    }
  }
};

/**
 * Generate a QR code for content
 * @param content The content to encode in the QR code
 * @returns The URL of the generated QR code
 */
export const generateQRCode = (content: ShareContent): string => {
  const formattedContent = formatShareContent(content);
  let qrData = formattedContent.text;
  
  if (formattedContent.url) {
    qrData = formattedContent.url; // Prefer URL for QR codes
  }
  
  // Use a QR code generation service
  // In a real implementation, you might want to use a library to generate QR codes client-side
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
  
  // Track the event
  trackEvent({
    category: EventCategory.SHARE,
    action: EventAction.GENERATE_QR_CODE,
    label: content.type,
  });
  
  return qrCodeUrl;
};

/**
 * Download content as a file
 * @param content The content to download
 * @param fileName The name of the file
 */
export const downloadAsFile = (content: ShareContent, fileName: string): void => {
  const formattedContent = formatShareContent(content);
  let downloadText = formattedContent.text;
  
  if (formattedContent.url) {
    downloadText += `\n\n${formattedContent.url}`;
  }
  
  try {
    const blob = new Blob([downloadText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Track the event
    trackEvent({
      category: EventCategory.SHARE,
      action: EventAction.DOWNLOAD_CONTENT,
      label: content.type,
    });
  } catch (error) {
    logError({
      message: 'Failed to download content as file',
      error: error as Error,
      category: ErrorCategory.UI,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Share content using the specified method
 * @param content The content to share
 * @param method The method to use for sharing
 * @returns Promise that resolves when the content is shared
 */
export const shareContent = async (
  content: ShareContent,
  method: ShareMethod = ShareMethod.NATIVE
): Promise<void> => {
  if (!isOnline() && method !== ShareMethod.COPY && method !== ShareMethod.PRINT && method !== ShareMethod.DOWNLOAD) {
    throw new Error('Cannot share content while offline');
  }
  
  try {
    switch (method) {
      case ShareMethod.NATIVE:
        await shareWithNative(content);
        break;
        
      case ShareMethod.WHATSAPP:
        shareWithWhatsApp(content);
        break;
        
      case ShareMethod.SMS:
        shareWithSMS(content);
        break;
        
      case ShareMethod.EMAIL:
        shareWithEmail(content);
        break;
        
      case ShareMethod.COPY:
        await copyToClipboard(content);
        break;
        
      case ShareMethod.QR:
        // This just returns a URL, so we don't need to do anything here
        generateQRCode(content);
        break;
        
      case ShareMethod.PRINT:
        // Printing is handled by printUtils
        // This is just a placeholder
        console.log('Print method should be handled by printUtils');
        break;
        
      case ShareMethod.DOWNLOAD:
        downloadAsFile(content, `krishimitra-${content.type}-${Date.now()}.txt`);
        break;
        
      default:
        throw new Error(`Unsupported share method: ${method}`);
    }
  } catch (error) {
    logError({
      message: `Failed to share content using method: ${method}`,
      error: error as Error,
      category: ErrorCategory.UI,
      severity: ErrorSeverity.WARNING,
      context: { contentType: content.type },
    });
    
    throw error;
  }
};

/**
 * Get available share methods based on platform and content
 * @param content The content to share
 * @returns Array of available share methods
 */
export const getAvailableShareMethods = (content: ShareContent): ShareMethod[] => {
  const methods: ShareMethod[] = [];
  
  // Native sharing is available on most modern browsers
  if (isWebShareAvailable()) {
    methods.push(ShareMethod.NATIVE);
  }
  
  // These methods are always available
  methods.push(ShareMethod.COPY);
  methods.push(ShareMethod.PRINT);
  methods.push(ShareMethod.DOWNLOAD);
  methods.push(ShareMethod.QR);
  
  // These methods require online connectivity
  if (isOnline()) {
    methods.push(ShareMethod.WHATSAPP);
    methods.push(ShareMethod.EMAIL);
    methods.push(ShareMethod.SMS);
  }
  
  return methods;
};

/**
 * Create a shareable URL for content
 * @param content The content to create a URL for
 * @returns The shareable URL
 */
export const createShareableUrl = (content: ShareContent): string => {
  // Base URL for the app
  const baseUrl = 'https://krishimitra.app';
  
  // Create a URL based on content type
  let path = '';
  
  switch (content.type) {
    case ShareContentType.WEATHER:
      path = `/weather?location=${encodeURIComponent(content.data?.location?.name || '')}`;
      break;
      
    case ShareContentType.CROP:
      path = `/crop/${content.data?.id || ''}`;
      break;
      
    case ShareContentType.FINANCE:
      if (content.data?.type === 'loan') {
        path = `/finance/loan/${content.data?.id || ''}`;
      } else if (content.data?.type === 'scheme') {
        path = `/finance/scheme/${content.data?.id || ''}`;
      } else if (content.data?.type === 'insurance') {
        path = `/finance/insurance/${content.data?.id || ''}`;
      } else {
        path = '/finance';
      }
      break;
      
    case ShareContentType.ADVISORY:
      path = `/advisory/${content.data?.id || ''}`;
      break;
      
    case ShareContentType.LOCATION:
      if (content.data?.coordinates) {
        const [lat, lng] = content.data.coordinates.split(',');
        path = `/map?lat=${lat.trim()}&lng=${lng.trim()}`;
      } else {
        path = '/map';
      }
      break;
      
    default:
      path = '/';
      break;
  }
  
  return `${baseUrl}${path}`;
};

/**
 * Create a deep link for content
 * @param content The content to create a deep link for
 * @returns The deep link
 */
export const createDeepLink = (content: ShareContent): string => {
  // Deep link scheme for the app
  const scheme = 'krishimitra://';
  
  // Create a path based on content type
  let path = '';
  
  switch (content.type) {
    case ShareContentType.WEATHER:
      path = `weather?location=${encodeURIComponent(content.data?.location?.name || '')}`;
      break;
      
    case ShareContentType.CROP:
      path = `crop/${content.data?.id || ''}`;
      break;
      
    case ShareContentType.FINANCE:
      if (content.data?.type === 'loan') {
        path = `finance/loan/${content.data?.id || ''}`;
      } else if (content.data?.type === 'scheme') {
        path = `finance/scheme/${content.data?.id || ''}`;
      } else if (content.data?.type === 'insurance') {
        path = `finance/insurance/${content.data?.id || ''}`;
      } else {
        path = 'finance';
      }
      break;
      
    case ShareContentType.ADVISORY:
      path = `advisory/${content.data?.id || ''}`;
      break;
      
    case ShareContentType.LOCATION:
      if (content.data?.coordinates) {
        const [lat, lng] = content.data.coordinates.split(',');
        path = `map?lat=${lat.trim()}&lng=${lng.trim()}`;
      } else {
        path = 'map';
      }
      break;
      
    default:
      path = '';
      break;
  }
  
  return `${scheme}${path}`;
};