'use client';

import { useState } from 'react';
import { FileText, Paperclip, PlusCircle, Trash2 } from 'lucide-react';
import type { EquipmentAttachment, EquipmentReport } from '../types';

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function ReportsPanel({
  reports,
  canEdit,
  authorName,
  onCreate,
  onDelete,
}: {
  reports: EquipmentReport[];
  canEdit: boolean;
  authorName?: string;
  onCreate: (body: {
    title: string;
    content: string;
    attachments?: EquipmentAttachment[];
    author_name?: string;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-4">
      {canEdit && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
        >
          <PlusCircle className="h-4 w-4" />
          Nuevo informe
        </button>
      )}

      <div className="space-y-3">
        {reports.length === 0 && (
          <p className="text-xs text-slate-500 py-8 text-center">No hay informes todavía.</p>
        )}
        {reports.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{r.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {r.author_name} · {formatWhen(r.created_at)}
                  </p>
                </div>
              </div>
              {canEdit && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm('¿Eliminar informe?')) return;
                    await onDelete(r.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {r.content && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{r.content}</p>
            )}
            {r.attachments?.length > 0 && (
              <ul className="mt-3 space-y-1">
                {r.attachments.map((a, i) => (
                  <li key={`${a.name}-${i}`}>
                    <a
                      href={a.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:underline"
                    >
                      <Paperclip className="h-3 w-3" />
                      {a.name}
                      {a.mime ? ` (${a.mime})` : ''}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!title.trim()) return;
              setBusy(true);
              try {
                const attachments: EquipmentAttachment[] = [];
                if (fileName.trim()) {
                  attachments.push({
                    name: fileName.trim(),
                    url: fileUrl.trim() || '#',
                    mime: 'application/octet-stream',
                  });
                }
                await onCreate({
                  title: title.trim(),
                  content: content.trim(),
                  attachments,
                  author_name: authorName,
                });
                setOpen(false);
                setTitle('');
                setContent('');
                setFileName('');
                setFileUrl('');
              } finally {
                setBusy(false);
              }
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg max-w-md w-full space-y-3 text-left"
          >
            <h3 className="font-bold text-base">Nuevo informe</h3>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Contenido del informe..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
            />
            <div className="grid grid-cols-1 gap-2">
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Adjunto (nombre archivo)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
              />
              <input
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="URL del adjunto (opcional)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 text-xs font-bold text-slate-500">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
