/**
 * Crear o verificar usuario superadmin Ramón en Supabase Auth.
 *
 * Uso:
 *   npx tsx scripts/setup-superadmin.ts
 *   npx tsx scripts/setup-superadmin.ts --password "TuContraseñaSegura"
 *
 * Requiere .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createSeedClient } from './supabase-seed-client';
import { DEFAULT_TEAM_ID } from '../src/lib/team-constants';

const RAMON_EMAIL = 'info@ramondelpozorott.es';

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
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
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
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const password = arg('--password') || process.env.SUPERADMIN_PASSWORD || 'Benutzer555';

  if (!url || !serviceKey) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  }

  const supabase = createSeedClient(url, serviceKey);

  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (listError) throw listError;

  let userId = listData.users.find((u) => u.email?.toLowerCase() === RAMON_EMAIL)?.id;

  if (!userId) {
    if (!password) {
      console.error('\n❌ Ramón no existe en Supabase Auth.');
      console.error('Créalo con: npx tsx scripts/setup-superadmin.ts --password "TuContraseña"\n');
      process.exit(1);
    }

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: RAMON_EMAIL,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Ramón del Pozo Rott' },
    });
    if (createError) throw createError;
    userId = created.user.id;
    console.log('✓ Usuario Auth creado:', RAMON_EMAIL);
  } else {
    console.log('✓ Usuario Auth ya existe:', RAMON_EMAIL);
    if (password) {
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, { password });
      if (updateError) throw updateError;
      console.log('✓ Contraseña actualizada');
    }
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    email: RAMON_EMAIL,
    full_name: 'Ramón del Pozo Rott',
    role: 'admin',
    department: 'Superadmin',
    is_active: true,
    avatar_url: '/images/ramon-del-pozo.png',
  }, { onConflict: 'id' });
  if (profileError) throw profileError;
  console.log('✓ Perfil profiles vinculado');

  const { error: teamError } = await supabase.from('user_teams').upsert({
    user_id: userId,
    team_id: DEFAULT_TEAM_ID,
    role: 'admin',
    is_active: true,
  }, { onConflict: 'user_id,team_id' });
  if (teamError && !teamError.message.includes('duplicate')) {
    const { error: insertTeamError } = await supabase.from('user_teams').insert({
      user_id: userId,
      team_id: DEFAULT_TEAM_ID,
      role: 'admin',
      is_active: true,
    });
    if (insertTeamError && !insertTeamError.message.includes('duplicate')) throw insertTeamError;
  }
  console.log('✓ user_teams vinculado al RMB');

  console.log('\n✅ Ramón listo para entrar en producción:');
  console.log('   Email:    info@ramondelpozorott.es');
  console.log('   Password:', password);
  console.log('   URL:      https://courtmanagerpro.vercel.app/login\n');
}

main().catch((err: unknown) => {
  console.error('\n❌ Error:', (err as Error).message);
  process.exit(1);
});
