'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ThermometerSnowflake,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useActiveTeamId, useClubBranding } from '@/contexts/ClubDemoContext';
import type { OfficialMatch } from '@/types';

type MedItem = {
  id: string;
  label: string;
  category: string;
  qty: number;
  minQty: number;
  expiry: string;
  coldChain: boolean;
  notes: string;
};

const STORAGE_PREFIX = 'cm-caducidades-medico:';

const TEMPLATE: Omit<MedItem, 'qty' | 'expiry' | 'notes'>[] = [
  { id: 'ice_packs', label: 'Packs de frío / hielo gel', category: 'Cadena de frío', minQty: 12, coldChain: true },
  { id: 'cooler_med', label: 'Nevera médica de viaje operativa', category: 'Cadena de frío', minQty: 1, coldChain: true },
  { id: 'cold_spray', label: 'Spray frío / geles antiinflamatorios', category: 'Cadena de frío', minQty: 4, coldChain: true },
  { id: 'gauze', label: 'Gasas / apósitos estériles', category: 'Botiquín', minQty: 20, coldChain: false },
  { id: 'tape_med', label: 'Vendas elásticas + tape', category: 'Botiquín', minQty: 10, coldChain: false },
  { id: 'disinfectant', label: 'Antiséptico / solución lavado', category: 'Botiquín', minQty: 2, coldChain: false },
  { id: 'gloves', label: 'Guantes desechables (cajas)', category: 'Botiquín', minQty: 2, coldChain: false },
  { id: 'scissors', label: 'Tijeras / pinzas / material cortante', category: 'Botiquín', minQty: 1, coldChain: false },
  { id: 'saline', label: 'Suero fisiológico', category: 'Consumibles', minQty: 6, coldChain: false },
  { id: 'pain_gel', label: 'Cremas / geles musculares', category: 'Consumibles', minQty: 3, coldChain: false },
  { id: 'glucose', label: 'Gel glucosa / sales (si protocolo club)', category: 'Consumibles', minQty: 6, coldChain: false },
  { id: 'stretcher', label: 'Camilla fisio / bolsa trauma lista', category: 'Equipo', minQty: 1, coldChain: false },
];

function daysUntil(expiry: string): number | null {
  if (!expiry) return null;
  const d = new Date(`${expiry}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export default function CaducidadesMedicoPage() {
  const teamId = useActiveTeamId();
  const branding = useClubBranding();
  const [nextMatch, setNextMatch] = useState<OfficialMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<MedItem[]>([]);

  const storageKey = `${STORAGE_PREFIX}${teamId}`;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/calendar/sync/status?team_id=${encodeURIComponent(teamId)}`, {
        credentials: 'include',
      });
      const json = await res.json();
      setNextMatch((json.data?.nextMatch || null) as OfficialMatch | null);

      let saved: Record<string, { qty?: number; expiry?: string; notes?: string }> = {};
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) saved = JSON.parse(raw);
      } catch {
        /* ignore */
      }

      setItems(
        TEMPLATE.map((t) => ({
          ...t,
          qty: typeof saved[t.id]?.qty === 'number' ? saved[t.id].qty! : t.minQty,
          expiry: typeof saved[t.id]?.expiry === 'string' ? saved[t.id].expiry! : '',
          notes: typeof saved[t.id]?.notes === 'string' ? saved[t.id].notes! : '',
        }))
      );
    } finally {
      setLoading(false);
    }
  }, [teamId, storageKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const persist = useCallback(
    (next: MedItem[]) => {
      setItems(next);
      const map: Record<string, { qty: number; expiry: string; notes: string }> = {};
      next.forEach((i) => {
        map[i.id] = { qty: i.qty, expiry: i.expiry, notes: i.notes };
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(map));
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  const patch = (id: string, partial: Partial<MedItem>) => {
    persist(items.map((i) => (i.id === id ? { ...i, ...partial } : i)));
  };

  const alerts = useMemo(() => {
    return items
      .map((i) => {
        const days = daysUntil(i.expiry);
        const low = i.qty < i.minQty;
        const expired = days !== null && days < 0;
        const soon = days !== null && days >= 0 && days <= 30;
        return { item: i, days, low, expired, soon };
      })
      .filter((a) => a.low || a.expired || a.soon);
  }, [items]);

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
          <ThermometerSnowflake className="h-7 w-7 text-orange-500" />
          Caducidades médicas / frío
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Control de botiquín de viaje y cadena de frío — {branding.name}. Persistencia por club.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando…</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Alertas activas</p>
              <p className={`text-2xl font-black ${alerts.length ? 'text-red-500' : 'text-emerald-600'}`}>
                {alerts.length}
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              {nextMatch ? (
                <p className="font-semibold">vs {nextMatch.rival}</p>
              ) : (
                <p className="font-semibold">Sin partido</p>
              )}
              <p className="mt-0.5">Stock mínimo + caducidad ≤ 30 días</p>
            </div>
          </div>

          {alerts.length > 0 ? (
            <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20 p-4 space-y-2">
              <p className="text-xs font-extrabold text-red-700 dark:text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Revisar antes del viaje
              </p>
              {alerts.map(({ item, days, low, expired, soon }) => (
                <p key={item.id} className="text-[11px] font-semibold text-red-800 dark:text-red-200">
                  · {item.label}
                  {low ? ` — stock ${item.qty}/${item.minQty}` : ''}
                  {expired ? ' — CADUCADO' : ''}
                  {soon && !expired && days !== null ? ` — caduca en ${days}d` : ''}
                </p>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Sin alertas de stock ni caducidad
            </div>
          )}

          {categories.map((cat) => (
            <section key={cat} className="space-y-2">
              <h3 className="text-sm font-extrabold">{cat}</h3>
              <div className="space-y-2">
                {items
                  .filter((i) => i.category === cat)
                  .map((item) => {
                    const days = daysUntil(item.expiry);
                    const low = item.qty < item.minQty;
                    const expired = days !== null && days < 0;
                    const soon = days !== null && days >= 0 && days <= 30;
                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border bg-white dark:bg-slate-900 p-4 ${
                          low || expired || soon
                            ? 'border-amber-300 dark:border-amber-800'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                              {item.label}
                            </p>
                            {item.coldChain ? (
                              <p className="text-[10px] font-bold uppercase text-sky-600 mt-0.5">
                                Cadena de frío
                              </p>
                            ) : null}
                          </div>
                          <label className="text-[10px] font-bold text-slate-400 shrink-0">
                            Cantidad
                            <input
                              type="number"
                              min={0}
                              value={item.qty}
                              onChange={(e) =>
                                patch(item.id, { qty: Math.max(0, Number(e.target.value) || 0) })
                              }
                              className={`mt-1 w-16 rounded-lg border px-2 py-1 text-sm font-bold text-center block ${
                                low
                                  ? 'border-red-300 text-red-600'
                                  : 'border-slate-200 dark:border-slate-700'
                              } bg-white dark:bg-slate-950`}
                            />
                          </label>
                        </div>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <label className="text-[10px] font-bold text-slate-400">
                            Caducidad
                            <input
                              type="date"
                              value={item.expiry}
                              onChange={(e) => patch(item.id, { expiry: e.target.value })}
                              className={`mt-1 w-full rounded-lg border px-2 py-1.5 text-xs font-semibold ${
                                expired || soon
                                  ? 'border-amber-400'
                                  : 'border-slate-200 dark:border-slate-700'
                              } bg-white dark:bg-slate-950`}
                            />
                          </label>
                          <label className="text-[10px] font-bold text-slate-400">
                            Notas
                            <input
                              value={item.notes}
                              onChange={(e) => patch(item.id, { notes: e.target.value })}
                              placeholder="Lote / ubicación nevera…"
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1.5 text-xs"
                            />
                          </label>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">
                          Mínimo viaje: {item.minQty}
                          {days !== null
                            ? expired
                              ? ' · Caducado'
                              : ` · ${days} días restantes`
                            : ' · Sin fecha'}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </section>
          ))}

          <div className="flex flex-wrap gap-3 text-[11px] font-bold">
            <Link href="/medical" className="text-orange-600 inline-flex items-center gap-1">
              Material médico <ExternalLink className="h-3 w-3" />
            </Link>
            <Link href="/prepartido" className="text-orange-600 inline-flex items-center gap-1">
              Pre-partido <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
