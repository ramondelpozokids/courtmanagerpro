'use client';

import { Clock } from 'lucide-react';
import type { EquipmentHistoryEntry } from '../types';

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function HistoryFeed({ history }: { history: EquipmentHistoryEntry[] }) {
  if (history.length === 0) {
    return <p className="text-xs text-slate-500 py-8 text-center">Sin actividad registrada.</p>;
  }

  return (
    <div className="relative border-l-2 border-orange-500/20 ml-2 pl-5 space-y-4 text-left">
      {history.map((h) => (
        <div key={h.id} className="relative">
          <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-900" />
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3">
            <p className="text-sm text-slate-700 dark:text-slate-200">
              <span className="font-extrabold text-slate-900 dark:text-white">{h.actor_name}</span>{' '}
              {h.action}
              {h.details ? (
                <span className="text-slate-500"> — {h.details}</span>
              ) : null}
            </p>
            <p className="mt-1 text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-wider">
              <Clock className="h-3 w-3" />
              {formatWhen(h.created_at)} · {h.entity_type}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
