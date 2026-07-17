import type { ClubDemoPack, ClubSlug } from '@/data/clubs/types';
import { getClubPack, getClubSlugByTeamId } from '@/data/clubs';
import { loadClubDemoData, db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { buildGarmentUnitsForClub } from '@/lib/garment-units-seed';
import { CLUB_TEAM_IDS, DEMO_CLUB_STORAGE_KEY } from '@/lib/club-team-ids';
import { loadPersistedDemoState } from '@/lib/demo-persistence';
import type { Team } from '@/types';

export function packToTeam(pack: ClubDemoPack): Team {
  const { branding } = pack;
  return {
    id: branding.teamId,
    name: branding.name,
    short_name: branding.shortName,
    logo_url: branding.logoUrl,
    primary_color: branding.primaryColor,
    secondary_color: branding.secondaryColor,
    season: '2025-2026',
    league: 'ACB',
    is_active: true,
    metadata: { demoSlug: branding.slug },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function loadClubPack(pack: ClubDemoPack): Team {
  const slug = pack.branding.slug;
  const saved = typeof window !== 'undefined' ? loadPersistedDemoState(slug) : null;

  if (saved?.customSizingProducts) {
    db.customSizingProducts = [...saved.customSizingProducts];
  } else {
    db.customSizingProducts = [];
  }

  const players =
    saved?.players && saved.players.length > 0
      ? mergeRosterKeepingSizes(pack.players, saved.players)
      : pack.players;
  const coachingStaff =
    saved?.coachingStaff && saved.coachingStaff.length > 0
      ? mergeStaffKeepingSizes(pack.coachingStaff || [], saved.coachingStaff)
      : pack.coachingStaff;

  const garmentUnits = buildGarmentUnitsForClub(
    slug,
    pack.branding.teamId,
    players,
    pack.inventory
  );
  loadClubDemoData({
    players,
    inventory: pack.inventory,
    requests: pack.requests,
    trips: pack.trips,
    laundry: pack.laundry,
    alerts: pack.alerts,
    coachingStaff,
    garmentUnits,
  });
  return packToTeam(pack);
}

export function loadClubBySlug(slug: ClubSlug): Team {
  return loadClubPack(getClubPack(slug));
}

export function loadClubByTeamId(teamId: string): Team | null {
  const slug = getClubSlugByTeamId(teamId);
  if (!slug) return null;
  return loadClubBySlug(slug);
}

export function persistDemoClubSlug(slug: ClubSlug): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEMO_CLUB_STORAGE_KEY, slug);
  localStorage.setItem('currentTeamId', CLUB_TEAM_IDS[slug]);
}

export function readStoredDemoClubSlug(): ClubSlug {
  if (typeof window === 'undefined') return 'rmb';
  const stored = localStorage.getItem(DEMO_CLUB_STORAGE_KEY);
  if (stored === 'fcb' || stored === 'fbat' || stored === 'vbc' || stored === 'rmb') return stored;
  return 'rmb';
}

/** Prefer pack (official) profile fields; keep local size edits from persistence. */
function mergeRosterKeepingSizes(packPlayers: any[], savedPlayers: any[]) {
  if (!packPlayers?.length) return savedPlayers;
  const savedById = new Map(savedPlayers.map((p) => [p.id, p]));
  return packPlayers.map((p) => {
    const saved = savedById.get(p.id);
    if (!saved) return p;
    return {
      ...p,
      sizes: saved.sizes || p.sizes,
      status: saved.status || p.status,
    };
  });
}

function mergeStaffKeepingSizes(packStaff: any[], savedStaff: any[]) {
  if (!packStaff?.length) return savedStaff;
  const savedById = new Map(savedStaff.map((s) => [s.id, s]));
  return packStaff.map((s) => {
    const saved = savedById.get(s.id);
    if (!saved) return s;
    return {
      ...s,
      shirt_size: saved.shirt_size || s.shirt_size,
      shorts_size: saved.shorts_size || s.shorts_size,
      shoe_size: saved.shoe_size ?? s.shoe_size,
      email: saved.email || s.email,
    };
  });
}
