@echo off
chcp 65001 >nul
REM ====================================================================
REM  Start local AI (Ollama) for UX×AX Studio - free, no API key
REM  Opens browser access (OLLAMA_ORIGINS=*) and runs the server.
REM  Close this window to stop the server.
REM ====================================================================
setlocal
set "OLLAMA_ORIGINS=*"
set "OLLAMA_PATH=%LOCALAPPDATA%\Programs\Ollama\ollama.exe"

echo.
echo   Starting local AI server at http://127.0.0.1:11434
echo   Recommended Korean model: qwen2.5:3b
echo   Keep this window open while you use UX×AX Studio.
echo.
echo   To add a model, open a new terminal and run:
echo       "%OLLAMA_PATH%" pull qwen2.5:3b
echo       "%OLLAMA_PATH%" pull qwen2.5:7b
echo.

REM Stop any existing instance so this one binds cleanly (errors are harmless)
taskkill /f /im "ollama app.exe" >nul 2>&1
taskkill /f /im "ollama.exe" >nul 2>&1
timeout /t 1 >nul

"%OLLAMA_PATH%" serve
pause
