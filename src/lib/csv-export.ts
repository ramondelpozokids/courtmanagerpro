import type { ClubSlug } from '@/data/clubs/types';
import {
  mergeSizingCatalog,
  normalizeSizes,
  staffToSizes,
  type SizingProduct,
} from '@/content/sizing-products';

export interface ClubCsvIdentity {
  brandLine: string;
  legalName: string;
  venue: string;
  addressLine: string;
  cityLine: string;
  logoPath: string;
  department: string;
  sportSection: string;
}

export const CLUB_CSV_IDENTITY: Record<ClubSlug, ClubCsvIdentity> = {
  rmb: {
    brandLine: 'Realmadrid',
    legalName: 'REAL MADRID C.F.',
    venue: 'Estadio Santiago Bernabéu',
    addressLine: 'Av. Concha Espina, 1',
    cityLine: '28036 Madrid',
    logoPath: '/clubs/rmb/logo.png',
    department: 'Real Madrid Baloncesto',
    sportSection: 'Baloncesto — Primer Equipo',
  },
  fcb: {
    brandLine: 'FC Barcelona',
    legalName: 'FC BARCELONA',
    venue: 'Palau Blaugrana',
    addressLine: 'Carrer Aristides Maillol s/n',
    cityLine: '08028 Barcelona',
    logoPath: '/clubs/fcb/logo.svg',
    department: 'FC Barcelona Basquet',
    sportSection: 'Baloncesto — Primer Equipo',
  },
  fbat: {
    brandLine: 'FC Barcelona',
    legalName: 'FC BARCELONA',
    venue: 'Ciutat Esportiva Joan Gamper',
    addressLine: 'Carrer Aristides Maillol s/n',
    cityLine: '08028 Barcelona',
    logoPath: '/clubs/fcb/logo.svg',
    department: 'Barça Atlètic',
    sportSection: 'Baloncesto — Cantera U22',
  },
  vbc: {
    brandLine: 'Valencia Basket',
    legalName: 'VALENCIA BASKET CLUB S.A.D.',
    venue: 'Roig Arena',
    addressLine: 'C/ Menorca, 19',
    cityLine: '46023 Valencia',
    logoPath: '/clubs/vbc/logo.svg',
    department: 'Valencia Basket',
    sportSection: 'Baloncesto — Equipo Masculino',
  },
};

export interface CsvExportOptions {
  responsible?: string | null;
  season?: string;
}

export interface InventoryCsvRow {
  id?: string;
  name: string;
  sku?: string | null;
  category?: string | null;
  brand?: string | null;
  stock_available: number;
  stock_min?: number;
  size?: string | null;
  unit_cost?: number | null;
  location?: string | null;
  notes?: string | null;
  description?: string | null;
  updated_at?: string | null;
}

const DEFAULT_SEASON = '2025/26';

const SHIRT_SIZE_KEYS = ['jersey_home', 'jersey_away', 'jersey_third', 'jersey'];
const SHORT_SIZE_KEYS = ['shorts_game', 'shorts'];
const TRAINING_SIZE_KEYS = ['training_shirt'];
const JACKET_SIZE_KEYS = [
  'tracksuit_jacket',
  'travel_jacket',
  'pre_match_jacket',
  'windbreaker',
  'warmupShirt',
];
const SHOE_SIZE_KEYS = ['shoes_game', 'shoes_training', 'shoes'];

function escapeCsvCell(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\r\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function row(cells: unknown[]): string {
  return cells.map(escapeCsvCell).join(',');
}

function emptyRow(cols = 2): string {
  return row(Array(cols).fill(''));
}

function formatExportDateTime(): string {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date());
}

function formatDateValue(value: string | null | undefined): string {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
}

function formatCategoryLabel(category: string | null | undefined): string {
  if (!category) return 'Other';
  return category
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatPositionLabel(position: string | null | undefined): string {
  if (!position) return '—';
  const labels: Record<string, string> = {
    base: 'Base',
    escolta: 'Escolta',
    alero: 'Alero',
    ala_pivot: 'Ala-Pívot',
    pivot: 'Pívot',
  };
  return labels[position] ?? position.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function sectionDivider(title: string): string[] {
  return [emptyRow(), row(['—'.repeat(56)]), row([title]), row(['—'.repeat(56)]), emptyRow()];
}

function buildCorporateLetterhead(
  identity: ClubCsvIdentity,
  reportTitle: string,
  options?: CsvExportOptions
): string[] {
  const season = options?.season ?? DEFAULT_SEASON;
  const responsible = options?.responsible?.trim() || 'Departamento de Utilería';

  return [
    emptyRow(),
    row([identity.brandLine]),
    row([identity.legalName]),
    row([identity.venue]),
    row([identity.addressLine]),
    row([identity.cityLine]),
    emptyRow(),
    row([identity.department.toUpperCase()]),
    row([identity.sportSection]),
    emptyRow(),
    row([reportTitle]),
    emptyRow(),
    row(['Campo', 'Valor']),
    row(['Club / Equipo', identity.legalName]),
    row(['Departamento', identity.department]),
    row(['Temporada', season]),
    row(['Fecha y hora de generación', formatExportDateTime()]),
    row(['Responsable', responsible]),
    row(['Sistema', 'CourtManager Pro — Gestión de Equipación']),
    row(['Clasificación', 'Uso interno — Auditoría de utilería']),
    emptyRow(),
    row(['—'.repeat(56)]),
    emptyRow(),
  ];
}

function inventoryStatus(item: InventoryCsvRow): 'In Stock' | 'Low Stock' | 'Out of Stock' {
  const min = item.stock_min ?? 0;
  if (item.stock_available === 0) return 'Out of Stock';
  if (item.stock_available <= min) return 'Low Stock';
  return 'In Stock';
}

function inventoryItemLabel(item: InventoryCsvRow): string {
  const sku = item.sku?.trim();
  if (sku) return `${item.name} (${sku})`;
  return item.name;
}

function inventoryNotes(item: InventoryCsvRow): string {
  return item.notes?.trim() || item.description?.trim() || '—';
}

function incrementCount(map: Record<string, number>, key: string, amount = 1): void {
  map[key] = (map[key] ?? 0) + amount;
}

function sortedMetricRows(
  skuMap: Record<string, number>,
  unitMap: Record<string, number>,
  labelHeader: string
): string[] {
  const lines = [row([labelHeader, 'Registros', 'Unidades'])];
  Object.keys({ ...skuMap, ...unitMap })
    .sort((a, b) => (skuMap[b] ?? 0) - (skuMap[a] ?? 0) || a.localeCompare(b, 'es'))
    .forEach((key) => {
      lines.push(row([key, skuMap[key] ?? 0, unitMap[key] ?? 0]));
    });
  return lines;
}

function pickSize(sizes: Record<string, string>, keys: string[]): string {
  for (const key of keys) {
    const value = sizes[key];
    if (value && value !== '—') return value;
  }
  return '—';
}

function playerDisplayName(player: {
  full_name?: string;
  firstName?: string;
  lastName?: string;
}): string {
  if (player.full_name?.trim()) return player.full_name.trim();
  const composed = `${player.firstName ?? ''} ${player.lastName ?? ''}`.trim();
  return composed || '—';
}

function collectSizeDistribution(values: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  values.forEach((value) => {
    if (!value || value === '—') return;
    incrementCount(map, value);
  });
  return map;
}

function distributionSection(title: string, map: Record<string, number>): string[] {
  const lines = sectionDivider(title);
  lines.push(row(['Size', 'Count']));
  const entries = Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'));
  if (entries.length === 0) {
    lines.push(row(['—', 0]));
  } else {
    entries.forEach(([size, count]) => lines.push(row([size, count])));
  }
  return lines;
}

export function downloadCsv(filename: string, lines: string[]): void {
  const BOM = '\uFEFF';
  const content = BOM + lines.join('\r\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function buildInventoryCsvLines(
  identity: ClubCsvIdentity,
  items: InventoryCsvRow[],
  options?: CsvExportOptions
): string[] {
  const sortedItems = [...items].sort((a, b) => {
    const categoryCompare = formatCategoryLabel(a.category).localeCompare(
      formatCategoryLabel(b.category),
      'es'
    );
    if (categoryCompare !== 0) return categoryCompare;
    const nameCompare = a.name.localeCompare(b.name, 'es');
    if (nameCompare !== 0) return nameCompare;
    return (a.size ?? '').localeCompare(b.size ?? '', 'es');
  });

  const lines = buildCorporateLetterhead(
    identity,
    'INFORME DE INVENTARIO — UTILERÍA Y EQUIPACIÓN',
    options
  );

  const totalUnits = sortedItems.reduce((acc, item) => acc + item.stock_available, 0);
  const totalValue = sortedItems.reduce(
    (acc, item) => acc + (item.unit_cost || 0) * item.stock_available,
    0
  );

  const statusCounts: Record<string, number> = {};
  const categorySkuCounts: Record<string, number> = {};
  const categoryUnitCounts: Record<string, number> = {};
  const brandSkuCounts: Record<string, number> = {};
  const brandUnitCounts: Record<string, number> = {};
  let outOfStock = 0;
  let lowStock = 0;
  let inStock = 0;

  sortedItems.forEach((item) => {
    const status = inventoryStatus(item);
    const category = formatCategoryLabel(item.category);
    const brand = item.brand?.trim() || 'Sin marca';

    incrementCount(statusCounts, status);
    incrementCount(categorySkuCounts, category);
    incrementCount(categoryUnitCounts, category, item.stock_available);
    incrementCount(brandSkuCounts, brand);
    incrementCount(brandUnitCounts, brand, item.stock_available);

    if (status === 'Out of Stock') outOfStock += 1;
    else if (status === 'Low Stock') lowStock += 1;
    else inStock += 1;
  });

  lines.push(...sectionDivider('RESUMEN EJECUTIVO'));
  lines.push(row(['Indicador', 'Valor']));
  lines.push(row(['Total de registros (SKUs)', sortedItems.length]));
  lines.push(row(['Total de unidades en almacén', totalUnits]));
  lines.push(row(['Valor estimado del inventario (EUR)', totalValue.toFixed(2)]));
  lines.push(row(['Referencias sin stock', outOfStock]));
  lines.push(row(['Referencias bajo mínimo', lowStock]));
  lines.push(row(['Referencias en nivel óptimo', inStock]));
  lines.push(
    row([
      'Salud de stock',
      sortedItems.length
        ? `${Math.round((inStock / sortedItems.length) * 100)}% en nivel óptimo`
        : '—',
    ])
  );

  lines.push(...sectionDivider('DETALLE DE INVENTARIO'));
  lines.push(
    row([
      'Item',
      'Category',
      'Brand',
      'Size',
      'Quantity',
      'Status',
      'Location',
      'Notes',
      'Last Updated',
    ])
  );

  sortedItems.forEach((item) => {
    lines.push(
      row([
        inventoryItemLabel(item),
        formatCategoryLabel(item.category),
        item.brand?.trim() || '—',
        item.size?.trim() || 'U',
        item.stock_available,
        inventoryStatus(item),
        item.location?.trim() || '—',
        inventoryNotes(item),
        formatDateValue(item.updated_at),
      ])
    );
  });

  lines.push(emptyRow(9));
  lines.push(
    row(['TOTALS', '', '', '', totalUnits, '', '', '', ''])
  );

  lines.push(...sectionDivider('ESTADÍSTICAS — CONTEO POR CATEGORÍA'));
  lines.push(...sortedMetricRows(categorySkuCounts, categoryUnitCounts, 'Category'));

  lines.push(...sectionDivider('ESTADÍSTICAS — CONTEO POR MARCA'));
  lines.push(...sortedMetricRows(brandSkuCounts, brandUnitCounts, 'Brand'));

  lines.push(...sectionDivider('ESTADÍSTICAS — CONTEO POR ESTADO'));
  lines.push(row(['Status', 'Registros']));
  Object.entries(statusCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'))
    .forEach(([status, count]) => lines.push(row([status, count])));

  lines.push(...sectionDivider('INDICADORES DE STOCK'));
  lines.push(row(['Indicador', 'Valor', 'Observación']));
  lines.push(row(['Out of Stock', outOfStock, 'Referencias agotadas']));
  lines.push(row(['Low Stock', lowStock, 'Por debajo del stock mínimo']));
  lines.push(row(['In Stock', inStock, 'Nivel operativo correcto']));
  lines.push(row(['Total SKUs', sortedItems.length, 'Líneas únicas en inventario']));
  lines.push(row(['Total Units', totalUnits, 'Unidades disponibles acumuladas']));

  lines.push(emptyRow());
  lines.push(row(['Fin del informe', identity.legalName, identity.department]));
  lines.push(row(['Documento', 'Auditoría de inventario — CourtManager Pro']));
  return lines;
}

export function buildSizingCsvLines(
  identity: ClubCsvIdentity,
  players: any[],
  staff: any[],
  customProducts: SizingProduct[] = [],
  options?: CsvExportOptions
): string[] {
  const catalog = mergeSizingCatalog(customProducts);
  const totalRoster = players.length + staff.length;

  const lines = buildCorporateLetterhead(
    identity,
    'INFORME DE TALLAS — PLANTILLA Y CUERPO TÉCNICO',
    options
  );

  lines.push(...sectionDivider('RESUMEN EJECUTIVO'));
  lines.push(row(['Indicador', 'Valor']));
  lines.push(row(['Total de personas registradas', totalRoster]));
  lines.push(row(['Jugadores', players.length]));
  lines.push(row(['Cuerpo técnico', staff.length]));
  lines.push(row(['Productos en catálogo de equipación', catalog.length]));

  const shirtSizes: string[] = [];
  const shortSizes: string[] = [];
  const trainingSizes: string[] = [];
  const jacketSizes: string[] = [];
  const shoeSizes: string[] = [];
  let missingEntries = 0;

  const sizingRows: Array<{
    group: string;
    player: string;
    position: string;
    shirt: string;
    shorts: string;
    training: string;
    jacket: string;
    shoe: string;
    notes: string;
  }> = [];

  players.forEach((player) => {
    const sizes = normalizeSizes(player.sizes, catalog);
    const shirt = pickSize(sizes, SHIRT_SIZE_KEYS);
    const shorts = pickSize(sizes, SHORT_SIZE_KEYS);
    const training = pickSize(sizes, TRAINING_SIZE_KEYS);
    const jacket = pickSize(sizes, JACKET_SIZE_KEYS);
    const shoe = pickSize(sizes, SHOE_SIZE_KEYS);
    const rowValues = [shirt, shorts, training, jacket, shoe];
    missingEntries += rowValues.filter((value) => value === '—').length;

    shirtSizes.push(shirt);
    shortSizes.push(shorts);
    trainingSizes.push(training);
    jacketSizes.push(jacket);
    shoeSizes.push(shoe);

    sizingRows.push({
      group: 'Jugador',
      player: playerDisplayName(player),
      position: formatPositionLabel(player.position),
      shirt,
      shorts,
      training,
      jacket,
      shoe,
      notes: player.notes?.trim() || '—',
    });
  });

  staff.forEach((member) => {
    const sizes = staffToSizes(member, catalog);
    const shirt = pickSize(sizes, SHIRT_SIZE_KEYS);
    const shorts = pickSize(sizes, SHORT_SIZE_KEYS);
    const training = pickSize(sizes, TRAINING_SIZE_KEYS);
    const jacket = pickSize(sizes, JACKET_SIZE_KEYS);
    const shoe = pickSize(sizes, SHOE_SIZE_KEYS);
    const rowValues = [shirt, shorts, training, jacket, shoe];
    missingEntries += rowValues.filter((value) => value === '—').length;

    shirtSizes.push(shirt);
    shortSizes.push(shorts);
    trainingSizes.push(training);
    jacketSizes.push(jacket);
    shoeSizes.push(shoe);

    sizingRows.push({
      group: 'Staff',
      player: member.full_name?.trim() || '—',
      position: member.role?.trim() || '—',
      shirt,
      shorts,
      training,
      jacket,
      shoe,
      notes: member.notes?.trim() || '—',
    });
  });

  lines.push(row(['Tallas pendientes de registrar', missingEntries]));
  lines.push(emptyRow());

  lines.push(...sectionDivider('MATRIZ DE TALLAS'));
  lines.push(
    row([
      'Player',
      'Position',
      'Shirt Size',
      'Short Size',
      'Training Size',
      'Jacket Size',
      'Shoe Size',
      'Notes',
    ])
  );

  sizingRows
    .filter((entry) => entry.group === 'Jugador')
    .forEach((entry) => {
      lines.push(
        row([
          entry.player,
          entry.position,
          entry.shirt,
          entry.shorts,
          entry.training,
          entry.jacket,
          entry.shoe,
          entry.notes,
        ])
      );
    });

  lines.push(emptyRow(8));
  lines.push(row(['— CUERPO TÉCNICO —']));

  sizingRows
    .filter((entry) => entry.group === 'Staff')
    .forEach((entry) => {
      lines.push(
        row([
          entry.player,
          entry.position,
          entry.shirt,
          entry.shorts,
          entry.training,
          entry.jacket,
          entry.shoe,
          entry.notes,
        ])
      );
    });

  lines.push(...sectionDivider('RESUMEN DE TALLAS — ESTADÍSTICAS GLOBALES'));
  lines.push(row(['Métrica', 'Valor']));
  lines.push(row(['Personas registradas', totalRoster]));
  lines.push(row(['Campos de talla completados', totalRoster * 5 - missingEntries]));
  lines.push(row(['Campos de talla pendientes', missingEntries]));
  lines.push(
    row([
      'Cobertura de datos',
      totalRoster
        ? `${Math.round(((totalRoster * 5 - missingEntries) / (totalRoster * 5)) * 100)}%`
        : '—',
    ])
  );

  lines.push(...distributionSection('DISTRIBUCIÓN — SHIRT SIZE', collectSizeDistribution(shirtSizes)));
  lines.push(...distributionSection('DISTRIBUCIÓN — SHORT SIZE', collectSizeDistribution(shortSizes)));
  lines.push(
    ...distributionSection('DISTRIBUCIÓN — TRAINING SIZE', collectSizeDistribution(trainingSizes))
  );
  lines.push(...distributionSection('DISTRIBUCIÓN — JACKET SIZE', collectSizeDistribution(jacketSizes)));
  lines.push(...distributionSection('DISTRIBUCIÓN — SHOE SIZE', collectSizeDistribution(shoeSizes)));

  lines.push(emptyRow());
  lines.push(row(['Fin del informe', identity.legalName, identity.department]));
  lines.push(row(['Documento', 'Auditoría de tallas — CourtManager Pro']));
  return lines;
}

export function exportInventoryCsv(
  slug: ClubSlug,
  items: InventoryCsvRow[],
  options?: CsvExportOptions
): void {
  const identity = CLUB_CSV_IDENTITY[slug];
  const lines = buildInventoryCsvLines(identity, items, options);
  const fileSlug = identity.brandLine.toLowerCase().replace(/\s+/g, '_');
  const seasonSlug = (options?.season ?? DEFAULT_SEASON).replace('/', '-');
  downloadCsv(`inventario_utileria_${fileSlug}_${seasonSlug}.csv`, lines);
}

export function exportSizingCsv(
  slug: ClubSlug,
  players: any[],
  staff: any[],
  customProducts: SizingProduct[] = [],
  options?: CsvExportOptions
): void {
  const identity = CLUB_CSV_IDENTITY[slug];
  const lines = buildSizingCsvLines(identity, players, staff, customProducts, options);
  const fileSlug = identity.brandLine.toLowerCase().replace(/\s+/g, '_');
  const seasonSlug = (options?.season ?? DEFAULT_SEASON).replace('/', '-');
  downloadCsv(`tabla_tallas_${fileSlug}_${seasonSlug}.csv`, lines);
}
