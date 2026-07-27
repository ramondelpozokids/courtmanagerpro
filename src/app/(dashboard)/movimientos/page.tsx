'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useActiveTeamId } from '@/contexts/ClubDemoContext';
import { History, RefreshCw, ArrowLeft, ArrowDownRight, ArrowUpRight, Trash2 } from 'lucide-react';

type Movement = {
  id: string;
  team_id: string;
  item_name: string;
  qty_delta: number;
  stock_after?: number | null;
  reason: string;
  actor_name?: string | null;
  created_at: string;
};

const REASON_LABELS: Record<string, string> = {
  ajuste: 'Ajuste manual',
  asignacion_jugador: 'Asignación a jugador',
  solicitud_aprobada: 'Solicitud aprobada',
  entrada_almacen: 'Entrada almacén',
  lavanderia: 'Lavandería',
  viaje: 'Viaje / packing',
};

export default function MovimientosPage() {
  const teamId = useActiveTeamId();
  const [rows, setRows] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<'active' | 'all_rm'>('active');
  const [warning, setWarning] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/stock-movements?scope=${scope}&team_id=${encodeURIComponent(teamId)}`,
        { credentials: 'include' }
      );
      const json = await res.json();
      setRows(json.data || []);
      setWarning(json.warning || null);
    } finally {
      setLoading(false);
    }
  }, [scope, teamId]);

  useEffect(() => {
    void load();
  }, [load]);

  const removeEntry = async (id: string) => {
    if (!confirm('¿Eliminar esta entrada del historial? No revierte el stock.')) return;
    try {
      const res = await fetch(
        `/api/stock-movements?id=${encodeURIComponent(id)}&team_id=${encodeURIComponent(teamId)}`,
        { method: 'DELETE', credentials: 'include' }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'No se pudo eliminar');
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/almacen" className="text-xs font-bold text-slate-500 inline-flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Almacén general
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <History className="h-7 w-7 text-orange-500" />
            Historial de movimientos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quién sacó o entró material — trazabilidad para utilería del club activo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => setScope('all_rm')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            scope === 'all_rm' ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
          }`}
        >
          Todos los clubs
        </button>
        <button
          type="button"
          onClick={() => setScope('active')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            scope === 'active' ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
          }`}
        >
          Solo club activo
        </button>
      </div>

      {warning && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 font-semibold">
          {warning}
        </p>
      )}

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border py-16 text-center text-slate-400">
          <History className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-bold text-slate-600">Sin movimientos en este club</p>
          <p className="text-xs mt-1">Los ajustes de stock y solicitudes aparecerán aquí.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((m) => (
            <div key={m.id} className="px-4 py-3 flex items-start gap-3">
              <div
                className={`mt-0.5 p-1.5 rounded-lg ${
                  m.qty_delta < 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {m.qty_delta < 0 ? (
                  <ArrowDownRight className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{m.item_name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {REASON_LABELS[m.reason] || m.reason}
                  {m.actor_name ? ` · ${m.actor_name}` : ''}
                </p>
                <p suppressHydrationWarning className="text-[10px] text-slate-400 mt-0.5">
                  {new Date(m.created_at).toLocaleString('es-ES')}
                </p>
              </div>
              <div className="text-right shrink-0 flex items-start gap-2">
                <div>
                  <p className={`text-sm font-black ${m.qty_delta < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {m.qty_delta > 0 ? '+' : ''}
                    {m.qty_delta}
                  </p>
                  {m.stock_after != null && (
                    <p className="text-[10px] text-slate-400">Stock {m.stock_after}</p>
                  )}
                </div>
                <button
                  type="button"
                  title="Eliminar del historial"
                  onClick={() => void removeEntry(m.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
