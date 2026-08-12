/**
 * Exportación Excel (.xlsx) con logo y membrete — optimizado para impresión A4 apaisado.
 */
import ExcelJS from 'exceljs';
import type { ClubSlug } from '@/data/clubs/types';
import type { SizingProduct } from '@/content/sizing-products';
import {
  CLUB_CSV_IDENTITY,
  buildSizingExportRows,
  type ClubCsvIdentity,
  type CsvExportOptions,
} from '@/lib/csv-export';

const NAVY = 'FF0F172A';
const MUTED = 'FF64748B';
const HEAD_BG = 'FFF1F5F9';

const MEMBRETE_COLS = 'A:J';

async function loadLogoBuffer(logoPath: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(logoPath);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

function downloadBuffer(filename: string, buffer: ArrayBuffer) {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}

function styleMembreteRow(
  ws: ExcelJS.Worksheet,
  rowNum: number,
  value: string,
  opts?: { bold?: boolean; size?: number; italic?: boolean }
) {
  ws.mergeCells(`${MEMBRETE_COLS}${rowNum}`);
  const cell = ws.getCell(`A${rowNum}`);
  cell.value = value;
  cell.font = {
    bold: opts?.bold ?? false,
    size: opts?.size ?? 10,
    italic: opts?.italic ?? false,
    color: { argb: opts?.bold ? NAVY : MUTED },
  };
  cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  ws.getRow(rowNum).height = opts?.bold ? 22 : 18;
}

export async function buildSizingXlsxBuffer(
  identity: ClubCsvIdentity,
  players: any[],
  staff: any[],
  customProducts: SizingProduct[] = [],
  options?: CsvExportOptions
): Promise<ArrayBuffer> {
  const season = options?.season ?? '2026/2027';
  const rows = buildSizingExportRows(players, staff, customProducts);
  const wb = new ExcelJS.Workbook();
  wb.creator = 'CourtManager Pro';
  const ws = wb.addWorksheet('Tallas', {
    views: [{ showGridLines: false }],
  });

  ws.columns = [
    { width: 7 },
    { width: 30 },
    { width: 10 },
    { width: 18 },
    { width: 14 },
    { width: 14 },
    { width: 18 },
    { width: 14 },
    { width: 11 },
    { width: 16 },
  ];

  // Filas 1-6: logo grande centrado
  for (let i = 1; i <= 6; i += 1) {
    ws.getRow(i).height = 20;
  }
  ws.getRow(1).height = 28;
  ws.getRow(2).height = 28;
  ws.getRow(3).height = 28;

  const logoBuf = await loadLogoBuffer(identity.logoPath);
  if (logoBuf) {
    const imageId = wb.addImage({
      buffer: logoBuf as ExcelJS.Buffer,
      extension: 'png',
    });
    ws.addImage(imageId, {
      tl: { col: 4.2, row: 0.3 },
      ext: { width: 128, height: 128 },
    });
  }

  // Membrete centrado (filas 7-13) — líneas cortas para que no se corte al imprimir
  styleMembreteRow(ws, 7, identity.legalName.toUpperCase(), { bold: true, size: 16 });
  styleMembreteRow(ws, 8, identity.department, { size: 12 });
  styleMembreteRow(ws, 9, identity.venue, { size: 11 });
  styleMembreteRow(ws, 10, identity.addressLine, { size: 10 });
  styleMembreteRow(ws, 11, identity.cityLine, { size: 10 });
  if (identity.website) styleMembreteRow(ws, 12, identity.website, { size: 10 });
  styleMembreteRow(ws, 13, `Temporada ${season}`, { size: 10, italic: true });
  styleMembreteRow(ws, 14, identity.sportSection, { size: 10, italic: true });

  // Separador antes de la tabla
  ws.getRow(15).height = 14;
  ws.getRow(16).height = 8;

  const TABLE_HEADER_ROW = 17;
  const headerRow = ws.getRow(TABLE_HEADER_ROW);
  const headers = [
    'Dorsal',
    'Nombre',
    'Grupo',
    'Posición / rol',
    'Talla camiseta',
    'Talla pantalón',
    'Talla entrenamiento',
    'Talla chaqueta',
    'Talla calzado',
    'Notas',
  ];
  headerRow.values = headers;
  headerRow.font = { bold: true, size: 10, color: { argb: NAVY } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEAD_BG } };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  headerRow.height = 28;

  let r = TABLE_HEADER_ROW + 1;
  for (const entry of rows) {
    const dataRow = ws.getRow(r);
    dataRow.values = [
      entry.dorsal,
      entry.nombre,
      entry.grupo,
      entry.posicion,
      entry.camiseta,
      entry.pantalon,
      entry.entrenamiento,
      entry.chaqueta,
      entry.calzado,
      entry.notas,
    ];
    dataRow.font = { size: 10 };
    dataRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    dataRow.height = 20;
    if (r % 2 === 0) {
      dataRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    }
    r += 1;
  }

  const lastRow = r - 1;
  for (let rowNumber = TABLE_HEADER_ROW; rowNumber <= lastRow; rowNumber += 1) {
    ws.getRow(rowNumber).eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      };
    });
  }

  ws.pageSetup = {
    paperSize: 9,
    orientation: 'landscape',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
    margins: {
      left: 0.5,
      right: 0.5,
      top: 0.6,
      bottom: 0.6,
      header: 0.2,
      footer: 0.2,
    },
    printArea: `A1:J${lastRow}`,
  };

  const buffer = await wb.xlsx.writeBuffer();
  return buffer as ArrayBuffer;
}

export async function exportSizingXlsx(
  slug: ClubSlug,
  players: any[],
  staff: any[],
  customProducts: SizingProduct[] = [],
  options?: CsvExportOptions
): Promise<void> {
  const identity = CLUB_CSV_IDENTITY[slug];
  const season = (options?.season ?? '2026/2027').replace(/\//g, '-');
  const buffer = await buildSizingXlsxBuffer(identity, players, staff, customProducts, options);
  downloadBuffer(`tallas_utileria_${slug}_${season}.xlsx`, buffer);
}
