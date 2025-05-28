@echo off
echo Setting up Project_ABB to start with Windows...

REM Create startup script
set startupFolder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
echo @echo off > "%startupFolder%\Project_ABB_Startup.bat"
echo cd /d "%CD%" >> "%startupFolder%\Project_ABB_Startup.bat"
echo start /min cmd /c start.bat >> "%startupFolder%\Project_ABB_Startup.bat"

REM Create desktop shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%temp%\createshortcut.vbs"
echo sLinkFile = "%USERPROFILE%\Desktop\Project_ABB.lnk" >> "%temp%\createshortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%temp%\createshortcut.vbs"
echo oLink.TargetPath = "%CD%\start.bat" >> "%temp%\createshortcut.vbs"
echo oLink.WorkingDirectory = "%CD%" >> "%temp%\createshortcut.vbs"
echo oLink.IconLocation = "%CD%\icon.ico" >> "%temp%\createshortcut.vbs"
echo oLink.Save >> "%temp%\createshortcut.vbs"
cscript "%temp%\createshortcut.vbs"
del "%temp%\createshortcut.vbs"

echo.
echo Setup Complete!
echo - Project will auto-start when Windows boots
echo - Desktop shortcut created
echo - Restart your computer to test auto-start
pause