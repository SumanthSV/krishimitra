import mongoose, { Document, Schema } from 'mongoose';

export interface IWeather extends Document {
  location: {
    name: string;
    state: string;
    district: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
    uvIndex: number;
    cloudCover: number;
    precipitation: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    timestamp: Date;
  };
  forecast: Array<{
    date: Date;
    temperature: {
      min: number;
      max: number;
      average: number;
    };
    humidity: {
      min: number;
      max: number;
      average: number;
    };
    precipitation: {
      probability: number;
      amount: number;
    };
    wind: {
      speed: number;
      direction: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  }>;
  alerts: Array<{
    type: 'warning' | 'watch' | 'advisory';
    severity: 'minor' | 'moderate' | 'severe' | 'extreme';
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    affectedAreas: string[];
  }>;
  agriculturalAdvisory: Array<{
    crop: string;
    stage: string;
    advisory: string;
    priority: 'low' | 'medium' | 'high';
    validUntil: Date;
  }>;
  dataSource: {
    provider: string;
    lastUpdated: Date;
    nextUpdate: Date;
    reliability: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const weatherSchema = new Schema<IWeather>({
  location: {
    name: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true, min: -90, max: 90 },
      longitude: { type: Number, required: true, min: -180, max: 180 }
    }
  },
  current: {
    temperature: { type: Number, required: true },
    feelsLike: { type: Number, required: true },
    humidity: { type: Number, required: true, min: 0, max: 100 },
    pressure: { type: Number, required: true },
    windSpeed: { type: Number, required: true, min: 0 },
    windDirection: { type: Number, required: true, min: 0, max: 360 },
    visibility: { type: Number, required: true, min: 0 },
    uvIndex: { type: Number, required: true, min: 0 },
    cloudCover: { type: Number, required: true, min: 0, max: 100 },
    precipitation: { type: Number, required: true, min: 0 },
    weather: {
      main: { type: String, required: true },
      description: { type: String, required: true },
      icon: { type: String, required: true }
    },
    timestamp: { type: Date, required: true }
  },
  forecast: [{
    date: { type: Date, required: true },
    temperature: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      average: { type: Number, required: true }
    },
    humidity: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      average: { type: Number, required: true }
    },
    precipitation: {
      probability: { type: Number, required: true, min: 0, max: 100 },
      amount: { type: Number, required: true, min: 0 }
    },
    wind: {
      speed: { type: Number, required: true, min: 0 },
      direction: { type: Number, required: true, min: 0, max: 360 }
    },
    weather: {
      main: { type: String, required: true },
      description: { type: String, required: true },
      icon: { type: String, required: true }
    }
  }],
  alerts: [{
    type: { type: String, enum: ['warning', 'watch', 'advisory'], required: true },
    severity: { type: String, enum: ['minor', 'moderate', 'severe', 'extreme'], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    affectedAreas: [String]
  }],
  agriculturalAdvisory: [{
    crop: { type: String, required: true },
    stage: { type: String, required: true },
    advisory: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    validUntil: { type: Date, required: true }
  }],
  dataSource: {
    provider: { type: String, required: true },
    lastUpdated: { type: Date, required: true },
    nextUpdate: { type: Date, required: true },
    reliability: { type: Number, min: 0, max: 1, required: true }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for geospatial and time-based queries
weatherSchema.index({ 'location.coordinates': '2dsphere' });
weatherSchema.index({ 'location.state': 1, 'location.district': 1 });
weatherSchema.index({ 'current.timestamp': -1 });
weatherSchema.index({ 'forecast.date': 1 });
weatherSchema.index({ isActive: 1 });

export default mongoose.model<IWeather>('Weather', weatherSchema);