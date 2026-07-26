'use client';

import { useMemo, useState } from 'react';
import { CheckSquare, Clock, Square, Trash2 } from 'lucide-react';
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

export function HistoryFeed({
  history,
  canEdit = false,
  onDelete,
  onDeleteMany,
  onClearAll,
}: {
  history: EquipmentHistoryEntry[];
  canEdit?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onDeleteMany?: (ids: string[]) => Promise<void>;
  onClearAll?: () => Promise<void>;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const allIds = useMemo(() => history.map((h) => h.id), [history]);
  const allSelected = history.length > 0 && selected.size === history.length;
  const someSelected = selected.size > 0;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(allIds));
  };

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
      setSelected(new Set());
    } finally {
      setBusy(false);
    }
  };

  if (history.length === 0) {
    return <p className="text-xs text-slate-500 py-8 text-center">Sin actividad registrada.</p>;
  }

  return (
    <div className="space-y-3 text-left">
      {canEdit && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 px-3 py-2">
          <button
            type="button"
            onClick={toggleAll}
            disabled={busy}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-orange-600"
          >
            {allSelected ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
            {allSelected ? 'Deseleccionar' : 'Seleccionar todos'}
          </button>

          <span className="text-[10px] text-slate-400 font-semibold">
            {selected.size} seleccionados
          </span>

          <div className="ml-auto flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || !someSelected || !onDeleteMany}
              onClick={() => {
                if (!onDeleteMany || !someSelected) return;
                if (!confirm(`¿Borrar ${selected.size} entrada(s) del historial?`)) return;
                void run(() => onDeleteMany([...selected]));
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-[11px] font-bold px-2.5 py-1.5"
            >
              <Trash2 className="h-3 w-3" />
              Borrar seleccionados
            </button>
            <button
              type="button"
              disabled={busy || !onClearAll}
              onClick={() => {
                if (!onClearAll) return;
                if (!confirm('¿Vaciar TODO el historial de este equipo? No se puede deshacer.')) return;
                void run(() => onClearAll());
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-40 text-[11px] font-bold px-2.5 py-1.5"
            >
              Vaciar historial
            </button>
          </div>
        </div>
      )}

      <div className="relative border-l-2 border-orange-500/20 ml-2 pl-5 space-y-4">
        {history.map((h) => {
          const isOn = selected.has(h.id);
          return (
            <div key={h.id} className="relative">
              <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-900" />
              <div
                className={`rounded-xl border bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 ${
                  isOn
                    ? 'border-orange-400 dark:border-orange-600'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex gap-2 items-start">
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => toggle(h.id)}
                      className="mt-0.5 text-slate-400 hover:text-orange-500 shrink-0"
                      aria-label={isOn ? 'Quitar selección' : 'Seleccionar'}
                    >
                      {isOn ? (
                        <CheckSquare className="h-4 w-4 text-orange-500" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  <div className="min-w-0 flex-1">
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
                  {canEdit && onDelete && (
                    <button
                      type="button"
                      disabled={busy}
                      title="Borrar esta entrada"
                      onClick={() => {
                        if (!confirm('¿Borrar esta entrada del historial?')) return;
                        void run(() => onDelete(h.id));
                      }}
                      className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
