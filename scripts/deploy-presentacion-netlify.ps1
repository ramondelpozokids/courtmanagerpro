# Empaqueta y despliega la presentación completa en Netlify
# Uso:
#   .\scripts\deploy-presentacion-netlify.ps1           # crea ZIP para Netlify Drop
#   .\scripts\deploy-presentacion-netlify.ps1 -Deploy   # requiere NETLIFY_AUTH_TOKEN

param(
    [switch]$Deploy,
    [string]$SiteName = "courtmanager-pro-presentacion"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$src = Join-Path $root "docs\presentacion-promocional"
$dist = Join-Path $root "dist\presentacion-promocional"
$zip = Join-Path $root "dist\CourtManager-Pro-Presentacion-netlify.zip"

Write-Host "Origen: $src"

# Carpeta limpia para deploy (sin README ni scripts de grabación)
if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
New-Item -ItemType Directory -Path $dist -Force | Out-Null

$include = @(
    "*.html", "voice.js", "netlify.toml", "_redirects"
)
foreach ($pattern in $include) {
    Copy-Item (Join-Path $src $pattern) $dist -Force
}
Copy-Item (Join-Path $src "assets") (Join-Path $dist "assets") -Recurse -Force
Copy-Item (Join-Path $src "audio") (Join-Path $dist "audio") -Recurse -Force

Write-Host "Paquete listo en: $dist"
Write-Host "  - index.html (selector idiomas)"
Write-Host "  - es.html / ca.html / en.html / fcb-ca.html"
Write-Host "  - assets/ + audio/ + voice.js"

# ZIP para Netlify Drop
$zipDir = Split-Path $zip -Parent
if (-not (Test-Path $zipDir)) { New-Item -ItemType Directory -Path $zipDir -Force | Out-Null }
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path "$dist\*" -DestinationPath $zip -Force
Write-Host ""
Write-Host "ZIP creado: $zip"
Write-Host "  -> Arrastra este ZIP a https://app.netlify.com/drop"
Write-Host "  -> Renombra el sitio a: $SiteName (URL: https://${SiteName}.netlify.app)"

if ($Deploy) {
    if (-not $env:NETLIFY_AUTH_TOKEN) {
        Write-Host ""
        Write-Host "NETLIFY_AUTH_TOKEN no definido." -ForegroundColor Yellow
        Write-Host "1. https://app.netlify.com/user/applications -> New access token"
        Write-Host "2. `$env:NETLIFY_AUTH_TOKEN = 'tu-token'"
        Write-Host "3. Vuelve a ejecutar con -Deploy"
        exit 1
    }
    Push-Location $dist
    try {
        npx --yes netlify-cli deploy --prod --dir . --site $SiteName 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Si el sitio no existe, créalo en Netlify y enlázalo, o usa Netlify Drop con el ZIP." -ForegroundColor Yellow
        }
    } finally {
        Pop-Location
    }
}

Write-Host ""
Write-Host "URLs tras publicar:"
Write-Host "  https://${SiteName}.netlify.app/"
Write-Host "  https://${SiteName}.netlify.app/es.html"
Write-Host "  https://${SiteName}.netlify.app/ca.html"
Write-Host "  https://${SiteName}.netlify.app/en.html"
Write-Host "  https://${SiteName}.netlify.app/fcb-ca.html"
Write-Host ""
Write-Host "FCB (sitio dedicado ya publicado): https://fcb-ca.netlify.app/"
