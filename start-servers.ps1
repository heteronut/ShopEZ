# Starts the ShopEZ demo servers (API on 3001, client on 5173) in the
# background and waits until both answer. Safe to run again: any process
# already listening on those ports is stopped first.
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
foreach ($port in @(3001, 5173)) {
  Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
  }
}
Start-Sleep -Seconds 1
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev:memory > server-demo.log 2>&1" -WorkingDirectory "$base\server" -WindowStyle Hidden
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev > client-dev.log 2>&1" -WorkingDirectory "$base\client" -WindowStyle Hidden
$api = $false; $web = $false
for ($i = 0; $i -lt 40; $i++) {
  Start-Sleep -Seconds 2
  try { $h = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -TimeoutSec 2; if ($h.status -eq "ok") { $api = $true } } catch {}
  try { $r = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -UseBasicParsing; if ($r.Content -match "ShopEZ") { $web = $true } } catch {}
  if ($api -and $web) { break }
}
Write-Output ("ShopEZ API up: " + $api + " | Client up: " + $web)
Write-Output "Store: http://localhost:5173   API: http://localhost:3001"
