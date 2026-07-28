'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  History,
  RefreshCw,
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  Trash2,
  PlusCircle,
  FileText,
  X,
} from 'lucide-react';
import { useActiveTeamId, useClubBranding } from '@/contexts/ClubDemoContext';
import { useAuth } from '@/contexts/AuthContext';
import { canWriteClubData } from '@/lib/permissions';
import { useInventory } from '@/hooks/useInventory';
import { exportMovementsPdf, seasonLabelForClub } from '@/lib/pdf-export';
import type { ClubSlug } from '@/data/clubs/types';

type Movement = {
  id: string;
  team_id: string;
  item_id?: string | null;
  item_name: string;
  qty_delta: number;
  stock_after?: number | null;
  reason: string;
  actor_name?: string | null;
  notes?: string | null;
  created_at: string;
};

const REASON_LABELS: Record<string, string> = {
  ajuste: 'Ajuste manual',
  asignacion_jugador: 'Asignación a jugador',
  solicitud_aprobada: 'Solicitud aprobada',
  entrada_almacen: 'Entrada almacén',
  salida_material: 'Salida de material',
  lavanderia: 'Lavandería',
  viaje: 'Viaje / packing',
};

const REASON_OPTIONS = [
  { value: 'entrada_almacen', label: 'Entrada almacén' },
  { value: 'salida_material', label: 'Salida de material' },
  { value: 'asignacion_jugador', label: 'Asignación a jugador' },
  { value: 'solicitud_aprobada', label: 'Solicitud aprobada' },
  { value: 'viaje', label: 'Viaje / packing' },
  { value: 'lavanderia', label: 'Lavandería' },
  { value: 'ajuste', label: 'Ajuste manual' },
];

export default function MovimientosPage() {
  const teamId = useActiveTeamId();
  const branding = useClubBranding();
  const { user, userEmail, isSuperadmin } = useAuth();
  const canWrite = isSuperadmin || canWriteClubData(user?.profile?.role, userEmail);
  const { items: inventory } = useInventory(teamId, {}, { page: 1, pageSize: 200 });

  const [rows, setRows] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<'active' | 'all_rm'>('active');
  const [warning, setWarning] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  const defaultActor = user?.profile?.full_name || userEmail || 'Utilería';
  const [direction, setDirection] = useState<'entrada' | 'salida'>('salida');
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [actorName, setActorName] = useState(defaultActor);
  const [reason, setReason] = useState('salida_material');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setActorName(defaultActor);
  }, [defaultActor]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/stock-movements?scope=${scope}&team_id=${encodeURIComponent(teamId)}&limit=200`,
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

  const openForm = (dir: 'entrada' | 'salida' = 'salida') => {
    setDirection(dir);
    setReason(dir === 'entrada' ? 'entrada_almacen' : 'salida_material');
    setItemId('');
    setItemName('');
    setQuantity(1);
    setActorName(defaultActor);
    setNotes('');
    setShowForm(true);
  };

  const onPickItem = (id: string) => {
    setItemId(id);
    const hit = inventory.data.find((i) => i.id === id);
    if (hit) setItemName(hit.name);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = itemName.trim();
    if (!name) {
      alert('Indica el artículo');
      return;
    }
    if (!actorName.trim()) {
      alert('Indica quién saca o entra el material');
      return;
    }
    if (!quantity || quantity < 1) {
      alert('Cantidad mínima: 1');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/stock-movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          team_id: teamId,
          direction,
          quantity,
          item_id: itemId || null,
          item_name: name,
          actor_name: actorName.trim(),
          reason,
          notes: notes.trim() || null,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'No se pudo registrar el movimiento');
      setShowForm(false);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

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

  const handlePdf = async () => {
    if (!rows.length) {
      alert('No hay movimientos para imprimir');
      return;
    }
    setPdfBusy(true);
    try {
      await exportMovementsPdf(branding.slug as ClubSlug, rows, {
        season: seasonLabelForClub(branding.slug as ClubSlug),
        responsible: defaultActor,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al generar PDF');
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <Link
            href="/almacen"
            className="text-xs font-bold text-slate-500 inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Almacén general
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <History className="h-7 w-7 text-orange-500" />
            Historial de movimientos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registra quién sacó o entró material — trazabilidad e informe PDF.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void handlePdf()}
            disabled={pdfBusy || rows.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold disabled:opacity-50"
          >
            <FileText className={`h-3.5 w-3.5 ${pdfBusy ? 'animate-pulse' : ''}`} />
            {pdfBusy ? 'Generando…' : 'PDF historial'}
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          {canWrite && (
            <button
              type="button"
              onClick={() => openForm('salida')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Nuevo movimiento
            </button>
          )}
        </div>
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

      {showForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg max-w-md w-full space-y-4 text-left"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                Registrar movimiento
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                Tipo
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDirection('salida');
                    setReason('salida_material');
                  }}
                  className={`px-3 py-2.5 rounded-lg border text-xs font-bold ${
                    direction === 'salida'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Salida (−)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDirection('entrada');
                    setReason('entrada_almacen');
                  }}
                  className={`px-3 py-2.5 rounded-lg border text-xs font-bold ${
                    direction === 'entrada'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Entrada (+)
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Artículo del inventario (opcional)
              </label>
              <select
                value={itemId}
                onChange={(e) => onPickItem(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
              >
                <option value="">— Libre / sin vincular stock —</option>
                {inventory.data.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} (stock {i.stock_available})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Si eliges un artículo, se actualiza el stock del inventario.
              </p>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Nombre del material
              </label>
              <input
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Ej. Camiseta 1ª equipación L"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Motivo
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
                >
                  {REASON_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Quién saca / entra el material
              </label>
              <input
                required
                value={actorName}
                onChange={(e) => setActorName(e.target.value)}
                placeholder="Nombre del utillero o responsable"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Notas (opcional)
              </label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Destino, dorsal, partido…"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-2 border rounded-lg text-slate-500"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border py-16 text-center text-slate-400">
          <History className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-bold text-slate-600">Sin movimientos en este club</p>
          <p className="text-xs mt-1">
            Pulsa «Nuevo movimiento» para registrar una entrada o salida con el responsable.
          </p>
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
                  {m.actor_name ? (
                    <>
                      {' '}
                      · <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {m.actor_name}
                      </span>
                    </>
                  ) : (
                    <span className="text-amber-600"> · Sin responsable</span>
                  )}
                </p>
                {m.notes ? (
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.notes}</p>
                ) : null}
                <p suppressHydrationWarning className="text-[10px] text-slate-400 mt-0.5">
                  {new Date(m.created_at).toLocaleString('es-ES')}
                </p>
              </div>
              <div className="text-right shrink-0 flex items-start gap-2">
                <div>
                  <p
                    className={`text-sm font-black ${
                      m.qty_delta < 0 ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {m.qty_delta > 0 ? '+' : ''}
                    {m.qty_delta}
                  </p>
                  {m.stock_after != null && (
                    <p className="text-[10px] text-slate-400">Stock {m.stock_after}</p>
                  )}
                </div>
                {canWrite && (
                  <button
                    type="button"
                    title="Eliminar del historial"
                    onClick={() => void removeEntry(m.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
