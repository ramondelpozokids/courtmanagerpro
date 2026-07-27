'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useActiveTeamId } from '@/contexts/ClubDemoContext';
import {
  ClipboardCheck,
  RefreshCw,
  Calendar,
  Plane,
  Shirt,
  Stethoscope,
  Package,
  ExternalLink,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import type { OfficialMatch } from '@/types';

type CheckItem = { id: string; label: string; href: string; done: boolean };

const STORAGE_PREFIX = 'cm-prematch-checklist:';

export default function PrematchChecklistPage() {
  const teamId = useActiveTeamId();
  const [nextMatch, setNextMatch] = useState<OfficialMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState<CheckItem[]>([]);

  const persistKey = `${STORAGE_PREFIX}${teamId}:${nextMatch?.id || nextMatch?.official_slug || 'none'}`;

  const buildChecks = useCallback(
    (match: OfficialMatch | null, saved: Record<string, boolean> = {}): CheckItem[] => {
      const base: CheckItem[] = [
        {
          id: 'calendar',
          label: 'Confirmar rival, hora y pabellón en calendario oficial',
          href: '/calendario',
          done: Boolean(saved.calendar),
        },
        {
          id: 'trip',
          label: match
            ? `Preparar packing list del viaje / partido vs ${match.rival}`
            : 'Crear o revisar viaje y packing list',
          href: '/trips',
          done: Boolean(saved.trip),
        },
        {
          id: 'laundry',
          label: 'Revisar lavandería (lotes pendientes antes del partido)',
          href: '/laundry',
          done: Boolean(saved.laundry),
        },
        {
          id: 'medical',
          label: 'Botiquín de partido / viaje completo y caducidades OK',
          href: '/medical',
          done: Boolean(saved.medical),
        },
        {
          id: 'inventory',
          label: 'Stock crítico: equipación y calzado del plantel',
          href: '/almacen',
          done: Boolean(saved.inventory),
        },
        {
          id: 'requests',
          label: 'Cerrar solicitudes pendientes del jugador / staff',
          href: '/requests',
          done: Boolean(saved.requests),
        },
      ];
      return base;
    },
    []
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/calendar/sync/status?team_id=${encodeURIComponent(teamId)}`, {
        credentials: 'include',
      });
      const json = await res.json();
      const match = (json.data?.nextMatch || null) as OfficialMatch | null;
      setNextMatch(match);
      let saved: Record<string, boolean> = {};
      try {
        const raw = localStorage.getItem(
          `${STORAGE_PREFIX}${teamId}:${match?.id || match?.official_slug || 'none'}`
        );
        if (raw) saved = JSON.parse(raw);
      } catch {
        /* ignore */
      }
      setChecks(buildChecks(match, saved));
    } finally {
      setLoading(false);
    }
  }, [teamId, buildChecks]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = (id: string) => {
    setChecks((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c));
      const map: Record<string, boolean> = {};
      next.forEach((c) => {
        map[c.id] = c.done;
      });
      try {
        localStorage.setItem(persistKey, JSON.stringify(map));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const doneCount = checks.filter((c) => c.done).length;
  const progress = checks.length ? Math.round((doneCount / checks.length) * 100) : 0;

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">
          Operativa utillería
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <ClipboardCheck className="h-7 w-7 text-orange-500" />
          Checklist pre-partido
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Del calendario oficial al packing, lavandería y botiquín — listo para presentar al club.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando próximo partido…</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            {nextMatch ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Próximo encuentro</p>
                    <h3 className="text-lg font-black mt-1">vs {nextMatch.rival}</h3>
                    <p className="text-xs text-slate-500 mt-1">{nextMatch.competition}</p>
                  </div>
                  <Link
                    href="/calendario"
                    className="text-[11px] font-bold text-orange-600 inline-flex items-center gap-1"
                  >
                    Calendario <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">
                      {nextMatch.match_date}
                      {nextMatch.match_time ? ` · ${String(nextMatch.match_time).slice(0, 5)}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Plane className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">
                      {nextMatch.home_away === 'local' ? 'Local' : nextMatch.home_away === 'visitante' ? 'Visitante' : 'Neutral'}
                      {nextMatch.venue ? ` · ${nextMatch.venue}` : ''}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold">Sin próximo partido sincronizado</p>
                <p className="text-xs text-slate-500 mt-1">Actualiza el calendario y vuelve aquí.</p>
                <Link href="/calendario" className="inline-block mt-3 text-xs font-bold text-orange-600">
                  Ir a calendario
                </Link>
              </div>
            )}
          </div>

          <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-500">Progreso operativa</p>
              <p className="text-xs font-black text-orange-600">
                {doneCount}/{checks.length} · {progress}%
              </p>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            {checks.map((c) => (
              <div
                key={c.id}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                  c.done
                    ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <button type="button" onClick={() => toggle(c.id)} className="shrink-0" title="Marcar">
                  {c.done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${c.done ? 'text-slate-500 line-through' : ''}`}>
                    {c.label}
                  </p>
                </div>
                <Link
                  href={c.href}
                  className="shrink-0 text-[11px] font-bold text-orange-600 inline-flex items-center gap-1"
                >
                  {c.id === 'trip' ? (
                    <Plane className="h-3.5 w-3.5" />
                  ) : c.id === 'laundry' ? (
                    <Shirt className="h-3.5 w-3.5" />
                  ) : c.id === 'medical' ? (
                    <Stethoscope className="h-3.5 w-3.5" />
                  ) : c.id === 'inventory' ? (
                    <Package className="h-3.5 w-3.5" />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5" />
                  )}
                  Abrir
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
