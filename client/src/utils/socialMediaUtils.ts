// Utilities for social media integration

import { logError, ErrorCategory, ErrorSeverity } from './errorUtils';
import { trackEvent, EventCategory, EventAction } from './analyticsUtils';
import { getLanguage } from './languageUtils';
import { isOnline } from './offlineUtils';

// Social media platform types
export enum SocialMediaPlatform {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
  LINKEDIN = 'linkedin',
  PINTEREST = 'pinterest',
  KISAN_SUVIDHA = 'kisansuvidha',
  KISAN_YOJANA = 'kisanyojana',
}

// Social media action types
export enum SocialMediaAction {
  SHARE = 'share',
  FOLLOW = 'follow',
  LIKE = 'like',
  COMMENT = 'comment',
  JOIN_GROUP = 'joinGroup',
  WATCH_VIDEO = 'watchVideo',
  OPEN_PROFILE = 'openProfile',
}

// Social media content interface
export interface SocialMediaContent {
  title: string;
  text: string;
  url?: string;
  imageUrl?: string;
  hashtags?: string[];
  mentions?: string[];
}

// Social media profile interface
export interface SocialMediaProfile {
  platform: SocialMediaPlatform;
  name: string;
  url: string;
  handle?: string;
  description?: string;
  imageUrl?: string;
  followerCount?: number;
  isOfficial?: boolean;
}

// Social media group interface
export interface SocialMediaGroup {
  platform: SocialMediaPlatform;
  name: string;
  url: string;
  description?: string;
  memberCount?: number;
  imageUrl?: string;
  isPrivate?: boolean;
  category?: string;
}

// Social media video interface
export interface SocialMediaVideo {
  platform: SocialMediaPlatform;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  viewCount?: number;
  publishDate?: Date;
  channelName?: string;
  description?: string;
}

// Official KrishiMitra social media profiles
export const officialProfiles: SocialMediaProfile[] = [
  {
    platform: SocialMediaPlatform.FACEBOOK,
    name: 'KrishiMitra',
    url: 'https://facebook.com/krishimitra',
    handle: '@krishimitra',
    description: 'Official Facebook page for KrishiMitra - Your Farming Companion',
    isOfficial: true,
  },
  {
    platform: SocialMediaPlatform.TWITTER,
    name: 'KrishiMitra',
    url: 'https://twitter.com/krishimitra',
    handle: '@krishimitra',
    description: 'Official Twitter account for KrishiMitra - Your Farming Companion',
    isOfficial: true,
  },
  {
    platform: SocialMediaPlatform.INSTAGRAM,
    name: 'KrishiMitra',
    url: 'https://instagram.com/krishimitra',
    handle: '@krishimitra',
    description: 'Official Instagram account for KrishiMitra - Your Farming Companion',
    isOfficial: true,
  },
  {
    platform: SocialMediaPlatform.YOUTUBE,
    name: 'KrishiMitra',
    url: 'https://youtube.com/c/krishimitra',
    description: 'Official YouTube channel for KrishiMitra - Your Farming Companion',
    isOfficial: true,
  },
  {
    platform: SocialMediaPlatform.WHATSAPP,
    name: 'KrishiMitra Community',
    url: 'https://chat.whatsapp.com/krishimitra',
    description: 'Official WhatsApp community for KrishiMitra users',
    isOfficial: true,
  },
  {
    platform: SocialMediaPlatform.TELEGRAM,
    name: 'KrishiMitra Channel',
    url: 'https://t.me/krishimitra',
    description: 'Official Telegram channel for KrishiMitra updates',
    isOfficial: true,
  },
];

// Recommended farmer groups
export const recommendedGroups: SocialMediaGroup[] = [
  {
    platform: SocialMediaPlatform.FACEBOOK,
    name: 'Indian Farmers Community',
    url: 'https://facebook.com/groups/indianfarmers',
    description: 'A community of Indian farmers sharing knowledge and experiences',
    memberCount: 25000,
    category: 'General Farming',
  },
  {
    platform: SocialMediaPlatform.FACEBOOK,
    name: 'Organic Farming India',
    url: 'https://facebook.com/groups/organicfarmingindia',
    description: 'Group dedicated to organic farming practices in India',
    memberCount: 15000,
    category: 'Organic Farming',
  },
  {
    platform: SocialMediaPlatform.WHATSAPP,
    name: 'Kisan Network',
    url: 'https://chat.whatsapp.com/kisannetwork',
    description: 'WhatsApp group for farmers to connect and share information',
    memberCount: 5000,
    category: 'Networking',
  },
  {
    platform: SocialMediaPlatform.TELEGRAM,
    name: 'Kisan Suvidha',
    url: 'https://t.me/kisansuvidha',
    description: 'Telegram group for agricultural updates and government schemes',
    memberCount: 10000,
    category: 'Government Schemes',
  },
];

// Educational farming videos
export const educationalVideos: SocialMediaVideo[] = [
  {
    platform: SocialMediaPlatform.YOUTUBE,
    title: 'Modern Farming Techniques for Indian Farmers',
    url: 'https://youtube.com/watch?v=example1',
    duration: 1200, // 20 minutes in seconds
    channelName: 'Agricultural Science',
    description: 'Learn about modern farming techniques suitable for Indian agriculture',
  },
  {
    platform: SocialMediaPlatform.YOUTUBE,
    title: 'Organic Pest Control Methods',
    url: 'https://youtube.com/watch?v=example2',
    duration: 900, // 15 minutes in seconds
    channelName: 'Organic Farming India',
    description: 'Natural and organic methods to control pests in your crops',
  },
  {
    platform: SocialMediaPlatform.YOUTUBE,
    title: 'Water Conservation Techniques for Farming',
    url: 'https://youtube.com/watch?v=example3',
    duration: 1500, // 25 minutes in seconds
    channelName: 'Sustainable Agriculture',
    description: 'Effective water conservation methods for agricultural use',
  },
  {
    platform: SocialMediaPlatform.FACEBOOK,
    title: 'Understanding Soil Health',
    url: 'https://facebook.com/watch?v=example4',
    duration: 600, // 10 minutes in seconds
    channelName: 'Soil Science Institute',
    description: 'Learn how to test and improve your soil health for better crop yields',
  },
];

// Translations for social media messages
const socialMediaTranslations: Record<string, Record<string, string>> = {
  followSuccess: {
    en: 'Now following {name} on {platform}',
    hi: 'अब {platform} पर {name} का अनुसरण कर रहे हैं',
    pa: 'ਹੁਣ {platform} 'ਤੇ {name} ਦੀ ਪਾਲਣਾ ਕਰ ਰਹੇ ਹਾਂ',
    bn: 'এখন {platform} এ {name} অনুসরণ করছেন',
    te: 'ఇప్పుడు {platform}లో {name}ని అనుసరిస్తున్నారు',
    ta: 'இப்போது {platform} இல் {name} ஐப் பின்தொடர்கிறது',
    mr: 'आता {platform} वर {name} चे अनुसरण करत आहे',
    gu: 'હવે {platform} પર {name} ને અનુસરી રહ્યા છે',
    kn: 'ಈಗ {platform} ನಲ್ಲಿ {name} ಅನ್ನು ಅನುಸರಿಸಲಾಗುತ್ತಿದೆ',
    ml: 'ഇപ്പോൾ {platform} ൽ {name} പിന്തുടരുന്നു',
  },
  joinGroupSuccess: {
    en: 'Successfully joined {name} group on {platform}',
    hi: '{platform} पर {name} समूह में सफलतापूर्वक शामिल हुए',
    pa: '{platform} 'ਤੇ {name} ਸਮੂਹ ਵਿੱਚ ਸਫਲਤਾਪੂਰਵਕ ਸ਼ਾਮਲ ਹੋਏ',
    bn: '{platform} এ {name} গ্রুপে সফলভাবে যোগ দিয়েছেন',
    te: '{platform}లో {name} సమూహంలో విజయవంతంగా చేరారు',
    ta: '{platform} இல் {name} குழுவில் வெற்றிகரமாக சேர்ந்தது',
    mr: '{platform} वर {name} गटात यशस्वीरित्या सामील झाले',
    gu: '{platform} પર {name} જૂથમાં સફળતાપૂર્વક જોડાયા',
    kn: '{platform} ನಲ್ಲಿ {name} ಗುಂಪಿಗೆ ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಕೊಂಡಿದೆ',
    ml: '{platform} ൽ {name} ഗ്രൂപ്പിൽ വിജയകരമായി ചേർന്നു',
  },
  shareSuccess: {
    en: 'Successfully shared on {platform}',
    hi: '{platform} पर सफलतापूर्वक साझा किया गया',
    pa: '{platform} 'ਤੇ ਸਫਲਤਾਪੂਰਵਕ ਸਾਂਝਾ ਕੀਤਾ ਗਿਆ',
    bn: '{platform} এ সফলভাবে শেয়ার করা হয়েছে',
    te: '{platform}లో విజయవంతంగా భాగస్వామ్యం చేయబడింది',
    ta: '{platform} இல் வெற்றிகரமாக பகிரப்பட்டது',
    mr: '{platform} वर यशस्वीरित्या शेअर केले',
    gu: '{platform} પર સફળતાપૂર્વક શેર કર્યું',
    kn: '{platform} ನಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ',
    ml: '{platform} ൽ വിജയകരമായി പങ്കിട്ടു',
  },
  actionError: {
    en: 'Failed to perform action on {platform}',
    hi: '{platform} पर कार्रवाई करने में विफल',
    pa: '{platform} 'ਤੇ ਕਾਰਵਾਈ ਕਰਨ ਵਿੱਚ ਅਸਫਲ',
    bn: '{platform} এ কার্য সম্পাদন করতে ব্যর্থ হয়েছে',
    te: '{platform}లో చర్యను నిర్వహించడంలో విఫలమైంది',
    ta: '{platform} இல் செயல்பாட்டை செய்ய முடியவில்லை',
    mr: '{platform} वर क्रिया करण्यात अयशस्वी',
    gu: '{platform} પર ક્રિયા કરવામાં નિષ્ફળ',
    kn: '{platform} ನಲ್ಲಿ ಕ್ರಿಯೆಯನ್ನು ನಿರ್ವಹಿಸಲು ವಿಫಲವಾಗಿದೆ',
    ml: '{platform} ൽ പ്രവർത്തനം നടത്തുന്നതിൽ പരാജയപ്പെട്ടു',
  },
  offlineError: {
    en: 'Cannot perform social media actions while offline',
    hi: 'ऑफलाइन होने पर सोशल मीडिया कार्रवाई नहीं की जा सकती',
    pa: 'ਆਫਲਾਈਨ ਹੋਣ ਵੇਲੇ ਸੋਸ਼ਲ ਮੀਡੀਆ ਕਾਰਵਾਈਆਂ ਨਹੀਂ ਕੀਤੀਆਂ ਜਾ ਸਕਦੀਆਂ',
    bn: 'অফলাইন থাকাকালীন সোশ্যাল মিডিয়া কার্যক্রম সম্পাদন করা যাবে না',
    te: 'ఆఫ్‌లైన్‌లో ఉన్నప్పుడు సోషల్ మీడియా చర్యలను నిర్వహించలేరు',
    ta: 'ஆஃப்லைனில் இருக்கும்போது சமூக ஊடக செயல்களை செய்ய முடியாது',
    mr: 'ऑफलाइन असताना सोशल मीडिया क्रिया करू शकत नाही',
    gu: 'ઑફલાઇન હોય ત્યારે સોશિયલ મીડિયા ક્રિયાઓ કરી શકાતી નથી',
    kn: 'ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿರುವಾಗ ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ ಕ್ರಿಯೆಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ',
    ml: 'ഓഫ്‌ലൈനിൽ ആയിരിക്കുമ്പോൾ സോഷ്യൽ മീഡിയ പ്രവർത്തനങ്ങൾ നടത്താൻ കഴിയില്ല',
  },
  watchVideo: {
    en: 'Watch video: {title}',
    hi: 'वीडियो देखें: {title}',
    pa: 'ਵੀਡੀਓ ਦੇਖੋ: {title}',
    bn: 'ভিডিও দেখুন: {title}',
    te: 'వీడియో చూడండి: {title}',
    ta: 'வீடியோவைப் பார்க்கவும்: {title}',
    mr: 'व्हिडिओ पहा: {title}',
    gu: 'વિડિઓ જુઓ: {title}',
    kn: 'ವೀಡಿಯೊ ವೀಕ್ಷಿಸಿ: {title}',
    ml: 'വീഡിയോ കാണുക: {title}',
  },
};

/**
 * Get a translated social media message
 * @param key The translation key
 * @param params Optional parameters to replace in the message
 * @returns The translated message
 */
export const getSocialMediaMessage = (key: string, params?: Record<string, any>): string => {
  const language = getLanguage();
  let message = socialMediaTranslations[key]?.[language] || socialMediaTranslations[key]?.['en'] || key;
  
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      message = message.replace(`{${param}}`, value.toString());
    });
  }
  
  return message;
};

/**
 * Format hashtags for social media
 * @param hashtags Array of hashtags without the # symbol
 * @returns Formatted hashtag string
 */
export const formatHashtags = (hashtags: string[]): string => {
  return hashtags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');
};

/**
 * Format mentions for social media
 * @param mentions Array of mentions without the @ symbol
 * @returns Formatted mention string
 */
export const formatMentions = (mentions: string[]): string => {
  return mentions.map(mention => `@${mention.replace(/\s+/g, '')}`).join(' ');
};

/**
 * Share content on Facebook
 * @param content The content to share
 */
export const shareOnFacebook = (content: SocialMediaContent): void => {
  if (!isOnline()) {
    throw new Error(getSocialMediaMessage('offlineError'));
  }
  
  try {
    let shareUrl = 'https://www.facebook.com/sharer/sharer.php?';
    const params = new URLSearchParams();
    
    if (content.url) {
      params.append('u', content.url);
    }
    
    if (content.text) {
      params.append('quote', content.text);
      
      if (content.hashtags && content.hashtags.length > 0) {
        params.append('hashtag', formatHashtags([content.hashtags[0]]));
      }
    }
    
    shareUrl += params.toString();
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    // Track the event
    trackEvent({
      category: EventCategory.SOCIAL_MEDIA,
      action: EventAction.SHARE_CONTENT,
      label: `facebook:${content.title}`,
    });
  } catch (error) {
    logError({
      message: 'Failed to share content on Facebook',
      error: error as Error,
      category: ErrorCategory.SOCIAL_MEDIA,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Share content on Twitter
 * @param content The content to share
 */
export const shareOnTwitter = (content: SocialMediaContent): void => {
  if (!isOnline()) {
    throw new Error(getSocialMediaMessage('offlineError'));
  }
  
  try {
    let shareUrl = 'https://twitter.com/intent/tweet?';
    const params = new URLSearchParams();
    
    let text = content.text;
    
    if (content.hashtags && content.hashtags.length > 0) {
      text += ' ' + formatHashtags(content.hashtags);
    }
    
    if (content.mentions && content.mentions.length > 0) {
      text += ' ' + formatMentions(content.mentions);
    }
    
    params.append('text', text);
    
    if (content.url) {
      params.append('url', content.url);
    }
    
    shareUrl += params.toString();
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    // Track the event
    trackEvent({
      category: EventCategory.SOCIAL_MEDIA,
      action: EventAction.SHARE_CONTENT,
      label: `twitter:${content.title}`,
    });
  } catch (error) {
    logError({
      message: 'Failed to share content on Twitter',
      error: error as Error,
      category: ErrorCategory.SOCIAL_MEDIA,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Share content on WhatsApp
 * @param content The content to share
 */
export const shareOnWhatsApp = (content: SocialMediaContent): void => {
  if (!isOnline()) {
    throw new Error(getSocialMediaMessage('offlineError'));
  }
  
  try {
    let shareUrl = 'https://wa.me/?';
    const params = new URLSearchParams();
    
    let text = content.text;
    
    if (content.url) {
      text += `\n${content.url}`;
    }
    
    if (content.hashtags && content.hashtags.length > 0) {
      text += ' ' + formatHashtags(content.hashtags);
    }
    
    params.append('text', text);
    
    shareUrl += params.toString();
    
    window.open(shareUrl, '_blank');
    
    // Track the event
    trackEvent({
      category: EventCategory.SOCIAL_MEDIA,
      action: EventAction.SHARE_CONTENT,
      label: `whatsapp:${content.title}`,
    });
  } catch (error) {
    logError({
      message: 'Failed to share content on WhatsApp',
      error: error as Error,
      category: ErrorCategory.SOCIAL_MEDIA,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Share content on LinkedIn
 * @param content The content to share
 */
export const shareOnLinkedIn = (content: SocialMediaContent): void => {
  if (!isOnline()) {
    throw new Error(getSocialMediaMessage('offlineError'));
  }
  
  try {
    let shareUrl = 'https://www.linkedin.com/shareArticle?';
    const params = new URLSearchParams();
    
    params.append('mini', 'true');
    
    if (content.url) {
      params.append('url', content.url);
    }
    
    if (content.title) {
      params.append('title', content.title);
    }
    
    if (content.text) {
      params.append('summary', content.text);
    }
    
    params.append('source', 'KrishiMitra App');
    
    shareUrl += params.toString();
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    // Track the event
    trackEvent({
      category: EventCategory.SOCIAL_MEDIA,
      action: EventAction.SHARE_CONTENT,
      label: `linkedin:${content.title}`,
    });
  } catch (error) {
    logError({
      message: 'Failed to share content on LinkedIn',
      error: error as Error,
      category: ErrorCategory.SOCIAL_MEDIA,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Share content on Telegram
 * @param content The content to share
 */
export const shareOnTelegram = (content: SocialMediaContent): void => {
  if (!isOnline()) {
    throw new Error(getSocialMediaMessage('offlineError'));
  }
  
  try {
    let shareUrl = 'https://t.me/share/url?';
    const params = new URLSearchParams();
    
    if (content.url) {
      params.append('url', content.url);
    }
    
    if (content.text) {
      params.append('text', content.text);
    }
    
    shareUrl += params.toString();
    
    window.open(shareUrl, '_blank');
    
    // Track the event
    trackEvent({
      category: EventCategory.SOCIAL_MEDIA,
      action: EventAction.SHARE_CONTENT,
      label: `telegram:${content.title}`,
    });
  } catch (error) {
    logError({
      message: 'Failed to share content on Telegram',
      error: error as Error,
      category: ErrorCategory.SOCIAL_MEDIA,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Open a social media profile
 * @param profile The social media profile to open
 */
export const openSocialMediaProfile = (profile: SocialMediaProfile): void => {
  if (!isOnline()) {
    throw new Error(getSocialMediaMessage('offlineError'));
  }
  
  try {
    window.open(profile.url, '_blank');
    
    // Track the event
    trackEvent({
      category: EventCategory.SOCIAL_MEDIA,
      action: EventAction.OPEN_PROFILE,
      label: `${profile.platform}:${profile.name}`,
    });
  } catch (error) {
    logError({
      message: `Failed to open ${profile.platform} profile`,
      error: error as Error,
      category: ErrorCategory.SOCIAL_MEDIA,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Join a social media group
 * @param group The social media group to join
 */
export const joinSocialMediaGroup = (group: SocialMediaGroup): void => {
  if (!isOnline()) {
    throw new Error(getSocialMediaMessage('offlineError'));
  }
  
  try {
    window.open(group.url, '_blank');
    
    // Track the event
    trackEvent({
      category: EventCategory.SOCIAL_MEDIA,
      action: EventAction.JOIN_GROUP,
      label: `${group.platform}:${group.name}`,
    });
  } catch (error) {
    logError({
      message: `Failed to join ${group.platform} group`,
      error: error as Error,
      category: ErrorCategory.SOCIAL_MEDIA,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Watch a social media video
 * @param video The social media video to watch
 */
export const watchSocialMediaVideo = (video: SocialMediaVideo): void => {
  if (!isOnline()) {
    throw new Error(getSocialMediaMessage('offlineError'));
  }
  
  try {
    window.open(video.url, '_blank');
    
    // Track the event
    trackEvent({
      category: EventCategory.SOCIAL_MEDIA,
      action: EventAction.WATCH_VIDEO,
      label: `${video.platform}:${video.title}`,
    });
  } catch (error) {
    logError({
      message: `Failed to watch ${video.platform} video`,
      error: error as Error,
      category: ErrorCategory.SOCIAL_MEDIA,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Share content on a specific social media platform
 * @param content The content to share
 * @param platform The platform to share on
 */
export const shareOnPlatform = (content: SocialMediaContent, platform: SocialMediaPlatform): void => {
  if (!isOnline()) {
    throw new Error(getSocialMediaMessage('offlineError'));
  }
  
  try {
    switch (platform) {
      case SocialMediaPlatform.FACEBOOK:
        shareOnFacebook(content);
        break;
        
      case SocialMediaPlatform.TWITTER:
        shareOnTwitter(content);
        break;
        
      case SocialMediaPlatform.WHATSAPP:
        shareOnWhatsApp(content);
        break;
        
      case SocialMediaPlatform.LINKEDIN:
        shareOnLinkedIn(content);
        break;
        
      case SocialMediaPlatform.TELEGRAM:
        shareOnTelegram(content);
        break;
        
      default:
        throw new Error(`Sharing on ${platform} is not supported`);
    }
  } catch (error) {
    logError({
      message: `Failed to share content on ${platform}`,
      error: error as Error,
      category: ErrorCategory.SOCIAL_MEDIA,
      severity: ErrorSeverity.WARNING,
    });
    
    throw error;
  }
};

/**
 * Get available social media platforms for sharing
 * @returns Array of available social media platforms
 */
export const getAvailableSharingPlatforms = (): SocialMediaPlatform[] => {
  if (!isOnline()) {
    return [];
  }
  
  // These platforms are always available for sharing when online
  return [
    SocialMediaPlatform.FACEBOOK,
    SocialMediaPlatform.TWITTER,
    SocialMediaPlatform.WHATSAPP,
    SocialMediaPlatform.LINKEDIN,
    SocialMediaPlatform.TELEGRAM,
  ];
};

/**
 * Get recommended social media profiles based on user interests
 * @param interests Array of user interests
 * @returns Array of recommended social media profiles
 */
export const getRecommendedProfiles = (interests: string[]): SocialMediaProfile[] => {
  // Start with official profiles
  const recommendations = [...officialProfiles];
  
  // In a real implementation, this would filter and sort profiles based on user interests
  // For now, we just return the official profiles
  
  return recommendations;
};

/**
 * Get recommended social media groups based on user interests
 * @param interests Array of user interests
 * @returns Array of recommended social media groups
 */
export const getRecommendedGroups = (interests: string[]): SocialMediaGroup[] => {
  // Filter groups based on user interests
  let filteredGroups = [...recommendedGroups];
  
  if (interests && interests.length > 0) {
    // In a real implementation, this would filter groups based on user interests
    // For now, we just return all groups
  }
  
  return filteredGroups;
};

/**
 * Get recommended videos based on user interests
 * @param interests Array of user interests
 * @returns Array of recommended social media videos
 */
export const getRecommendedVideos = (interests: string[]): SocialMediaVideo[] => {
  // Filter videos based on user interests
  let filteredVideos = [...educationalVideos];
  
  if (interests && interests.length > 0) {
    // In a real implementation, this would filter videos based on user interests
    // For now, we just return all videos
  }
  
  return filteredVideos;
};

/**
 * Format duration in seconds to a human-readable format
 * @param seconds Duration in seconds
 * @returns Formatted duration string (e.g., "5:30")
 */
export const formatVideoDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Check if a URL is a valid social media profile URL
 * @param url The URL to check
 * @returns Whether the URL is a valid social media profile URL
 */
export const isValidSocialMediaUrl = (url: string): boolean => {
  // Basic validation for common social media domains
  const socialMediaDomains = [
    'facebook.com',
    'twitter.com',
    'instagram.com',
    'youtube.com',
    'linkedin.com',
    't.me',
    'wa.me',
    'pinterest.com',
  ];
  
  try {
    const urlObj = new URL(url);
    return socialMediaDomains.some(domain => urlObj.hostname.includes(domain));
  } catch (error) {
    return false;
  }
};

/**
 * Determine the social media platform from a URL
 * @param url The URL to check
 * @returns The social media platform or undefined if not recognized
 */
export const getPlatformFromUrl = (url: string): SocialMediaPlatform | undefined => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    if (hostname.includes('facebook.com')) {
      return SocialMediaPlatform.FACEBOOK;
    } else if (hostname.includes('twitter.com')) {
      return SocialMediaPlatform.TWITTER;
    } else if (hostname.includes('instagram.com')) {
      return SocialMediaPlatform.INSTAGRAM;
    } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return SocialMediaPlatform.YOUTUBE;
    } else if (hostname.includes('wa.me') || hostname.includes('whatsapp.com')) {
      return SocialMediaPlatform.WHATSAPP;
    } else if (hostname.includes('t.me') || hostname.includes('telegram.org')) {
      return SocialMediaPlatform.TELEGRAM;
    } else if (hostname.includes('linkedin.com')) {
      return SocialMediaPlatform.LINKEDIN;
    } else if (hostname.includes('pinterest.com')) {
      return SocialMediaPlatform.PINTEREST;
    }
    
    return undefined;
  } catch (error) {
    return undefined;
  }
};