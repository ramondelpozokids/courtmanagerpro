'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Footprints, RefreshCw, ExternalLink, Search } from 'lucide-react';
import { useActiveTeamId, useClubBranding } from '@/contexts/ClubDemoContext';
import { usePlayers } from '@/hooks/usePlayers';

type BootLocation = 'jugador' | 'utileria';

type BootRecord = {
  brand: string;
  model: string;
  color: string;
  notes: string;
  location: BootLocation;
};

type StoredBoots = Record<string, BootRecord>;

const STORAGE_PREFIX = 'cm-botas:';

const EMPTY: BootRecord = {
  brand: '',
  model: '',
  color: '',
  notes: '',
  location: 'jugador',
};

function shoeFromMeta(metadata: Record<string, unknown> | null | undefined): string | null {
  if (!metadata || typeof metadata !== 'object') return null;
  const sizing = metadata.sizing as Record<string, unknown> | undefined;
  if (!sizing || typeof sizing !== 'object') return null;
  const game = sizing.shoes_game;
  const training = sizing.shoes_training;
  if (typeof game === 'string' && game.trim()) return game;
  if (typeof training === 'string' && training.trim()) return training;
  return null;
}

export default function BotasPage() {
  const teamId = useActiveTeamId();
  const branding = useClubBranding();
  const { players, loading } = usePlayers(teamId);
  const [records, setRecords] = useState<StoredBoots>({});
  const [query, setQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<'all' | BootLocation>('all');

  const storageKey = `${STORAGE_PREFIX}${teamId}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredBoots;
        if (parsed && typeof parsed === 'object') {
          setRecords(parsed);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    setRecords({});
  }, [storageKey]);

  const persist = useCallback(
    (next: StoredBoots) => {
      setRecords(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  const patch = (playerId: string, partial: Partial<BootRecord>) => {
    const prev = records[playerId] || EMPTY;
    persist({
      ...records,
      [playerId]: { ...prev, ...partial },
    });
  };

  const activePlayers = useMemo(
    () => [...players].filter((p) => p.is_active !== false).sort((a, b) => a.dorsal - b.dorsal),
    [players]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activePlayers.filter((p) => {
      const rec = records[p.id] || EMPTY;
      if (locationFilter !== 'all' && rec.location !== locationFilter) {
        // Only apply location filter if the player has a record or we're filtering utileria with empty = jugador default
        if (locationFilter === 'utileria' && (!records[p.id] || rec.location !== 'utileria')) {
          return false;
        }
        if (locationFilter === 'jugador') {
          const loc = records[p.id]?.location ?? 'jugador';
          if (loc !== 'jugador') return false;
        }
      }
      if (!q) return true;
      const hay = [
        p.full_name,
        String(p.dorsal),
        rec.brand,
        rec.model,
        rec.color,
        rec.notes,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [activePlayers, query, locationFilter, records]);

  const utileriaCount = useMemo(
    () => Object.values(records).filter((r) => r.location === 'utileria').length,
    [records]
  );

  return (
    <div className="space-y-6 text-left max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">
            Operativa utillería · {branding.shortName}
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Footprints className="h-7 w-7 text-orange-500" />
            Botas personales
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registro de calzado personal por jugador. No modifica inventario ni tallas oficiales.
          </p>
        </div>
        <Link
          href="/sizing"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:underline"
        >
          Tabla de tallas <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar dorsal, nombre, marca…"
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>
        <button
          type="button"
          onClick={() => setLocationFilter('all')}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${
            locationFilter === 'all'
              ? 'border-orange-500 bg-orange-50 text-orange-700'
              : 'border-slate-200 text-slate-500'
          }`}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => setLocationFilter('jugador')}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${
            locationFilter === 'jugador'
              ? 'border-orange-500 bg-orange-50 text-orange-700'
              : 'border-slate-200 text-slate-500'
          }`}
        >
          Con el jugador
        </button>
        <button
          type="button"
          onClick={() => setLocationFilter('utileria')}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${
            locationFilter === 'utileria'
              ? 'border-orange-500 bg-orange-50 text-orange-700'
              : 'border-slate-200 text-slate-500'
          }`}
        >
          En utilería ({utileriaCount})
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando plantilla…</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const rec = records[p.id] || EMPTY;
            const metaShoe = shoeFromMeta(p.metadata as Record<string, unknown>);
            return (
              <div
                key={p.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      <span className="text-orange-600 mr-1.5">#{p.dorsal}</span>
                      {p.full_name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      Talla ficha: {p.shoe_size != null ? p.shoe_size : '—'}
                      {metaShoe ? ` · Sizing: ${metaShoe}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => patch(p.id, { location: 'jugador' })}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                        rec.location === 'jugador'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      Viaja con jugador
                    </button>
                    <button
                      type="button"
                      onClick={() => patch(p.id, { location: 'utileria' })}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                        rec.location === 'utileria'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      En utilería
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <label className="block">
                    <span className="text-[9px] font-bold uppercase text-slate-400">Marca</span>
                    <input
                      value={rec.brand}
                      onChange={(e) => patch(p.id, { brand: e.target.value })}
                      placeholder="Nike / Adidas…"
                      className="mt-0.5 w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[9px] font-bold uppercase text-slate-400">Modelo</span>
                    <input
                      value={rec.model}
                      onChange={(e) => patch(p.id, { model: e.target.value })}
                      placeholder="Mercurial, Predator…"
                      className="mt-0.5 w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[9px] font-bold uppercase text-slate-400">Color</span>
                    <input
                      value={rec.color}
                      onChange={(e) => patch(p.id, { color: e.target.value })}
                      placeholder="Negro / blanco…"
                      className="mt-0.5 w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[9px] font-bold uppercase text-slate-400">Notas</span>
                    <input
                      value={rec.notes}
                      onChange={(e) => patch(p.id, { notes: e.target.value })}
                      placeholder="Repuesto, lesión, etc."
                      className="mt-0.5 w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </label>
                </div>
              </div>
            );
          })}
          {!filtered.length ? (
            <p className="py-12 text-center text-xs text-slate-400 font-semibold">
              Ningún jugador coincide con el filtro.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
