import mongoose from 'mongoose';
import Crop from '../models/Crop';
import logger from '../utils/logger';

// Sample crop data for seeding
const cropSeedData = [
  {
    name: {
      en: 'Rice',
      hi: 'चावल',
      pa: 'ਚਾਵਲ',
      bn: 'চাল',
      te: 'వరి',
      ta: 'அரிசி',
      mr: 'तांदूळ',
      gu: 'ચોખા',
      kn: 'ಅಕ್ಕಿ',
      ml: 'അരി'
    },
    scientificName: 'Oryza sativa',
    category: 'cereal',
    season: 'kharif',
    duration: {
      min: 90,
      max: 150,
      unit: 'days'
    },
    climate: {
      temperature: {
        min: 20,
        max: 37,
        optimal: 30
      },
      rainfall: {
        min: 1000,
        max: 2500,
        optimal: 1500
      },
      humidity: {
        min: 60,
        max: 90,
        optimal: 75
      }
    },
    soil: {
      types: ['alluvial', 'clay', 'loamy'],
      ph: {
        min: 5.5,
        max: 6.5,
        optimal: 6.0
      },
      nutrients: {
        nitrogen: 'high',
        phosphorus: 'medium',
        potassium: 'medium'
      }
    },
    cultivation: {
      sowing: {
        method: ['transplanting', 'direct seeding'],
        depth: '2-3 cm',
        spacing: '20x15 cm',
        seedRate: '20-25 kg/ha'
      },
      irrigation: {
        frequency: 'continuous flooding',
        method: ['flood', 'sprinkler'],
        criticalStages: ['tillering', 'panicle initiation', 'grain filling']
      },
      fertilization: {
        organic: ['farmyard manure', 'compost', 'green manure'],
        chemical: ['urea', 'DAP', 'MOP'],
        schedule: [
          {
            stage: 'basal',
            fertilizer: 'NPK 120:60:60',
            quantity: '50% N, 100% P, 50% K',
            timing: 'before transplanting'
          },
          {
            stage: 'tillering',
            fertilizer: 'urea',
            quantity: '25% N',
            timing: '21 days after transplanting'
          },
          {
            stage: 'panicle initiation',
            fertilizer: 'urea + MOP',
            quantity: '25% N, 50% K',
            timing: '45 days after transplanting'
          }
        ]
      },
      pestManagement: [
        {
          pest: 'Rice stem borer',
          type: 'insect',
          symptoms: 'Dead hearts in vegetative stage, white heads in reproductive stage',
          prevention: 'Use resistant varieties, balanced fertilization',
          treatment: 'Cartap hydrochloride 4G @ 18.75 kg/ha',
          organicControl: 'Trichogramma japonicum @ 1 lakh/ha'
        },
        {
          pest: 'Blast',
          type: 'disease',
          symptoms: 'Diamond-shaped lesions on leaves with gray centers',
          prevention: 'Use resistant varieties, avoid excess nitrogen',
          treatment: 'Tricyclazole 75% WP @ 0.6 g/l',
          organicControl: 'Pseudomonas fluorescens @ 2.5 kg/ha'
        }
      ]
    },
    harvest: {
      indicators: ['80% of grains turn golden yellow', 'moisture content 20-25%'],
      method: 'manual cutting or combine harvester',
      postHarvest: ['threshing', 'winnowing', 'drying to 14% moisture'],
      storage: 'store in moisture-proof containers'
    },
    yield: {
      average: 4000,
      potential: 8000,
      unit: 'kg/ha',
      factors: ['variety', 'water management', 'nutrient management', 'pest control']
    },
    economics: {
      costOfCultivation: {
        seeds: 2000,
        fertilizers: 8000,
        pesticides: 3000,
        labor: 15000,
        irrigation: 5000,
        machinery: 7000,
        total: 40000
      },
      marketPrice: {
        min: 18,
        max: 25,
        average: 21,
        unit: 'INR/kg',
        lastUpdated: new Date()
      },
      profitability: {
        grossReturn: 84000,
        netReturn: 44000,
        bcRatio: 2.1
      }
    },
    regions: {
      majorStates: ['West Bengal', 'Uttar Pradesh', 'Punjab', 'Tamil Nadu', 'Andhra Pradesh'],
      suitableDistricts: [
        {
          state: 'West Bengal',
          districts: ['Bardhaman', 'Birbhum', 'Murshidabad', 'Nadia']
        },
        {
          state: 'Punjab',
          districts: ['Amritsar', 'Ludhiana', 'Patiala', 'Sangrur']
        }
      ]
    },
    varieties: [
      {
        name: 'IR-36',
        characteristics: ['high yielding', 'disease resistant', 'short duration'],
        suitableRegions: ['all rice growing regions'],
        duration: 115,
        yield: 5000,
        resistance: ['blast', 'bacterial blight']
      },
      {
        name: 'Basmati 370',
        characteristics: ['aromatic', 'long grain', 'premium quality'],
        suitableRegions: ['Punjab', 'Haryana', 'Uttar Pradesh'],
        duration: 140,
        yield: 3500,
        resistance: ['lodging']
      }
    ],
    intercropping: {
      compatible: ['azolla', 'fish culture'],
      benefits: ['nitrogen fixation', 'additional income', 'pest control'],
      spacing: 'maintain water level for azolla'
    },
    rotation: {
      previous: ['legumes', 'mustard', 'potato'],
      next: ['wheat', 'mustard', 'pea'],
      benefits: ['soil fertility improvement', 'pest break', 'weed control']
    },
    nutritionalValue: {
      calories: 130,
      protein: 2.7,
      carbohydrates: 28,
      fat: 0.3,
      fiber: 0.4,
      vitamins: {
        'B1': 0.07,
        'B3': 1.6,
        'B6': 0.1
      },
      minerals: {
        'iron': 0.8,
        'magnesium': 25,
        'phosphorus': 115
      }
    },
    uses: ['food grain', 'animal feed', 'industrial uses'],
    processingMethods: ['milling', 'parboiling', 'puffing'],
    byproducts: ['rice bran', 'rice husk', 'broken rice'],
    governmentSchemes: ['PM-KISAN', 'Crop Insurance', 'MSP'],
    researchLinks: [
      'https://www.irri.org',
      'https://www.drriceresearch.ernet.in'
    ],
    images: ['/images/crops/rice-field.jpg', '/images/crops/rice-grains.jpg'],
    videos: ['/videos/rice-cultivation.mp4'],
    isActive: true
  },
  {
    name: {
      en: 'Wheat',
      hi: 'गेहूं',
      pa: 'ਕਣਕ',
      bn: 'গম',
      te: 'గోధుమ',
      ta: 'கோதுமை',
      mr: 'गहू',
      gu: 'ઘઉં',
      kn: 'ಗೋಧಿ',
      ml: 'ഗോതമ്പ്'
    },
    scientificName: 'Triticum aestivum',
    category: 'cereal',
    season: 'rabi',
    duration: {
      min: 110,
      max: 150,
      unit: 'days'
    },
    climate: {
      temperature: {
        min: 10,
        max: 25,
        optimal: 20
      },
      rainfall: {
        min: 300,
        max: 750,
        optimal: 500
      },
      humidity: {
        min: 50,
        max: 70,
        optimal: 60
      }
    },
    soil: {
      types: ['loamy', 'clay loam', 'alluvial'],
      ph: {
        min: 6.0,
        max: 7.5,
        optimal: 6.5
      },
      nutrients: {
        nitrogen: 'high',
        phosphorus: 'medium',
        potassium: 'medium'
      }
    },
    cultivation: {
      sowing: {
        method: ['broadcasting', 'line sowing', 'zero tillage'],
        depth: '3-5 cm',
        spacing: '20-23 cm between rows',
        seedRate: '100-125 kg/ha'
      },
      irrigation: {
        frequency: '4-6 irrigations',
        method: ['flood', 'sprinkler', 'drip'],
        criticalStages: ['crown root initiation', 'tillering', 'jointing', 'flowering', 'grain filling']
      },
      fertilization: {
        organic: ['farmyard manure', 'compost'],
        chemical: ['urea', 'DAP', 'MOP'],
        schedule: [
          {
            stage: 'basal',
            fertilizer: 'NPK 120:60:40',
            quantity: '1/3 N, full P&K',
            timing: 'at sowing'
          },
          {
            stage: 'first irrigation',
            fertilizer: 'urea',
            quantity: '1/3 N',
            timing: '21 days after sowing'
          },
          {
            stage: 'second irrigation',
            fertilizer: 'urea',
            quantity: '1/3 N',
            timing: '45 days after sowing'
          }
        ]
      },
      pestManagement: [
        {
          pest: 'Aphids',
          type: 'insect',
          symptoms: 'Curling of leaves, stunted growth',
          prevention: 'Early sowing, balanced fertilization',
          treatment: 'Imidacloprid 17.8% SL @ 0.3 ml/l',
          organicControl: 'Neem oil @ 5 ml/l'
        },
        {
          pest: 'Rust',
          type: 'disease',
          symptoms: 'Reddish-brown pustules on leaves',
          prevention: 'Use resistant varieties, timely sowing',
          treatment: 'Propiconazole 25% EC @ 1 ml/l',
          organicControl: 'Copper oxychloride @ 3 g/l'
        }
      ]
    },
    harvest: {
      indicators: ['grains become hard', 'moisture content 20%', 'golden yellow color'],
      method: 'combine harvester or manual cutting',
      postHarvest: ['threshing', 'cleaning', 'drying to 12% moisture'],
      storage: 'store in dry, ventilated godowns'
    },
    yield: {
      average: 3500,
      potential: 6000,
      unit: 'kg/ha',
      factors: ['variety', 'irrigation', 'fertilization', 'pest management']
    },
    economics: {
      costOfCultivation: {
        seeds: 3000,
        fertilizers: 7000,
        pesticides: 2000,
        labor: 12000,
        irrigation: 4000,
        machinery: 8000,
        total: 36000
      },
      marketPrice: {
        min: 19,
        max: 25,
        average: 22,
        unit: 'INR/kg',
        lastUpdated: new Date()
      },
      profitability: {
        grossReturn: 77000,
        netReturn: 41000,
        bcRatio: 2.14
      }
    },
    regions: {
      majorStates: ['Uttar Pradesh', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan'],
      suitableDistricts: [
        {
          state: 'Punjab',
          districts: ['Ludhiana', 'Patiala', 'Sangrur', 'Bathinda']
        },
        {
          state: 'Haryana',
          districts: ['Karnal', 'Kurukshetra', 'Panipat', 'Sonipat']
        }
      ]
    },
    varieties: [
      {
        name: 'HD-2967',
        characteristics: ['high yielding', 'disease resistant', 'heat tolerant'],
        suitableRegions: ['Punjab', 'Haryana', 'Western UP'],
        duration: 135,
        yield: 5500,
        resistance: ['rust', 'powdery mildew']
      },
      {
        name: 'PBW-550',
        characteristics: ['good quality', 'lodging resistant'],
        suitableRegions: ['Punjab', 'Haryana'],
        duration: 145,
        yield: 5200,
        resistance: ['yellow rust']
      }
    ],
    intercropping: {
      compatible: ['mustard', 'chickpea', 'lentil'],
      benefits: ['additional income', 'risk reduction', 'better land use'],
      spacing: 'alternate rows or strip cropping'
    },
    rotation: {
      previous: ['rice', 'cotton', 'sugarcane'],
      next: ['rice', 'cotton', 'fodder crops'],
      benefits: ['soil health improvement', 'pest management', 'nutrient cycling']
    },
    nutritionalValue: {
      calories: 346,
      protein: 11.8,
      carbohydrates: 71.2,
      fat: 1.5,
      fiber: 12.2,
      vitamins: {
        'B1': 0.41,
        'B3': 5.1,
        'E': 1.01
      },
      minerals: {
        'iron': 3.19,
        'magnesium': 126,
        'phosphorus': 288
      }
    },
    uses: ['food grain', 'flour production', 'animal feed'],
    processingMethods: ['milling', 'grinding', 'malting'],
    byproducts: ['wheat bran', 'wheat straw', 'wheat germ'],
    governmentSchemes: ['PM-KISAN', 'MSP', 'Crop Insurance'],
    researchLinks: [
      'https://www.iiwbr.org',
      'https://www.icarda.org'
    ],
    images: ['/images/crops/wheat-field.jpg', '/images/crops/wheat-grains.jpg'],
    videos: ['/videos/wheat-cultivation.mp4'],
    isActive: true
  },
  {
    name: {
      en: 'Cotton',
      hi: 'कपास',
      pa: 'ਕਪਾਹ',
      bn: 'তুলা',
      te: 'పత్తి',
      ta: 'பருத்தி',
      mr: 'कापूस',
      gu: 'કપાસ',
      kn: 'ಹತ್ತಿ',
      ml: 'പരുത്തി'
    },
    scientificName: 'Gossypium hirsutum',
    category: 'cash_crop',
    season: 'kharif',
    duration: {
      min: 150,
      max: 210,
      unit: 'days'
    },
    climate: {
      temperature: {
        min: 21,
        max: 35,
        optimal: 28
      },
      rainfall: {
        min: 500,
        max: 1000,
        optimal: 750
      },
      humidity: {
        min: 60,
        max: 80,
        optimal: 70
      }
    },
    soil: {
      types: ['black cotton soil', 'alluvial', 'red'],
      ph: {
        min: 6.0,
        max: 8.0,
        optimal: 7.0
      },
      nutrients: {
        nitrogen: 'high',
        phosphorus: 'medium',
        potassium: 'high'
      }
    },
    cultivation: {
      sowing: {
        method: ['dibbling', 'line sowing'],
        depth: '2-3 cm',
        spacing: '45x30 cm or 60x30 cm',
        seedRate: '1.5-2.0 kg/ha'
      },
      irrigation: {
        frequency: '8-12 irrigations',
        method: ['drip', 'sprinkler', 'furrow'],
        criticalStages: ['flowering', 'boll development', 'boll opening']
      },
      fertilization: {
        organic: ['farmyard manure', 'compost'],
        chemical: ['urea', 'DAP', 'MOP'],
        schedule: [
          {
            stage: 'basal',
            fertilizer: 'NPK 120:60:60',
            quantity: '50% N, full P&K',
            timing: 'at sowing'
          },
          {
            stage: 'square formation',
            fertilizer: 'urea',
            quantity: '25% N',
            timing: '45 days after sowing'
          },
          {
            stage: 'flowering',
            fertilizer: 'urea',
            quantity: '25% N',
            timing: '75 days after sowing'
          }
        ]
      },
      pestManagement: [
        {
          pest: 'Bollworm',
          type: 'insect',
          symptoms: 'Holes in bolls, damaged flowers',
          prevention: 'Use Bt cotton, pheromone traps',
          treatment: 'Spinosad 45% SC @ 0.3 ml/l',
          organicControl: 'NPV @ 250 LE/ha'
        },
        {
          pest: 'Whitefly',
          type: 'insect',
          symptoms: 'Yellowing of leaves, sooty mold',
          prevention: 'Yellow sticky traps, reflective mulch',
          treatment: 'Thiamethoxam 25% WG @ 0.2 g/l',
          organicControl: 'Neem oil @ 5 ml/l'
        }
      ]
    },
    harvest: {
      indicators: ['bolls fully opened', 'fiber turns white', 'moisture content low'],
      method: 'manual picking in 3-4 rounds',
      postHarvest: ['ginning', 'baling', 'grading'],
      storage: 'store in dry, ventilated warehouses'
    },
    yield: {
      average: 500,
      potential: 1000,
      unit: 'kg lint/ha',
      factors: ['variety', 'irrigation', 'pest management', 'picking timing']
    },
    economics: {
      costOfCultivation: {
        seeds: 3000,
        fertilizers: 12000,
        pesticides: 8000,
        labor: 25000,
        irrigation: 8000,
        machinery: 5000,
        total: 61000
      },
      marketPrice: {
        min: 5500,
        max: 7000,
        average: 6200,
        unit: 'INR/quintal',
        lastUpdated: new Date()
      },
      profitability: {
        grossReturn: 155000,
        netReturn: 94000,
        bcRatio: 2.54
      }
    },
    regions: {
      majorStates: ['Gujarat', 'Maharashtra', 'Telangana', 'Karnataka', 'Andhra Pradesh'],
      suitableDistricts: [
        {
          state: 'Gujarat',
          districts: ['Bharuch', 'Surat', 'Vadodara', 'Ahmedabad']
        },
        {
          state: 'Maharashtra',
          districts: ['Nagpur', 'Akola', 'Amravati', 'Yavatmal']
        }
      ]
    },
    varieties: [
      {
        name: 'Bt Cotton (Bollgard II)',
        characteristics: ['bollworm resistant', 'high yielding'],
        suitableRegions: ['all cotton growing regions'],
        duration: 180,
        yield: 750,
        resistance: ['bollworm complex']
      }
    ],
    intercropping: {
      compatible: ['groundnut', 'black gram', 'green gram'],
      benefits: ['additional income', 'soil fertility', 'pest management'],
      spacing: '2:1 or 4:2 row ratio'
    },
    rotation: {
      previous: ['soybean', 'sorghum', 'pearl millet'],
      next: ['wheat', 'chickpea', 'mustard'],
      benefits: ['soil health', 'pest break', 'income stability']
    },
    nutritionalValue: {
      calories: 0, // Cotton is not consumed directly
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      vitamins: {},
      minerals: {}
    },
    uses: ['textile fiber', 'cottonseed oil', 'animal feed'],
    processingMethods: ['ginning', 'spinning', 'weaving'],
    byproducts: ['cottonseed', 'cotton stalks', 'cotton hull'],
    governmentSchemes: ['Technology Mission on Cotton', 'MSP', 'Crop Insurance'],
    researchLinks: [
      'https://www.cicr.org.in',
      'https://www.cotcorp.gov.in'
    ],
    images: ['/images/crops/cotton-field.jpg', '/images/crops/cotton-bolls.jpg'],
    videos: ['/videos/cotton-cultivation.mp4'],
    isActive: true
  }
];

/**
 * Seed the database with initial crop data
 */
export const seedCropData = async (): Promise<void> => {
  try {
    logger.info('Starting crop data seeding...');

    // Check if crops already exist
    const existingCrops = await Crop.countDocuments();
    if (existingCrops > 0) {
      logger.info(`Database already contains ${existingCrops} crops. Skipping seed.`);
      return;
    }

    // Insert seed data
    await Crop.insertMany(cropSeedData);
    
    logger.info(`Successfully seeded ${cropSeedData.length} crops`);
  } catch (error) {
    logger.error('Error seeding crop data:', error);
    throw error;
  }
};

/**
 * Clear all crop data (use with caution)
 */
export const clearCropData = async (): Promise<void> => {
  try {
    await Crop.deleteMany({});
    logger.info('All crop data cleared');
  } catch (error) {
    logger.error('Error clearing crop data:', error);
    throw error;
  }
};

/**
 * Update crop market prices
 */
export const updateCropPrices = async (): Promise<void> => {
  try {
    logger.info('Updating crop market prices...');
    
    const crops = await Crop.find({ isActive: true });
    
    for (const crop of crops) {
      // Simulate price fluctuation (±10%)
      const currentPrice = crop.economics.marketPrice.average;
      const fluctuation = (Math.random() - 0.5) * 0.2; // ±10%
      const newPrice = currentPrice * (1 + fluctuation);
      
      crop.economics.marketPrice.average = Math.round(newPrice * 100) / 100;
      crop.economics.marketPrice.lastUpdated = new Date();
      
      await crop.save();
    }
    
    logger.info('Crop prices updated successfully');
  } catch (error) {
    logger.error('Error updating crop prices:', error);
    throw error;
  }
};