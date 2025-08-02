// Utilities for handling user feedback

import { logError, ErrorCategory, ErrorSeverity } from './errorUtils';
import { trackEvent, EventCategory, EventAction } from './analyticsUtils';
import { getLanguage } from './languageUtils';
import { isOnline } from './offlineUtils';
import { getUserId } from './securityUtils';

// Feedback types
export enum FeedbackType {
  BUG_REPORT = 'bugReport',
  FEATURE_REQUEST = 'featureRequest',
  GENERAL_FEEDBACK = 'generalFeedback',
  APP_RATING = 'appRating',
  CONTENT_RATING = 'contentRating',
  SURVEY_RESPONSE = 'surveyResponse',
}

// Feedback status
export enum FeedbackStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'underReview',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
  PLANNED = 'planned',
}

// Feedback priority
export enum FeedbackPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Feedback interface
export interface Feedback {
  id?: string;
  userId: string;
  type: FeedbackType;
  title: string;
  description: string;
  rating?: number; // 1-5 star rating
  category?: string;
  tags?: string[];
  status?: FeedbackStatus;
  priority?: FeedbackPriority;
  createdAt: Date;
  updatedAt?: Date;
  deviceInfo?: DeviceInfo;
  screenshots?: string[];
  metadata?: Record<string, any>;
}

// Device information interface
export interface DeviceInfo {
  platform: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  screenResolution: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  appVersion: string;
  language: string;
}

// Survey question types
export enum SurveyQuestionType {
  MULTIPLE_CHOICE = 'multipleChoice',
  CHECKBOX = 'checkbox',
  RATING = 'rating',
  TEXT = 'text',
  DROPDOWN = 'dropdown',
  BOOLEAN = 'boolean',
}

// Survey question interface
export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  question: string;
  required: boolean;
  options?: string[];
  minRating?: number;
  maxRating?: number;
  placeholder?: string;
}

// Survey interface
export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  targetAudience?: string[];
  completionMessage?: string;
}

// Survey response interface
export interface SurveyResponse {
  id?: string;
  surveyId: string;
  userId: string;
  responses: {
    questionId: string;
    answer: string | string[] | number | boolean;
  }[];
  completedAt: Date;
  timeToComplete?: number; // in seconds
  deviceInfo?: DeviceInfo;
}

// Translations for feedback messages
const feedbackTranslations: Record<string, Record<string, string>> = {
  submitSuccess: {
    en: 'Thank you for your feedback!',
    hi: 'आपके फीडबैक के लिए धन्यवाद!',
    pa: 'ਤੁਹਾਡੇ ਫੀਡਬੈਕ ਲਈ ਧੰਨਵਾਦ!',
    bn: 'আপনার প্রতিক্রিয়ার জন্য ধন্যবাদ!',
    te: 'మీ అభిప్రాయానికి ధన్యవాదాలు!',
    ta: 'உங்கள் கருத்துக்கு நன்றி!',
    mr: 'तुमच्या अभिप्रायासाठी धन्यवाद!',
    gu: 'તમારા પ્રતિસાદ બદલ આભાર!',
    kn: 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗೆ ಧನ್ಯವಾದಗಳು!',
    ml: 'നിങ്ങളുടെ പ്രതികരണത്തിന് നന്ദി!',
  },
  submitError: {
    en: 'Failed to submit feedback. Please try again later.',
    hi: 'फीडबैक सबमिट करने में विफल। कृपया बाद में पुनः प्रयास करें।',
    pa: 'ਫੀਡਬੈਕ ਜਮ੍ਹਾਂ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    bn: 'প্রতিক্রিয়া জমা দিতে ব্যর্থ হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
    te: 'అభిప్రాయాన్ని సమర్పించడంలో విఫలమైంది. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.',
    ta: 'கருத்தைச் சமர்ப்பிக்க முடியவில்லை. பிறகு மீண்டும் முயற்சிக்கவும்.',
    mr: 'अभिप्राय सबमिट करण्यात अयशस्वी. कृपया नंतर पुन्हा प्रयत्न करा.',
    gu: 'પ્રતિસાદ સબમિટ કરવામાં નિષ્ફળ. કૃપા કરીને પછી ફરી પ્રયાસ કરો.',
    kn: 'ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    ml: 'ഫീഡ്‌ബാക്ക് സമർപ്പിക്കുന്നതിൽ പരാജയപ്പെട്ടു. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക.',
  },
  offlineError: {
    en: 'You are currently offline. Your feedback will be submitted when you are back online.',
    hi: 'आप वर्तमान में ऑफलाइन हैं। आपका फीडबैक तब सबमिट किया जाएगा जब आप वापस ऑनलाइन होंगे।',
    pa: 'ਤੁਸੀਂ ਇਸ ਸਮੇਂ ਆਫਲਾਈਨ ਹੋ। ਤੁਹਾਡਾ ਫੀਡਬੈਕ ਜਮ੍ਹਾਂ ਕੀਤਾ ਜਾਵੇਗਾ ਜਦੋਂ ਤੁਸੀਂ ਵਾਪਸ ਆਨਲਾਈਨ ਹੋਵੋਗੇ।',
    bn: 'আপনি বর্তমানে অফলাইন। আপনি আবার অনলাইনে ফিরে এলে আপনার প্রতিক্রিয়া জমা দেওয়া হবে।',
    te: 'మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు. మీరు తిరిగి ఆన్‌లైన్‌లోకి వచ్చినప్పుడు మీ అభిప్రాయం సమర్పించబడుతుంది.',
    ta: 'நீங்கள் தற்போது ஆஃப்லைனில் உள்ளீர்கள். நீங்கள் மீண்டும் ஆன்லைனில் இருக்கும்போது உங்கள் கருத்து சமர்ப்பிக்கப்படும்.',
    mr: 'तुम्ही सध्या ऑफलाइन आहात. तुम्ही पुन्हा ऑनलाइन आल्यावर तुमचा अभिप्राय सबमिट केला जाईल.',
    gu: 'તમે હાલમાં ઑફલાઇન છો. તમે ફરીથી ઑનલાઇન આવશો ત્યારે તમારો પ્રતિસાદ સબમિટ કરવામાં આવશે.',
    kn: 'ನೀವು ಪ್ರಸ್ತುತ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ. ನೀವು ಮತ್ತೆ ಆನ್‌ಲೈನ್‌ಗೆ ಬಂದಾಗ ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಸಲ್ಲಿಸಲಾಗುವುದು.',
    ml: 'നിങ്ങൾ നിലവിൽ ഓഫ്‌ലൈനിൽ ആണ്. നിങ്ങൾ വീണ്ടും ഓൺലൈനിൽ വരുമ്പോൾ നിങ്ങളുടെ ഫീഡ്‌ബാക്ക് സമർപ്പിക്കും.',
  },
  ratingSuccess: {
    en: 'Thank you for your rating!',
    hi: 'आपकी रेटिंग के लिए धन्यवाद!',
    pa: 'ਤੁਹਾਡੀ ਰੇਟਿੰਗ ਲਈ ਧੰਨਵਾਦ!',
    bn: 'আপনার রেটিং এর জন্য ধন্যবাদ!',
    te: 'మీ రేటింగ్‌కు ధన్యవాదాలు!',
    ta: 'உங்கள் மதிப்பீட்டிற்கு நன்றி!',
    mr: 'तुमच्या रेटिंगसाठी धन्यवाद!',
    gu: 'તમારા રેટિંગ માટે આભાર!',
    kn: 'ನಿಮ್ಮ ರೇಟಿಂಗ್‌ಗೆ ಧನ್ಯವಾದಗಳು!',
    ml: 'നിങ്ങളുടെ റേറ്റിംഗിന് നന്ദി!',
  },
  surveyComplete: {
    en: 'Thank you for completing the survey!',
    hi: 'सर्वेक्षण पूरा करने के लिए धन्यवाद!',
    pa: 'ਸਰਵੇਖਣ ਪੂਰਾ ਕਰਨ ਲਈ ਧੰਨਵਾਦ!',
    bn: 'জরিপ সম্পূর্ণ করার জন্য ধন্যবাদ!',
    te: 'సర్వేను పూర్తి చేసినందుకు ధన్యవాదాలు!',
    ta: 'கணக்கெடுப்பை முடித்ததற்கு நன்றி!',
    mr: 'सर्वेक्षण पूर्ण केल्याबद्दल धन्यवाद!',
    gu: 'સર્વેક્ષણ પૂર્ણ કરવા બદલ આભાર!',
    kn: 'ಸಮೀಕ್ಷೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು!',
    ml: 'സർവേ പൂർത്തിയാക്കിയതിന് നന്ദി!',
  },
  feedbackTitle: {
    en: 'We value your feedback',
    hi: 'हम आपके फीडबैक को महत्व देते हैं',
    pa: 'ਅਸੀਂ ਤੁਹਾਡੇ ਫੀਡਬੈਕ ਨੂੰ ਮਹੱਤਵ ਦਿੰਦੇ ਹਾਂ',
    bn: 'আমরা আপনার প্রতিক্রিয়াকে মূল্য দিই',
    te: 'మేము మీ అభిప్రాయాన్ని విలువైనదిగా భావిస్తాము',
    ta: 'உங்கள் கருத்தை நாங்கள் மதிக்கிறோம்',
    mr: 'आम्ही तुमच्या अभिप्रायाला महत्त्व देतो',
    gu: 'અમે તમારા પ્રતિસાદને મૂલ્ય આપીએ છીએ',
    kn: 'ನಾವು ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಮೌಲ್ಯಯುತವಾಗಿ ಪರಿಗಣಿಸುತ್ತೇವೆ',
    ml: 'ഞങ്ങൾ നിങ്ങളുടെ പ്രതികരണത്തെ വിലമതിക്കുന്നു',
  },
  bugReportTitle: {
    en: 'Report a Bug',
    hi: 'बग रिपोर्ट करें',
    pa: 'ਬੱਗ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    bn: 'একটি বাগ রিপোর্ট করুন',
    te: 'బగ్‌ను నివేదించండి',
    ta: 'பிழையைப் புகாரளிக்கவும்',
    mr: 'बग रिपोर्ट करा',
    gu: 'બગની જાણ કરો',
    kn: 'ದೋಷವನ್ನು ವರದಿ ಮಾಡಿ',
    ml: 'ഒരു ബഗ് റിപ്പോർട്ട് ചെയ്യുക',
  },
  featureRequestTitle: {
    en: 'Request a Feature',
    hi: 'फीचर का अनुरोध करें',
    pa: 'ਇੱਕ ਫੀਚਰ ਦੀ ਬੇਨਤੀ ਕਰੋ',
    bn: 'একটি বৈশিষ্ট্য অনুরোধ করুন',
    te: 'ఫీచర్‌ను అభ్యర్థించండి',
    ta: 'ஒரு அம்சத்தைக் கோருங்கள்',
    mr: 'वैशिष्ट्याची विनंती करा',
    gu: 'સુવિધાની વિનંતી કરો',
    kn: 'ವೈಶಿಷ್ಟ್ಯವನ್ನು ವಿನಂತಿಸಿ',
    ml: 'ഒരു ഫീച്ചർ അഭ്യർത്ഥിക്കുക',
  },
};

/**
 * Get a translated feedback message
 * @param key The translation key
 * @param params Optional parameters to replace in the message
 * @returns The translated message
 */
export const getFeedbackMessage = (key: string, params?: Record<string, any>): string => {
  const language = getLanguage();
  let message = feedbackTranslations[key]?.[language] || feedbackTranslations[key]?.['en'] || key;
  
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      message = message.replace(`{${param}}`, value.toString());
    });
  }
  
  return message;
};

/**
 * Get device information
 * @returns Device information object
 */
export const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent;
  let browser = 'unknown';
  let browserVersion = 'unknown';
  let os = 'unknown';
  let osVersion = 'unknown';
  let deviceType: DeviceInfo['deviceType'] = 'unknown';
  
  // Detect browser and version
  if (userAgent.indexOf('Firefox') > -1) {
    browser = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'unknown';
  } else if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge') === -1 && userAgent.indexOf('Edg') === -1) {
    browser = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'unknown';
  } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
    browser = 'Safari';
    browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || 'unknown';
  } else if (userAgent.indexOf('Edge') > -1 || userAgent.indexOf('Edg') > -1) {
    browser = 'Edge';
    browserVersion = userAgent.match(/Edge\/(\d+\.\d+)/)?.[1] || userAgent.match(/Edg\/(\d+\.\d+)/)?.[1] || 'unknown';
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
    browser = 'Internet Explorer';
    browserVersion = userAgent.match(/MSIE (\d+\.\d+)/)?.[1] || 'unknown';
  }
  
  // Detect OS and version
  if (userAgent.indexOf('Windows') > -1) {
    os = 'Windows';
    osVersion = userAgent.match(/Windows NT (\d+\.\d+)/)?.[1] || 'unknown';
  } else if (userAgent.indexOf('Mac') > -1) {
    os = 'MacOS';
    osVersion = userAgent.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || 'unknown';
  } else if (userAgent.indexOf('Android') > -1) {
    os = 'Android';
    osVersion = userAgent.match(/Android (\d+\.\d+)/)?.[1] || 'unknown';
  } else if (userAgent.indexOf('iOS') > -1 || (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1)) {
    os = 'iOS';
    osVersion = userAgent.match(/OS (\d+_\d+)/)?.[1]?.replace('_', '.') || 'unknown';
  } else if (userAgent.indexOf('Linux') > -1) {
    os = 'Linux';
    osVersion = 'unknown';
  }
  
  // Detect device type
  if (userAgent.indexOf('Mobile') > -1 || userAgent.indexOf('iPhone') > -1) {
    deviceType = 'mobile';
  } else if (userAgent.indexOf('iPad') > -1 || userAgent.indexOf('Tablet') > -1) {
    deviceType = 'tablet';
  } else {
    deviceType = 'desktop';
  }
  
  return {
    platform: navigator.platform,
    browser,
    browserVersion,
    os,
    osVersion,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    deviceType,
    appVersion: '1.0.0', // Replace with actual app version
    language: getLanguage(),
  };
};

/**
 * Generate a unique ID for feedback
 * @returns A unique ID string
 */
const generateFeedbackId = (): string => {
  return `feedback_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Save feedback to local storage
 * @param feedback The feedback to save
 */
const saveFeedbackToLocalStorage = (feedback: Feedback): void => {
  try {
    const storedFeedback = localStorage.getItem('krishimitra_feedback');
    const feedbackList: Feedback[] = storedFeedback ? JSON.parse(storedFeedback) : [];
    
    feedbackList.push(feedback);
    
    localStorage.setItem('krishimitra_feedback', JSON.stringify(feedbackList));
  } catch (error) {
    logError({
      message: 'Failed to save feedback to local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
  }
};

/**
 * Get pending feedback from local storage
 * @returns Array of pending feedback
 */
export const getPendingFeedback = (): Feedback[] => {
  try {
    const storedFeedback = localStorage.getItem('krishimitra_feedback');
    return storedFeedback ? JSON.parse(storedFeedback) : [];
  } catch (error) {
    logError({
      message: 'Failed to get pending feedback from local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
    
    return [];
  }
};

/**
 * Remove feedback from local storage
 * @param feedbackId The ID of the feedback to remove
 */
const removeFeedbackFromLocalStorage = (feedbackId: string): void => {
  try {
    const storedFeedback = localStorage.getItem('krishimitra_feedback');
    if (!storedFeedback) return;
    
    const feedbackList: Feedback[] = JSON.parse(storedFeedback);
    const updatedList = feedbackList.filter(feedback => feedback.id !== feedbackId);
    
    localStorage.setItem('krishimitra_feedback', JSON.stringify(updatedList));
  } catch (error) {
    logError({
      message: 'Failed to remove feedback from local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
  }
};

/**
 * Submit feedback to the server
 * @param feedback The feedback to submit
 * @returns Promise that resolves when the feedback is submitted
 */
const submitFeedbackToServer = async (feedback: Feedback): Promise<void> => {
  // In a real implementation, this would send the feedback to a server API
  // For now, we'll just simulate a successful submission
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate for simulation
        resolve();
      } else {
        reject(new Error('Failed to submit feedback to server'));
      }
    }, 1000);
  });
};

/**
 * Submit feedback
 * @param feedback The feedback to submit
 * @returns Promise that resolves when the feedback is submitted
 */
export const submitFeedback = async (feedback: Feedback): Promise<void> => {
  // Add device info and user ID if not provided
  const completedfeedback: Feedback = {
    ...feedback,
    id: feedback.id || generateFeedbackId(),
    userId: feedback.userId || getUserId() || 'anonymous',
    deviceInfo: feedback.deviceInfo || getDeviceInfo(),
    createdAt: feedback.createdAt || new Date(),
    status: feedback.status || FeedbackStatus.SUBMITTED,
  };
  
  try {
    if (isOnline()) {
      // Try to submit to server
      await submitFeedbackToServer(completedfeedback);
      
      // Track the event
      trackEvent({
        category: EventCategory.FEEDBACK,
        action: EventAction.SUBMIT_FEEDBACK,
        label: completedfeedback.type,
      });
      
      return;
    } else {
      // Save for later submission when online
      saveFeedbackToLocalStorage(completedfeedback);
      
      // Track the event
      trackEvent({
        category: EventCategory.FEEDBACK,
        action: EventAction.SAVE_OFFLINE_FEEDBACK,
        label: completedfeedback.type,
      });
      
      throw new Error(getFeedbackMessage('offlineError'));
    }
  } catch (error) {
    // If server submission fails, save locally
    if (error.message !== getFeedbackMessage('offlineError')) {
      saveFeedbackToLocalStorage(completedfeedback);
      
      logError({
        message: 'Failed to submit feedback',
        error: error as Error,
        category: ErrorCategory.API,
        severity: ErrorSeverity.WARNING,
      });
    }
    
    throw error;
  }
};

/**
 * Submit a bug report
 * @param title The bug report title
 * @param description The bug report description
 * @param category Optional category
 * @param screenshots Optional screenshots
 * @returns Promise that resolves when the bug report is submitted
 */
export const submitBugReport = async (
  title: string,
  description: string,
  category?: string,
  screenshots?: string[]
): Promise<void> => {
  const bugReport: Feedback = {
    userId: getUserId() || 'anonymous',
    type: FeedbackType.BUG_REPORT,
    title,
    description,
    category,
    screenshots,
    priority: FeedbackPriority.MEDIUM, // Default priority
    createdAt: new Date(),
  };
  
  return submitFeedback(bugReport);
};

/**
 * Submit a feature request
 * @param title The feature request title
 * @param description The feature request description
 * @param category Optional category
 * @returns Promise that resolves when the feature request is submitted
 */
export const submitFeatureRequest = async (
  title: string,
  description: string,
  category?: string
): Promise<void> => {
  const featureRequest: Feedback = {
    userId: getUserId() || 'anonymous',
    type: FeedbackType.FEATURE_REQUEST,
    title,
    description,
    category,
    priority: FeedbackPriority.MEDIUM, // Default priority
    createdAt: new Date(),
  };
  
  return submitFeedback(featureRequest);
};

/**
 * Submit general feedback
 * @param title The feedback title
 * @param description The feedback description
 * @param category Optional category
 * @returns Promise that resolves when the feedback is submitted
 */
export const submitGeneralFeedback = async (
  title: string,
  description: string,
  category?: string
): Promise<void> => {
  const generalFeedback: Feedback = {
    userId: getUserId() || 'anonymous',
    type: FeedbackType.GENERAL_FEEDBACK,
    title,
    description,
    category,
    priority: FeedbackPriority.LOW, // Default priority
    createdAt: new Date(),
  };
  
  return submitFeedback(generalFeedback);
};

/**
 * Submit an app rating
 * @param rating The rating (1-5)
 * @param comment Optional comment
 * @returns Promise that resolves when the rating is submitted
 */
export const submitAppRating = async (rating: number, comment?: string): Promise<void> => {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  const appRating: Feedback = {
    userId: getUserId() || 'anonymous',
    type: FeedbackType.APP_RATING,
    title: `App Rating: ${rating}/5`,
    description: comment || '',
    rating,
    createdAt: new Date(),
  };
  
  return submitFeedback(appRating);
};

/**
 * Submit a content rating
 * @param contentId The ID of the content being rated
 * @param contentType The type of content being rated
 * @param rating The rating (1-5)
 * @param comment Optional comment
 * @returns Promise that resolves when the rating is submitted
 */
export const submitContentRating = async (
  contentId: string,
  contentType: string,
  rating: number,
  comment?: string
): Promise<void> => {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  const contentRating: Feedback = {
    userId: getUserId() || 'anonymous',
    type: FeedbackType.CONTENT_RATING,
    title: `${contentType} Rating: ${rating}/5`,
    description: comment || '',
    rating,
    category: contentType,
    metadata: { contentId },
    createdAt: new Date(),
  };
  
  return submitFeedback(contentRating);
};

/**
 * Generate a unique ID for survey responses
 * @returns A unique ID string
 */
const generateSurveyResponseId = (): string => {
  return `survey_response_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Save survey response to local storage
 * @param response The survey response to save
 */
const saveSurveyResponseToLocalStorage = (response: SurveyResponse): void => {
  try {
    const storedResponses = localStorage.getItem('krishimitra_survey_responses');
    const responseList: SurveyResponse[] = storedResponses ? JSON.parse(storedResponses) : [];
    
    responseList.push(response);
    
    localStorage.setItem('krishimitra_survey_responses', JSON.stringify(responseList));
  } catch (error) {
    logError({
      message: 'Failed to save survey response to local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
  }
};

/**
 * Get pending survey responses from local storage
 * @returns Array of pending survey responses
 */
export const getPendingSurveyResponses = (): SurveyResponse[] => {
  try {
    const storedResponses = localStorage.getItem('krishimitra_survey_responses');
    return storedResponses ? JSON.parse(storedResponses) : [];
  } catch (error) {
    logError({
      message: 'Failed to get pending survey responses from local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
    
    return [];
  }
};

/**
 * Remove survey response from local storage
 * @param responseId The ID of the survey response to remove
 */
const removeSurveyResponseFromLocalStorage = (responseId: string): void => {
  try {
    const storedResponses = localStorage.getItem('krishimitra_survey_responses');
    if (!storedResponses) return;
    
    const responseList: SurveyResponse[] = JSON.parse(storedResponses);
    const updatedList = responseList.filter(response => response.id !== responseId);
    
    localStorage.setItem('krishimitra_survey_responses', JSON.stringify(updatedList));
  } catch (error) {
    logError({
      message: 'Failed to remove survey response from local storage',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
  }
};

/**
 * Submit survey response to the server
 * @param response The survey response to submit
 * @returns Promise that resolves when the survey response is submitted
 */
const submitSurveyResponseToServer = async (response: SurveyResponse): Promise<void> => {
  // In a real implementation, this would send the survey response to a server API
  // For now, we'll just simulate a successful submission
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate for simulation
        resolve();
      } else {
        reject(new Error('Failed to submit survey response to server'));
      }
    }, 1000);
  });
};

/**
 * Submit a survey response
 * @param surveyId The ID of the survey
 * @param responses The survey question responses
 * @param timeToComplete Optional time to complete in seconds
 * @returns Promise that resolves when the survey response is submitted
 */
export const submitSurveyResponse = async (
  surveyId: string,
  responses: { questionId: string; answer: string | string[] | number | boolean }[],
  timeToComplete?: number
): Promise<void> => {
  const surveyResponse: SurveyResponse = {
    id: generateSurveyResponseId(),
    surveyId,
    userId: getUserId() || 'anonymous',
    responses,
    completedAt: new Date(),
    timeToComplete,
    deviceInfo: getDeviceInfo(),
  };
  
  try {
    if (isOnline()) {
      // Try to submit to server
      await submitSurveyResponseToServer(surveyResponse);
      
      // Track the event
      trackEvent({
        category: EventCategory.FEEDBACK,
        action: EventAction.SUBMIT_SURVEY,
        label: surveyId,
      });
      
      return;
    } else {
      // Save for later submission when online
      saveSurveyResponseToLocalStorage(surveyResponse);
      
      // Track the event
      trackEvent({
        category: EventCategory.FEEDBACK,
        action: EventAction.SAVE_OFFLINE_SURVEY,
        label: surveyId,
      });
      
      throw new Error(getFeedbackMessage('offlineError'));
    }
  } catch (error) {
    // If server submission fails, save locally
    if (error.message !== getFeedbackMessage('offlineError')) {
      saveSurveyResponseToLocalStorage(surveyResponse);
      
      logError({
        message: 'Failed to submit survey response',
        error: error as Error,
        category: ErrorCategory.API,
        severity: ErrorSeverity.WARNING,
      });
    }
    
    throw error;
  }
};

/**
 * Get active surveys
 * @returns Promise that resolves with an array of active surveys
 */
export const getActiveSurveys = async (): Promise<Survey[]> => {
  // In a real implementation, this would fetch surveys from a server API
  // For now, we'll just return a mock survey
  
  const mockSurvey: Survey = {
    id: 'survey_1',
    title: 'KrishiMitra App Feedback',
    description: 'Please help us improve KrishiMitra by answering a few questions about your experience.',
    questions: [
      {
        id: 'q1',
        type: SurveyQuestionType.RATING,
        question: 'How would you rate your overall experience with KrishiMitra?',
        required: true,
        minRating: 1,
        maxRating: 5,
      },
      {
        id: 'q2',
        type: SurveyQuestionType.MULTIPLE_CHOICE,
        question: 'Which feature do you find most useful?',
        required: true,
        options: [
          'Weather Forecasts',
          'Crop Information',
          'Financial Services',
          'Market Prices',
          'Agricultural Advisories',
        ],
      },
      {
        id: 'q3',
        type: SurveyQuestionType.CHECKBOX,
        question: 'Which of the following features would you like to see added to KrishiMitra?',
        required: false,
        options: [
          'Soil Testing Information',
          'Pest Identification',
          'Crop Disease Diagnosis',
          'Equipment Rental',
          'Community Forums',
        ],
      },
      {
        id: 'q4',
        type: SurveyQuestionType.TEXT,
        question: 'Do you have any suggestions for improving KrishiMitra?',
        required: false,
        placeholder: 'Your suggestions here...',
      },
    ],
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    isActive: true,
    completionMessage: 'Thank you for completing our survey! Your feedback helps us improve KrishiMitra.',
  };
  
  return [mockSurvey];
};

/**
 * Check if a user has completed a survey
 * @param surveyId The ID of the survey
 * @returns Whether the user has completed the survey
 */
export const hasCompletedSurvey = (surveyId: string): boolean => {
  try {
    const completedSurveys = localStorage.getItem('krishimitra_completed_surveys');
    if (!completedSurveys) return false;
    
    const surveyList: string[] = JSON.parse(completedSurveys);
    return surveyList.includes(surveyId);
  } catch (error) {
    logError({
      message: 'Failed to check completed surveys',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
    
    return false;
  }
};

/**
 * Mark a survey as completed
 * @param surveyId The ID of the survey
 */
export const markSurveyAsCompleted = (surveyId: string): void => {
  try {
    const completedSurveys = localStorage.getItem('krishimitra_completed_surveys');
    const surveyList: string[] = completedSurveys ? JSON.parse(completedSurveys) : [];
    
    if (!surveyList.includes(surveyId)) {
      surveyList.push(surveyId);
      localStorage.setItem('krishimitra_completed_surveys', JSON.stringify(surveyList));
    }
  } catch (error) {
    logError({
      message: 'Failed to mark survey as completed',
      error: error as Error,
      category: ErrorCategory.STORAGE,
      severity: ErrorSeverity.WARNING,
    });
  }
};

/**
 * Sync pending feedback and survey responses when online
 */
export const syncPendingFeedback = async (): Promise<void> => {
  if (!isOnline()) return;
  
  // Sync pending feedback
  const pendingFeedback = getPendingFeedback();
  for (const feedback of pendingFeedback) {
    try {
      await submitFeedbackToServer(feedback);
      removeFeedbackFromLocalStorage(feedback.id!);
      
      // Track the event
      trackEvent({
        category: EventCategory.FEEDBACK,
        action: EventAction.SYNC_FEEDBACK,
        label: feedback.type,
      });
    } catch (error) {
      logError({
        message: 'Failed to sync pending feedback',
        error: error as Error,
        category: ErrorCategory.API,
        severity: ErrorSeverity.WARNING,
      });
    }
  }
  
  // Sync pending survey responses
  const pendingSurveyResponses = getPendingSurveyResponses();
  for (const response of pendingSurveyResponses) {
    try {
      await submitSurveyResponseToServer(response);
      removeSurveyResponseFromLocalStorage(response.id!);
      
      // Track the event
      trackEvent({
        category: EventCategory.FEEDBACK,
        action: EventAction.SYNC_SURVEY,
        label: response.surveyId,
      });
    } catch (error) {
      logError({
        message: 'Failed to sync pending survey response',
        error: error as Error,
        category: ErrorCategory.API,
        severity: ErrorSeverity.WARNING,
      });
    }
  }
};

/**
 * Initialize feedback system
 */
export const initFeedback = (): void => {
  // Add online listener to sync pending feedback
  window.addEventListener('online', () => {
    syncPendingFeedback().catch(error => {
      logError({
        message: 'Failed to sync pending feedback on online event',
        error: error as Error,
        category: ErrorCategory.API,
        severity: ErrorSeverity.WARNING,
      });
    });
  });
  
  // Try to sync any pending feedback on initialization
  syncPendingFeedback().catch(error => {
    logError({
      message: 'Failed to sync pending feedback on initialization',
      error: error as Error,
      category: ErrorCategory.API,
      severity: ErrorSeverity.WARNING,
    });
  });
};