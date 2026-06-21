import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';
import {
  supabaseUrl,
  supabaseAnonKey,
  supabaseServiceRoleKey,
} from '@/infrastructure/supabase/env';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

export function createSupabaseAdminClient() {
  return createServerClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
