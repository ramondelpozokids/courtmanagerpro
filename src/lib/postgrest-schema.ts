/** Extrae el nombre de columna de un error PostgREST PGRST204. */
export function columnMissingFromMessage(message: string): string | null {
  const m = String(message || '').match(/Could not find the '([^']+)' column/i);
  return m?.[1] ?? null;
}

/**
 * Reintenta un insert/update quitando columnas que producción aún no tiene.
 * Evita que una migración 008 no aplicada tumbe la sync entera.
 */
export async function writeIgnoringUnknownColumns(
  write: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }>,
  row: Record<string, unknown>
): Promise<void> {
  let current: Record<string, unknown> = { ...row };
  for (let attempt = 0; attempt < 16; attempt += 1) {
    const { error } = await write(current);
    if (!error) return;
    const col = columnMissingFromMessage(error.message);
    if (!col || !Object.prototype.hasOwnProperty.call(current, col)) {
      throw new Error(error.message);
    }
    const next = { ...current };
    delete next[col];
    current = next;
  }
  throw new Error('Too many unknown columns while writing');
}
