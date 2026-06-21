'use client';

import React, { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ClubDemoPack, ClubSlug } from '@/data/clubs/types';
import { getClubPack } from '@/data/clubs';
import {
  loadClubBySlug,
  persistDemoClubSlug,
  readStoredDemoClubSlug,
} from '@/lib/club-demo-loader';
import { useAuth } from '@/contexts/AuthContext';
import { isDemoMode } from '@/lib/app-mode';

interface ClubDemoContextValue {
  club: ClubDemoPack;
  clubSlug: ClubSlug;
  switching: boolean;
  switchClub: (slug: ClubSlug, options?: { redirect?: string }) => void;
  isDemo: boolean;
}

const ClubDemoContext = createContext<ClubDemoContextValue | null>(null);

const PRODUCTION_CLUB_SLUG: ClubSlug = 'rmb';

export function ClubDemoProvider({ children }: { children: ReactNode }) {
  const { setCurrentTeam } = useAuth();
  const demo = isDemoMode();
  const [clubSlug, setClubSlug] = useState<ClubSlug>(demo ? 'rmb' : PRODUCTION_CLUB_SLUG);
  const [club, setClub] = useState<ClubDemoPack>(() => getClubPack(demo ? 'rmb' : PRODUCTION_CLUB_SLUG));
  const [switching, setSwitching] = useState(false);

  const applyClub = useCallback(
    (slug: ClubSlug) => {
      const pack = getClubPack(slug);
      if (demo) {
        const team = loadClubBySlug(slug);
        persistDemoClubSlug(slug);
        setCurrentTeam(team);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('club-demo-changed', { detail: { slug } }));
        }
      }
      setClubSlug(slug);
      setClub(pack);
    },
    [demo, setCurrentTeam]
  );

  useEffect(() => {
    if (demo) {
      applyClub(readStoredDemoClubSlug());
    } else {
      setClubSlug(PRODUCTION_CLUB_SLUG);
      setClub(getClubPack(PRODUCTION_CLUB_SLUG));
    }
  }, [applyClub, demo]);

  const switchClub = useCallback(
    (slug: ClubSlug, options?: { redirect?: string }) => {
      if (!demo) return;
      setSwitching(true);
      applyClub(slug);
      setSwitching(false);
      if (options?.redirect && typeof window !== 'undefined') {
        window.location.href = options.redirect;
      }
    },
    [applyClub, demo]
  );

  return (
    <ClubDemoContext.Provider value={{ club, clubSlug, switching, switchClub, isDemo: demo }}>
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
