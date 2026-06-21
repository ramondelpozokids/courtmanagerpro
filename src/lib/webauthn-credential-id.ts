import { isoBase64URL } from '@simplewebauthn/server/helpers';

/** Normaliza IDs de credencial para comparar entre iOS/Android y la BD. */
export function normalizeCredentialId(id: string): string {
  try {
    const buffer = isoBase64URL.toBuffer(id);
    return isoBase64URL.fromBuffer(buffer);
  } catch {
    return id.trim();
  }
}

export function credentialIdsMatch(a: string, b: string): boolean {
  return normalizeCredentialId(a) === normalizeCredentialId(b);
}
