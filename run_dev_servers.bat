@echo off
title Zenix Auth Servers
cd /d "C:\Users\pcham\Desktop\Tenzo-X-Auth-main"
taskkill /F /IM node.exe >nul 2>&1
ping -n 2 127.0.0.1 >nul
start "Zenix Vite Web App" cmd /k "npm run dev -- --port 3000 --host"
start "Zenix Wrangler Worker" cmd /k "npx wrangler dev --port 8787"
echo Servers started successfully!
