import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  WbSunny as WeatherIcon,
  Grass as CropIcon,
  AccountBalance as FinanceIcon,
  QuestionAnswer as QueryIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from '../contexts/LocationContext';

const translations = {
  en: {
    welcome: 'Welcome to KrishiMitra',
    tagline: 'Your AI-powered agricultural advisor',
    askQuestion: 'Ask a Question',
    weatherTitle: 'Weather Forecast',
    weatherDesc: 'Get real-time weather updates and forecasts for your region',
    cropTitle: 'Crop Information',
    cropDesc: 'Access detailed information about crops, seeds, and farming practices',
    financeTitle: 'Financial Assistance',
    financeDesc: 'Explore loans, subsidies, and government schemes for farmers',
    viewMore: 'View More',
    recentUpdates: 'Recent Updates',
    localizedAdvice: 'Localized Advice',
    basedOnLocation: 'Based on your location:',
    setLocation: 'Set Location',
  },
  hi: {
    welcome: 'कृषिमित्र में आपका स्वागत है',
    tagline: 'आपका AI-संचालित कृषि सलाहकार',
    askQuestion: 'प्रश्न पूछें',
    weatherTitle: 'मौसम का पूर्वानुमान',
    weatherDesc: 'अपने क्षेत्र के लिए वास्तविक समय के मौसम अपडेट और पूर्वानुमान प्राप्त करें',
    cropTitle: 'फसल जानकारी',
    cropDesc: 'फसलों, बीजों और खेती प्रथाओं के बारे में विस्तृत जानकारी प्राप्त करें',
    financeTitle: 'वित्तीय सहायता',
    financeDesc: 'किसानों के लिए ऋण, सब्सिडी और सरकारी योजनाओं का पता लगाएं',
    viewMore: 'और देखें',
    recentUpdates: 'हाल के अपडेट',
    localizedAdvice: 'स्थानीय सलाह',
    basedOnLocation: 'आपके स्थान के आधार पर:',
    setLocation: 'स्थान सेट करें',
  },
  // Add more languages as needed
};

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const { locationData } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const t = translations[language as keyof typeof translations] || translations.en;

  // Sample weather data (in a real app, this would come from an API)
  const weatherData = {
    temperature: '32°C',
    condition: 'Sunny',
    humidity: '65%',
    rainfall: '0mm',
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom>
              {t.welcome}
            </Typography>
            <Typography variant="h5" paragraph>
              {t.tagline}
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={RouterLink}
              to="/query"
              startIcon={<QueryIcon />}
              sx={{ mt: 2 }}
            >
              {t.askQuestion}
            </Button>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box 
              component="img"
              src="/logo.svg"
              alt="KrishiMitra Logo"
              sx={{ width: '100%', maxWidth: 200, mx: 'auto', display: 'block' }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Location-based Advice */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          {t.localizedAdvice}
        </Typography>
        
        {locationData.district && locationData.state ? (
          <Typography variant="body1">
            {t.basedOnLocation} {locationData.district}, {locationData.state}
          </Typography>
        ) : locationData.coordinates ? (
          <Typography variant="body1">
            {t.basedOnLocation} {locationData.coordinates.latitude.toFixed(2)}, {locationData.coordinates.longitude.toFixed(2)}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">
              {locationData.isLoading ? 'Detecting location...' : 'Location not set'}
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              component={RouterLink}
              to="/settings"
            >
              {t.setLocation}
            </Button>
          </Box>
        )}

        {/* Weather Preview */}
        {locationData.district || locationData.coordinates ? (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2">Temperature</Typography>
                <Typography variant="h6">{weatherData.temperature}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2">Condition</Typography>
                <Typography variant="h6">{weatherData.condition}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2">Humidity</Typography>
                <Typography variant="h6">{weatherData.humidity}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2">Rainfall</Typography>
                <Typography variant="h6">{weatherData.rainfall}</Typography>
              </Grid>
            </Grid>
          </Box>
        ) : null}
      </Paper>

      {/* Feature Cards */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        {t.recentUpdates}
      </Typography>
      
      <Grid container spacing={4}>
        {/* Weather Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              sx={{ 
                height: 140, 
                bgcolor: theme.palette.primary.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <WeatherIcon sx={{ fontSize: 60, color: 'white' }} />
            </CardMedia>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {t.weatherTitle}
              </Typography>
              <Typography>
                {t.weatherDesc}
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button 
                endIcon={<ArrowIcon />} 
                component={RouterLink} 
                to="/weather"
              >
                {t.viewMore}
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Crop Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              sx={{ 
                height: 140, 
                bgcolor: theme.palette.secondary.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CropIcon sx={{ fontSize: 60, color: 'white' }} />
            </CardMedia>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {t.cropTitle}
              </Typography>
              <Typography>
                {t.cropDesc}
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button 
                endIcon={<ArrowIcon />} 
                component={RouterLink} 
                to="/crops"
              >
                {t.viewMore}
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Finance Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              sx={{ 
                height: 140, 
                bgcolor: theme.palette.info.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FinanceIcon sx={{ fontSize: 60, color: 'white' }} />
            </CardMedia>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {t.financeTitle}
              </Typography>
              <Typography>
                {t.financeDesc}
              </Typography>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button 
                endIcon={<ArrowIcon />} 
                component={RouterLink} 
                to="/finance"
              >
                {t.viewMore}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;