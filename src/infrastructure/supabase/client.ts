import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { supabaseUrl, supabaseAnonKey } from '@/infrastructure/supabase/env';

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

let browserClient: ReturnType<typeof createSupabaseBrowserClient> | null = null;

export function getSupabaseClient() {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient();
  }
  return browserClient;
}
