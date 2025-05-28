@echo off
title Project_ABB Startup
echo Starting Project_ABB Application...
echo.

echo [1/4] Checking MongoDB...
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: MongoDB not found in PATH
    echo Please install MongoDB or use online MongoDB Atlas
    echo.
    echo Continuing without local MongoDB...
    goto skip_mongo
)

echo Starting MongoDB...
if not exist "data" mkdir data
start "MongoDB Service" cmd /k "mongod --dbpath data"
echo [2/4] Waiting for MongoDB to initialize...
timeout /t 8
goto continue

:skip_mongo
echo [2/4] Skipping MongoDB startup...

:continue
echo [3/4] Starting Backend Server...
start "Backend API" cmd /k "cd backend && npm run dev"

echo [4/4] Starting Frontend Application...
timeout /t 5
start "Frontend React App" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================
echo   PROJECT_ABB STARTED SUCCESSFULLY
echo ====================================
echo Backend API: http://localhost:2222
echo Frontend App: http://localhost:5173
echo MongoDB: Check if running on port 27017
echo.
echo Close this window when done working
pause