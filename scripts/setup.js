#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌾 Setting up KrishiMitra Development Environment...\n');

// Create necessary directories
const directories = [
  'server/logs',
  'server/uploads',
  'server/uploads/images',
  'server/uploads/audio',
  'server/uploads/documents',
  'data/datasets',
  'data/models',
  'data/cache',
  'docs/api',
  'docs/deployment'
];

console.log('📁 Creating directories...');
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`   ✓ Created ${dir}`);
  } else {
    console.log(`   - ${dir} already exists`);
  }
});

// Copy environment file if it doesn't exist
console.log('\n🔧 Setting up environment configuration...');
const envPath = 'server/.env';
const envExamplePath = 'server/.env.example';

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('   ✓ Created .env file from .env.example');
  console.log('   ⚠️  Please update the .env file with your actual configuration values');
} else if (fs.existsSync(envPath)) {
  console.log('   - .env file already exists');
} else {
  console.log('   ⚠️  .env.example not found, please create .env manually');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  console.log('   Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('   Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });
  
  console.log('   Installing server dependencies...');
  execSync('cd server && npm install', { stdio: 'inherit' });
  
  console.log('   ✓ All dependencies installed successfully');
} catch (error) {
  console.error('   ❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Create sample data files
console.log('\n📊 Creating sample data files...');
const sampleDataFiles = [
  {
    path: 'data/datasets/weather_stations.json',
    content: JSON.stringify([
      {
        "id": "WS001",
        "name": "Delhi Weather Station",
        "state": "Delhi",
        "district": "New Delhi",
        "coordinates": { "latitude": 28.6139, "longitude": 77.2090 },
        "elevation": 216,
        "established": "1990-01-01",
        "sensors": ["temperature", "humidity", "rainfall", "wind_speed", "pressure"]
      },
      {
        "id": "WS002",
        "name": "Mumbai Weather Station",
        "state": "Maharashtra",
        "district": "Mumbai",
        "coordinates": { "latitude": 19.0760, "longitude": 72.8777 },
        "elevation": 14,
        "established": "1985-06-15",
        "sensors": ["temperature", "humidity", "rainfall", "wind_speed", "pressure"]
      }
    ], null, 2)
  },
  {
    path: 'data/datasets/market_prices.json',
    content: JSON.stringify([
      {
        "date": "2024-01-15",
        "market": "Azadpur Mandi, Delhi",
        "crops": [
          { "name": "Rice", "variety": "Basmati", "price": 4500, "unit": "quintal", "quality": "FAQ" },
          { "name": "Wheat", "variety": "HD-2967", "price": 2100, "unit": "quintal", "quality": "FAQ" },
          { "name": "Cotton", "variety": "Bt Cotton", "price": 6800, "unit": "quintal", "quality": "FAQ" }
        ]
      }
    ], null, 2)
  },
  {
    path: 'data/datasets/soil_health.json',
    content: JSON.stringify([
      {
        "district": "Ludhiana",
        "state": "Punjab",
        "soil_type": "alluvial",
        "ph": 7.2,
        "organic_carbon": 0.45,
        "nitrogen": 280,
        "phosphorus": 18,
        "potassium": 165,
        "last_updated": "2024-01-01"
      }
    ], null, 2)
  }
];

sampleDataFiles.forEach(file => {
  if (!fs.existsSync(file.path)) {
    fs.writeFileSync(file.path, file.content);
    console.log(`   ✓ Created ${file.path}`);
  } else {
    console.log(`   - ${file.path} already exists`);
  }
});

// Create development scripts
console.log('\n🔨 Creating development scripts...');
const scripts = [
  {
    path: 'scripts/dev.sh',
    content: `#!/bin/bash
echo "🌾 Starting KrishiMitra Development Environment..."

# Start MongoDB (if not running)
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    mongod --dbpath ./data/db &
fi

# Start Redis (if not running)
if ! pgrep -x "redis-server" > /dev/null; then
    echo "Starting Redis..."
    redis-server &
fi

# Start the application
npm run dev
`,
    executable: true
  },
  {
    path: 'scripts/seed.js',
    content: `#!/usr/bin/env node

const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishimitra');
    
    console.log('🌱 Seeding crop data...');
    const { seedCropData } = require('../server/dist/data/seedData');
    await seedCropData();
    
    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
`,
    executable: true
  }
];

scripts.forEach(script => {
  if (!fs.existsSync(script.path)) {
    fs.writeFileSync(script.path, script.content);
    if (script.executable && process.platform !== 'win32') {
      fs.chmodSync(script.path, '755');
    }
    console.log(`   ✓ Created ${script.path}`);
  } else {
    console.log(`   - ${script.path} already exists`);
  }
});

// Create documentation
console.log('\n📚 Creating documentation...');
const docs = [
  {
    path: 'docs/README.md',
    content: `# KrishiMitra - AI-Powered Agricultural Advisor

## Overview
KrishiMitra is an AI-powered agricultural advisory application designed for Indian farmers and agricultural stakeholders.

## Features
- Multilingual support (10+ Indian languages)
- Offline capability
- Real-time weather updates
- Crop management advice
- Financial assistance information
- Market price updates
- Voice-based interaction

## Quick Start
1. Run \`npm run install:all\` to install dependencies
2. Copy \`server/.env.example\` to \`server/.env\` and configure
3. Start MongoDB and Redis
4. Run \`npm run dev\` to start development servers

## API Documentation
See \`docs/api/\` for detailed API documentation.

## Contributing
Please read CONTRIBUTING.md for contribution guidelines.
`
  },
  {
    path: 'docs/api/README.md',
    content: `# KrishiMitra API Documentation

## Base URL
\`http://localhost:5000/api\`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
\`Authorization: Bearer <your_jwt_token>\`

## Endpoints

### Queries
- \`POST /queries/ask\` - Process natural language query
- \`GET /queries/suggestions\` - Get query suggestions
- \`GET /queries/history\` - Get user query history

### Weather
- \`GET /weather/current\` - Get current weather
- \`GET /weather/forecast\` - Get weather forecast
- \`GET /weather/alerts\` - Get weather alerts

### Crops
- \`GET /crops\` - Get crop information
- \`GET /crops/recommendations\` - Get crop recommendations
- \`GET /crops/calendar\` - Get crop calendar

### Finance
- \`GET /finance/loans\` - Get loan information
- \`GET /finance/schemes\` - Get government schemes
- \`GET /finance/insurance\` - Get insurance options

For detailed API documentation, see individual endpoint files.
`
  }
];

docs.forEach(doc => {
  if (!fs.existsSync(doc.path)) {
    fs.writeFileSync(doc.path, doc.content);
    console.log(`   ✓ Created ${doc.path}`);
  } else {
    console.log(`   - ${doc.path} already exists`);
  }
});

console.log('\n🎉 Setup completed successfully!');
console.log('\nNext steps:');
console.log('1. Update server/.env with your configuration');
console.log('2. Start MongoDB: mongod');
console.log('3. Start Redis: redis-server (optional)');
console.log('4. Run: npm run dev');
console.log('\n📖 Check docs/README.md for more information');