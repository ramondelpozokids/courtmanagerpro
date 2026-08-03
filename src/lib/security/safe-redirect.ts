/**
 * Evita open redirect tras login (?redirect=https://evil.com).
 * Solo permite rutas relativas internas que empiezan por "/".
 */
export function safeInternalPath(raw: string | null | undefined, fallback = '/'): string {
  if (!raw) return fallback;
  const value = raw.trim();
  if (!value.startsWith('/')) return fallback;
  if (value.startsWith('//')) return fallback;
  if (value.includes('\\')) return fallback;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) return fallback;
  if (value.includes('://')) return fallback;
  return value;
}
