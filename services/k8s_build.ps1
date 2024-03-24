& minikube -p minikube docker-env --shell powershell | Invoke-Expression

docker compose build
Set-Location _kubernetes
& .\stop_all.ps1
& .\start_all.ps1
Set-Location ..