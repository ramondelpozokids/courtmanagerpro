/** Inventario extraído por OCR — Adobe Scan 23 jun 2026 (págs. 1-4, 6-8). Pág. 5 ilegible. */

export type AdobeScanGroup = {
  ref: string;
  name: string;
  description: string;
  color: string | null;
  sizes: string[];
  category: string;
};

export const ADOBE_SCAN_2026_GROUPS: AdobeScanGroup[] = [
  { ref: 'TT7880', name: 'ULT365 TPR PANT', description: 'Pantalón Travel golf Staff', color: 'Azul Marino', sizes: ['28', '30', '32', '34', '36', '38', '40'], category: 'pantalon_entrenamiento' },
  { ref: '117860', name: 'ULT365 TPR PANT', description: 'Pantalón Travel golf Staff', color: 'Azul Marino', sizes: ['28', '30', '32', '34', '36', '38', '40'], category: 'pantalon_entrenamiento' },
  { ref: 'IU4442', name: 'ADI PERF POLO', description: 'Polo Travel golf Staff', color: 'Azul Marino', sizes: ['2XL', 'L', 'M', 'S', 'XL'], category: 'camiseta_entrenamiento' },
  { ref: 'JN3067', name: 'REAL ICON TP', description: 'Pantalón TRAVEL JUGADOR/A', color: 'BLUEBIRD / WHITE', sizes: ['2XL', 'S', 'M', 'L', 'XL'], category: 'pantalon_entrenamiento' },
  { ref: 'JN3057', name: 'REAL ICON TP', description: 'Pantalón TRAVEL JUGADOR/A', color: 'BLUEBIRD / WHITE', sizes: ['M', 'XL'], category: 'pantalon_entrenamiento' },
  { ref: 'JN3068', name: 'REAL ICON TT', description: 'Chaqueta TRAVEL JUGADOR/A', color: 'BLUEBIRD / WHITE', sizes: ['2XL', 'S', 'M', 'L', 'XL'], category: 'chaqueta' },
  { ref: 'JN3058', name: 'REAL ICON TT', description: 'Chaqueta TRAVEL JUGADOR/A', color: 'BLUEBIRD / WHITE', sizes: ['2XL', 'L', 'M', 'S'], category: 'chaqueta' },
  { ref: 'JN3063', name: 'REAL ICON PARKA', description: 'Anorak TRAVEL JUGADOR/A', color: 'BLUEBIRD / WHITE', sizes: ['2XL', 'S', 'M', 'L', 'XL'], category: 'chaqueta' },
  { ref: 'JN3064', name: 'REAL ICON TEE', description: 'Camiseta TRAVEL JUGADOR/A', color: 'BLUEBIRD / WHITE', sizes: ['2XL'], category: 'camiseta_entrenamiento' },
  { ref: 'JP3992', name: 'REAL TR SHO', description: 'Pantalón entreno corto', color: null, sizes: ['2XL', '2XLT', '2XT2', '3XL', 'L', 'LT', 'M', 'S', 'XL', 'XLT', 'XLT2'], category: 'pantalon_entrenamiento' },
  { ref: 'JP3995', name: 'REAL PRE JKT', description: 'Chaqueta hotel', color: null, sizes: ['2XL', '2XLT', 'L', 'LT', 'M', 'S', 'XL', 'XLT', 'XLT2'], category: 'chaqueta' },
  { ref: 'JP4049', name: 'REAL TR JSY', description: 'Camiseta de entreno', color: null, sizes: ['2XL', '2XLT', '3XL', 'L', 'LT', 'M', 'S', 'XL', 'XLT'], category: 'camiseta_entrenamiento' },
  { ref: 'JP4051', name: 'REAL TR TOP', description: 'Sudadera', color: null, sizes: ['2XL', '2XLT', '2XT2', '3XL', 'L', 'LT', 'M', 'S', 'XL', 'XLT'], category: 'chaqueta' },
  { ref: 'JP4054', name: 'REAL TEE', description: 'Camiseta algodón', color: 'ALMOSLIME', sizes: ['2XL', '2XLT', '3XL', 'L', 'M', 'S', 'XL', 'XLT', 'XS'], category: 'camiseta_entrenamiento' },
  { ref: 'JP4055', name: 'REAL POLO', description: 'Polo', color: 'ALMOSLIME', sizes: ['L', 'XL', '2XL', 'M', 'S'], category: 'camiseta_entrenamiento' },
  { ref: 'JV5323', name: 'REAL P VT P', description: 'Pantalón TRAVEL RANGE TIRO VIS TECH', color: 'BLACK/LUCLEM', sizes: ['2XL', '3XL', 'L', 'M', 'S', 'XL'], category: 'pantalon_entrenamiento' },
  { ref: 'JV5324', name: 'REAL P VT J', description: 'Chaqueta TRAVEL RANGE TIRO VIS TECH', color: 'BLACK/LUCLEM', sizes: ['2XL', '3XL', 'L', 'M', 'S', 'XL'], category: 'chaqueta' },
  { ref: 'JX0017', name: 'REAL DUFFLE BAG', description: 'Bolso', color: 'LEGENDINK / MATSILVER', sizes: ['NS'], category: 'accesorios' },
  { ref: 'JX3209', name: 'REAL WOOLIE', description: 'Gorro de invierno', color: 'WHITE / LGHSOLGRE', sizes: ['OSFM'], category: 'accesorios' },
  { ref: 'JX3240', name: 'REAL P BACKPACK', description: 'Mochila', color: 'CARBON', sizes: ['NS'], category: 'accesorios' },
  { ref: 'JY5960', name: 'RM BB Home ShoP', description: 'Pantalón juego H', color: 'blanco', sizes: ['2XL', '2XLT', 'L', 'LT', 'M', 'S', 'XL', 'XLT', 'XLT2'], category: 'pantalon_juego' },
  { ref: 'JY5963', name: 'RM BB ORI J P', description: 'Camiseta juego ORIGINALS', color: 'BLUEBIRD', sizes: ['2XL', '2XLT', '2XT2', 'L', 'LT', 'M', 'S', 'XL', 'XLT', 'XLT2'], category: 'camiseta_juego' },
  { ref: 'JY5964', name: 'RM BB ORI ShoP', description: 'Pantalón juego ORIGINALS', color: 'BLUEBIRD', sizes: ['2XL', '2XLT', 'L', 'LT', 'M', 'S', 'XL', 'XLT', 'XLT2'], category: 'pantalon_juego' },
  { ref: 'JY5967', name: 'RM BB Shooter M', description: 'Camiseta tiro', color: 'blanco', sizes: ['2XL', '2XLT', 'L', 'LT', 'M', 'S', 'XL', 'XLT', 'XLT2'], category: 'camiseta_entrenamiento' },
  { ref: 'JY5978', name: 'RM REV Tank M', description: 'Reversible', color: 'verde/gris', sizes: ['2XL', '2XLT', 'L', 'LT', 'M', 'S', 'XL', 'XLT'], category: 'camiseta_entrenamiento' },
  { ref: 'JY5861', name: 'RM BB Home ShoP', description: 'Pantalón juego H', color: 'blanco', sizes: ['2XL', 'XL', 'L', 'M', 'S'], category: 'pantalon_juego' },
  { ref: 'JY5860', name: 'RM BB Home ShoP', description: 'Pantalón juego H', color: 'blanco', sizes: ['2XL', 'XL', 'L', 'M', 'S'], category: 'pantalon_juego' },
  { ref: 'JY5863', name: 'RM BB ORI J P', description: 'Camiseta juego ORIGINALS', color: 'BLUEBIRD', sizes: ['2XL', 'XL', 'L', 'M', 'S'], category: 'camiseta_juego' },
  { ref: 'JY5864', name: 'RM BB ORI ShoP', description: 'Pantalón juego ORIGINALS', color: 'BLUEBIRD', sizes: ['2XL', 'XL', 'L', 'M', 'S'], category: 'pantalon_juego' },
  { ref: 'JY5867', name: 'RM BB Shooter M', description: 'Camiseta tiro', color: 'blanco', sizes: ['2XL', 'XL', 'L', 'M', 'S'], category: 'camiseta_entrenamiento' },
  { ref: 'JY5878', name: 'RM REV Tank M', description: 'Reversible', color: 'verde/gris', sizes: ['3XL', '2XL', 'XL', 'L', 'M', 'S', 'XS'], category: 'camiseta_entrenamiento' },
  { ref: 'KC3739', name: 'REAL ANTH JKT', description: 'Chaqueta foto', color: 'NAVY', sizes: ['2XL', 'L', 'M', 'S', 'XL'], category: 'chaqueta' },
  { ref: 'KC6842', name: 'RM Warm up JKT', description: 'Chaqueta chándal calentamiento', color: 'blanco', sizes: ['2XL', '2XLT', '2XT2', 'L', 'LT', 'M', 'S', 'XL', 'XLT', 'XLT2'], category: 'chandal' },
  { ref: 'KC6843', name: 'RM Warm up PANT', description: 'Pantalón chándal calentamiento', color: 'blanco', sizes: ['2XL', '2XLT', '2XT2', 'L', 'LT', 'M', 'S', 'XL', 'XLT', 'XLT2'], category: 'chandal' },
  { ref: 'KD4361', name: 'RM BB Home J P', description: 'Camiseta juego H', color: 'blanco', sizes: ['2XL', '2XLT', '2XT2', 'L', 'LT', 'M', 'S', 'XL', 'XLT', 'XLT2'], category: 'camiseta_juego' },
];

export function expandAdobeScanItems() {
  const seen = new Set<string>();
  const items: Array<{
    ref: string;
    name: string;
    description: string;
    color: string | null;
    size: string;
    category: string;
    sku: string;
  }> = [];

  for (const group of ADOBE_SCAN_2026_GROUPS) {
    const uniqueSizes = [...new Set(group.sizes.map((s) => s.trim().toUpperCase()))];
    for (const size of uniqueSizes) {
      const sku = `${group.ref}-${size}`.toUpperCase();
      if (seen.has(sku)) continue;
      seen.add(sku);
      const fullName = `${group.name} — ${group.description}`;
      const descParts = [group.description, group.color].filter(Boolean);
      items.push({
        ref: group.ref,
        name: fullName,
        description: descParts.join(' — '),
        color: group.color,
        size,
        category: group.category,
        sku,
      });
    }
  }

  return items;
}
