@echo off
REM SettleSmart Quick Start Script for Windows

echo.
echo 🚀 SettleSmart - Quick Start
echo ==============================
echo.

REM Check if Node.js is installed
where /q node
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    exit /b 1
)

echo ✅ Node.js is installed
echo.

REM Check if in correct directory
if not exist "package.json" (
    echo ❌ Please run this script from the settlesmart root directory
    exit /b 1
)

echo 📦 Installing dependencies...
echo.

REM Install all
call npm run install-all

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Installation complete!
    echo.
    echo 🎉 Ready to start!
    echo.
    echo Run: npm run dev
    echo.
    echo Then visit:
    echo   Frontend: http://localhost:3000
    echo   Backend:  http://localhost:5000
    echo.
) else (
    echo.
    echo ❌ Installation failed. Please check your Node.js and npm versions.
    exit /b 1
)
