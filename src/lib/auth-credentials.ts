import type { ExtendedRole } from '@/contexts/AuthContext';
import {
  ATM_DEMO_EMAIL,
  ATM_DEMO_FULL_NAME,
  ATM_DEMO_PASSWORD,
  ATM_DEMO_ROLE,
} from '@/lib/atm-demo-access';

export interface MockCredential {
  email: string;
  password: string;
  role: ExtendedRole;
  full_name: string;
  avatar_url?: string;
}

/**
 * Credenciales mock SOLO en demo explícita o desarrollo local.
 * En builds de producción (NODE_ENV=production y DEMO_MODE≠true) el array
 * queda vacío para que un pentest no encuentre contraseñas en el bundle.
 */
const EMBED_MOCK_PASSWORDS =
  process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
  process.env.NODE_ENV !== 'production';

/** Credenciales de demostración — nunca usar en producción real. */
export const MOCK_CREDENTIALS: MockCredential[] = EMBED_MOCK_PASSWORDS
  ? [
      {
        email: 'info@ramondelpozorott.es',
        password: 'Benutzer555',
        role: 'superadmin',
        full_name: 'Ramón del Pozo Rott',
        avatar_url: '/images/ramon-del-pozo.png',
      },
      {
        email: 'charlie-r-k@hotmail.com',
        password: 'utileria2026',
        role: 'equipment_manager',
        full_name: 'Carlos Rodriguez Kobe',
        avatar_url: '/images/carlos-avatar.png',
      },
      {
        email: ATM_DEMO_EMAIL,
        password: ATM_DEMO_PASSWORD,
        role: ATM_DEMO_ROLE,
        full_name: ATM_DEMO_FULL_NAME,
      },
      {
        email: 'marta.lopez@realmadrid.com',
        password: 'asistente2026',
        role: 'assistant',
        full_name: 'Marta López',
      },
      {
        email: 'dr.flores@realmadrid.com',
        password: 'medico2026',
        role: 'medical',
        full_name: 'Dr. Xavier Flores',
      },
      {
        email: 'scariolo@realmadrid.com',
        password: 'entrenador2026',
        role: 'coach',
        full_name: 'Sergio Scariolo',
      },
    ]
  : [];

export const BIOMETRIC_QUICK_ACCESS = [
  {
    email: 'info@ramondelpozorott.es',
    name: 'Ramón del Pozo Rott',
    shortName: 'Ramón',
    avatar: '/images/ramon-del-pozo.png',
  },
  {
    email: 'charlie-r-k@hotmail.com',
    name: 'Carlos Rodriguez Kobe',
    shortName: 'Carlos',
    avatar: '/images/carlos-avatar.png',
  },
] as const;

const PASSWORD_OVERRIDE_KEY = 'cm_password_override';

function readPasswordOverrides(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(PASSWORD_OVERRIDE_KEY) || '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

export function getMockPassword(email: string): string | undefined {
  const normalized = email.trim().toLowerCase();
  const cred = MOCK_CREDENTIALS.find((c) => c.email.toLowerCase() === normalized);
  if (!cred) return undefined;
  const overrides = readPasswordOverrides();
  return overrides[normalized] ?? cred.password;
}

export function setMockPasswordOverride(email: string, password: string): void {
  if (typeof window === 'undefined') return;
  const normalized = email.trim().toLowerCase();
  const overrides = readPasswordOverrides();
  overrides[normalized] = password;
  localStorage.setItem(PASSWORD_OVERRIDE_KEY, JSON.stringify(overrides));
}

export function findMockCredential(email: string, password: string): MockCredential | undefined {
  const normalized = email.trim().toLowerCase();
  const cred = MOCK_CREDENTIALS.find((c) => c.email.toLowerCase() === normalized);
  if (!cred) return undefined;
  const expected = getMockPassword(email);
  if (password !== expected) return undefined;
  return cred;
}

export const AUTH_COOKIE = 'cm_auth';
export const ROLE_COOKIE = 'cm_role';

export function setAuthCookies(role: string) {
  const maxAge = 60 * 60 * 24;
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookies() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`;
}
