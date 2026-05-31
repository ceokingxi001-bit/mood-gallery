@echo off
chcp 65001 >nul
echo ========================================
echo   Mood Gallery - 启动脚本
echo ========================================
echo.

:: 启动后端API服务器
echo [1/2] 启动API服务器...
start "Mood Gallery API" cmd /k "cd /d %~dp0 && node server.js"

:: 等待服务器启动
timeout /t 2 /nobreak >nul

:: 启动前端服务器
echo [2/2] 启动前端服务器...
start "Mood Gallery Frontend" cmd /k "cd /d %~dp0\.. && python -m http.server 8000"

echo.
echo ========================================
echo   服务器启动中...
echo ========================================
echo.
echo   前端: http://localhost:8000
echo   API:  http://localhost:3001
echo.
echo   关闭此窗口不会停止服务器
echo   如需停止，请在各自的窗口按 Ctrl+C
echo.
pause
