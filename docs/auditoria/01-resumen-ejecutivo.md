# 01 — Resumen Ejecutivo

## Qué es CourtManager Pro

**CourtManager Pro** es una plataforma SaaS de gestión de utilería para equipos profesionales de baloncesto. Está modelada sobre el flujo operativo del **Real Madrid Baloncesto** (temporada 2025/2026): inventario, tallajes, solicitudes de material, viajes, lavandería, alertas y material médico.

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 19, Next.js 15 (App Router), Tailwind CSS |
| Backend / API | Next.js Route Handlers (`src/app/api/`) |
| Base de datos | Supabase (PostgreSQL 15) + modo mock en memoria |
| Auth | Supabase Auth + perfiles locales en modo demo |
| Despliegue | Vercel |
| Lenguaje | TypeScript 5.4 |

## Estado actual del producto (junio 2026)

### Funcional en producción

- Dashboard con KPIs, alertas, actividad reciente y portal editorial RMB
- Navegación completa (sidebar, top bar, móvil)
- Simulación de roles (superadmin, admin, jugador, médico, etc.)
- PWA básica (`manifest.json`)
- Despliegue automático desde GitHub → Vercel

### Arquitectura híbrida mock / live

El proyecto opera en **dos modios** según las variables de entorno:

- **Modo mock** (sin Supabase real): datos demo en `InMemoryDB.ts` — jugadores del RM, inventario, viajes, etc.
- **Modo live** (con Supabase en Vercel): consultas reales a PostgreSQL; si la BD está vacía, el dashboard muestra ceros.

Varios módulos siguen usando **solo memoria** aunque Supabase esté configurado: viajes, lavandería, material médico y cuerpo técnico.

### Incidencia corregida recientemente

- **Crash en cliente (Vercel):** Suscripciones Realtime de Supabase duplicadas en `useAlerts` — corregido en commit `9704d4c8`.

## Métricas del código

| Métrica | Valor |
|---------|-------|
| Páginas dashboard | 14 rutas |
| APIs REST | 12 endpoints |
| Entidades de dominio | 7 |
| Hooks personalizados | 11 |
| Migraciones SQL | 2 (schema + RLS) |
| Commits en GitHub | 15+ |

## Roles del equipo (producto)

| Persona | Rol en la plataforma |
|---------|---------------------|
| Ramón del Pozo Rott | Creador · Superadmin |
| Carlos Rodriguez Kobe | Administrador · Equipment Manager |

## Conclusión ejecutiva

CourtManager Pro es un **MVP funcional y desplegable** con arquitectura limpia en capas, interfaz premium y base de datos relacional preparada para producción. Parte del backend sigue en modo demostración (InMemoryDB) mientras los módulos críticos (jugadores, inventario, solicitudes, alertas) tienen camino hacia Supabase live.

**Valor estimado de desarrollo:** ~45.000 € (ver documento 04).  
**Valor de licencia enterprise:** 60.000–85.000 €.

---

[← Índice](./README.md) · [Siguiente: Arquitectura →](./02-arquitectura.md)
