import type { ClubSlug } from '@/data/clubs/types';
import {
  mergeSizingCatalog,
  normalizeSizes,
  staffToSizes,
  SIZING_CATEGORY_LABELS,
  type SizingProduct,
} from '@/content/sizing-products';
import { SITE_URL } from '@/content/seo';

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

function escapeCsvCell(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\r\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function row(cells: unknown[]): string {
  return cells.map(escapeCsvCell).join(',');
}

function emptyRow(cols = 8): string {
  return row(Array(cols).fill(''));
}

function formatExportDate(): string {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date());
}

function buildLetterhead(identity: ClubCsvIdentity, reportTitle: string, subtitle?: string): string[] {
  const logoUrl = `${SITE_URL}${identity.logoPath}`;
  const lines: string[] = [];

  lines.push(row(['Escudo oficial', logoUrl]));
  lines.push(emptyRow());
  lines.push(row([identity.brandLine]));
  lines.push(row([identity.legalName]));
  lines.push(row([identity.venue]));
  lines.push(row([identity.addressLine]));
  lines.push(row([identity.cityLine]));
  lines.push(emptyRow());
  lines.push(row([identity.department.toUpperCase()]));
  lines.push(row([identity.sportSection]));
  lines.push(row([reportTitle]));
  if (subtitle) lines.push(row([subtitle]));
  lines.push(row(['Temporada', '2025/26']));
  lines.push(row(['Documento generado', formatExportDate()]));
  lines.push(row(['Sistema', 'CourtManager Pro — Gestión de Utilería']));
  lines.push(row(['Confidencial', 'Uso interno — Departamento de Utilería']));
  lines.push(emptyRow());
  lines.push(row(['—'.repeat(40)]));
  lines.push(emptyRow());

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
  items: Array<{
    id: string;
    name: string;
    sku?: string | null;
    category?: string | null;
    stock_available: number;
    stock_min?: number;
    size?: string | null;
    unit_cost?: number | null;
    location?: string | null;
  }>
): string[] {
  const lines = buildLetterhead(
    identity,
    'INFORME DE INVENTARIO — UTILERÍA Y EQUIPACIÓN',
    `${items.length} referencias · Valoración almacén`
  );

  const totalValue = items.reduce(
    (acc, item) => acc + (item.unit_cost || 0) * item.stock_available,
    0
  );
  lines.push(row(['Resumen', `Unidades disponibles: ${items.reduce((a, i) => a + i.stock_available, 0)}`]));
  lines.push(row(['', `Valor total estimado: €${totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`]));
  lines.push(emptyRow());

  lines.push(
    row([
      'ID',
      'Nombre',
      'SKU',
      'Categoría',
      'Stock disp.',
      'Stock mín.',
      'Talla',
      'Ubicación',
      'Precio unit. (€)',
      'Valor total (€)',
      'Estado',
    ])
  );

  items.forEach((item) => {
    const min = item.stock_min ?? 0;
    let estado = 'OK';
    if (item.stock_available === 0) estado = 'SIN STOCK';
    else if (item.stock_available <= min) estado = 'BAJO MÍNIMO';

    lines.push(
      row([
        item.id,
        item.name,
        item.sku || '—',
        (item.category || 'otros').replace(/_/g, ' '),
        item.stock_available,
        min,
        item.size || 'U',
        item.location || '—',
        (item.unit_cost || 0).toFixed(2),
        ((item.unit_cost || 0) * item.stock_available).toFixed(2),
        estado,
      ])
    );
  });

  lines.push(emptyRow());
  lines.push(row(['Fin del informe', identity.legalName, identity.department]));
  return lines;
}

export function buildSizingCsvLines(
  identity: ClubCsvIdentity,
  players: any[],
  staff: any[],
  customProducts: SizingProduct[] = []
): string[] {
  const catalog = mergeSizingCatalog(customProducts);

  const lines = buildLetterhead(
    identity,
    'TABLA MAESTRA DE TALLAS — PLANTILLA Y CUERPO TÉCNICO',
    `${players.length} jugadores · ${staff.length} miembros staff`
  );

  lines.push(row(['Catálogo de productos', `${catalog.length} referencias de equipación`]));
  lines.push(emptyRow());

  const productHeaders = ['Tipo', 'Nombre', 'Dorsal / Rol', 'Posición', ...catalog.map((p) => p.label)];
  const categoryRow = ['', '', '', '', ...catalog.map((p) => SIZING_CATEGORY_LABELS[p.category])];

  lines.push(row(categoryRow));
  lines.push(row(productHeaders));

  lines.push(row(['— JUGADORES —']));
  players.forEach((p) => {
    const sizes = normalizeSizes(p.sizes, catalog);
    lines.push(
      row([
        'Jugador',
        `${p.firstName} ${p.lastName}`,
        p.number,
        p.position,
        ...catalog.map((prod) => sizes[prod.id] || '—'),
      ])
    );
  });

  lines.push(emptyRow());
  lines.push(row(['— CUERPO TÉCNICO —']));
  staff.forEach((s) => {
    const sizes = staffToSizes(s, catalog);
    lines.push(
      row([
        'Staff',
        s.full_name,
        s.role,
        '—',
        ...catalog.map((prod) => sizes[prod.id] || '—'),
      ])
    );
  });

  lines.push(emptyRow());
  lines.push(
    row([
      'Leyenda',
      'Productos marcados con * en la app son personalizados del club',
    ])
  );
  lines.push(row(['Fin del informe', identity.legalName, identity.department]));
  return lines;
}

export function exportInventoryCsv(
  slug: ClubSlug,
  items: Parameters<typeof buildInventoryCsvLines>[1]
): void {
  const identity = CLUB_CSV_IDENTITY[slug];
  const lines = buildInventoryCsvLines(identity, items);
  const fileSlug = identity.brandLine.toLowerCase().replace(/\s+/g, '_');
  downloadCsv(`inventario_utileria_${fileSlug}_25-26.csv`, lines);
}

export function exportSizingCsv(
  slug: ClubSlug,
  players: any[],
  staff: any[],
  customProducts: SizingProduct[] = []
): void {
  const identity = CLUB_CSV_IDENTITY[slug];
  const lines = buildSizingCsvLines(identity, players, staff, customProducts);
  const fileSlug = identity.brandLine.toLowerCase().replace(/\s+/g, '_');
  downloadCsv(`tabla_tallas_${fileSlug}_25-26.csv`, lines);
}
