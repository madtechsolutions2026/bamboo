@echo off
cd /d "%~dp0"
echo Starting BAMBU demo at http://127.0.0.1:5178
node node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5178
