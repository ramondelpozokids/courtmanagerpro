'use client';

import { useCallback, useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { OfficialStoreButtons } from './OfficialStoreButtons';
import { OfficialStoreStatus } from './OfficialStoreStatus';
import {
  checkOfficialStore,
  openOfficialStore,
  readStoredStoreStatus,
  type OfficialStoreCheckResult,
} from './OfficialStoreService';
import { useClubBranding } from '@/contexts/ClubDemoContext';
import { cn } from '@/lib/utils';

export function OfficialStoreCard({
  className,
  checkOnMount = true,
}: {
  className?: string;
  checkOnMount?: boolean;
}) {
  const branding = useClubBranding();
  const [result, setResult] = useState<OfficialStoreCheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await checkOfficialStore();
      setResult(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = readStoredStoreStatus();
    if (stored) setResult(stored);

    if (!checkOnMount) return;

    const key = 'cm-official-store-boot-check';
    try {
      const last = sessionStorage.getItem(key);
      if (last && Date.now() - Number(last) < 60_000) {
        return;
      }
      sessionStorage.setItem(key, String(Date.now()));
    } catch {
      /* ignore */
    }

    void refresh();
  }, [checkOnMount, refresh]);

  return (
    <div
      className={cn(
        'text-left transition-all duration-150 ease-out',
        className
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/20 p-2.5">
          <ShoppingBag className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            Tienda Oficial {branding.shortName}
          </h3>
          <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
            {branding.slug === 'atm'
              ? 'Camisetas oficiales Nike del primer equipo de fútbol, ropa técnica y colecciones 26/27.'
              : branding.sport === 'football'
                ? 'Camisetas oficiales adidas del primer equipo de fútbol, ropa técnica y colecciones 26/27.'
                : `Equipaciones, ropa técnica, accesorios y colecciones oficiales de ${branding.name}.`}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <OfficialStoreButtons
          onOpen={openOfficialStore}
          onRefresh={() => void refresh()}
          refreshing={loading}
        />
        <OfficialStoreStatus result={result} loading={loading} />
      </div>
    </div>
  );
}
