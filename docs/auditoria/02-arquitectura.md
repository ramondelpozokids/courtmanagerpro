# 02 — Arquitectura y Diseño de Software

## Principio general

El proyecto sigue **Clean Architecture** con separación en cuatro capas bajo `src/`:

```
src/
├── domain/           # Entidades y contratos (sin dependencias externas)
├── application/      # Casos de uso
├── infrastructure/   # Supabase, repositorios, storage
├── app/              # Next.js App Router (páginas + API)
├── components/       # UI React
├── hooks/            # Lógica de cliente reutilizable
├── contexts/         # Auth, notificaciones, estado global UI
├── lib/              # DI, utilidades, validadores
└── types/            # Tipos TypeScript alineados con la BD
```

---

## Capa de dominio

### Entidades (`src/domain/entities/`)

| Archivo | Descripción |
|---------|-------------|
| `Player.ts` | Jugador y tallajes |
| `InventoryItem.ts` | Artículo de utilería |
| `Request.ts` | Solicitud de material |
| `Trip.ts` | Viaje y lista de equipaje |
| `LaundryBatch.ts` | Lote de lavandería |
| `MedicalItem.ts` | Material médico |
| `Alert.ts` | Alerta del sistema |

### Repositorios (interfaces)

| Interface | Métodos principales |
|-----------|---------------------|
| `IPlayerRepository` | getById, getAll, create, update, delete |
| `IInventoryRepository` | getById, getAll, getByCategory, updateStock, CRUD |
| `IRequestRepository` | getById, getAll, getByPlayerId, updateStatus, create |
| `ITripRepository` | getById, getAll, create, update, updatePackingItem *(sin implementación)* |

---

## Capa de aplicación (`src/application/`)

| Módulo | Casos de uso |
|--------|--------------|
| `players/` | `CreatePlayer`, `UpdatePlayer`, `GetPlayerProfile` |
| `inventory/` | `UpdateStock` |
| `requests/` | `CreateRequest`, `ApproveRequest` |

**Inyección de dependencias:** `src/lib/di.ts` conecta repositorios con casos de uso (solo jugadores, inventario y solicitudes).

---

## Capa de infraestructura

### Supabase

| Archivo | Uso |
|---------|-----|
| `infrastructure/supabase/client.ts` | Cliente navegador (singleton) |
| `infrastructure/supabase/server.ts` | Cliente servidor + admin (service role) |

Variables sanitizadas (trim + eliminación de comillas perimetrales).

### Repositorios concretos

| Clase | Fuente de datos |
|-------|-----------------|
| `InMemoryDB.ts` | Singleton mock con datos RM 2025/26 |
| `SupabaseInventoryRepository` | Mock o Supabase según env |
| `SupabasePlayerRepository` | Solo InMemoryDB |
| `SupabaseRequestRepository` | Solo InMemoryDB |
| `SupabaseInventoryRepositoryReal` | Solo Supabase *(no cableado en DI)* |

---

## Capa de presentación

### Layout raíz (`src/app/layout.tsx`)

```
AuthProvider → AppProvider → NotificationProvider → AppShell → {children}
```

### Rutas de página

| Ruta | Módulo |
|------|--------|
| `/` | Dashboard |
| `/players`, `/players/[id]` | Jugadores |
| `/inventory`, `/inventory/scanner` | Inventario + QR |
| `/sizing` | Tabla de tallas |
| `/requests` | Solicitudes |
| `/trips` | Viajes |
| `/laundry` | Lavandería |
| `/medical` | Material médico |
| `/reports` | Informes |
| `/alerts` | Alertas |
| `/blog`, `/blog/noticias` | Contenido editorial |

### Componentes clave

- **Layout:** `Sidebar`, `TopBar`, `MobileNav`, `AppShell`
- **Dashboard:** `KPICard`, `AlertsWidget`, `ActivityFeed`, `QuickActions`
- **Shared:** `ChatAssistant`, `ToastContainer`, `DataTable`

---

## APIs REST (`src/app/api/`)

| Endpoint | Métodos | Backend |
|----------|---------|---------|
| `/api/players`, `/api/players/[id]` | GET, POST, PUT, DELETE | Supabase |
| `/api/inventory`, `/api/inventory/[id]`, `/api/inventory/scan` | GET, POST, PUT, DELETE | Supabase |
| `/api/requests` | GET, POST | Supabase |
| `/api/alerts` | GET, PATCH, POST | Supabase |
| `/api/reports/dashboard` | GET | Supabase RPC |
| `/api/trips` | GET, POST | InMemoryDB |
| `/api/laundry` | GET, POST | InMemoryDB |
| `/api/medical` | GET, POST | InMemoryDB |
| `/api/coaching-staff` | GET | InMemoryDB |

---

## Dependencias principales

```json
{
  "next": "^15.0.3",
  "react": "^19.0.0",
  "@supabase/ssr": "^0.5.2",
  "@supabase/supabase-js": "^2.46.1",
  "zod": "^3.23.8",
  "tailwindcss": "^3.4.15",
  "jsbarcode": "^3.11.6",
  "qrcode": "^1.5.4"
}
```

---

## Observaciones de arquitectura

1. **Duplicidad mock/live:** La lógica `isMockMode` se repite en hooks y repositorios; candidata a centralizar en un módulo `config/env.ts`.
2. **ITripRepository sin implementar:** Viajes no pasan por capa de dominio en la práctica.
3. **Blog estático:** Sin API ni capa de datos; contenido hardcodeado en JSX.
4. **Carpeta anidada `Desktop/courtmanager-pro/`:** Copia duplicada dentro del repo; conviene eliminarla en una limpieza futura.

---

[← Resumen ejecutivo](./01-resumen-ejecutivo.md) · [Índice](./README.md) · [Siguiente: Seguridad →](./03-seguridad-rls.md)
