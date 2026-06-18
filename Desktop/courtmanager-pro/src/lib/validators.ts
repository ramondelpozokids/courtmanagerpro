import { z } from 'zod';

export const createPlayerSchema = z.object({
  full_name: z.string().min(2, "El nombre completo debe tener al menos 2 caracteres"),
  dorsal: z.number().min(0).max(99, "El dorsal debe estar entre 0 y 99"),
  position: z.enum(['base', 'escolta', 'alero', 'ala_pivot', 'pivot']),
  nationality: z.string().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  shirt_size: z.string().optional().nullable(),
  shorts_size: z.string().optional().nullable(),
  shoe_size: z.number().optional().nullable(),
  jacket_size: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const createInventoryItemSchema = z.object({
  name: z.string().min(2, "El nombre del ítem es requerido"),
  category: z.enum([
    'camiseta_juego',
    'camiseta_entrenamiento',
    'pantalon_juego',
    'pantalon_entrenamiento',
    'zapatillas',
    'calcetines',
    'ropa_interior',
    'chaqueta',
    'chandal',
    'accesorios',
    'equipamiento_cancha',
    'electronica',
    'medico',
    'higiene',
    'otro'
  ]),
  sku: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  stock_total: z.number().min(0),
  stock_min: z.number().min(0),
  condition: z.enum(['nuevo', 'excelente', 'bueno', 'regular', 'deteriorado', 'baja']),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  unit_cost: z.number().optional().nullable(),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});
