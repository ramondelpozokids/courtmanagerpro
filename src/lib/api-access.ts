import type { Profile } from '@/types';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { enrichProfileWithSuperadmin } from '@/lib/production-auth-fallback';
import { resolveUserAccess } from '@/lib/permissions';

/** Perfil de API con rol superadmin elevado por email (Ramón). */
export async function getApiUserAccess() {
  const supabase = (await createSupabaseServerClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, access: null, response: { status: 401 as const } };
  }

  const { data: profileRow } = await supabase
    .from('profiles')
    .select('role, email, full_name')
    .eq('id', user.id)
    .maybeSingle();

  const email = profileRow?.email ?? user.email ?? null;
  const access = resolveUserAccess(profileRow?.role, email);

  return { supabase, user, access, profileRow, response: null };
}

export function profileFromApiUser(
  profileRow: { role: string; email: string; full_name?: string } | null,
  authEmail?: string | null
) {
  if (!profileRow) return null;
  return enrichProfileWithSuperadmin(profileRow as Profile, authEmail);
}
