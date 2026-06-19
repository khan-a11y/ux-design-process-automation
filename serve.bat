@echo off
chcp 65001 >nul
REM ====================================================================
REM  UX×AX Studio - local web server (CORS fallback)
REM  Use this if API/Ollama calls are blocked on file://.
REM  Opens http://localhost:8099/index.html (the hub).
REM ====================================================================
cd /d "%~dp0"
echo.
echo   Starting local server...
echo   Opening: http://localhost:8099/index.html
echo   (Close this window to stop the server.)
echo.
start "" "http://localhost:8099/index.html"
python -m http.server 8099
pause
