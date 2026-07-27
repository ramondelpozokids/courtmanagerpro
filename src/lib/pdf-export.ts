/**
 * Informes PDF — Inventario, Tallas y Almacén general.
 * Cabecera por club activo (RMB / RMF / ATM): logo, razón social, dirección.
 */
import type { ClubSlug } from '@/data/clubs/types';
import type { SizingProduct } from '@/content/sizing-products';
import {
  CLUB_CSV_IDENTITY,
  type ClubCsvIdentity,
  type CsvExportOptions,
  type InventoryCsvRow,
  type WarehouseCsvRow,
  buildInventoryCsvLines,
  buildSizingCsvLines,
  buildWarehouseCsvLines,
} from '@/lib/csv-export';

const DEFAULT_SEASON = '2025/26';
const DOC_VERSION = 'v1.1';
const BRAND_GOLD: [number, number, number] = [180, 140, 60];
const BRAND_NAVY: [number, number, number] = [15, 23, 42];
const TEXT_MUTED: [number, number, number] = [100, 116, 139];
const BG_LIGHT: [number, number, number] = [248, 250, 252];
const TABLE_HEAD_BG: [number, number, number] = [241, 245, 249];

export function seasonLabelForClub(slug: ClubSlug): string {
  return slug === 'atm' ? '2025-26' : '2026-27';
}

type PdfDoc = {
  internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
  setFillColor: (...c: number[]) => void;
  rect: (x: number, y: number, w: number, h: number, style?: string) => void;
  setTextColor: (...c: number[]) => void;
  setFont: (face: string, style?: string) => void;
  setFontSize: (size: number) => void;
  text: (text: string, x: number, y: number, opts?: { align?: string }) => void;
  addImage: (img: string, fmt: string, x: number, y: number, w: number, h: number) => void;
  addPage: () => void;
  setPage: (n: number) => void;
  getNumberOfPages: () => number;
  setDrawColor: (...c: number[]) => void;
  setLineWidth: (w: number) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  save: (filename: string) => void;
  lastAutoTable?: { finalY: number };
};

type AutoTableFn = (doc: PdfDoc, opts: Record<string, unknown>) => void;

let libsPromise: Promise<{ jsPDF: new (opts?: Record<string, unknown>) => PdfDoc; autoTable: AutoTableFn }> | null =
  null;

async function loadPdfLibs() {
  if (!libsPromise) {
    libsPromise = (async () => {
      const [{ jsPDF }, autoTableMod] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
      ]);
      const autoTableFn =
        (autoTableMod as { default?: AutoTableFn }).default ||
        (autoTableMod as { autoTable?: AutoTableFn }).autoTable;
      if (!autoTableFn) throw new Error('jspdf-autotable no disponible');
      return {
        jsPDF: jsPDF as unknown as new (opts?: Record<string, unknown>) => PdfDoc,
        autoTable: ((doc: PdfDoc, opts: Record<string, unknown>) => autoTableFn(doc, opts)) as AutoTableFn,
      };
    })().catch((err) => {
      libsPromise = null;
      throw err;
    });
  }
  return libsPromise;
}

function formatExportDateTime(): string {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date());
}

/** jsPDF: rasteriza logo del club a PNG vía canvas. */
async function loadLogoForPdf(logoPath: string): Promise<string | null> {
  try {
    const res = await fetch(logoPath);
    if (!res.ok) return null;
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    try {
      return await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max = 512;
          const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight || 1));
          canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('canvas'));
            return;
          }
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => reject(new Error('img'));
        img.src = objectUrl;
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
}

function addCorporateHeader(
  doc: PdfDoc,
  identity: ClubCsvIdentity,
  reportTitle: string,
  options?: CsvExportOptions
): number {
  const season = options?.season ?? DEFAULT_SEASON;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 14;

  doc.setFillColor(...BG_LIGHT);
  doc.rect(0, 0, pageWidth, 52, 'F');
  doc.setFillColor(...BRAND_GOLD);
  doc.rect(0, 52, pageWidth, 0.8, 'F');

  doc.setTextColor(...BRAND_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(identity.legalName.toUpperCase(), pageWidth / 2, y + 3, { align: 'center' });
  y += 7;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MUTED);
  doc.text(identity.department, pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text(`${identity.venue} · ${identity.addressLine}`, pageWidth / 2, y, { align: 'center' });
  y += 4;
  const contact = [identity.cityLine, identity.website, identity.email].filter(Boolean).join(' · ');
  doc.text(contact, pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text(`Temporada ${season} · ${identity.sportSection}`, pageWidth / 2, y, { align: 'center' });

  y = 60;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...BRAND_NAVY);
  doc.text('INFORME OFICIAL', 14, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(reportTitle, 14, y);
  y += 5;
  doc.text(`Fecha de generación: ${formatExportDateTime()}`, 14, y);
  y += 4;
  doc.text(`Versión del documento: ${DOC_VERSION}`, 14, y);

  return y + 10;
}

async function addLogoToCover(
  doc: PdfDoc,
  identity: ClubCsvIdentity,
  reportTitle: string,
  options?: CsvExportOptions
): Promise<void> {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const season = options?.season ?? DEFAULT_SEASON;

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setFillColor(...BRAND_GOLD);
  doc.rect(14, pageHeight * 0.58, pageWidth - 28, 0.6, 'F');

  const logo = await loadLogoForPdf(identity.logoPath);
  if (logo) {
    try {
      doc.addImage(logo, 'PNG', pageWidth / 2 - 22, 32, 44, 44);
    } catch {
      /* logo opcional */
    }
  }

  doc.setTextColor(...BRAND_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(identity.legalName.toUpperCase(), pageWidth / 2, 88, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(identity.department, pageWidth / 2, 96, { align: 'center' });
  doc.text(identity.venue, pageWidth / 2, 102, { align: 'center' });
  doc.text(`${identity.addressLine} · ${identity.cityLine}`, pageWidth / 2, 108, { align: 'center' });
  if (identity.website) {
    doc.text(identity.website, pageWidth / 2, 114, { align: 'center' });
  }

  doc.setTextColor(...BRAND_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('INFORME OFICIAL', pageWidth / 2, pageHeight * 0.58 + 12, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(reportTitle, pageWidth / 2, pageHeight * 0.58 + 22, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(`Temporada ${season} · ${identity.sportSection}`, pageWidth / 2, pageHeight * 0.58 + 34, {
    align: 'center',
  });
  doc.text(`Fecha de generación: ${formatExportDateTime()}`, pageWidth / 2, pageHeight - 36, {
    align: 'center',
  });
  doc.text(`Versión del documento: ${DOC_VERSION}`, pageWidth / 2, pageHeight - 28, { align: 'center' });
  doc.text('Documento interno — CourtManager Pro', pageWidth / 2, pageHeight - 18, { align: 'center' });
}

function addPageFooter(doc: PdfDoc, identity: ClubCsvIdentity): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setDrawColor(...BRAND_GOLD);
    doc.setLineWidth(0.4);
    doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...TEXT_MUTED);
    doc.text(identity.department.toUpperCase(), 14, pageHeight - 10);
    doc.text('Documento interno', pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text('Generado por CourtManager Pro', pageWidth - 14, pageHeight - 10, { align: 'right' });
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 6, { align: 'right' });
  }
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

/** Texto seguro para Helvetica (WinAnsi): evita glifos que jsPDF renderiza raro. */
function pdfSafeText(value: string): string {
  return String(value ?? '')
    .replace(/\u2014/g, '-') // —
    .replace(/\u2013/g, '-') // –
    .replace(/\u2022/g, '-')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');
}

/** El CSV incluye membrete; en PDF ya va en portada/cabecera — no volver a pintarlo. */
function stripLetterheadForPdf(lines: string[]): string[] {
  const idx = lines.findIndex((line) => {
    const first = pdfSafeText(parseCsvLine(line)[0] ?? '').trim();
    return (
      (first.startsWith('- ') && first.endsWith(' -') && /RESUMEN|DETALLE|MATRIZ|ESTAD|INDICADORES/i.test(first)) ||
      (first.startsWith('— ') && first.endsWith(' —')) ||
      /^(RESUMEN|DETALLE|MATRIZ|ESTAD|INDICADORES)\b/i.test(first)
    );
  });
  return idx >= 0 ? lines.slice(idx) : lines;
}

/** Misma tipografía en todas las tablas del informe (igual que inventario). */
const TABLE_FONT_SIZE = 8;
const SECTION_FONT_SIZE = 10;

function renderCsvLinesToPdf(doc: PdfDoc, autoTable: AutoTableFn, lines: string[], startY: number): number {
  let y = startY;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let tableHead: string[] | null = null;
  let tableBody: string[][] = [];

  const flushTable = () => {
    if (!tableHead || tableBody.length === 0) {
      tableHead = null;
      tableBody = [];
      return;
    }
    // Filtrar filas vacías residuales del CSV
    const body = tableBody.filter((row) => row.some((c) => String(c).trim()));
    if (!body.length) {
      tableHead = null;
      tableBody = [];
      return;
    }

    const colCount = tableHead.length;
    const wide = colCount >= 7;
    // Tablas de 2 columnas (resumen): ancho fijo para no verse “gigantes” frente al detalle.
    const tableWidth = colCount <= 3 ? Math.min(120, pageWidth - 28) : 'auto';

    // Tipografía del doc ANTES de autoTable (algunas celdas heredan getFontSize()).
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(TABLE_FONT_SIZE);

    autoTable(doc, {
      startY: y,
      head: [tableHead.map(pdfSafeText)],
      body: body.map((row) => row.map(pdfSafeText)),
      theme: 'grid',
      tableWidth,
      styles: {
        font: 'helvetica',
        fontStyle: 'normal',
        fontSize: TABLE_FONT_SIZE,
        cellPadding: wide ? 1.5 : 2.2,
        textColor: BRAND_NAVY,
        overflow: 'linebreak',
        valign: 'middle',
        minCellHeight: 7,
        lineColor: [226, 232, 240],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: TABLE_HEAD_BG,
        textColor: BRAND_NAVY,
        fontStyle: 'bold',
        fontSize: TABLE_FONT_SIZE,
        font: 'helvetica',
      },
      bodyStyles: {
        fontSize: TABLE_FONT_SIZE,
        font: 'helvetica',
        fontStyle: 'normal',
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      margin: { left: 14, right: 14 },
      didParseCell: (data: {
        cell: { styles: { fontSize: number; font?: string; fontStyle?: string } };
        section: string;
      }) => {
        data.cell.styles.fontSize = TABLE_FONT_SIZE;
        data.cell.styles.font = 'helvetica';
        if (data.section === 'head') data.cell.styles.fontStyle = 'bold';
      },
      willDrawCell: (data: {
        cell: { styles: { fontSize: number; fontStyle?: string } };
        section: string;
        doc: { setFontSize: (n: number) => void; setFont: (f: string, s?: string) => void };
      }) => {
        data.cell.styles.fontSize = TABLE_FONT_SIZE;
        const style = data.section === 'head' ? 'bold' : 'normal';
        data.doc.setFont('helvetica', style);
        data.doc.setFontSize(TABLE_FONT_SIZE);
      },
    });
    y = (doc as PdfDoc & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y;
    y += 6;
    tableHead = null;
    tableBody = [];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(TABLE_FONT_SIZE);
  };

  for (const line of stripLetterheadForPdf(lines)) {
    if (!line.trim()) continue;
    const cells = parseCsvLine(line).map((c) => pdfSafeText(c));
    const first = cells[0]?.trim() ?? '';

    const isDashOnly = cells.length === 1 && /^[—\-]+$/.test(first);
    const isSectionTitle =
      cells.length === 1 &&
      (((first.startsWith('— ') || first.startsWith('- ')) &&
        (first.endsWith(' —') || first.endsWith(' -'))) ||
        /^(RESUMEN|DETALLE|MATRIZ|ESTAD|INDICADORES)\b/i.test(first));

    if (isDashOnly) continue;

    if (isSectionTitle) {
      flushTable();
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }
      const label = first.replace(/^[—\-]\s*|\s*[—\-]$/g, '').trim() || first;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(SECTION_FONT_SIZE);
      doc.setTextColor(...BRAND_NAVY);
      doc.text(label, 14, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(TABLE_FONT_SIZE);
      continue;
    }

    if (cells.length < 2) continue;
    // No usar filas vacías como cabecera (vienen del CSV entre secciones).
    if (cells.every((c) => !String(c).trim())) continue;

    if (tableHead && cells.length !== tableHead.length) {
      flushTable();
    }

    if (!tableHead) {
      tableHead = cells;
      continue;
    }

    tableBody.push(cells);
  }

  flushTable();
  return y;
}

async function buildPdfDocument(
  identity: ClubCsvIdentity,
  reportTitle: string,
  csvLines: string[],
  options?: CsvExportOptions,
  orientation: 'portrait' | 'landscape' = 'portrait'
): Promise<PdfDoc> {
  const { jsPDF, autoTable } = await loadPdfLibs();
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  await addLogoToCover(doc, identity, reportTitle, options);
  doc.addPage();

  const headerEnd = addCorporateHeader(doc, identity, reportTitle, options);
  renderCsvLinesToPdf(doc, autoTable, csvLines, headerEnd);
  addPageFooter(doc, identity);

  return doc;
}

function fileSlug(identity: ClubCsvIdentity): string {
  return identity.brandLine
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');
}

export async function exportInventoryPdf(
  slug: ClubSlug,
  items: InventoryCsvRow[],
  options?: CsvExportOptions
): Promise<void> {
  const identity = CLUB_CSV_IDENTITY[slug];
  const opts = { ...options, season: options?.season ?? seasonLabelForClub(slug) };
  const lines = buildInventoryCsvLines(identity, items, opts);
  const doc = await buildPdfDocument(
    identity,
    'INFORME DE INVENTARIO — UTILERÍA Y EQUIPACIÓN',
    lines,
    opts
  );
  doc.save(`inventario_utileria_${fileSlug(identity)}_${opts.season!.replace('/', '-')}.pdf`);
}

export async function exportSizingPdf(
  slug: ClubSlug,
  players: any[],
  staff: any[],
  customProducts: SizingProduct[] = [],
  options?: CsvExportOptions
): Promise<void> {
  const identity = CLUB_CSV_IDENTITY[slug];
  const opts = { ...options, season: options?.season ?? seasonLabelForClub(slug) };
  const lines = buildSizingCsvLines(identity, players, staff, customProducts, opts);
  const doc = await buildPdfDocument(
    identity,
    'INFORME DE TALLAS — PLANTILLA Y CUERPO TÉCNICO',
    lines,
    opts
  );
  doc.save(`tabla_tallas_${fileSlug(identity)}_${opts.season!.replace('/', '-')}.pdf`);
}

export async function exportWarehousePdf(
  slug: ClubSlug,
  items: WarehouseCsvRow[],
  options?: CsvExportOptions
): Promise<void> {
  const identity = CLUB_CSV_IDENTITY[slug];
  if (!identity) throw new Error(`Club no soportado para PDF: ${slug}`);
  if (!items.length) throw new Error('No hay líneas de almacén para exportar');

  const opts = { ...options, season: options?.season ?? seasonLabelForClub(slug) };
  const lines = buildWarehouseCsvLines(identity, items, opts);
  // Mismo pipeline que inventario (portrait): tipografía estable y sin membrete duplicado.
  const doc = await buildPdfDocument(
    identity,
    'INFORME DE ALMACÉN GENERAL — STOCK Y VALOR',
    lines,
    opts,
    'portrait'
  );

  const season = opts.season!.replace('/', '-');
  doc.save(`almacen_general_${slug}_${season}.pdf`);
}
