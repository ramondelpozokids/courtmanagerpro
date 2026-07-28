'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardCheck,
  RefreshCw,
  CheckCircle2,
  Circle,
  ExternalLink,
  Shirt,
  Bus,
  History,
  Footprints,
  Package,
  Stethoscope,
} from 'lucide-react';
import { useActiveTeamId, useClubBranding } from '@/contexts/ClubDemoContext';
import type { OfficialMatch } from '@/types';

type CheckItem = {
  id: string;
  label: string;
  category: string;
  href?: string;
  done: boolean;
};

const STORAGE_PREFIX = 'cm-postmatch-checklist:';

const TEMPLATE: Omit<CheckItem, 'done'>[] = [
  { id: 'kit_collect', label: 'Recoger equipación de juego (camisetas, pantalones, medias)', category: 'Recogida' },
  { id: 'kit_gk', label: 'Recoger material de porteros', category: 'Recogida' },
  { id: 'kit_warmup', label: 'Recoger warm-up / chándal / chubasqueros', category: 'Recogida' },
  { id: 'balls', label: 'Contar y guardar balones de partido + warm-up', category: 'Recogida' },
  { id: 'caps', label: 'Recoger petos / chalecos / material de activación', category: 'Recogida' },
  { id: 'laundry_bags', label: 'Llenar sacos de ropa sucia y etiquetar', category: 'Lavandería', href: '/laundry' },
  { id: 'laundry_send', label: 'Registrar lote de lavandería post-partido', category: 'Lavandería', href: '/laundry' },
  { id: 'bus_unload', label: 'Descargar autobús utilería y contrastar manifiesto', category: 'Buses', href: '/transporte' },
  { id: 'bus_return', label: 'Confirmar retorno de personal y material en ambos buses', category: 'Buses', href: '/transporte' },
  { id: 'med_kit', label: 'Revisar botiquín usado y reponer caducados / consumidos', category: 'Médico', href: '/medical' },
  { id: 'med_ice', label: 'Vaciar neveras / packs frío y limpiar', category: 'Médico' },
  { id: 'boots_check', label: 'Revisar botas personales en utilería vs. con jugador', category: 'Botas', href: '/botas' },
  { id: 'incident_log', label: 'Anotar roturas, pérdidas o extras en incidencias', category: 'Incidencias', href: '/incidencias' },
  { id: 'stock_return', label: 'Devolver material sobrante al almacén', category: 'Almacén', href: '/almacen' },
  { id: 'stock_count', label: 'Actualizar stock crítico si hubo consumo', category: 'Almacén', href: '/inventory' },
];

export default function PostpartidoPage() {
  const teamId = useActiveTeamId();
  const branding = useClubBranding();
  const [nextMatch, setNextMatch] = useState<OfficialMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CheckItem[]>([]);

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
      let saved: Record<string, boolean> = {};
      try {
        const raw = localStorage.getItem(key);
        if (raw) saved = JSON.parse(raw);
      } catch {
        /* ignore */
      }

      setItems(
        TEMPLATE.map((t) => ({
          ...t,
          done: Boolean(saved[t.id]),
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
    (next: CheckItem[]) => {
      setItems(next);
      const map: Record<string, boolean> = {};
      next.forEach((i) => {
        map[i.id] = i.done;
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(map));
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  const toggle = (id: string) => {
    persist(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  const markCategory = (category: string, done: boolean) => {
    persist(items.map((i) => (i.category === category ? { ...i, done } : i)));
  };

  const categories = useMemo(() => {
    const order: string[] = [];
    for (const i of items) {
      if (!order.includes(i.category)) order.push(i.category);
    }
    return order;
  }, [items]);

  const doneCount = items.filter((i) => i.done).length;
  const progress = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  const categoryIcon = (cat: string) => {
    switch (cat) {
      case 'Lavandería':
        return <Shirt className="h-4 w-4 text-orange-500" />;
      case 'Buses':
        return <Bus className="h-4 w-4 text-orange-500" />;
      case 'Incidencias':
        return <History className="h-4 w-4 text-orange-500" />;
      case 'Botas':
        return <Footprints className="h-4 w-4 text-orange-500" />;
      case 'Almacén':
        return <Package className="h-4 w-4 text-orange-500" />;
      case 'Médico':
        return <Stethoscope className="h-4 w-4 text-orange-500" />;
      default:
        return <ClipboardCheck className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">
            Operativa utillería · {branding.shortName}
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-7 w-7 text-orange-500" />
            Checklist post-partido
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Recogida, lavandería, buses e incidencias — cierre de operativa.
          </p>
        </div>
        <Link
          href="/prepartido"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:underline"
        >
          Pre-partido <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando…</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            {nextMatch ? (
              <>
                <p className="text-[10px] font-bold uppercase text-slate-400">Encuentro de referencia</p>
                <h3 className="text-lg font-black mt-0.5">vs {nextMatch.rival}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {[nextMatch.competition, nextMatch.match_date].filter(Boolean).join(' · ')}
                </p>
              </>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase text-slate-400">Sin partido en calendario</p>
                <h3 className="text-lg font-black mt-0.5">Cierre operativo general</h3>
              </>
            )}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-500">
                  {doneCount}/{items.length} completados
                </span>
                <span className="text-orange-600">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px]">
            <Link href="/laundry" className="font-bold text-orange-600 hover:underline">
              Lavandería
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/transporte" className="font-bold text-orange-600 hover:underline">
              Transporte
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/movimientos" className="font-bold text-orange-600 hover:underline">
              Movimientos
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/botas" className="font-bold text-orange-600 hover:underline">
              Botas
            </Link>
          </div>

          {categories.map((cat) => {
            const catItems = items.filter((i) => i.category === cat);
            const catDone = catItems.filter((i) => i.done).length;
            const allDone = catItems.length > 0 && catDone === catItems.length;
            return (
              <div
                key={cat}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {categoryIcon(cat)}
                    <div>
                      <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{cat}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {catDone}/{catItems.length}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => markCategory(cat, !allDone)}
                    className="text-[10px] font-bold text-orange-600 hover:underline shrink-0"
                  >
                    {allDone ? 'Desmarcar' : 'Marcar todo'}
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 px-4 py-3 ${
                        item.done ? 'bg-emerald-50/40 dark:bg-emerald-950/10' : ''
                      }`}
                    >
                      <button type="button" onClick={() => toggle(item.id)} className="shrink-0">
                        {item.done ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-300" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        className={`flex-1 text-left text-xs font-semibold ${
                          item.done
                            ? 'text-slate-500 line-through'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="text-slate-400 hover:text-orange-600 shrink-0"
                          title="Abrir módulo"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
