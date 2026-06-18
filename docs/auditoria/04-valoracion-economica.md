# 04 — Valoración Económica y de Mercado

## Contexto

**CourtManager Pro** es un SaaS vertical para gestión de utilería en clubes de baloncesto profesional. El modelo de referencia es el **Real Madrid Baloncesto** (ACB / Euroliga, temporada 2025/2026).

---

## A. Coste de desarrollo de reemplazo

Estimación para reproducir el MVP actual con una agencia boutique en España/Europa:

| Perfil | Horas | €/h | Total (€) |
|--------|------:|----:|----------:|
| SaaS Architect / Lead Dev | 120 | 85 | 10.200 |
| Frontend Engineer (Next.js/TS) | 180 | 65 | 11.700 |
| Backend / Database (Supabase) | 90 | 70 | 5.850 |
| UI/UX Premium Designer | 80 | 60 | 5.200 |
| QA Manual y automatizado | 60 | 50 | 3.600 |
| Product Manager / DevOps | 70 | 70 | 4.900 |
| Contingencia y licencias | — | — | 3.500 |
| **TOTAL MVP** | **600 h** | — | **~44.950 €** |

---

## B. Valor de adquisición en mercado

### Licencia enterprise (club único)

Desarrollo llave en mano para un club de primer nivel (RM, Barça, Efes, Milán):

**Rango:** 60.000 € – 85.000 €

Incluye típicamente:
- Despliegue producción
- Migración de datos
- Formación de utilleros
- Soporte primer año

### Modelo SaaS por suscripción (multiclub)

| Plan | Precio/mes/club | Incluye |
|------|----------------:|---------|
| Pro | 450 € | Core: inventario, jugadores, solicitudes |
| Elite | 1.500 – 3.000 € | Euroliga: IoT básculas, RFID, soporte 24/7 |

**Mercado objetivo:** Liga Endesa, Eurocup, Basketball Champions League.

---

## C. Activos intangibles incluidos

| Activo | Valor estratégico |
|--------|-------------------|
| Arquitectura Clean + TypeScript | Mantenibilidad, escalabilidad |
| Schema PostgreSQL completo | 17 tablas, triggers, RLS |
| Modo demo (InMemoryDB) | Ventas y demos sin infra |
| UI premium RMB | Diferenciación visual |
| Documentación de auditoría | Due diligence acelerada |
| PWA offline (parcial) | Operación en pabellón |

---

## D. Riesgos que afectan la valoración

| Riesgo | Impacto |
|--------|---------|
| Módulos aún en InMemoryDB | -15% valor producción |
| Auth no enforced en middleware | -10% seguridad enterprise |
| Datos demo con nombres reales RM | Riesgo legal de imagen |
| Sin tests automatizados | -10% mantenibilidad |

---

## E. Conclusión de valoración

| Metodología | Rango |
|-------------|-------|
| Coste de reemplazo | ~45.000 € |
| Licencia exclusiva club | 60.000 – 85.000 € |
| ARR potencial (10 clubs Elite) | 180.000 – 360.000 €/año |

---

*Auditoría elaborada el 18 de junio de 2026. Todos los derechos reservados para Ramón del Pozo Rott y Carlos Rodriguez Kobe.*

---

[← Seguridad](./03-seguridad-rls.md) · [Índice](./README.md) · [Siguiente: Despliegue →](./05-despliegue-vercel-supabase.md)
