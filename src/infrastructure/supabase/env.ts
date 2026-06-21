const FALLBACK_URL = 'https://dummy-project.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QifQ.dummy-key';
const FALLBACK_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QifQ.dummy-service-role-key';

function cleanEnv(value: string | undefined): string {
  return (value || '').trim().replace(/^['"]|['"]$/g, '');
}

/** URL válida para @supabase/supabase-js; fallback en build si Vercel env está mal. */
export function resolveSupabaseUrl(raw?: string): string {
  const cleaned = cleanEnv(raw);
  if (!cleaned || cleaned.includes('tu-proyecto') || cleaned.includes('your-project')) {
    return FALLBACK_URL;
  }
  try {
    const url = new URL(cleaned);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return FALLBACK_URL;
    return `${url.protocol}//${url.host}`;
  } catch {
    return FALLBACK_URL;
  }
}

export function resolveSupabaseAnonKey(raw?: string): string {
  const cleaned = cleanEnv(raw);
  if (!cleaned || cleaned.includes('dummy-key') || cleaned.length < 20) {
    return FALLBACK_ANON_KEY;
  }
  return cleaned;
}

export function resolveSupabaseServiceKey(raw?: string): string {
  const cleaned = cleanEnv(raw);
  if (!cleaned || cleaned.length < 20) {
    return FALLBACK_SERVICE_KEY;
  }
  return cleaned;
}

export const supabaseUrl = resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const supabaseAnonKey = resolveSupabaseAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const supabaseServiceRoleKey = resolveSupabaseServiceKey(process.env.SUPABASE_SERVICE_ROLE_KEY);
