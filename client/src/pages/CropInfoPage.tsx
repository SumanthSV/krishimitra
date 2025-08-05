import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
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
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { useOfflineData } from '../contexts/OfflineDataContext.tsx';

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
        // await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Always set the data from the sample data first
        // This ensures we always have data to display
        setCropData(sampleCropData);
        
        // Cache the data for offline use
        updateCropData(sampleCropData);
        
        // Check if we're offline and have cached data
        if (!navigator.onLine && cachedData.cropData) {
          setIsOfflineData(true);
        } else {
          setIsOfflineData(false);
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
        <div className="max-w-screen-lg mx-auto mt-4 mb-4 text-center">
      <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
      <h2 className="mt-2 text-lg font-medium text-gray-700">Loading...</h2>
    </div>
    );
  }

  if (error) {
    return (
       <div className="max-w-screen-lg mx-auto mt-4 mb-4">
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">{t.error}:</strong>
    <span className="block sm:inline ml-1">{error}</span>
  </div>
</div>
    );
  }

  const filteredCrops = getFilteredCrops();

  return (
<div className="max-w-8xl bg-white-400 mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold mb-4">{t.title}</h1>

  {isOfflineData && (
    <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded mb-4">
      {t.offline}
    </div>
  )}

  {/* Search Bar */}
  <div className="bg-white shadow p-4 rounded-xl mb-6">
    <div className="flex items-center border rounded px-3 py-2">
      <SearchIcon className="text-gray-500 mr-2" />
      <input
        type="text"
        placeholder={t.search}
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full outline-none bg-transparent"
      />
    </div>
  </div>

  {/* Grid Layout */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Crop List */}
    <div className={`${selectedCrop ? 'md:col-span-1' : 'md:col-span-3'} bg-white rounded-xl shadow`}>
      <div className="border-b border-gray-200">
        <div className="flex">
          <button className={`flex-1 p-3 ${tabValue === 0 ? 'border-b-2 border-green-600 font-semibold' : ''}`} onClick={() => handleTabChange(null, 0)}>{t.all}</button>
          <button className={`flex-1 p-3 ${tabValue === 1 ? 'border-b-2 border-green-600 font-semibold' : ''}`} onClick={() => handleTabChange(null, 1)}>{t.popular}</button>
          <button className={`flex-1 p-3 ${tabValue === 2 ? 'border-b-2 border-green-600 font-semibold' : ''}`} onClick={() => handleTabChange(null, 2)}>{t.seasonal}</button>
        </div>
      </div>
      <div className="p-4">
        {tabValue === 0 && renderCropList(filteredCrops)}
        {tabValue === 1 && renderCropList(filteredCrops)}
        {tabValue === 2 && renderCropList(filteredCrops)}
      </div>
    </div>

    {/* Crop Details */}
    {selectedCrop && (
      <div className="md:col-span-2 bg-white rounded-xl shadow overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-xl">
          <h2 className="text-xl font-bold">
            {language === 'hi' && selectedCrop.nameHi ? selectedCrop.nameHi : selectedCrop.name}
          </h2>
          <p className="text-sm">{selectedCrop.category}</p>
        </div>

        {/* Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Attributes */}
          <div className="space-y-4">
            {[
              { icon: <WaterIcon />, label: t.waterReq, value: selectedCrop.waterRequirement },
              { icon: <SunIcon />, label: t.sunReq, value: selectedCrop.sunlightRequirement },
              { icon: <CropIcon />, label: t.soilType, value: selectedCrop.soilType },
              { icon: <SeedIcon />, label: t.growingSeason, value: selectedCrop.growingSeason },
              { icon: <CropIcon />, label: t.harvestTime, value: selectedCrop.harvestTime },
              { icon: <PriceIcon />, label: t.yield, value: selectedCrop.expectedYield },
            ].map(({ icon, label, value }, idx) => (
              <div className="flex items-center gap-2" key={idx}>
                {icon}
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Info */}
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-lg font-semibold mb-2">{t.currentPrice}</p>
            <p className="text-2xl text-green-600 font-bold">{selectedCrop.market.currentPrice}</p>
            <p className="text-sm text-gray-600 mt-1">{t.priceRange}: {selectedCrop.market.priceRange}</p>
            <div className="mt-4">
              <p className="text-sm font-medium">{t.majorMarkets}:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCrop.market.majorMarkets.map((market, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{market}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Details */}
        <div className="border-t border-gray-200 px-4">
          <div className="flex">
            {['cultivation', 'varieties', 'pests'].map((tab, idx) => (
              <button
                key={idx}
                onClick={() => handleCropDetailTabChange(null, idx)}
                className={`flex-1 text-sm p-2 ${cropDetailTab === idx ? 'border-b-2 border-green-600 font-semibold' : ''}`}
              >
                {t[tab]}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {cropDetailTab === 0 && (
            <ul className="space-y-2 list-disc list-inside">
              {selectedCrop.cultivation.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}

          {cropDetailTab === 1 && (
            <div className="space-y-4">
              {selectedCrop.varieties.map((variety, index) => (
                <details key={index} className="border border-gray-200 rounded p-3">
                  <summary className="font-semibold cursor-pointer">{variety.name}</summary>
                  <p className="text-sm mt-2"><strong>Characteristics:</strong> {variety.characteristics}</p>
                  <p className="text-sm"><strong>Suitable Regions:</strong> {variety.suitableRegions}</p>
                </details>
              ))}
            </div>
          )}

          {cropDetailTab === 2 && (
            <div className="space-y-4">
              {selectedCrop.pests.map((pest, index) => (
                <details key={index} className="border border-yellow-200 rounded p-3">
                  <summary className="flex items-center text-yellow-700 font-semibold cursor-pointer">
                    <PestIcon className="mr-2" /> {pest.name}
                  </summary>
                  <p className="text-sm mt-2"><strong>Symptoms:</strong> {pest.symptoms}</p>
                  <p className="text-sm"><strong>Control Measures:</strong> {pest.control}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</div>

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {crops.map((crop) => {
        const isSelected = selectedCrop?.id === crop.id;
        return (
          <div
            key={crop.id}
            className={`cursor-pointer h-full rounded-lg border transition duration-200 p-4 
              ${isSelected ? 'bg-green-50 border-green-500' : 'bg-white hover:bg-green-50 border-transparent'}
            `}
            onClick={() => handleCropSelect(crop)}
          >
            <h3 className="text-lg font-semibold mb-1">
              {language === 'hi' && crop.nameHi ? crop.nameHi : crop.name}
            </h3>
            <p className="text-sm text-gray-600">{crop.category}</p>

            <div className="flex gap-2 mt-2">
              {crop.popular && (
                <span className="text-xs px-2 py-1 rounded border border-green-600 text-green-700">
                  {t.popular}
                </span>
              )}
              {crop.seasonal && (
                <span className="text-xs px-2 py-1 rounded border border-purple-600 text-purple-700">
                  {t.seasonal}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
    );
  }
};

export default CropInfoPage;