/**
 * Pruebas de acceso biométrico (WebAuthn) en producción.
 *
 * Uso:
 *   npx tsx scripts/test-webauthn.ts
 *   npx tsx scripts/test-webauthn.ts --password "tu-contraseña"
 *   npx tsx scripts/test-webauthn.ts --base http://localhost:3000
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { createSeedClient } from './supabase-seed-client';

const CARLOS_EMAIL = 'charlie-r-k@hotmail.com';

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function main() {
  loadEnvFile();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const base = arg('--base') || 'http://localhost:3000';
  const password = arg('--password') || process.env.TEST_BIOMETRIC_PASSWORD;

  console.log('\n=== CourtManager Pro — Test acceso biométrico ===\n');

  let passed = 0;
  let failed = 0;

  function ok(label: string, detail?: string) {
    passed++;
    console.log(`✓ ${label}${detail ? ` — ${detail}` : ''}`);
  }

  function fail(label: string, detail?: string) {
    failed++;
    console.log(`✗ ${label}${detail ? ` — ${detail}` : ''}`);
  }

  // 1. Variables de entorno
  if (url && !url.includes('dummy') && !url.includes('tu-proyecto')) {
    ok('Supabase URL configurada');
  } else {
    fail('Supabase URL configurada', url || 'vacía');
  }

  if (anonKey && anonKey.length > 20) ok('Anon key configurada');
  else fail('Anon key configurada');

  if (serviceKey && serviceKey.length > 20) ok('Service role key configurada');
  else fail('Service role key configurada');

  // 2. Tabla webauthn_passkeys
  if (serviceKey && url) {
    const admin = createSeedClient(url, serviceKey);
    const { error } = await admin.from('webauthn_passkeys').select('id').limit(1);
    if (error) fail('Tabla webauthn_passkeys', error.message);
    else ok('Tabla webauthn_passkeys existe');
  }

  // 3. Perfil Carlos
  if (serviceKey && url) {
    const admin = createSeedClient(url, serviceKey);
    const { data, error } = await admin
      .from('profiles')
      .select('email, full_name, role')
      .eq('email', CARLOS_EMAIL)
      .maybeSingle();
    if (error || !data) fail('Perfil Carlos en Supabase', error?.message || 'no encontrado');
    else ok('Perfil Carlos en Supabase', `${data.full_name} (${data.role})`);
  }

  // 4. API status
  try {
    const res = await fetch(`${base}/api/auth/webauthn/status`);
    if (res.ok) {
      const status = await res.json();
      ok('GET /api/auth/webauthn/status', JSON.stringify(status));
    } else {
      fail('GET /api/auth/webauthn/status', `HTTP ${res.status}`);
    }
  } catch (e: any) {
    fail('GET /api/auth/webauthn/status', e.message);
  }

  // 5. Contraseña incorrecta → 401
  try {
    const res = await fetch(`${base}/api/auth/webauthn/register-options`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: base },
      body: JSON.stringify({ email: CARLOS_EMAIL, password: '__wrong_password__' }),
    });
    if (res.status === 401) ok('Contraseña incorrecta rechazada (401)');
    else fail('Contraseña incorrecta rechazada', `HTTP ${res.status}`);
  } catch (e: any) {
    fail('Contraseña incorrecta rechazada', e.message);
  }

  // 6. Contraseña demo antigua → 401 (no debe aceptar utileria2026 en producción)
  try {
    const res = await fetch(`${base}/api/auth/webauthn/register-options`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: base },
      body: JSON.stringify({ email: CARLOS_EMAIL, password: 'utileria2026' }),
    });
    if (res.status === 401) ok('Contraseña demo utileria2026 rechazada en producción');
    else if (res.status === 200) fail('Contraseña demo utileria2026 rechazada', 'aceptada (bug)');
    else fail('Contraseña demo utileria2026 rechazada', `HTTP ${res.status}`);
  } catch (e: any) {
    fail('Contraseña demo utileria2026 rechazada', e.message);
  }

  // 7. Contraseña real (opcional)
  if (password && anonKey && url) {
    const auth = createSeedClient(url, anonKey);
    const { error } = await auth.auth.signInWithPassword({ email: CARLOS_EMAIL, password });
    if (error) fail('Login Supabase Carlos', error.message);
    else ok('Login Supabase Carlos con contraseña proporcionada');

    try {
      const res = await fetch(`${base}/api/auth/webauthn/register-options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: base },
        body: JSON.stringify({ email: CARLOS_EMAIL, password }),
      });
      if (res.status === 200) {
        const body = await res.json();
        ok('register-options con contraseña real', `challenge=${String(body.challenge).slice(0, 12)}...`);
      } else {
        const err = await res.json().catch(() => ({}));
        fail('register-options con contraseña real', `${res.status}: ${err.error || 'error'}`);
      }
    } catch (e: any) {
      fail('register-options con contraseña real', e.message);
    }
  } else {
    console.log('○ Sin --password: omitida prueba de contraseña real (pasa --password "..." para probarla)');
  }

  console.log(`\n--- Resultado: ${passed} OK, ${failed} FAIL ---\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
