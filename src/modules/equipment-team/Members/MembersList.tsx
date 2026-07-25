'use client';

import { useState } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import type { EquipmentTeamMember } from '../types';
import { MemberCard } from './MemberCard';
import { MemberForm, type MemberFormValues } from './MemberForm';

export function memberFormToPayload(v: MemberFormValues) {
  return {
    first_name: v.first_name.trim(),
    last_name: v.last_name.trim(),
    role: v.role.trim(),
    phone_mobile: v.phone_mobile.trim() || null,
    phone_landline: v.phone_landline.trim() || null,
    email: v.email.trim() || null,
    whatsapp: v.whatsapp.trim() || null,
    photo_url: v.photo_url.trim() || null,
    joined_at: v.joined_at || null,
    is_active: v.is_active,
    notes: v.notes.trim() || null,
  };
}

export function MembersList({
  members,
  canEdit,
  onCreate,
  onUpdate,
  onDelete,
}: {
  members: EquipmentTeamMember[];
  canEdit: boolean;
  onCreate: (values: MemberFormValues) => Promise<void>;
  onUpdate: (id: string, values: MemberFormValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EquipmentTeamMember | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{members.length} compañeros en el equipo</p>
        {canEdit && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
          >
            <PlusCircle className="h-4 w-4" />
            Añadir compañero
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {members.map((m) => (
          <div key={m.id} className="relative">
            <MemberCard member={m} />
            {canEdit && (
              <div className="absolute top-3 right-3 flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(m);
                    setShowForm(true);
                  }}
                  className="p-1.5 rounded-lg bg-slate-950/50 text-slate-300 hover:text-orange-400"
                  title="Editar"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm('¿Eliminar este compañero?')) return;
                    await onDelete(m.id);
                  }}
                  className="p-1.5 rounded-lg bg-slate-950/50 text-slate-300 hover:text-red-400"
                  title="Eliminar"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <MemberForm
            initial={editing}
            submitting={busy}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onSubmit={async (values) => {
              setBusy(true);
              try {
                if (editing) await onUpdate(editing.id, values);
                else await onCreate(values);
                setShowForm(false);
                setEditing(null);
              } finally {
                setBusy(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
