import { mkdirSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import type { SupabaseClient } from '@supabase/supabase-js';

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

type PlayerRow = {
  id: string;
  full_name: string;
  dorsal: number | null;
  official_slug?: string | null;
  metadata?: Record<string, unknown> | null;
};

function slugFromFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '').toLowerCase();
  return base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function findPlayerByFile(players: PlayerRow[], filename: string): PlayerRow | null {
  const slug = slugFromFilename(filename);
  const dorsalMatch = slug.match(/^(\d{1,2})$/);
  if (dorsalMatch) {
    const dorsal = Number(dorsalMatch[1]);
    const hit = players.find((p) => p.dorsal === dorsal);
    if (hit) return hit;
  }

  const bySlug = players.find((p) => {
    const official = String(p.official_slug || '').toLowerCase();
    const metaSlug = String((p.metadata as { official_slug?: string })?.official_slug || '').toLowerCase();
    return official === slug || metaSlug === slug || official.includes(slug) || slug.includes(official);
  });
  if (bySlug) return bySlug;

  const tokens = slug.split('-').filter((t) => t.length >= 3);
  const last = tokens[tokens.length - 1];
  if (last) {
    return (
      players.find((p) => norm(p.full_name).split(' ').pop() === last) ||
      players.find((p) => norm(p.full_name).includes(last)) ||
      null
    );
  }
  return null;
}

async function uploadToStorage(
  supabase: SupabaseClient,
  playerId: string,
  buffer: Buffer,
  filename: string,
  mime: string
): Promise<string | null> {
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const storagePath = `rmb/${playerId}/photo.${ext}`;
  const { error } = await supabase.storage
    .from('player-photos')
    .upload(storagePath, buffer, { upsert: true, contentType: mime });

  if (error) return null;

  const { data } = supabase.storage.from('player-photos').getPublicUrl(storagePath);
  return data.publicUrl;
}

function saveLocalAsset(slug: string, buffer: Buffer, ext: string): string {
  const dir = path.join(process.cwd(), 'public', 'assets', 'players');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const filename = `${slug}.${ext}`;
  writeFileSync(path.join(dir, filename), buffer);
  return `/assets/players/${filename}`;
}

export async function applyPlayerPhotoToRmb(params: {
  supabase: SupabaseClient;
  teamId: string;
  buffer: Buffer;
  filename: string;
  mimeType: string;
}): Promise<{ playerName: string; photoUrl: string }> {
  const { data, error } = await params.supabase
    .from('players')
    .select('id, full_name, dorsal, official_slug, metadata')
    .eq('team_id', params.teamId)
    .eq('is_active', true);

  if (error) throw new Error(error.message);
  const players = (data || []) as PlayerRow[];
  const player = findPlayerByFile(players, params.filename);
  if (!player) {
    throw new Error(
      `No se encontró jugador para "${params.filename}". Usa nombre-slug (max-shulga.jpg) o dorsal (17.png).`
    );
  }

  const ext = params.filename.split('.').pop()?.toLowerCase() || 'jpg';
  const slug =
    player.official_slug ||
    String((player.metadata as { official_slug?: string })?.official_slug || '') ||
    slugFromFilename(player.full_name);

  let photoUrl =
    (await uploadToStorage(params.supabase, player.id, params.buffer, params.filename, params.mimeType)) ||
    null;

  if (!photoUrl && process.env.NODE_ENV !== 'production') {
    photoUrl = saveLocalAsset(slug, params.buffer, ext === 'jpeg' ? 'jpg' : ext);
  }

  if (!photoUrl) {
    throw new Error('No se pudo guardar la foto (revisa bucket player-photos en Supabase).');
  }

  const { error: upErr } = await params.supabase
    .from('players')
    .update({
      photo_url: photoUrl,
      metadata: {
        ...(player.metadata || {}),
        photo_provisional: true,
        photo_import_at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', player.id);

  if (upErr) throw new Error(upErr.message);

  return { playerName: player.full_name, photoUrl };
}
