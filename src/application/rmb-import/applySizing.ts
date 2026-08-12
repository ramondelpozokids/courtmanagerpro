import type { SupabaseClient } from '@supabase/supabase-js';
import { formatApparelSize } from '@/content/sizing-products';
import type { ParsedSizingRow } from './parseSizingCsv';

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
  if (!t || t === '—' || t === '-') return '';
  if (t === 'XXL' || t === '2XL') return '2XL';
  return formatApparelSize(t);
}

type PlayerRow = {
  id: string;
  full_name: string;
  dorsal: number | null;
  metadata?: Record<string, unknown> | null;
  official_slug?: string | null;
};

function findPlayer(players: PlayerRow[], row: ParsedSizingRow): PlayerRow | null {
  if (row.dorsal) {
    const dorsal = Number(row.dorsal);
    const byDorsal = players.find((p) => p.dorsal === dorsal);
    if (byDorsal) return byDorsal;
  }
  const target = norm(row.nombre);
  if (!target) return null;
  const last = target.split(' ').pop() || target;
  return (
    players.find((p) => norm(p.full_name) === target) ||
    players.find((p) => norm(p.full_name).includes(last) && last.length >= 4) ||
    null
  );
}

function buildSizingMetadata(
  existing: Record<string, unknown> | null | undefined,
  row: ParsedSizingRow,
  sourceFile: string
): Record<string, unknown> {
  const sizing = { ...((existing?.sizing as Record<string, string>) || {}) };
  const jersey = normSize(row.camiseta) || normSize(row.entrenamiento);
  const shorts = normSize(row.pantalon) || jersey;
  const jacket = normSize(row.chaqueta) || jersey;
  const training = normSize(row.entrenamiento) || jersey;

  for (const key of TEXT_SIZE_KEYS) {
    if (key.includes('short')) sizing[key] = shorts || sizing[key] || jersey;
    else if (key.includes('jacket') || key === 'tracksuit_jacket' || key === 'windbreaker')
      sizing[key] = jacket || sizing[key] || jersey;
    else if (key.includes('training')) sizing[key] = training || sizing[key] || jersey;
    else sizing[key] = jersey || sizing[key];
  }

  const shoe = row.calzado.trim();
  if (shoe) {
    sizing.shoes_game = shoe;
    sizing.shoes_training = shoe;
    sizing.shoes = shoe;
  }

  return {
    ...(existing ?? {}),
    sizing,
    sizes_import_source: sourceFile,
    sizes_import_at: new Date().toISOString(),
  };
}

export async function applySizingCsvToRmb(params: {
  supabase: SupabaseClient;
  teamId: string;
  rows: ParsedSizingRow[];
  sourceFile: string;
}): Promise<{ updated: number; missing: string[]; details: string[] }> {
  const { data, error } = await params.supabase
    .from('players')
    .select('id, full_name, dorsal, metadata, official_slug')
    .eq('team_id', params.teamId)
    .eq('is_active', true);

  if (error) throw new Error(error.message);
  const players = (data || []) as PlayerRow[];

  let updated = 0;
  const missing: string[] = [];
  const details: string[] = [];

  for (const row of params.rows) {
    if (row.grupo && row.grupo.toLowerCase() === 'staff') continue;
    const player = findPlayer(players, row);
    if (!player) {
      missing.push(row.nombre || `#${row.dorsal}`);
      continue;
    }

    const jersey = normSize(row.camiseta) || normSize(row.entrenamiento);
    const shorts = normSize(row.pantalon) || jersey;
    const jacket = normSize(row.chaqueta) || jersey;
    const shoe = row.calzado.trim();

    const metadata = buildSizingMetadata(player.metadata, row, params.sourceFile);
    const patch: Record<string, unknown> = {
      metadata,
      updated_at: new Date().toISOString(),
    };
    if (jersey) {
      patch.shirt_size = jersey;
      patch.jacket_size = jacket || jersey;
    }
    if (shorts) patch.shorts_size = shorts;
    if (shoe) patch.shoe_size = Number(shoe.replace(',', '.')) || shoe;

    const { error: upErr } = await params.supabase
      .from('players')
      .update(patch)
      .eq('id', player.id);

    if (upErr) {
      missing.push(`${row.nombre}: ${upErr.message}`);
      continue;
    }

    updated += 1;
    details.push(`${player.full_name}: camiseta ${jersey || '—'}${shoe ? ` · calzado ${shoe}` : ''}`);
  }

  return { updated, missing, details };
}
