import { getLanguage } from '../utils/languageUtils';

// Types for crop data
export interface CropInfo {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  scientificName: string;
  category: string;
  season: 'kharif' | 'rabi' | 'zaid' | 'year-round';
  description: {
    en: string;
    hi: string;
  };
  imageUrl: string;
  cultivationPeriod: {
    sowing: {
      en: string;
      hi: string;
    };
    harvesting: {
      en: string;
      hi: string;
    };
  };
  waterRequirements: {
    level: 'low' | 'medium' | 'high';
    description: {
      en: string;
      hi: string;
    };
  };
  soilRequirements: {
    types: string[];
    ph: {
      min: number;
      max: number;
    };
    description: {
      en: string;
      hi: string;
    };
  };
  temperatureRange: {
    min: number;
    max: number;
    optimal: number;
    description: {
      en: string;
      hi: string;
    };
  };
  fertilizers: {
    name: string;
    timing: {
      en: string;
      hi: string;
    };
    quantity: {
      en: string;
      hi: string;
    };
    notes: {
      en: string;
      hi: string;
    };
  }[];
  pestsDiseases: {
    name: {
      en: string;
      hi: string;
    };
    symptoms: {
      en: string;
      hi: string;
    };
    management: {
      en: string;
      hi: string;
    };
    preventiveMeasures: {
      en: string;
      hi: string;
    };
  }[];
  yieldEstimate: {
    min: number;
    max: number;
    unit: string;
  };
  marketInfo: {
    averagePrice: number;
    priceUnit: string;
    demandTrend: 'increasing' | 'stable' | 'decreasing';
    majorMarkets: string[];
  };
  governmentSchemes: string[];
  cultivationPractices: {
    title: {
      en: string;
      hi: string;
    };
    description: {
      en: string;
      hi: string;
    };
  }[];
  intercropping: {
    compatibleCrops: string[];
    benefits: {
      en: string;
      hi: string;
    };
  };
  storageGuidelines: {
    en: string;
    hi: string;
  };
  nutritionalValue: {
    en: string;
    hi: string;
  };
  lastUpdated: number;
}

// Mock crop data for offline use
const mockCrops: CropInfo[] = [
  {
    id: 'crop-001',
    name: {
      en: 'Rice',
      hi: 'चावल',
    },
    scientificName: 'Oryza sativa',
    category: 'Cereal',
    season: 'kharif',
    description: {
      en: 'Rice is one of the most important food crops in India, particularly in the eastern and southern regions. It is a staple food for more than half of the Indian population. Rice cultivation is suited to regions with high rainfall and requires standing water in the fields.',
      hi: 'चावल भारत में सबसे महत्वपूर्ण खाद्य फसलों में से एक है, विशेष रूप से पूर्वी और दक्षिणी क्षेत्रों में। यह भारतीय आबादी के आधे से अधिक हिस्से के लिए मुख्य भोजन है। चावल की खेती अधिक वर्षा वाले क्षेत्रों के लिए उपयुक्त है और खेतों में खड़े पानी की आवश्यकता होती है।',
    },
    imageUrl: '/assets/crops/rice.svg',
    cultivationPeriod: {
      sowing: {
        en: 'June to July',
        hi: 'जून से जुलाई',
      },
      harvesting: {
        en: 'November to December',
        hi: 'नवंबर से दिसंबर',
      },
    },
    waterRequirements: {
      level: 'high',
      description: {
        en: 'Rice requires standing water during most of its growing period. It needs approximately 1200-1600 mm of water throughout its lifecycle.',
        hi: 'चावल को अपनी बढ़वार अवधि के अधिकांश समय में खड़े पानी की आवश्यकता होती है। इसे अपने जीवनचक्र में लगभग 1200-1600 मिमी पानी की आवश्यकता होती है।',
      },
    },
    soilRequirements: {
      types: ['Clay', 'Clay loam', 'Silt loam'],
      ph: {
        min: 5.5,
        max: 6.5,
      },
      description: {
        en: 'Rice grows best in clay or clay loam soils that can hold water. The soil should be slightly acidic to neutral with good organic matter content.',
        hi: 'चावल मिट्टी या मिट्टी दोमट मिट्टी में सबसे अच्छा उगता है जो पानी रोक सकता है। मिट्टी थोड़ी अम्लीय से तटस्थ होनी चाहिए और उसमें अच्छी जैविक पदार्थ सामग्री होनी चाहिए।',
      },
    },
    temperatureRange: {
      min: 20,
      max: 40,
      optimal: 30,
      description: {
        en: 'Rice grows best in warm temperatures between 20°C and 40°C, with an optimal temperature around 30°C. It is sensitive to cold temperatures, especially during flowering.',
        hi: 'चावल 20°C और 40°C के बीच गर्म तापमान में सबसे अच्छा उगता है, जिसमें इष्टतम तापमान लगभग 30°C होता है। यह ठंडे तापमान के प्रति संवेदनशील है, विशेष रूप से फूल आने के दौरान।',
      },
    },
    fertilizers: [
      {
        name: 'NPK (Nitrogen, Phosphorus, Potassium)',
        timing: {
          en: 'Apply as basal dose before transplanting',
          hi: 'रोपाई से पहले आधार खुराक के रूप में लागू करें',
        },
        quantity: {
          en: '100-120 kg N, 50-60 kg P2O5, and 50-60 kg K2O per hectare',
          hi: 'प्रति हेक्टेयर 100-120 किग्रा N, 50-60 किग्रा P2O5, और 50-60 किग्रा K2O',
        },
        notes: {
          en: 'Split the nitrogen application: 50% as basal, 25% at tillering, and 25% at panicle initiation',
          hi: 'नाइट्रोजन अनुप्रयोग को विभाजित करें: 50% आधार के रूप में, 25% टिलरिंग पर, और 25% पैनिकल शुरुआत पर',
        },
      },
      {
        name: 'Zinc Sulfate',
        timing: {
          en: 'Apply before transplanting',
          hi: 'रोपाई से पहले लागू करें',
        },
        quantity: {
          en: '25 kg per hectare',
          hi: 'प्रति हेक्टेयर 25 किग्रा',
        },
        notes: {
          en: 'Essential in areas with zinc deficiency',
          hi: 'जिंक की कमी वाले क्षेत्रों में आवश्यक',
        },
      },
    ],
    pestsDiseases: [
      {
        name: {
          en: 'Rice Blast',
          hi: 'चावल का ब्लास्ट',
        },
        symptoms: {
          en: 'Diamond-shaped lesions with gray centers on leaves, nodes, and panicles',
          hi: 'पत्तियों, नोड्स और पैनिकल पर ग्रे सेंटर के साथ हीरे के आकार के घाव',
        },
        management: {
          en: 'Apply fungicides like Tricyclazole or Isoprothiolane. Use resistant varieties.',
          hi: 'ट्राइसाइक्लाज़ोल या आइसोप्रोथियोलेन जैसे कवकनाशी लागू करें। प्रतिरोधी किस्मों का उपयोग करें।',
        },
        preventiveMeasures: {
          en: 'Balanced fertilization, proper spacing, and avoiding excess nitrogen',
          hi: 'संतुलित उर्वरक, उचित अंतराल, और अतिरिक्त नाइट्रोजन से बचना',
        },
      },
      {
        name: {
          en: 'Brown Plant Hopper',
          hi: 'भूरा पौधा हॉपर',
        },
        symptoms: {
          en: 'Plants turn yellow and dry up, creating "hopperburn" patches in the field',
          hi: 'पौधे पीले हो जाते हैं और सूख जाते हैं, खेत में "हॉपरबर्न" पैच बनाते हैं',
        },
        management: {
          en: 'Apply insecticides like Imidacloprid or Buprofezin. Drain fields periodically.',
          hi: 'इमिडाक्लोप्रिड या बुप्रोफेज़िन जैसे कीटनाशक लागू करें। समय-समय पर खेतों को सुखाएं।',
        },
        preventiveMeasures: {
          en: 'Use resistant varieties, avoid excessive nitrogen, and maintain field hygiene',
          hi: 'प्रतिरोधी किस्मों का उपयोग करें, अत्यधिक नाइट्रोजन से बचें, और खेत की स्वच्छता बनाए रखें',
        },
      },
    ],
    yieldEstimate: {
      min: 3.5,
      max: 6.0,
      unit: 'tonnes/hectare',
    },
    marketInfo: {
      averagePrice: 18.5,
      priceUnit: 'Rs/kg',
      demandTrend: 'stable',
      majorMarkets: ['Andhra Pradesh', 'West Bengal', 'Punjab', 'Uttar Pradesh'],
    },
    governmentSchemes: ['PM-KISAN', 'Pradhan Mantri Fasal Bima Yojana', 'National Food Security Mission'],
    cultivationPractices: [
      {
        title: {
          en: 'System of Rice Intensification (SRI)',
          hi: 'चावल गहनता प्रणाली (SRI)',
        },
        description: {
          en: 'SRI involves planting younger seedlings at wider spacing, careful water management, and mechanical weeding. It can increase yields while using less water and seeds.',
          hi: 'SRI में कम उम्र के पौधों को अधिक दूरी पर लगाना, सावधानीपूर्वक पानी का प्रबंधन, और यांत्रिक निराई शामिल है। यह कम पानी और बीज का उपयोग करते हुए उपज बढ़ा सकता है।',
        },
      },
      {
        title: {
          en: 'Direct Seeded Rice (DSR)',
          hi: 'सीधे बोए गए चावल (DSR)',
        },
        description: {
          en: 'DSR involves sowing seeds directly into the field rather than transplanting seedlings. It requires less labor and water but needs good weed management.',
          hi: 'DSR में पौधों की रोपाई के बजाय सीधे खेत में बीज बोना शामिल है। इसमें कम श्रम और पानी की आवश्यकता होती है लेकिन अच्छे खरपतवार प्रबंधन की आवश्यकता होती है।',
        },
      },
    ],
    intercropping: {
      compatibleCrops: ['Azolla', 'Fish (in paddy fields)'],
      benefits: {
        en: 'Azolla fixes nitrogen and can reduce fertilizer needs. Fish in paddy fields can control pests and provide additional income.',
        hi: 'अज़ोला नाइट्रोजन को स्थिर करता है और उर्वरक की आवश्यकता को कम कर सकता है। धान के खेतों में मछली कीटों को नियंत्रित कर सकती है और अतिरिक्त आय प्रदान कर सकती है।',
      },
    },
    storageGuidelines: {
      en: 'Store rice in clean, dry, and well-ventilated conditions. Maintain moisture content below 14%. Use proper bags and protect from pests.',
      hi: 'चावल को साफ, सूखी और अच्छी वेंटिलेशन वाली स्थितियों में स्टोर करें। नमी की मात्रा 14% से कम रखें। उचित बैग का उपयोग करें और कीटों से बचाएं।',
    },
    nutritionalValue: {
      en: 'Rice is a good source of carbohydrates and provides some protein. Brown rice contains more fiber, vitamins, and minerals than white rice.',
      hi: 'चावल कार्बोहाइड्रेट का एक अच्छा स्रोत है और कुछ प्रोटीन प्रदान करता है। ब्राउन राइस में सफेद चावल की तुलना में अधिक फाइबर, विटामिन और खनिज होते हैं।',
    },
    lastUpdated: Date.now(),
  },
  {
    id: 'crop-002',
    name: {
      en: 'Wheat',
      hi: 'गेहूं',
    },
    scientificName: 'Triticum aestivum',
    category: 'Cereal',
    season: 'rabi',
    description: {
      en: 'Wheat is the second most important cereal crop in India after rice. It is primarily grown in the northern and central regions of the country. Wheat is a staple food in northern India and is used to make various products like bread, chapati, and pasta.',
      hi: 'गेहूं चावल के बाद भारत में दूसरी सबसे महत्वपूर्ण अनाज फसल है। यह मुख्य रूप से देश के उत्तरी और मध्य क्षेत्रों में उगाया जाता है। गेहूं उत्तरी भारत में एक मुख्य भोजन है और इसका उपयोग रोटी, चपाती और पास्ता जैसे विभिन्न उत्पादों को बनाने के लिए किया जाता है।',
    },
    imageUrl: '/assets/crops/wheat.svg',
    cultivationPeriod: {
      sowing: {
        en: 'October to December',
        hi: 'अक्टूबर से दिसंबर',
      },
      harvesting: {
        en: 'March to April',
        hi: 'मार्च से अप्रैल',
      },
    },
    waterRequirements: {
      level: 'medium',
      description: {
        en: 'Wheat requires moderate water throughout its growing period. It needs approximately 450-650 mm of water during its lifecycle. Critical irrigation stages are crown root initiation, tillering, jointing, flowering, and grain filling.',
        hi: 'गेहूं को अपनी बढ़वार अवधि के दौरान मध्यम पानी की आवश्यकता होती है। इसे अपने जीवनचक्र के दौरान लगभग 450-650 मिमी पानी की आवश्यकता होती है। महत्वपूर्ण सिंचाई चरण क्राउन रूट इनिशिएशन, टिलरिंग, जॉइंटिंग, फूल आना और अनाज भरना हैं।',
      },
    },
    soilRequirements: {
      types: ['Loam', 'Clay loam', 'Silt loam'],
      ph: {
        min: 6.0,
        max: 7.5,
      },
      description: {
        en: 'Wheat grows best in well-drained loam or clay loam soils with good water-holding capacity. The soil should be neutral to slightly alkaline with good organic matter content.',
        hi: 'गेहूं अच्छी जल धारण क्षमता वाली अच्छी जल निकासी वाली दोमट या मिट्टी दोमट मिट्टी में सबसे अच्छा उगता है। मिट्टी तटस्थ से थोड़ी क्षारीय होनी चाहिए और उसमें अच्छी जैविक पदार्थ सामग्री होनी चाहिए।',
      },
    },
    temperatureRange: {
      min: 3,
      max: 32,
      optimal: 25,
      description: {
        en: 'Wheat requires cool temperatures during early growth (15-20°C) and moderate temperatures during grain filling (25-32°C). It can tolerate frost during early stages but is sensitive to high temperatures during flowering and grain filling.',
        hi: 'गेहूं को प्रारंभिक विकास के दौरान ठंडे तापमान (15-20°C) और अनाज भरने के दौरान मध्यम तापमान (25-32°C) की आवश्यकता होती है। यह प्रारंभिक चरणों के दौरान ठंढ को सहन कर सकता है लेकिन फूल आने और अनाज भरने के दौरान उच्च तापमान के प्रति संवेदनशील होता है।',
      },
    },
    fertilizers: [
      {
        name: 'NPK (Nitrogen, Phosphorus, Potassium)',
        timing: {
          en: 'Apply as basal dose before sowing',
          hi: 'बुवाई से पहले आधार खुराक के रूप में लागू करें',
        },
        quantity: {
          en: '120-150 kg N, 60-80 kg P2O5, and 40-60 kg K2O per hectare',
          hi: 'प्रति हेक्टेयर 120-150 किग्रा N, 60-80 किग्रा P2O5, और 40-60 किग्रा K2O',
        },
        notes: {
          en: 'Split the nitrogen application: 1/3 as basal, 1/3 at first irrigation (21-25 days), and 1/3 at second irrigation (45-50 days)',
          hi: 'नाइट्रोजन अनुप्रयोग को विभाजित करें: 1/3 आधार के रूप में, 1/3 पहली सिंचाई पर (21-25 दिन), और 1/3 दूसरी सिंचाई पर (45-50 दिन)',
        },
      },
      {
        name: 'Zinc Sulfate',
        timing: {
          en: 'Apply before sowing',
          hi: 'बुवाई से पहले लागू करें',
        },
        quantity: {
          en: '25 kg per hectare',
          hi: 'प्रति हेक्टेयर 25 किग्रा',
        },
        notes: {
          en: 'Essential in areas with zinc deficiency',
          hi: 'जिंक की कमी वाले क्षेत्रों में आवश्यक',
        },
      },
    ],
    pestsDiseases: [
      {
        name: {
          en: 'Rust (Yellow, Brown, and Black)',
          hi: 'रस्ट (पीला, भूरा और काला)',
        },
        symptoms: {
          en: 'Yellow, brown, or black pustules on leaves, stems, and spikes',
          hi: 'पत्तियों, तनों और स्पाइक्स पर पीले, भूरे या काले पुस्टुल्स',
        },
        management: {
          en: 'Apply fungicides like Propiconazole or Tebuconazole. Use resistant varieties.',
          hi: 'प्रोपिकोनाज़ोल या टेबुकोनाज़ोल जैसे कवकनाशी लागू करें। प्रतिरोधी किस्मों का उपयोग करें।',
        },
        preventiveMeasures: {
          en: 'Early sowing, balanced fertilization, and crop rotation',
          hi: 'जल्दी बुवाई, संतुलित उर्वरक, और फसल चक्र',
        },
      },
      {
        name: {
          en: 'Aphids',
          hi: 'एफिड्स',
        },
        symptoms: {
          en: 'Curling of leaves, stunted growth, and honeydew secretion',
          hi: 'पत्तियों का मुड़ना, विकास रुकना, और मधुरस स्राव',
        },
        management: {
          en: 'Apply insecticides like Imidacloprid or Thiamethoxam. Encourage natural predators.',
          hi: 'इमिडाक्लोप्रिड या थायमेथोक्साम जैसे कीटनाशक लागू करें। प्राकृतिक शिकारियों को प्रोत्साहित करें।',
        },
        preventiveMeasures: {
          en: 'Early sowing, balanced fertilization, and field monitoring',
          hi: 'जल्दी बुवाई, संतुलित उर्वरक, और खेत की निगरानी',
        },
      },
    ],
    yieldEstimate: {
      min: 3.0,
      max: 5.5,
      unit: 'tonnes/hectare',
    },
    marketInfo: {
      averagePrice: 20.0,
      priceUnit: 'Rs/kg',
      demandTrend: 'stable',
      majorMarkets: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'],
    },
    governmentSchemes: ['PM-KISAN', 'Pradhan Mantri Fasal Bima Yojana', 'National Food Security Mission'],
    cultivationPractices: [
      {
        title: {
          en: 'Zero Tillage',
          hi: 'जीरो टिलेज',
        },
        description: {
          en: 'Zero tillage involves sowing wheat directly into the residue of the previous crop without tilling the soil. It conserves soil moisture, reduces costs, and allows earlier sowing.',
          hi: 'जीरो टिलेज में मिट्टी की जुताई किए बिना पिछली फसल के अवशेष में सीधे गेहूं की बुवाई शामिल है। यह मिट्टी की नमी को संरक्षित करता है, लागत को कम करता है, और जल्दी बुवाई की अनुमति देता है।',
        },
      },
      {
        title: {
          en: 'Bed Planting',
          hi: 'बेड प्लांटिंग',
        },
        description: {
          en: 'Bed planting involves sowing wheat on raised beds with furrows in between. It improves water use efficiency, reduces lodging, and facilitates better weed management.',
          hi: 'बेड प्लांटिंग में बीच में नालियों के साथ उठे हुए बेड पर गेहूं की बुवाई शामिल है। यह पानी के उपयोग की दक्षता में सुधार करता है, लॉजिंग को कम करता है, और बेहतर खरपतवार प्रबंधन की सुविधा प्रदान करता है।',
        },
      },
    ],
    intercropping: {
      compatibleCrops: ['Mustard', 'Chickpea', 'Lentil'],
      benefits: {
        en: 'Intercropping with legumes can improve soil fertility and provide additional income. Mustard can act as a trap crop for some pests.',
        hi: 'फलियों के साथ अंतःफसल मिट्टी की उर्वरता में सुधार कर सकती है और अतिरिक्त आय प्रदान कर सकती है। सरसों कुछ कीटों के लिए ट्रैप क्रॉप के रूप में कार्य कर सकती है।',
      },
    },
    storageGuidelines: {
      en: 'Store wheat in clean, dry, and well-ventilated conditions. Maintain moisture content below 12%. Use proper bags and protect from pests.',
      hi: 'गेहूं को साफ, सूखी और अच्छी वेंटिलेशन वाली स्थितियों में स्टोर करें। नमी की मात्रा 12% से कम रखें। उचित बैग का उपयोग करें और कीटों से बचाएं।',
    },
    nutritionalValue: {
      en: 'Wheat is a good source of carbohydrates, protein, fiber, and various vitamins and minerals. Whole wheat contains more nutrients than refined wheat products.',
      hi: 'गेहूं कार्बोहाइड्रेट, प्रोटीन, फाइबर और विभिन्न विटामिन और खनिजों का एक अच्छा स्रोत है। साबुत गेहूं में परिष्कृत गेहूं उत्पादों की तुलना में अधिक पोषक तत्व होते हैं।',
    },
    lastUpdated: Date.now(),
  },
  {
    id: 'crop-003',
    name: {
      en: 'Cotton',
      hi: 'कपास',
    },
    scientificName: 'Gossypium hirsutum',
    category: 'Fiber',
    season: 'kharif',
    description: {
      en: 'Cotton is one of the most important commercial crops in India, providing fiber for the textile industry. India is one of the largest producers of cotton in the world. It is primarily grown in the western and central regions of the country.',
      hi: 'कपास भारत में सबसे महत्वपूर्ण व्यावसायिक फसलों में से एक है, जो कपड़ा उद्योग के लिए फाइबर प्रदान करती है। भारत दुनिया में कपास के सबसे बड़े उत्पादकों में से एक है। यह मुख्य रूप से देश के पश्चिमी और मध्य क्षेत्रों में उगाई जाती है।',
    },
    imageUrl: '/assets/crops/cotton.svg',
    cultivationPeriod: {
      sowing: {
        en: 'April to June',
        hi: 'अप्रैल से जून',
      },
      harvesting: {
        en: 'October to December',
        hi: 'अक्टूबर से दिसंबर',
      },
    },
    waterRequirements: {
      level: 'medium',
      description: {
        en: 'Cotton requires moderate water throughout its growing period. It needs approximately 700-1200 mm of water during its lifecycle. Critical irrigation stages are flowering and boll development.',
        hi: 'कपास को अपनी बढ़वार अवधि के दौरान मध्यम पानी की आवश्यकता होती है। इसे अपने जीवनचक्र के दौरान लगभग 700-1200 मिमी पानी की आवश्यकता होती है। महत्वपूर्ण सिंचाई चरण फूल आना और बॉल विकास हैं।',
      },
    },
    soilRequirements: {
      types: ['Black cotton soil', 'Loam', 'Sandy loam'],
      ph: {
        min: 6.0,
        max: 8.0,
      },
      description: {
        en: 'Cotton grows best in deep, well-drained black cotton soils (regur) or loamy soils with good water-holding capacity. The soil should be neutral to slightly alkaline.',
        hi: 'कपास गहरी, अच्छी जल निकासी वाली काली कपास मिट्टी (रेगुर) या अच्छी जल धारण क्षमता वाली दोमट मिट्टी में सबसे अच्छा उगती है। मिट्टी तटस्थ से थोड़ी क्षारीय होनी चाहिए।',
      },
    },
    temperatureRange: {
      min: 15,
      max: 45,
      optimal: 30,
      description: {
        en: 'Cotton requires warm temperatures between 25°C and 35°C for optimal growth. It can tolerate high temperatures but is sensitive to frost.',
        hi: 'कपास को इष्टतम विकास के लिए 25°C और 35°C के बीच गर्म तापमान की आवश्यकता होती है। यह उच्च तापमान को सहन कर सकती है लेकिन ठंढ के प्रति संवेदनशील होती है।',
      },
    },
    fertilizers: [
      {
        name: 'NPK (Nitrogen, Phosphorus, Potassium)',
        timing: {
          en: 'Apply as basal dose before sowing',
          hi: 'बुवाई से पहले आधार खुराक के रूप में लागू करें',
        },
        quantity: {
          en: '100-120 kg N, 50-60 kg P2O5, and 50-60 kg K2O per hectare',
          hi: 'प्रति हेक्टेयर 100-120 किग्रा N, 50-60 किग्रा P2O5, और 50-60 किग्रा K2O',
        },
        notes: {
          en: 'Split the nitrogen application: 50% as basal, 25% at flowering, and 25% at boll development',
          hi: 'नाइट्रोजन अनुप्रयोग को विभाजित करें: 50% आधार के रूप में, 25% फूल आने पर, और 25% बॉल विकास पर',
        },
      },
      {
        name: 'Micronutrients (Zinc, Boron)',
        timing: {
          en: 'Apply as foliar spray during vegetative growth',
          hi: 'वनस्पति विकास के दौरान पत्ती स्प्रे के रूप में लागू करें',
        },
        quantity: {
          en: '0.5% Zinc Sulfate and 0.2% Borax',
          hi: '0.5% जिंक सल्फेट और 0.2% बोरेक्स',
        },
        notes: {
          en: 'Essential for proper boll development',
          hi: 'उचित बॉल विकास के लिए आवश्यक',
        },
      },
    ],
    pestsDiseases: [
      {
        name: {
          en: 'Bollworm Complex',
          hi: 'बॉलवर्म कॉम्प्लेक्स',
        },
        symptoms: {
          en: 'Holes in bolls, damaged flowers, and shedding of young bolls',
          hi: 'बॉल्स में छेद, क्षतिग्रस्त फूल, और युवा बॉल्स का गिरना',
        },
        management: {
          en: 'Apply insecticides like Spinosad or Emamectin benzoate. Use Bt cotton varieties.',
          hi: 'स्पिनोसैड या इमामेक्टिन बेंजोएट जैसे कीटनाशक लागू करें। बीटी कपास किस्मों का उपयोग करें।',
        },
        preventiveMeasures: {
          en: 'Early sowing, balanced fertilization, and proper crop rotation',
          hi: 'जल्दी बुवाई, संतुलित उर्वरक, और उचित फसल चक्र',
        },
      },
      {
        name: {
          en: 'Cotton Leaf Curl Virus',
          hi: 'कपास पत्ती कर्ल वायरस',
        },
        symptoms: {
          en: 'Upward curling of leaves, thickening of veins, and stunted growth',
          hi: 'पत्तियों का ऊपर की ओर मुड़ना, नसों का मोटा होना, और विकास रुकना',
        },
        management: {
          en: 'No direct control. Control whitefly vectors using insecticides.',
          hi: 'कोई सीधा नियंत्रण नहीं। कीटनाशकों का उपयोग करके व्हाइटफ्लाई वेक्टर्स को नियंत्रित करें।',
        },
        preventiveMeasures: {
          en: 'Use resistant varieties, early sowing, and proper crop rotation',
          hi: 'प्रतिरोधी किस्मों का उपयोग करें, जल्दी बुवाई करें, और उचित फसल चक्र अपनाएं',
        },
      },
    ],
    yieldEstimate: {
      min: 1.5,
      max: 3.0,
      unit: 'tonnes/hectare',
    },
    marketInfo: {
      averagePrice: 6000,
      priceUnit: 'Rs/quintal',
      demandTrend: 'stable',
      majorMarkets: ['Gujarat', 'Maharashtra', 'Telangana', 'Punjab'],
    },
    governmentSchemes: ['PM-KISAN', 'Pradhan Mantri Fasal Bima Yojana', 'Technology Mission on Cotton'],
    cultivationPractices: [
      {
        title: {
          en: 'High Density Planting System (HDPS)',
          hi: 'उच्च घनत्व रोपण प्रणाली (HDPS)',
        },
        description: {
          en: 'HDPS involves planting cotton at higher densities (40,000-55,000 plants/ha) compared to conventional planting (15,000-20,000 plants/ha). It can increase yields and reduce the cost of cultivation.',
          hi: 'HDPS में पारंपरिक रोपण (15,000-20,000 पौधे/हेक्टेयर) की तुलना में उच्च घनत्व (40,000-55,000 पौधे/हेक्टेयर) पर कपास लगाना शामिल है। यह उपज बढ़ा सकता है और खेती की लागत को कम कर सकता है।',
        },
      },
      {
        title: {
          en: 'Integrated Pest Management (IPM)',
          hi: 'एकीकृत कीट प्रबंधन (IPM)',
        },
        description: {
          en: 'IPM involves using a combination of cultural, biological, and chemical methods to control pests. It reduces the reliance on chemical pesticides and promotes sustainable pest management.',
          hi: 'IPM में कीटों को नियंत्रित करने के लिए सांस्कृतिक, जैविक और रासायनिक विधियों के संयोजन का उपयोग शामिल है। यह रासायनिक कीटनाशकों पर निर्भरता को कम करता है और स्थायी कीट प्रबंधन को बढ़ावा देता है।',
        },
      },
    ],
    intercropping: {
      compatibleCrops: ['Groundnut', 'Soybean', 'Black gram', 'Green gram'],
      benefits: {
        en: 'Intercropping with legumes can improve soil fertility, reduce pest incidence, and provide additional income.',
        hi: 'फलियों के साथ अंतःफसल मिट्टी की उर्वरता में सुधार कर सकती है, कीट घटना को कम कर सकती है, और अतिरिक्त आय प्रदान कर सकती है।',
      },
    },
    storageGuidelines: {
      en: 'Store cotton in clean, dry, and well-ventilated conditions. Protect from moisture, pests, and contamination.',
      hi: 'कपास को साफ, सूखी और अच्छी वेंटिलेशन वाली स्थितियों में स्टोर करें। नमी, कीटों और संदूषण से बचाएं।',
    },
    nutritionalValue: {
      en: 'Cotton seeds are rich in protein and oil. Cottonseed oil is used for cooking and cottonseed meal is used as animal feed.',
      hi: 'कपास के बीज प्रोटीन और तेल से भरपूर होते हैं। कपास के बीज के तेल का उपयोग खाना पकाने के लिए किया जाता है और कपास के बीज के भोजन का उपयोग पशु आहार के रूप में किया जाता है।',
    },
    lastUpdated: Date.now(),
  },
];

// Function to fetch all crops
export const getAllCrops = async (): Promise<{ data: CropInfo[], isOffline: boolean }> => {
  try {
    // In a real implementation, this would call an API
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store in local storage for offline use
    localStorage.setItem('cropData', JSON.stringify(mockCrops));
    
    return { data: mockCrops, isOffline: false };
  } catch (error) {
    console.warn('Failed to fetch crop data, using cached data:', error);
    
    // Try to get cached data
    const cachedDataJson = localStorage.getItem('cropData');
    if (cachedDataJson) {
      const cachedData: CropInfo[] = JSON.parse(cachedDataJson);
      return { data: cachedData, isOffline: true };
    }
    
    // If no cached data, return mock data
    return { data: mockCrops, isOffline: true };
  }
};

// Function to get a specific crop by ID
export const getCropById = async (cropId: string): Promise<{ data: CropInfo | null, isOffline: boolean }> => {
  try {
    // Try to get all crops first
    const { data: allCrops, isOffline } = await getAllCrops();
    
    // Find the specific crop
    const crop = allCrops.find(c => c.id === cropId) || null;
    
    return { data: crop, isOffline };
  } catch (error) {
    console.error('Error fetching crop by ID:', error);
    throw error;
  }
};

// Function to search crops by name or category
export const searchCrops = async (query: string): Promise<CropInfo[]> => {
  try {
    // Get all crops
    const { data: allCrops } = await getAllCrops();
    
    // If no query, return all crops
    if (!query.trim()) {
      return allCrops;
    }
    
    // Normalize query for case-insensitive search
    const normalizedQuery = query.toLowerCase().trim();
    const language = getLanguage();
    
    // Filter crops based on query
    return allCrops.filter(crop => {
      // Search in name (both languages)
      if (crop.name.en.toLowerCase().includes(normalizedQuery) ||
          crop.name.hi.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      // Search in scientific name
      if (crop.scientificName.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      // Search in category
      if (crop.category.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      // Search in season
      if (crop.season.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      // Search in description
      if (crop.description.en.toLowerCase().includes(normalizedQuery) ||
          crop.description.hi.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      return false;
    });
  } catch (error) {
    console.error('Error searching crops:', error);
    throw error;
  }
};

// Function to get crop recommendations based on location and season
export const getCropRecommendations = async (
  latitude: number,
  longitude: number,
  season?: 'kharif' | 'rabi' | 'zaid'
): Promise<CropInfo[]> => {
  try {
    // Get all crops
    const { data: allCrops } = await getAllCrops();
    
    // In a real implementation, this would use location data to determine suitable crops
    // For now, we'll filter by season if provided
    let filteredCrops = allCrops;
    
    if (season) {
      filteredCrops = allCrops.filter(crop => crop.season === season);
    }
    
    // Sort by some criteria (in a real app, this would be based on suitability for the location)
    // For now, we'll just randomize the order to simulate different recommendations
    return filteredCrops.sort(() => Math.random() - 0.5).slice(0, 5);
  } catch (error) {
    console.error('Error getting crop recommendations:', error);
    throw error;
  }
};

// Function to get crop calendar (what to sow/harvest in current month)
export const getCropCalendar = async (month?: number): Promise<{ sowing: CropInfo[], harvesting: CropInfo[] }> => {
  try {
    // Get all crops
    const { data: allCrops } = await getAllCrops();
    
    // If month is not provided, use current month
    const currentMonth = month !== undefined ? month : new Date().getMonth() + 1; // 1-12
    
    // Map month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentMonthName = monthNames[currentMonth - 1];
    
    // Filter crops for sowing and harvesting in current month
    const sowingCrops = allCrops.filter(crop => {
      const sowingMonths = crop.cultivationPeriod.sowing.en;
      return sowingMonths.includes(currentMonthName) || 
             (currentMonth >= 4 && currentMonth <= 6 && sowingMonths.includes('April to June')) ||
             (currentMonth >= 6 && currentMonth <= 7 && sowingMonths.includes('June to July')) ||
             (currentMonth >= 10 && currentMonth <= 12 && sowingMonths.includes('October to December'));
    });
    
    const harvestingCrops = allCrops.filter(crop => {
      const harvestingMonths = crop.cultivationPeriod.harvesting.en;
      return harvestingMonths.includes(currentMonthName) ||
             (currentMonth >= 3 && currentMonth <= 4 && harvestingMonths.includes('March to April')) ||
             (currentMonth >= 10 && currentMonth <= 12 && harvestingMonths.includes('October to December')) ||
             (currentMonth >= 11 && currentMonth <= 12 && harvestingMonths.includes('November to December'));
    });
    
    return { sowing: sowingCrops, harvesting: harvestingCrops };
  } catch (error) {
    console.error('Error getting crop calendar:', error);
    throw error;
  }
};