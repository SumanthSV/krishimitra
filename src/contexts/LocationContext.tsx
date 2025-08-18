import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationData = {
  coordinates: Coordinates | null;
  district: string | null;
  state: string | null;
  isLoading: boolean;
  error: string | null;
};

type LocationContextType = {
  locationData: LocationData;
  setManualLocation: (district: string, state: string) => void;
  refreshLocation: () => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

type LocationProviderProps = {
  children: ReactNode;
};

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [locationData, setLocationData] = useState<LocationData>({
    coordinates: null,
    district: null,
    state: null,
    isLoading: false,
    error: null,
  });

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationData(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        isLoading: false,
      }));
      return;
    }

    setLocationData(prev => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // In a real app, we would use a reverse geocoding service here
          // For now, we'll just store the coordinates
          setLocationData({
            coordinates: { latitude, longitude },
            district: null, // Would be populated from geocoding service
            state: null, // Would be populated from geocoding service
            isLoading: false,
            error: null,
          });
          
          // Save to localStorage for offline use
          localStorage.setItem('locationCoordinates', JSON.stringify({ latitude, longitude }));
        } catch (error) {
          setLocationData(prev => ({
            ...prev,
            isLoading: false,
            error: 'Failed to determine location details',
          }));
        }
      },
      (error) => {
        setLocationData(prev => ({
          ...prev,
          isLoading: false,
          error: `Failed to get location: ${error.message}`,
        }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Function to set location manually
  const setManualLocation = (district: string, state: string) => {
    setLocationData({
      coordinates: null,
      district,
      state,
      isLoading: false,
      error: null,
    });
    
    // Save to localStorage for offline use
    localStorage.setItem('locationManual', JSON.stringify({ district, state }));
  };

  // Try to load saved location on initial render
  useEffect(() => {
    const savedCoordinates = localStorage.getItem('locationCoordinates');
    const savedManualLocation = localStorage.getItem('locationManual');
    
    if (savedCoordinates) {
      try {
        const coords = JSON.parse(savedCoordinates);
        setLocationData(prev => ({
          ...prev,
          coordinates: coords,
        }));
      } catch (e) {
        // Invalid JSON in localStorage, ignore
      }
    } else if (savedManualLocation) {
      try {
        const { district, state } = JSON.parse(savedManualLocation);
        setLocationData(prev => ({
          ...prev,
          district,
          state,
        }));
      } catch (e) {
        // Invalid JSON in localStorage, ignore
      }
    } else {
      // No saved location, try to get current location
      getCurrentLocation();
    }
  }, []);

  return (
    <LocationContext.Provider 
      value={{ 
        locationData, 
        setManualLocation, 
        refreshLocation: getCurrentLocation 
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};