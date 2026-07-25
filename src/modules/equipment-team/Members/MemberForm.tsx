'use client';

import { useState } from 'react';
import type { EquipmentTeamMember } from '../types';

export type MemberFormValues = {
  first_name: string;
  last_name: string;
  role: string;
  phone_mobile: string;
  phone_landline: string;
  email: string;
  whatsapp: string;
  photo_url: string;
  joined_at: string;
  is_active: boolean;
  notes: string;
};

const empty: MemberFormValues = {
  first_name: '',
  last_name: '',
  role: 'Utillero',
  phone_mobile: '',
  phone_landline: '',
  email: '',
  whatsapp: '',
  photo_url: '',
  joined_at: new Date().toISOString().slice(0, 10),
  is_active: true,
  notes: '',
};

function fromMember(m?: EquipmentTeamMember | null): MemberFormValues {
  if (!m) return empty;
  return {
    first_name: m.first_name,
    last_name: m.last_name,
    role: m.role,
    phone_mobile: m.phone_mobile || '',
    phone_landline: m.phone_landline || '',
    email: m.email || '',
    whatsapp: m.whatsapp || '',
    photo_url: m.photo_url || '',
    joined_at: m.joined_at || '',
    is_active: m.is_active,
    notes: m.notes || '',
  };
}

export function MemberForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}: {
  initial?: EquipmentTeamMember | null;
  onSubmit: (values: MemberFormValues) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<MemberFormValues>(() => fromMember(initial));

  const set = (key: keyof MemberFormValues, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(values);
      }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg max-w-lg w-full space-y-3 text-left max-h-[90vh] overflow-y-auto"
    >
      <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
        {initial ? 'Editar compañero' : 'Nuevo compañero'}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Nombre" value={values.first_name} onChange={(v) => set('first_name', v)} required />
        <Field label="Apellidos" value={values.last_name} onChange={(v) => set('last_name', v)} required />
      </div>
      <Field label="Cargo" value={values.role} onChange={(v) => set('role', v)} required />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Móvil" value={values.phone_mobile} onChange={(v) => set('phone_mobile', v)} />
        <Field label="Fijo" value={values.phone_landline} onChange={(v) => set('phone_landline', v)} />
      </div>
      <Field label="Email" value={values.email} onChange={(v) => set('email', v)} type="email" />
      <Field label="WhatsApp" value={values.whatsapp} onChange={(v) => set('whatsapp', v)} placeholder="34600111222" />
      <Field label="Foto (URL)" value={values.photo_url} onChange={(v) => set('photo_url', v)} />
      <Field label="Incorporación" value={values.joined_at} onChange={(v) => set('joined_at', v)} type="date" />
      <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <input
          type="checkbox"
          checked={values.is_active}
          onChange={(e) => set('is_active', e.target.checked)}
          className="rounded border-slate-600"
        />
        Activo
      </label>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Observaciones</label>
        <textarea
          value={values.notes}
          onChange={(e) => set('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 text-xs font-bold text-slate-500">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold disabled:opacity-50"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100"
      />
    </div>
  );
}
