# CourtManager Pro — Guía de Despliegue Técnico (ACB SaaS)

Este documento detalla las directrices y pasos necesarios para desplegar **CourtManager Pro** en producción.

---

## 1. Conexión a la Base de Datos (Supabase PostgreSQL 15)

1. Crea un proyecto en el panel oficial de [Supabase](https://supabase.com).
2. Dirígete a la pestaña **SQL Editor** y ejecuta las consultas contenidas en `supabase/migrations/001_initial_schema.sql` para crear las tablas, relaciones, enums, índices y funciones PostgreSQL personalizadas.
3. Configura las variables de entorno en tu servidor Next.js.

## 2. Variables de Entorno (`.env.local`)

Crea un archivo `.env.local` en la raíz de tu proyecto para conectar los clientes del servidor y navegador:

```bash
# Supabase Config
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PWA Config
NEXT_PUBLIC_APP_URL=https://courtmanager-pro.vercel.app
```

## 3. Despliegue en Vercel (Next.js 15 App Router)

La plataforma está optimizada para desplegarse con un solo clic en **Vercel**:

1. Sube el código fuente a tu repositorio de GitHub / GitLab.
2. Vincula el repositorio en tu panel de Vercel.
3. Vercel detectará de manera automática que se trata de un proyecto Next.js 15, configurando las opciones de compilación y caching.
4. Introduce tus variables de entorno en la sección **Environment Variables** del proyecto.
5. Haz clic en **Deploy**. El compilador generará las rutas estáticas y dynamic endpoints correspondientes.
