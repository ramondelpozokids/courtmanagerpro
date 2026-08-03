# Modo producción — Carlos / club real

CourtManager Pro tiene **dos modos**:

| Modo | Cuándo | Comportamiento |
|------|--------|----------------|
| **Producción** | Supabase configurado + `NEXT_PUBLIC_DEMO_MODE` ≠ `true` | Datos reales en PostgreSQL. Sin selector multi-club. Login Supabase obligatorio. |
| **Demo comercial** | Sin Supabase o `NEXT_PUBLIC_DEMO_MODE=true` | Multi-club (RMB, FCB, VBC, ATM…), datos en memoria/localStorage, login mock. |

> **Seguridad:** este documento **no** incluye contraseñas. Las claves se definen solo en Supabase Auth / scripts locales / gestores de secretos. Nunca las subas a GitHub ni las envíes a Atleti Lab.

---

## Pasos para activar producción

### 1. Supabase

1. Crear proyecto en [supabase.com](https://supabase.com).
2. Ejecutar en **SQL Editor**, en orden las migraciones de `supabase/migrations/` (001 → …).

### 2. Variables locales

Copiar `.env.example` → `.env.local` y rellenar las claves del proyecto Supabase (nunca commit).

### 3. Seed de datos

```bash
npx tsx scripts/seed-production.ts
```

### 4. Usuario operativo (Carlos)

| Campo | Valor |
|-------|--------|
| Email | `charlie-r-k@hotmail.com` |
| Contraseña | Definir con el script o en Supabase Auth (mín. 10 caracteres, letras + números) |

```bash
npm run setup:carlos
# o: npx tsx scripts/setup-carlos.ts --password "<TU_PASSWORD_SEGURA>"
```

### 5. Vercel

Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `CRON_SECRET` (obligatorio para crons)
- **No** definir `NEXT_PUBLIC_DEMO_MODE` (o `false`)

Redeploy.

### 6. Login

Entrar en `/login` con el email y la contraseña de Supabase Auth (no usar credenciales de demo).

### 7. Superadmin Ramón

| Campo | Valor |
|-------|--------|
| **Email** | `info@ramondelpozorott.es` |
| **Contraseña** | Definir solo en Supabase / script local |

```bash
npx tsx scripts/setup-superadmin.ts --password "<TU_PASSWORD_SEGURA>"
```

El rol **superadmin** se reconoce por email. No compartir la contraseña en documentos, correo ni repositorio.

---

## Qué funciona en producción

- Jugadores, inventario, solicitudes (Supabase)
- Tallas jugadores + staff
- Lavandería, médico (tenants live)
- Escáner QR
- Informes CSV/PDF
- Passkeys / WebAuthn en cuentas configuradas
- **Sin** selector demo multi-club en el dashboard de producción

## Demo comercial

Para presentaciones: `NEXT_PUBLIC_DEMO_MODE=true` (solo en preview / entorno controlado).

La ruta `/demo` es landing comercial; **no** da acceso al dashboard sin autenticación.
