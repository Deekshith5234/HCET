#!/bin/bash

# SettleSmart Quick Start Script

echo "🚀 SettleSmart - Quick Start"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the settlesmart root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
echo ""

# Install all
npm run install-all

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "🎉 Ready to start!"
    echo ""
    echo "Run: npm run dev"
    echo ""
    echo "Then visit:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:5000"
    echo ""
else
    echo ""
    echo "❌ Installation failed. Please check your Node.js and npm versions."
    exit 1
fi
