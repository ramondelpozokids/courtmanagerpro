import { createSupabaseAdminClient, createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { supabaseServiceRoleKey } from '@/infrastructure/supabase/env';

function hasRealServiceRole(): boolean {
  return Boolean(
    supabaseServiceRoleKey &&
      supabaseServiceRoleKey.length > 40 &&
      !supabaseServiceRoleKey.includes('dummy')
  );
}

/**
 * Cliente para leer/escribir datos del club en producción.
 * Tras comprobar sesión y pertenencia, usa service role para que
 * RLS no descarte los cambios de Carlos (admin operativo).
 */
export async function getClubDataWriteClient() {
  if (hasRealServiceRole()) return createSupabaseAdminClient();
  return createSupabaseServerClient();
}
