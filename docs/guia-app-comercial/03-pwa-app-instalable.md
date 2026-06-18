# 03 — PWA: App Instalable (Opción A) ✅ YA LISTA

## ¿Qué es una PWA?

Progressive Web App = tu web se comporta como app nativa: icono en pantalla de inicio, pantalla completa sin barra del navegador, almacenamiento local.

## Archivos ya configurados

- `public/manifest.json` — nombre, iconos, colores, `display: standalone`
- `src/app/layout.tsx` — metadata + `manifest` + `appleWebApp`
- Footer con **QR** → `https://courtmanagerpro.vercel.app`

## Cómo instala Carlos (o cualquier club)

### iPhone (Safari)
1. Abrir https://courtmanagerpro.vercel.app
2. Tocar **Compartir** → **Añadir a pantalla de inicio**
3. Confirmar — aparece icono CourtManager Pro

### Android (Chrome)
1. Abrir la URL
2. Menú ⋮ → **Instalar aplicación** o banner automático
3. Icono en el launcher

### Escritorio (Chrome/Edge)
1. Icono de instalación en la barra de direcciones
2. "Instalar CourtManager Pro"

## Experiencia

- Se abre en ventana propia (sin barra del navegador)
- Misma UI que la web
- Ideal para utileros en vestuario con tablet o móvil

## Mejora opcional futura

Añadir **Service Worker** (`next-pwa` o manual) para cache offline del dashboard. Hoy la PWA funciona online; el manifest ya permite instalación.
