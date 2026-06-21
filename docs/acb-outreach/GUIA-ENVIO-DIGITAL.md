# Guía de envío digital — CourtManager Pro a clubes ACB

Cómo publicar y compartir **todo el paquete de marketing** por internet (no solo archivos locales).

---

## 1. Qué vas a enviar en cada contacto

| Pieza | Formato | Cómo compartir |
|-------|---------|----------------|
| Email de presentación | Texto | Gmail / Outlook |
| Dossier genérico | PDF | Adjunto o enlace Drive |
| One-pager | PDF 1 página | Adjunto |
| Presupuesto | PDF | Adjunto |
| Presentación interactiva | URL web | Enlace en email |
| Demo app | URL | Enlace en email |
| Vídeo promocional (opcional) | YouTube / Loom | Enlace |
| Auditoría resumida | PDF | Adjunto (inversores) |

---

## 2. Publicar la presentación HTML online

Los archivos están en `docs/presentacion-promocional/`. Elige **una** opción:

### Opción A — Netlify Drop (recomendado)

**Sitio FCB (ya publicado):** https://fcb-ca.netlify.app/

**Sitio completo ES/CA/EN:**

1. Ejecutar `scripts/deploy-presentacion-netlify.ps1` en el repo
2. Arrastrar `dist/CourtManager-Pro-Presentacion-netlify.zip` a https://app.netlify.com/drop
3. Renombrar sitio → `courtmanager-pro-presentacion` *(publicado)*
4. URLs en producción:
   - https://courtmanager-pro-presentacion.netlify.app/es.html
   - https://courtmanager-pro-presentacion.netlify.app/ca.html
   - https://courtmanager-pro-presentacion.netlify.app/en.html

### Opción B — GitHub Pages

1. Crear repo público `courtmanager-presentacion` (o rama `gh-pages`)
2. Subir contenido de `docs/presentacion-promocional/`
3. Settings → Pages → branch `main` / folder root
4. URL: `https://TU_USUARIO.github.io/courtmanager-presentacion/es.html`

### Opción C — Vercel (proyecto estático aparte)

```powershell
cd docs\presentacion-promocional
npx vercel --yes
```

Vercel asigna dominio `*.vercel.app` automáticamente.

### Opción D — Cloudflare Pages / Render

Mismo principio: subir carpeta estática, obtener URL pública.

---

## 3. Exportar dossier y presupuesto a PDF

1. Abrir en VS Code / Typora / Notion:
   - `docs/acb-outreach/DOSSIER-CLUBES-ACB.md`
   - `docs/acb-outreach/PRESUPUESTO-Y-PROPUESTA.md`
   - `docs/dossier-lanzamiento-saas/06-one-pager-comercial.md`
2. Sustituir placeholders de contacto
3. Exportar PDF con nombres:
   - `CourtManager-Pro-Dossier-ACB-2026.pdf`
   - `CourtManager-Pro-Presupuesto-ACB-2026.pdf`
   - `CourtManager-Pro-OnePager-2026.pdf`

### Subir PDFs a la nube

| Servicio | Uso |
|----------|-----|
| Google Drive | Carpeta compartida “CourtManager Pro ACB 2026” → enlace “cualquiera con el enlace” |
| Dropbox / OneDrive | Igual |
| Notion | Página pública con embeds |

**Tip:** Un solo enlace a carpeta Drive con todos los PDFs simplifica el email.

---

## 4. Vídeo promocional (opcional pero recomendado)

### Grabación rápida con Loom (gratis)

1. https://www.loom.com — grabar pantalla + cámara 3–5 min
2. Guión: problema → demo dashboard → QR → viaje → precios → CTA
3. Copiar enlace público Loom al email

### YouTube (más profesional)

1. Subir MP4 como “No listado” o “Público”
2. Título: `CourtManager Pro — Demo utilería ACB 2026`
3. Descripción con enlaces a demo y contacto

### Narración en la presentación HTML

La presentación ya incluye panel 🎙️ con guion **CourtManager Pro** (no Bookia):

- ES / CA / EN: voz sintética del navegador con guion actualizado
- FCB: guion específico en catalán (`fcb-ca.html`)
- Para MP3 con tu voz: grabar `scripts/narracion-courtmanager-*.txt` y activar `data-audio="mp3"` en el `<html>`

---

## 5. Estructura de email recomendada

```
Asunto: CourtManager Pro — utilería digital para [CLUB] (demo + dossier)

Cuerpo:
- 2 líneas de problema/solución
- Enlace demo app
- Enlace presentación (idioma del club)
- Enlace carpeta Drive (PDFs)
- (Opcional) Enlace vídeo Loom
- CTA: demo 30 min
- Firma Ramón + info@ramondelpozorott.es

Adjuntos (máx 2 si el email es pesado):
- One-pager PDF
- O solo enlaces si todo está en Drive
```

---

## 6. Seguimiento

| Día | Acción |
|-----|--------|
| 0 | Envío inicial |
| 3 | Recordatorio corto si no hay respuesta |
| 7 | Segundo recordatorio + oferta demo |
| 14 | Cerrar o pasar a “nurture” (newsletter LinkedIn) |

Registrar en hoja: Club · Contacto · Fecha envío · Respuesta · Demo agendada.

---

## 7. Idioma por club

| Club | Idioma email | Presentación |
|------|--------------|--------------|
| FC Barcelona | **Catalán** | https://fcb-ca.netlify.app/ |
| Resto ACB | Español | https://courtmanager-pro-presentacion.netlify.app/es.html |
| Joventut / Girona / Manresa | Catalán opcional | https://courtmanager-pro-presentacion.netlify.app/ca.html |
| Baskonia, Valencia | ES + EN opcional | https://courtmanager-pro-presentacion.netlify.app/en.html |
| Bàsquet Girona, Joventut | Catalán opcional | ca.html |
| Resto ACB | Español | es.html |
| Baskonia, Valencia (internacional) | ES + EN opcional | en.html |

---

## 8. Checklist pre-envío

- [ ] Presentación publicada con URL HTTPS
- [ ] PDFs en Drive con enlace público
- [ ] Demo app accesible (courtmanagerpro.vercel.app)
- [ ] Email info@ramondelpozorott.es operativo
- [ ] Lista CLUBES-ACB-CONTACTOS revisada
- [ ] FCB: dossier y presentación en catalán

---

[← Kit ACB](./README.md)
