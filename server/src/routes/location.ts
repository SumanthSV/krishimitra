import express from 'express';
import { query, validationResult } from 'express-validator';
import logger from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * GET /api/location/states
 * Get list of Indian states
 */
router.get('/states', asyncHandler(async (req, res) => {
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  res.json({
    success: true,
    data: states
  });
}));

/**
 * GET /api/location/districts
 * Get districts for a state
 */
router.get('/districts', [
  query('state').notEmpty().withMessage('State is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { state } = req.query;
  const districts = getDistrictsForState(state as string);

  res.json({
    success: true,
    data: districts
  });
}));

/**
 * GET /api/location/coordinates
 * Get coordinates for a location
 */
router.get('/coordinates', [
  query('state').notEmpty().withMessage('State is required'),
  query('district').notEmpty().withMessage('District is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { state, district } = req.query;
  const coordinates = getCoordinatesForLocation(state as string, district as string);

  if (!coordinates) {
    return res.status(404).json({
      success: false,
      message: 'Coordinates not found for the specified location'
    });
  }

  res.json({
    success: true,
    data: {
      state,
      district,
      coordinates
    }
  });
}));

// Helper functions
function getDistrictsForState(state: string): string[] {
  const districtMap: Record<string, string[]> = {
    'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
    'Bihar': ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'],
    'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'],
    'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
    'Punjab': ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Nawanshahr', 'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'SAS Nagar', 'Tarn Taran'],
    'Uttar Pradesh': ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi']
  };

  return districtMap[state] || [];
}

function getCoordinatesForLocation(state: string, district: string): { latitude: number; longitude: number } | null {
  // Mock coordinates for major districts
  const locationCoordinates: Record<string, { latitude: number; longitude: number }> = {
    'Delhi:New Delhi': { latitude: 28.6139, longitude: 77.2090 },
    'Maharashtra:Mumbai': { latitude: 19.0760, longitude: 72.8777 },
    'Maharashtra:Pune': { latitude: 18.5204, longitude: 73.8567 },
    'Karnataka:Bangalore': { latitude: 12.9716, longitude: 77.5946 },
    'Tamil Nadu:Chennai': { latitude: 13.0827, longitude: 80.2707 },
    'West Bengal:Kolkata': { latitude: 22.5726, longitude: 88.3639 },
    'Gujarat:Ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
    'Rajasthan:Jaipur': { latitude: 26.9124, longitude: 75.7873 },
    'Punjab:Ludhiana': { latitude: 30.9010, longitude: 75.8573 },
    'Punjab:Amritsar': { latitude: 31.6340, longitude: 74.8723 },
    'Haryana:Gurgaon': { latitude: 28.4595, longitude: 77.0266 },
    'Uttar Pradesh:Lucknow': { latitude: 26.8467, longitude: 80.9462 },
    'Uttar Pradesh:Agra': { latitude: 27.1767, longitude: 78.0081 }
  };

  const key = `${state}:${district}`;
  return locationCoordinates[key] || { latitude: 20.5937, longitude: 78.9629 }; // Default to center of India
}

export default router;