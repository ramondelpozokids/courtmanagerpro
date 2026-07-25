import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { DEFAULT_TEAM_ID } from '../src/lib/team-constants';
import { createSeedClient } from './supabase-seed-client';

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

  const p = await sb.from('players').select('*').eq('team_id', DEFAULT_TEAM_ID).limit(2);
  console.log('players error:', p.error?.message || null);
  console.log('sample keys:', p.data?.[0] ? Object.keys(p.data[0]) : []);
  console.log('sample count from limit2:', p.data?.length);

  const all = await sb
    .from('players')
    .select('id, full_name, dorsal, is_active')
    .eq('team_id', DEFAULT_TEAM_ID);
  console.log('all players:', all.data?.length, all.error?.message || '');
  for (const x of all.data || []) {
    console.log(`${x.is_active ? 'A' : 'I'} #${x.dorsal} ${x.full_name}`);
  }

  const s = await sb
    .from('coaching_staff')
    .select('id, full_name, role, is_active')
    .eq('team_id', DEFAULT_TEAM_ID);
  console.log('staff:', s.data?.length, s.error?.message || '');
  for (const x of s.data || []) {
    console.log(`${x.is_active ? 'A' : 'I'} ${x.role}: ${x.full_name}`);
  }

  for (const table of ['sync_log', 'roster_history', 'official_matches']) {
    const r = await sb.from(table).select('id').limit(1);
    console.log(`table ${table}:`, r.error ? `MISSING (${r.error.message})` : 'OK');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
