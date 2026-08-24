Write-Host "===================================================" -ForegroundColor Red
Write-Host "      RETROPARTS - STARTING OFFLINE SERVERS        " -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Red
Write-Host ""
Write-Host "1. Initializing Embedded Local Database & API..." -ForegroundColor Yellow
Write-Host "2. Starting Vite Frontend UI Server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Opening RetroParts at http://localhost:5173 ..." -ForegroundColor Green
Write-Host "Press Ctrl+C to shut down the servers when finished." -ForegroundColor Gray
Write-Host "===================================================" -ForegroundColor Red
Write-Host ""

Start-Process "http://localhost:5173"
npm run dev
