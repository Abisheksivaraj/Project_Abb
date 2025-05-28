@echo off
echo Stopping Project_ABB Services...

echo Stopping Node.js processes...
taskkill /f /im node.exe /t 2>nul

echo Stopping MongoDB...
taskkill /f /im mongod.exe 2>nul

echo Stopping React development server...
taskkill /f /im "react-scripts" 2>nul

echo.
echo All Project_ABB services stopped!
pause