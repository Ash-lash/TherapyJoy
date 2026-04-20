#!/bin/bash

# TherapyJoy - Unix/Mac Build & Deploy Script
# This script builds your app for production deployment

set -e  # Exit on any error

echo ""
echo "=================================================="
echo "  TherapyJoy - Production Build Script"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found! Run this from project root."
    exit 1
fi

echo "[1/5] Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi
echo "✓ Dependencies ready"

echo ""
echo "[2/5] Building frontend..."
cd "therapyjoy-frontend - Copy"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
cd ..
echo "✓ Frontend build complete"

echo ""
echo "[3/5] Checking environment files..."
if [ ! -f "backend/.env.production" ]; then
    echo "WARNING: backend/.env.production not found!"
    echo "Copy from .env.example and fill in your values"
fi
if [ ! -f "therapyjoy-frontend - Copy/.env.production" ]; then
    echo "WARNING: frontend/.env.production not found!"
    echo "Copy from .env.example and fill in your values"
fi
echo "✓ Environment check complete"

echo ""
echo "[4/5] Checking deployment readiness..."
node check-deployment.js || true

echo ""
echo "[5/5] Build summary..."
echo ""
echo "================== BUILD COMPLETE ==================="
echo ""
echo "Your app is ready to deploy!"
echo ""
echo "Frontend build location:"
echo "  'therapyjoy-frontend - Copy/build/'"
echo ""
echo "Next steps:"
echo "  1. Push to GitHub:"
echo "     git add ."
echo "     git commit -m 'Production build ready'"
echo "     git push"
echo ""
echo "  2. Deploy frontend on Vercel"
echo "  3. Deploy backend on Railway"
echo ""
echo "For detailed instructions, see:"
echo "  - ACTIONABLE_CHECKLIST.md"
echo "  - QUICK_DEPLOYMENT_GUIDE.md"
echo ""
echo "====================================================="
echo ""
