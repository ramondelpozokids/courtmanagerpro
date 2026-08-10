'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { useAuth } from '@/contexts/AuthContext';
import { useClubDemo } from '@/contexts/ClubDemoContext';
import { cn } from '@/lib/utils';

export function UpdateOfficialRosterButton({
  className,
  onDone,
}: {
  className?: string;
  onDone?: () => void;
}) {
  const { currentTeam, isSuperadmin } = useAuth();
  const { clubSlug, club } = useClubDemo();
  const teamId =
    CLUB_TEAM_IDS[clubSlug] || club.branding.teamId || currentTeam?.id || DEFAULT_TEAM_ID;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Solo superadmin (Ramón): sync oficial puede alterar plantilla del sistema.
  if (!isSuperadmin) return null;

  async function handleClick() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/roster/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ trigger: 'manual', team_id: teamId, force: true }),
      });
      const json = await res.json().catch(() => ({} as Record<string, unknown>));
      const data = (json as { data?: Record<string, unknown>; error?: string }).data;
      const topError = (json as { error?: string }).error;

      if (!res.ok) {
        setMessage(topError || `Error al sincronizar (HTTP ${res.status})`);
        return;
      }

      if (!data || data.status === 'error') {
        setMessage(
          String(data?.errorMessage || topError || 'Error al sincronizar (se mantiene la plantilla actual)')
        );
        return;
      }

      if (data.skipped) {
        setMessage('Ya estaba actualizada');
        return;
      }

      const n = Number(data.changesCount ?? 0);
      const added = Number(data.playersAdded ?? 0);
      const removed = Number(data.playersRemoved ?? 0);
      const updated = Number(data.playersUpdated ?? 0);
      const src =
        clubSlug === 'atm'
          ? 'Atlético de Madrid'
          : clubSlug === 'rmf'
            ? 'Real Madrid Fútbol'
            : 'Real Madrid Baloncesto';
      const fromCache = data.usedCache ? ' (caché / fallback)' : '';

      if (n === 0) {
        setMessage(`Plantilla ${src} al día con la web oficial — sin cambios${fromCache}`);
      } else {
        setMessage(
          `Sincronizado (${src})${fromCache}: ${n} cambio${n === 1 ? '' : 's'}` +
            ` (altas ${added}, bajas ${removed}, actualizados ${updated})`
        );
      }
      window.dispatchEvent(new CustomEvent('roster-sync-complete', { detail: data }));
      onDone?.();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error de red');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn('flex flex-col items-start gap-2', className)}>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white px-4 py-2.5 text-sm font-semibold shadow-sm transition"
      >
        <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        Actualizar plantilla oficial
      </button>
      {message && (
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md text-left">{message}</p>
      )}
    </div>
  );
}
