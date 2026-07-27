# CourtManager Pro — Kit de presentación (acorde al dossier)

**Contacto:** Ramón del Pozo Rott · info@ramondelpozorott.es  
**Confidencial · Julio 2026**

---

## Qué incluye

| Archivo | Para qué |
|---------|----------|
| [DOSSIER.html](./DOSSIER.html) | Dossier ejecutivo (imprimir / PDF) |
| [VIDEO-PROMO.html](./VIDEO-PROMO.html) | Presentación ejecutiva ~110 s (objetivo: reunión / demo) |
| [PRESENTACION-AUDIO.html](./PRESENTACION-AUDIO.html) | Audio largo ~4 min |
| [FICHA-REAL-MADRID-NEXT.md](./FICHA-REAL-MADRID-NEXT.md) | Formulario Únete a Next |
| [EMAIL-MULTI-CLUB.md](./EMAIL-MULTI-CLUB.md) | Plantilla de correo |
| [scripts/narracion-video-90s-es.txt](./scripts/narracion-video-90s-es.txt) | Guion vídeo ES |
| [scripts/narracion-video-90s-en.txt](./scripts/narracion-video-90s-en.txt) | Guion vídeo EN |
| [scripts/storyboard-video.md](./scripts/storyboard-video.md) | Tiempos y pantallas |
| [scripts/export-video-promo.ps1](./scripts/export-video-promo.ps1) | Export MP4 (Elvira + Jenny + ffmpeg) |

**Hub visual con voces MP3/TTS:**  
[../presentacion-promocional/index.html](../presentacion-promocional/index.html) → `es.html` / `en.html` (misma voz Elvira / EN)

**Auditoría técnica:**  
[../auditoria/README.md](../auditoria/README.md)

**Copia Escritorio:** `Desktop\CourtManager-Pro-Dossier-Elite\`

---

## Presentación ejecutiva (~110 s)

**Objetivo:** provocar «queremos una demostración». No vende suscripción ni precio.

1. Abre `VIDEO-PROMO.html` → F11 → **Reproducir** (ES o EN).
2. Graba pantalla con CapCut u OBS.
3. O exporta MP4:

```powershell
powershell -ExecutionPolicy Bypass -File docs\dossier-elite-clubs\scripts\export-video-promo.ps1
```

Voces edge-tts: `es-ES-ElviraNeural` / `en-US-JennyNeural` (ritmo ligeramente más pausado).

---

## Mensaje clave

> CourtManager Pro. Diseñado para que la utilería trabaje con la misma precisión que el equipo sobre el terreno de juego.
