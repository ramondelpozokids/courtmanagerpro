# 02 — Seguridad y Accesos por Rol

## Matriz de accesos

| Rol | Usuario | Acceso |
|-----|---------|--------|
| **Superadmin** | Ramón del Pozo Rott · `info@ramondelpozorott.es` | Bypass total — todo visible y editable |
| **Administrador utilería** | Carlos Rodriguez Kobe · `charlie-r-k@hotmail.com` | Inventario, tallas, solicitudes, informes, médico, alertas |
| **Utillero asistente** | Rol simulado | Operativa diaria sin superadmin |
| **Staff médico** | Rol simulado | Botiquines + alertas sanitarias |
| **Jugador** | Ej. Campazzo | Solo sus peticiones |
| **Invitado (consulta)** | `guest@realmadrid.com` | Solo lectura — sin editar, sin informes confidenciales |
| **Usuario nuevo / registrado** | Supabase Auth (modo live) | Según perfil en tabla `profiles` |

## Botones rápidos en TopBar

- **Ramón** → superadmin
- **Carlos** → admin / equipment_manager
- **Invitado** → consulta (solo lectura)
- **WhatsApp** → contacto directo Carlos (+34 637 23 71 00)

## Seguridad técnica

### Cliente (UI)
- Permisos en `src/lib/permissions.ts`
- Sidebar oculta `/medical` y `/reports` a invitados
- Invitado no puede añadir jugadores, borrar alertas ni editar inventario

### Servidor
- APIs `/api/players`, `/api/inventory`, etc. requieren sesión Supabase
- **Middleware actual:** no bloquea rutas (acceso abierto a URLs, datos protegidos en API)
- **RLS Supabase:** políticas en migración `002_rls_policies.sql`

### Recomendaciones futuras
1. Middleware que redirija a login si no hay sesión (modo producción estricto)
2. Auth en APIs de trips/laundry/medical (actualmente parcial)
3. Usuarios reales en Supabase con contraseñas `RamonSuperadmin2026!` / `CarlosKobe2026!`

## Modo demo vs producción

| | Demo | Producción Vercel |
|---|------|-------------------|
| Auth | Simulación por botones | Supabase Auth |
| Datos | InMemoryDB fallback | PostgreSQL |
| Contraseñas | Cualquier valor / botones | Credenciales reales en Supabase |
