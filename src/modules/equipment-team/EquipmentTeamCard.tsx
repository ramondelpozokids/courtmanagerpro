'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HardHat, AlertTriangle } from 'lucide-react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { cn } from '@/lib/utils';
import type { EquipmentNotice, EquipmentTeamSummary } from './types';

export function EquipmentTeamCard({
  className,
  teamId = DEFAULT_TEAM_ID,
}: {
  className?: string;
  teamId?: string;
}) {
  const [summary, setSummary] = useState<EquipmentTeamSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`/api/equipment-team?team_id=${encodeURIComponent(teamId)}`);
        const json = await res.json();
        if (!cancelled && res.ok) setSummary(json.data?.summary ?? null);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [teamId]);

  const urgent: EquipmentNotice[] = summary?.urgentNotices ?? [];

  return (
    <div className={cn('text-left transition-all duration-150 ease-out', className)}>
      <div className="flex items-start gap-3 mb-3">
        <div className="rounded-xl bg-orange-500/15 border border-orange-500/20 p-2.5">
          <HardHat className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            Equipo de Utillería
          </h3>
          <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
            Compañeros, notas, informes, tareas y avisos del hub interno.
          </p>
        </div>
      </div>

      {summary && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Stat label="Activos" value={summary.activeMembers} />
          <Stat label="Tareas" value={summary.pendingTasks.length} />
          <Stat label="Urgentes" value={urgent.length} warn={urgent.length > 0} />
        </div>
      )}

      {urgent.length > 0 && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 space-y-1.5">
          <p className="text-[10px] font-black uppercase text-red-400 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Avisos urgentes
          </p>
          {urgent.slice(0, 2).map((n) => (
            <p key={n.id} className="text-xs text-red-200/90 font-semibold truncate">
              {n.title}
            </p>
          ))}
        </div>
      )}

      <Link
        href="/equipment-team"
        className="mt-5 block text-center py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md"
      >
        Abrir hub de utillería
      </Link>
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="rounded-lg bg-slate-900/80 border border-slate-800 py-2">
      <p className={`text-lg font-black ${warn ? 'text-red-400' : 'text-white'}`}>{value}</p>
      <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
    </div>
  );
}
