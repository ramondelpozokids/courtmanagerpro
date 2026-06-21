# Presentación promocional CourtManager Pro

Landing pages HTML para inversores, compradores y clientes potenciales.

## Archivos

| Archivo | Idioma | Audio |
|---------|--------|-------|
| [index.html](./index.html) | Selector ES / CA / EN | — |
| [es.html](./es.html) | Español | `audio/es.mp3` (voz profesional) |
| [ca.html](./ca.html) | Català | `audio/ca.mp3` (veu professional) |
| [en.html](./en.html) | English | Web Speech API (sintética) |
| [voice.js](./voice.js) | Motor de narración | MP3 + TTS |
| [audio/](./audio/) | Pistas de voz | `es.mp3`, `ca.mp3` |
| [assets/](./assets/) | Imágenes locales | hero, galería, equipo |

## Narración por voz

En **es.html**, **ca.html** y **en.html** aparece un panel fijo 🎙️ abajo a la izquierda:

| Idioma | Fuente |
|--------|--------|
| ES | `audio/es.mp3` — voz profesional grabada |
| CA | `audio/ca.mp3` — veu professional gravada |
| EN | Voz sintética del navegador (en-US) |

Controles: Escuchar / Pausar / Continuar / Detener + barra de progreso.

## Cómo abrir en local

```powershell
Start-Process "C:\Users\X\Desktop\courtmanager-pro\docs\presentacion-promocional\es.html"
```

Todas las imágenes cargan desde `./assets/` — funciona sin internet (excepto iframe demo y fuentes Google Fonts).

## Contenido

- Hero con imagen del dashboard actual
- Demo en vivo embebida (iframe → courtmanagerpro.vercel.app)
- 9 módulos / features
- Galería visual
- Precios mensual/anual (Starter · Pro · Elite)
- Sección inversores con métricas
- Equipo (Ramón + Carlos)
- CTA y contacto

## Nota

Estos HTML son estáticos y **no se despliegan en Vercel** con la app Next.js. Para compartir online, súbelos a Netlify Drop, GitHub Pages o envíalos como PDF.
