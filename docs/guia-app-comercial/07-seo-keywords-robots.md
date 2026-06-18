# 07 — SEO, Keywords y Robots

## Archivos configurados

| Archivo | Ubicación | Función |
|---------|-----------|---------|
| `robots.txt` | `public/robots.txt` | Permite indexación, bloquea `/api/` |
| `sitemap.xml` | generado por `src/app/sitemap.ts` | 22 URLs principales |
| Metadata | `src/app/layout.tsx` | title, description, Open Graph, Twitter |
| Keywords | `src/content/seo.ts` | 15 keywords sector utilería/ACB |

## URL canónica

https://courtmanagerpro.vercel.app

## Keywords principales

- CourtManager Pro
- utilería baloncesto
- gestión equipación ACB
- inventario deportivo QR
- tallajes jugadores baloncesto
- Real Madrid Baloncesto
- software utilería profesional
- SaaS deportivo
- Euroliga equipamiento

## Open Graph

Al compartir en LinkedIn/WhatsApp aparece título, descripción e icono `/logo.png`.

## Robots.txt contenido

```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://courtmanagerpro.vercel.app/sitemap.xml
```

## Verificación post-deploy

1. Google Search Console → añadir propiedad → enviar sitemap
2. Comprobar `view-source` tiene meta description
3. Lighthouse → SEO score

## QR en footer

El QR apunta a la URL principal — útil para SEO offline (material impreso, tarjetas Carlos/Ramón) y instalación PWA directa.
