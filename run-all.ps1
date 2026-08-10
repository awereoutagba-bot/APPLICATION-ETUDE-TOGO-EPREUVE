# Lance le backend et le frontend en deux fenêtres PowerShell séparées.
# Exécute ce script depuis la racine du projet :
#   .\run-all.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

Write-Host "Ouverture du backend dans une nouvelle fenêtre PowerShell..."
Start-Process powershell -ArgumentList @('-NoExit', '-Command', "Set-Location -Path '$backend'; npm run dev") -WorkingDirectory $backend

Write-Host "Ouverture du frontend dans une nouvelle fenêtre PowerShell..."
Start-Process powershell -ArgumentList @('-NoExit', '-Command', "Set-Location -Path '$frontend'; npm run dev") -WorkingDirectory $frontend
