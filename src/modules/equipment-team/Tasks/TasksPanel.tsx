'use client';

import { useState } from 'react';
import { CheckCircle2, PlusCircle, Trash2 } from 'lucide-react';
import type {
  EquipmentTask,
  EquipmentTaskPriority,
  EquipmentTaskStatus,
  EquipmentTeamMember,
} from '../types';
import { memberFullName } from '../types';

const PRIORITIES: EquipmentTaskPriority[] = ['baja', 'normal', 'alta', 'urgente'];
const STATUSES: EquipmentTaskStatus[] = ['pendiente', 'en_curso', 'finalizada'];

const priorityClass: Record<EquipmentTaskPriority, string> = {
  baja: 'bg-slate-700 text-slate-200',
  normal: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
  alta: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  urgente: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

export function TasksPanel({
  tasks,
  members,
  canEdit,
  onCreate,
  onUpdate,
  onDelete,
}: {
  tasks: EquipmentTask[];
  members: EquipmentTeamMember[];
  canEdit: boolean;
  onCreate: (body: Partial<EquipmentTask>) => Promise<void>;
  onUpdate: (body: Partial<EquipmentTask> & { id: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<EquipmentTaskPriority>('normal');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
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
          Nueva tarea
        </button>
      )}

      <div className="space-y-3">
        {tasks.length === 0 && (
          <p className="text-xs text-slate-500 py-8 text-center">No hay tareas registradas.</p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{task.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${priorityClass[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                {task.description && (
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{task.description}</p>
                )}
                <p className="mt-2 text-[11px] text-slate-400">
                  {task.assignee_name ? `Asignada a ${task.assignee_name}` : 'Sin asignar'}
                  {task.due_date ? ` · Vence ${task.due_date}` : ''}
                </p>
              </div>
              {canEdit && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm('¿Eliminar tarea?')) return;
                    await onDelete(task.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {canEdit && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  value={task.status}
                  onChange={(e) =>
                    void onUpdate({ id: task.id, status: e.target.value as EquipmentTaskStatus })
                  }
                  className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {task.status !== 'finalizada' && (
                  <button
                    type="button"
                    onClick={() => void onUpdate({ id: task.id, status: 'finalizada' })}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Marcar finalizada
                  </button>
                )}
              </div>
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
                const assignee = members.find((m) => m.id === assigneeId);
                await onCreate({
                  title: title.trim(),
                  description: description.trim(),
                  priority,
                  status: 'pendiente',
                  assignee_id: assignee?.id || null,
                  assignee_name: assignee ? memberFullName(assignee) : null,
                  due_date: dueDate || null,
                });
                setOpen(false);
                setTitle('');
                setDescription('');
                setPriority('normal');
                setAssigneeId('');
                setDueDate('');
              } finally {
                setBusy(false);
              }
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg max-w-md w-full space-y-3 text-left"
          >
            <h3 className="font-bold text-base">Nueva tarea</h3>
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
            <div className="grid grid-cols-2 gap-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as EquipmentTaskPriority)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
              />
            </div>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
            >
              <option value="">Sin asignar</option>
              {members.filter((m) => m.is_active).map((m) => (
                <option key={m.id} value={m.id}>
                  {memberFullName(m)}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 text-xs font-bold text-slate-500">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold disabled:opacity-50"
              >
                Crear
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
