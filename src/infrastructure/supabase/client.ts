import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-key';

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
