/**
 * Crea / actualiza la cuenta de evaluación ATM (Atleti Lab).
 *
 * Uso:
 *   npx tsx scripts/setup-atm-demo.ts
 *   npx tsx scripts/setup-atm-demo.ts --password "123456"
 *
 * En Vercel producción: ATM_DEMO_ENABLED=true (y opcional NEXT_PUBLIC_ATM_DEMO_HINT=true)
 * Tras la evaluación: ATM_DEMO_ENABLED=false
 *
 * Requiere .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createSeedClient } from './supabase-seed-client';
import {
  ATM_DEMO_EMAIL,
  ATM_DEMO_FULL_NAME,
  ATM_DEMO_PASSWORD,
  ATM_DEMO_ROLE,
  ATM_DEMO_TEAM_ID,
} from '../src/lib/atm-demo-access';

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
  const password = arg('--password') || process.env.ATM_DEMO_PASSWORD || ATM_DEMO_PASSWORD;

  if (!url || !serviceKey) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  }

  const supabase = createSeedClient(url, serviceKey);

  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (listError) throw listError;

  let userId = listData.users.find((u) => u.email?.toLowerCase() === ATM_DEMO_EMAIL)?.id;

  if (!userId) {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: ATM_DEMO_EMAIL,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: ATM_DEMO_FULL_NAME,
        atm_demo: true,
      },
    });
    if (createError) throw createError;
    userId = created.user.id;
    console.log('✓ Usuario Auth creado:', ATM_DEMO_EMAIL);
  } else {
    console.log('✓ Usuario Auth ya existe:', ATM_DEMO_EMAIL);
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password,
      user_metadata: { full_name: ATM_DEMO_FULL_NAME, atm_demo: true },
    });
    if (updateError) throw updateError;
    console.log('✓ Contraseña actualizada');
  }

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: userId,
      email: ATM_DEMO_EMAIL,
      full_name: ATM_DEMO_FULL_NAME,
      role: ATM_DEMO_ROLE,
      department: 'Evaluación Atleti Lab',
      is_active: true,
    },
    { onConflict: 'id' }
  );
  if (profileError) throw profileError;
  console.log('✓ Perfil profiles (equipment_manager — NO superadmin)');

  // Quitar vínculos a otros equipos: solo ATM
  await supabase.from('user_teams').delete().eq('user_id', userId);

  const { error: teamError } = await supabase.from('user_teams').insert({
    user_id: userId,
    team_id: ATM_DEMO_TEAM_ID,
    role: ATM_DEMO_ROLE,
    is_active: true,
  });
  if (teamError && !/duplicate|unique/i.test(teamError.message)) throw teamError;
  console.log('✓ user_teams: SOLO Atlético de Madrid (ATM)');

  console.log('\n✅ Cuenta demo ATM lista (sin superadmin):');
  console.log('   Email:', ATM_DEMO_EMAIL);
  console.log('   Contraseña:', password);
  console.log('   Equipo: ATM', ATM_DEMO_TEAM_ID);
  console.log('   Vercel: ATM_DEMO_ENABLED=true');
  console.log('   Tras evaluación: ATM_DEMO_ENABLED=false\n');
}

main().catch((err: unknown) => {
  console.error('\n❌ Error:', (err as Error).message);
  process.exit(1);
});
