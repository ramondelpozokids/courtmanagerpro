import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { isProductionApp } from '@/lib/app-mode';

export async function requireApiUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  return { supabase, user, response: null as NextResponse | null };
}

export function isServerProduction(): boolean {
  return isProductionApp();
}
