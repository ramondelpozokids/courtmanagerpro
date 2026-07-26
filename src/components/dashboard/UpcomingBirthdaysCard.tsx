'use client';

import { useCallback, useEffect, useState } from 'react';
import { Cake } from 'lucide-react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { useAuth } from '@/contexts/AuthContext';
import { useClubBranding } from '@/contexts/ClubDemoContext';
import type { BirthdayPerson } from '@/application/birthday-alerts/types';
import { formatBirthDateEs } from '@/application/birthday-alerts/dateUtils';
import { cn } from '@/lib/utils';

function daysLabel(days: number): string {
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  return `En ${days} días`;
}

export function UpcomingBirthdaysCard({ className }: { className?: string }) {
  const { currentTeam } = useAuth();
  const branding = useClubBranding();
  // Preferir teamId del club activo (RMF/FCB/…) — Auth a veces sigue en RMB en preview
  const teamId = branding.teamId || currentTeam?.id || DEFAULT_TEAM_ID;
  const [upcoming, setUpcoming] = useState<BirthdayPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendError, setSendError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/birthdays/upcoming?team_id=${encodeURIComponent(teamId)}`);
      const json = await res.json();
      setUpcoming(json.data?.upcoming || []);
      const failed = (json.data?.history || []).find((h: { status?: string }) => h.status === 'failed');
      setSendError(failed?.error_message || null);
    } catch {
      setUpcoming([]);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    void load();
    const onRoster = () => void load();
    const onClub = () => void load();
    window.addEventListener('roster-sync-complete', onRoster);
    window.addEventListener('birthday-job-complete', onRoster);
    window.addEventListener('club-demo-changed', onClub);
    return () => {
      window.removeEventListener('roster-sync-complete', onRoster);
      window.removeEventListener('birthday-job-complete', onRoster);
      window.removeEventListener('club-demo-changed', onClub);
    };
  }, [load]);

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-left',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Cake className="h-5 w-5 text-orange-500" />
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
          🎂 Próximos cumpleaños
        </h3>
      </div>

      {sendError && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 px-3 py-2 text-xs">
          El correo de cumpleaños no pudo enviarse: {sendError}
        </div>
      )}

      <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
        {loading && <p className="text-xs text-slate-400">Cargando…</p>}
        {!loading && upcoming.length === 0 && (
          <p className="text-xs text-slate-400">Sin fechas de nacimiento en la plantilla oficial.</p>
        )}
        {upcoming.map((p) => (
          <div key={`${p.person_type}-${p.id}`} className="flex gap-3 items-center">
            <div className="h-12 w-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
              {p.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photo_url} alt={p.full_name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400">
                  N/A
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{p.full_name}</p>
              <p className="text-[11px] text-slate-500 truncate">{p.role}</p>
              <p className="text-[11px] text-slate-400">
                {formatBirthDateEs(p.birth_date)} · cumple {p.turning_age}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] font-black text-orange-600 uppercase">{daysLabel(p.days_until)}</p>
              <p className="text-[10px] text-slate-400">{p.next_birthday}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
