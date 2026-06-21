/**
 * Prueba login Supabase de Ramón (misma lógica que la app en producción).
 * Uso: npx tsx scripts/test-login-ramon.ts
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { createSeedClient } from './supabase-seed-client';

const RAMON_EMAIL = 'info@ramondelpozorott.es';
const PASSWORD = 'Benutzer555';

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvFile();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE;

  console.log('\n=== Test login Ramón ===\n');
  console.log('Supabase URL:', url.replace(/https:\/\/([^.]+).*/, 'https://$1...'));
  console.log('DEMO_MODE:', demoMode ?? '(no definido)');

  if (!url || !anonKey) {
    console.error('❌ Faltan variables en .env.local');
    process.exit(1);
  }

  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { transport: ws as unknown as typeof WebSocket },
  });

  const { data, error } = await client.auth.signInWithPassword({
    email: RAMON_EMAIL,
    password: PASSWORD,
  });

  if (error) {
    console.error('❌ signInWithPassword:', error.message);
    process.exit(1);
  }

  console.log('✓ Login OK — user id:', data.user?.id);
  console.log('✓ Session:', data.session ? 'sí' : 'no');

  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('email, full_name, role')
    .eq('id', data.user!.id)
    .maybeSingle();

  if (profileError) {
    console.warn('⚠ Perfil (RLS anon):', profileError.message);
  } else if (profile) {
    console.log('✓ Perfil:', profile.full_name, `(${profile.role})`);
  } else {
    console.warn('⚠ Sin fila profiles (fallback en app debería funcionar igual)');
  }

  console.log('\nSi esto OK pero la web falla, Vercel usa otro Supabase o DEMO_MODE distinto.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
