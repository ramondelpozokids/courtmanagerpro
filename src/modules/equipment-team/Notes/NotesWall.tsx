'use client';

import { useState } from 'react';
import { MessageSquarePlus, Trash2 } from 'lucide-react';
import type { EquipmentNote } from '../types';

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function NotesWall({
  notes,
  canEdit,
  authorName,
  onCreate,
  onDelete,
}: {
  notes: EquipmentNote[];
  canEdit: boolean;
  authorName?: string;
  onCreate: (content: string, author_name?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-4">
      {canEdit && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!content.trim()) return;
            setBusy(true);
            try {
              await onCreate(content.trim(), authorName);
              setContent('');
            } finally {
              setBusy(false);
            }
          }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 space-y-3"
        >
          <label className="text-[10px] font-bold uppercase text-slate-400 block">Nueva nota en el muro</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Escribe una nota para el equipo de utillería..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
          />
          <button
            type="submit"
            disabled={busy || !content.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold disabled:opacity-50"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Publicar
          </button>
        </form>
      )}

      <div className="space-y-3">
        {notes.length === 0 && (
          <p className="text-xs text-slate-500 py-8 text-center">Aún no hay notas en el muro.</p>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold text-orange-500">{note.author_name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{formatWhen(note.created_at)}</p>
              </div>
              {canEdit && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm('¿Eliminar esta nota?')) return;
                    await onDelete(note.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
