import mongoose, { Document, Schema } from 'mongoose';

export interface ICrop extends Document {
  name: {
    en: string;
    hi?: string;
    [key: string]: string | undefined;
  };
  scientificName: string;
  category: 'cereal' | 'pulse' | 'oilseed' | 'vegetable' | 'fruit' | 'spice' | 'cash_crop' | 'fodder';
  season: 'kharif' | 'rabi' | 'zaid' | 'perennial';
  duration: {
    min: number;
    max: number;
    unit: 'days' | 'months';
  };
  climate: {
    temperature: {
      min: number;
      max: number;
      optimal: number;
    };
    rainfall: {
      min: number;
      max: number;
      optimal: number;
    };
    humidity: {
      min: number;
      max: number;
      optimal: number;
    };
  };
  soil: {
    types: string[];
    ph: {
      min: number;
      max: number;
      optimal: number;
    };
    nutrients: {
      nitrogen: string;
      phosphorus: string;
      potassium: string;
    };
  };
  cultivation: {
    sowing: {
      method: string[];
      depth: string;
      spacing: string;
      seedRate: string;
    };
    irrigation: {
      frequency: string;
      method: string[];
      criticalStages: string[];
    };
    fertilization: {
      organic: string[];
      chemical: string[];
      schedule: Array<{
        stage: string;
        fertilizer: string;
        quantity: string;
        timing: string;
      }>;
    };
    pestManagement: Array<{
      pest: string;
      type: 'insect' | 'disease' | 'weed';
      symptoms: string;
      prevention: string;
      treatment: string;
      organicControl: string;
    }>;
  };
  harvest: {
    indicators: string[];
    method: string;
    postHarvest: string[];
    storage: string;
  };
  yield: {
    average: number;
    potential: number;
    unit: string;
    factors: string[];
  };
  economics: {
    costOfCultivation: {
      seeds: number;
      fertilizers: number;
      pesticides: number;
      labor: number;
      irrigation: number;
      machinery: number;
      total: number;
    };
    marketPrice: {
      min: number;
      max: number;
      average: number;
      unit: string;
      lastUpdated: Date;
    };
    profitability: {
      grossReturn: number;
      netReturn: number;
      bcRatio: number;
    };
  };
  regions: {
    majorStates: string[];
    suitableDistricts: Array<{
      state: string;
      districts: string[];
    }>;
  };
  varieties: Array<{
    name: string;
    characteristics: string[];
    suitableRegions: string[];
    duration: number;
    yield: number;
    resistance: string[];
  }>;
  intercropping: {
    compatible: string[];
    benefits: string[];
    spacing: string;
  };
  rotation: {
    previous: string[];
    next: string[];
    benefits: string[];
  };
  nutritionalValue: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    vitamins: Record<string, number>;
    minerals: Record<string, number>;
  };
  uses: string[];
  processingMethods: string[];
  byproducts: string[];
  governmentSchemes: string[];
  researchLinks: string[];
  images: string[];
  videos: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cropSchema = new Schema<ICrop>({
  name: {
    en: { type: String, required: true },
    hi: String,
    pa: String,
    bn: String,
    te: String,
    ta: String,
    mr: String,
    gu: String,
    kn: String,
    ml: String
  },
  scientificName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cereal', 'pulse', 'oilseed', 'vegetable', 'fruit', 'spice', 'cash_crop', 'fodder']
  },
  season: {
    type: String,
    required: true,
    enum: ['kharif', 'rabi', 'zaid', 'perennial']
  },
  duration: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    unit: { type: String, enum: ['days', 'months'], default: 'days' }
  },
  climate: {
    temperature: {
      min: Number,
      max: Number,
      optimal: Number
    },
    rainfall: {
      min: Number,
      max: Number,
      optimal: Number
    },
    humidity: {
      min: Number,
      max: Number,
      optimal: Number
    }
  },
  soil: {
    types: [String],
    ph: {
      min: Number,
      max: Number,
      optimal: Number
    },
    nutrients: {
      nitrogen: String,
      phosphorus: String,
      potassium: String
    }
  },
  cultivation: {
    sowing: {
      method: [String],
      depth: String,
      spacing: String,
      seedRate: String
    },
    irrigation: {
      frequency: String,
      method: [String],
      criticalStages: [String]
    },
    fertilization: {
      organic: [String],
      chemical: [String],
      schedule: [{
        stage: String,
        fertilizer: String,
        quantity: String,
        timing: String
      }]
    },
    pestManagement: [{
      pest: String,
      type: { type: String, enum: ['insect', 'disease', 'weed'] },
      symptoms: String,
      prevention: String,
      treatment: String,
      organicControl: String
    }]
  },
  harvest: {
    indicators: [String],
    method: String,
    postHarvest: [String],
    storage: String
  },
  yield: {
    average: Number,
    potential: Number,
    unit: String,
    factors: [String]
  },
  economics: {
    costOfCultivation: {
      seeds: Number,
      fertilizers: Number,
      pesticides: Number,
      labor: Number,
      irrigation: Number,
      machinery: Number,
      total: Number
    },
    marketPrice: {
      min: Number,
      max: Number,
      average: Number,
      unit: String,
      lastUpdated: Date
    },
    profitability: {
      grossReturn: Number,
      netReturn: Number,
      bcRatio: Number
    }
  },
  regions: {
    majorStates: [String],
    suitableDistricts: [{
      state: String,
      districts: [String]
    }]
  },
  varieties: [{
    name: String,
    characteristics: [String],
    suitableRegions: [String],
    duration: Number,
    yield: Number,
    resistance: [String]
  }],
  intercropping: {
    compatible: [String],
    benefits: [String],
    spacing: String
  },
  rotation: {
    previous: [String],
    next: [String],
    benefits: [String]
  },
  nutritionalValue: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    fiber: Number,
    vitamins: Schema.Types.Mixed,
    minerals: Schema.Types.Mixed
  },
  uses: [String],
  processingMethods: [String],
  byproducts: [String],
  governmentSchemes: [String],
  researchLinks: [String],
  images: [String],
  videos: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
cropSchema.index({ 'name.en': 'text', 'name.hi': 'text', scientificName: 'text' });
cropSchema.index({ category: 1, season: 1 });
cropSchema.index({ 'regions.majorStates': 1 });
cropSchema.index({ isActive: 1 });

export default mongoose.model<ICrop>('Crop', cropSchema);