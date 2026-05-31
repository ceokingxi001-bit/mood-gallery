@echo off
echo ========================================
echo   Mood Gallery - Quick Start
echo ========================================
echo.

:: Start feedback server
echo [1/2] Starting Feedback Server...
start "Feedback Server" cmd /k "cd /d %~dp0 && node feedback-server.js"

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Start main server
echo [2/2] Starting Main Server...
start "Main Server" cmd /k "cd /d %~dp0\.. && python -m http.server 8000"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo   Website: http://localhost:8000
echo   Feedback API: http://localhost:3002
echo.
echo   Press any key to exit this window...
pause >nul
