@echo off
title Niryat Saathi - Full Stack Launcher
color 0A

echo ======================================================================
echo             NIRYAT SAATHI — DIGITAL EXPORT ENABLEMENT PLATFORM
echo ======================================================================
echo.

:: 1. Check MongoDB Service
echo [1/4] Checking MongoDB Service...
sc query MongoDB | find "RUNNING" >nul
if %ERRORLEVEL% equ 0 (
    echo   [OK] MongoDB is running.
) else (
    echo   [INFO] Starting MongoDB service...
    net start MongoDB
)

:: 2. Seed Database
echo.
echo [2/4] Verifying and Seeding MongoDB Database...
cd /d "%~dp0backend"
call .\venv\Scripts\python.exe seed_data.py
if %ERRORLEVEL% neq 0 (
    echo   [WARN] Database seed encountered a notice, proceeding...
)

:: 3. Launch Backend API
echo.
echo [3/4] Starting Django REST Backend on http://127.0.0.1:8000 ...
start "Niryat Saathi - Backend (Django)" /D "%~dp0backend" cmd /k ".\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"

:: 4. Launch Frontend Web App
echo.
echo [4/4] Starting Web Frontend (Vite) on http://127.0.0.1:5173 ...
start "Niryat Saathi - Web Frontend" /D "%~dp0Dakh-main" cmd /k "npm run dev -- --host 127.0.0.1 --port 5173"

:: 5. Launch Mobile App (Expo Web / Metro)
echo.
echo Starting Mobile App (Expo) on http://localhost:8081 ...
start "Niryat Saathi - Mobile App" /D "%~dp0mobile" cmd /k "npx expo start --web --port 8081"

echo.
echo ======================================================================
echo                     ALL SERVICES LAUNCHED!
echo ======================================================================
echo.
echo   * Backend Console: http://127.0.0.1:8000
echo   * Backend REST:    http://127.0.0.1:8000/api
echo   * Web Frontend:    http://127.0.0.1:5173
echo   * Mobile App:      http://localhost:8081
echo   * MongoDB Database: mongodb://localhost:27017/sih_dakghar_db
echo.
echo ======================================================================
pause
