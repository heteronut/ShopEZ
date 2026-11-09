$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$compiler = Join-Path $env:WINDIR "Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if (-not (Test-Path -LiteralPath $compiler)) {
  $compiler = Join-Path $env:WINDIR "Microsoft.NET\Framework\v4.0.30319\csc.exe"
}
if (-not (Test-Path -LiteralPath $compiler)) {
  throw "The Windows .NET Framework C# compiler was not found."
}

$source = Join-Path $root "launcher\ShopEZLauncher.cs"
$output = Join-Path $root "ShopEZ.exe"
& $compiler /nologo /target:winexe /platform:anycpu /optimize+ `
  /reference:System.dll /reference:System.Drawing.dll /reference:System.Windows.Forms.dll `
  "/out:$output" $source
if ($LASTEXITCODE -ne 0) {
  throw "ShopEZ.exe compilation failed with exit code $LASTEXITCODE."
}

Write-Output "Built $output"
