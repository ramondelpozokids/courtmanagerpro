/**
 * Sincroniza la ficha oficial de Pedro Martínez en coaching_staff.
 * Fuente: https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/pedro-martinez
 *
 * Uso: npx tsx scripts/sync-pedro-martinez-staff.ts
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { DEFAULT_TEAM_ID } from '../src/lib/team-constants';
import { createSeedClient } from './supabase-seed-client';
import { getOfficialStaffBySlug } from '../src/data/rmb-official-roster';

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
  const st = getOfficialStaffBySlug('pedro-martinez');
  if (!st) {
    console.error('No se encontró pedro-martinez en el roster oficial');
    process.exit(1);
  }

  const sb = createSeedClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const notes = {
    demo_id: st.legacyId,
    official_slug: st.slug,
    source: 'realmadrid.com',
    profile_url: st.profile_url,
    birth_date: st.birth_date,
    birth_place: st.birth_place,
    trajectory: st.trajectory,
    trajectory_items: st.trajectory_items,
    palmares: st.palmares,
    season: '2026-2027',
  };

  const payload = {
    full_name: st.full_name,
    role: st.role || 'Entrenador',
    photo_url: st.photo_url,
    nationality: st.nationality || 'España',
    is_active: true,
    notes: JSON.stringify(notes),
    updated_at: new Date().toISOString(),
  };

  const { data: staff, error } = await sb
    .from('coaching_staff')
    .select('id, full_name, is_active')
    .eq('team_id', DEFAULT_TEAM_ID);

  if (error) throw new Error(error.message);

  const match = (staff || []).find((s) => norm(s.full_name) === norm(st.full_name));
  if (match) {
    const { error: upErr } = await sb
      .from('coaching_staff')
      .update(payload)
      .eq('id', match.id);
    if (upErr) throw new Error(upErr.message);
    console.log('Actualizado:', st.full_name, match.id);
  } else {
    const { error: inErr } = await sb.from('coaching_staff').insert({
      team_id: DEFAULT_TEAM_ID,
      ...payload,
    });
    if (inErr) throw new Error(inErr.message);
    console.log('Alta:', st.full_name);
  }

  console.log('Ficha:', st.profile_url);
  console.log('Nacimiento:', st.birth_date, '·', st.birth_place);
  console.log('Palmarés:', st.palmares.join(' · '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
