/**
 * Fuerza sync de plantilla oficial RM → Supabase (service role).
 * Uso: npx tsx scripts/force-roster-sync-prod.ts
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { DEFAULT_TEAM_ID } from '../src/lib/team-constants';
import { runRosterSync } from '../src/application/roster-sync/runSync';
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
  process.env.NEXT_PUBLIC_DEMO_MODE = 'false';

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createSeedClient(url, serviceKey);

  console.log('Sincronizando plantilla oficial → Supabase…');
  const result = await runRosterSync({
    supabase: supabase as any,
    options: {
      teamId: DEFAULT_TEAM_ID,
      trigger: 'manual',
      force: true,
      skipIfRecentHours: 0,
    },
    downloadPhotos: false,
  });

  console.log(JSON.stringify(result, null, 2));

  const { data: players, error: pErr } = await supabase
    .from('players')
    .select('full_name, dorsal, is_active, official_slug')
    .eq('team_id', DEFAULT_TEAM_ID)
    .eq('is_active', true)
    .order('dorsal');

  const { data: staff, error: sErr } = await supabase
    .from('coaching_staff')
    .select('full_name, role, is_active, official_slug')
    .eq('team_id', DEFAULT_TEAM_ID)
    .eq('is_active', true);

  if (pErr) console.error('players error', pErr.message);
  if (sErr) console.error('staff error', sErr.message);

  console.log('\nJugadores activos:', players?.length ?? 0);
  for (const p of players || []) {
    console.log(`  #${p.dorsal ?? '-'} ${p.full_name} (${p.official_slug || 'sin slug'})`);
  }
  console.log('\nCuerpo técnico activo:', staff?.length ?? 0);
  for (const s of staff || []) {
    console.log(`  ${s.role}: ${s.full_name} (${s.official_slug || 'sin slug'})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
