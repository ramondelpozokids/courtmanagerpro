/**
 * Seed Real Madrid roster into Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed-roster.ts          # upsert via service role
 *   npx tsx scripts/seed-roster.ts --sql     # print SQL to stdout
 *
 * Requires .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { buildRosterSeedRows, buildRosterSeedSql } from '../src/lib/roster-seed';
import { DEFAULT_TEAM_ID } from '../src/lib/team-constants';

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

async function main() {
  const printSql = process.argv.includes('--sql');

  if (printSql) {
    console.log(buildRosterSeedSql());
    return;
  }

  loadEnvFile();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: teamError } = await supabase.from('teams').upsert({
    id: DEFAULT_TEAM_ID,
    name: 'Real Madrid Baloncesto',
    short_name: 'RMB',
    season: '2025-2026',
    league: 'ACB',
    primary_color: '#FFFFFF',
    secondary_color: '#2C3E50',
    is_active: true,
    metadata: { legacy_slug: 'team-acb-123' },
  });

  if (teamError) {
    console.error('Team seed failed:', teamError.message);
    process.exit(1);
  }

  const rows = buildRosterSeedRows();
  const { error: playersError } = await supabase.from('players').upsert(rows, {
    onConflict: 'team_id,dorsal',
  });

  if (playersError) {
    console.error('Players seed failed:', playersError.message);
    process.exit(1);
  }

  console.log(`Seeded team + ${rows.length} players successfully.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
