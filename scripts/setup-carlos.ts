/**
 * Crear o verificar usuario Carlos (utilería RMB) en Supabase Auth.
 *
 * Uso:
 *   npx tsx scripts/setup-carlos.ts
 *   npx tsx scripts/setup-carlos.ts --password "utileria2026"
 *
 * Requiere .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createSeedClient } from './supabase-seed-client';
import { DEFAULT_TEAM_ID } from '../src/lib/team-constants';
import { CARLOS_EMAIL } from '../src/lib/permissions';

const DEFAULT_PASSWORD = 'utileria2026';

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
  const password = arg('--password') || process.env.CARLOS_PASSWORD || DEFAULT_PASSWORD;

  if (!url || !serviceKey) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  }

  const supabase = createSeedClient(url, serviceKey);

  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (listError) throw listError;

  let userId = listData.users.find((u) => u.email?.toLowerCase() === CARLOS_EMAIL)?.id;

  if (!userId) {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: CARLOS_EMAIL,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Carlos Rodriguez Kobe' },
    });
    if (createError) throw createError;
    userId = created.user.id;
    console.log('✓ Usuario Auth creado:', CARLOS_EMAIL);
  } else {
    console.log('✓ Usuario Auth ya existe:', CARLOS_EMAIL);
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, { password });
    if (updateError) throw updateError;
    console.log('✓ Contraseña actualizada');
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    email: CARLOS_EMAIL,
    full_name: 'Carlos Rodriguez Kobe',
    role: 'equipment_manager',
    department: 'Utilería Principal',
    is_active: true,
    avatar_url: '/images/carlos_kobe.png',
  }, { onConflict: 'id' });
  if (profileError) throw profileError;
  console.log('✓ Perfil profiles vinculado');

  const { error: teamError } = await supabase.from('user_teams').upsert({
    user_id: userId,
    team_id: DEFAULT_TEAM_ID,
    role: 'equipment_manager',
    is_active: true,
  }, { onConflict: 'user_id,team_id' });
  if (teamError && !teamError.message.includes('duplicate')) {
    const { error: insertTeamError } = await supabase.from('user_teams').insert({
      user_id: userId,
      team_id: DEFAULT_TEAM_ID,
      role: 'equipment_manager',
      is_active: true,
    });
    if (insertTeamError && !insertTeamError.message.includes('duplicate')) throw insertTeamError;
  }
  console.log('✓ user_teams vinculado al RMB');

  console.log('\n✅ Carlos listo para entrar en producción:');
  console.log('   Email:', CARLOS_EMAIL);
  console.log('   Contraseña:', password);
  console.log('   URL: https://courtmanagerpro.vercel.app/login\n');
}

main().catch((err: unknown) => {
  console.error('\n❌ Error:', (err as Error).message);
  process.exit(1);
});
