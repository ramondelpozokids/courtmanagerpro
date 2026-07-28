'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  RefreshCw,
  CheckCircle2,
  Circle,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { useActiveTeamId, useClubBranding } from '@/contexts/ClubDemoContext';
import type { OfficialMatch } from '@/types';

type CheckItem = {
  id: string;
  label: string;
  category: string;
  done: boolean;
};

const STORAGE_PREFIX = 'cm-hotel-vestuario:';

const TEMPLATE: Omit<CheckItem, 'done'>[] = [
  { id: 'hotel_keys', label: 'Llaves / tarjetas habitaciones plantilla + staff', category: 'Hotel' },
  { id: 'hotel_bags', label: 'Entrega maletas habitación / control etiquetas', category: 'Hotel' },
  { id: 'hotel_rep', label: 'Colocar trajes / chándal de representación', category: 'Hotel' },
  { id: 'hotel_water', label: 'Agua / snacks planta utilería (si aplica)', category: 'Hotel' },
  { id: 'hotel_wifi', label: 'WiFi box / router viaje operativo', category: 'Hotel' },
  { id: 'dress_hangers', label: 'Perchas y fundas en vestuario visitante', category: 'Vestuario' },
  { id: 'dress_towels', label: 'Toallas plantilla + staff técnico', category: 'Vestuario' },
  { id: 'dress_kit', label: 'Colgar equipación de juego por dorsal', category: 'Vestuario' },
  { id: 'dress_boots', label: 'Zona botas personales ordenada', category: 'Vestuario' },
  { id: 'dress_coolers', label: 'Neveras hidratación en banquillo / vestuario', category: 'Vestuario' },
  { id: 'dress_med', label: 'Espacio fisio / botiquín y camilla', category: 'Vestuario' },
  { id: 'dress_balls', label: 'Balones warm-up listos a pie de campo', category: 'Vestuario' },
  { id: 'dress_pass', label: 'Pases / acreditaciones staff utilería', category: 'Vestuario' },
  { id: 'dress_laundry', label: 'Sacos ropa sucia preparados para post-partido', category: 'Vestuario' },
];

export default function HotelVestuarioPage() {
  const teamId = useActiveTeamId();
  const branding = useClubBranding();
  const [nextMatch, setNextMatch] = useState<OfficialMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CheckItem[]>([]);
  const [notes, setNotes] = useState('');

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
      let saved: { done?: Record<string, boolean>; notes?: string } = {};
      try {
        const raw = localStorage.getItem(key);
        if (raw) saved = JSON.parse(raw);
      } catch {
        /* ignore */
      }

      setNotes(typeof saved.notes === 'string' ? saved.notes : '');
      setItems(
        TEMPLATE.map((t) => ({
          ...t,
          done: Boolean(saved.done?.[t.id]),
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
    (next: CheckItem[], nextNotes: string) => {
      setItems(next);
      setNotes(nextNotes);
      const done: Record<string, boolean> = {};
      next.forEach((i) => {
        done[i.id] = i.done;
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify({ done, notes: nextNotes }));
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  const toggle = (id: string) => {
    const next = items.map((i) => (i.id === id ? { ...i, done: !i.done } : i));
    persist(next, notes);
  };

  const markCategory = (category: string, done: boolean) => {
    const next = items.map((i) => (i.category === category ? { ...i, done } : i));
    persist(next, notes);
  };

  const doneCount = items.filter((i) => i.done).length;
  const progress = items.length ? Math.round((doneCount / items.length) * 100) : 0;

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
          <Building2 className="h-7 w-7 text-orange-500" />
          Hotel / vestuario visitante
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Kit de llegada para desplazamiento de primer equipo — {branding.name}.
        </p>
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
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Próximo encuentro</p>
                  <h3 className="text-lg font-black mt-1">vs {nextMatch.rival}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-orange-500" />
                    {nextMatch.venue || 'Sede por confirmar'}
                    {nextMatch.home_away === 'visitante'
                      ? ' · Visitante'
                      : nextMatch.home_away === 'local'
                        ? ' · Local'
                        : ''}
                  </p>
                </div>
                <Link href="/calendario" className="text-[11px] font-bold text-orange-600 inline-flex items-center gap-1">
                  Calendario <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <p className="text-sm font-bold text-slate-500">Sin partido sincronizado — checklist genérico.</p>
            )}
          </div>

          <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-500">Progreso llegada</p>
              <p className="text-xs font-black text-orange-600">
                {doneCount}/{items.length} · {progress}%
              </p>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {categories.map((cat) => {
            const catItems = items.filter((i) => i.category === cat);
            const catDone = catItems.filter((i) => i.done).length;
            return (
              <section key={cat} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold">{cat}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">
                      {catDone}/{catItems.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => markCategory(cat, true)}
                      className="text-[10px] font-bold text-orange-600 hover:underline"
                    >
                      Marcar todo
                    </button>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                  {catItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggle(item.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {item.done ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          item.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}

          <label className="block text-[11px] font-bold text-slate-500">
            Notas de llegada (habitaciones, contactos, incidencias)
            <textarea
              value={notes}
              onChange={(e) => persist(items, e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
              placeholder="Planta utilería, contacto hotel, vestuario nº…"
            />
          </label>

          <div className="flex flex-wrap gap-3 text-[11px] font-bold">
            <Link href="/transporte" className="text-orange-600 inline-flex items-center gap-1">
              Transporte <ExternalLink className="h-3 w-3" />
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
