@echo off
title Project_ABB Development Mode
echo Starting in Development Mode...
echo.

start "MongoDB" cmd /k "mongod"
timeout /t 5

start "Backend Dev" cmd /k "cd backend && npm run dev"
timeout /t 3

start "Frontend Dev" cmd /k "cd frontend && npm run dev"

echo Development servers started!
pause