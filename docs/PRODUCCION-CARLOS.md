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
   - `supabase/migrations/005_webauthn_passkeys.sql` *(huella / Face ID)*
   - `supabase/migrations/007_webauthn_challenges.sql` *(obligatorio en Vercel)*

### 2. Variables locales

Copiar `.env.example` → `.env.local` y rellenar las claves del proyecto Supabase.

### 3. Seed de datos

```bash
npx tsx scripts/seed-production.ts
```

Carga: equipo RMB, plantilla, cuerpo técnico e inventario base.

### 4. Usuario Carlos

**Credenciales producción:**

| Campo | Valor |
|-------|--------|
| Email | `charlie-r-k@hotmail.com` |
| Contraseña | `utileria2026` |

**Script (recomendado):**

```bash
npm run setup:carlos
# o: npx tsx scripts/setup-carlos.ts --password "utileria2026"
```

Crea o actualiza el usuario en Supabase Auth, perfil y vínculo al equipo RMB.

**Manual:** Supabase → **Authentication → Users** → crear `charlie-r-k@hotmail.com` con contraseña `utileria2026`.

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

En producción Ramón entra con:

| Campo | Valor |
|-------|--------|
| **Email** | `info@ramondelpozorott.es` |
| **Contraseña** | `Benutzer555` |

Para resetear en Supabase: `npx tsx scripts/setup-superadmin.ts --password "Benutzer555"`

**Opción A — script (recomendado):**

```bash
npx tsx scripts/setup-superadmin.ts --password "TuContraseñaSegura"
```

**Opción B — manual:**

1. Supabase → **Authentication → Users** → crear `info@ramondelpozorott.es`
2. Ejecutar `supabase/migrations/006_vincular_superadmin_ramon.sql` (sustituir `<UUID-RAMON>`)

Ramón entra en `/login` con su email y la contraseña de Supabase. El rol **superadmin** se reconoce por email aunque en SQL el perfil sea `admin`.

**Acceso total de Ramón (superadmin):**
- Todos los módulos (médico, informes, inventario, etc.) sin restricciones
- Selector de **4 clubes** en el banner: RMB (producción real), FCB, FBAT, VBC (demos comerciales)
- Edición de estadísticas de proyecto y configuración
- Mismo nivel operativo que Carlos, más demos multi-club

Debe entrar con **`info@ramondelpozorott.es`** (no otro email).

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
