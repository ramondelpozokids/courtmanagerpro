'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Warehouse,
  Search,
  RefreshCw,
  AlertTriangle,
  Package,
  Layers,
  ArrowRight,
  MapPin,
  Download,
  Euro,
} from 'lucide-react';
import { downloadCsv } from '@/lib/csv-export';

type WarehouseItem = {
  id: string;
  name: string;
  sku: string | null;
  category: string | null;
  size: string | null;
  stock: number;
  stock_min: number;
  unit_cost: number;
  value: number;
  location: string;
  low_stock: boolean;
  section_id: string;
  section_label: string;
  sport: 'basketball' | 'football';
  team_category: 'primer_equipo' | 'inferiores';
  team_short: string;
};

type SectionStat = {
  id: string;
  label: string;
  shortLabel: string;
  sport: string;
  category: string;
  ready: boolean;
  count: number;
  units: number;
  value: number;
};

type LocStat = { location: string; units: number; refs: number; value: number };

function eur(n: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

export default function AlmacenGeneralPage() {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [stats, setStats] = useState<{
    total_refs: number;
    total_units: number;
    total_value: number;
    low_stock: number;
    by_section: SectionStat[];
    by_location: LocStat[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sport, setSport] = useState<'all' | 'basketball' | 'football'>('all');
  const [category, setCategory] = useState<'all' | 'primer_equipo' | 'inferiores'>('all');
  const [onlyLow, setOnlyLow] = useState(false);
  const [q, setQ] = useState('');
  const [view, setView] = useState<'secciones' | 'ubicaciones'>('secciones');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (sport !== 'all') params.set('sport', sport);
      if (category !== 'all') params.set('category', category);
      if (onlyLow) params.set('low_stock', '1');
      if (q.trim()) params.set('q', q.trim());
      const res = await fetch(`/api/warehouse?${params}`, { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al cargar almacén');
      setItems(json.data?.items || []);
      setStats(json.data?.stats || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [sport, category, onlyLow, q]);

  useEffect(() => {
    const t = setTimeout(() => void load(), q ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  const grouped = useMemo(() => {
    const map = new Map<string, WarehouseItem[]>();
    for (const item of items) {
      const key = view === 'ubicaciones' ? item.location : item.section_label;
      const list = map.get(key) || [];
      list.push(item);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [items, view]);

  const exportCsv = () => {
    const lines = [
      'Sección;Deporte;Producto;SKU;Talla;Stock;Mínimo;Coste unit.;Valor;Ubicación',
      ...items.map((i) =>
        [
          i.section_label,
          i.sport === 'football' ? 'Fútbol' : 'Baloncesto',
          i.name,
          i.sku || '',
          i.size || '',
          i.stock,
          i.stock_min,
          i.unit_cost,
          i.value,
          i.location,
        ]
          .map((c) => `"${String(c).replace(/"/g, '""')}"`)
          .join(';')
      ),
    ];
    downloadCsv(`almacen_general_rm_${new Date().toISOString().slice(0, 10)}.csv`, lines);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">
            Visión club · Real Madrid
          </p>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Warehouse className="h-7 w-7 text-orange-500" />
            Almacén general
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Stock y valor unificado RMB + RMF. Mapa por ubicación y export para dirección.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/movimientos" className="text-xs font-bold text-slate-600 hover:text-orange-600">
            Historial movimientos
          </Link>
          <Link
            href="/inventory"
            className="text-xs font-bold text-orange-600 hover:underline inline-flex items-center gap-1"
          >
            Inventario del club <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!items.length}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Referencias', value: stats?.total_refs ?? '—', icon: Layers },
          { label: 'Unidades', value: stats?.total_units ?? '—', icon: Package },
          {
            label: 'Valor stock',
            value: stats ? eur(stats.total_value) : '—',
            icon: Euro,
          },
          {
            label: 'Bajo mínimo',
            value: stats?.low_stock ?? '—',
            icon: AlertTriangle,
            warn: (stats?.low_stock || 0) > 0,
          },
          {
            label: 'Ubicaciones',
            value: stats?.by_location?.length ?? '—',
            icon: MapPin,
          },
        ].map(({ label, value, icon: Icon, warn }) => (
          <div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <Icon className={`h-4 w-4 mb-1 ${warn ? 'text-amber-500' : 'text-orange-500'}`} />
            <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
            <p className={`text-lg font-black ${warn ? 'text-amber-600' : 'text-slate-800 dark:text-white'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Mapa ubicaciones compacto */}
      {(stats?.by_location?.length || 0) > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-orange-500" /> Mapa de ubicaciones
            </h3>
            <button
              type="button"
              onClick={() => setView(view === 'ubicaciones' ? 'secciones' : 'ubicaciones')}
              className="text-[11px] font-bold text-orange-600"
            >
              Ver por {view === 'ubicaciones' ? 'sección' : 'ubicación'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {stats!.by_location.slice(0, 9).map((loc) => (
              <button
                key={loc.location}
                type="button"
                onClick={() => {
                  setView('ubicaciones');
                  setQ(loc.location);
                }}
                className="text-left rounded-lg border border-slate-100 dark:border-slate-800 px-3 py-2 hover:border-orange-300"
              >
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{loc.location}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {loc.refs} refs · {loc.units} uds · {eur(loc.value)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(stats?.by_section || []).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSport(s.sport as 'basketball' | 'football');
              setCategory(s.category as 'primer_equipo' | 'inferiores');
            }}
            className={`text-left rounded-xl border p-3 transition-all ${
              s.ready
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-orange-300'
                : 'bg-slate-50 dark:bg-slate-950 border-dashed border-slate-300 opacity-80'
            }`}
          >
            <p className="text-[10px] font-bold uppercase text-slate-400">{s.shortLabel}</p>
            <p className="text-xs font-bold mt-0.5 leading-snug">{s.label}</p>
            {s.ready ? (
              <p className="text-[11px] text-slate-500 mt-2">
                {s.count} refs · {s.units} uds · {eur(s.value || 0)}
              </p>
            ) : (
              <p className="text-[11px] text-amber-600 font-semibold mt-2">Próximamente</p>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar producto, SKU o ubicación…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ['all', 'Todos'],
              ['basketball', 'Baloncesto'],
              ['football', 'Fútbol'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSport(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                sport === id ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
          <input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} />
          Solo bajo mínimo
        </label>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold px-3 py-2">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando almacén general…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border py-16 text-center text-slate-400">
          <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-bold text-slate-600">Sin referencias con este filtro</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([groupLabel, sectionItems]) => (
            <div key={groupLabel} className="bg-white dark:bg-slate-900 border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold">{groupLabel}</h3>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {sectionItems.length} refs · {sectionItems.reduce((a, i) => a + i.stock, 0)} uds ·{' '}
                  {eur(sectionItems.reduce((a, i) => a + i.value, 0))}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/50 text-[10px] uppercase text-slate-400 font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Producto</th>
                      <th className="px-4 py-2.5">SKU</th>
                      <th className="px-4 py-2.5">Talla</th>
                      <th className="px-4 py-2.5">Stock</th>
                      <th className="px-4 py-2.5">Valor</th>
                      <th className="px-4 py-2.5">Ubicación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sectionItems.map((item) => (
                      <tr key={`${item.section_id}-${item.id}`}>
                        <td className="px-4 py-2.5 font-semibold">{item.name}</td>
                        <td className="px-4 py-2.5 font-mono">{item.sku || '—'}</td>
                        <td className="px-4 py-2.5">{item.size || '—'}</td>
                        <td className={`px-4 py-2.5 font-extrabold ${item.low_stock ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {item.stock}
                        </td>
                        <td className="px-4 py-2.5 font-semibold">{eur(item.value)}</td>
                        <td className="px-4 py-2.5 text-slate-600">{item.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
