'use client';

import Link from 'next/link';
import { useClubDemo, useClubBranding } from '@/contexts/ClubDemoContext';
import { CLUB_LIST } from '@/data/clubs';
import type { ClubSlug } from '@/data/clubs/types';
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
  } = useClubDemo();
  const branding = useClubBranding();

  if (!canSwitchClubs) return null;

  const clubs = isDemo
    ? CLUB_LIST
    : CLUB_LIST.filter((pack) => previewClubs.includes(pack.branding.slug as ClubSlug));

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
        <span>
          {isSuperadminPreview ? (
            <>
              <strong>Superadmin</strong> — {branding.name}
              {clubSlug === 'rmb'
                ? ' · producción real'
                : ' · demo comercial (datos ilustrativos)'}
            </>
          ) : (
            <>
              <strong>Demo comercial</strong> — {branding.name} · datos ilustrativos para presentación comercial
            </>
          )}
        </span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {clubs.map((pack) => {
          const slug = pack.branding.slug as ClubSlug;
          const active = clubSlug === slug;
          return (
            <button
              key={slug}
              type="button"
              disabled={switching}
              onClick={() => switchClub(slug, { redirect: '/' })}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                active
                  ? 'ring-2 ring-offset-1 ring-orange-500 bg-white dark:bg-slate-800 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 opacity-80 hover:opacity-100'
              }`}
              title={pack.branding.name}
            >
              <img src={pack.branding.logoUrl} alt="" className="h-4 w-4 object-contain" />
              {pack.branding.shortName}
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
