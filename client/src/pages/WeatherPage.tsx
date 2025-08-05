import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { useLocation } from '../contexts/LocationContext.tsx';
import { useOfflineData } from '../contexts/OfflineDataContext.tsx';

const translations = {
  en: {
    title: 'Weather Forecast', today: 'Today', forecast: '7-Day Forecast',
    agricultural: 'Agricultural Advisory', temperature: 'Temperature', humidity: 'Humidity',
    rainfall: 'Rainfall', wind: 'Wind Speed', alerts: 'Weather Alerts',
    noAlerts: 'No active weather alerts', loading: 'Loading weather data...',
    error: 'Failed to load weather data', offline: 'You are viewing cached weather data',
    advisories: 'Crop Advisories', irrigationNeeded: 'Irrigation needed', pestRisk: 'Pest risk',
    harvestConditions: 'Harvest conditions', lastUpdated: 'Last updated'
  },
  hi: {
    title: 'मौसम का पूर्वानुमान', today: 'आज', forecast: '7-दिन का पूर्वानुमान',
    agricultural: 'कृषि सलाह', temperature: 'तापमान', humidity: 'आर्द्रता',
    rainfall: 'वर्षा', wind: 'हवा की गति', alerts: 'मौसम अलर्ट',
    noAlerts: 'कोई सक्रिय मौसम अलर्ट नहीं', loading: 'मौसम डेटा लोड हो रहा है...',
    error: 'मौसम डेटा लोड करने में विफल', offline: 'आप कैश्ड मौसम डेटा देख रहे हैं',
    advisories: 'फसल सलाह', irrigationNeeded: 'सिंचाई की आवश्यकता है', pestRisk: 'कीट जोखिम',
    harvestConditions: 'कटाई की स्थिति', lastUpdated: 'अंतिम अपडेट'
  }
};

const sampleWeatherData = {
  current: { temperature: 32, condition: 'Sunny', humidity: 65, rainfall: 0, windSpeed: 12 },
  forecast: [
    { day: 'Mon', temp: 32, condition: 'Sunny', rainfall: 0 },
    { day: 'Tue', temp: 33, condition: 'Partly Cloudy', rainfall: 0 },
    { day: 'Wed', temp: 30, condition: 'Cloudy', rainfall: 20 },
    { day: 'Thu', temp: 29, condition: 'Rain', rainfall: 45 },
    { day: 'Fri', temp: 28, condition: 'Rain', rainfall: 30 },
    { day: 'Sat', temp: 30, condition: 'Partly Cloudy', rainfall: 10 },
    { day: 'Sun', temp: 31, condition: 'Sunny', rainfall: 0 }
  ],
  alerts: [
    { type: 'Heavy Rain', description: 'Heavy rainfall expected on Wednesday and Thursday', severity: 'moderate' }
  ],
  advisories: [
    { crop: 'Rice', advice: 'Delay irrigation due to expected rainfall' },
    { crop: 'Cotton', advice: 'Monitor for increased pest activity' },
    { crop: 'Wheat', advice: 'Favorable conditions for sowing after rainfall' }
  ],
  lastUpdated: new Date().toISOString()
};

export default function WeatherPage() {
  const { language } = useLanguage();
  const { locationData } = useLocation();
  const { cachedData, updateWeatherData } = useOfflineData();

  const t = translations[language as keyof typeof translations] || translations.en;
  const [tab, setTab] = useState(0);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineData, setIsOfflineData] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API delay
        // await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Always set the data from the sample data first
        // This ensures we always have data to display
        setWeatherData(sampleWeatherData);
        updateWeatherData(sampleWeatherData);
        
        // Check if we're offline and have cached data
        if (!navigator.onLine && cachedData.weatherData) {
          setIsOfflineData(true);
        } else {
          setIsOfflineData(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, [cachedData.weatherData, updateWeatherData]);

  const getIcon = (condition: string) => {
    if (condition.toLowerCase().includes('sun')) return '☀';
    if (condition.toLowerCase().includes('cloud')) return '☁';
    if (condition.toLowerCase().includes('rain')) return '☔';
    return '⛅';
  };

  if (loading) return <div className="text-center mt-10 text-xl">{t.loading}</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{t.error}: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
      {isOfflineData && <div className="bg-yellow-100 p-2 rounded mb-4">{t.offline}</div>}
      <div className="bg-white shadow rounded p-4 mb-4">
        <p className="font-medium">
          {locationData.district && locationData.state ? `${locationData.district}, ${locationData.state}` : 'Location not set'}
        </p>
        <p className="text-sm text-gray-500">{t.lastUpdated}: {new Date(weatherData.lastUpdated).toLocaleString()}</p>
      </div>

      <div className="flex gap-4 mb-4">
        {[t.today, t.forecast, t.agricultural].map((label, idx) => (
          <button key={idx} onClick={() => setTab(idx)} className={`px-4 py-2 rounded ${tab === idx ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{label}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold flex items-center gap-2">{getIcon(weatherData.current.condition)} {weatherData.current.condition}</h2>
            <p>{t.temperature}: {weatherData.current.temperature}°C</p>
            <p>{t.humidity}: {weatherData.current.humidity}%</p>
            <p>{t.rainfall}: {weatherData.current.rainfall} mm</p>
            <p>{t.wind}: {weatherData.current.windSpeed} km/h</p>
          </div>
          <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold mb-2">{t.alerts}</h2>
            {weatherData.alerts.length ? (
              weatherData.alerts.map((alert: any, i: number) => (
                <div key={i} className="mb-2">
                  <p className="font-semibold">⚠ {alert.type}</p>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                </div>
              ))
            ) : <p>{t.noAlerts}</p>}
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {weatherData.forecast.map((day: any, i: number) => (
            <div key={i} className="p-4 border rounded shadow text-center">
              <p className="font-semibold">{day.day}</p>
              <p className="text-2xl">{getIcon(day.condition)}</p>
              <p>{day.temp}°C</p>
              <p className="text-sm">{day.condition}</p>
              <p className="text-xs text-gray-500">{t.rainfall}: {day.rainfall} mm</p>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weatherData.advisories.map((adv: any, i: number) => (
            <div key={i} className="p-4 border rounded shadow">
              <p className="font-bold">🌾 {adv.crop}</p>
              <p className="text-sm text-gray-700">{adv.advice}</p>
            </div>
          ))}
          <div className="p-4 bg-blue-100 rounded">
            <h3 className="font-semibold mb-1">{t.irrigationNeeded}</h3>
            <p className="text-sm">{weatherData.forecast.some((d: any) => d.rainfall > 0) ? 'Natural rainfall expected. Delay irrigation.' : 'No significant rainfall. Consider irrigation.'}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded">
            <h3 className="font-semibold mb-1">{t.pestRisk}</h3>
            <p className="text-sm">{weatherData.current.humidity > 70 ? 'High humidity increases fungal disease risk.' : 'Moderate risk. Monitor crops.'}</p>
          </div>
          <div className="p-4 bg-green-100 rounded">
            <h3 className="font-semibold mb-1">{t.harvestConditions}</h3>
            <p className="text-sm">{weatherData.forecast.slice(0, 3).some((d: any) => d.condition.toLowerCase().includes('rain')) ? 'Rain expected. Not ideal for harvesting.' : 'Good conditions for harvesting.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
