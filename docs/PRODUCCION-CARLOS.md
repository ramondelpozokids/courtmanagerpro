# Modo producción — Carlos / Real Madrid

CourtManager Pro tiene **dos modos**:

| Modo | Cuándo | Comportamiento |
|------|--------|----------------|
| **Producción** | Supabase configurado + `NEXT_PUBLIC_DEMO_MODE` ≠ `true` | Datos reales en PostgreSQL. Sin selector multi-club. Login Supabase obligatorio. |
| **Demo comercial** | Sin Supabase o `NEXT_PUBLIC_DEMO_MODE=true` | Multi-club (RMB, FCB, VBC…), datos en memoria/localStorage, login mock. |

---

## Pasos para activar producción (Carlos)

### 1. Supabase

1. Crear proyecto en [supabase.com](https://supabase.com).
2. Ejecutar en **SQL Editor**, en orden:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_seed_rmb_roster.sql` *(opcional si usas el script)*
   - `supabase/migrations/004_production_extensions.sql`

### 2. Variables locales

Copiar `.env.example` → `.env.local` y rellenar las claves del proyecto Supabase.

### 3. Seed de datos

```bash
npx tsx scripts/seed-production.ts
```

Carga: equipo RMB, plantilla, cuerpo técnico e inventario base.

### 4. Usuario Carlos

En Supabase → **Authentication → Users** → crear `charlie-r-k@hotmail.com`.

Luego en SQL Editor (sustituir `<UUID-CARLOS>` por el id real):

```sql
INSERT INTO profiles (id, email, full_name, role, department, is_active)
VALUES ('<UUID-CARLOS>', 'charlie-r-k@hotmail.com', 'Carlos Rodriguez Kobe', 'equipment_manager', 'Utilería Principal', true)
ON CONFLICT (id) DO UPDATE SET role = 'equipment_manager';

INSERT INTO user_teams (user_id, team_id, role, is_active)
VALUES ('<UUID-CARLOS>', '00000000-0000-4000-8000-000acb123456', 'equipment_manager', true);
```

### 5. Vercel

En **Environment Variables** del proyecto:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- **No** definir `NEXT_PUBLIC_DEMO_MODE` (o poner `false`)

Redeploy.

### 6. Login

Carlos entra en `/login` con su email y contraseña de Supabase Auth.

### 7. Superadmin Ramón

En producción **no** vale la contraseña demo `superadmin2026`. Ramón debe existir en Supabase Auth.

**Opción A — script (recomendado):**

```bash
npx tsx scripts/setup-superadmin.ts --password "TuContraseñaSegura"
```

**Opción B — manual:**

1. Supabase → **Authentication → Users** → crear `info@ramondelpozorott.es`
2. Ejecutar `supabase/migrations/006_vincular_superadmin_ramon.sql` (sustituir `<UUID-RAMON>`)

Ramón entra en `/login` con su email y la contraseña de Supabase. El rol **superadmin** se reconoce por email aunque en SQL el perfil sea `admin`.

---

## Qué funciona en producción

- Jugadores, inventario, solicitudes (Supabase)
- Tallas jugadores + staff (Supabase + API staff)
- Lavandería (Supabase)
- Escáner QR (API → `garment_units` + inventario)
- Informes CSV
- **Sin** Stripe (cobro SaaS pendiente)
- **Sin** selector demo multi-club en el dashboard

## Demo comercial

Para presentaciones a inversores con 4 clubes: en Vercel preview o local, usar `NEXT_PUBLIC_DEMO_MODE=true`.

La ruta `/demo` sigue disponible como landing comercial.
