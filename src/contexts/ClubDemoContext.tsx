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

interface ClubDemoContextValue {
  club: ClubDemoPack;
  clubSlug: ClubSlug;
  switching: boolean;
  switchClub: (slug: ClubSlug, options?: { redirect?: string }) => void;
}

const ClubDemoContext = createContext<ClubDemoContextValue | null>(null);

export function ClubDemoProvider({ children }: { children: ReactNode }) {
  const { setCurrentTeam } = useAuth();
  const [clubSlug, setClubSlug] = useState<ClubSlug>('rmb');
  const [club, setClub] = useState<ClubDemoPack>(() => getClubPack('rmb'));
  const [switching, setSwitching] = useState(false);

  const applyClub = useCallback(
    (slug: ClubSlug) => {
      const pack = getClubPack(slug);
      const team = loadClubBySlug(slug);
      persistDemoClubSlug(slug);
      setClubSlug(slug);
      setClub(pack);
      setCurrentTeam(team);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('club-demo-changed', { detail: { slug } }));
      }
    },
    [setCurrentTeam]
  );

  useEffect(() => {
    applyClub(readStoredDemoClubSlug());
  }, [applyClub]);

  const switchClub = useCallback(
    (slug: ClubSlug, options?: { redirect?: string }) => {
      setSwitching(true);
      applyClub(slug);
      setSwitching(false);
      if (options?.redirect && typeof window !== 'undefined') {
        window.location.href = options.redirect;
      }
    },
    [applyClub]
  );

  return (
    <ClubDemoContext.Provider value={{ club, clubSlug, switching, switchClub }}>
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
