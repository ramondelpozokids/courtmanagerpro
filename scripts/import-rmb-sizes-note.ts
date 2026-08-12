/**
 * Importa tallas de camiseta desde la nota de utilería (LUNES R. MEDICO Y TINO).
 * Uso: npx tsx scripts/import-rmb-sizes-note.ts
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { DEFAULT_TEAM_ID, demoPlayerIdToUuid } from '../src/lib/team-constants';
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

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normSize(raw: string): string {
  const t = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (t === 'XXL' || t === '2XL') return '2XL';
  return t;
}

const NEW_PLAYERS: Array<{
  label: string;
  match: string[];
  jersey: string;
  full_name: string;
  dorsal: number;
  position: string;
  legacyId: string;
  slug: string;
}> = [
  {
    label: 'Max Shulga',
    match: ['shulga', 'max shulga'],
    jersey: 'XL',
    full_name: 'Max Shulga',
    dorsal: 5,
    position: 'escolta',
    legacyId: 'p3',
    slug: 'max-shulga',
  },
  {
    label: 'Olivier Sarr',
    match: ['sarr', 'olivier sarr'],
    jersey: '2XL',
    full_name: 'Olivier Sarr',
    dorsal: 17,
    position: 'pivot',
    legacyId: 'p19',
    slug: 'olivier-sarr',
  },
];

const SIZE_IMPORT: Array<{ label: string; match: string[]; jersey: string }> = [
  { label: 'Max Shulga', match: ['shulga', 'max shulga'], jersey: 'XL' },
  { label: 'Andrés Feliz', match: ['feliz', 'andres feliz'], jersey: 'L' },
  { label: 'Alberto Abalde', match: ['abalde'], jersey: 'XL' },
  { label: 'Usman Garuba', match: ['garuba'], jersey: '2XL' },
  { label: 'Gabriel Deck', match: ['deck'], jersey: 'XL' },
  { label: 'Facundo Campazzo', match: ['campazzo', 'facundo'], jersey: 'L' },
  { label: 'Olivier Sarr', match: ['sarr', 'olivier sarr'], jersey: '2XL' },
  { label: 'Jaime Pradilla', match: ['pradilla'], jersey: 'XL' },
  { label: 'Sergio Llull', match: ['llull'], jersey: 'XL' },
  { label: 'Edy Tavares', match: ['tavares', 'edy', 'walter samuel'], jersey: '2XL' },
  { label: 'Théo Maledon', match: ['maledon', 'macedon', 'theo'], jersey: 'L' },
  { label: 'Luwawu-Cabarrot', match: ['luwawu', 'cabarrot'], jersey: 'L' },
  { label: 'Gabriele Procida', match: ['procida'], jersey: 'L' },
  { label: 'Chuma Okeke', match: ['okeke'], jersey: 'XL' },
  { label: 'Mikael Jantunen', match: ['jantunen', 'tantum'], jersey: 'XL' },
  { label: 'Izan Almansa', match: ['almansa', 'izan'], jersey: 'XL' },
];

const TEXT_SIZE_KEYS = [
  'jersey_home',
  'jersey_away',
  'jersey_third',
  'shorts_game',
  'jersey_shootaround',
  'training_shirt',
  'training_shorts',
  'training_pants_long',
  'tracksuit_jacket',
  'tracksuit_pants',
  'hoodie',
  'windbreaker',
  'baselayer',
  'compression_sleeve',
  'travel_polo',
  'travel_pants',
  'pre_match_shirt',
];

function buildSizingPatch(
  existing: Record<string, unknown> | null | undefined,
  jersey: string
): Record<string, unknown> {
  const sizing = { ...(existing?.sizing as Record<string, string> | undefined) };
  for (const key of TEXT_SIZE_KEYS) {
    sizing[key] = jersey;
  }
  return {
    ...(existing ?? {}),
    sizing,
    sizes_import_note: 'LUNES R. MEDICO Y TINO · 2026-08-12',
  };
}

type ImportPlayerRow = {
  id: string;
  full_name: string;
  dorsal: number | null;
  is_active: boolean | null;
  metadata?: Record<string, unknown>;
  shirt_size?: string | null;
};

function findPlayer(rows: ImportPlayerRow[], matchTerms: string[]) {
  const active = rows.filter((r) => r.is_active !== false);
  for (const row of active) {
    const name = norm(row.full_name);
    if (matchTerms.some((term) => name.includes(norm(term)))) return row;
  }
  return null;
}

async function main() {
  loadEnvFile();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en .env.local');
    process.exit(1);
  }

  const sb = createSeedClient(url, key);
  const { data: players, error } = await sb
    .from('players')
    .select('id, full_name, dorsal, is_active, metadata, shirt_size')
    .eq('team_id', DEFAULT_TEAM_ID);
  if (error) throw new Error(error.message);

  const rows: ImportPlayerRow[] = players || [];

  for (const np of NEW_PLAYERS) {
    if (findPlayer(rows, np.match)) continue;
    const jersey = normSize(np.jersey);
    const metadata = buildSizingPatch(undefined, jersey);
    metadata.official_slug = np.slug;
    metadata.source = 'utileria-note';
    metadata.season = '2026-2027';

    const { error: insErr } = await sb.from('players').insert({
      id: demoPlayerIdToUuid(np.legacyId),
      team_id: DEFAULT_TEAM_ID,
      dorsal: np.dorsal,
      full_name: np.full_name,
      position: np.position,
      nationality: np.label.includes('Shulga') ? 'Ucrania' : 'Francia',
      is_active: true,
      shirt_size: jersey,
      shorts_size: jersey,
      jacket_size: jersey,
      jersey_name: np.full_name.split(' ').pop()?.toUpperCase() || null,
      contract_end: '2027-06-30',
      metadata,
    });
    if (insErr) {
      console.warn('No se pudo dar de alta', np.label, insErr.message);
    } else {
      console.log(`+ Alta ${np.full_name} #${np.dorsal} (${jersey})`);
      rows.push({
        id: demoPlayerIdToUuid(np.legacyId),
        full_name: np.full_name,
        dorsal: np.dorsal,
        is_active: true,
      });
    }
  }

  let updated = 0;
  let missing: string[] = [];

  for (const entry of SIZE_IMPORT) {
    const jersey = normSize(entry.jersey);
    const player = findPlayer(rows, entry.match);
    if (!player) {
      missing.push(entry.label);
      continue;
    }

    const metadata = buildSizingPatch(player.metadata, jersey);
    const patch: Record<string, unknown> = {
      shirt_size: jersey,
      shorts_size: jersey,
      jacket_size: jersey,
      metadata,
      updated_at: new Date().toISOString(),
    };
    if (entry.match.some((m) => m.includes('sarr'))) {
      patch.photo_url = '/assets/players/olivier-sarr.webp';
      (metadata as Record<string, unknown>).photo_provisional = true;
    }

    const { error: upErr } = await sb.from('players').update(patch).eq('id', player.id);

    if (upErr) {
      console.error('Error', entry.label, upErr.message);
      continue;
    }

    console.log(`✓ ${entry.label}: ${jersey} (${player.full_name})`);
    updated += 1;
  }

  console.log(`\nActualizados: ${updated}/${SIZE_IMPORT.length}`);
  if (missing.length) {
    console.log('No encontrados en Supabase (añadir a plantilla antes):');
    for (const name of missing) console.log('  -', name);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
