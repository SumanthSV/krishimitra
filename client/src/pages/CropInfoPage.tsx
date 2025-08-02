import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Grass as CropIcon,
  WaterDrop as WaterIcon,
  WbSunny as SunIcon,
  Spa as SeedIcon,
  BugReport as PestIcon,
  LocalOffer as PriceIcon
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
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
      id={`crop-tabpanel-${index}`}
      aria-labelledby={`crop-tab-${index}`}
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
    id: `crop-tab-${index}`,
    'aria-controls': `crop-tabpanel-${index}`,
  };
}

const translations = {
  en: {
    title: 'Crop Information',
    search: 'Search crops...',
    popular: 'Popular Crops',
    seasonal: 'Seasonal Recommendations',
    all: 'All Crops',
    cultivation: 'Cultivation Practices',
    varieties: 'Varieties',
    pests: 'Pests & Diseases',
    market: 'Market Information',
    loading: 'Loading crop data...',
    error: 'Failed to load crop data',
    offline: 'You are viewing cached crop data',
    waterReq: 'Water Requirements',
    sunReq: 'Sunlight Requirements',
    soilType: 'Soil Type',
    growingSeason: 'Growing Season',
    harvestTime: 'Harvest Time',
    yield: 'Expected Yield',
    currentPrice: 'Current Market Price',
    priceRange: 'Price Range (Last 30 days)',
    majorMarkets: 'Major Markets',
    noResults: 'No crops found matching your search',
  },
  hi: {
    title: 'फसल जानकारी',
    search: 'फसलों की खोज करें...',
    popular: 'लोकप्रिय फसलें',
    seasonal: 'मौसमी अनुशंसाएँ',
    all: 'सभी फसलें',
    cultivation: 'खेती प्रथाएँ',
    varieties: 'किस्में',
    pests: 'कीट और रोग',
    market: 'बाजार जानकारी',
    loading: 'फसल डेटा लोड हो रहा है...',
    error: 'फसल डेटा लोड करने में विफल',
    offline: 'आप कैश्ड फसल डेटा देख रहे हैं',
    waterReq: 'पानी की आवश्यकता',
    sunReq: 'धूप की आवश्यकता',
    soilType: 'मिट्टी का प्रकार',
    growingSeason: 'उगाने का मौसम',
    harvestTime: 'कटाई का समय',
    yield: 'अपेक्षित उपज',
    currentPrice: 'वर्तमान बाजार मूल्य',
    priceRange: 'मूल्य सीमा (पिछले 30 दिन)',
    majorMarkets: 'प्रमुख बाजार',
    noResults: 'आपकी खोज से मेल खाती कोई फसल नहीं मिली',
  },
  // Add more languages as needed
};

// Sample crop data (in a real app, this would come from an API)
const sampleCropData = {
  crops: [
    {
      id: 1,
      name: 'Rice',
      nameHi: 'चावल',
      image: 'rice.jpg',
      category: 'Cereal',
      popular: true,
      seasonal: true,
      waterRequirement: 'High',
      sunlightRequirement: 'Full Sun',
      soilType: 'Clay or loamy soil',
      growingSeason: 'Kharif (Monsoon)',
      harvestTime: '3-6 months after planting',
      expectedYield: '4-6 tonnes/hectare',
      cultivation: [
        'Prepare the land by plowing and leveling',
        'Soak seeds for 24 hours before sowing',
        'Maintain water level of 2-5 cm during growth phase',
        'Apply fertilizers as per soil test recommendations',
        'Control weeds during initial growth stages'
      ],
      varieties: [
        { name: 'Basmati', characteristics: 'Aromatic, long grain', suitableRegions: 'North India' },
        { name: 'IR-36', characteristics: 'High yield, disease resistant', suitableRegions: 'All regions' },
        { name: 'Sona Masuri', characteristics: 'Medium grain, popular', suitableRegions: 'South India' }
      ],
      pests: [
        { name: 'Rice Stem Borer', symptoms: 'Dead hearts in vegetative stage', control: 'Carbofuran application' },
        { name: 'Blast', symptoms: 'Lesions on leaves', control: 'Fungicide application, resistant varieties' },
        { name: 'Brown Plant Hopper', symptoms: 'Plants turn yellow and dry', control: 'Drain fields, use resistant varieties' }
      ],
      market: {
        currentPrice: '₹ 2,000 - 3,500 per quintal',
        priceRange: '₹ 1,800 - 3,800 per quintal',
        majorMarkets: ['Karnal', 'Ludhiana', 'Burdwan', 'Raichur']
      }
    },
    {
      id: 2,
      name: 'Wheat',
      nameHi: 'गेहूं',
      image: 'wheat.jpg',
      category: 'Cereal',
      popular: true,
      seasonal: true,
      waterRequirement: 'Medium',
      sunlightRequirement: 'Full Sun',
      soilType: 'Loamy soil',
      growingSeason: 'Rabi (Winter)',
      harvestTime: '4-5 months after sowing',
      expectedYield: '3-5 tonnes/hectare',
      cultivation: [
        'Prepare fine tilth by plowing and harrowing',
        'Sow seeds at 4-5 cm depth in rows',
        'First irrigation after 21 days of sowing',
        'Apply nitrogen fertilizer in split doses',
        'Harvest when grains become hard'
      ],
      varieties: [
        { name: 'HD-2967', characteristics: 'High yield, disease resistant', suitableRegions: 'North India' },
        { name: 'PBW-550', characteristics: 'Good quality, heat tolerant', suitableRegions: 'Punjab, Haryana' },
        { name: 'Lok-1', characteristics: 'Drought tolerant', suitableRegions: 'Central India' }
      ],
      pests: [
        { name: 'Aphids', symptoms: 'Curling of leaves, stunted growth', control: 'Spray insecticides' },
        { name: 'Rust', symptoms: 'Reddish-brown pustules on leaves', control: 'Fungicide application, resistant varieties' },
        { name: 'Powdery Mildew', symptoms: 'White powdery growth on leaves', control: 'Sulfur spray' }
      ],
      market: {
        currentPrice: '₹ 1,975 per quintal (MSP)',
        priceRange: '₹ 1,900 - 2,200 per quintal',
        majorMarkets: ['Khanna', 'Karnal', 'Indore', 'Sehore']
      }
    },
    {
      id: 3,
      name: 'Cotton',
      nameHi: 'कपास',
      image: 'cotton.jpg',
      category: 'Fiber',
      popular: true,
      seasonal: false,
      waterRequirement: 'Medium',
      sunlightRequirement: 'Full Sun',
      soilType: 'Black soil, alluvial soil',
      growingSeason: 'Kharif (Monsoon)',
      harvestTime: '6-8 months after sowing',
      expectedYield: '15-20 quintals/hectare',
      cultivation: [
        'Deep plowing in summer',
        'Sow seeds after first monsoon rains',
        'Maintain proper spacing between plants',
        'Apply fertilizers as per soil test',
        'Irrigate at critical growth stages'
      ],
      varieties: [
        { name: 'Bt Cotton', characteristics: 'Pest resistant, high yield', suitableRegions: 'All cotton growing regions' },
        { name: 'Desi Cotton', characteristics: 'Drought tolerant, short duration', suitableRegions: 'Rainfed areas' },
        { name: 'ELS Cotton', characteristics: 'Extra long staple', suitableRegions: 'South India' }
      ],
      pests: [
        { name: 'Bollworm', symptoms: 'Holes in bolls, shedding of buds', control: 'Bt cotton, insecticides' },
        { name: 'Whitefly', symptoms: 'Yellowing of leaves, sticky leaves', control: 'Neem oil spray, yellow sticky traps' },
        { name: 'Pink Bollworm', symptoms: 'Rosette flowers, damaged seeds', control: 'Pheromone traps, early sowing' }
      ],
      market: {
        currentPrice: '₹ 6,000 - 7,000 per quintal',
        priceRange: '₹ 5,500 - 7,500 per quintal',
        majorMarkets: ['Guntur', 'Adilabad', 'Bathinda', 'Rajkot']
      }
    },
    {
      id: 4,
      name: 'Sugarcane',
      nameHi: 'गन्ना',
      image: 'sugarcane.jpg',
      category: 'Cash Crop',
      popular: true,
      seasonal: false,
      waterRequirement: 'High',
      sunlightRequirement: 'Full Sun',
      soilType: 'Loamy soil, alluvial soil',
      growingSeason: 'Spring/Autumn',
      harvestTime: '10-12 months after planting',
      expectedYield: '80-100 tonnes/hectare',
      cultivation: [
        'Deep plowing and field preparation',
        'Use disease-free setts for planting',
        'Plant in furrows at proper spacing',
        'Apply organic manure before planting',
        'Irrigate at critical growth stages'
      ],
      varieties: [
        { name: 'Co-86032', characteristics: 'High yield, high sugar content', suitableRegions: 'Maharashtra, Karnataka' },
        { name: 'Co-0238', characteristics: 'Early maturing, high sugar recovery', suitableRegions: 'North India' },
        { name: 'Co-62175', characteristics: 'Drought tolerant', suitableRegions: 'Rainfed areas' }
      ],
      pests: [
        { name: 'Pyrilla', symptoms: 'Yellowing of leaves, sooty mold', control: 'Spray insecticides, biological control' },
        { name: 'Red Rot', symptoms: 'Red discoloration in stalk', control: 'Use resistant varieties, hot water treatment of setts' },
        { name: 'Top Borer', symptoms: 'Dead heart in top shoots', control: 'Remove and destroy affected shoots' }
      ],
      market: {
        currentPrice: '₹ 285 - 315 per quintal (FRP)',
        priceRange: '₹ 280 - 350 per quintal',
        majorMarkets: ['Muzaffarnagar', 'Kolhapur', 'Coimbatore', 'Mandya']
      }
    },
    {
      id: 5,
      name: 'Potato',
      nameHi: 'आलू',
      image: 'potato.jpg',
      category: 'Vegetable',
      popular: true,
      seasonal: true,
      waterRequirement: 'Medium',
      sunlightRequirement: 'Full Sun',
      soilType: 'Sandy loam, loamy soil',
      growingSeason: 'Rabi (Winter)',
      harvestTime: '75-120 days after planting',
      expectedYield: '25-30 tonnes/hectare',
      cultivation: [
        'Prepare fine tilth by plowing and harrowing',
        'Use certified seed tubers',
        'Plant at proper spacing and depth',
        'Earth up after 30 days of planting',
        'Irrigate at critical growth stages'
      ],
      varieties: [
        { name: 'Kufri Jyoti', characteristics: 'Early maturing, resistant to late blight', suitableRegions: 'Hills and plains' },
        { name: 'Kufri Chipsona', characteristics: 'Suitable for processing', suitableRegions: 'North and West India' },
        { name: 'Kufri Pukhraj', characteristics: 'High yield, yellow flesh', suitableRegions: 'All potato growing regions' }
      ],
      pests: [
        { name: 'Late Blight', symptoms: 'Water-soaked lesions on leaves', control: 'Fungicide application, resistant varieties' },
        { name: 'Early Blight', symptoms: 'Dark brown spots with concentric rings', control: 'Fungicide spray' },
        { name: 'Potato Tuber Moth', symptoms: 'Tunnels in tubers', control: 'Proper storage, insecticides' }
      ],
      market: {
        currentPrice: '₹ 1,200 - 2,000 per quintal',
        priceRange: '₹ 800 - 2,500 per quintal',
        majorMarkets: ['Agra', 'Farrukhabad', 'Jalandhar', 'Hooghly']
      }
    }
  ],
  lastUpdated: new Date().toISOString(),
};

const CropInfoPage: React.FC = () => {
  const { language } = useLanguage();
  const { cachedData, updateCropData } = useOfflineData();
  const theme = useTheme();
  
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [cropData, setCropData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [cropDetailTab, setCropDetailTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCropDetailTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCropDetailTab(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCropSelect = (crop: any) => {
    setSelectedCrop(crop);
    setCropDetailTab(0); // Reset to first tab when selecting a new crop
  };

  useEffect(() => {
    const fetchCropData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, we would fetch from an API here
        // For now, we'll use the sample data after a short delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if we're online
        if (navigator.onLine) {
          setCropData(sampleCropData);
          setIsOfflineData(false);
          
          // Cache the data for offline use
          updateCropData(sampleCropData);
        } else {
          // Use cached data if available
          if (cachedData.cropData) {
            setCropData(cachedData.cropData);
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

    fetchCropData();
  }, [cachedData.cropData, updateCropData]);

  // Filter crops based on search query and selected tab
  const getFilteredCrops = () => {
    if (!cropData) return [];
    
    let filtered = cropData.crops;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((crop: any) => 
        crop.name.toLowerCase().includes(query) || 
        (crop.nameHi && crop.nameHi.toLowerCase().includes(query)) ||
        crop.category.toLowerCase().includes(query)
      );
    }
    
    // Apply tab filter
    if (tabValue === 1) { // Popular crops
      filtered = filtered.filter((crop: any) => crop.popular);
    } else if (tabValue === 2) { // Seasonal recommendations
      filtered = filtered.filter((crop: any) => crop.seasonal);
    }
    
    return filtered;
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

  const filteredCrops = getFilteredCrops();

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
      
      {/* Search Bar */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t.search}
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Crop List */}
        <Grid item xs={12} md={selectedCrop ? 4 : 12}>
          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="crop tabs"
                variant="fullWidth"
              >
                <Tab label={t.all} {...a11yProps(0)} />
                <Tab label={t.popular} {...a11yProps(1)} />
                <Tab label={t.seasonal} {...a11yProps(2)} />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              {renderCropList(filteredCrops)}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {renderCropList(filteredCrops)}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {renderCropList(filteredCrops)}
            </TabPanel>
          </Paper>
        </Grid>
        
        {/* Crop Details */}
        {selectedCrop && (
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ borderRadius: 2 }}>
              {/* Crop Header */}
              <Box sx={{ p: 3, bgcolor: theme.palette.primary.main, color: 'white', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                <Typography variant="h5">
                  {language === 'hi' && selectedCrop.nameHi ? selectedCrop.nameHi : selectedCrop.name}
                </Typography>
                <Typography variant="subtitle1">
                  {selectedCrop.category}
                </Typography>
              </Box>
              
              {/* Crop Overview */}
              <Grid container spacing={0}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <WaterIcon color="primary" />
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="caption">{t.waterReq}</Typography>
                            <Typography variant="body2">{selectedCrop.waterRequirement}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SunIcon color="primary" />
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="caption">{t.sunReq}</Typography>
                            <Typography variant="body2">{selectedCrop.sunlightRequirement}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CropIcon color="primary" />
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="caption">{t.soilType}</Typography>
                            <Typography variant="body2">{selectedCrop.soilType}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SeedIcon color="primary" />
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="caption">{t.growingSeason}</Typography>
                            <Typography variant="body2">{selectedCrop.growingSeason}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CropIcon color="primary" />
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="caption">{t.harvestTime}</Typography>
                            <Typography variant="body2">{selectedCrop.harvestTime}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PriceIcon color="primary" />
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="caption">{t.yield}</Typography>
                            <Typography variant="body2">{selectedCrop.expectedYield}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      {t.currentPrice}
                    </Typography>
                    <Typography variant="h5" color="primary" gutterBottom>
                      {selectedCrop.market.currentPrice}
                    </Typography>
                    <Typography variant="body2">
                      {t.priceRange}: {selectedCrop.market.priceRange}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">
                        {t.majorMarkets}:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {selectedCrop.market.majorMarkets.map((market: string, index: number) => (
                          <Chip key={index} label={market} size="small" />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              {/* Crop Detail Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                <Tabs 
                  value={cropDetailTab} 
                  onChange={handleCropDetailTabChange} 
                  aria-label="crop detail tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label={t.cultivation} {...a11yProps(0)} />
                  <Tab label={t.varieties} {...a11yProps(1)} />
                  <Tab label={t.pests} {...a11yProps(2)} />
                </Tabs>
              </Box>
              
              {/* Cultivation Practices */}
              <TabPanel value={cropDetailTab} index={0}>
                <List>
                  {selectedCrop.cultivation.map((practice: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CropIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={practice} />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
              
              {/* Varieties */}
              <TabPanel value={cropDetailTab} index={1}>
                {selectedCrop.varieties.map((variety: any, index: number) => (
                  <Accordion key={index} elevation={0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{variety.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>
                        <strong>Characteristics:</strong> {variety.characteristics}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Suitable Regions:</strong> {variety.suitableRegions}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </TabPanel>
              
              {/* Pests & Diseases */}
              <TabPanel value={cropDetailTab} index={2}>
                {selectedCrop.pests.map((pest: any, index: number) => (
                  <Accordion key={index} elevation={0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PestIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                          {pest.name}
                        </Box>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>
                        <strong>Symptoms:</strong> {pest.symptoms}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Control Measures:</strong> {pest.control}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </TabPanel>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );

  function renderCropList(crops: any[]) {
    if (crops.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">{t.noResults}</Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        {crops.map((crop) => (
          <Grid item xs={12} sm={6} md={selectedCrop ? 12 : 4} lg={selectedCrop ? 12 : 3} key={crop.id}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                height: '100%',
                bgcolor: selectedCrop?.id === crop.id ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.05)' },
                border: selectedCrop?.id === crop.id ? `1px solid ${theme.palette.primary.main}` : 'none',
              }}
              onClick={() => handleCropSelect(crop)}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  {language === 'hi' && crop.nameHi ? crop.nameHi : crop.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {crop.category}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                  {crop.popular && (
                    <Chip 
                      label={t.popular} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  )}
                  {crop.seasonal && (
                    <Chip 
                      label={t.seasonal} 
                      size="small" 
                      color="secondary" 
                      variant="outlined" 
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }
};

export default CropInfoPage;