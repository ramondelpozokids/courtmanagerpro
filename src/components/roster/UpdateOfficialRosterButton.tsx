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
  const { currentTeam } = useAuth();
  const { clubSlug, club } = useClubDemo();
  const teamId =
    CLUB_TEAM_IDS[clubSlug] || club.branding.teamId || currentTeam?.id || DEFAULT_TEAM_ID;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/roster/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'manual', team_id: teamId, force: true }),
      });
      const json = await res.json();
      const data = json.data;
      if (data?.status === 'error') {
        setMessage(data.errorMessage || 'Error al sincronizar (se mantiene la plantilla actual)');
      } else if (data?.skipped) {
        setMessage('Ya estaba actualizada');
      } else {
        const n = data?.changesCount ?? 0;
        const src = clubSlug === 'rmf' || clubSlug === 'atm' ? 'fútbol' : 'baloncesto';
        setMessage(
          n === 0
            ? `Plantilla ${src} al día — sin cambios`
            : `Sincronizado (${src}): ${n} cambio${n === 1 ? '' : 's'} aplicado${n === 1 ? '' : 's'}`
        );
        window.dispatchEvent(new CustomEvent('roster-sync-complete', { detail: data }));
        onDone?.();
      }
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
