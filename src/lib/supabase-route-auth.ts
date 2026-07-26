import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { isProductionApp } from '@/lib/app-mode';

export async function requireApiUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      supabase,
      user: null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return { supabase, user, response: null as NextResponse | null };
}

/**
 * En producción exige sesión. En demo/mock no bloquea (InMemory local).
 * Usar al inicio de handlers de datos.
 */
export async function requireProductionApiUser() {
  if (!isProductionApp()) {
    return { supabase: null as Awaited<ReturnType<typeof createSupabaseServerClient>> | null, user: null, response: null as NextResponse | null };
  }
  return requireApiUser();
}

export function isServerProduction(): boolean {
  return isProductionApp();
}

/**
 * Cron en producción: solo Authorization Bearer CRON_SECRET.
 * No confiar en x-vercel-cron (spoofable). Vercel envía el Bearer si CRON_SECRET está definido.
 */
export function isCronAuthorized(req: NextRequest): boolean {
  if (!isProductionApp()) return true;
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return req.headers.get('authorization') === `Bearer ${secret}`;
}
