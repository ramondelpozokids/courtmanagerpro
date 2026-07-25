'use client';

import { OfficialStoreCard } from '@/modules/official-store';

export default function TiendaPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 text-left py-2">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Tienda Oficial
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Acceso directo a shop.realmadrid.com — sin catálogo local ni scraping.
        </p>
      </div>
      <OfficialStoreCard />
    </div>
  );
}
