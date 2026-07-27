'use client';

import { OfficialStoreCard } from '@/modules/official-store';
import { useClubBranding } from '@/contexts/ClubDemoContext';
import { getOfficialStoreForSlug } from '@/config/store';

export default function TiendaPage() {
  const branding = useClubBranding();
  const store = getOfficialStoreForSlug(branding.slug);
  const host = store.url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <div className="max-w-xl mx-auto space-y-6 text-left py-2">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Tienda Oficial
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Acceso directo a {host} — sin catálogo local ni scraping.
        </p>
      </div>
      <OfficialStoreCard />
    </div>
  );
}
