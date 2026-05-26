@echo off
cd /d "%~dp0"
npm run dev -- --hostname 127.0.0.1 --port 3000 > dev-server.log 2>&1
