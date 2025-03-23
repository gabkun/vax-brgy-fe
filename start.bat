@echo off
echo Setting up Vite with React...

:: Check if Node.js is installed
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

:: Install Vite with React
echo Creating Vite React project...
npx create-vite@latest my-vite-app -- --template react

:: Navigate to project folder
cd my-vite-app

:: Install dependencies
echo Installing dependencies...
npm install

:: Start the development server
echo Starting development server...
npm run dev

pause