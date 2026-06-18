# CourtManager Pro — Documentación de APIs (Capa de Infraestructura)

Esta sección detalla las rutas REST implementadas en la plataforma SaaS **CourtManager Pro**, las cuales consumen directamente los casos de uso (Capa de Aplicación) a través del contenedor de Inyección de Dependencias (`src/lib/di.ts`).

---

## 1. Módulo de Jugadores (`/api/players`)

### `GET /api/players`
Obtiene la lista completa de fichas de jugadores profesionales registrados.
* **Respuesta (200 OK):**
```json
[
  {
    "id": "p1",
    "firstName": "Marcelinho",
    "lastName": "Huertas",
    "number": 9,
    "position": "PG",
    "status": "ACTIVE",
    "sizes": {
      "jersey": "L",
      "shorts": "L",
      "shoes": "44.5",
      "socks": "M",
      "warmupShirt": "L"
    },
    "nationality": "Brazil",
    "birthDate": "1983-05-25"
  }
]
```

### `POST /api/players`
Crea una nueva ficha técnica de jugador.
* **Cuerpo de la Petición (Request Body):**
```json
{
  "firstName": "Dzanan",
  "lastName": "Musa",
  "number": 31,
  "position": "SF",
  "status": "ACTIVE",
  "sizes": {
    "jersey": "XL",
    "shorts": "XL",
    "shoes": "48",
    "socks": "L",
    "warmupShirt": "XL"
  },
  "nationality": "Bosnia"
}
```

---

## 2. Módulo de Inventario (`/api/inventory`)

### `GET /api/inventory`
Obtiene el catálogo completo de utilería deportiva.

### `PUT /api/inventory/[id]`
Permite ajustar existencias en tiempo real o modificar detalles de un artículo.
* **Soporte para mutaciones de stock rápidas:**
```json
{
  "action": "ADD", // o "REDUCE" o "SET"
  "qtyChange": 1
}
```

---

## 3. Workflow de Solicitudes (`/api/requests`)

### `POST /api/requests`
Crea una nueva solicitud (pendiente) o procesa una existente.
* **Aprobación / Entrega de Material:**
```json
{
  "requestId": "r2",
  "action": "DELIVER" // o "APPROVE" o "REJECT"
}
```
*Al marcar como `DELIVERED`, el sistema automáticamente deduce las cantidades físicas correspondientes de la tabla de inventario, reflejando el principio de consistencia en nuestra Clean Architecture.*
