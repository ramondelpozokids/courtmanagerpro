'use client';

import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { setAuthCookies } from '@/lib/auth-credentials';
import { isDemoMode } from '@/lib/app-mode';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import type { ExtendedRole } from '@/contexts/AuthContext';

export interface PasskeyLoginResult {
  role: ExtendedRole;
  email: string;
  full_name: string;
  avatar_url?: string;
}

const LOCAL_PASSKEY_PREFIX = 'cmp_passkey_local_';

export function hasLocalPasskey(email: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`${LOCAL_PASSKEY_PREFIX}${email.toLowerCase()}`) === '1';
}

export function markLocalPasskey(email: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${LOCAL_PASSKEY_PREFIX}${email.toLowerCase()}`, '1');
}

function getClientOrigin(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.location.origin;
}

function webauthnPayload(payload: Record<string, unknown>) {
  return {
    ...payload,
    origin: getClientOrigin(),
  };
}

export async function fetchBiometricStatus(): Promise<Record<string, boolean>> {
  const res = await fetch('/api/auth/webauthn/status');
  if (!res.ok) return {};
  return res.json();
}

export async function registerPasskey(email: string, password: string): Promise<void> {
  const optionsRes = await fetch('/api/auth/webauthn/register-options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webauthnPayload({ email, password })),
  });
  if (!optionsRes.ok) {
    const err = await optionsRes.json();
    throw new Error(err.error || 'No se pudo iniciar el registro biométrico');
  }
  const options = await optionsRes.json();

  const attestation = await startRegistration({ optionsJSON: options });

  const verifyRes = await fetch('/api/auth/webauthn/register-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webauthnPayload({ email, response: attestation })),
  });
  if (!verifyRes.ok) {
    const err = await verifyRes.json();
    throw new Error(err.error || 'No se pudo verificar el registro biométrico');
  }

  markLocalPasskey(email);
}

export async function loginWithPasskey(email: string, discoverable = false): Promise<PasskeyLoginResult> {
  const optionsRes = await fetch('/api/auth/webauthn/login-options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webauthnPayload({ email, discoverable })),
  });
  if (!optionsRes.ok) {
    const err = await optionsRes.json();
    throw new Error(err.error || 'Acceso biométrico no disponible');
  }
  const options = await optionsRes.json();

  let assertion;
  try {
    assertion = await startAuthentication({ optionsJSON: options });
  } catch (err) {
    if (!discoverable) {
      return loginWithPasskey(email, true);
    }
    throw err;
  }

  const verifyRes = await fetch('/api/auth/webauthn/login-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webauthnPayload({ email, response: assertion })),
  });
  if (!verifyRes.ok) {
    const err = await verifyRes.json();
    throw new Error(err.error || 'Autenticación biométrica fallida');
  }

  const user = await verifyRes.json();

  if (!isDemoMode() && user.access_token && user.refresh_token) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.setSession({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    });
    if (error) throw new Error(error.message);
  } else {
    setAuthCookies(user.role);
  }

  markLocalPasskey(email);

  return {
    role: user.role,
    email: user.email,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
  };
}

export async function isWebAuthnSupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  return typeof window.PublicKeyCredential === 'function';
}

export function isWebAuthnSupportedSync(): boolean {
  return typeof window !== 'undefined'
    && window.PublicKeyCredential !== undefined
    && typeof window.PublicKeyCredential === 'function';
}
