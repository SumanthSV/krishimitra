import { getLanguage } from '../utils/languageUtils';

// Types for weather data
export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_dir: string;
    humidity: number;
    precip_mm: number;
    feelslike_c: number;
    uv: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        totalPrecip_mm: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      };
      astro: {
        sunrise: string;
        sunset: string;
      };
    }>;
  };
  lastUpdated: number;
}

// Types for agricultural advisories based on weather
export interface AgriculturalAdvisory {
  id: string;
  title: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  applicableCrops: string[];
  weatherCondition: string;
  severity: 'low' | 'medium' | 'high';
  actions: {
    en: string[];
    hi: string[];
  };
}

// Mock weather data for offline use
const mockWeatherData: WeatherData = {
  location: {
    name: 'New Delhi',
    region: 'Delhi',
    country: 'India',
    lat: 28.61,
    lon: 77.23,
  },
  current: {
    temp_c: 32,
    temp_f: 89.6,
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      code: 1003,
    },
    wind_kph: 15,
    wind_dir: 'NW',
    humidity: 65,
    precip_mm: 0,
    feelslike_c: 34,
    uv: 6,
  },
  forecast: {
    forecastday: [
      {
        date: '2023-06-01',
        day: {
          maxtemp_c: 34,
          mintemp_c: 26,
          avgtemp_c: 30,
          totalPrecip_mm: 0,
          condition: {
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
            code: 1000,
          },
        },
        astro: {
          sunrise: '05:30 AM',
          sunset: '07:15 PM',
        },
      },
      {
        date: '2023-06-02',
        day: {
          maxtemp_c: 36,
          mintemp_c: 27,
          avgtemp_c: 31.5,
          totalPrecip_mm: 0,
          condition: {
            text: 'Partly cloudy',
            icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
            code: 1003,
          },
        },
        astro: {
          sunrise: '05:30 AM',
          sunset: '07:16 PM',
        },
      },
      {
        date: '2023-06-03',
        day: {
          maxtemp_c: 35,
          mintemp_c: 28,
          avgtemp_c: 31.5,
          totalPrecip_mm: 2.5,
          condition: {
            text: 'Patchy rain possible',
            icon: '//cdn.weatherapi.com/weather/64x64/day/176.png',
            code: 1063,
          },
        },
        astro: {
          sunrise: '05:29 AM',
          sunset: '07:16 PM',
        },
      },
      {
        date: '2023-06-04',
        day: {
          maxtemp_c: 33,
          mintemp_c: 27,
          avgtemp_c: 30,
          totalPrecip_mm: 8.2,
          condition: {
            text: 'Moderate rain',
            icon: '//cdn.weatherapi.com/weather/64x64/day/302.png',
            code: 1189,
          },
        },
        astro: {
          sunrise: '05:29 AM',
          sunset: '07:17 PM',
        },
      },
      {
        date: '2023-06-05',
        day: {
          maxtemp_c: 31,
          mintemp_c: 26,
          avgtemp_c: 28.5,
          totalPrecip_mm: 12.4,
          condition: {
            text: 'Heavy rain',
            icon: '//cdn.weatherapi.com/weather/64x64/day/308.png',
            code: 1195,
          },
        },
        astro: {
          sunrise: '05:29 AM',
          sunset: '07:17 PM',
        },
      },
      {
        date: '2023-06-06',
        day: {
          maxtemp_c: 30,
          mintemp_c: 25,
          avgtemp_c: 27.5,
          totalPrecip_mm: 6.8,
          condition: {
            text: 'Moderate rain',
            icon: '//cdn.weatherapi.com/weather/64x64/day/302.png',
            code: 1189,
          },
        },
        astro: {
          sunrise: '05:29 AM',
          sunset: '07:18 PM',
        },
      },
      {
        date: '2023-06-07',
        day: {
          maxtemp_c: 32,
          mintemp_c: 26,
          avgtemp_c: 29,
          totalPrecip_mm: 0.5,
          condition: {
            text: 'Patchy rain possible',
            icon: '//cdn.weatherapi.com/weather/64x64/day/176.png',
            code: 1063,
          },
        },
        astro: {
          sunrise: '05:28 AM',
          sunset: '07:18 PM',
        },
      },
    ],
  },
  lastUpdated: Date.now(),
};

// Mock agricultural advisories
const mockAdvisories: AgriculturalAdvisory[] = [
  {
    id: 'adv-001',
    title: {
      en: 'Heavy Rainfall Alert',
      hi: 'भारी वर्षा चेतावनी',
    },
    description: {
      en: 'Heavy rainfall expected in the next 48 hours. Take necessary precautions to protect your crops.',
      hi: 'अगले 48 घंटों में भारी वर्षा की संभावना है। अपनी फसलों की सुरक्षा के लिए आवश्यक सावधानियां बरतें।',
    },
    applicableCrops: ['rice', 'wheat', 'vegetables'],
    weatherCondition: 'heavy_rain',
    severity: 'high',
    actions: {
      en: [
        'Ensure proper drainage in the field',
        'Postpone fertilizer application',
        'Secure young plants with additional support',
        'Harvest mature crops if possible',
      ],
      hi: [
        'खेत में उचित जल निकासी सुनिश्चित करें',
        'उर्वरक के प्रयोग को स्थगित करें',
        'युवा पौधों को अतिरिक्त सहारा देकर सुरक्षित करें',
        'यदि संभव हो तो परिपक्व फसलों की कटाई करें',
      ],
    },
  },
  {
    id: 'adv-002',
    title: {
      en: 'Heat Wave Warning',
      hi: 'लू की चेतावनी',
    },
    description: {
      en: 'Heat wave conditions expected with temperatures rising above 40°C. Protect crops and livestock.',
      hi: 'तापमान 40°C से ऊपर जाने के साथ लू की स्थिति की उम्मीद है। फसलों और पशुधन की रक्षा करें।',
    },
    applicableCrops: ['all'],
    weatherCondition: 'extreme_heat',
    severity: 'high',
    actions: {
      en: [
        'Increase frequency of irrigation',
        'Apply mulch to conserve soil moisture',
        'Create shade for sensitive crops',
        'Irrigate during early morning or evening',
        'Ensure livestock have access to shade and water',
      ],
      hi: [
        'सिंचाई की आवृत्ति बढ़ाएं',
        'मिट्टी की नमी संरक्षित करने के लिए मल्च लगाएं',
        'संवेदनशील फसलों के लिए छाया बनाएं',
        'सुबह जल्दी या शाम के समय सिंचाई करें',
        'सुनिश्चित करें कि पशुओं को छाया और पानी उपलब्ध हो',
      ],
    },
  },
  {
    id: 'adv-003',
    title: {
      en: 'Optimal Sowing Conditions',
      hi: 'अनुकूल बुवाई परिस्थितियां',
    },
    description: {
      en: 'Current weather conditions are optimal for sowing of kharif crops. Prepare your fields accordingly.',
      hi: 'वर्तमान मौसम की स्थिति खरीफ फसलों की बुवाई के लिए अनुकूल है। अपने खेतों को तदनुसार तैयार करें।',
    },
    applicableCrops: ['rice', 'maize', 'soybean', 'cotton'],
    weatherCondition: 'moderate_rain',
    severity: 'low',
    actions: {
      en: [
        'Complete field preparation',
        'Ensure quality seeds are available',
        'Follow recommended seed treatment practices',
        'Maintain optimal spacing between plants',
        'Apply basal dose of fertilizers as recommended',
      ],
      hi: [
        'खेत की तैयारी पूरी करें',
        'सुनिश्चित करें कि गुणवत्तापूर्ण बीज उपलब्ध हैं',
        'अनुशंसित बीज उपचार प्रथाओं का पालन करें',
        'पौधों के बीच इष्टतम दूरी बनाए रखें',
        'अनुशंसित अनुसार उर्वरकों की आधार खुराक लागू करें',
      ],
    },
  },
];

// Function to fetch weather data from API
export const fetchWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  try {
    // In a real implementation, this would call a weather API
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data with updated timestamp
    return {
      ...mockWeatherData,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Function to get weather data (tries online first, falls back to cached data)
export const getWeatherData = async (latitude: number, longitude: number): Promise<{ data: WeatherData, isOffline: boolean }> => {
  try {
    // Try to fetch fresh data
    const freshData = await fetchWeatherData(latitude, longitude);
    
    // Store in local storage for offline use
    localStorage.setItem('weatherData', JSON.stringify(freshData));
    
    return { data: freshData, isOffline: false };
  } catch (error) {
    console.warn('Failed to fetch weather data, using cached data:', error);
    
    // Try to get cached data
    const cachedDataJson = localStorage.getItem('weatherData');
    if (cachedDataJson) {
      const cachedData: WeatherData = JSON.parse(cachedDataJson);
      return { data: cachedData, isOffline: true };
    }
    
    // If no cached data, return mock data
    return { data: mockWeatherData, isOffline: true };
  }
};

// Function to get agricultural advisories based on weather conditions
export const getAgriculturalAdvisories = (weatherData: WeatherData): AgriculturalAdvisory[] => {
  // In a real implementation, this would analyze weather data and return relevant advisories
  // For now, we'll return mock advisories
  
  // Check if there's heavy rain in the forecast
  const hasHeavyRain = weatherData.forecast.forecastday.some(
    day => day.day.totalPrecip_mm > 10 || day.day.condition.text.toLowerCase().includes('heavy rain')
  );
  
  // Check if there's extreme heat
  const hasExtremeHeat = weatherData.forecast.forecastday.some(
    day => day.day.maxtemp_c > 38
  );
  
  // Check if there's moderate rain (good for sowing)
  const hasModerateRain = weatherData.forecast.forecastday.some(
    day => day.day.totalPrecip_mm > 2 && day.day.totalPrecip_mm < 10
  );
  
  // Filter advisories based on conditions
  const relevantAdvisories: AgriculturalAdvisory[] = [];
  
  if (hasHeavyRain) {
    relevantAdvisories.push(
      ...mockAdvisories.filter(adv => adv.weatherCondition === 'heavy_rain')
    );
  }
  
  if (hasExtremeHeat) {
    relevantAdvisories.push(
      ...mockAdvisories.filter(adv => adv.weatherCondition === 'extreme_heat')
    );
  }
  
  if (hasModerateRain) {
    relevantAdvisories.push(
      ...mockAdvisories.filter(adv => adv.weatherCondition === 'moderate_rain')
    );
  }
  
  return relevantAdvisories;
};

// Function to get weather-based crop recommendations
export const getWeatherBasedCropRecommendations = (weatherData: WeatherData): { crop: string, suitability: number, reason: string }[] => {
  // In a real implementation, this would analyze weather patterns and soil data
  // For now, we'll return mock recommendations
  
  const avgTemp = weatherData.forecast.forecastday.reduce(
    (sum, day) => sum + day.day.avgtemp_c, 0
  ) / weatherData.forecast.forecastday.length;
  
  const totalRainfall = weatherData.forecast.forecastday.reduce(
    (sum, day) => sum + day.day.totalPrecip_mm, 0
  );
  
  const recommendations = [
    {
      crop: 'Rice',
      suitability: totalRainfall > 20 ? 90 : 60,
      reason: totalRainfall > 20 
        ? 'Good rainfall expected, suitable for rice cultivation' 
        : 'Rainfall may be insufficient, consider irrigation'
    },
    {
      crop: 'Wheat',
      suitability: avgTemp < 30 ? 85 : 50,
      reason: avgTemp < 30 
        ? 'Temperature conditions are favorable for wheat' 
        : 'Temperature may be too high for optimal wheat growth'
    },
    {
      crop: 'Maize',
      suitability: (avgTemp > 25 && avgTemp < 35 && totalRainfall > 10) ? 95 : 70,
      reason: (avgTemp > 25 && avgTemp < 35 && totalRainfall > 10) 
        ? 'Temperature and rainfall conditions are ideal for maize' 
        : 'Conditions are acceptable but not optimal for maize'
    },
    {
      crop: 'Cotton',
      suitability: (avgTemp > 30 && totalRainfall < 15) ? 90 : 65,
      reason: (avgTemp > 30 && totalRainfall < 15) 
        ? 'Warm and relatively dry conditions favor cotton growth' 
        : 'Conditions may lead to disease pressure in cotton'
    },
    {
      crop: 'Soybean',
      suitability: (avgTemp > 20 && avgTemp < 30 && totalRainfall > 15) ? 85 : 60,
      reason: (avgTemp > 20 && avgTemp < 30 && totalRainfall > 15) 
        ? 'Temperature and moisture conditions are good for soybean' 
        : 'Conditions are suboptimal for soybean growth'
    }
  ];
  
  // Sort by suitability (highest first)
  return recommendations.sort((a, b) => b.suitability - a.suitability);
};

// Function to get weather impact on current crops
export const getWeatherImpactOnCrops = (weatherData: WeatherData, crops: string[]): { crop: string, impact: 'positive' | 'neutral' | 'negative', description: string }[] => {
  // In a real implementation, this would analyze weather data against crop requirements
  // For now, we'll return mock impacts
  
  const language = getLanguage();
  const impacts = [];
  
  for (const crop of crops) {
    let impact: 'positive' | 'neutral' | 'negative' = 'neutral';
    let description = '';
    
    // Simple logic for demonstration
    if (crop.toLowerCase() === 'rice') {
      const hasHeavyRain = weatherData.forecast.forecastday.some(day => day.day.totalPrecip_mm > 15);
      if (hasHeavyRain) {
        impact = 'positive';
        description = language === 'hi' 
          ? 'अच्छी वर्षा की उम्मीद है, जो धान के लिए फायदेमंद है' 
          : 'Good rainfall expected, beneficial for rice';
      } else {
        impact = 'neutral';
        description = language === 'hi' 
          ? 'वर्षा की मात्रा पर्याप्त है, लेकिन अतिरिक्त सिंचाई की आवश्यकता हो सकती है' 
          : 'Rainfall is adequate but may require supplemental irrigation';
      }
    } else if (crop.toLowerCase() === 'wheat') {
      const hasHighTemp = weatherData.forecast.forecastday.some(day => day.day.maxtemp_c > 35);
      if (hasHighTemp) {
        impact = 'negative';
        description = language === 'hi' 
          ? 'उच्च तापमान गेहूं के विकास को प्रभावित कर सकता है' 
          : 'High temperatures may affect wheat development';
      } else {
        impact = 'positive';
        description = language === 'hi' 
          ? 'तापमान की स्थिति गेहूं के लिए अनुकूल है' 
          : 'Temperature conditions are favorable for wheat';
      }
    } else {
      impact = 'neutral';
      description = language === 'hi' 
        ? 'वर्तमान मौसम की स्थिति इस फसल के लिए सामान्य है' 
        : 'Current weather conditions are normal for this crop';
    }
    
    impacts.push({ crop, impact, description });
  }
  
  return impacts;
};