export interface ParsedSizingRow {
  dorsal: string;
  nombre: string;
  grupo: string;
  camiseta: string;
  pantalon: string;
  entrenamiento: string;
  chaqueta: string;
  calzado: string;
  notas: string;
}

function splitLine(line: string): string[] {
  const semi = line.split(';').length;
  const comma = line.split(',').length;
  const delim = semi >= comma ? ';' : ',';
  return line.split(delim).map((c) => c.trim().replace(/^"|"$/g, ''));
}

function col(headers: string[], cells: string[], ...needles: string[]): string {
  const idx = headers.findIndex((h) => needles.some((n) => h.includes(n)));
  return idx >= 0 ? (cells[idx] ?? '').trim() : '';
}

/** Parsea CSV/TSV de utilería (plantilla con membrete + tabla). */
export function parseSizingUtileriaCsv(text: string): ParsedSizingRow[] {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  let headerIdx = -1;
  let headers: string[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const cells = splitLine(lines[i]);
    const lower = cells.map((c) => c.toLowerCase());
    if (lower.some((c) => c.includes('dorsal')) && lower.some((c) => c.includes('camiseta'))) {
      headerIdx = i;
      headers = lower;
      break;
    }
  }

  if (headerIdx < 0) {
    throw new Error('No se encontró la tabla de tallas (cabecera Dorsal / Talla camiseta).');
  }

  const rows: ParsedSizingRow[] = [];
  for (let i = headerIdx + 1; i < lines.length; i += 1) {
    const line = lines[i]?.trim();
    if (!line) continue;
    const cells = splitLine(line);
    if (cells.every((c) => !c)) continue;

    const dorsal = col(headers, cells, 'dorsal');
    const nombre = col(headers, cells, 'nombre');
    if (!dorsal && !nombre) continue;
    if (/cuerpo técnico/i.test(nombre)) break;

    rows.push({
      dorsal,
      nombre,
      grupo: col(headers, cells, 'grupo'),
      camiseta: col(headers, cells, 'camiseta'),
      pantalon: col(headers, cells, 'pantalon', 'pantalón'),
      entrenamiento: col(headers, cells, 'entrenamiento'),
      chaqueta: col(headers, cells, 'chaqueta'),
      calzado: col(headers, cells, 'calzado'),
      notas: col(headers, cells, 'notas', 'nota'),
    });
  }

  if (!rows.length) {
    throw new Error('La tabla de tallas no contiene filas de jugadores.');
  }

  return rows;
}
