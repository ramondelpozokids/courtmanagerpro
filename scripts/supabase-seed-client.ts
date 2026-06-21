import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import ws from 'ws';

/** Cliente Supabase para scripts Node (service role, sin sesión, con WebSocket en Node 20). */
export function createSeedClient(url: string, serviceKey: string): SupabaseClient {
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { transport: ws as unknown as typeof WebSocket },
  });
}
