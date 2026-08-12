'use client';

import { useRef, useState } from 'react';
import { FileUp, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveTeamId } from '@/contexts/ClubDemoContext';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import type { RmbImportResult } from '@/application/rmb-import/processUpload';

export function RmbAutoImportModule() {
  const { hasOperationalAccess } = useAuth();
  const teamId = useActiveTeamId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RmbImportResult | null>(null);

  if (!hasOperationalAccess) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500">
        Acceso restringido — solo Carlos / Superadmin.
      </div>
    );
  }

  if (teamId !== CLUB_TEAM_IDS.rmb) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-6 text-amber-800 dark:text-amber-200 text-sm">
        La importación automática está activa solo para <strong>Real Madrid Baloncesto</strong>.
      </div>
    );
  }

  async function onFile(file: File) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('team_id', teamId);
      const res = await fetch('/api/rmb/import', { method: 'POST', body: form, credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al importar');
      setResult(json.data as RmbImportResult);
      window.dispatchEvent(new CustomEvent('rmb-import-applied', { detail: json.data }));
      if (json.data?.kind === 'inventory_document') {
        window.dispatchEvent(new CustomEvent('inventory-document-applied'));
      }
      if (json.data?.kind === 'sizing_csv') {
        window.dispatchEvent(new CustomEvent('sizing-data-updated'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-6 text-left">
      <div className="rounded-2xl border border-dashed border-orange-300 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/10 p-8 sm:p-12 text-center">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.txt,.tsv,.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,image/*,text/csv,application/pdf"
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
          className="inline-flex flex-col items-center gap-3 rounded-2xl bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white px-10 py-8 shadow-lg transition"
        >
          {loading ? <Loader2 className="h-10 w-10 animate-spin" /> : <FileUp className="h-10 w-10" />}
          <span className="text-xl font-bold tracking-tight">Subir documento RMB</span>
          <span className="text-sm text-orange-100 font-medium">CSV · PDF · JPG · PNG · DOC</span>
        </button>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Se detecta el tipo de archivo y se actualiza automáticamente:{' '}
          <strong>tallas</strong> (CSV), <strong>fotos</strong> (imagen por nombre o dorsal),{' '}
          <strong>inventario</strong> (PDF/Word).
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-4 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold">
            <CheckCircle className="h-5 w-5" />
            {result.message}
          </div>
          <p className="text-xs text-slate-500">
            Archivo: <span className="font-mono">{result.filename}</span> · Tipo: {result.kind}
          </p>
          {result.details && result.details.length > 0 && (
            <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 max-h-48 overflow-y-auto">
              {result.details.map((line) => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
          )}
          {result.missing && result.missing.length > 0 && (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Sin coincidencia: {result.missing.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
