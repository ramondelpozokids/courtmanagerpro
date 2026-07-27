# Exporta la presentación ejecutiva (~110 s) a MP4
# Voces: es-ES-ElviraNeural / en-US-JennyNeural (ritmo -4%)
#
# Requisitos:
#   pip install --user edge-tts
#   ffmpeg en Desktop\ffmpeg\...\bin\ffmpeg.exe
#
# Uso:
#   powershell -ExecutionPolicy Bypass -File .\export-video-promo.ps1

$ErrorActionPreference = "Stop"
$here = $PSScriptRoot
$kit = Split-Path -Parent $here
$export = Join-Path $kit "export"
$slides = Join-Path $export "slides"
New-Item -ItemType Directory -Force -Path $export, $slides | Out-Null

$ffmpegCandidates = @(
  "$env:USERPROFILE\Desktop\ffmpeg\ffmpeg-8.1-essentials_build\bin\ffmpeg.exe",
  "$env:USERPROFILE\Desktop\ffmpeg\bin\ffmpeg.exe",
  "ffmpeg"
)
$ffmpeg = $null
foreach ($c in $ffmpegCandidates) {
  if ($c -eq "ffmpeg") {
    $cmd = Get-Command ffmpeg -ErrorAction SilentlyContinue
    if ($cmd) { $ffmpeg = $cmd.Source; break }
  } elseif (Test-Path $c) {
    $ffmpeg = $c
    break
  }
}
if (-not $ffmpeg) {
  throw "No se encontró ffmpeg. Instálalo o revisa Desktop\ffmpeg\"
}

$hero = Join-Path $kit "assets\dossier-hero.png"
if (-not (Test-Path $hero)) {
  throw "Falta assets/dossier-hero.png en el kit dossier"
}

# Duraciones alineadas con el storyboard ejecutivo (sin precio)
$durations = @(8, 12, 22, 12, 16, 10, 14, 8, 12, 8) # total ~122
$labels = @(
  "01-intro", "02-problem", "03-product", "04-flow", "05-product-more",
  "06-login", "07-benefits", "08-mvp", "09-cta", "10-close"
)
for ($i = 0; $i -lt $labels.Length; $i++) {
  Copy-Item $hero (Join-Path $slides ("{0}.png" -f $labels[$i])) -Force
}

function New-Audio($voice, $scriptFile, $outMp3) {
  if (-not (Test-Path $scriptFile)) { throw "Falta $scriptFile" }
  Write-Host "Generando $outMp3 ($voice)..."
  python -m edge_tts --voice $voice --rate=-4% --file $scriptFile --write-media $outMp3
  if (-not (Test-Path $outMp3)) { throw "No se generó $outMp3 (¿edge-tts instalado?)" }
}

$esScript = Join-Path $here "narracion-video-90s-es.txt"
$enScript = Join-Path $here "narracion-video-90s-en.txt"
$esMp3 = Join-Path $export "video-es.mp3"
$enMp3 = Join-Path $export "video-en.mp3"
$kitEs = Join-Path $kit "audio\es.mp3"
$kitEn = Join-Path $kit "audio\en.mp3"

try {
  New-Audio "es-ES-ElviraNeural" $esScript $esMp3
  New-Audio "en-US-JennyNeural" $enScript $enMp3
  Copy-Item $esMp3 $kitEs -Force
  Copy-Item $enMp3 $kitEn -Force
} catch {
  Write-Warning $_.Exception.Message
  Write-Warning "Sin edge-tts: genera MP3 manual o graba VIDEO-PROMO.html con CapCut/OBS."
}

$concat = Join-Path $export "slides.txt"
$lines = @()
for ($i = 0; $i -lt $labels.Length; $i++) {
  $img = (Join-Path $slides ("{0}.png" -f $labels[$i])).Replace("\", "/")
  $lines += "file '$img'"
  $lines += "duration $($durations[$i])"
}
$last = (Join-Path $slides ("{0}.png" -f $labels[-1])).Replace("\", "/")
$lines += "file '$last'"
Set-Content -Path $concat -Value ($lines -join "`n") -Encoding UTF8

function Export-Mp4($mp3, $outName) {
  $out = Join-Path $export $outName
  if (-not (Test-Path $mp3)) {
    Write-Warning "Sin audio $mp3 — se omite $outName"
    return
  }
  Write-Host "Montando $outName..."
  & $ffmpeg -y -f concat -safe 0 -i $concat -i $mp3 `
    -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" `
    -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest $out
  Write-Host "OK: $out"
}

Export-Mp4 $esMp3 "CourtManager-Pro-Demo-ES.mp4"
Export-Mp4 $enMp3 "CourtManager-Pro-Demo-EN.mp4"

Write-Host ""
Write-Host "Listo. Carpeta: $export"
Write-Host "Preferible: abre VIDEO-PROMO.html a pantalla completa y graba con CapCut/OBS (pantallas del producto)."
