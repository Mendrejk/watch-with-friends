minikube start --memory 4096 --cpus 2

# Get all processes with the name "minikube"
$processes = Get-Process | Where-Object { $_.ProcessName -eq "minikube" }

# If any processes exist, stop them
foreach ($process in $processes) {
    Stop-Process -Id $process.Id -Force
}

# Start minikube tunnel in the background
$tunnelJob = Start-Job -ScriptBlock { minikube tunnel }

# Wait for the tunnel to successfully start
while ($true) {
    $jobOutput = Receive-Job -Job $tunnelJob -Keep
    if ($jobOutput -match "\* Tunnel successfully started") {
        break
    }
    Start-Sleep -Seconds 1
}

minikube addons enable ingress
minikube dashboard