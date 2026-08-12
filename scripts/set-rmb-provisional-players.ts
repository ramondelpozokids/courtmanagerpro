/**
 * Sincroniza fotos y ficha provisional de jugadores RMB (Shulga, Sarr, …).
 * Uso: npx tsx scripts/set-rmb-provisional-players.ts
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createSeedClient } from './supabase-seed-client';
import { DEFAULT_TEAM_ID } from '../src/lib/team-constants';
import { RMB_PROVISIONAL_PLAYERS } from '../src/data/rmb-provisional-players';

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

function matchPlayer(
  rows: Array<{ id: string; full_name: string; metadata?: unknown }>,
  provisional: (typeof RMB_PROVISIONAL_PLAYERS)[number]
) {
  const slug = provisional.slug;
  const last = provisional.full_name.split(' ').pop()?.toLowerCase() || '';
  return rows.find((r) => {
    const meta = (r.metadata || {}) as Record<string, unknown>;
    if (meta.official_slug === slug) return true;
    const name = r.full_name.toLowerCase();
    return name.includes(last) || name.includes('shulga') && slug.includes('shulga') || name.includes('sarr') && slug.includes('sarr');
  });
}

async function main() {
  loadEnvFile();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Faltan credenciales Supabase');

  const sb = createSeedClient(url, key);
  const { data: rows, error } = await sb
    .from('players')
    .select('id, full_name, metadata, photo_url, dorsal, position, nationality, birth_date')
    .eq('team_id', DEFAULT_TEAM_ID)
    .eq('is_active', true);

  if (error) throw new Error(error.message);
  const list = rows || [];

  for (const p of RMB_PROVISIONAL_PLAYERS) {
    const row = matchPlayer(list, p);
    if (!row) {
      console.warn('⚠ No encontrado en Supabase:', p.full_name);
      continue;
    }

    const metadata = {
      ...((row.metadata as Record<string, unknown>) || {}),
      official_slug: p.slug,
      photo_provisional: true,
      legal_name:
        p.slug === 'max-shulga'
          ? 'Maksym "Max" Shulga'
          : p.slug === 'olivier-sarr'
            ? 'Olivier Sarr'
            : (row.metadata as Record<string, unknown>)?.legal_name,
      birth_place: p.birth_place,
      height: p.height,
      weight: p.weight,
      trajectory: p.trajectory,
      source: 'provisional-rmb',
    };

    const patch: Record<string, unknown> = {
      photo_url: p.photoPath,
      metadata,
      updated_at: new Date().toISOString(),
    };
    if (p.birth_date) patch.birth_date = p.birth_date;
    if (p.nationality) patch.nationality = p.nationality;
    if (p.position) patch.position = p.position;
    if (p.dorsal != null) patch.dorsal = p.dorsal;

    const { error: upErr } = await sb.from('players').update(patch).eq('id', row.id);
    if (upErr) console.error('✗', p.full_name, upErr.message);
    else console.log('✓ Provisional actualizado:', p.full_name, '→', p.photoPath);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
