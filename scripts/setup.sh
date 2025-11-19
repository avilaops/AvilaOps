#!/bin/bash

# AvilaOps Quick Setup Script
# This script helps you quickly set up the AvilaOps development environment

set -e

echo "🚀 AvilaOps - Quick Setup"
echo "========================="
echo ""

# Check Node.js version
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check npm version
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found"
    echo "📝 Creating .env.local from .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ .env.local created"
        echo ""
        echo "⚠️  IMPORTANT: Please edit .env.local and add your credentials:"
        echo "   - MONGODB_URI"
        echo "   - OPENAI_API_KEY"
        echo ""
    else
        echo "❌ .env.example not found. Please create .env.local manually."
    fi
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Run type check
echo "🔍 Running type check..."
npm run type-check
echo "✅ Type check passed"
echo ""

# Run linter
echo "🔍 Running linter..."
npm run lint
echo "✅ Linting passed"
echo ""

# Success message
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your credentials (if not done)"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Quick start guide"
echo "   - docs/DEVELOPMENT.md - Development guide"
echo "   - docs/ARCHITECTURE.md - Architecture overview"
echo ""
echo "Happy coding! 🚀"
