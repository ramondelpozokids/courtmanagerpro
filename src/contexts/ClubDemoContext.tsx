'use client';

import React, { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ClubDemoPack, ClubSlug } from '@/data/clubs/types';
import { CLUB_PACKS, getClubPack } from '@/data/clubs';
import {
  loadClubBySlug,
  persistDemoClubSlug,
  readStoredDemoClubSlug,
} from '@/lib/club-demo-loader';
import { useAuth } from '@/contexts/AuthContext';
import { isDemoMode } from '@/lib/app-mode';
import { isSuperadminUser } from '@/lib/permissions';
import {
  isPreviewDemoClub,
  readActiveClubPreviewSlug,
  setActiveClubPreviewSlug,
  SUPERADMIN_PREVIEW_CLUBS,
} from '@/lib/club-preview';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';

interface ClubDemoContextValue {
  club: ClubDemoPack;
  clubSlug: ClubSlug;
  switching: boolean;
  switchClub: (slug: ClubSlug, options?: { redirect?: string }) => void;
  isDemo: boolean;
  canSwitchClubs: boolean;
  isSuperadminPreview: boolean;
  previewClubs: readonly ClubSlug[];
}

const ClubDemoContext = createContext<ClubDemoContextValue | null>(null);

const PRODUCTION_CLUB_SLUG: ClubSlug = 'rmb';

function isSuperadminPreviewClub(slug: ClubSlug): slug is (typeof SUPERADMIN_PREVIEW_CLUBS)[number] {
  return (SUPERADMIN_PREVIEW_CLUBS as readonly string[]).includes(slug);
}

export function ClubDemoProvider({ children }: { children: ReactNode }) {
  const { setCurrentTeam, user } = useAuth();
  const demo = isDemoMode();
  const isSuperadmin = isSuperadminUser(user?.profile?.role, user?.profile?.email ?? user?.email);
  const canSwitchClubs = demo || isSuperadmin;
  const isSuperadminPreview = !demo && isSuperadmin;

  const [clubSlug, setClubSlug] = useState<ClubSlug>(PRODUCTION_CLUB_SLUG);
  const [club, setClub] = useState<ClubDemoPack>(() => getClubPack(PRODUCTION_CLUB_SLUG));
  const [switching, setSwitching] = useState(false);

  const applyClub = useCallback(
    (slug: ClubSlug) => {
      const pack = getClubPack(slug);
      setActiveClubPreviewSlug(slug);

      if (demo) {
        const team = loadClubBySlug(slug);
        persistDemoClubSlug(slug);
        setCurrentTeam(team);
      } else if (isSuperadmin) {
        if (isPreviewDemoClub(slug)) {
          const team = loadClubBySlug(slug);
          setCurrentTeam(team);
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentTeamId', CLUB_TEAM_IDS[slug]);
          }
        } else {
          const productionTeam = user?.currentTeam ?? user?.teams?.[0]?.team;
          if (productionTeam) {
            setCurrentTeam(productionTeam);
            if (typeof window !== 'undefined') {
              localStorage.setItem('currentTeamId', productionTeam.id);
            }
          }
        }
      }

      setClubSlug(slug);
      setClub(pack);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('club-demo-changed', { detail: { slug } }));
      }
    },
    [demo, isSuperadmin, setCurrentTeam, user]
  );

  useEffect(() => {
    if (demo) {
      applyClub(readStoredDemoClubSlug());
      return;
    }

    if (isSuperadmin) {
      applyClub(readActiveClubPreviewSlug());
      return;
    }

    setClubSlug(PRODUCTION_CLUB_SLUG);
    setClub(getClubPack(PRODUCTION_CLUB_SLUG));
    setActiveClubPreviewSlug(PRODUCTION_CLUB_SLUG);
  }, [applyClub, demo, isSuperadmin]);

  const switchClub = useCallback(
    (slug: ClubSlug, options?: { redirect?: string }) => {
      if (!canSwitchClubs) return;
      if (isSuperadminPreview && !isSuperadminPreviewClub(slug)) return;

      setSwitching(true);
      applyClub(slug);
      setSwitching(false);

      if (options?.redirect && typeof window !== 'undefined') {
        window.location.href = options.redirect;
      }
    },
    [applyClub, canSwitchClubs, isSuperadminPreview]
  );

  return (
    <ClubDemoContext.Provider
      value={{
        club,
        clubSlug,
        switching,
        switchClub,
        isDemo: demo,
        canSwitchClubs,
        isSuperadminPreview,
        previewClubs: isSuperadminPreview ? SUPERADMIN_PREVIEW_CLUBS : (Object.keys(CLUB_PACKS) as ClubSlug[]),
      }}
    >
      {children}
    </ClubDemoContext.Provider>
  );
}

export function useClubDemo() {
  const ctx = useContext(ClubDemoContext);
  if (!ctx) throw new Error('useClubDemo must be used within ClubDemoProvider');
  return ctx;
}

export function useClubBranding() {
  return useClubDemo().club.branding;
}

export function useClubBlog() {
  return useClubDemo().club.blog;
}

export function useClubNews() {
  return useClubDemo().club.news;
}

/** Hook para saber si la vista activa usa datos demo (FCB/VBC). */
export function useUsesDemoClubData(): boolean {
  const { clubSlug } = useClubDemo();
  if (isDemoMode()) return true;
  return isPreviewDemoClub(clubSlug);
}
