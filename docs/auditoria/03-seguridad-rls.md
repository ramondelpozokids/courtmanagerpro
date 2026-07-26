# 03 — Seguridad, Auth y RLS

**Actualizado:** 26 de julio de 2026

## Veredicto: 3 capas reales y funcionales (producción)

En producción (Supabase real, `NEXT_PUBLIC_DEMO_MODE` ≠ `true`) CourtManager Pro aplica **tres capas obligatorias**:

| Capa | Qué hace (funcional) | Código |
|------|----------------------|--------|
| **1. Acceso** | Middleware: sin sesión → redirect `/login` (páginas) o **401** (`/api/*`). Registro cerrado. Cron solo con `Bearer CRON_SECRET`. Passkeys en cuentas clave. | [`src/middleware.ts`](../../src/middleware.ts), WebAuthn |
| **2. APIs** | Handlers de datos exigen usuario (`requireApiUser` / `requireProductionApiUser`). Rate limit en login. | [`src/lib/supabase-route-auth.ts`](../../src/lib/supabase-route-auth.ts), [`src/lib/login-rate-limit.ts`](../../src/lib/login-rate-limit.ts) |
| **3. Datos (RLS)** | Postgres aísla filas por equipo; anon key no salta RLS. `audit_log` para cambios sensibles. | migraciones Supabase |

**Endurecimiento HTTP:** CSP + `X-Frame-Options` + `nosniff` + Referrer/Permissions en [`next.config.js`](../../next.config.js).

### Lo que NO cuenta como capa

[`src/lib/securityLayers.ts`](../../src/lib/securityLayers.ts) (clic derecho / F12) es solo disuasión cosmética.
---

## Sistema de autenticación

### Modo mock (desarrollo / sin Supabase)

Activado cuando falta `NEXT_PUBLIC_SUPABASE_URL` o contiene `"your-project"`, o `NEXT_PUBLIC_DEMO_MODE=true`.

- Usuario por defecto: **Carlos Rodriguez Kobe** (`equipment_manager`)
- Equipo por defecto: **Real Madrid Baloncesto**
- `switchRole()` permite simular roles sin login real
- Cookie `cm_auth` / `cm_role` (middleware en modo demo)
- **Riesgo:** contraseñas mock en [`src/lib/auth-credentials.ts`](../../src/lib/auth-credentials.ts) — solo para demos internas, no para prospectos

### Modo live (Vercel + Supabase)

- Supabase Auth (`signInWithPassword`, session cookies `sb-*-auth-token`)
- API de login con rate limit: `POST /api/auth/login`
- Perfil en tabla `profiles`
- Equipos vía `user_teams` + join `teams`
- `currentTeamId` persistido en `localStorage`

---

## Roles definidos

### Roles base (`src/types/index.ts`)

`admin` · `equipment_manager` · `assistant` · `player` · `medical` · `coach`

### Roles extendidos (`AuthContext`)

Añade: `superadmin` · `staff` · `consulta`

### Comportamiento de permisos (`hasPermission`)

| Condición | Resultado |
|-----------|-----------|
| Sin usuario o sin equipo activo | `false` |
| Rol `superadmin` | `true` (bypass total) |
| Resto | Comprueba rol del usuario en el equipo actual |

### Restricciones en navegación (`Sidebar.tsx`)

| Ruta | Roles permitidos |
|------|------------------|
| `/medical` | admin, equipment_manager, medical |
| `/reports` | admin, equipment_manager |
| Resto | Según permisos del módulo |

> **Nota:** La UI filtra por rol en cliente. El **refuerzo real** es capa 2 (APIs) + capa 3 (RLS). El middleware (capa 1) exige sesión, no rol fino.

---

## Middleware (`src/middleware.ts`)

En **producción**:

1. `/api/*` (excepto login/webauthn/config/ai-ping): sin sesión → **401 JSON**. Cron: solo `Authorization: Bearer CRON_SECRET`.
2. Páginas: sin sesión → redirect a `/login?redirect=…`.
3. `/registro` redirige a `/login` (cuentas solo por admin/Supabase).

En **demo/mock** (no producción): cookies `cm_auth` / sesión `sb-*`.

Las APIs se revalidan además en cada `route.ts` (capa 2).

---

## Seguridad en APIs (producción)

Patrón habitual: `requireApiUser()` o `getUser()` → 401 si no hay sesión. Equipo de utilería: `withEquipmentAuth()`.

| Área | Auth en producción |
|------|-------------------|
| `/api/players/*` | Sí (`getUser`) |
| `/api/inventory/*` | Sí |
| `/api/requests` | Sí |
| `/api/alerts` | Sí |
| `/api/reports/dashboard` | Sí |
| `/api/trips` | Sí (`requireApiUser`) |
| `/api/laundry` | Sí |
| `/api/medical` | Sí |
| `/api/coaching-staff` | Sí |
| `/api/warehouse`, `/api/stock-movements` | Sí |
| `/api/equipment-team/*` | Sí (`withEquipmentAuth`) |
| `/api/store/status` | Sí (`requireApiUser`) |
| `/api/auth/login` | Público + **rate limit** |
| `/api/auth/config` | Público (diagnóstico sin secretos) |
| `/api/ai/ping` | Secreto `AI_PING_SECRET` |

---

## Row Level Security (Supabase)

Archivo: `supabase/migrations/002_rls_policies.sql` (+ migraciones posteriores de tablas nuevas).

### Funciones helper

- `get_user_team_role(user_id, team_id)`
- `user_belongs_to_team(user_id, team_id)`
- `user_can_write(user_id, team_id)`
- `user_is_manager(user_id, team_id)`
- `user_is_admin(user_id, team_id)`

### Políticas generales

| Operación | Regla |
|-----------|-------|
| SELECT | Usuario pertenece al equipo (`user_belongs_to_team`) |
| INSERT/UPDATE/DELETE | Roles admin, equipment_manager o assistant (según tabla) |
| Material médico | Lectura staff; escritura admin, equipment_manager, medical |
| `audit_log` SELECT | Solo admin y managers |
| `audit_log` INSERT | Bloqueado para usuarios (`WITH CHECK (false)`) — solo triggers |

### Tablas con RLS (núcleo + posteriores)

`profiles`, `teams`, `players`, `inventory_items`, `item_assignments`, `requests`, `request_items`, `request_comments`, `trips`, `trip_players`, `trip_items`, `laundry_batches`, `laundry_items`, `medical_items`, `medical_usage`, `alerts`, `audit_log`, `user_teams`, y tablas añadidas en migraciones 009+ (calendario, warehouse, equipment team, etc. — verificar cada migración).

---

## Auditoría en base de datos

### Tabla `audit_log`

Registro automático de cambios sensibles vía función `log_audit()` (trigger en migración 001).

### Triggers de alertas automáticas

- Stock bajo mínimo → alerta
- Material médico próximo a caducar → alerta

---

## Variables de entorno sensibles

| Variable | Exposición | Uso |
|----------|-----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública (cliente) | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública (cliente) | Clave anónima (RLS aplica) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo servidor** | Admin client en `server.ts` |

**Buenas prácticas aplicadas:**
- Sanitización de comillas/espacios en URL y keys
- Service role no expuesta al cliente

---

## Realtime (alertas)

`useAlerts` suscribe `postgres_changes` en tabla `alerts` con canal único por instancia.

---

## Cumplimiento GDPR / LOPD (consideraciones)

Datos sensibles gestionados: tallajes, operaciones de material, material médico de vestuario.

| Medida | Estado |
|--------|--------|
| RLS en PostgreSQL | Implementado |
| Cifrado en tránsito (HTTPS) | Vercel SSL |
| Auth + rate limit login | Implementado |
| CSP / anti-clickjacking | Headers en `next.config.js` |
| Políticas legales | Rutas `/seguridad`, privacidad, etc. |
| Derecho al olvido | Proceso manual / contactar responsable |

---

[← Arquitectura](./02-arquitectura.md) · [Índice](./README.md) · [Siguiente: Valoración →](./04-valoracion-economica.md)
