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
import { cn } from '@/lib/utils';

export function OfficialStoreCard({
  className,
  checkOnMount = true,
}: {
  className?: string;
  checkOnMount?: boolean;
}) {
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
        'rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md',
        'shadow-lg shadow-black/20 p-6 text-left',
        'transition-all duration-150 ease-out',
        'hover:border-emerald-500/30',
        className
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/20 p-2.5">
          <ShoppingBag className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            🛍 Tienda Oficial
          </h3>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-md">
            Accede a la tienda oficial del Real Madrid y descubre equipaciones, ropa técnica,
            accesorios y colecciones oficiales.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
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
