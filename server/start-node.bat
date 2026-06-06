@echo off
echo ========================================
echo   Mood Gallery - Node.js Server
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

:: Start feedback server
echo [1/2] Starting Feedback Server...
start "Feedback Server" cmd /k "cd /d %~dp0 && node feedback-server.js"

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Start main server on port 8001 (to avoid conflict if 8000 is in use)
echo [2/2] Starting Main Server on port 8001...
start "Main Server" cmd /k "cd /d %~dp0\.. && npx serve -l 8001"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo   Website: http://localhost:8001
echo   Feedback API: http://localhost:3002
echo.
echo   Press any key to exit this window...
pause >nul
