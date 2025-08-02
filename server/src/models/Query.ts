import mongoose, { Document, Schema } from 'mongoose';

export interface IQuery extends Document {
  userId?: string;
  sessionId: string;
  query: {
    text: string;
    language: string;
    type: 'text' | 'voice' | 'image';
    metadata?: {
      audioFile?: string;
      imageFile?: string;
      location?: {
        latitude: number;
        longitude: number;
      };
      deviceInfo?: Record<string, any>;
    };
  };
  response: {
    text: string;
    language: string;
    confidence: number;
    sources: Array<{
      type: 'weather' | 'crop' | 'market' | 'finance' | 'government' | 'research';
      title: string;
      url?: string;
      relevance: number;
    }>;
    relatedQueries: string[];
    actionItems?: Array<{
      type: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
      dueDate?: Date;
    }>;
  };
  context: {
    category: 'weather' | 'crop' | 'finance' | 'market' | 'pest' | 'soil' | 'irrigation' | 'general';
    subcategory?: string;
    location?: {
      state: string;
      district: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    season?: string;
    crops?: string[];
    timeframe?: string;
  };
  feedback?: {
    rating: number;
    helpful: boolean;
    comments?: string;
    timestamp: Date;
  };
  processingTime: number;
  isResolved: boolean;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const querySchema = new Schema<IQuery>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  query: {
    text: {
      type: String,
      required: true,
      maxlength: 2000
    },
    language: {
      type: String,
      required: true,
      enum: ['en', 'hi', 'pa', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml']
    },
    type: {
      type: String,
      enum: ['text', 'voice', 'image'],
      default: 'text'
    },
    metadata: {
      audioFile: String,
      imageFile: String,
      location: {
        latitude: Number,
        longitude: Number
      },
      deviceInfo: Schema.Types.Mixed
    }
  },
  response: {
    text: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    },
    sources: [{
      type: {
        type: String,
        enum: ['weather', 'crop', 'market', 'finance', 'government', 'research'],
        required: true
      },
      title: {
        type: String,
        required: true
      },
      url: String,
      relevance: {
        type: Number,
        min: 0,
        max: 1,
        required: true
      }
    }],
    relatedQueries: [String],
    actionItems: [{
      type: String,
      description: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      dueDate: Date
    }]
  },
  context: {
    category: {
      type: String,
      required: true,
      enum: ['weather', 'crop', 'finance', 'market', 'pest', 'soil', 'irrigation', 'general']
    },
    subcategory: String,
    location: {
      state: String,
      district: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    season: String,
    crops: [String],
    timeframe: String
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    helpful: Boolean,
    comments: String,
    timestamp: Date
  },
  processingTime: {
    type: Number,
    required: true
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes for better query performance
querySchema.index({ userId: 1, createdAt: -1 });
querySchema.index({ sessionId: 1, createdAt: -1 });
querySchema.index({ 'context.category': 1, 'context.location.state': 1 });
querySchema.index({ 'query.language': 1 });
querySchema.index({ tags: 1 });
querySchema.index({ isPublic: 1, 'feedback.rating': -1 });

export default mongoose.model<IQuery>('Query', querySchema);