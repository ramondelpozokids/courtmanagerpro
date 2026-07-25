'use client';

import type { OfficialStoreCheckResult } from './OfficialStoreService';

function formatCheckedAt(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', ' ·');
  } catch {
    return iso;
  }
}

export function OfficialStoreStatus({
  result,
  loading,
}: {
  result: OfficialStoreCheckResult | null;
  loading?: boolean;
}) {
  const available = result?.available === true;
  const checkedAt = result?.checkedAt || null;

  return (
    <div className="text-left space-y-1.5 pt-1">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Última comprobación
      </p>
      <p className="text-sm text-slate-200 font-medium">
        {loading && !checkedAt ? 'Comprobando…' : formatCheckedAt(checkedAt)}
      </p>
      {loading && !result ? (
        <p className="text-sm text-slate-400">Comprobando disponibilidad…</p>
      ) : available ? (
        <p className="text-sm font-semibold text-emerald-400">🟢 Tienda disponible</p>
      ) : (
        <p className="text-sm font-semibold text-rose-400">
          🔴 No se ha podido conectar con la tienda oficial
        </p>
      )}
    </div>
  );
}
