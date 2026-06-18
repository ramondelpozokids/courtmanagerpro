"use client";

import { Player, PlayerSizes } from "@/domain/entities/Player";
import { useState } from "react";
import { PlusCircle, X } from "lucide-react";

interface PlayerFormProps {
  onSubmit: (playerData: Omit<Player, "id">) => void;
  onClose?: () => void;
  initialValues?: Player;
}

export default function PlayerForm({ onSubmit, onClose, initialValues }: PlayerFormProps) {
  const [firstName, setFirstName] = useState(initialValues?.firstName || "");
  const [lastName, setLastName] = useState(initialValues?.lastName || "");
  const [number, setNumber] = useState<number>(initialValues?.number || 0);
  const [position, setPosition] = useState<"PG" | "SG" | "SF" | "PF" | "C">(initialValues?.position || "PG");
  const [status, setStatus] = useState<"ACTIVE" | "INJURED" | "INACTIVE">(initialValues?.status || "ACTIVE");
  const [nationality, setNationality] = useState(initialValues?.nationality || "");
  
  // Sizing inputs
  const [jersey, setJersey] = useState(initialValues?.sizes?.jersey || "XL");
  const [shorts, setShorts] = useState(initialValues?.sizes?.shorts || "XL");
  const [shoes, setShoes] = useState(initialValues?.sizes?.shoes || "46");
  const [socks, setSocks] = useState(initialValues?.sizes?.socks || "L");
  const [warmupShirt, setWarmupShirt] = useState(initialValues?.sizes?.warmupShirt || "XXL");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      alert("Por favor introduce nombre y apellidos");
      return;
    }
    onSubmit({
      firstName,
      lastName,
      number: Number(number),
      position,
      status,
      nationality,
      sizes: {
        jersey,
        shorts,
        shoes,
        socks,
        warmupShirt
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg max-w-2xl mx-auto space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">
          {initialValues ? "Modificar Ficha de Jugador" : "Crear Nueva Ficha de Jugador"}
        </h3>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Nombre</label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            placeholder="Marcelinho"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Apellidos</label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            placeholder="Huertas"
          />
        </div>

        {/* Number */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Dorsal / Número</label>
          <input
            type="number"
            min="0"
            max="99"
            required
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            placeholder="9"
          />
        </div>

        {/* Position */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Posición de Juego</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-850 dark:text-slate-100"
          >
            <option value="PG">PG — Base (Playmaker)</option>
            <option value="SG">SG — Escolta (Shooting Guard)</option>
            <option value="SF">SF — Alero (Small Forward)</option>
            <option value="PF">PF — Ala-Pívot (Power Forward)</option>
            <option value="C">C — Pívot (Center)</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Estado de Salud / Ficha</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-850 dark:text-slate-100"
          >
            <option value="ACTIVE">ACTIVO — Disponible para Jugar</option>
            <option value="INJURED">LESIONADO — En tratamiento médico</option>
            <option value="INACTIVE">INACTIVO — Descanso o baja temporal</option>
          </select>
        </div>

        {/* Nationality */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Nacionalidad</label>
          <input
            type="text"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            placeholder="España"
          />
        </div>
      </div>

      {/* Sizes Section */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl space-y-4">
        <h4 className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Tallas y Calzado</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Jersey</label>
            <input
              type="text"
              value={jersey}
              onChange={(e) => setJersey(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-center font-bold text-slate-800 dark:text-slate-100"
              placeholder="XL"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Shorts</label>
            <input
              type="text"
              value={shorts}
              onChange={(e) => setShorts(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-center font-bold text-slate-800 dark:text-slate-100"
              placeholder="XL"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Zapatillas (EU)</label>
            <input
              type="text"
              value={shoes}
              onChange={(e) => setShoes(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-center font-bold text-slate-800 dark:text-slate-100"
              placeholder="47"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Medias</label>
            <input
              type="text"
              value={socks}
              onChange={(e) => setSocks(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-center font-bold text-slate-800 dark:text-slate-100"
              placeholder="L"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Chándal</label>
            <input
              type="text"
              value={warmupShirt}
              onChange={(e) => setWarmupShirt(e.target.value)}
              className="w-full px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-center font-bold text-slate-800 dark:text-slate-100"
              placeholder="XXL"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/10"
        >
          {initialValues ? "Guardar Cambios" : "Crear Ficha Técnica"}
        </button>
      </div>
    </form>
  );
}
