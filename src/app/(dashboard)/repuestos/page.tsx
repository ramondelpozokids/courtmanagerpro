'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  PackagePlus,
  RefreshCw,
  CheckCircle2,
  Circle,
  ExternalLink,
} from 'lucide-react';
import { useActiveTeamId, useClubBranding } from '@/contexts/ClubDemoContext';
import type { OfficialMatch } from '@/types';

type SpareItem = {
  id: string;
  label: string;
  category: string;
  qty: number;
  minQty: number;
  ready: boolean;
  notes: string;
};

const STORAGE_PREFIX = 'cm-repuestos:';

const TEMPLATE: Omit<SpareItem, 'qty' | 'ready' | 'notes'>[] = [
  { id: 'kit1_extra', label: 'Sets extra 1ª equipación (camiseta+pantalón+medias)', category: 'Equipación', minQty: 3 },
  { id: 'kit2_extra', label: 'Sets extra 2ª equipación', category: 'Equipación', minQty: 3 },
  { id: 'kit3_extra', label: 'Sets extra 3ª equipación', category: 'Equipación', minQty: 2 },
  { id: 'train_extra', label: 'Sets extra entrenamiento', category: 'Equipación', minQty: 2 },
  { id: 'gk_extra', label: 'Set portero de emergencia', category: 'Equipación', minQty: 1 },
  { id: 'dorsal_blank', label: 'Camisetas lisas / dorsales de emergencia', category: 'Dorsales', minQty: 4 },
  { id: 'dorsal_kit', label: 'Kit dorsales térmicos + números sueltos', category: 'Dorsales', minQty: 1 },
  { id: 'sewing', label: 'Kit costura completo (hilo, agujas, tijeras)', category: 'Costura', minQty: 1 },
  { id: 'patches', label: 'Parches / escudos / sponsor de emergencia', category: 'Costura', minQty: 2 },
  { id: 'socks_spare', label: 'Medias extra (varios colores)', category: 'Accesorios', minQty: 10 },
  { id: 'tape', label: 'Cinta athletic / pre-wrap / esparadrapo', category: 'Accesorios', minQty: 6 },
  { id: 'laces', label: 'Cordones de botas (varios)', category: 'Accesorios', minQty: 10 },
];

export default function RepuestosPage() {
  const teamId = useActiveTeamId();
  const branding = useClubBranding();
  const [nextMatch, setNextMatch] = useState<OfficialMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SpareItem[]>([]);

  const matchKey = nextMatch?.id || nextMatch?.official_slug || 'none';
  const storageKey = `${STORAGE_PREFIX}${teamId}:${matchKey}`;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/calendar/sync/status?team_id=${encodeURIComponent(teamId)}`, {
        credentials: 'include',
      });
      const json = await res.json();
      const match = (json.data?.nextMatch || null) as OfficialMatch | null;
      setNextMatch(match);

      const key = `${STORAGE_PREFIX}${teamId}:${match?.id || match?.official_slug || 'none'}`;
      let saved: Record<string, { qty?: number; ready?: boolean; notes?: string }> = {};
      try {
        const raw = localStorage.getItem(key);
        if (raw) saved = JSON.parse(raw);
      } catch {
        /* ignore */
      }

      setItems(
        TEMPLATE.map((t) => ({
          ...t,
          qty: typeof saved[t.id]?.qty === 'number' ? saved[t.id].qty! : t.minQty,
          ready: Boolean(saved[t.id]?.ready),
          notes: typeof saved[t.id]?.notes === 'string' ? saved[t.id].notes! : '',
        }))
      );
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    void load();
  }, [load]);

  const persist = useCallback(
    (next: SpareItem[]) => {
      setItems(next);
      const map: Record<string, { qty: number; ready: boolean; notes: string }> = {};
      next.forEach((i) => {
        map[i.id] = { qty: i.qty, ready: i.ready, notes: i.notes };
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(map));
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  const patch = (id: string, partial: Partial<SpareItem>) => {
    persist(items.map((i) => (i.id === id ? { ...i, ...partial } : i)));
  };

  const readyCount = items.filter((i) => i.ready && i.qty >= i.minQty).length;
  const lowCount = items.filter((i) => i.qty < i.minQty).length;
  const progress = items.length ? Math.round((readyCount / items.length) * 100) : 0;

  const categories = useMemo(() => {
    const order: string[] = [];
    for (const i of items) {
      if (!order.includes(i.category)) order.push(i.category);
    }
    return order;
  }, [items]);

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">
          Operativa utillería
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <PackagePlus className="h-7 w-7 text-orange-500" />
          Repuestos de emergencia
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Sets extra, dorsales y kit costura — mínimo que no puede faltar en un primer equipo ({branding.name}).
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando…</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Listos</p>
              <p className="text-xl font-black text-emerald-600">
                {readyCount}/{items.length}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Bajo mínimo</p>
              <p className="text-xl font-black text-red-500">{lowCount}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Progreso</p>
              <p className="text-xl font-black text-orange-600">{progress}%</p>
            </div>
          </div>

          {nextMatch ? (
            <p className="text-xs text-slate-500 font-semibold">
              Partido: vs {nextMatch.rival} · {nextMatch.match_date}
            </p>
          ) : null}

          {categories.map((cat) => (
            <section key={cat} className="space-y-2">
              <h3 className="text-sm font-extrabold">{cat}</h3>
              <div className="space-y-2">
                {items
                  .filter((i) => i.category === cat)
                  .map((item) => {
                    const low = item.qty < item.minQty;
                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border bg-white dark:bg-slate-900 p-4 ${
                          low
                            ? 'border-red-200 dark:border-red-900/50'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => patch(item.id, { ready: !item.ready })}
                            className="flex items-start gap-2 text-left min-w-0"
                          >
                            {item.ready ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                            )}
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                              {item.label}
                            </span>
                          </button>
                          <div className="shrink-0 text-right">
                            <label className="text-[10px] font-bold text-slate-400 block">
                              Cantidad
                              <input
                                type="number"
                                min={0}
                                value={item.qty}
                                onChange={(e) =>
                                  patch(item.id, { qty: Math.max(0, Number(e.target.value) || 0) })
                                }
                                className={`mt-1 w-16 rounded-lg border px-2 py-1 text-sm font-bold text-center ${
                                  low
                                    ? 'border-red-300 text-red-600'
                                    : 'border-slate-200 dark:border-slate-700'
                                } bg-white dark:bg-slate-950`}
                              />
                            </label>
                            <p className="text-[10px] text-slate-400 mt-1">mín. {item.minQty}</p>
                          </div>
                        </div>
                        <input
                          value={item.notes}
                          onChange={(e) => patch(item.id, { notes: e.target.value })}
                          placeholder="Notas / ubicación en petate…"
                          className="mt-3 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs"
                        />
                      </div>
                    );
                  })}
              </div>
            </section>
          ))}

          <div className="flex flex-wrap gap-3 text-[11px] font-bold">
            <Link href="/prepartido" className="text-orange-600 inline-flex items-center gap-1">
              Pre-partido <ExternalLink className="h-3 w-3" />
            </Link>
            <Link href="/incidencias" className="text-orange-600 inline-flex items-center gap-1">
              Incidencias <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
