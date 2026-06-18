# 06 — Inventario de Módulos Funcionales

Detalle de cada área funcional: páginas, hooks, APIs, datos y estado mock/live.

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| 🟢 | Conectado a Supabase en modo live |
| 🟡 | Híbrido (mock o Supabase según env) |
| 🔵 | Solo InMemoryDB (demo) |
| ⚪ | Contenido estático (sin BD) |

---

## Dashboard (`/`)

| Elemento | Detalle |
|----------|---------|
| Página | `src/app/(dashboard)/page.tsx` |
| Datos | `usePlayers`, `useInventory`, `useRequests`, `useTrips`, `useAuth` |
| Widgets | `AlertsWidget`, `ActivityFeed`, `QuickActions`, `KPICard` |
| Contenido | Hero RMB, portal editorial (tabs equipación/historia/palmarés) |
| Fuente | 🟡🟡🟡🔵 mixto |

---

## Jugadores (`/players`, `/players/[id]`)

| Elemento | Detalle |
|----------|---------|
| Páginas | `players/page.tsx`, `players/[id]/page.tsx` |
| Hook | `usePlayers.ts` — 🟡 mock/live |
| API | `/api/players`, `/api/players/[id]` — 🟢 Supabase + auth |
| Dominio | `Player`, `IPlayerRepository`, `CreatePlayer`, `UpdatePlayer` |
| Repo | `SupabasePlayerRepository` — 🔵 solo InMemory en práctica |
| UI | `PlayerCard`, `PlayerForm`, `PlayerSizeChart` |
| Mock data | Plantilla RM 2025/26 completa (Campazzo, Tavares, Llull, etc.) |

---

## Inventario (`/inventory`, `/inventory/scanner`)

| Elemento | Detalle |
|----------|---------|
| Páginas | `inventory/page.tsx`, `inventory/scanner/page.tsx` |
| Hooks | `useInventory.ts`, `useQRScanner.ts` |
| API | `/api/inventory`, `/api/inventory/[id]`, `/api/inventory/scan` |
| Dominio | `InventoryItem`, `IInventoryRepository`, `UpdateStock` |
| Repo | `SupabaseInventoryRepository` — 🟡 mock o Supabase |
| UI | `ItemForm`, `QRScanner`, `BarcodeGenerator`, `StockBadge` |
| Features | Filtros, paginación, escaneo QR/código de barras |

---

## Tabla de tallas (`/sizing`)

| Elemento | Detalle |
|----------|---------|
| Página | `sizing/page.tsx` |
| Datos | Lectura/escritura directa en `InMemoryDB.players` y `coachingStaff` |
| API | `/api/coaching-staff` — 🔵 |
| UI | `PlayerSizeChart` |
| Nota | Sin hook dedicado ni capa application |

---

## Solicitudes (`/requests`)

| Elemento | Detalle |
|----------|---------|
| Página | `requests/page.tsx` |
| Hook | `useRequests.ts` — 🟡 |
| API | `/api/requests` — 🟢 |
| Dominio | `Request`, `IRequestRepository`, `CreateRequest`, `ApproveRequest` |
| UI | `RequestForm`, `StatusTimeline` |
| Estados | pendiente, aprobada, completada, rechazada |

---

## Viajes (`/trips`)

| Elemento | Detalle |
|----------|---------|
| Página | `trips/page.tsx` |
| Hook | `useTrips.ts` → fetch `/api/trips` |
| API | `/api/trips` GET/POST — 🔵 |
| Dominio | `Trip`, `ITripRepository` *(sin impl.)* |
| Mock | Málaga vs Unicaja, Atenas vs Panathinaikos con packing lists |
| Nota | Pendiente migración a Supabase (`trips`, `trip_items` en schema) |

---

## Lavandería (`/laundry`)

| Elemento | Detalle |
|----------|---------|
| Página | `laundry/page.tsx` |
| Hook | `useLaundry.ts` → `/api/laundry` |
| API | `/api/laundry` — 🔵 |
| Dominio | `LaundryBatch` entity only |
| Mock | 3 lotes demo (WASHING, READY, PENDING) |

---

## Material médico (`/medical`)

| Elemento | Detalle |
|----------|---------|
| Página | `medical/page.tsx` |
| Hook | `useMedical.ts` → `/api/medical` |
| API | `/api/medical` — 🔵 |
| Acceso | Restringido en sidebar (admin, equipment_manager, medical) |
| Schema BD | `medical_items`, `medical_usage` + trigger caducidad |

---

## Alertas (`/alerts`)

| Elemento | Detalle |
|----------|---------|
| Página | `alerts/page.tsx` |
| Hook | `useAlerts.ts` — 🟡 + Realtime Supabase |
| API | `/api/alerts` — 🟢 |
| Widget | `AlertsWidget` en dashboard |
| Usado en | TopBar, Sidebar, AlertsWidget, alerts page |
| Fix | Canal Realtime único por instancia (9704d4c8) |

---

## Informes (`/reports`)

| Elemento | Detalle |
|----------|---------|
| Página | `reports/page.tsx` |
| Hook | `useReports.ts` — 🟡 mock stats o RPC live |
| API | `/api/reports/dashboard` → `get_dashboard_stats(p_team_id)` |
| Acceso | Sidebar: admin, equipment_manager |

---

## Blog (`/blog`, `/blog/noticias`)

| Elemento | Detalle |
|----------|---------|
| Páginas | Contenido estático JSX |
| Datos | ⚪ Sin BD |
| Contenido | Historia década dorada, noticias, palmarés 2021-2030 |
| Enlaces | TopBar → Blog dropdown |

---

## Asistente IA (`ChatAssistant`)

| Elemento | Detalle |
|----------|---------|
| Componente | `src/components/shared/ChatAssistant.tsx` |
| Datos | 🔵 `InMemoryDB` (cumpleaños, tallas, viajes, stock) |
| Tipo | Reglas por palabras clave (no LLM externo) |

---

## Mapa mock vs live (resumen)

```
                    MOCK          LIVE (Supabase)
Auth                ✓             ✓
Players hook        ✓             ✓
Inventory hook      ✓             ✓
Requests hook       ✓             ✓
Alerts hook         ✓             ✓
Reports hook        ✓             ✓ (RPC)
Trips API           ✓ only        —
Laundry API         ✓ only        —
Medical API         ✓ only        —
Coaching staff API  ✓ only        —
Blog                static        static
```

---

## Roadmap técnico sugerido

1. Migrar `/api/trips`, `/api/laundry`, `/api/medical` a Supabase
2. Implementar `ITripRepository` con Supabase
3. Centralizar `isMockMode` en un módulo de configuración
4. Auth en middleware para rutas dashboard en producción
5. Eliminar carpeta duplicada `Desktop/courtmanager-pro/` del repo
6. Tests E2E para flujos críticos (login, inventario, solicitudes)

---

[← Despliegue](./05-despliegue-vercel-supabase.md) · [Índice](./README.md)
