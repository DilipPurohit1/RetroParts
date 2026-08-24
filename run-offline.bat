@echo off
title RetroParts - Offline Launcher
echo ===================================================
echo       RETROPARTS - STARTING OFFLINE SERVERS
echo ===================================================
echo.
echo 1. Starting Backend API & Embedded Database...
echo 2. Starting Frontend Client UI...
echo.
echo Once started, the website will open in your browser at:
echo http://localhost:5173
echo.
echo Press Ctrl+C in this window to stop the servers when done.
echo ===================================================
echo.

start http://localhost:5173

npm run dev
pause
