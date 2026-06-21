"use client";

import { isReadonlyUser } from "@/lib/permissions";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, QrCode, ClipboardList, Plane, Droplet } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
  const { user } = useAuth();
  const userRole = user?.profile?.role || "equipment_manager";

  const isReadonly = isReadonlyUser(user?.profile?.role);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <ClipboardList className="h-5 w-5 text-orange-500" />
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Acciones Rápidas</h3>
      </div>

      {isReadonly ? (
        <div className="text-center py-6">
          <p className="text-xs text-slate-400">Tu rol actual ({userRole}) tiene permisos de lectura.</p>
          <Link
            href="/requests"
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            Nueva Petición Personal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/players"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-orange-500 hover:bg-orange-50/25 dark:hover:bg-orange-950/10 transition-all text-center group"
          >
            <PlusCircle className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Nuevo Jugador</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Crear ficha técnica</span>
          </Link>

          <Link
            href="/inventory/scanner"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-orange-500 hover:bg-orange-50/25 dark:hover:bg-orange-950/10 transition-all text-center group"
          >
            <QrCode className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Escanear QR</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Cámara del móvil</span>
          </Link>

          <Link
            href="/trips"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-orange-500 hover:bg-orange-50/25 dark:hover:bg-orange-950/10 transition-all text-center group"
          >
            <Plane className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Organizar Viaje</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Preparar equipajes ACB</span>
          </Link>

          <Link
            href="/laundry"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-orange-500 hover:bg-orange-50/25 dark:hover:bg-orange-950/10 transition-all text-center group"
          >
            <Droplet className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Lavado Rápido</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Control de prendas sucias</span>
          </Link>
        </div>
      )}
    </div>
  );
}
