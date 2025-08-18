# KrishiMitra - AI-Powered Agricultural Advisor

## Overview
KrishiMitra ("Farmer's Friend") is a comprehensive AI-powered agricultural advisory application designed for Indian farmers and agricultural stakeholders. It provides real-time, multilingual, and multimodal assistance for farming decisions, weather forecasts, crop selection, financial assistance, and government policies.

## Key Features
- **Multilingual Support**: Understands and responds in 10+ Indian languages (Hindi, Punjabi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam)
- **Multimodal Interface**: Text, voice, and image-based queries
- **Offline Capability**: Core functionalities available without internet connectivity using IndexedDB
- **Real-time Data Integration**: Weather, market prices, and government scheme updates
- **Fact-Checking**: AI responses verified against reliable agricultural databases
- **Domain-Specific Knowledge**: Comprehensive coverage of weather, crop cycles, pest management, soil health, finance, and market intelligence
- **Voice-Based Interaction**: Speech-to-text and text-to-speech in multiple Indian languages
- **Image Analysis**: Crop identification, pest detection, disease diagnosis, and soil analysis
- **Personalized Recommendations**: Location and crop-specific advice
- **Government Scheme Integration**: Real-time information on loans, subsidies, and insurance

## Technical Architecture
- **Frontend**: React.js with TypeScript, Material-UI, Progressive Web App (PWA)
- **Backend**: Node.js with Express, TypeScript
- **Database**: MongoDB with Redis caching
- **AI/ML Components**:
  - OpenAI GPT for natural language processing
  - Computer vision for image analysis
  - Speech recognition and synthesis
  - Fact-checking and verification system
  - Multi-modal query processing
- **Offline Support**: IndexedDB for local data storage and sync
- **Real-time Features**: Socket.io for live updates

## Data Sources
- **Government APIs**: Ministry of Agriculture, IMD, eNAM, Agmarknet
- **Research Institutions**: ICAR, State Agricultural Universities
- **Weather Data**: India Meteorological Department (IMD)
- **Market Data**: National Agriculture Market (eNAM), Agmarknet
- **Soil Health**: Soil Health Card scheme data
- **Financial**: NABARD, banking APIs for loan and scheme information

## Problem Statement Addressed

KrishiMitra addresses the critical need for an AI-driven agricultural advisor that can:

### Core Capabilities
- **Real-time Query Processing**: "When should I irrigate?", "What seed variety suits this weather?", "Will temperature drop affect my yield?"
- **Financial Guidance**: "Can I afford to wait for better market prices?", "Where can I get affordable credit?"
- **Multi-modal Understanding**: Text, voice, and image inputs for comprehensive analysis
- **Offline Functionality**: Works without internet for users with limited connectivity

### Technical Challenges Solved
- **Multilingual Processing**: Handles code-switched, colloquial queries in 10+ Indian languages
- **Fact Verification**: Prevents LLM hallucinations through database cross-referencing
- **Data Integration**: Synthesizes insights across weather, crops, pests, soil, and finance
- **Reliability**: Designed for high-stakes decisions where wrong answers have real costs
- **Accessibility**: Usable by farmers with low digital literacy but high decision responsibility

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Redis (optional, for caching)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/krishimitra.git

# Navigate to the project directory
cd krishimitra

# Install all dependencies
npm run install:all

# Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your configuration

# Start the development server
npm run dev
```

### Environment Setup

1. **MongoDB**: Install and start MongoDB service
2. **Redis** (optional): Install and start Redis for caching
3. **API Keys**: Configure in `server/.env`:
   - OpenAI API key for AI processing
   - Weather API key (OpenWeatherMap)
   - Google Cloud credentials for translation (optional)

### Quick Start Commands

```bash
# Kill any processes on ports 3000 and 5000
npm run kill-ports

# Start development servers
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure
```
krishimitra/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API and utility services
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utility functions
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic services
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
├── data/                   # Sample and cached data
├── docs/                   # Documentation
├── scripts/                # Setup and utility scripts
└── docker-compose.yml      # Docker configuration
```

## API Documentation

### Core Endpoints

- **Queries**: `/api/queries/ask` - Process natural language queries
- **Crops**: `/api/crops` - Crop information and recommendations
- **Weather**: `/api/weather/current` - Current weather and forecasts
- **Finance**: `/api/finance/loans` - Loan and scheme information
- **Market**: `/api/market/prices` - Current market prices and trends
- **Advisories**: `/api/advisories/personalized` - Personalized farming advice

### Authentication
Most endpoints support optional authentication for personalized responses:
```
Authorization: Bearer <jwt_token>
```

## Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

## Data Sources and Compliance

All data sources used are publicly available and properly attributed:

- **Government Data**: Ministry of Agriculture & Farmers Welfare, IMD, eNAM
- **Research Data**: ICAR institutes, State Agricultural Universities
- **Market Data**: Agmarknet, commodity exchanges
- **Weather Data**: India Meteorological Department

**Important**: Users must comply with the terms and conditions of all data sources used.

## Features in Detail

### 1. Intelligent Query Processing
- Natural language understanding in multiple Indian languages
- Context-aware responses based on location and user profile
- Multi-turn conversations with memory
- Query categorization and intent recognition

### 2. Multimodal Input Support
- **Text**: Type queries in any supported language
- **Voice**: Speak queries with automatic language detection
- **Images**: Upload photos for crop/pest/disease identification

### 3. Comprehensive Agricultural Knowledge
- **Crop Management**: Varieties, cultivation practices, harvest timing
- **Weather Intelligence**: Forecasts, alerts, agricultural advisories
- **Pest & Disease**: Identification, prevention, treatment recommendations
- **Soil Health**: Testing interpretation, nutrient management
- **Financial Services**: Loans, insurance, government schemes
- **Market Intelligence**: Price trends, demand forecasting, selling strategies

### 4. Offline Capabilities
- Local data storage using IndexedDB
- Offline query processing with cached responses
- Automatic sync when connectivity returns
- Progressive Web App (PWA) for mobile installation

### 5. Fact Verification
- Cross-reference AI responses with verified databases
- Confidence scoring for all recommendations
- Source attribution for transparency
- Correction mechanisms for inaccurate information

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow TypeScript best practices
2. Write tests for new features
3. Update documentation for API changes
4. Ensure offline functionality for new features
5. Test with multiple languages and regions

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- Ministry of Agriculture & Farmers Welfare for public datasets
- India Meteorological Department for weather data
- ICAR and State Agricultural Universities for research data
- National Agriculture Market (eNAM) for market data
- All farmers and agricultural experts who provided domain knowledge

## Support

For technical support or questions:
- Email: support@krishimitra.app
- Documentation: [docs/README.md](docs/README.md)
- Issues: GitHub Issues page

---

**Note**: This application is designed to assist farmers in making informed decisions. Always consult with local agricultural experts for critical farming decisions.