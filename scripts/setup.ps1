# AvilaOps Quick Setup Script (PowerShell)
# This script helps you quickly set up the AvilaOps development environment

$ErrorActionPreference = "Stop"

Write-Host "🚀 AvilaOps - Quick Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

$nodeVersion = $null
try {
    $nodeVersionString = node -v
    $nodeVersion = [int]($nodeVersionString -replace 'v(\d+)\..*', '$1')
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

if ($nodeVersion -lt 18) {
    Write-Host "❌ Node.js version must be 18 or higher. Current: $(node -v)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js $(node -v) detected" -ForegroundColor Green

# Check npm version
try {
    $npmVersion = npm -v
    Write-Host "✅ npm $npmVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Check for .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found" -ForegroundColor Yellow
    Write-Host "📝 Creating .env.local from .env.example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "✅ .env.local created" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Please edit .env.local and add your credentials:" -ForegroundColor Yellow
        Write-Host "   - MONGODB_URI" -ForegroundColor Yellow
        Write-Host "   - OPENAI_API_KEY" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host "❌ .env.example not found. Please create .env.local manually." -ForegroundColor Red
    }
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
    Write-Host ""
}

# Run type check
Write-Host "🔍 Running type check..." -ForegroundColor Yellow
npm run type-check
Write-Host "✅ Type check passed" -ForegroundColor Green
Write-Host ""

# Run linter
Write-Host "🔍 Running linter..." -ForegroundColor Yellow
npm run lint
Write-Host "✅ Linting passed" -ForegroundColor Green
Write-Host ""

# Success message
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local with your credentials (if not done)"
Write-Host "2. Run 'npm run dev' to start the development server"
Write-Host "3. Open http://localhost:3000 in your browser"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - README.md - Quick start guide"
Write-Host "   - docs/DEVELOPMENT.md - Development guide"
Write-Host "   - docs/ARCHITECTURE.md - Architecture overview"
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Cyan
