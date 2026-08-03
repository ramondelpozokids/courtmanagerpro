/** Política mínima de contraseña para cuentas del club (cambio de clave / registro). */
export function validatePasswordStrength(password: string): { ok: true } | { ok: false; error: string } {
  const value = password ?? '';
  if (value.length < 10) {
    return { ok: false, error: 'La contraseña debe tener al menos 10 caracteres.' };
  }
  if (value.length > 128) {
    return { ok: false, error: 'La contraseña es demasiado larga.' };
  }
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return { ok: false, error: 'La contraseña debe combinar letras y números.' };
  }
  return { ok: true };
}
