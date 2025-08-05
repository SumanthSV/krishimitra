import { getLanguage } from '../utils/languageUtils.ts';

// Types for AI service
export interface AIQuery {
  text: string;
  language: string;
  location?: {
    state?: string;
    district?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  timestamp: number;
  id: string;
}

export interface AIResponse {
  text: string;
  sources?: string[];
  relatedQueries?: string[];
  timestamp: number;
  id: string;
}

export interface Conversation {
  query: AIQuery;
  response: AIResponse;
}

// Mock data for suggested queries (multilingual support)
const suggestedQueries = {
  en: [
    'When should I irrigate my wheat crop?',
    'What are the best practices for rice cultivation?',
    'How to protect crops from unseasonal rain?',
    'What government schemes are available for small farmers?',
    'How to apply for Kisan Credit Card?',
    'What are the signs of pest infestation in cotton?',
    'Best fertilizers for organic farming?',
    'How to increase soil fertility naturally?'
  ],
  hi: [
    'मैं अपनी गेहूं की फसल को कब सिंचाई करूं?',
    'चावल की खेती के लिए सर्वोत्तम प्रथाएं क्या हैं?',
    'मौसम के अनुसार बारिश से फसलों की रक्षा कैसे करें?',
    'छोटे किसानों के लिए कौन सी सरकारी योजनाएं उपलब्ध हैं?',
    'किसान क्रेडिट कार्ड के लिए आवेदन कैसे करें?',
    'कपास में कीट संक्रमण के संकेत क्या हैं?',
    'जैविक खेती के लिए सर्वोत्तम उर्वरक?',
    'मिट्टी की उर्वरता को प्राकृतिक रूप से कैसे बढ़ाएं?'
  ]
};

// Mock categories for query classification
const queryCategories = [
  'irrigation',
  'crop_management',
  'weather',
  'pest_control',
  'government_schemes',
  'finance',
  'soil_health',
  'market_prices',
  'equipment',
  'general'
];

// Mock knowledge base for offline responses
const knowledgeBase = {
  irrigation: {
    en: [
      'Irrigation should be done based on soil moisture levels and crop water requirements.',
      'For most crops, irrigate when the top 1-2 inches of soil feels dry to touch.',
      'Drip irrigation is more efficient than flood irrigation and can save up to 60% water.',
      'Early morning is the best time for irrigation to minimize evaporation losses.'
    ],
    hi: [
      'सिंचाई मिट्टी की नमी के स्तर और फसल की पानी की आवश्यकताओं के आधार पर की जानी चाहिए।',
      'अधिकांश फसलों के लिए, जब मिट्टी की ऊपरी 1-2 इंच परत छूने पर सूखी महसूस हो तब सिंचाई करें।',
      'ड्रिप सिंचाई बाढ़ सिंचाई की तुलना में अधिक कुशल है और 60% तक पानी बचा सकती है।',
      'वाष्पीकरण हानि को कम करने के लिए सुबह का समय सिंचाई के लिए सबसे अच्छा है।'
    ]
  },
  crop_management: {
    en: [
      'Crop rotation helps in maintaining soil fertility and reducing pest problems.',
      'Intercropping can maximize land use and provide natural pest control.',
      'Timely harvesting ensures better quality and higher market value.',
      'Proper spacing between plants ensures adequate sunlight and nutrient availability.'
    ],
    hi: [
      'फसल चक्र मिट्टी की उर्वरता बनाए रखने और कीट समस्याओं को कम करने में मदद करता है।',
      'अंतर-फसल भूमि उपयोग को अधिकतम कर सकती है और प्राकृतिक कीट नियंत्रण प्रदान कर सकती है।',
      'समय पर कटाई बेहतर गुणवत्ता और उच्च बाजार मूल्य सुनिश्चित करती है।',
      'पौधों के बीच उचित अंतर पर्याप्त धूप और पोषक तत्वों की उपलब्धता सुनिश्चित करता है।'
    ]
  },
  weather: {
    en: [
      'Monitor weather forecasts regularly to plan farming activities.',
      'Use shade nets to protect crops from extreme heat.',
      'Create drainage channels to manage excess rainwater.',
      'Windbreaks can protect crops from strong winds and reduce soil erosion.'
    ],
    hi: [
      'कृषि गतिविधियों की योजना बनाने के लिए नियमित रूप से मौसम पूर्वानुमान की निगरानी करें।',
      'अत्यधिक गर्मी से फसलों की रक्षा के लिए शेड नेट का उपयोग करें।',
      'अतिरिक्त बारिश के पानी का प्रबंधन करने के लिए जल निकासी चैनल बनाएं।',
      'विंडब्रेक्स फसलों को तेज हवाओं से बचा सकते हैं और मिट्टी के कटाव को कम कर सकते हैं।'
    ]
  }
};

// Function to get suggested queries based on language
export const getSuggestedQueries = (language: string = 'en'): string[] => {
  return suggestedQueries[language as keyof typeof suggestedQueries] || suggestedQueries.en;
};

// Function to classify query into a category
const classifyQuery = (query: string): string => {
  // In a real implementation, this would use NLP/ML to classify the query
  // For now, we'll use a simple keyword-based approach
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('irrigate') || lowerQuery.includes('water') || lowerQuery.includes('सिंचाई') || lowerQuery.includes('पानी')) {
    return 'irrigation';
  } else if (lowerQuery.includes('weather') || lowerQuery.includes('rain') || lowerQuery.includes('temperature') || lowerQuery.includes('मौसम') || lowerQuery.includes('बारिश') || lowerQuery.includes('तापमान')) {
    return 'weather';
  } else if (lowerQuery.includes('crop') || lowerQuery.includes('harvest') || lowerQuery.includes('plant') || lowerQuery.includes('फसल') || lowerQuery.includes('कटाई') || lowerQuery.includes('पौधा')) {
    return 'crop_management';
  }
  
  // Default category if no match found
  return 'general';
};

// Function to get related queries based on the current query
export const getRelatedQueries = (query: string, language: string = 'en'): string[] => {
  // In a real implementation, this would use semantic similarity
  // For now, return a subset of suggested queries
  const allQueries = getSuggestedQueries(language);
  return allQueries.slice(0, 3); // Return first 3 queries as related
};

// Main function to process a query and return a response
export const processQuery = async (query: AIQuery): Promise<AIResponse> => {
  try {
    // In a real implementation, this would call an AI model API
    // For now, we'll simulate a response based on query classification
    
    const category = classifyQuery(query.text);
    const language = query.language || 'en';
    
    // Get knowledge base responses for the category
    const knowledgeResponses = knowledgeBase[category as keyof typeof knowledgeBase]?.[language as 'en' | 'hi'] || 
                              knowledgeBase[category as keyof typeof knowledgeBase]?.en || 
                              ['I don\'t have specific information about that topic yet.'];
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a response
    const responseText = knowledgeResponses[Math.floor(Math.random() * knowledgeResponses.length)];
    
    // Get related queries
    const relatedQueries = getRelatedQueries(query.text, language);
    
    return {
      text: responseText,
      sources: ['Agricultural Knowledge Base', 'Weather Data', 'Crop Management Guidelines'],
      relatedQueries,
      timestamp: Date.now(),
      id: `response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  } catch (error) {
    console.error('Error processing query:', error);
    return {
      text: 'Sorry, I encountered an error while processing your query. Please try again.',
      timestamp: Date.now(),
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }
};

// Function to store conversation history in local storage
export const storeConversation = (conversation: Conversation): void => {
  try {
    // Get existing conversations from local storage
    const existingConversationsJSON = localStorage.getItem('conversations');
    const existingConversations: Conversation[] = existingConversationsJSON 
      ? JSON.parse(existingConversationsJSON) 
      : [];
    
    // Add new conversation
    existingConversations.unshift(conversation); // Add to beginning of array
    
    // Limit to last 50 conversations
    const limitedConversations = existingConversations.slice(0, 50);
    
    // Save back to local storage
    localStorage.setItem('conversations', JSON.stringify(limitedConversations));
  } catch (error) {
    console.error('Error storing conversation:', error);
  }
};

// Function to get conversation history from local storage
export const getConversationHistory = (): Conversation[] => {
  try {
    const conversationsJSON = localStorage.getItem('conversations');
    return conversationsJSON ? JSON.parse(conversationsJSON) : [];
  } catch (error) {
    console.error('Error retrieving conversations:', error);
    return [];
  }
};

// Function to clear conversation history
export const clearConversationHistory = (): void => {
  try {
    localStorage.removeItem('conversations');
  } catch (error) {
    console.error('Error clearing conversations:', error);
  }
};

// Function to get recent queries (just the query text)
export const getRecentQueries = (limit: number = 5): string[] => {
  const conversations = getConversationHistory();
  const language = getLanguage();
  
  // Extract unique query texts and limit to requested number
  const uniqueQueries = Array.from(new Set(
    conversations.map(conv => conv.query.text)
  )).slice(0, limit);
  
  return uniqueQueries;
};