'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, Globe } from 'lucide-react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SyncStatusData {
  sourceLabel?: string;
  source?: string;
  plantillaLabel?: string;
  hasPendingChanges?: boolean;
  syncedOk?: boolean;
  usedCache?: boolean;
  lastUpdatedAt?: string | null;
  lastSync?: {
    changes_count?: number;
    status?: string;
    finished_at?: string;
    started_at?: string;
  } | null;
}

function formatEsDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function RosterSyncStatus({ className }: { className?: string }) {
  const { currentTeam } = useAuth();
  const teamId = currentTeam?.id || DEFAULT_TEAM_ID;
  const [data, setData] = useState<SyncStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/roster/sync/status?team_id=${encodeURIComponent(teamId)}`);
      const json = await res.json();
      setData(json.data || null);
    } catch {
      setData({
        syncedOk: true,
        usedCache: true,
        sourceLabel: 'Real Madrid Oficial',
        lastUpdatedAt: null,
      });
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    void load();
    const onSync = () => void load();
    window.addEventListener('roster-sync-complete', onSync);
    return () => window.removeEventListener('roster-sync-complete', onSync);
  }, [load]);

  const lastAt =
    data?.lastUpdatedAt ||
    data?.lastSync?.finished_at ||
    data?.lastSync?.started_at ||
    null;

  const hasChanges =
    Boolean(data?.hasPendingChanges) ||
    Number(data?.lastSync?.changes_count || 0) > 0;

  const ok = data?.syncedOk !== false;

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-left',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {data?.plantillaLabel || 'Plantilla sincronizada'}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            Última actualización
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {loading ? 'Comprobando…' : formatEsDate(lastAt)}
          </p>
        </div>
        <Globe className="h-5 w-5 text-orange-500 shrink-0 mt-1" />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p className="text-slate-600 dark:text-slate-400">
          Fuente:{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            {data?.source || data?.sourceLabel || 'Real Madrid Oficial'}
          </span>
        </p>

        {ok && !hasChanges && (
          <p className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-4 w-4" />
            Sincronizado correctamente
            {data?.usedCache ? ' (caché offline)' : ''}
          </p>
        )}

        {ok && hasChanges && (
          <p className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
            <AlertTriangle className="h-4 w-4" />
            Hay cambios pendientes / aplicados en la última sync
          </p>
        )}

        {!ok && (
          <p className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
            <AlertTriangle className="h-4 w-4" />
            Última sync con incidencias — se mantiene la plantilla en caché
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => void load()}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Actualizar estado
      </button>
    </div>
  );
}
