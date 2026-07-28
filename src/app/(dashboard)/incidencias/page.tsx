'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Plus,
  Trash2,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { useActiveTeamId, useClubBranding } from '@/contexts/ClubDemoContext';
import { usePlayers } from '@/hooks/usePlayers';
import { sortPlayersByPosition } from '@/lib/player-sort';
import type { OfficialMatch } from '@/types';

type IncidentType = 'rota' | 'mancha' | 'perdida' | 'dorsal' | 'otra';
type IncidentStatus = 'abierta' | 'en_curso' | 'cerrada';

type Incident = {
  id: string;
  createdAt: string;
  type: IncidentType;
  status: IncidentStatus;
  item: string;
  playerId: string;
  playerName: string;
  dorsal: string;
  responsible: string;
  notes: string;
  matchLabel: string;
};

const STORAGE_PREFIX = 'cm-incidencias:';

const TYPE_LABELS: Record<IncidentType, string> = {
  rota: 'Rota / dañada',
  mancha: 'Mancha',
  perdida: 'Pérdida',
  dorsal: 'Dorsal incorrecto',
  otra: 'Otra',
};

const STATUS_LABELS: Record<IncidentStatus, string> = {
  abierta: 'Abierta',
  en_curso: 'En curso',
  cerrada: 'Cerrada',
};

function newId() {
  return `inc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function IncidenciasPage() {
  const teamId = useActiveTeamId();
  const branding = useClubBranding();
  const { players } = usePlayers(teamId);
  const [items, setItems] = useState<Incident[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | IncidentStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | IncidentType>('all');
  const [nextMatch, setNextMatch] = useState<OfficialMatch | null>(null);
  const [form, setForm] = useState({
    type: 'rota' as IncidentType,
    item: '',
    playerId: '',
    responsible: '',
    notes: '',
  });

  const storageKey = `${STORAGE_PREFIX}${teamId}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Incident[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    setItems([]);
  }, [storageKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/calendar/sync/status?team_id=${encodeURIComponent(teamId)}`, {
          credentials: 'include',
        });
        const json = await res.json();
        if (!cancelled) setNextMatch((json.data?.nextMatch || null) as OfficialMatch | null);
      } catch {
        if (!cancelled) setNextMatch(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [teamId]);

  const persist = useCallback(
    (next: Incident[]) => {
      setItems(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  const activePlayers = useMemo(
    () =>
      sortPlayersByPosition(
        players.filter((p) => p.is_active !== false),
        branding.sport
      ),
    [players, branding.sport]
  );

  const filtered = useMemo(() => {
    return items
      .filter((i) => (statusFilter === 'all' ? true : i.status === statusFilter))
      .filter((i) => (typeFilter === 'all' ? true : i.type === typeFilter))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [items, statusFilter, typeFilter]);

  const openCount = items.filter((i) => i.status !== 'cerrada').length;

  const addIncident = () => {
    if (!form.item.trim()) return;
    const player = activePlayers.find((p) => p.id === form.playerId);
    const matchLabel = nextMatch
      ? `vs ${nextMatch.rival} · ${nextMatch.match_date}`
      : 'Sin partido';
    const next: Incident = {
      id: newId(),
      createdAt: new Date().toISOString(),
      type: form.type,
      status: 'abierta',
      item: form.item.trim(),
      playerId: player?.id || '',
      playerName: player?.full_name || '',
      dorsal: player ? String(player.dorsal) : '',
      responsible: form.responsible.trim(),
      notes: form.notes.trim(),
      matchLabel,
    };
    persist([next, ...items]);
    setForm({ type: 'rota', item: '', playerId: '', responsible: '', notes: '' });
  };

  const setStatus = (id: string, status: IncidentStatus) => {
    persist(items.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const remove = (id: string) => {
    persist(items.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">
          Operativa utillería
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <AlertTriangle className="h-7 w-7 text-orange-500" />
          Incidencias de material
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Roturas, manchas, pérdidas y dorsales — registro rápido del día del partido ({branding.name}).
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase text-slate-400">Abiertas / en curso</p>
          <p className="text-2xl font-black text-orange-600">{openCount}</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p className="font-semibold">{items.length} registradas</p>
          {nextMatch ? (
            <p className="mt-0.5">Contexto: vs {nextMatch.rival}</p>
          ) : (
            <p className="mt-0.5">Sin partido sincronizado</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
        <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">Nueva incidencia</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-[11px] font-bold text-slate-500">
            Tipo
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as IncidentType }))}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-semibold"
            >
              {(Object.keys(TYPE_LABELS) as IncidentType[]).map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[11px] font-bold text-slate-500">
            Prenda / material
            <input
              value={form.item}
              onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))}
              placeholder="Ej. Camiseta 1ª · dorsal 9"
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-semibold"
            />
          </label>
          <label className="block text-[11px] font-bold text-slate-500">
            Jugador (opcional)
            <select
              value={form.playerId}
              onChange={(e) => setForm((f) => ({ ...f, playerId: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-semibold"
            >
              <option value="">— Sin asignar —</option>
              {activePlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.dorsal} {p.full_name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[11px] font-bold text-slate-500">
            Responsable
            <input
              value={form.responsible}
              onChange={(e) => setForm((f) => ({ ...f, responsible: e.target.value }))}
              placeholder="Utillero / fisio…"
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-semibold"
            />
          </label>
        </div>
        <label className="block text-[11px] font-bold text-slate-500">
          Notas
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={2}
            placeholder="Detalle, talla, acción prevista…"
            className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={addIncident}
          disabled={!form.item.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-xs font-bold px-4 py-2.5 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Registrar incidencia
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | IncidentStatus)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs font-semibold"
        >
          <option value="all">Todos los estados</option>
          {(Object.keys(STATUS_LABELS) as IncidentStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as 'all' | IncidentType)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs font-semibold"
        >
          <option value="all">Todos los tipos</option>
          {(Object.keys(TYPE_LABELS) as IncidentType[]).map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <Link href="/postpartido" className="ml-auto text-[11px] font-bold text-orange-600 inline-flex items-center gap-1">
          Post-partido <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 py-10 text-center text-xs text-slate-400 font-semibold">
            Sin incidencias con este filtro
          </div>
        ) : (
          filtered.map((inc) => (
            <div
              key={inc.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                      {TYPE_LABELS[inc.type]}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {STATUS_LABELS[inc.status]}
                    </span>
                  </div>
                  <p className="text-sm font-extrabold mt-2 truncate">{inc.item}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {inc.playerName
                      ? `#${inc.dorsal} ${inc.playerName}`
                      : 'Sin jugador'}
                    {inc.responsible ? ` · Resp: ${inc.responsible}` : ''}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {inc.matchLabel} · {new Date(inc.createdAt).toLocaleString('es-ES')}
                  </p>
                  {inc.notes ? (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{inc.notes}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => remove(inc.id)}
                  className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(Object.keys(STATUS_LABELS) as IncidentStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(inc.id, s)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                      inc.status === s
                        ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
