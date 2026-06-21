"use client";

import { Player } from "@/types";
import { UserCheck, AlertTriangle, Shirt, Landmark, Footprints } from "lucide-react";
import Link from "next/link";

interface PlayerCardProps {
  player: Player;
  onDelete?: (id: string) => void;
  onEdit?: (player: Player) => void;
  canWrite?: boolean;
}

export default function PlayerCard({ player, onDelete, onEdit, canWrite }: PlayerCardProps) {
  const positionLabels: Record<string, string> = {
    base: "Base (PG)",
    escolta: "Escolta (SG)",
    alero: "Alero (SF)",
    ala_pivot: "Ala-Pívot (PF)",
    pivot: "Pívot (C)"
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Card Header Profile banner */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between text-left">
        <div className="flex gap-4">
          {/* Avatar / Photo */}
          <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-100 border border-orange-200 shrink-0 flex items-center justify-center">
            {player.photo_url ? (
              <img src={player.photo_url} alt={player.full_name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-orange-600">{player.full_name[0]}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-none flex items-center gap-1.5">
              <span>{player.full_name}</span>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold text-slate-500">#{player.dorsal}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">{positionLabels[player.position] || player.position}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Nacionalidad: {player.nationality || "N/A"}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${
          player.is_active
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
            : "bg-slate-100 text-slate-500"
        }`}>
          {player.is_active ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Card Body - Sizes */}
      <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-900/40 text-left">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Medidas de Utilería</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Camiseta</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{player.shirt_size || "XL"}</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Pantalón</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{player.shorts_size || "XL"}</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] text-slate-400 block">Calzado</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{player.shoe_size || "—"}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between gap-2">
        <Link
          href={`/players/${player.id}`}
          className="flex-1 text-center py-2 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-orange-600 dark:text-orange-400 text-xs font-bold transition-all"
        >
          Ver Perfil
        </Link>
        {canWrite && onEdit && (
          <button
            onClick={() => onEdit(player)}
            className="px-2.5 py-2 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-xs font-bold transition-all"
            title="Editar jugador"
          >
            Editar
          </button>
        )}
        {canWrite && onDelete && (
          <button
            onClick={() => {
              if (confirm(`¿Eliminar a ${player.full_name} de la plantilla?`)) {
                onDelete(player.id);
              }
            }}
            className="px-2.5 py-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold transition-all"
            title="Eliminar jugador"
          >
            Borrar
          </button>
        )}
      </div>
    </div>
  );
}
