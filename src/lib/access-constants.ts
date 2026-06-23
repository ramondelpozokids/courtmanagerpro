/** Ramón del Pozo Rott — único superadmin con permisos de proyecto. */
export const SUPERADMIN_EMAIL = 'info@ramondelpozorott.es';

/** Carlos Rodriguez Kobe — acceso operativo total al club. */
export const CARLOS_EMAIL = 'charlie-r-k@hotmail.com';

export function normalizeEmail(email?: string | null): string | null {
  return email?.trim().toLowerCase() ?? null;
}
