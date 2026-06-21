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

  const full_name = profile?.full_name || authData.user.user_metadata?.full_name || normalized;
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

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: linkData, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: normalized,
  });
  if (error || !linkData?.properties) return null;

  const tokenHash = linkData.properties.hashed_token;
  if (tokenHash) {
    for (const type of ['magiclink', 'email'] as const) {
      const { data: sessionData, error: verifyError } = await authClient.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });
      if (!verifyError && sessionData.session) {
        return {
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
        };
      }
    }
  }

  const actionLink = linkData.properties.action_link;
  if (typeof actionLink === 'string' && actionLink.length > 0) {
    try {
      const url = new URL(actionLink);
      const token = url.searchParams.get('token');
      if (token) {
        for (const type of ['magiclink', 'email'] as const) {
          const { data: sessionData, error: verifyError } = await authClient.auth.verifyOtp({
            token_hash: token,
            type,
          });
          if (!verifyError && sessionData.session) {
            return {
              access_token: sessionData.session.access_token,
              refresh_token: sessionData.session.refresh_token,
            };
          }
        }
      }
    } catch {
      /* ignore malformed action link */
    }
  }

  return null;
}
