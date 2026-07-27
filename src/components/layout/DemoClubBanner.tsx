'use client';

import Link from 'next/link';
import { useClubDemo, useClubBranding } from '@/contexts/ClubDemoContext';
import { CLUB_LIST } from '@/data/clubs';
import type { ClubSlug } from '@/data/clubs/types';
import { isPreviewDemoClub, isRealMadridClubSlug } from '@/lib/club-preview';
import { Sparkles, Crown } from 'lucide-react';

export default function DemoClubBanner() {
  const {
    clubSlug,
    switchClub,
    switching,
    isDemo,
    canSwitchClubs,
    isSuperadminPreview,
    previewClubs,
    realMadridClubs,
    commercialDemoClubs,
    presentationMode,
    setPresentationModeOn,
  } = useClubDemo();
  const branding = useClubBranding();

  if (!canSwitchClubs) return null;

  const clubs = isDemo
    ? CLUB_LIST
    : CLUB_LIST.filter((pack) => previewClubs.includes(pack.branding.slug as ClubSlug));

  const orderedClubs = [...clubs].sort((a, b) => {
    const sa = a.branding.slug as ClubSlug;
    const sb = b.branding.slug as ClubSlug;
    const rank = (s: ClubSlug) =>
      realMadridClubs.includes(s) ? 0 : commercialDemoClubs.includes(s) ? 1 : 2;
    return rank(sa) - rank(sb);
  });

  const modeLabel = (() => {
    // Solo el club activo (RMB / RMF / ATM) — nunca listar los tres a la vez.
    const clubTag = branding.shortName;
    if (!isSuperadminPreview) {
      return (
        <>
          <strong>Demo comercial</strong> — {branding.name} · {clubTag}
        </>
      );
    }
    if (presentationMode) {
      return (
        <>
          <strong>Presentación élite</strong> — {branding.name} · {clubTag}
        </>
      );
    }
    if (isRealMadridClubSlug(clubSlug)) {
      return (
        <>
          <strong>Superadmin</strong> — {branding.name} · {clubTag}
        </>
      );
    }
    return (
      <>
        <strong>Superadmin</strong> — {branding.name} · {clubTag} · demo
      </>
    );
  })();

  return (
    <div
      className="border-b px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]"
      style={{
        backgroundColor: `${branding.primaryColor}12`,
        borderColor: `${branding.accentColor}33`,
      }}
    >
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
        {isSuperadminPreview ? (
          <Crown className="h-3.5 w-3.5 shrink-0 text-amber-500" />
        ) : (
          <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: branding.accentColor }} />
        )}
        <span>{modeLabel}</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {isSuperadminPreview && (
          <label className="flex items-center gap-1.5 mr-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={presentationMode}
              onChange={(e) => setPresentationModeOn(e.target.checked)}
              className="rounded border-amber-300"
            />
            Solo live
          </label>
        )}
        {orderedClubs.map((pack) => {
          const slug = pack.branding.slug as ClubSlug;
          const active = clubSlug === slug;
          const isRm = isRealMadridClubSlug(slug);
          const isCommercial = isPreviewDemoClub(slug);
          return (
            <button
              key={slug}
              type="button"
              disabled={switching}
              onClick={() => switchClub(slug)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                active
                  ? isRm
                    ? 'ring-2 ring-offset-1 ring-amber-500 bg-white dark:bg-slate-800 shadow-sm'
                    : 'ring-2 ring-offset-1 ring-orange-500 bg-white dark:bg-slate-800 shadow-sm'
                  : isRm
                    ? 'bg-white dark:bg-slate-800 border border-amber-300/60 dark:border-amber-600/40 hover:bg-amber-50 dark:hover:bg-slate-700'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 opacity-70 hover:opacity-100'
              }`}
              title={
                isRm
                  ? `${pack.branding.name} (producción)`
                  : `${pack.branding.name} (demo comercial)`
              }
            >
              <img src={pack.branding.logoUrl} alt="" className="h-4 w-4 object-contain" />
              {pack.branding.shortName}
              {isCommercial && (
                <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                  demo
                </span>
              )}
            </button>
          );
        })}
        {isDemo && (
          <Link
            href="/demo"
            className="px-2.5 py-1 rounded-lg font-bold text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
          >
            Info demo
          </Link>
        )}
      </div>
    </div>
  );
}
