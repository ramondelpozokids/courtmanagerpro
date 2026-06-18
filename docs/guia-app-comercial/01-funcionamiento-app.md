# 01 — Funcionamiento de la App

## ¿Qué es CourtManager Pro?

Plataforma web (Next.js 15 + React 19) desplegada en **Vercel**, con datos en **Supabase PostgreSQL** o modo demo local cuando la BD está vacía.

## Módulos principales

| Ruta | Función |
|------|---------|
| `/` | Dashboard con KPIs y acciones rápidas |
| `/players` | Plantilla oficial (17 jugadores RMB demo) |
| `/sizing` | Tabla de tallas — 26+ productos + personalizables |
| `/inventory` | Stock utilería con QR por SKU |
| `/inventory/scanner` | Lector QR / código de barras |
| `/requests` | Solicitudes de equipación (workflow aprobar/entregar) |
| `/trips` | Viajes y packing list |
| `/laundry` | Lavandería |
| `/medical` | 15 referencias médicas + botiquines |
| `/reports` | Informes equipación + export CSV |
| `/alerts` | Alertas tiempo real (stock, cumpleaños, caducidades) |

## Alertas de cumpleaños (Carlos Kobe)

Al cargar alertas en modo demo, el sistema **escanea automáticamente** la plantilla y crea avisos del tipo:

> *¡AVISO PARA CARLOS KOBE! [Jugador] cumple años el [día] de [mes]. Preparar equipación de regalo.*

También disponible el botón manual **🎂 Escanear Cumpleaños del Mes** en `/alerts`.

## Flujo típico de Carlos (utilería)

1. Revisa alertas y cumpleaños en `/alerts`
2. Aprueba solicitudes en `/requests`
3. Ajusta stock en `/inventory` o escanea QR
4. Actualiza tallas en `/sizing`
5. Exporta informes CSV en `/reports`
6. Controla botiquines en `/medical`

## Chat Assistant

Botón flotante con logo RMB. Responde a palabras clave: cumpleaños, tallas, viajes, material faltante.

## Footer

Incluye **código QR** → escanea e instala/abre la PWA en móvil. Enlaces legales con tipografía legible (`text-sm`).
