import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-project.supabase.co';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-key';

// Clean leading/trailing spaces and surrounding quotes if any
const supabaseUrl = rawUrl.trim().replace(/^['"]|['"]$/g, '');
const supabaseKey = rawKey.trim().replace(/^['"]|['"]$/g, '');

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey
  );
}

// Singleton para uso en hooks
let browserClient: ReturnType<typeof createSupabaseBrowserClient> | null = null;

export function getSupabaseClient() {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient();
  }
  return browserClient;
}
