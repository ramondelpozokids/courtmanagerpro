import { SITE_URL } from '@/content/seo';

export const BIOMETRIC_USERS = [
  'info@ramondelpozorott.es',
  'charlie-r-k@hotmail.com',
] as const;

export type BiometricUserEmail = (typeof BIOMETRIC_USERS)[number];

export function isBiometricUser(email: string): boolean {
  return BIOMETRIC_USERS.includes(email.trim().toLowerCase() as BiometricUserEmail);
}

export function getWebAuthnConfig(requestOrigin?: string) {
  const fallbackOrigin =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : SITE_URL;

  const origin = requestOrigin || fallbackOrigin;
  const hostname = new URL(origin).hostname;
  const rpID = hostname === '127.0.0.1' ? 'localhost' : hostname;

  return {
    rpName: 'CourtManager Pro',
    rpID,
    origin,
  };
}
