"use client";

import { isReadonlyUser } from "@/lib/permissions";
import { useAuth } from "@/contexts/AuthContext";
import { useClubBranding } from "@/contexts/ClubDemoContext";
import { PlusCircle, QrCode, Plane, Droplet, Zap } from "lucide-react";
import Link from "next/link";

export default function QuickActions({ embedded }: { embedded?: boolean }) {
  const { user, userEmail, isSuperadmin } = useAuth();
  const branding = useClubBranding();
  const userRole = user?.profile?.role || "equipment_manager";
  const isReadonly = !isSuperadmin && isReadonlyUser(user?.profile?.role, userEmail);
  const isFootball = branding.sport === "football";

  const actions = [
    {
      href: "/players",
      icon: PlusCircle,
      title: "Nuevo Jugador",
      subtitle: "Crear ficha técnica",
    },
    {
      href: "/inventory/scanner",
      icon: QrCode,
      title: "Escanear QR",
      subtitle: "Cámara del móvil",
    },
    {
      href: "/trips",
      icon: Plane,
      title: "Organizar Viaje",
      subtitle: isFootball ? "Equipajes LaLiga" : "Equipajes ACB",
    },
    {
      href: "/laundry",
      icon: Droplet,
      title: "Lavado Rápido",
      subtitle: "Prendas sueltas",
    },
  ];

  return (
    <div className={embedded ? "" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm"}>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Zap className="h-4 w-4 text-orange-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Acciones rápidas</h3>
          <p className="text-[10px] text-slate-400">Atajos de utillería</p>
        </div>
      </div>

      {isReadonly ? (
        <div className="text-center py-4">
          <p className="text-xs text-slate-400">
            Tu rol actual ({userRole}) tiene permisos de lectura.
          </p>
          <Link
            href="/requests"
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            Nueva Petición Personal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all group"
              >
                <Icon className="h-5 w-5 text-orange-400 group-hover:scale-110 transition-transform shrink-0 mt-0.5" />
                <div className="text-left min-w-0">
                  <span className="text-xs font-bold text-white block truncate">
                    {a.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{a.subtitle}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
