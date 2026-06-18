# 05 — Monetización: Stripe y Planes SaaS

## Pasarela recomendada

**Stripe Billing** o **Paddle** — estándar industria SaaS B2B.

### Integración con Next.js

1. Crear productos/precios en Stripe Dashboard
2. Checkout Session al registrarse un club
3. Webhooks (`/api/webhooks/stripe`):
   - `invoice.paid` → activar club
   - `invoice.payment_failed` → suspender acceso admin
   - `customer.subscription.deleted` → downgrade

4. Campo `subscription_status` en tabla `teams` o `profiles`

## Automatización

Nuevo club (ej. Baskonia) → introduce tarjeta → cobro mensual automático → si falla pago, CourtManager suspende módulos de administración de utilería.

## Planes propuestos

| Plan | Cliente | Precio/mes | Incluye |
|------|---------|------------|---------|
| **Amateur / Cantera** | Escuelas, ligas municipales | **€49** | 15 jugadores, inventario básico, solicitudes |
| **Pro (ACB / LEB Oro)** | Equipos profesionales | **€299–499** | Ilimitado, viajes, QR, lavandería, WhatsApp soporte |
| **Elite (Euroliga / Enterprise)** | Multisección, máxima élite | **€1.500–3.500** | BD dedicada, RLS estricto, soporte Ramón+Carlos, IoT básculas |

## Por qué estos precios funcionan

Los clubes pierden **€15.000–30.000/año** en material extraviado. Un software que lo reduce a ~cero justifica €299–499/mes fácilmente.

## Infraestructura vs ingresos

- 100 clubes Pro × €299 = **€29.900 MRR**
- Coste Vercel + Supabase ~**€50/mes** a esa escala
- **Margen neto >90%** típico SaaS vertical
