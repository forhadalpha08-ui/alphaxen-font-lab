@echo off
title Zenix Auth Launcher
cd /d "C:\Users\pcham\Desktop\Tenzo-X-Auth-main"
set "PATH=%SystemRoot%\system32;%SystemRoot%;%SystemRoot%\System32\Wbem;C:\Program Files\nodejs"
taskkill /F /IM node.exe >nul 2>&1
start "Zenix Vite Server" /min cmd.exe /k "npm run dev -- --port 3000 --host"
start "Zenix Cloudflare Worker" /min cmd.exe /k "npx wrangler dev --port 8787"
echo Zenix Servers are now running!
