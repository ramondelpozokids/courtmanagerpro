"use client";

import { useState } from "react";
import { X } from "lucide-react";

export type StaffFormData = {
  full_name: string;
  role: string;
  nationality: string;
  shirt_size: string;
  shorts_size: string;
  shoe_size: number;
};

type StaffFormProps = {
  initialValues?: StaffFormData & { id?: string };
  onSubmit: (data: StaffFormData) => void;
  onClose: () => void;
};

export default function StaffForm({ initialValues, onSubmit, onClose }: StaffFormProps) {
  const [fullName, setFullName] = useState(initialValues?.full_name ?? "");
  const [role, setRole] = useState(initialValues?.role ?? "Entrenador Ayudante");
  const [nationality, setNationality] = useState(initialValues?.nationality ?? "España");
  const [shirtSize, setShirtSize] = useState(initialValues?.shirt_size ?? "L");
  const [shortsSize, setShortsSize] = useState(initialValues?.shorts_size ?? "L");
  const [shoeSize, setShoeSize] = useState(initialValues?.shoe_size ?? 43);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert("Introduce el nombre completo");
      return;
    }
    onSubmit({
      full_name: fullName.trim(),
      role: role.trim(),
      nationality: nationality.trim(),
      shirt_size: shirtSize,
      shorts_size: shortsSize,
      shoe_size: Number(shoeSize) || 43,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg max-w-lg w-full mx-auto space-y-4 text-left"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">
          {initialValues?.id ? "Editar miembro del staff" : "Añadir miembro del staff"}
        </h3>
        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      <input
        type="text"
        required
        placeholder="Nombre completo"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
      />
      <input
        type="text"
        required
        placeholder="Cargo / Rol"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
      />
      <input
        type="text"
        required
        placeholder="Nacionalidad"
        value={nationality}
        onChange={(e) => setNationality(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
      />

      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Chaqueta"
          value={shirtSize}
          onChange={(e) => setShirtSize(e.target.value)}
          className="w-full px-2 py-2 rounded-lg border text-xs text-center font-bold"
        />
        <input
          type="text"
          placeholder="Pantalón"
          value={shortsSize}
          onChange={(e) => setShortsSize(e.target.value)}
          className="w-full px-2 py-2 rounded-lg border text-xs text-center font-bold"
        />
        <input
          type="number"
          placeholder="Calzado"
          value={shoeSize}
          onChange={(e) => setShoeSize(Number(e.target.value))}
          className="w-full px-2 py-2 rounded-lg border text-xs text-center font-bold"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-xs font-bold text-slate-500">
          Cancelar
        </button>
        <button type="submit" className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold">
          {initialValues?.id ? "Guardar cambios" : "Añadir staff"}
        </button>
      </div>
    </form>
  );
}
