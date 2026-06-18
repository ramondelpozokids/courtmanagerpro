import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-project.supabase.co';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-key';

// Clean leading/trailing spaces and surrounding quotes if any
const supabaseUrl = rawUrl.trim().replace(/^['"]|['"]$/g, '');
const supabaseKey = rawKey.trim().replace(/^['"]|['"]$/g, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-service-role-key';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

// Admin client (solo server-side, usa service_role)
export function createSupabaseAdminClient() {
  return createServerClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}
