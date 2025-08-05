import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'farmer' | 'advisor' | 'vendor' | 'financier' | 'agri_expert' | 'government_officer' | 'admin';
  profile: {
    // Common fields
    preferredLanguage: string;
    avatar?: string;
    
    // Farmer-specific fields
    farmSize?: number;
    farmParcels?: number;
    farmingType?: 'crop' | 'livestock' | 'mixed' | 'other';
    hasIrrigation?: boolean;
    hasSmartphone?: boolean;
    farmLocation?: {
      state: string;
      district: string;
      village?: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    crops?: string[];
    experience?: number;
    
    // Financier-specific fields
    organizationName?: string;
    operationAreas?: string[];
    loanTypes?: string[];
    
    // Vendor-specific fields
    businessName?: string;
    productTypes?: string[];
    operatingLocations?: string[];
  };
  preferences: {
    notifications: {
      weather: boolean;
      crops: boolean;
      market: boolean;
      finance: boolean;
    };
    units: {
      temperature: 'celsius' | 'fahrenheit';
      area: 'hectare' | 'acre';
      currency: 'INR' | 'USD';
    };
  };
  subscription?: {
    plan: 'free' | 'basic' | 'premium';
    startDate: Date;
    endDate: Date;
    features: string[];
  };
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['farmer', 'advisor', 'vendor', 'financier', 'agri_expert', 'government_officer', 'admin'],
    default: 'farmer'
  },
  profile: {
    // Common fields
    preferredLanguage: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'pa', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml']
    },
    avatar: String,
    
    // Farmer-specific fields
    farmSize: {
      type: Number,
      min: 0
    },
    farmParcels: {
      type: Number,
      min: 1
    },
    farmingType: {
      type: String,
      enum: ['crop', 'livestock', 'mixed', 'other']
    },
    hasIrrigation: Boolean,
    hasSmartphone: Boolean,
    farmLocation: {
      state: String,
      district: String,
      village: String,
      coordinates: {
        latitude: {
          type: Number,
          min: -90,
          max: 90
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180
        }
      }
    },
    crops: [String],
    experience: {
      type: Number,
      min: 0,
      max: 100
    },
    
    // Financier-specific fields
    organizationName: String,
    operationAreas: [String],
    loanTypes: [String],
    
    // Vendor-specific fields
    businessName: String,
    productTypes: [String],
    operatingLocations: [String]
  },
  preferences: {
    notifications: {
      weather: { type: Boolean, default: true },
      crops: { type: Boolean, default: true },
      market: { type: Boolean, default: false },
      finance: { type: Boolean, default: true }
    },
    units: {
      temperature: { type: String, enum: ['celsius', 'fahrenheit'], default: 'celsius' },
      area: { type: String, enum: ['hectare', 'acre'], default: 'hectare' },
      currency: { type: String, enum: ['INR', 'USD'], default: 'INR' }
    }
  },
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
    startDate: Date,
    endDate: Date,
    features: [String]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Index for geospatial queries
userSchema.index({ 'profile.farmLocation.coordinates': '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model<IUser>('User', userSchema);