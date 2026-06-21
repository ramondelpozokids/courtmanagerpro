import type { ClubDemoPack, ClubSlug } from '@/data/clubs/types';
import { getClubPack, getClubSlugByTeamId } from '@/data/clubs';
import { loadClubDemoData } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { buildGarmentUnitsForClub } from '@/lib/garment-units-seed';
import { CLUB_TEAM_IDS, DEMO_CLUB_STORAGE_KEY } from '@/lib/club-team-ids';
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
  const garmentUnits = buildGarmentUnitsForClub(
    pack.branding.slug,
    pack.branding.teamId,
    pack.players,
    pack.inventory
  );
  loadClubDemoData({
    players: pack.players,
    inventory: pack.inventory,
    requests: pack.requests,
    trips: pack.trips,
    laundry: pack.laundry,
    alerts: pack.alerts,
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
  if (stored === 'fcb' || stored === 'vbc' || stored === 'rmb') return stored;
  return 'rmb';
}
