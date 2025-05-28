@echo off
echo Installing Project_ABB Dependencies...
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo Installation Complete!
echo You can now run start.bat
pause