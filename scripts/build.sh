#!/bin/bash

echo "🏗️  Building KrishiMitra for production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf client/build
rm -rf server/dist

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build client
echo "🔨 Building client..."
cd client
npm run build
cd ..

# Build server
echo "🔨 Building server..."
cd server
npm run build
cd ..

# Copy necessary files
echo "📋 Copying configuration files..."
cp server/.env server/dist/ 2>/dev/null || echo "No .env file found"
cp -r server/src/data server/dist/ 2>/dev/null || echo "No data directory found"

echo "✅ Build completed successfully!"
echo "📦 Client build: client/build/"
echo "📦 Server build: server/dist/"