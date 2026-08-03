# Auditoría Completa — CourtManager Pro

**Proyecto:** CourtManager Pro — utilería profesional (fútbol y baloncesto de élite)  
**Fecha de auditoría base:** 18 de junio de 2026 (actualizado enlace dossier julio 2026)  
**Elaborado para:** Ramón del Pozo Rott · Carlos Rodriguez Kobe

---

## Presentación comercial (acorde al dossier)

Antes de la due diligence técnica, usa el kit comercial:

| Documento | Ruta |
|-----------|------|
| Dossier ejecutivo (lenguaje claro + almacén €) | [../dossier-elite-clubs/DOSSIER.html](../dossier-elite-clubs/DOSSIER.html) |
| Vídeo demo ~90 s | [../dossier-elite-clubs/VIDEO-PROMO.html](../dossier-elite-clubs/VIDEO-PROMO.html) |
| Hub presentación + voces ES/EN | [../presentacion-promocional/index.html](../presentacion-promocional/index.html) |
| Ficha Real Madrid Next | [../dossier-elite-clubs/FICHA-REAL-MADRID-NEXT.md](../dossier-elite-clubs/FICHA-REAL-MADRID-NEXT.md) |

---

## Índice de documentos técnicos

| # | Documento | Contenido |
|---|-----------|-----------|
| 01 | [Resumen ejecutivo](./01-resumen-ejecutivo.md) | Visión general, stack, estado del producto |
| 02 | [Arquitectura](./02-arquitectura.md) | Capas, carpetas, rutas, dependencias |
| 03 | [Seguridad y RLS](./03-seguridad-rls.md) | Auth, roles, middleware, políticas Supabase |
| 04 | [Valoración económica](./04-valoracion-economica.md) | Coste de desarrollo y valor de mercado |
| 05 | [Despliegue](./05-despliegue-vercel-supabase.md) | Vercel, Supabase, variables de entorno |
| 06 | [Inventario de módulos](./06-inventario-modulos.md) | Funcionalidades, hooks, APIs, mock vs live |
| — | [Auditoría comercial ATM](./AUDITORIA-COMERCIAL-ATM-2026.md) | Valor de negocio orientado a Atlético / Atleti Lab |
| — | [Pentest readiness ATM](./PENTEST-READINESS-ATM.md) | Endurecimiento ante pruebas de hacking |
| — | [Informe ejecutivo PDF](./CourtManager-Pro-Informe-Ejecutivo-ATM.pdf) | 3 páginas A4 para reenviar (HTML fuente: INFORME-EJECUTIVO-ATM.html) |

---

## Documentación relacionada (fuera de esta carpeta)

- `docs/AUDITORIA.md` — Documento original consolidado
- `docs/API.md` — Referencia de endpoints REST
- `docs/DEPLOYMENT.md` — Guía técnica de despliegue

---

## Cómo usar esta carpeta

1. Empieza por el **dossier** comercial si el destinatario es dirección / innovación.
2. Luego **01-resumen-ejecutivo.md** para una visión técnica de 5 minutos.
3. Para due diligence: **02**, **03** y **06** en orden.
4. Para inversores o licencias: **04**.
5. Para poner en producción: **05** junto con `docs/DEPLOYMENT.md`.

**Nota (julio 2026):** el producto ha evolucionado con Real Madrid Fútbol (RMF), almacén general, movimientos de stock y checklist pre-partido. El dossier refleja el mensaje comercial actual. La sección de seguridad (**03**) está actualizada al 26/07/2026 con el veredicto de **3 capas** (middleware + APIs + RLS), estrategia Next (demo en vivo, sin invitados) y endurecimiento HTTP / rate limit de login.

---

*Auditoría basada en el código fuente del repositorio local en `C:\Users\X\Desktop\courtmanager-pro`.*
