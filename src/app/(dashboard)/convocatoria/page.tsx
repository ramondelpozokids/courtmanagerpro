'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  RefreshCw,
  CheckCircle2,
  Circle,
  Shirt,
  ExternalLink,
  ClipboardList,
} from 'lucide-react';
import { useActiveTeamId, useClubBranding } from '@/contexts/ClubDemoContext';
import { usePlayers } from '@/hooks/usePlayers';
import type { OfficialMatch } from '@/types';

type KitId = 'primera' | 'segunda' | 'tercera' | 'entrenamiento' | 'portero';

type StoredConvocatoria = {
  selectedIds: string[];
  kits: Record<string, KitId>;
};

const STORAGE_PREFIX = 'cm-convocatoria:';

const KIT_OPTIONS: { id: KitId; label: string }[] = [
  { id: 'primera', label: '1ª' },
  { id: 'segunda', label: '2ª' },
  { id: 'tercera', label: '3ª' },
  { id: 'entrenamiento', label: 'Entreno' },
  { id: 'portero', label: 'Portero' },
];

const POSITION_LABELS: Record<string, string> = {
  portero: 'Portero',
  defensa: 'Defensa',
  centrocampista: 'Centrocampista',
  delantero: 'Delantero',
  PG: 'Base',
  SG: 'Escolta',
  SF: 'Alero',
  PF: 'Ala-pívot',
  C: 'Pívot',
};

function kitLabel(id: KitId | undefined): string {
  return KIT_OPTIONS.find((k) => k.id === id)?.label || '—';
}

function sizeSummary(p: {
  shirt_size: string | null;
  shorts_size: string | null;
  sock_size: string | null;
  shoe_size: number | null;
}): string {
  const parts = [
    p.shirt_size ? `Cam ${p.shirt_size}` : null,
    p.shorts_size ? `Pan ${p.shorts_size}` : null,
    p.sock_size ? `Med ${p.sock_size}` : null,
    p.shoe_size != null ? `Pie ${p.shoe_size}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'Sin tallas';
}

export default function ConvocatoriaPage() {
  const teamId = useActiveTeamId();
  const branding = useClubBranding();
  const { players, loading: playersLoading } = usePlayers(teamId);
  const [nextMatch, setNextMatch] = useState<OfficialMatch | null>(null);
  const [matchLoading, setMatchLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [kits, setKits] = useState<Record<string, KitId>>({});
  const [positionFilter, setPositionFilter] = useState<string>('all');

  const matchKey = nextMatch?.id || nextMatch?.official_slug || 'none';
  const storageKey = `${STORAGE_PREFIX}${teamId}:${matchKey}`;

  const isFootball =
    branding.sport === 'football' || branding.slug === 'atm' || branding.slug === 'rmf';

  const kitOptions = useMemo(
    () => (isFootball ? KIT_OPTIONS : KIT_OPTIONS.filter((k) => k.id !== 'portero')),
    [isFootball]
  );

  const loadMatch = useCallback(async () => {
    setMatchLoading(true);
    try {
      const res = await fetch(`/api/calendar/sync/status?team_id=${encodeURIComponent(teamId)}`, {
        credentials: 'include',
      });
      const json = await res.json();
      setNextMatch((json.data?.nextMatch || null) as OfficialMatch | null);
    } catch {
      setNextMatch(null);
    } finally {
      setMatchLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    void loadMatch();
  }, [loadMatch]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredConvocatoria;
        setSelectedIds(Array.isArray(parsed.selectedIds) ? parsed.selectedIds : []);
        setKits(parsed.kits && typeof parsed.kits === 'object' ? parsed.kits : {});
        return;
      }
    } catch {
      /* ignore */
    }
    setSelectedIds([]);
    setKits({});
  }, [storageKey]);

  const persist = useCallback(
    (nextIds: string[], nextKits: Record<string, KitId>) => {
      setSelectedIds(nextIds);
      setKits(nextKits);
      try {
        const payload: StoredConvocatoria = { selectedIds: nextIds, kits: nextKits };
        localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  const activePlayers = useMemo(
    () => [...players].filter((p) => p.is_active !== false).sort((a, b) => a.dorsal - b.dorsal),
    [players]
  );

  const positions = useMemo(() => {
    const set = new Set<string>();
    activePlayers.forEach((p) => set.add(p.position));
    return Array.from(set);
  }, [activePlayers]);

  const filtered = useMemo(() => {
    if (positionFilter === 'all') return activePlayers;
    return activePlayers.filter((p) => p.position === positionFilter);
  }, [activePlayers, positionFilter]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const convocados = useMemo(
    () => activePlayers.filter((p) => selectedSet.has(p.id)),
    [activePlayers, selectedSet]
  );

  const togglePlayer = (id: string) => {
    const next = selectedSet.has(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    const nextKits = { ...kits };
    if (!selectedSet.has(id) && !nextKits[id]) {
      const player = activePlayers.find((p) => p.id === id);
      nextKits[id] =
        isFootball && player?.position === 'portero' ? 'portero' : 'primera';
    }
    persist(next, nextKits);
  };

  const setKit = (playerId: string, kit: KitId) => {
    persist(selectedIds, { ...kits, [playerId]: kit });
  };

  const selectAllFiltered = () => {
    const ids = new Set(selectedIds);
    const nextKits = { ...kits };
    filtered.forEach((p) => {
      ids.add(p.id);
      if (!nextKits[p.id]) {
        nextKits[p.id] =
          isFootball && p.position === 'portero' ? 'portero' : 'primera';
      }
    });
    persist(Array.from(ids), nextKits);
  };

  const clearAll = () => persist([], kits);

  const loading = matchLoading || playersLoading;

  return (
    <div className="space-y-6 text-left max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">
            Operativa utillería · {branding.shortName}
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-orange-500" />
            Convocatoria
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Marca quién viaja y asigna dorsal × prenda. Las tallas se leen de la ficha del jugador.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/prepartido"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:underline"
          >
            Pre-partido <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/transporte"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:underline"
          >
            Transporte <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando plantilla…</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            {nextMatch ? (
              <>
                <p className="text-[10px] font-bold uppercase text-slate-400">Próximo encuentro</p>
                <h3 className="text-lg font-black mt-0.5">vs {nextMatch.rival}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {[nextMatch.competition, nextMatch.match_date, nextMatch.match_time]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase text-slate-400">Sin partido próximo</p>
                <h3 className="text-lg font-black mt-0.5">Convocatoria general</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Puedes preparar la lista igual; se guarda por club.
                </p>
              </>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 text-xs font-extrabold">
                <ClipboardList className="h-3.5 w-3.5" />
                {convocados.length} convocados
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                de {activePlayers.length} en plantilla
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPositionFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${
                positionFilter === 'all'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              Todos
            </button>
            {positions.map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => setPositionFilter(pos)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${
                  positionFilter === pos
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-slate-200 text-slate-500'
                }`}
              >
                {POSITION_LABELS[pos] || pos}
              </button>
            ))}
            <div className="flex-1" />
            <button
              type="button"
              onClick={selectAllFiltered}
              className="text-[11px] font-bold text-orange-600 hover:underline"
            >
              Convocar visibles
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] font-bold text-slate-400 hover:underline"
            >
              Limpiar
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((p) => {
                const on = selectedSet.has(p.id);
                return (
                  <div
                    key={p.id}
                    className={`flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 ${
                      on ? 'bg-emerald-50/40 dark:bg-emerald-950/10' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => togglePlayer(p.id)}
                      className="flex items-center gap-3 min-w-0 flex-1 text-left"
                    >
                      {on ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                      )}
                      <span className="w-8 text-center text-sm font-black text-orange-600 shrink-0">
                        {p.dorsal}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-bold truncate ${
                            on ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600'
                          }`}
                        >
                          {p.full_name}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-semibold">
                          {POSITION_LABELS[p.position] || p.position} · {sizeSummary(p)}
                        </span>
                      </span>
                    </button>
                    {on ? (
                      <div className="flex flex-wrap items-center gap-1 sm:pl-0 pl-11">
                        <Shirt className="h-3.5 w-3.5 text-slate-400 mr-0.5" />
                        {kitOptions.map((k) => (
                          <button
                            key={k.id}
                            type="button"
                            onClick={() => setKit(p.id, k.id)}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                              kits[p.id] === k.id
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-slate-200 text-slate-500 hover:border-orange-200'
                            }`}
                          >
                            {k.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
              {!filtered.length ? (
                <p className="px-4 py-10 text-center text-xs text-slate-400 font-semibold">
                  No hay jugadores en este filtro.
                </p>
              ) : null}
            </div>
          </div>

          {convocados.length > 0 ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="text-sm font-extrabold flex items-center gap-2 mb-3">
                <ClipboardList className="h-4 w-4 text-orange-500" />
                Resumen packing (dorsal × prenda)
              </h3>
              <ul className="space-y-2">
                {convocados.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0"
                  >
                    <span className="font-black text-orange-600 w-7">#{p.dorsal}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{p.full_name}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-slate-600">Kit {kitLabel(kits[p.id])}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{sizeSummary(p)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
