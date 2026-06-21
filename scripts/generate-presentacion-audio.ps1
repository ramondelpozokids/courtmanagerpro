# Genera audio MP3 de CourtManager Pro (ES + CA) con edge-tts
# Requisito: pip install edge-tts
# Uso: .\scripts\generate-presentacion-audio.ps1

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$scripts = Join-Path $root "docs\presentacion-promocional\scripts"
$audio = Join-Path $root "docs\presentacion-promocional\audio"

$esText = Get-Content (Join-Path $scripts "narracion-courtmanager-es.txt") -Raw -Encoding UTF8
$caText = Get-Content (Join-Path $scripts "narracion-courtmanager-ca.txt") -Raw -Encoding UTF8

$esOut = Join-Path $audio "es.mp3"
$caOut = Join-Path $audio "ca.mp3"

Write-Host "Generando es.mp3 (voz es-ES-ElviraNeural)..."
python -m edge_tts --voice es-ES-ElviraNeural --rate "+0%" --file (Join-Path $scripts "narracion-courtmanager-es.txt") --write-media $esOut

Write-Host "Generando ca.mp3 (voz ca-ES-JoanaNeural)..."
python -m edge_tts --voice ca-ES-JoanaNeural --rate "+0%" --file (Join-Path $scripts "narracion-courtmanager-ca.txt") --write-media $caOut

Write-Host "Listo: $esOut"
Write-Host "Listo: $caOut"
