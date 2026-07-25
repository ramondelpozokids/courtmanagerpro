'use client';

import { useRef, useState } from 'react';
import { FileUp, Check, X, Loader2 } from 'lucide-react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { useAuth } from '@/contexts/AuthContext';
import type { InventoryDiffPreview } from '@/application/inventory/documentImport/types';

export function UpdateInventoryModule() {
  const { currentTeam } = useAuth();
  const teamId = currentTeam?.id || DEFAULT_TEAM_ID;
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [preview, setPreview] = useState<InventoryDiffPreview | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [doneMsg, setDoneMsg] = useState<string | null>(null);

  async function onFile(file: File) {
    setLoading(true);
    setError(null);
    setWarning(null);
    setDoneMsg(null);
    setPreview(null);
    setPreviewId(null);
    setMessage(null);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('team_id', teamId);
      const res = await fetch('/api/inventory/document/analyze', {
        method: 'POST',
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al analizar');
      setPreviewId(json.data.previewId);
      setPreview(json.data.preview);
      setMessage(json.data.message);
      if (json.data.warning) setWarning(json.data.warning);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function accept() {
    if (!previewId || !preview) return;
    setApplying(true);
    setError(null);
    try {
      const res = await fetch('/api/inventory/document/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ previewId, action: 'accept', preview }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al aplicar');
      setDoneMsg(`Cambios aplicados (${json.data.applied} operaciones). Historial guardado.`);
      setPreview(null);
      setPreviewId(null);
      setMessage(null);
      window.dispatchEvent(new CustomEvent('inventory-document-applied'));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setApplying(false);
    }
  }

  async function cancel() {
    if (previewId) {
      await fetch('/api/inventory/document/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ previewId, action: 'cancel' }),
      }).catch(() => null);
    }
    setPreview(null);
    setPreviewId(null);
    setMessage(null);
    setWarning(null);
  }

  return (
    <div className="space-y-6 text-left">
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-12 text-center">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex flex-col items-center gap-3 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white px-10 py-8 shadow-lg transition"
        >
          {loading ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : (
            <FileUp className="h-10 w-10" />
          )}
          <span className="text-xl font-bold tracking-tight">Subir documento</span>
          <span className="text-sm text-slate-300 font-medium">PDF · DOC · DOCX</span>
        </button>
        <p className="mt-4 text-sm text-slate-500 max-w-md mx-auto">
          La IA analiza el documento (OCR automático si está escaneado), lo compara con el inventario
          y te muestra una vista previa antes de aplicar cambios.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {warning && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
          {warning}
        </div>
      )}
      {doneMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-3 text-sm">
          {doneMsg}
        </div>
      )}

      {preview && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Vista previa</h3>
          {message && <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3">
              <p className="font-bold text-emerald-700 dark:text-emerald-400">
                + {preview.summary.added} artículos nuevos
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
              <p className="font-bold text-amber-700 dark:text-amber-400">
                {preview.summary.modified} artículos modificados
              </p>
            </div>
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 px-4 py-3">
              <p className="font-bold text-rose-700 dark:text-rose-400">
                {preview.summary.removed} artículos eliminados
              </p>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto text-xs space-y-1 border-t border-slate-100 dark:border-slate-800 pt-3">
            {preview.added.slice(0, 40).map((c, i) => (
              <p key={`a-${i}`} className="text-emerald-700">
                + {c.item_name}
                {c.new_qty != null ? ` (${c.new_qty})` : ''}
              </p>
            ))}
            {preview.modified.slice(0, 40).map((c, i) => (
              <p key={`m-${i}`} className="text-amber-700">
                ~ {c.item_name}: {c.old_qty} → {c.new_qty}
              </p>
            ))}
            {preview.removed.slice(0, 40).map((c, i) => (
              <p key={`r-${i}`} className="text-rose-700">
                − {c.item_name}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              disabled={applying}
              onClick={() => void accept()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-5 py-2.5 text-sm font-bold"
            >
              {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Aceptar cambios
            </button>
            <button
              type="button"
              disabled={applying}
              onClick={() => void cancel()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
