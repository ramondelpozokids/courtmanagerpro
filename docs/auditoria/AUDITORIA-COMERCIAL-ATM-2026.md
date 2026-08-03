# Auditoría comercial y técnica orientada a cliente  
## CourtManager Pro → Atlético de Madrid (ATM / Atleti Lab)

| Campo | Valor |
|-------|--------|
| **Pregunta central** | ¿Por qué un área operativa de ATM debería implantar CourtManager Pro? |
| **Fecha** | 3 de agosto de 2026 |
| **Enfoque** | Valor de negocio, operativa y seguridad — no auditoría de código para desarrolladores |
| **Base** | Inventario del repositorio `courtmanager-pro` (código, migraciones SQL, documentación comercial) |
| **Destinatarios** | Dirección, innovación (Atleti Lab), utillería, operaciones y responsables de seguridad/datos |

---

### Criterio de evidencias

- **Hecho:** verificado en el código, esquema de datos o documentación del proyecto.
- **Parcial:** existe funcionalidad o UI, pero la persistencia o el alcance aún no son completos en todos los entornos.
- **No encontrado:** no hay implementación verificable; se indica explícitamente.
- **Recomendación:** propuesta constructiva, no presentada como capacidad actual.

---

# PARTE A — Inventario del proyecto (previo al informe)

Este inventario se elaboró **antes** de redactar los apartados comerciales. Evita afirmar capacidades no revisadas.

## A.1 Qué es el producto (hecho)

**CourtManager Pro** es una plataforma web de gestión de **utilería y operaciones de material** para clubes deportivos de élite (fútbol y baloncesto). No es un gestor judicial ni un ERP genérico: está pensada para el día a día de utilleros, staff técnico, médico y responsables de almacén.

Para **ATM** existe un pack de datos y sincronización específico del **primer equipo de fútbol** (plantilla, calendario, tienda oficial, cuerpo técnico), además de material comercial dirigido a **Atleti Lab**.

## A.2 Tecnologías

| Capa | Tecnología (evidencia) |
|------|-------------------------|
| Interfaz | React 19, Next.js 15 (App Router), Tailwind CSS |
| Lenguaje | TypeScript 5.4 |
| API | Route Handlers en `src/app/api/*` |
| Datos | Supabase (PostgreSQL) + modo demo en memoria |
| Auth | Supabase Auth + WebAuthn/passkeys (`@simplewebauthn/*`) |
| Validación | Zod |
| Despliegue | Vercel (`vercel.json`, crons diarios) |
| Exportación | CSV (`csv-export`), PDF (`jspdf`) |
| Escaneo | QR / código de barras (`qrcode`, `jsbarcode`, `@zxing/browser`) |
| IA (inventario documental) | Gemini (`GEMINI_API_KEY`) |
| Correo | Resend o SMTP (alertas de cumpleaños) |

## A.3 Arquitectura lógica

```
domain/          → entidades y contratos
application/     → casos de uso (jugadores, inventario, solicitudes, sync plantilla/calendario, cumpleaños, import documental)
infrastructure/  → Supabase, repositorios, almacenamiento
app/             → páginas + APIs
components/      → interfaz
modules/         → Equipo de Utillería, Tienda oficial
lib/             → permisos, auth de rutas, seguridad HTTP auxiliar
supabase/migrations/ → esquema, RLS, seeds ATM/RMB/RMF (38 migraciones SQL)
```

**Modos de operación** (`src/lib/app-mode.ts`):

| Modo | Condición | Comportamiento |
|------|-----------|----------------|
| **Producción** | Supabase real y `NEXT_PUBLIC_DEMO_MODE` ≠ `true` | Datos del club en PostgreSQL; login obligatorio |
| **Demo comercial** | Sin Supabase o `DEMO_MODE=true` | Multi-club (ATM, RMB, RMF, FCB, VBC); datos demo |

**Tenants con datos de producción previstos** (`src/lib/club-team-ids.ts`): Real Madrid Baloncesto, Real Madrid Fútbol y **Atlético de Madrid (ATM)**.

## A.4 Módulos funcionales inventariados

### Núcleo operativo (navegación lateral)

| Módulo | Ruta | Madurez observada |
|--------|------|-------------------|
| Dashboard | `/` | KPIs, alertas, acciones rápidas |
| Jugadores / staff | `/players`, `/players/staff` | Plantilla + fichas; API `/api/players` |
| Tabla de tallas | `/sizing` | Tallas multi-producto |
| Inventario | `/inventory`, scanner, update | Stock, QR, importación por documento (IA) |
| Equipo de Utillería | `/equipment-team` | Hub: miembros, tareas, notas, avisos, historial, informes |
| Solicitudes | `/requests` | Flujo pendiente → aprobada → completada / rechazada |
| Material médico | `/medical` | Stock, caducidades, botiquines; acceso por rol |
| Informes | `/reports` | Estadísticas + exportación |
| Alertas | `/alerts` | Stock bajo, caducidad, solicitudes; Realtime en live |
| Almacén general | `/almacen` | Visión valorada (€), secciones, ubicaciones, PDF/CSV |
| Movimientos | `/movimientos` | Historial de entradas/salidas (`stock_movements`) |
| Checklist pre-partido | `/prepartido` | Packing + checks; estado en `localStorage` (parcial) |

### Servicios (menú superior)

| Módulo | Ruta | Nota de madurez |
|--------|------|-----------------|
| Viajes logísticos | `/trips` | Packing lists; BD en producción para tenants live |
| Lavandería | `/laundry` | Lotes; API conectada a Supabase en producción |
| Transporte y equipaje | `/transporte` | Checklist por autobús; estado local + PDF |
| Convocatoria | `/convocatoria` | Selección plantilla + kit; `localStorage` |
| Post-partido | `/postpartido` | Operativa post-partido |
| Botas personales | `/botas` | Seguimiento calzado |
| Incidencias | `/incidencias` | Registro de incidencias |
| Hotel / vestuario | `/hotel-vestuario` | Checklist hotel/vestuario |
| Repuestos | `/repuestos` | Material de repuesto |
| Caducidades / frío | `/caducidades-medico` | Control caducidad / cadena de frío |

### Plataforma / cumplimiento / demos

| Área | Evidencia |
|------|-----------|
| Login / registro / seguridad | `/(auth)/login`, `/registro`, `/seguridad` |
| Cuenta (cambio contraseña) | `/cuenta` |
| Páginas legales RGPD/LSSI | aviso legal, privacidad, protección datos, cookies, condiciones, mapa sitio |
| Landing demo | `/demo` |
| Blog editorial | `/blog` (contenido estático) |
| Asistente | `ChatAssistant` — reglas por palabras clave (no LLM externo) |
| Calendario | `/calendario` + sync oficial ATM |
| Tienda oficial | módulo `official-store` + URLs ATM |

## A.5 APIs REST inventariadas

`ai`, `alerts`, `auth` (+ WebAuthn), `birthdays`, `calendar`, `coaching-staff`, `equipment-team`, `inventory` (+ scan, document analyze/apply), `laundry`, `medical`, `players`, `reports`, `requests`, `roster`, `stock-movements`, `store`, `trips`, `warehouse`.

## A.6 Seguridad (inventario breve)

| Capacidad | Estado |
|-----------|--------|
| Middleware de sesión (páginas + APIs en producción) | Implementado |
| Auth en handlers (`requireApiUser`) | Implementado |
| RLS por equipo en PostgreSQL | Implementado (migraciones 002+) |
| Roles y permisos granulares | Implementado (`permissions.ts`) |
| Passkeys / WebAuthn | Implementado (cuentas biométricas configuradas) |
| Rate limit en login | Implementado (en memoria; best-effort en serverless) |
| Cabeceras HTTP (CSP, X-Frame-Options, etc.) | Implementado |
| `audit_log` + triggers stock/caducidad | En esquema SQL |
| Registro cerrado en producción | Implementado |
| Bloqueo clic derecho / F12 | Cosmético — **no es seguridad real** |
| Offline sync completo | **No encontrado** (solo detección online/offline) |
| Integración ERP/CRM/SSO corporativo (Azure AD, Okta…) | **No encontrado** como conector nativo |

## A.7 Integraciones

| Integración | Realidad en el proyecto |
|-------------|-------------------------|
| Web oficial ATM (plantilla) | Sync HTML → plantilla (`atleticoOfficial.ts`) |
| Calendario oficial ATM | Sync (`atleticoSource.ts`) |
| Tienda oficial ATM | Enlaces / estado de tienda |
| Crons Vercel | Plantilla 06:00, calendario 06:30, cumpleaños 06:05 |
| Gemini (OCR inventario) | Importación documental |
| Email (Resend/SMTP) | Cumpleaños a destinatarios fijos del proyecto |
| WhatsApp | Enlace operativo (contexto RMB en UI) |
| APIs REST propias | Base para futuras integraciones |

## A.8 Preparación específica ATM

- Datos: `src/data/clubs/atm-data.ts` (plantilla, tienda, patrocinadores, URLs oficiales).
- Seed producción: `supabase/migrations/020_seed_atm_production.sql` (+ migraciones médicas, staff, fotos, QR…).
- Material Atleti Lab: `docs/atleti-lab/` (dossier, vídeo, assets).
- Team ID ATM: `00000000-0000-4000-8000-000acb423458`.

---

# PARTE B — Informe comercial orientado a ATM

---

## 1. Qué es CourtManager Pro

### 1. Observaciones encontradas

CourtManager Pro es el **sistema operativo de utilería** de un club profesional: concentra plantilla, tallas, stock, solicitudes, viajes, lavandería, material médico, alertas y checklists de partido en una sola aplicación web accesible desde escritorio y móvil (PWA básica).

Su propósito es que el área de utillería y los perfiles autorizados sepan **qué hay, dónde está, a quién pertenece, qué falta y qué hay que preparar** antes de un entrenamiento o un partido — sin depender de hojas de cálculo dispersas, chats o memoria individual.

Está pensado para organizaciones deportivas de alto rendimiento (clubes de LaLiga / ACB y equivalentes). El uso diario típico de un utillero sería: revisar alertas → atender solicitudes → ajustar inventario (o escanear QR) → preparar checklist de viaje/partido → exportar informe si hace falta.

### 2. Evidencias

- Posicionamiento comercial y módulos: `docs/guia-app-comercial/01-funcionamiento-app.md`, `docs/auditoria/01-resumen-ejecutivo.md`, `docs/atleti-lab/README.md`.
- Navegación operativa: `src/components/layout/Sidebar.tsx`, `TopBar.tsx`.
- Pack ATM: `src/data/clubs/atm-data.ts`, migraciones `020_*` / `021_*` / `023_*`.

### 3. Beneficio para el cliente

Un responsable de ATM entiende en minutos **qué problema resuelve** el producto: ordenar la operativa de material del primer equipo con un único punto de verdad.

### 4. Nivel de madurez: **Muy bueno**

Producto comprensible, acotado al dominio y con pack ATM ya modelado.

### 5. Recomendaciones

En presentaciones a ATM, usar el lenguaje de “sistema de utilería y logística de material del primer equipo”, no “software genérico de gestión”.

---

## 2. Problemas actuales que resuelve

### 1. Observaciones encontradas

Sin una herramienta como CourtManager Pro, la operativa habitual en utilería de élite suele presentar:

| Problema habitual | Cómo lo aborda CourtManager Pro |
|-------------------|----------------------------------|
| Procesos manuales (Excel, WhatsApp, papel) | Flujos digitales: solicitudes con estados, checklists, inventario |
| Pérdida de información entre turnos | Datos centralizados por equipo; historial de movimientos |
| Errores humanos de stock / talla | Escaneo QR, tallas por jugador, alertas de stock mínimo |
| Documentos dispersos | Importación de inventario desde documento (IA) + almacén unificado |
| Falta de trazabilidad | `stock_movements`, `audit_log`, timeline de solicitudes |
| Duplicidad de trabajo | Sync de plantilla y calendario desde fuentes oficiales ATM |
| Tiempos muertos pre-partido | Checklist pre-partido, convocatoria, transporte, packing de viaje |
| Dificultad para localizar material | Ubicaciones en almacén, categorías, búsqueda |
| Falta de control por rol | Permisos: médico ≠ jugador ≠ utillero ≠ consulta |
| Poca seguridad en hojas compartidas | Auth, sesiones, RLS, registro cerrado |
| Ausencia de auditoría | Logs y triggers de alerta automática |

### 2. Evidencias

- Solicitudes y estados: dominio `Request`, API `/api/requests`.
- Movimientos: migración `019_stock_movements.sql`, página `/movimientos`.
- Sync oficial ATM: `application/roster-sync/sources/atleticoOfficial.ts`, `application/calendar-sync/atleticoSource.ts`.
- Alertas automáticas (stock/caducidad): triggers en `001_initial_schema.sql`.
- Checklists: `/prepartido`, `/transporte`, `/convocatoria`.

### 3. Beneficio para el cliente

Reduce dependencia de personas concretas (“solo lo sabe el utillero de turno”) y convierte la operativa en un proceso **repetible y auditable**.

### 4. Nivel de madurez: **Muy bueno** en núcleo (inventario, jugadores, solicitudes, alertas); **Bueno / Mejorable** en algunos servicios cuya persistencia sigue apoyada en `localStorage` (p. ej. convocatoria, parte del pre-partido).

### 5. Recomendaciones

Priorizar migrar checklists críticos (pre-partido, convocatoria, transporte) a base de datos compartida entre dispositivos y turnos, para eliminar el último residuo de “dato en un solo navegador”.

---

## 3. Beneficios para el cliente

### 1. Observaciones encontradas

| Beneficio | Explicación basada en el producto |
|-----------|-----------------------------------|
| **Ahorro de tiempo** | Menos búsquedas en hojas; sync automático de plantilla/calendario; escaneo frente a conteo manual |
| **Ahorro económico** | Almacén con valoración (€), control de stock mínimo y caducidades médicas → menos compras de urgencia y menos merma |
| **Reducción de errores** | Roles, validaciones Zod, flujos de aprobación, QR por artículo |
| **Productividad** | Un solo panel para utillería + servicios de partido |
| **Organización** | Equipo de Utillería (tareas, notas, avisos, historial) |
| **Control** | Informes, dashboard, movimientos |
| **Seguridad** | Tres capas reales en producción + passkeys en cuentas clave |
| **Cumplimiento** | Páginas y políticas RGPD/LSSI; segregación demo/producción |
| **Trazabilidad** | Quién movió stock, estado de solicitudes, audit_log |
| **Búsquedas rápidas** | Inventario, almacén, jugadores, búsqueda en equipo de utillería |
| **Escalabilidad** | Modelo multi-equipo en BD; ATM ya es un tenant definido |
| **Centralización** | Un sistema frente a silos Excel/chat/papel |

### 2. Evidencias

- Valoración almacén: `src/app/(dashboard)/almacen/page.tsx`, API `/api/warehouse`.
- Exportaciones: `src/lib/csv-export.ts`, `src/lib/pdf-export.ts`.
- Equipo utillería: `src/modules/equipment-team/`.
- Crons: `vercel.json`.

### 3. Beneficio para el cliente

Los beneficios son **operativos y medibles** (tiempo de preparación, roturas de stock, trazabilidad ante auditoría interna), no solo “digitalización” abstracta.

### 4. Nivel de madurez: **Muy bueno**

### 5. Recomendaciones

Definir con ATM 3–5 KPI de piloto (p. ej. tiempo medio de preparación de viaje, nº de roturas de stock, % solicitudes cerradas en plazo) para demostrar ROI en 4–8 semanas.

---

## 4. Seguridad

*(Apartado prioritario)*

### 1. Observaciones encontradas

#### Autenticación
- En producción: Supabase Auth (usuario/contraseña) con cookies de sesión.
- Passkeys / WebAuthn para cuentas biométricas configuradas (huella / Face ID).
- Login con **rate limiting** (12 intentos / 15 min por IP, best-effort).
- Registro público **cerrado** en producción (redirige a login).

#### Autorización, roles y control de acceso
Roles contemplados: `superadmin`, `admin`, `equipment_manager`, `assistant`, `medical`, `coach`, `player`, `consulta` (invitado solo lectura).

Ejemplos de segregación:
- Material médico: admin / equipment_manager / medical.
- Informes: admin / equipment_manager.
- Escritura de datos del club restringida frente a roles de solo lectura.
- Separación “operar el club” vs “modificar el producto” (`canModifyProject` solo superadmin).

#### Tres capas en producción (hecho documentado y contrastado en código)
1. **Middleware:** sin sesión → redirect o 401 en APIs; crons solo con `Bearer CRON_SECRET`.
2. **APIs:** `requireApiUser` / `requireProductionApiUser`.
3. **Base de datos:** Row Level Security — un usuario solo ve/escribe datos de equipos a los que pertenece.

#### Protección de datos y cumplimiento
- HTTPS en despliegue Vercel.
- Políticas legales: privacidad, protección de datos, cookies, aviso legal (RGPD / LOPDGDD / LSSI).
- Cabeceras: CSP, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy.
- Tabla `audit_log` y triggers de auditoría en cambios sensibles.
- Alertas automáticas de stock bajo y caducidad médica.

#### Lo que no debe venderse como seguridad
- El script que bloquea clic derecho / F12 es **disuasión cosmética** (el propio código lo declara).
- El rate limit en memoria no es un WAF corporativo multi-instancia.
- No se ha encontrado certificación ISO/SOC2 ni SSO corporativo nativo en el repositorio.

#### Copias de seguridad
- Dependen de la plataforma **Supabase** (backups del proveedor). No hay un módulo propio de backup/restore en la aplicación. **Hecho:** infraestructura cloud; **no encontrado:** panel de backup dentro de CourtManager.

### 2. Evidencias

- `src/middleware.ts`, `src/lib/supabase-route-auth.ts`, `src/lib/permissions.ts`, `src/lib/login-rate-limit.ts`.
- WebAuthn: `src/app/api/auth/webauthn/*`, migraciones `005`/`007`.
- RLS: `supabase/migrations/002_rls_policies.sql` (+ políticas en migraciones posteriores).
- HTTP: `next.config.js`.
- Legal: `src/content/legal.ts`.
- Declaración cosmético: `src/lib/securityLayers.ts`.
- Auditoría docs: `docs/auditoria/03-seguridad-rls.md`.

### 3. Beneficio para el cliente

ATM obtiene un modelo de acceso **alineado con un club profesional**: cada perfil ve lo necesario, el material médico no queda expuesto a roles indebidos, y hay rastro de cambios — requisito habitual en auditorías internas y en tratamientos RGPD.

### 4. Nivel de madurez: **Muy bueno** en diseño de capas y roles; **Bueno** en endurecimiento operativo (rate limit / backups dependen de plataforma).

### 5. Recomendaciones

1. Formalizar con ATM el inventario de roles reales del club (utillería, médico, viajes, dirección) y mapearlos 1:1.
2. Sustituir rate limit en memoria por solución edge/Redis si se exige nivel enterprise.
3. Documentar el régimen de backups de Supabase en el contrato de servicio.
4. Revisar `Permissions-Policy` (`camera=()`) frente al uso del escáner QR por cámara — posible fricción en móvil.
5. No presentar el bloqueo de DevTools como control de seguridad ante ATM.

---

## 5. Arquitectura (visión de negocio)

### 1. Observaciones encontradas

La arquitectura está pensada para **separar** lo estable (reglas de negocio: jugador, stock, solicitud) de lo cambiante (pantallas, proveedores cloud). Eso permite:

- **Mantener** el sistema sin reescribir todo al cambiar un módulo.
- **Escalar** a más usuarios vía Vercel + PostgreSQL gestionado.
- **Crecer** a nuevos equipos/secciones (el modelo `teams` / `user_teams` ya existe; ATM ya es un equipo).
- **Fiabilidad** relativa: despliegue managed, crons, auth del proveedor.
- **Inversión a largo plazo:** no es un monolito de hojas de cálculo; es una aplicación con dominio explícito y APIs.

Existe un modo demo comercial (multi-club) separado del modo producción: útil para Atleti Lab / demos controladas sin mezclar con datos reales.

### 2. Evidencias

- Capas: `src/domain`, `src/application`, `src/infrastructure`, `src/app`.
- Modos: `src/lib/app-mode.ts`, `docs/PRODUCCION-CARLOS.md`.
- Despliegue: `vercel.json`, `docs/auditoria/05-despliegue-vercel-supabase.md`.

### 3. Beneficio para el cliente

ATM no compra un “prototipo desechable”: compra una base **evolucionable** con aislamiento por equipo y camino claro a producción.

### 4. Nivel de madurez: **Muy bueno**

Algunos repositorios históricos aún reflejan evolución mock→live; el camino de producción está documentado y parcialmente cableado por APIs.

### 5. Recomendaciones

Acordar con ATM un entorno de **piloto** (producción ATM) separado del entorno demo multi-club usado en presentaciones.

---

## 6. Calidad del software (lenguaje cliente)

### 1. Observaciones encontradas

Desde la perspectiva de un comprador:

- El proyecto está **organizado por dominios** (jugadores, inventario, viajes…), no como una única pantalla caótica.
- Hay **módulos reutilizables** (Equipo de Utillería, Tienda oficial, componentes de UI).
- La **separación de responsabilidades** (quién puede escribir vs solo consultar; quién puede cambiar el producto) está codificada.
- Añadir funcionalidades nuevas es viable: ya se han añadido almacén, movimientos, pre-partido, sync ATM, WebAuthn, etc., sobre la base inicial.

Limitaciones honestas:
- No se ha encontrado una batería amplia de tests automatizados E2E en el inventario realizado.
- Parte de la operativa de partido persiste en el navegador (`localStorage`), lo que complica el trabajo multi-dispositivo hasta que se unifique en BD.

### 2. Evidencias

- Estructura `src/` y `modules/`.
- Casos de uso en `application/`.
- Evolución visible en ~38 migraciones SQL y expansión de rutas dashboard.

### 3. Beneficio para el cliente

Menor riesgo de “software frágil que nadie puede tocar”: hay orden, y el producto ha demostrado capacidad de crecer (fútbol ATM + baloncesto + servicios de partido).

### 4. Nivel de madurez: **Bueno** → **Muy bueno** en organización; **Mejorable** en automatización de pruebas.

### 5. Recomendaciones

Incluir en el plan de implantación ATM un paquete de pruebas de aceptación (login, inventario, solicitud, checklist partido, roles médico).

---

## 7. Experiencia de usuario

### 1. Observaciones encontradas

- Navegación clara: sidebar para el núcleo diario; menú “Servicios” para operativa de partido/viaje.
- Branding por club (logo, colores, liga) — en ATM, identidad del primer equipo.
- Acciones rápidas en dashboard; badges de alertas no leídas.
- Flujos orientados a utillero (Carlos Kobe como perfil operativo de referencia en docs).
- Exportación PDF/CSV en almacén, pre-partido, transporte.
- Mobile nav / PWA básica para uso en vestuario o almacén.
- Asistente por palabras clave (ayuda rápida; no sustituye formación formal).

### 2. Evidencias

- `Sidebar.tsx`, `TopBar.tsx`, `MobileNav.tsx`, dashboard components.
- Páginas de servicios y checklist con UI de “hecho / pendiente”.
- `docs/guia-app-comercial/01-funcionamiento-app.md`.

### 3. Beneficio para el cliente

Reduce curva de aprendizaje: el personal reconoce el flujo real de utilería. Eso **baja coste de formación** y acelera adopción frente a herramientas genéricas (ERP no deportivo).

### 4. Nivel de madurez: **Muy bueno**

### 5. Recomendaciones

Sesión de shadowing 1 día con utillería ATM para ajustar vocabulario (kits, ubicaciones, neveras) al argot interno del club.

---

## 8. Escalabilidad

### 1. Observaciones encontradas

| Dimensión | Capacidad observada |
|-----------|---------------------|
| Más usuarios | Modelo `profiles` + `user_teams`; auth gestionada |
| Más módulos | Ya se han añadido módulos sin romper el núcleo |
| Nuevas sedes / secciones | Almacén contempla secciones / categorías; equipos en BD |
| Nuevos departamentos | Roles medical, coach, etc. |
| Futuras integraciones | APIs REST + crons + sync web |

Límites actuales a comunicar con honestidad:
- Algunos módulos demuestran primero en UI/localStorage.
- El rate limit y ciertos stores en memoria no son el techo de un SaaS global masivo — sí son adecuados para un club / puñado de tenants.
- Escala horizontal “ilimitada” **no está demostrada** con pruebas de carga en el repositorio.

### 2. Evidencias

- `teams`, `user_teams`, multi-club demo, tenant ATM en producción prevista.
- APIs y crons existentes.

### 3. Beneficio para el cliente

ATM puede empezar por primer equipo y, si interesa, extender a filiales u otras secciones sin cambiar de producto de base.

### 4. Nivel de madurez: **Bueno**

### 5. Recomendaciones

Definir techo del piloto (nº usuarios concurrentes, nº artículos de inventario) y validarlo en el entorno Supabase del club.

---

## 9. Integraciones

### 1. Observaciones encontradas

**Preparado y en uso:**
- Fuentes web oficiales ATM (plantilla y calendario).
- Tienda oficial (enlaces / estado).
- Proveedores de IA (Gemini) para digitalizar inventarios documentales.
- Email transaccional (cumpleaños).
- Autenticación avanzada (WebAuthn) sobre Supabase Auth.
- API REST interna consumible por la propia UI (base para conectores).

**No encontrado como conector nativo:**
- ERP (SAP, Microsoft Dynamics…)
- CRM (Salesforce…)
- SSO corporativo (Azure AD / Okta) más allá de Supabase Auth
- Gestor documental enterprise (SharePoint, Documentum) como repositorio primario
- Servicios gubernamentales / sede electrónica

**Posibilidad real:** las APIs y el modelo de datos permiten encargar integraciones puntuales (p. ej. export nocturno a ERP de compras, o SSO vía proveedor de identidad compatible). Eso sería **proyecto de integración**, no una casilla ya marcada.

### 2. Evidencias

- Sync ATM, `vercel.json` crons, `.env.example` (Gemini, Resend, Supabase).
- `docs/API.md` (referencia de endpoints).
- Ausencia de SDKs ERP/CRM en `package.json`.

### 3. Beneficio para el cliente

ATM puede obtener valor **sin esperar a un gran proyecto de integración**. Las sincronizaciones con la web oficial ya atacan un dolor real (plantilla y calendario desactualizados).

### 4. Nivel de madurez: **Bueno** en integraciones deportivas propias; **Mejorable** en ecosistema enterprise genérico.

### 5. Recomendaciones

Si ATM exige SSO corporativo, planificar fase 2 sobre Supabase Auth / IdP del club. No comprometer ERP en la primera demo.

---

## 10. Valor estratégico para ATM / Atleti Lab

### 1. Observaciones encontradas

La pregunta “¿por qué ATM tendría interés?” se responde con evidencias del propio proyecto:

| Eje estratégico | Encaje con CourtManager Pro |
|-----------------|------------------------------|
| **Diferenciación** | Solución vertical de utilería élite, no un Excel maquillado |
| **Digitalización** | Sustituye procesos manuales del primer equipo |
| **Modernización** | QR, alertas, sync oficial, passkeys, exportación profesional |
| **Reducción de costes** | Menos urgencias de compra, menos pérdida de material, menos horas de re-trabajo |
| **Eficiencia operativa** | Checklists de partido/viaje + inventario unificado |
| **Ventaja competitiva** | Mejor preparación material = menos fricción el día de partido |
| **Calidad de servicio interno** | Staff (médico, coaches, utilleros) con información coherente |
| **Innovación (Atleti Lab)** | Caso real de producto listo para evaluar en entorno club; pack y dossier ya orientados a Atleti Lab |

“Ofrecer a sus clientes”: en sentido estricto, los **usuarios internos** del club (utillería, médico, operaciones) son los clientes del sistema. Atleti Lab puede además valorar CourtManager Pro como caso de **innovación aplicada a la operativa**, con potencial de referencia sectorial — sin afirmar que ATM deba convertirse en revendedor (eso **no está en el código**; sería decisión de negocio).

### 2. Evidencias

- `docs/atleti-lab/` (dossier y presentación).
- Pack y seeds ATM completos.
- Posicionamiento multi-club en demos (capacidad de contraste con otros clubes).

### 3. Beneficio para el cliente

ATM / Atleti Lab pueden presentar un proyecto de digitalización **con producto ya construido y adaptado al club**, reduciendo el riesgo típico de “empezar de cero”.

### 4. Nivel de madurez: **Muy bueno** (encaje estratégico); la decisión comercial es de ATM.

### 5. Recomendaciones

Enfoque Atleti Lab: piloto cerrado con utillería del primer equipo + informe de resultados a dirección, sin abrir multi-tenant demo en el entorno real.

---

## 11. Fortalezas (por importancia)

1. **Dominio real de utilería de élite** — cubre el ciclo completo (stock, tallas, solicitudes, viaje, partido, médico).
2. **Seguridad en tres capas + roles** — adecuado para datos sensibles de plantilla y material.
3. **Preparación específica ATM** — datos, sync oficial, seeds y material Atleti Lab.
4. **Trazabilidad operativa** — movimientos, alertas, audit_log, estados de solicitud.
5. **Arquitectura evolucionable** — capas claras, APIs, multi-equipo.
6. **Automatizaciones** — crons de plantilla/calendario/cumpleaños; importación IA de inventarios.
7. **UX orientada al utillero** — reduce formación y acelera adopción.
8. **Cumplimiento documental básico RGPD/LSSI** — páginas y segregación demo/producción.
9. **Exportación profesional** — PDF/CSV para dirección y almacén.
10. **Hub de Equipo de Utillería** — coordinación interna más allá del stock.

---

## 12. Riesgos (constructivo)

| Riesgo / debilidad | Impacto | Solución propuesta |
|--------------------|---------|-------------------|
| Checklists (pre-partido, convocatoria, transporte) en `localStorage` | Pérdida de continuidad entre dispositivos/turnos | Persistir en Supabase por `team_id` + usuario |
| Madurez desigual mock vs live en la historia del producto | Confusión si se demo en modo incorrecto | Piloto ATM solo en modo producción; checklist de go-live |
| Rate limit login en memoria | Menor eficacia anti-brute-force en multi-instancia | Redis / servicio edge |
| Sin tests E2E evidentes en inventario | Regresiones en implantación | Suite de aceptación ATM |
| Sin SSO/ERP nativo | Fricción con TI corporativa | Fase 2 de integración acordada |
| Backups solo vía proveedor | Dependencia de Supabase | SLA + procedimiento de restore documentado |
| `Permissions-Policy` sin cámara | Escáner QR por cámara puede fallar | Ajustar policy para rutas de escaneo |
| Asistente no es IA generativa | Expectativa inflada si se vende como “ChatGPT” | Presentarlo como ayuda por reglas |
| Documentación interna con credenciales de ejemplo | Riesgo si se comparte fuera de círculo de confianza | Rotar secretos; no adjuntar docs de setup en el paquete Atleti Lab |

---

## 13. Conclusión ejecutiva

**Dirigida a dirección general / Atleti Lab**

### ¿Merece la pena implantar CourtManager Pro?

**Sí, como piloto de utilería del primer equipo**, con el alcance centrado en inventario, tallas, solicitudes, alertas, almacén/movimientos y operativa de partido — áreas donde el repositorio muestra producto real y pack ATM ya construido.

### ¿Qué aporta frente a la situación actual?

Un **punto de verdad** para el material y la preparación de partidos/viajes, con sincronización respecto a fuentes oficiales del club, control por roles y rastro de cambios. Sustituye la fragmentación típica (Excel + mensajería + conocimiento individual).

### ¿Qué riesgos reduce?

- Errores de stock y tallaje.  
- Falta de trazabilidad ante incidencias.  
- Exposición indebida de información (p. ej. ámbito médico).  
- Desfase de plantilla/calendario.  
- Dependencia de una sola persona para “saber dónde está todo”.

### ¿Qué beneficios genera?

Tiempo de preparación, control económico del almacén, menos urgencias, mejor coordinación del equipo de utillería y una base digital alineada con la exigencia de un club de élite.

### ¿Por qué es una buena inversión?

Porque el coste de no ordenar la utilería se paga cada temporada en horas, mermas y estrés operativo el día de partido. CourtManager Pro **ya incorpora el lenguaje y los datos de ATM**; no parte de cero. Los riesgos residuales (persistencia de algunos checklists, SSO/ERP, pruebas) son **gestionables en un plan de implantación**, no invalidan el valor del núcleo.

**Veredicto final (basado solo en evidencias del proyecto):**  
CourtManager Pro es una solución **madura para demostrar y pilotar** en ATM, con seguridad y dominio sólidos, y con puntos de mejora claros y acotados. Es una inversión razonable si ATM busca digitalizar la utilería con un producto vertical, no con una herramienta genérica.

---

## Anexo — Mapa rápido de madurez por bloque

| Bloque | Madurez |
|--------|---------|
| 1. Qué es | Muy bueno |
| 2. Problemas que resuelve | Muy bueno (núcleo) / Bueno (algunos servicios) |
| 3. Beneficios | Muy bueno |
| 4. Seguridad | Muy bueno |
| 5. Arquitectura de negocio | Muy bueno |
| 6. Calidad / evolucionabilidad | Bueno |
| 7. Experiencia de usuario | Muy bueno |
| 8. Escalabilidad | Bueno |
| 9. Integraciones | Bueno (deportivas) / Mejorable (ERP-SSO) |
| 10. Valor estratégico ATM | Muy bueno |
| Producto global para piloto ATM | **Muy bueno** |
| Preparación ante pentest (ago 2026) | **Bueno → Muy bueno** (ver `PENTEST-READINESS-ATM.md`) |

---

## Actualización seguridad (3 ago 2026)

Tras el informe inicial se aplicó un paquete de endurecimiento orientado a pruebas de hacking / Atleti Lab. Detalle operativo: [`PENTEST-READINESS-ATM.md`](./PENTEST-READINESS-ATM.md).

**Corregido en código:** tokens fuera del JSON de login/WebAuthn; anti open-redirect; rate limit IP+email; anti-IDOR en APIs críticas; Zod anti mass-assignment; passwords mock fuera del bundle de producción; HSTS/COOP/CORP; sin passwords en docs de producción.

**Sigue siendo recomendación (no hecho):** Redis rate-limit, SSO, CSP sin `unsafe-eval`, pentest externo formal.

---

*Documento elaborado tras inventario del repositorio local. No incluye afirmaciones sobre certificaciones, contratos o integraciones no presentes en el proyecto. Las cifras de valoración económica de auditorías previas no se reutilizan aquí salvo como contexto histórico ajeno a este veredicto.*
