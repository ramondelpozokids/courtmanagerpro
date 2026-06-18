# 05 — Despliegue (Vercel + Supabase)

## Requisitos previos

- Cuenta [GitHub](https://github.com) con el repo clonado
- Cuenta [Supabase](https://supabase.com)
- Cuenta [Vercel](https://vercel.com)

**Repositorio:** https://github.com/ramondelpozokids/courtmanagerpro  
**Producción actual:** https://courtmanagerpro.vercel.app

---

## PASO 1 — Base de datos Supabase

1. Crear proyecto **CourtManager Pro** en Supabase.
2. Copiar **Project URL** y **anon public key**.
3. En **SQL Editor**, ejecutar en orden:

| Orden | Archivo local |
|-------|---------------|
| 1 | `supabase/migrations/001_initial_schema.sql` |
| 2 | `supabase/migrations/002_rls_policies.sql` |

El schema crea 17 tablas, enums, índices, triggers de stock/alertas, función `get_dashboard_stats` y tabla `audit_log`.

---

## PASO 2 — Variables de entorno

### Local (`.env.local` en la raíz del proyecto)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://courtmanagerpro.vercel.app
```

### Vercel (Settings → Environment Variables)

| Variable | Entorno | Notas |
|----------|---------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | **Sin comillas** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development | Una sola línea |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Solo servidor |

> El código sanitiza espacios y comillas perimetrales automáticamente (`client.ts`, `server.ts`).

---

## PASO 3 — Desarrollo local

```powershell
cd C:\Users\X\Desktop\courtmanager-pro
npm install
npm run dev
```

Abrir http://localhost:3000

**Sin `.env.local`:** entra en modo mock con datos demo del Real Madrid.

---

## PASO 4 — Despliegue en Vercel

1. Vercel → **Add New** → **Project**
2. Importar repo `courtmanagerpro`
3. Framework: **Next.js** (auto-detectado)
4. Añadir variables de entorno (Paso 2)
5. **Deploy**

Cada push a `main` dispara deploy automático.

---

## PASO 5 — Git (subir cambios)

```powershell
cd C:\Users\X\Desktop\courtmanager-pro
git add .
git commit -m "describe el cambio"
git pull --rebase origin main
git push origin main
```

**Orden correcto:** `add` → `commit` → `pull --rebase` → `push`

---

## PASO 6 — Verificación post-deploy

| Comprobación | Cómo |
|--------------|------|
| Build OK | Vercel → Deployments → Ready |
| Web carga | Incógnito → courtmanagerpro.vercel.app |
| Sin errores JS | F12 → Console (vacía o solo warnings) |
| Supabase conectado | KPIs cargan desde BD (o 0 si vacía) |
| APIs | `/api/trips`, `/api/laundry` responden JSON |

---

## Problemas frecuentes

| Síntoma | Causa | Solución |
|---------|-------|----------|
| `Application error` (client) | Realtime alertas duplicado | Fix en `9704d4c8` — redeploy |
| KPIs en 0 | Supabase vacío | Insertar datos o quitar env vars (modo mock) |
| Push rechazado | Ramas divergidas | `git pull --rebase origin main` |
| `not a git repository` | Carpeta incorrecta | `cd C:\Users\X\Desktop\courtmanager-pro` |
| Untracked files block pull | Archivos locales vs GitHub | Mover a backup temporal |

---

## Scripts npm

| Comando | Uso |
|---------|-----|
| `npm run dev` | Servidor desarrollo |
| `npm run build` | Build producción |
| `npm run start` | Servir build local |
| `npm run lint` | ESLint |

---

[← Valoración](./04-valoracion-economica.md) · [Índice](./README.md) · [Siguiente: Módulos →](./06-inventario-modulos.md)
