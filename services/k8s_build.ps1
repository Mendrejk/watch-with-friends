docker compose build
Set-Location _kubernetes
& .\stop_all.ps1
& .\start_all.ps1
Set-Location ..