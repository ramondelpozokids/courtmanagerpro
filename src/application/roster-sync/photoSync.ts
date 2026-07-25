import { mkdirSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

/**
 * Download official photo into public/assets/players/{slug}.ext
 * Returns the public URL path (/assets/players/...).
 */
export async function downloadPlayerPhoto(
  slug: string,
  remoteUrl: string | null | undefined
): Promise<string | null> {
  if (!remoteUrl || !slug) return null;

  try {
    const res = await fetch(remoteUrl, { headers: HEADERS });
    if (!res.ok) {
      console.warn(`[roster-sync] photo HTTP ${res.status} for ${slug}`);
      return remoteUrl;
    }

    const contentType = res.headers.get('content-type') || '';
    let ext = 'jpg';
    if (contentType.includes('png')) ext = 'png';
    else if (contentType.includes('webp')) ext = 'webp';
    else if (remoteUrl.includes('.png')) ext = 'png';
    else if (remoteUrl.includes('.webp')) ext = 'webp';

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) return remoteUrl;

    const dir = path.join(process.cwd(), 'public', 'assets', 'players');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const filename = `${slug}.${ext}`;
    const filePath = path.join(dir, filename);
    writeFileSync(filePath, buf);

    return `/assets/players/${filename}`;
  } catch (err) {
    console.warn(`[roster-sync] photo download failed for ${slug}:`, err);
    return remoteUrl;
  }
}

export async function syncPhotosForSnapshot(
  players: Array<{ slug: string; photo_url: string | null }>,
  staff: Array<{ slug: string; photo_url: string | null }>
): Promise<{
  playerPhotos: Record<string, string>;
  staffPhotos: Record<string, string>;
}> {
  const playerPhotos: Record<string, string> = {};
  const staffPhotos: Record<string, string> = {};

  for (const p of players) {
    if (!p.photo_url) continue;
    const local = await downloadPlayerPhoto(p.slug, p.photo_url);
    if (local) playerPhotos[p.slug] = local;
  }

  for (const s of staff) {
    if (!s.photo_url) continue;
    const local = await downloadPlayerPhoto(`staff-${s.slug}`, s.photo_url);
    if (local) staffPhotos[s.slug] = local;
  }

  return { playerPhotos, staffPhotos };
}
