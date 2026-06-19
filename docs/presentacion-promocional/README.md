# Presentación promocional CourtManager Pro

Landing pages HTML para inversores, compradores y clientes potenciales.

## Archivos

| Archivo | Idioma |
|---------|--------|
| [index.html](./index.html) | Selector ES / EN |
| [es.html](./es.html) | Español + narración por voz |
| [en.html](./en.html) | English + voice narration |
| [voice.js](./voice.js) | Motor de voz (Web Speech API) |
| [assets/](./assets/) | Imágenes locales (hero, galería, equipo) |

## Imágenes incluidas (carpeta `assets/`)

- `hero.png` — Dashboard principal
- `logo.png` — Logo CourtManager Pro
- `inventory-qr.jpg` — Inventario y QR
- `euroleague-travel.jpg` — Viajes Euroliga
- `arena-operations.jpg` — Operativa en pabellón
- `carlos_kobe.png` / `ramon-del-pozo.png` — Equipo

## Narración por voz

En **es.html** y **en.html** aparece un panel fijo 🎙️ abajo a la izquierda:
- **Escuchar presentación** / **Listen to pitch** (~4 min)
- Pausar / Continuar / Detener
- Usa la voz sintética del navegador (es-ES / en-US)

## Cómo abrir en local

```powershell
Start-Process "C:\Users\X\Desktop\courtmanager-pro\docs\presentacion-promocional\es.html"
```

Todas las imágenes cargan desde `./assets/` — funciona sin internet.

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
