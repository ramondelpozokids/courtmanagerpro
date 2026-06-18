# Guía CourtManager Pro — App, Negocio y Funcionamiento

**Para:** Ramón del Pozo Rott · Carlos Rodriguez Kobe  
**Producción:** https://courtmanagerpro.vercel.app  
**Fecha:** Junio 2026

---

## Índice de lectura tranquila

| # | Documento | Qué encontrarás |
|---|-----------|-----------------|
| 01 | [Funcionamiento de la App](./01-funcionamiento-app.md) | Módulos, roles, flujos diarios |
| 02 | [Seguridad y Accesos](./02-seguridad-y-accesos.md) | Invitado, Carlos, Ramón, permisos |
| 03 | [PWA — App Instalable](./03-pwa-app-instalable.md) | Opción A: instalar desde el navegador |
| 04 | [App Nativa y Tiendas](./04-app-nativa-capacitor.md) | Opción B: App Store / Google Play |
| 05 | [Monetización SaaS](./05-monetizacion-stripe-pricing.md) | Stripe, planes, precios |
| 06 | [Pitch para Inversores](./06-pitch-inversores.md) | Argumento de venta y escalabilidad |
| 07 | [SEO y Visibilidad Web](./07-seo-keywords-robots.md) | Keywords, robots.txt, sitemap |
| 08 | [Presentación Inversores (Marp)](./08-presentacion-inversores-slides.md) | 15 slides exportables a PDF/PPT |
| — | **[Presentación HTML interactiva](./presentacion-inversores.html)** | Abrir en navegador · flechas ← → |

---

## Presentación para inversores

1. **Doble clic** en `presentacion-inversores.html` → presentación a pantalla completa
2. Navega con **← →** o **Espacio**
3. Para PowerPoint/Google Slides: importa `08-presentacion-inversores-slides.md` con [Marp](https://marp.app/) o copia slide a slide


## Resumen en 30 segundos

CourtManager Pro es un **SaaS de utilería deportiva** para clubes de baloncesto profesional. Gestiona tallajes (26+ productos por jugador), inventario con QR, solicitudes, viajes, lavandería, material médico, alertas (incluido cumpleaños de plantilla para Carlos) e informes de equipación.

**Ya es PWA** gracias a `manifest.json`. Los usuarios pueden instalarla desde Chrome/Safari. El QR del footer lleva directo a la URL de instalación.

**Comercialización:** integrar Stripe Billing para cobro mensual por club. Margen SaaS estimado >90% con infraestructura Vercel + Supabase.

---

*Documentación generada para lectura local. No sustituye asesoría legal ni fiscal.*
