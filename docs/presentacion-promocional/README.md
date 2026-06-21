# Presentación promocional CourtManager Pro

Landing pages HTML para inversores, clubes ACB y clientes potenciales.

## Archivos

| Archivo | Idioma | Narración |
|---------|--------|-----------|
| [index.html](./index.html) | Selector ES / CA / FCB / EN | — |
| [es.html](./es.html) | Español | TTS · guion CourtManager Pro |
| [ca.html](./ca.html) | Català | TTS · guió CourtManager Pro |
| [fcb-ca.html](./fcb-ca.html) | **FC Barcelona (català)** | TTS · guió específic Barça · **Live:** https://fcb-ca.netlify.app/ |
| [en.html](./en.html) | English | TTS |
| [voice.js](./voice.js) | Motor de narración | TTS + MP3 opcional |
| [scripts/](./scripts/) | Textos para grabar / edge-tts | `narracion-courtmanager-*.txt` |
| [assets/](./assets/) | Imágenes locales | hero, galería, equipo |

## Narración por voz

Panel fijo 🎙️ abajo a la izquierda en todas las landings:

| Idioma | Fuente | Contenido |
|--------|--------|-----------|
| ES | Web Speech API (voz es-ES) | **CourtManager Pro** (no Bookia) |
| CA | Web Speech API (voz ca-ES) | CourtManager Pro |
| FCB | Web Speech API (catalán) | Proposta personalizada Barça |
| EN | Web Speech API (en-US) | CourtManager Pro |

### Usar tus MP3 grabados

1. Graba el texto de `scripts/narracion-courtmanager-es.txt` y `narracion-courtmanager-ca.txt`
2. Sustituye `audio/es.mp3` y `audio/ca.mp3`
3. Añade en el `<html>`: `data-audio="mp3"` (ej. `<html lang="es" data-audio="mp3">`)

### Regenerar MP3 con edge-tts

```powershell
pip install --user edge-tts
powershell -ExecutionPolicy Bypass -File scripts\generate-presentacion-audio.ps1
```

## Publicar online (envío por internet)

### Opción rápida — ZIP listo

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-presentacion-netlify.ps1
```

Genera `dist/CourtManager-Pro-Presentacion-netlify.zip`. Sitio publicado: **https://courtmanager-pro-presentacion.netlify.app/**

| Página | URL |
|--------|-----|
| Selector | https://courtmanager-pro-presentacion.netlify.app/ |
| Español | https://courtmanager-pro-presentacion.netlify.app/es.html |
| Català | https://courtmanager-pro-presentacion.netlify.app/ca.html |
| English | https://courtmanager-pro-presentacion.netlify.app/en.html |
| FC Barcelona | https://fcb-ca.netlify.app/ *(sitio dedicado)* |

### CLI (opcional)

```powershell
$env:NETLIFY_AUTH_TOKEN = "tu-token"
powershell -ExecutionPolicy Bypass -File scripts\deploy-presentacion-netlify.ps1 -Deploy
```

Ver también [GUIA-ENVIO-DIGITAL.md](../acb-outreach/GUIA-ENVIO-DIGITAL.md).

## Abrir en local

```powershell
Start-Process "C:\Users\X\Desktop\courtmanager-pro\docs\presentacion-promocional\es.html"
```

## Kit completo ACB

Todo el material para clubes e inversores: [docs/acb-outreach/README.md](../acb-outreach/README.md)

- Dossier genérico
- Presupuesto y propuesta
- Lista de contactos 18 clubes ACB
- Dossier FC Barcelona en catalán
- Guía de envío digital

## Demo

https://courtmanagerpro.vercel.app
