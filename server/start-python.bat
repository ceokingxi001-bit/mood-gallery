@echo off
echo ========================================
echo   Mood Gallery - Python Server
echo ========================================
echo.
echo Starting server...
echo.
echo Website: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server.
echo.
cd /d %~dp0\..
python -m http.server 8000
pause
