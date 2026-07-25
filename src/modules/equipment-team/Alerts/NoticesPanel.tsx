'use client';

import { useState } from 'react';
import { Bell, PlusCircle, Trash2 } from 'lucide-react';
import type { EquipmentNotice, EquipmentNoticeType } from '../types';

const TYPES: EquipmentNoticeType[] = ['urgente', 'importante', 'info'];

const typeClass: Record<EquipmentNoticeType, string> = {
  urgente: 'bg-red-500/15 text-red-400 border-red-500/30',
  importante: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
};

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

export function NoticesPanel({
  notices,
  canEdit,
  authorName,
  onCreate,
  onUpdate,
  onDelete,
}: {
  notices: EquipmentNotice[];
  canEdit: boolean;
  authorName?: string;
  onCreate: (body: Partial<EquipmentNotice>) => Promise<void>;
  onUpdate: (body: Partial<EquipmentNotice> & { id: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [noticeType, setNoticeType] = useState<EquipmentNoticeType>('info');
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
          Nuevo aviso
        </button>
      )}

      <div className="space-y-3">
        {notices.length === 0 && (
          <p className="text-xs text-slate-500 py-8 text-center">No hay avisos activos.</p>
        )}
        {notices.map((n) => (
          <div
            key={n.id}
            className={`rounded-xl border p-4 text-left bg-white dark:bg-slate-900 ${typeClass[n.notice_type]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <Bell className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{n.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase border border-current/30">
                      {n.notice_type}
                    </span>
                    {!n.is_active && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Inactivo</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {n.author_name || 'Sistema'} · {formatWhen(n.created_at)}
                  </p>
                  {n.description && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{n.description}</p>
                  )}
                </div>
              </div>
              {canEdit && (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => void onUpdate({ id: n.id, is_active: !n.is_active })}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-400 hover:text-orange-400"
                  >
                    {n.is_active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm('¿Eliminar aviso?')) return;
                      await onDelete(n.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
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
                await onCreate({
                  title: title.trim(),
                  description: description.trim(),
                  notice_type: noticeType,
                  author_name: authorName,
                  is_active: true,
                });
                setOpen(false);
                setTitle('');
                setDescription('');
                setNoticeType('info');
              } finally {
                setBusy(false);
              }
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg max-w-md w-full space-y-3 text-left"
          >
            <h3 className="font-bold text-base">Nuevo aviso</h3>
            <select
              value={noticeType}
              onChange={(e) => setNoticeType(e.target.value as EquipmentNoticeType)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Descripción"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 text-xs font-bold text-slate-500">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold disabled:opacity-50"
              >
                Publicar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
