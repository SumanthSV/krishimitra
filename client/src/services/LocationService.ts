// Types for location data
export interface Location {
  latitude: number;
  longitude: number;
  state?: string;
  district?: string;
  village?: string;
  lastUpdated: number;
}

export interface GeocodingResult {
  state: string;
  district: string;
  village?: string;
  success: boolean;
  error?: string;
}

// List of Indian states for location selection
export const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

// Mock district data for offline use
export const districtsByState: { [state: string]: string[] } = {
  'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
  'Bihar': ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'],
  'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'],
  'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
  'Punjab': ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Nawanshahr', 'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'SAS Nagar', 'Tarn Taran'],
  'Rajasthan': ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'],
  'Uttar Pradesh': ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'],
};

// Function to get current location using browser geolocation API
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          lastUpdated: Date.now(),
        };

        try {
          // Try to get address details from coordinates
          const geocodingResult = await reverseGeocode(location.latitude, location.longitude);
          if (geocodingResult.success) {
            location.state = geocodingResult.state;
            location.district = geocodingResult.district;
            location.village = geocodingResult.village;
          }
        } catch (error) {
          console.warn('Failed to get address details:', error);
        }

        // Save to local storage for offline use
        localStorage.setItem('userLocation', JSON.stringify(location));

        resolve(location);
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// Function to reverse geocode coordinates to address
export const reverseGeocode = async (latitude: number, longitude: number): Promise<GeocodingResult> => {
  try {
    // In a real implementation, this would call a geocoding API like Google Maps or Nominatim
    // For now, we'll return mock data based on the coordinates
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock implementation - in reality, this would use the coordinates to determine the location
    // This is just a placeholder that returns different locations based on latitude ranges
    let state = '';
    let district = '';
    let village = '';
    
    // Very simplified mock implementation
    if (latitude > 28 && latitude < 29) {
      state = 'Uttar Pradesh';
      district = 'Mathura';
      village = 'Vrindavan';
    } else if (latitude > 26 && latitude < 28) {
      state = 'Rajasthan';
      district = 'Jaipur';
      village = 'Amer';
    } else if (latitude > 24 && latitude < 26) {
      state = 'Gujarat';
      district = 'Ahmedabad';
      village = 'Sanand';
    } else if (latitude > 22 && latitude < 24) {
      state = 'Maharashtra';
      district = 'Pune';
      village = 'Lonavala';
    } else if (latitude > 20 && latitude < 22) {
      state = 'Maharashtra';
      district = 'Mumbai Suburban';
      village = 'Andheri';
    } else if (latitude > 18 && latitude < 20) {
      state = 'Karnataka';
      district = 'Bangalore';
      village = 'Whitefield';
    } else if (latitude > 16 && latitude < 18) {
      state = 'Telangana';
      district = 'Hyderabad';
      village = 'Gachibowli';
    } else if (latitude > 14 && latitude < 16) {
      state = 'Tamil Nadu';
      district = 'Chennai';
      village = 'Adyar';
    } else if (latitude > 12 && latitude < 14) {
      state = 'Kerala';
      district = 'Kochi';
      village = 'Fort Kochi';
    } else {
      state = 'Punjab';
      district = 'Amritsar';
      village = 'Golden Temple';
    }
    
    return {
      state,
      district,
      village,
      success: true,
    };
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return {
      state: '',
      district: '',
      success: false,
      error: 'Failed to get location details',
    };
  }
};

// Function to get saved location from local storage
export const getSavedLocation = (): Location | null => {
  const savedLocationJson = localStorage.getItem('userLocation');
  if (savedLocationJson) {
    try {
      return JSON.parse(savedLocationJson) as Location;
    } catch (error) {
      console.error('Failed to parse saved location:', error);
      return null;
    }
  }
  return null;
};

// Function to set location manually
export const setManualLocation = (state: string, district: string, village?: string): Location => {
  // Create a location object with the provided details
  const location: Location = {
    // Use default coordinates for the state/district (in a real app, we would use forward geocoding)
    latitude: 20.5937, // Default latitude
    longitude: 78.9629, // Default longitude
    state,
    district,
    village,
    lastUpdated: Date.now(),
  };
  
  // Save to local storage for offline use
  localStorage.setItem('userLocation', JSON.stringify(location));
  
  return location;
};

// Function to get nearby villages (for a real implementation)
export const getNearbyVillages = async (latitude: number, longitude: number, radiusKm: number = 10): Promise<string[]> => {
  try {
    // In a real implementation, this would call an API to get nearby villages
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock implementation - in reality, this would use the coordinates and radius to find nearby villages
    // This is just a placeholder that returns different villages based on latitude ranges
    if (latitude > 28 && latitude < 29) {
      return ['Vrindavan', 'Mathura', 'Gokul', 'Barsana', 'Nandgaon'];
    } else if (latitude > 26 && latitude < 28) {
      return ['Amer', 'Jaipur', 'Sanganer', 'Chomu', 'Bagru'];
    } else if (latitude > 24 && latitude < 26) {
      return ['Sanand', 'Ahmedabad', 'Gandhinagar', 'Mehsana', 'Kalol'];
    } else if (latitude > 22 && latitude < 24) {
      return ['Lonavala', 'Khandala', 'Pune', 'Talegaon', 'Vadgaon'];
    } else if (latitude > 20 && latitude < 22) {
      return ['Andheri', 'Bandra', 'Juhu', 'Goregaon', 'Malad'];
    } else if (latitude > 18 && latitude < 20) {
      return ['Whitefield', 'Bangalore', 'Electronic City', 'Hebbal', 'Yelahanka'];
    } else if (latitude > 16 && latitude < 18) {
      return ['Gachibowli', 'Hyderabad', 'Secunderabad', 'Madhapur', 'Kukatpally'];
    } else if (latitude > 14 && latitude < 16) {
      return ['Adyar', 'Chennai', 'Mylapore', 'T Nagar', 'Velachery'];
    } else if (latitude > 12 && latitude < 14) {
      return ['Fort Kochi', 'Kochi', 'Ernakulam', 'Mattancherry', 'Willingdon Island'];
    } else {
      return ['Golden Temple', 'Amritsar', 'Tarn Taran', 'Jandiala Guru', 'Majitha'];
    }
  } catch (error) {
    console.error('Failed to get nearby villages:', error);
    return [];
  }
};

// Function to calculate distance between two coordinates (using Haversine formula)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Helper function to convert degrees to radians
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};