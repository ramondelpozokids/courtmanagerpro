/**
 * Exportación Excel (.xlsx) con logo y membrete — igual que el PDF.
 * El CSV solo puede llevar texto; el logo va aquí o en el PDF.
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
    views: [{ showGridLines: true }],
  });

  ws.columns = [
    { width: 8 },
    { width: 28 },
    { width: 10 },
    { width: 16 },
    { width: 14 },
    { width: 14 },
    { width: 16 },
    { width: 14 },
    { width: 12 },
    { width: 18 },
  ];

  const logoBuf = await loadLogoBuffer(identity.logoPath);
  if (logoBuf) {
    const imageId = wb.addImage({
      buffer: logoBuf as ExcelJS.Buffer,
      extension: 'png',
    });
    ws.addImage(imageId, {
      tl: { col: 0.2, row: 0.2 },
      ext: { width: 72, height: 72 },
    });
  }

  // Filas 1-4: espacio logo · membrete filas 5-9 · separador · tabla fila 11+
  ws.mergeCells('A5:J5');
  const legal = ws.getCell('A5');
  legal.value = identity.legalName.toUpperCase();
  legal.font = { bold: true, size: 14, color: { argb: NAVY } };
  legal.alignment = { horizontal: 'center' };

  const dept = ws.getCell('A6');
  ws.mergeCells('A6:J6');
  dept.value = identity.department;
  dept.font = { size: 11, color: { argb: MUTED } };
  dept.alignment = { horizontal: 'center' };

  ws.mergeCells('A7:J7');
  ws.getCell('A7').value = identity.venue;
  ws.getCell('A7').font = { size: 10, color: { argb: MUTED } };
  ws.getCell('A7').alignment = { horizontal: 'center' };

  ws.mergeCells('A8:J8');
  ws.getCell('A8').value = `${identity.addressLine} · ${identity.cityLine}`;
  ws.getCell('A8').font = { size: 10, color: { argb: MUTED } };
  ws.getCell('A8').alignment = { horizontal: 'center' };

  if (identity.website) {
    ws.mergeCells('A9:J9');
    ws.getCell('A9').value = identity.website;
    ws.getCell('A9').font = { size: 10, color: { argb: MUTED } };
    ws.getCell('A9').alignment = { horizontal: 'center' };
  }

  ws.mergeCells('A10:J10');
  ws.getCell('A10').value = `Temporada ${season} · ${identity.sportSection}`;
  ws.getCell('A10').font = { size: 9, italic: true, color: { argb: MUTED } };
  ws.getCell('A10').alignment = { horizontal: 'center' };

  const headerRow = ws.getRow(11);
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
  headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
  headerRow.height = 22;

  let r = 12;
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
    if (r % 2 === 0) {
      dataRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    }
    r += 1;
  }

  ws.getCell(`A${r + 1}`).value = 'Generado por CourtManager Pro';
  ws.getCell(`A${r + 1}`).font = { size: 8, color: { argb: MUTED } };

  ws.eachRow((row, rowNumber) => {
    if (rowNumber >= 11) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
          left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
          bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
          right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        };
      });
    }
  });

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
