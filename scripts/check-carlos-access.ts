/**
 * Comprueba si Carlos existe en Supabase Auth (sin imprimir secretos).
 * Uso: npx tsx scripts/check-carlos-access.ts
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createSeedClient } from './supabase-seed-client';
import { CARLOS_EMAIL } from '../src/lib/permissions';
import { DEFAULT_TEAM_ID } from '../src/lib/team-constants';

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvFile();
  const sb = createSeedClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await sb.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;

  const user = data.users.find((u) => u.email?.toLowerCase() === CARLOS_EMAIL);
  console.log('email', CARLOS_EMAIL);
  console.log('auth_user', user ? 'SI' : 'NO');
  if (user) {
    console.log('confirmed', Boolean(user.email_confirmed_at));
    console.log('user_id', user.id);
  }

  if (user) {
    const { data: profile } = await sb
      .from('profiles')
      .select('email, full_name, role, is_active')
      .eq('id', user.id)
      .maybeSingle();
    console.log('profile', profile || 'NO');

    const { data: membership } = await sb
      .from('team_members')
      .select('team_id, role, is_active')
      .eq('user_id', user.id);
    console.log('memberships', membership?.length ?? 0, membership || []);
    console.log('default_team', DEFAULT_TEAM_ID);
  }

  console.log('demo_password_known', 'utileria2026 (auth-credentials / setup-carlos)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
