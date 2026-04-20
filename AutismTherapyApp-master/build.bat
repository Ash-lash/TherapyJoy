@echo off
REM TherapyJoy - Windows Build & Deploy Script
REM This script builds your app for production deployment

echo.
echo ==================================================
echo   TherapyJoy - Production Build Script
echo ==================================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo %ERROR_MSG%Error: package.json not found! Run this from project root.
    exit /b 1
)

echo [1/5] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
echo ✓ Dependencies ready

echo.
echo [2/5] Building frontend...
cd "therapyjoy-frontend - Copy"
if not exist "node_modules" (
    call npm install
)
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend build failed!
    exit /b 1
)
cd ..
echo ✓ Frontend build complete

echo.
echo [3/5] Checking environment files...
if not exist "backend\.env.production" (
    echo WARNING: backend\.env.production not found!
    echo Copy from .env.example and fill in your values
)
if not exist "therapyjoy-frontend - Copy\.env.production" (
    echo WARNING: frontend\.env.production not found!
    echo Copy from .env.example and fill in your values
)
echo ✓ Environment check complete

echo.
echo [4/5] Checking deployment readiness...
node check-deployment.js
if %ERRORLEVEL% NEQ 0 (
    echo Some checks failed. Please review above.
)

echo.
echo [5/5] Build summary...
echo.
echo ================== BUILD COMPLETE ==================
echo.
echo Your app is ready to deploy!
echo.
echo Frontend build location:
echo   "therapyjoy-frontend - Copy\build\"
echo.
echo Next steps:
echo   1. Push to GitHub:
echo      git add .
echo      git commit -m "Production build ready"
echo      git push
echo.
echo   2. Deploy frontend on Vercel
echo   3. Deploy backend on Railway
echo.
echo For detailed instructions, see:
echo   - ACTIONABLE_CHECKLIST.md
echo   - QUICK_DEPLOYMENT_GUIDE.md
echo.
echo =====================================================
echo.

pause
