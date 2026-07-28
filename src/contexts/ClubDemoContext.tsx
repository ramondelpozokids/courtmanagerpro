'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ClubDemoPack, ClubSlug } from '@/data/clubs/types';
import { CLUB_PACKS, getClubPack } from '@/data/clubs';
import {
  loadClubBySlug,
  packToTeam,
  persistDemoClubSlug,
  readStoredDemoClubSlug,
} from '@/lib/club-demo-loader';
import { useAuth } from '@/contexts/AuthContext';
import { isDemoMode } from '@/lib/app-mode';
import {
  COMMERCIAL_DEMO_CLUBS,
  isPreviewDemoClub,
  isRealMadridClubSlug,
  readActiveClubPreviewSlug,
  readPresentationMode,
  setActiveClubPreviewSlug,
  setPresentationMode,
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
  /** Clubs destacados para presentación RM (RMB + RMF). */
  realMadridClubs: readonly ClubSlug[];
  commercialDemoClubs: readonly ClubSlug[];
  presentationMode: boolean;
  setPresentationModeOn: (on: boolean) => void;
}

const ClubDemoContext = createContext<ClubDemoContextValue | null>(null);

const PRODUCTION_CLUB_SLUG: ClubSlug = 'rmb';
const ALL_CLUB_SLUGS = Object.keys(CLUB_PACKS) as ClubSlug[];
const RM_CLUBS: ClubSlug[] = ['atm', 'rmb', 'rmf'];

export function ClubDemoProvider({ children }: { children: ReactNode }) {
  const { setCurrentTeam, loading: authLoading, isSuperadmin } = useAuth();
  const demo = isDemoMode();
  const canSwitchClubs = demo || isSuperadmin;
  const isSuperadminPreview = !demo && isSuperadmin;

  const [clubSlug, setClubSlug] = useState<ClubSlug>(PRODUCTION_CLUB_SLUG);
  const [club, setClub] = useState<ClubDemoPack>(() => getClubPack(PRODUCTION_CLUB_SLUG));
  const [switching, setSwitching] = useState(false);
  const [presentationMode, setPresentationModeState] = useState(true);
  const initKeyRef = useRef('');

  const applyClub = useCallback(
    (slug: ClubSlug) => {
      const pack = getClubPack(slug);
      setActiveClubPreviewSlug(slug);

      if (demo) {
        const team = loadClubBySlug(slug);
        persistDemoClubSlug(slug);
        setCurrentTeam(team);
      } else if (isSuperadmin && isPreviewDemoClub(slug)) {
        // FCB / VBC: pack → InMemoryDB
        const team = loadClubBySlug(slug);
        setCurrentTeam(team);
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentTeamId', CLUB_TEAM_IDS[slug]);
        }
      } else if (isSuperadmin && isRealMadridClubSlug(slug)) {
        // RMB / RMF: branding del pack + team UUID; datos en Supabase
        setCurrentTeam(packToTeam(pack));
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentTeamId', CLUB_TEAM_IDS[slug]);
        }
      }

      setClubSlug(slug);
      setClub(pack);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('club-demo-changed', { detail: { slug } }));
      }
    },
    [demo, isSuperadmin, setCurrentTeam]
  );

  useEffect(() => {
    if (authLoading) return;

    const initKey = `${demo ? 'demo' : 'prod'}-${isSuperadmin ? 'sa' : 'user'}`;
    if (initKeyRef.current === initKey) return;
    initKeyRef.current = initKey;

    setPresentationModeState(readPresentationMode());

    if (demo) {
      applyClub(readStoredDemoClubSlug());
      return;
    }

    if (isSuperadmin) {
      let storedSlug = readActiveClubPreviewSlug();
      if (readPresentationMode() && isPreviewDemoClub(storedSlug)) {
        storedSlug = 'rmb';
      }
      applyClub(storedSlug);
      return;
    }

    applyClub(PRODUCTION_CLUB_SLUG);
  }, [applyClub, authLoading, demo, isSuperadmin]);

  const setPresentationModeOn = useCallback(
    (on: boolean) => {
      setPresentationMode(on);
      setPresentationModeState(on);
      if (on && isPreviewDemoClub(clubSlug)) {
        applyClub('rmb');
      }
    },
    [applyClub, clubSlug]
  );

  const switchClub = useCallback(
    (slug: ClubSlug, options?: { redirect?: string }) => {
      if (!canSwitchClubs) return;
      if (presentationMode && isPreviewDemoClub(slug) && !demo) return;

      setSwitching(true);
      applyClub(slug);
      setSwitching(false);

      if (options?.redirect && typeof window !== 'undefined') {
        window.location.href = options.redirect;
      }
    },
    [applyClub, canSwitchClubs, presentationMode, demo]
  );

  const previewClubs = useMemo(() => {
    if (demo) return ALL_CLUB_SLUGS;
    if (presentationMode) return RM_CLUBS;
    return ALL_CLUB_SLUGS;
  }, [demo, presentationMode]);

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
        previewClubs,
        realMadridClubs: RM_CLUBS,
        commercialDemoClubs: COMMERCIAL_DEMO_CLUBS as unknown as ClubSlug[],
        presentationMode,
        setPresentationModeOn,
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

/** UUID del club del switcher (ATM/RMB/RMF…) — no depende de currentTeam desfasado. */
export function useActiveTeamId(): string {
  const { clubSlug, club } = useClubDemo();
  const { currentTeam } = useAuth();
  return (
    CLUB_TEAM_IDS[clubSlug] ||
    club.branding.teamId ||
    currentTeam?.id ||
    CLUB_TEAM_IDS.rmb
  );
}

/** Hook: vista activa usa datos demo (FCB/VBC o DEMO_MODE). */
export function useUsesDemoClubData(): boolean {
  const { clubSlug } = useClubDemo();
  if (isDemoMode()) return true;
  return isPreviewDemoClub(clubSlug);
}
