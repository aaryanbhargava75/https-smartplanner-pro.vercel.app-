@echo off
title Smart Planner Launcher
echo ==============================================
echo       Launching Smart Planner AI...
echo ==============================================
cd /d "%~dp0"
start http://localhost:3000
node server.js
pause
