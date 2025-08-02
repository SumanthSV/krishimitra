import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  WbSunny as SunnyIcon,
  Opacity as RainIcon,
  Air as WindIcon,
  Thermostat as TempIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Agriculture as CropIcon
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from '../contexts/LocationContext';
import { useOfflineData } from '../contexts/OfflineDataContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`weather-tabpanel-${index}`}
      aria-labelledby={`weather-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `weather-tab-${index}`,
    'aria-controls': `weather-tabpanel-${index}`,
  };
}

const translations = {
  en: {
    title: 'Weather Forecast',
    today: 'Today',
    forecast: '7-Day Forecast',
    agricultural: 'Agricultural Advisory',
    temperature: 'Temperature',
    humidity: 'Humidity',
    rainfall: 'Rainfall',
    wind: 'Wind Speed',
    alerts: 'Weather Alerts',
    noAlerts: 'No active weather alerts',
    loading: 'Loading weather data...',
    error: 'Failed to load weather data',
    offline: 'You are viewing cached weather data',
    advisories: 'Crop Advisories',
    irrigationNeeded: 'Irrigation needed',
    pestRisk: 'Pest risk',
    harvestConditions: 'Harvest conditions',
    lastUpdated: 'Last updated',
  },
  hi: {
    title: 'मौसम का पूर्वानुमान',
    today: 'आज',
    forecast: '7-दिन का पूर्वानुमान',
    agricultural: 'कृषि सलाह',
    temperature: 'तापमान',
    humidity: 'आर्द्रता',
    rainfall: 'वर्षा',
    wind: 'हवा की गति',
    alerts: 'मौसम अलर्ट',
    noAlerts: 'कोई सक्रिय मौसम अलर्ट नहीं',
    loading: 'मौसम डेटा लोड हो रहा है...',
    error: 'मौसम डेटा लोड करने में विफल',
    offline: 'आप कैश्ड मौसम डेटा देख रहे हैं',
    advisories: 'फसल सलाह',
    irrigationNeeded: 'सिंचाई की आवश्यकता है',
    pestRisk: 'कीट जोखिम',
    harvestConditions: 'कटाई की स्थिति',
    lastUpdated: 'अंतिम अपडेट',
  },
  // Add more languages as needed
};

// Sample weather data (in a real app, this would come from an API)
const sampleWeatherData = {
  current: {
    temperature: 32,
    condition: 'Sunny',
    humidity: 65,
    rainfall: 0,
    windSpeed: 12,
  },
  forecast: [
    { day: 'Mon', temp: 32, condition: 'Sunny', rainfall: 0 },
    { day: 'Tue', temp: 33, condition: 'Partly Cloudy', rainfall: 0 },
    { day: 'Wed', temp: 30, condition: 'Cloudy', rainfall: 20 },
    { day: 'Thu', temp: 29, condition: 'Rain', rainfall: 45 },
    { day: 'Fri', temp: 28, condition: 'Rain', rainfall: 30 },
    { day: 'Sat', temp: 30, condition: 'Partly Cloudy', rainfall: 10 },
    { day: 'Sun', temp: 31, condition: 'Sunny', rainfall: 0 },
  ],
  alerts: [
    {
      type: 'Heavy Rain',
      description: 'Heavy rainfall expected in some areas on Wednesday and Thursday',
      severity: 'moderate',
    },
  ],
  advisories: [
    {
      crop: 'Rice',
      advice: 'Delay irrigation due to expected rainfall on Wednesday and Thursday',
    },
    {
      crop: 'Cotton',
      advice: 'Monitor for increased pest activity due to high humidity',
    },
    {
      crop: 'Wheat',
      advice: 'Favorable conditions for sowing after Thursday\'s rainfall',
    },
  ],
  lastUpdated: new Date().toISOString(),
};

const WeatherPage: React.FC = () => {
  const { language } = useLanguage();
  const { locationData } = useLocation();
  const { cachedData, updateWeatherData } = useOfflineData();
  const theme = useTheme();
  
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const [tabValue, setTabValue] = useState(0);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineData, setIsOfflineData] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, we would fetch from a weather API here
        // For now, we'll use the sample data after a short delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if we're online
        if (navigator.onLine) {
          setWeatherData(sampleWeatherData);
          setIsOfflineData(false);
          
          // Cache the data for offline use
          updateWeatherData(sampleWeatherData);
        } else {
          // Use cached data if available
          if (cachedData.weatherData) {
            setWeatherData(cachedData.weatherData);
            setIsOfflineData(true);
          } else {
            throw new Error('No internet connection and no cached data available');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [cachedData.weatherData, updateWeatherData]);

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <SunnyIcon sx={{ color: '#FFD700' }} />;
      case 'partly cloudy':
        return <SunnyIcon sx={{ color: '#87CEEB' }} />;
      case 'cloudy':
        return <SunnyIcon sx={{ color: '#808080' }} />;
      case 'rain':
        return <RainIcon sx={{ color: '#4682B4' }} />;
      default:
        return <SunnyIcon />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t.loading}
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{t.error}: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t.title}
      </Typography>
      
      {isOfflineData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {t.offline}
        </Alert>
      )}
      
      {/* Location Display */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6">
          {locationData.district && locationData.state
            ? `${locationData.district}, ${locationData.state}`
            : locationData.coordinates
            ? `${locationData.coordinates.latitude.toFixed(2)}, ${locationData.coordinates.longitude.toFixed(2)}`
            : 'Location not set'}
        </Typography>
        <Typography variant="caption" display="block">
          {t.lastUpdated}: {new Date(weatherData.lastUpdated).toLocaleString()}
        </Typography>
      </Paper>

      {/* Weather Tabs */}
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="weather tabs"
            variant="fullWidth"
          >
            <Tab label={t.today} {...a11yProps(0)} />
            <Tab label={t.forecast} {...a11yProps(1)} />
            <Tab label={t.agricultural} {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        {/* Today's Weather */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getWeatherIcon(weatherData.current.condition)}
                    <Typography variant="h5" sx={{ ml: 1 }}>
                      {weatherData.current.condition}
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TempIcon color="primary" />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {t.temperature}: {weatherData.current.temperature}°C
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RainIcon color="primary" />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {t.humidity}: {weatherData.current.humidity}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WindIcon color="primary" />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {t.wind}: {weatherData.current.windSpeed} km/h
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RainIcon color="primary" />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {t.rainfall}: {weatherData.current.rainfall} mm
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t.alerts}
                  </Typography>
                  
                  {weatherData.alerts.length > 0 ? (
                    <List>
                      {weatherData.alerts.map((alert: any, index: number) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <WarningIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={alert.type} 
                            secondary={alert.description} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1">{t.noAlerts}</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* 7-Day Forecast */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            {weatherData.forecast.map((day: any, index: number) => (
              <Grid item xs={6} sm={4} md={3} lg={12/7} key={index}>
                <Card sx={{ textAlign: 'center', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">{day.day}</Typography>
                    <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
                      {getWeatherIcon(day.condition)}
                    </Box>
                    <Typography variant="body1">{day.temp}°C</Typography>
                    <Typography variant="body2">{day.condition}</Typography>
                    <Typography variant="body2">{t.rainfall}: {day.rainfall} mm</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        
        {/* Agricultural Advisory */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {t.advisories}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {weatherData.advisories.map((advisory: any, index: number) => (
                  <ListItem key={index} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                    <ListItemIcon>
                      <CropIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={advisory.crop} 
                      secondary={advisory.advice} 
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: theme.palette.primary.light, color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <RainIcon />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {t.irrigationNeeded}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {weatherData.forecast.some((day: any) => day.rainfall > 0)
                      ? 'Natural rainfall expected. Delay irrigation.'
                      : 'No significant rainfall expected. Consider irrigation.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: theme.palette.warning.light, color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WarningIcon />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {t.pestRisk}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {weatherData.current.humidity > 70
                      ? 'High humidity increases risk of fungal diseases. Monitor crops.'
                      : 'Moderate pest risk. Regular monitoring recommended.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: theme.palette.info.light, color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <InfoIcon />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {t.harvestConditions}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {weatherData.forecast.slice(0, 3).some((day: any) => day.condition.toLowerCase().includes('rain'))
                      ? 'Rain expected in next 3 days. Not ideal for harvesting.'
                      : 'Good weather conditions for harvesting in next 3 days.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default WeatherPage;