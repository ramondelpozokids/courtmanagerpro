import { createClient } from '@supabase/supabase-js';
import { findMockCredential } from '@/lib/auth-credentials';
import { isProductionApp } from '@/lib/app-mode';
import { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey } from '@/infrastructure/supabase/env';

export interface VerifiedBiometricUser {
  full_name: string;
  displayName: string;
}

/** Verifica email+contraseña para registrar passkey (mock en demo, Supabase Auth en producción). */
export async function verifyBiometricUserPassword(
  email: string,
  password: string
): Promise<VerifiedBiometricUser | null> {
  const normalized = email.trim().toLowerCase();

  if (!isProductionApp()) {
    const cred = findMockCredential(normalized, password);
    if (!cred) return null;
    return { full_name: cred.full_name, displayName: cred.full_name };
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: authData, error } = await authClient.auth.signInWithPassword({
    email: normalized,
    password,
  });
  if (error || !authData.user) return null;

  const admin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: profile } = await admin
    .from('profiles')
    .select('full_name, email')
    .eq('id', authData.user.id)
    .maybeSingle();

  const full_name = profile?.full_name || normalized;
  return { full_name, displayName: full_name };
}

/** Crea sesión Supabase tras verificar passkey (solo producción). */
export async function createSupabaseSessionForEmail(
  email: string
): Promise<{ access_token: string; refresh_token: string } | null> {
  const normalized = email.trim().toLowerCase();
  const admin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: linkData, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: normalized,
  });
  if (error || !linkData?.properties?.hashed_token) return null;

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: sessionData, error: verifyError } = await authClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'email',
  });

  if (!verifyError && sessionData.session) {
    return {
      access_token: sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
    };
  }

  const { data: magicSession, error: magicError } = await authClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });

  if (magicError || !magicSession.session) return null;

  return {
    access_token: magicSession.session.access_token,
    refresh_token: magicSession.session.refresh_token,
  };
}
