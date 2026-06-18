# 03 — Seguridad, Auth y RLS

## Sistema de autenticación

### Modo mock (desarrollo / sin Supabase)

Activado cuando falta `NEXT_PUBLIC_SUPABASE_URL` o contiene `"your-project"`.

- Usuario por defecto: **Carlos Rodriguez Kobe** (`equipment_manager`)
- Equipo por defecto: **Real Madrid Baloncesto** (`team-acb-123`)
- `switchRole()` permite simular roles sin login real
- Login, registro y logout son no-ops o solo estado local

### Modo live (Vercel + Supabase)

- Supabase Auth (`signInWithPassword`, `signUp`, `signOut`)
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
| Resto | Todos (array `roles` vacío) |

> **Nota:** La comprobación de permisos es **solo en cliente**. No hay enforcement en middleware.

---

## Middleware (`src/middleware.ts`)

```typescript
export function middleware(request: NextRequest) {
  return NextResponse.next(); // Sin bloqueo de rutas
}
```

**Matcher:** Todas las rutas excepto `/api`, estáticos, favicon, icons, manifest.

**Implicación:** Cualquier URL del dashboard es accesible sin sesión Supabase en modo live. La UI carga; las APIs protegidas devuelven 401.

---

## Seguridad en APIs

| Endpoint | Auth (`getUser()`) |
|----------|-------------------|
| `/api/players/*` | Sí |
| `/api/inventory/*` | Sí |
| `/api/requests` | Sí |
| `/api/alerts` | Sí |
| `/api/reports/dashboard` | Sí |
| `/api/trips` | **No** |
| `/api/laundry` | **No** |
| `/api/medical` | **No** |
| `/api/coaching-staff` | **No** |

**Recomendación:** Añadir auth a las APIs que aún usan InMemoryDB antes de exponer datos sensibles en producción.

---

## Row Level Security (Supabase)

Archivo: `supabase/migrations/002_rls_policies.sql`

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
| INSERT/UPDATE/DELETE | Roles admin, equipment_manager o assistant |
| Material médico | Lectura staff; escritura admin, equipment_manager, medical |
| `audit_log` SELECT | Solo admin y managers |
| `audit_log` INSERT | Bloqueado para usuarios (`WITH CHECK (false)`) — solo triggers |

### Tablas con RLS habilitado (17)

`profiles`, `teams`, `players`, `inventory_items`, `item_assignments`, `requests`, `request_items`, `request_comments`, `trips`, `trip_players`, `trip_items`, `laundry_batches`, `laundry_items`, `medical_items`, `medical_usage`, `alerts`, `audit_log`, `user_teams`

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
|----------|------------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública (cliente) | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública (cliente) | Clave anónima (RLS aplica) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo servidor** | Admin client en `server.ts` |

**Buenas prácticas aplicadas:**
- Sanitización de comillas/espacios en URL y keys
- Service role no expuesta al cliente

**Riesgo conocido:**
- Si las variables en Vercel incluyen comillas literales, el cliente Supabase puede fallar (corregido parcialmente en commit `94437070`).

---

## Realtime (alertas)

`useAlerts` suscribe `postgres_changes` en tabla `alerts`.

**Fix aplicado (9704d4c8):** Cada instancia del hook usa un canal único (`alerts:{teamId}:{instanceId}`) para evitar colisión entre TopBar, Sidebar y AlertsWidget.

---

## Cumplimiento GDPR / LOPD (consideraciones)

Datos sensibles gestionados: tallajes, datos biométricos deportivos, historial médico simulado.

| Medida | Estado |
|--------|--------|
| RLS en PostgreSQL | Implementado en SQL |
| Cifrado en tránsito (HTTPS) | Vercel SSL |
| Consentimiento / política cookies | Enlaces en footer (contenido pendiente de legal) |
| Derecho al olvido | No automatizado en app |
| Minimización de datos | Parcial — mock incluye datos de jugadores reales de RM |

---

[← Arquitectura](./02-arquitectura.md) · [Índice](./README.md) · [Siguiente: Valoración →](./04-valoracion-economica.md)
