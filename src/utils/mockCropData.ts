// Mock crop data for testing and demonstration

import { Crop, CropType, CropSeason, SoilType, IrrigationMethod, FertilizerType, PestType } from './agricultureUtils';

/**
 * Mock crop data for the KrishiMitra application
 * This data is for demonstration purposes only
 */
export const mockCrops: Crop[] = [
  {
    id: 'rice-001',
    name: 'Rice',
    scientificName: 'Oryza sativa',
    localNames: {
      en: 'Rice',
      hi: 'चावल',
      pa: 'ਚਾਵਲ',
      bn: 'চাল',
      te: 'వరి',
      ta: 'அரிசி',
      mr: 'तांदूळ',
      gu: 'ચોખા',
      kn: 'ಅಕ್ಕಿ',
      ml: 'അരി',
    },
    type: CropType.CEREAL,
    seasons: [CropSeason.KHARIF],
    durationDays: 120,
    waterRequirementMm: 1200,
    soilTypes: [SoilType.ALLUVIAL, SoilType.CLAY, SoilType.LOAMY],
    idealTemperatureRange: {
      min: 20,
      max: 35,
    },
    idealRainfallRange: {
      min: 1000,
      max: 2000,
    },
    idealPhRange: {
      min: 5.5,
      max: 6.5,
    },
    fertilizers: [
      {
        type: FertilizerType.NITROGEN,
        amountKgPerHectare: 120,
        applicationTiming: 'Split application: 50% at transplanting, 25% at tillering, 25% at panicle initiation',
      },
      {
        type: FertilizerType.PHOSPHORUS,
        amountKgPerHectare: 60,
        applicationTiming: '100% at transplanting',
      },
      {
        type: FertilizerType.POTASSIUM,
        amountKgPerHectare: 60,
        applicationTiming: 'Split application: 50% at transplanting, 50% at panicle initiation',
      },
    ],
    commonPests: [
      {
        name: 'Rice Stem Borer',
        type: PestType.INSECT,
        symptoms: 'Dead hearts in vegetative stage, white heads in reproductive stage',
        management: 'Use resistant varieties, balanced fertilization, light traps, and recommended insecticides',
      },
      {
        name: 'Rice Blast',
        type: PestType.FUNGAL,
        symptoms: 'Diamond-shaped lesions on leaves, infected nodes turn blackish and break easily',
        management: 'Use resistant varieties, balanced fertilization, fungicides like Tricyclazole',
      },
      {
        name: 'Brown Plant Hopper',
        type: PestType.INSECT,
        symptoms: 'Plants turn yellow and dry up rapidly, honeydew excretion leads to sooty mold',
        management: 'Use resistant varieties, avoid excessive nitrogen, drain fields, use recommended insecticides',
      },
    ],
    yieldPerHectare: {
      min: 3500,
      max: 6000,
      unit: 'kg',
    },
    marketValue: {
      min: 18,
      max: 25,
      currency: 'INR/kg',
    },
    irrigationMethods: [IrrigationMethod.FLOOD, IrrigationMethod.SPRINKLER],
    intercropping: ['azolla-001', 'fish-001'],
    rotationRecommendations: ['wheat-001', 'pulses-001', 'oilseeds-001'],
    nutritionalValue: {
      calories: '130 kcal per 100g',
      protein: '2.7g per 100g',
      carbohydrates: '28g per 100g',
      fiber: '0.4g per 100g',
    },
    storageGuidelines: 'Store in cool, dry place with moisture content below 14%. Use hermetic bags for long-term storage.',
    processingMethods: ['Milling', 'Parboiling', 'Puffing'],
    governmentSchemes: ['PM-KISAN', 'Crop Insurance Scheme', 'Rice Development Scheme'],
    imageUrl: 'assets/images/crops/rice.jpg',
  },
  {
    id: 'wheat-001',
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    localNames: {
      en: 'Wheat',
      hi: 'गेहूं',
      pa: 'ਕਣਕ',
      bn: 'গম',
      te: 'గోధుమ',
      ta: 'கோதுமை',
      mr: 'गहू',
      gu: 'ઘઉં',
      kn: 'ಗೋಧಿ',
      ml: 'ഗോതമ്പ്',
    },
    type: CropType.CEREAL,
    seasons: [CropSeason.RABI],
    durationDays: 140,
    waterRequirementMm: 450,
    soilTypes: [SoilType.LOAMY, SoilType.CLAY, SoilType.BLACK],
    idealTemperatureRange: {
      min: 15,
      max: 25,
    },
    idealRainfallRange: {
      min: 400,
      max: 650,
    },
    idealPhRange: {
      min: 6.0,
      max: 7.5,
    },
    fertilizers: [
      {
        type: FertilizerType.NITROGEN,
        amountKgPerHectare: 120,
        applicationTiming: 'Split application: 50% at sowing, 25% at first irrigation, 25% at second irrigation',
      },
      {
        type: FertilizerType.PHOSPHORUS,
        amountKgPerHectare: 60,
        applicationTiming: '100% at sowing',
      },
      {
        type: FertilizerType.POTASSIUM,
        amountKgPerHectare: 40,
        applicationTiming: '100% at sowing',
      },
    ],
    commonPests: [
      {
        name: 'Aphids',
        type: PestType.INSECT,
        symptoms: 'Curling of leaves, stunted growth, honeydew secretion',
        management: 'Use resistant varieties, timely sowing, balanced fertilization, recommended insecticides',
      },
      {
        name: 'Powdery Mildew',
        type: PestType.FUNGAL,
        symptoms: 'White powdery growth on leaves, stems and spikes',
        management: 'Use resistant varieties, balanced fertilization, fungicides like Propiconazole',
      },
      {
        name: 'Rust',
        type: PestType.FUNGAL,
        symptoms: 'Reddish-brown pustules on leaves and stems',
        management: 'Use resistant varieties, early sowing, fungicides like Propiconazole or Tebuconazole',
      },
    ],
    yieldPerHectare: {
      min: 3000,
      max: 5500,
      unit: 'kg',
    },
    marketValue: {
      min: 20,
      max: 28,
      currency: 'INR/kg',
    },
    irrigationMethods: [IrrigationMethod.FLOOD, IrrigationMethod.SPRINKLER],
    intercropping: ['mustard-001', 'chickpea-001'],
    rotationRecommendations: ['rice-001', 'pulses-001', 'maize-001'],
    nutritionalValue: {
      calories: '340 kcal per 100g',
      protein: '13g per 100g',
      carbohydrates: '71g per 100g',
      fiber: '10g per 100g',
    },
    storageGuidelines: 'Store in cool, dry place with moisture content below 12%. Use hermetic bags for long-term storage.',
    processingMethods: ['Milling', 'Grinding', 'Malting'],
    governmentSchemes: ['PM-KISAN', 'Crop Insurance Scheme', 'National Food Security Mission'],
    imageUrl: 'assets/images/crops/wheat.jpg',
  },
  {
    id: 'cotton-001',
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    localNames: {
      en: 'Cotton',
      hi: 'कपास',
      pa: 'ਕਪਾਹ',
      bn: 'তুলা',
      te: 'పత్తి',
      ta: 'பருத்தி',
      mr: 'कापूस',
      gu: 'કપાસ',
      kn: 'ಹತ್ತಿ',
      ml: 'പരുത്തി',
    },
    type: CropType.CASH_CROP,
    seasons: [CropSeason.KHARIF],
    durationDays: 180,
    waterRequirementMm: 700,
    soilTypes: [SoilType.BLACK, SoilType.ALLUVIAL, SoilType.RED],
    idealTemperatureRange: {
      min: 21,
      max: 35,
    },
    idealRainfallRange: {
      min: 500,
      max: 1000,
    },
    idealPhRange: {
      min: 6.0,
      max: 8.0,
    },
    fertilizers: [
      {
        type: FertilizerType.NITROGEN,
        amountKgPerHectare: 100,
        applicationTiming: 'Split application: 50% at sowing, 50% at flowering',
      },
      {
        type: FertilizerType.PHOSPHORUS,
        amountKgPerHectare: 50,
        applicationTiming: '100% at sowing',
      },
      {
        type: FertilizerType.POTASSIUM,
        amountKgPerHectare: 50,
        applicationTiming: 'Split application: 50% at sowing, 50% at flowering',
      },
    ],
    commonPests: [
      {
        name: 'Bollworm',
        type: PestType.INSECT,
        symptoms: 'Holes in bolls, shedding of squares and young bolls',
        management: 'Use Bt cotton varieties, pheromone traps, balanced fertilization, recommended insecticides',
      },
      {
        name: 'Whitefly',
        type: PestType.INSECT,
        symptoms: 'Yellowing of leaves, sticky honeydew on leaves, sooty mold',
        management: 'Use resistant varieties, yellow sticky traps, neem-based insecticides',
      },
      {
        name: 'Cotton Leaf Curl Virus',
        type: PestType.VIRAL,
        symptoms: 'Upward curling of leaves, thickened veins, stunted growth',
        management: 'Use resistant varieties, control whitefly vector, remove and destroy infected plants',
      },
    ],
    yieldPerHectare: {
      min: 1500,
      max: 2500,
      unit: 'kg',
    },
    marketValue: {
      min: 50,
      max: 70,
      currency: 'INR/kg',
    },
    irrigationMethods: [IrrigationMethod.DRIP, IrrigationMethod.SPRINKLER],
    intercropping: ['pulses-001', 'groundnut-001'],
    rotationRecommendations: ['wheat-001', 'chickpea-001', 'sorghum-001'],
    nutritionalValue: {
      fiber: 'High fiber content',
      oil: 'Cottonseed oil rich in vitamin E',
      protein: 'Cottonseed meal high in protein',
    },
    storageGuidelines: 'Store in dry place with good ventilation. Protect from moisture and pests.',
    processingMethods: ['Ginning', 'Spinning', 'Weaving'],
    governmentSchemes: ['Technology Mission on Cotton', 'Crop Insurance Scheme', 'Minimum Support Price'],
    imageUrl: 'assets/images/crops/cotton.jpg',
  },
  {
    id: 'tomato-001',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    localNames: {
      en: 'Tomato',
      hi: 'टमाटर',
      pa: 'ਟਮਾਟਰ',
      bn: 'টমেটো',
      te: 'టమాటా',
      ta: 'தக்காளி',
      mr: 'टोमॅटो',
      gu: 'ટમેટા',
      kn: 'ಟೊಮೆಟೊ',
      ml: 'തക്കാളി',
    },
    type: CropType.VEGETABLE,
    seasons: [CropSeason.RABI, CropSeason.ZAID],
    durationDays: 90,
    waterRequirementMm: 600,
    soilTypes: [SoilType.LOAMY, SoilType.SANDY, SoilType.RED],
    idealTemperatureRange: {
      min: 20,
      max: 30,
    },
    idealRainfallRange: {
      min: 400,
      max: 600,
    },
    idealPhRange: {
      min: 6.0,
      max: 7.0,
    },
    fertilizers: [
      {
        type: FertilizerType.NITROGEN,
        amountKgPerHectare: 100,
        applicationTiming: 'Split application: 50% at transplanting, 25% at flowering, 25% at fruiting',
      },
      {
        type: FertilizerType.PHOSPHORUS,
        amountKgPerHectare: 80,
        applicationTiming: '100% at transplanting',
      },
      {
        type: FertilizerType.POTASSIUM,
        amountKgPerHectare: 80,
        applicationTiming: 'Split application: 50% at transplanting, 50% at flowering',
      },
    ],
    commonPests: [
      {
        name: 'Tomato Fruit Borer',
        type: PestType.INSECT,
        symptoms: 'Holes in fruits, frass visible at entry point',
        management: 'Use pheromone traps, balanced fertilization, neem-based insecticides, Bt formulations',
      },
      {
        name: 'Early Blight',
        type: PestType.FUNGAL,
        symptoms: 'Dark brown spots with concentric rings on leaves, stems and fruits',
        management: 'Use resistant varieties, crop rotation, fungicides like Mancozeb or Chlorothalonil',
      },
      {
        name: 'Tomato Leaf Curl Virus',
        type: PestType.VIRAL,
        symptoms: 'Upward curling of leaves, reduced leaf size, stunted growth',
        management: 'Use resistant varieties, control whitefly vector, remove and destroy infected plants',
      },
    ],
    yieldPerHectare: {
      min: 20000,
      max: 40000,
      unit: 'kg',
    },
    marketValue: {
      min: 10,
      max: 40,
      currency: 'INR/kg',
    },
    irrigationMethods: [IrrigationMethod.DRIP, IrrigationMethod.SPRINKLER],
    intercropping: ['marigold-001', 'basil-001'],
    rotationRecommendations: ['legumes-001', 'cucumber-001', 'onion-001'],
    nutritionalValue: {
      calories: '18 kcal per 100g',
      protein: '0.9g per 100g',
      carbohydrates: '3.9g per 100g',
      vitamin_c: '14mg per 100g',
      lycopene: 'High antioxidant content',
    },
    storageGuidelines: 'Store at room temperature away from direct sunlight for ripening. Refrigerate ripe tomatoes.',
    processingMethods: ['Canning', 'Drying', 'Juicing', 'Sauce making'],
    governmentSchemes: ['National Horticulture Mission', 'Crop Insurance Scheme'],
    imageUrl: 'assets/images/crops/tomato.jpg',
  },
  {
    id: 'chickpea-001',
    name: 'Chickpea',
    scientificName: 'Cicer arietinum',
    localNames: {
      en: 'Chickpea',
      hi: 'चना',
      pa: 'ਛੋਲੇ',
      bn: 'ছোলা',
      te: 'శనగలు',
      ta: 'கொண்டைக்கடலை',
      mr: 'हरभरा',
      gu: 'ચણા',
      kn: 'ಕಡಲೆ',
      ml: 'കടല',
    },
    type: CropType.PULSE,
    seasons: [CropSeason.RABI],
    durationDays: 120,
    waterRequirementMm: 350,
    soilTypes: [SoilType.LOAMY, SoilType.BLACK, SoilType.SANDY],
    idealTemperatureRange: {
      min: 15,
      max: 25,
    },
    idealRainfallRange: {
      min: 300,
      max: 500,
    },
    idealPhRange: {
      min: 6.0,
      max: 8.0,
    },
    fertilizers: [
      {
        type: FertilizerType.NITROGEN,
        amountKgPerHectare: 20,
        applicationTiming: '100% at sowing',
      },
      {
        type: FertilizerType.PHOSPHORUS,
        amountKgPerHectare: 60,
        applicationTiming: '100% at sowing',
      },
      {
        type: FertilizerType.POTASSIUM,
        amountKgPerHectare: 20,
        applicationTiming: '100% at sowing',
      },
      {
        type: FertilizerType.BIOFERTILIZER,
        amountKgPerHectare: 5,
        applicationTiming: 'Seed treatment before sowing',
      },
    ],
    commonPests: [
      {
        name: 'Pod Borer',
        type: PestType.INSECT,
        symptoms: 'Holes in pods, damaged seeds, frass visible',
        management: 'Use pheromone traps, balanced fertilization, neem-based insecticides, Bt formulations',
      },
      {
        name: 'Fusarium Wilt',
        type: PestType.FUNGAL,
        symptoms: 'Yellowing of leaves, wilting, browning of vascular tissue',
        management: 'Use resistant varieties, crop rotation, seed treatment with fungicides',
      },
      {
        name: 'Ascochyta Blight',
        type: PestType.FUNGAL,
        symptoms: 'Brown lesions on leaves, stems and pods with concentric rings',
        management: 'Use resistant varieties, crop rotation, fungicides like Mancozeb or Chlorothalonil',
      },
    ],
    yieldPerHectare: {
      min: 1000,
      max: 2000,
      unit: 'kg',
    },
    marketValue: {
      min: 50,
      max: 80,
      currency: 'INR/kg',
    },
    irrigationMethods: [IrrigationMethod.SPRINKLER, IrrigationMethod.FLOOD],
    intercropping: ['mustard-001', 'safflower-001'],
    rotationRecommendations: ['wheat-001', 'rice-001', 'cotton-001'],
    nutritionalValue: {
      calories: '364 kcal per 100g',
      protein: '19g per 100g',
      carbohydrates: '61g per 100g',
      fiber: '17g per 100g',
      iron: '4.3mg per 100g',
    },
    storageGuidelines: 'Store in cool, dry place with moisture content below 10%. Use hermetic bags for long-term storage.',
    processingMethods: ['Milling', 'Splitting', 'Roasting', 'Flour making'],
    governmentSchemes: ['National Food Security Mission', 'Crop Insurance Scheme', 'Minimum Support Price'],
    imageUrl: 'assets/images/crops/chickpea.jpg',
  },
];

/**
 * Get a crop by its ID
 * @param cropId The crop ID
 * @returns The crop object or undefined if not found
 */
export const getCropById = (cropId: string): Crop | undefined => {
  return mockCrops.find(crop => crop.id === cropId);
};

/**
 * Get crops by type
 * @param cropType The crop type
 * @returns Array of crops of the specified type
 */
export const getCropsByType = (cropType: CropType): Crop[] => {
  return mockCrops.filter(crop => crop.type === cropType);
};

/**
 * Get crops by season
 * @param season The crop season
 * @returns Array of crops suitable for the specified season
 */
export const getCropsBySeason = (season: CropSeason): Crop[] => {
  return mockCrops.filter(crop => crop.seasons.includes(season));
};

/**
 * Get crops by soil type
 * @param soilType The soil type
 * @returns Array of crops suitable for the specified soil type
 */
export const getCropsBySoilType = (soilType: SoilType): Crop[] => {
  return mockCrops.filter(crop => crop.soilTypes.includes(soilType));
};

/**
 * Search crops by name (in any language)
 * @param searchTerm The search term
 * @returns Array of crops matching the search term
 */
export const searchCropsByName = (searchTerm: string): Crop[] => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return mockCrops.filter(crop => {
    // Check English name
    if (crop.name.toLowerCase().includes(lowerCaseSearchTerm)) {
      return true;
    }
    
    // Check scientific name
    if (crop.scientificName.toLowerCase().includes(lowerCaseSearchTerm)) {
      return true;
    }
    
    // Check local names in all languages
    for (const lang in crop.localNames) {
      if (crop.localNames[lang].toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }
    }
    
    return false;
  });
};