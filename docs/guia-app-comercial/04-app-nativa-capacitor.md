# 04 — App Nativa: App Store y Google Play (Opción B)

## ¿Cuándo usar Capacitor?

Cuando quieras que los clubes descarguen desde **Apple App Store** y **Google Play Store**, no solo instalar desde el navegador.

## Ionic Capacitor — resumen

Capacitor envuelve tu web Next.js en un contenedor nativo iOS/Android.

### Pasos generales (1 tarde de trabajo)

1. `npm install @capacitor/core @capacitor/cli`
2. `npx cap init CourtManagerPro com.courtmanager.pro`
3. Export estático o URL remota:
   - **Opción simple:** WebView apunta a `https://courtmanagerpro.vercel.app`
   - **Opción avanzada:** `next export` + assets embebidos
4. `npx cap add ios` / `npx cap add android`
5. Abrir Xcode / Android Studio → firmar → subir a tiendas

## Ventaja para CourtManager Pro

- **Cámara nativa** para el Escáner QR de `/inventory/scanner` (mejor que getUserMedia en web)
- Presencia en tiendas = credibilidad B2B con clubes profesionales
- Push notifications nativas (alertas de stock, cumpleaños)

## Costes tiendas

- Apple Developer: ~99 USD/año
- Google Play: ~25 USD único

## Nota técnica

Next.js 15 con SSR en Vercel + Capacitor WebView remoto es la ruta más rápida. No requiere reescribir el código actual.
