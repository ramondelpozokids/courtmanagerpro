/**
 * Actualiza players + coaching_staff en Supabase con la plantilla oficial
 * (sin columnas de migración 008 que aún no están en prod).
 *
 * Uso: npx tsx scripts/upsert-official-roster-now.ts
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { DEFAULT_TEAM_ID, demoPlayerIdToUuid } from '../src/lib/team-constants';
import { createSeedClient } from './supabase-seed-client';
import {
  RMB_OFFICIAL_PLAYERS,
  RMB_OFFICIAL_STAFF,
} from '../src/data/rmb-official-roster';
import { buildPlayerMetadataExtras } from '../src/lib/player-profile';
import { buildRmbDemoPlayersFromOfficial } from '../src/lib/build-rmb-demo-roster';

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

function mapDbPosition(pos: string | null | undefined): string {
  const p = String(pos || 'alero')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-/g, '_');
  if (p === 'ala_pivot' || (p.includes('ala') && p.includes('pivot'))) return 'ala_pivot';
  if (p.includes('pivot')) return 'pivot';
  if (p.includes('escolta')) return 'escolta';
  if (p.includes('base')) return 'base';
  if (p.includes('alero')) return 'alero';
  return 'alero';
}

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

async function main() {
  loadEnvFile();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Faltan credenciales Supabase en .env.local');
    process.exit(1);
  }

  const sb = createSeedClient(url, key);
  const demoPlayers = buildRmbDemoPlayersFromOfficial();

  await sb.from('teams').upsert({
    id: DEFAULT_TEAM_ID,
    name: 'Real Madrid Baloncesto',
    short_name: 'RMB',
    season: '2026-2027',
    league: 'ACB',
    primary_color: '#FFFFFF',
    secondary_color: '#2C3E50',
    is_active: true,
  });

  const { data: existing, error: exErr } = await sb
    .from('players')
    .select('id, full_name, dorsal, is_active')
    .eq('team_id', DEFAULT_TEAM_ID);
  if (exErr) throw new Error(exErr.message);

  const keepDorsals = new Set(demoPlayers.map((p) => p.number));
  let freeIdx = 0;
  for (const row of existing || []) {
    if (!keepDorsals.has(row.dorsal)) {
      const { error } = await sb
        .from('players')
        .update({
          is_active: false,
          dorsal: 9000 + freeIdx++,
          updated_at: new Date().toISOString(),
        })
        .eq('id', row.id);
      if (error) console.warn('deactivate', row.full_name, error.message);
      else console.log('Baja:', row.full_name);
    }
  }

  const { data: afterFree } = await sb
    .from('players')
    .select('id, full_name, dorsal')
    .eq('team_id', DEFAULT_TEAM_ID);

  const byDorsal = new Map((afterFree || []).map((p) => [p.dorsal, p]));
  const byName = new Map((afterFree || []).map((p) => [norm(p.full_name), p]));

  for (const demo of demoPlayers) {
    const official = RMB_OFFICIAL_PLAYERS.find((p) => p.legacyId === demo.id);
    const payload = {
      team_id: DEFAULT_TEAM_ID,
      dorsal: demo.number,
      full_name: `${demo.firstName} ${demo.lastName}`.trim(),
      position: mapDbPosition(demo.position),
      nationality: demo.nationality || 'España',
      birth_date: demo.birthDate || null,
      photo_url: demo.imageUrl || null,
      is_active: true,
      shirt_size: demo.sizes?.jersey || null,
      shorts_size: demo.sizes?.shorts || null,
      shoe_size: Number(demo.sizes?.shoes) || null,
      jacket_size: demo.sizes?.warmupShirt || null,
      sock_size: demo.sizes?.socks || null,
      jersey_name: (demo.lastName || '').toUpperCase() || null,
      contract_end: '2027-06-30',
      metadata: {
        ...buildPlayerMetadataExtras(demo),
        official_slug: demo.slug || official?.slug || null,
        source: 'realmadrid.com',
        season: '2026-2027',
      },
      updated_at: new Date().toISOString(),
    };

    const existingRow =
      byDorsal.get(demo.number) || byName.get(norm(payload.full_name));

    if (existingRow) {
      const { error } = await sb.from('players').update(payload).eq('id', existingRow.id);
      if (error) console.error('update fail', payload.full_name, error.message);
      else console.log('Actualizado:', payload.full_name, `#${payload.dorsal}`);
    } else {
      const { error } = await sb.from('players').insert({
        id: demoPlayerIdToUuid(demo.id),
        ...payload,
      });
      if (error) {
        // retry without fixed id
        const { error: e2 } = await sb.from('players').insert(payload);
        if (e2) console.error('insert fail', payload.full_name, e2.message);
        else console.log('Alta:', payload.full_name, `#${payload.dorsal}`);
      } else {
        console.log('Alta:', payload.full_name, `#${payload.dorsal}`);
      }
    }
  }

  // Staff: desactivar todos y dejar solo oficiales
  const { data: oldStaff } = await sb
    .from('coaching_staff')
    .select('id, full_name')
    .eq('team_id', DEFAULT_TEAM_ID);
  for (const s of oldStaff || []) {
    await sb
      .from('coaching_staff')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', s.id);
    console.log('Staff baja:', s.full_name);
  }

  for (const st of RMB_OFFICIAL_STAFF) {
    const row = {
      team_id: DEFAULT_TEAM_ID,
      full_name: st.full_name,
      role: st.role || 'Entrenador',
      photo_url: st.photo_url || null,
      nationality: st.nationality || 'España',
      is_active: true,
      metadata: {
        official_slug: st.slug,
        source: 'realmadrid.com',
        trajectory: st.trajectory,
        palmares: st.palmares,
        birth_date: st.birth_date,
        season: '2026-2027',
      },
      updated_at: new Date().toISOString(),
    };
    const match = (oldStaff || []).find((s) => norm(s.full_name) === norm(st.full_name));
    if (match) {
      const { error } = await sb.from('coaching_staff').update(row).eq('id', match.id);
      if (error) console.error('staff update', error.message);
      else console.log('Staff actualizado:', st.full_name);
    } else {
      const { error } = await sb.from('coaching_staff').insert(row);
      if (error) console.error('staff insert', error.message);
      else console.log('Staff alta:', st.full_name);
    }
  }

  const { data: finalP } = await sb
    .from('players')
    .select('full_name, dorsal, is_active')
    .eq('team_id', DEFAULT_TEAM_ID)
    .eq('is_active', true)
    .order('dorsal');
  const { data: finalS } = await sb
    .from('coaching_staff')
    .select('full_name, role, is_active')
    .eq('team_id', DEFAULT_TEAM_ID)
    .eq('is_active', true);

  console.log('\n=== PLANTILLA ACTIVA 2026-2027 ===');
  for (const p of finalP || []) console.log(`#${p.dorsal} ${p.full_name}`);
  console.log('--- Staff ---');
  for (const s of finalS || []) console.log(`${s.role}: ${s.full_name}`);
  console.log(`Total jugadores: ${finalP?.length || 0} | staff: ${finalS?.length || 0}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
