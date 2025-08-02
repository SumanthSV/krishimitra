import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type CachedData = {
  weatherData: any | null;
  cropData: any | null;
  financeData: any | null;
  lastUpdated: {
    weather: string | null;
    crops: string | null;
    finance: string | null;
  };
};

type OfflineDataContextType = {
  cachedData: CachedData;
  updateWeatherData: (data: any) => void;
  updateCropData: (data: any) => void;
  updateFinanceData: (data: any) => void;
  clearCache: () => void;
};

const OfflineDataContext = createContext<OfflineDataContextType | undefined>(undefined);

type OfflineDataProviderProps = {
  children: ReactNode;
};

export const OfflineDataProvider: React.FC<OfflineDataProviderProps> = ({ children }) => {
  const [cachedData, setCachedData] = useState<CachedData>({
    weatherData: null,
    cropData: null,
    financeData: null,
    lastUpdated: {
      weather: null,
      crops: null,
      finance: null,
    },
  });

  // Load cached data from localStorage on initial render
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const savedWeatherData = localStorage.getItem('cachedWeatherData');
        const savedCropData = localStorage.getItem('cachedCropData');
        const savedFinanceData = localStorage.getItem('cachedFinanceData');
        const savedLastUpdated = localStorage.getItem('cachedLastUpdated');

        setCachedData({
          weatherData: savedWeatherData ? JSON.parse(savedWeatherData) : null,
          cropData: savedCropData ? JSON.parse(savedCropData) : null,
          financeData: savedFinanceData ? JSON.parse(savedFinanceData) : null,
          lastUpdated: savedLastUpdated ? JSON.parse(savedLastUpdated) : {
            weather: null,
            crops: null,
            finance: null,
          },
        });
      } catch (error) {
        console.error('Error loading cached data:', error);
        // If there's an error, reset the cache
        clearCache();
      }
    };

    loadCachedData();

    // Listen for storage events (if the user has multiple tabs open)
    window.addEventListener('storage', loadCachedData);
    return () => {
      window.removeEventListener('storage', loadCachedData);
    };
  }, []);

  // Update weather data and save to localStorage
  const updateWeatherData = (data: any) => {
    const now = new Date().toISOString();
    setCachedData(prev => {
      const newData = {
        ...prev,
        weatherData: data,
        lastUpdated: {
          ...prev.lastUpdated,
          weather: now,
        },
      };
      
      // Save to localStorage
      localStorage.setItem('cachedWeatherData', JSON.stringify(data));
      localStorage.setItem('cachedLastUpdated', JSON.stringify(newData.lastUpdated));
      
      return newData;
    });
  };

  // Update crop data and save to localStorage
  const updateCropData = (data: any) => {
    const now = new Date().toISOString();
    setCachedData(prev => {
      const newData = {
        ...prev,
        cropData: data,
        lastUpdated: {
          ...prev.lastUpdated,
          crops: now,
        },
      };
      
      // Save to localStorage
      localStorage.setItem('cachedCropData', JSON.stringify(data));
      localStorage.setItem('cachedLastUpdated', JSON.stringify(newData.lastUpdated));
      
      return newData;
    });
  };

  // Update finance data and save to localStorage
  const updateFinanceData = (data: any) => {
    const now = new Date().toISOString();
    setCachedData(prev => {
      const newData = {
        ...prev,
        financeData: data,
        lastUpdated: {
          ...prev.lastUpdated,
          finance: now,
        },
      };
      
      // Save to localStorage
      localStorage.setItem('cachedFinanceData', JSON.stringify(data));
      localStorage.setItem('cachedLastUpdated', JSON.stringify(newData.lastUpdated));
      
      return newData;
    });
  };

  // Clear all cached data
  const clearCache = () => {
    setCachedData({
      weatherData: null,
      cropData: null,
      financeData: null,
      lastUpdated: {
        weather: null,
        crops: null,
        finance: null,
      },
    });
    
    // Clear localStorage
    localStorage.removeItem('cachedWeatherData');
    localStorage.removeItem('cachedCropData');
    localStorage.removeItem('cachedFinanceData');
    localStorage.removeItem('cachedLastUpdated');
  };

  return (
    <OfflineDataContext.Provider 
      value={{ 
        cachedData, 
        updateWeatherData, 
        updateCropData, 
        updateFinanceData, 
        clearCache 
      }}
    >
      {children}
    </OfflineDataContext.Provider>
  );
};

export const useOfflineData = (): OfflineDataContextType => {
  const context = useContext(OfflineDataContext);
  if (context === undefined) {
    throw new Error('useOfflineData must be used within an OfflineDataProvider');
  }
  return context;
};