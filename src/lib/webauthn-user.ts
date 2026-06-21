import { createClient } from '@supabase/supabase-js';
import { MOCK_CREDENTIALS } from '@/lib/auth-credentials';
import { isProductionApp } from '@/lib/app-mode';
import { supabaseUrl, supabaseServiceRoleKey } from '@/infrastructure/supabase/env';
import { isSuperadminUser } from '@/lib/permissions';
import type { ExtendedRole } from '@/contexts/AuthContext';

export interface BiometricLoginUser {
  role: ExtendedRole;
  email: string;
  full_name: string;
  avatar_url?: string;
}

/** Datos de usuario tras login biométrico (mock o perfil Supabase). */
export async function getBiometricLoginUser(email: string): Promise<BiometricLoginUser | null> {
  const normalized = email.trim().toLowerCase();

  if (!isProductionApp()) {
    const cred = MOCK_CREDENTIALS.find((c) => c.email.toLowerCase() === normalized);
    if (!cred) return null;
    return {
      role: cred.role,
      email: cred.email,
      full_name: cred.full_name,
      avatar_url: cred.avatar_url,
    };
  }

  const admin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: profile } = await admin
    .from('profiles')
    .select('email, full_name, avatar_url, role')
    .eq('email', normalized)
    .maybeSingle();

  if (!profile) return null;

  const role = isSuperadminUser(null, profile.email)
    ? ('superadmin' as ExtendedRole)
    : (profile.role as ExtendedRole);

  return {
    role,
    email: profile.email,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url ?? undefined,
  };
}
