"use client";

import { useRequests } from "@/hooks/useRequests";
import { useLaundry } from "@/hooks/useLaundry";
import { useActiveTeamId } from "@/contexts/ClubDemoContext";
import {
  ShoppingBag,
  RefreshCw,
  ClipboardCheck,
  Package,
  Plane,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function ActivityFeed({ compact }: { compact?: boolean }) {
  const teamId = useActiveTeamId();
  const { requests } = useRequests(teamId);
  const { batches } = useLaundry();

  const activities = [
    ...requests
      .filter((r) => r.status !== "rechazada" && r.status !== "cancelada")
      .slice(0, 4)
      .map((r) => ({
      id: `act-req-${r.id}`,
      title: `${r.player ? r.player.full_name : "Un jugador"} solicitó material`,
      description: `${r.quantity || 1}x ${r.title} (${r.size || "XL"})`,
      time: r.created_at ? new Date(r.created_at).toLocaleDateString("es-ES") : "Hoy",
      icon: ShoppingBag,
      color: "bg-orange-500",
      status: r.status,
    })),
    ...batches.slice(0, 3).map((b) => ({
      id: `act-lau-${b.id}`,
      title: `Lavandería: ${b.name}`,
      description: `Estado: ${b.status} • Responsable: ${
        (b as any).responsible || (b as any).created_by || "—"
      }`,
      time: (b as any).created_at
        ? new Date((b as any).created_at).toLocaleDateString("es-ES")
        : (b as any).receivedDate || "Hoy",
      icon: RefreshCw,
      color: "bg-sky-500",
      status: b.status,
    })),
  ].sort((a, b) => b.time.localeCompare(a.time));

  const placeholders = [
    {
      icon: Package,
      label: "Inventario al día",
      href: "/inventory",
    },
    {
      icon: Plane,
      label: "Preparar viaje",
      href: "/trips",
    },
    {
      icon: ShoppingBag,
      label: "Ver solicitudes",
      href: "/requests",
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
          <ClipboardCheck className="h-4 w-4 text-orange-500" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Actividad reciente
          </h3>
          <p className="text-[10px] text-slate-400">
            {activities.length > 0
              ? `${activities.length} movimientos`
              : "Últimas 24 h"}
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div
          className={`flex-1 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-950/40 ${
            compact ? "p-4" : "p-5"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-orange-400" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Sin movimiento reciente
            </p>
          </div>
          <p className="text-[11px] text-slate-500 mb-4">
            Cuando haya solicitudes o lavados, aparecerán aquí. Mientras tanto:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {placeholders.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  className="rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-2 py-3 text-center hover:border-orange-400/50 hover:shadow-sm transition"
                >
                  <Icon className="h-4 w-4 text-orange-500 mx-auto mb-1.5" />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 leading-tight block">
                    {p.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3.5 space-y-4 py-1 max-h-[240px] overflow-y-auto">
          {activities.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="relative pl-6 text-xs text-left">
                <div
                  className={`absolute -left-[11px] top-0.5 h-5 w-5 rounded-full flex items-center justify-center text-white ${act.color} ring-4 ring-white dark:ring-slate-900`}
                >
                  <Icon className="h-3 w-3" />
                </div>
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">
                      {act.title}
                    </h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {act.description}
                  </p>
                  {act.status && (
                    <span
                      className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                        (act.status as any) === "completada" ||
                        (act.status as any) === "limpio" ||
                        (act.status as any) === "READY"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                          : (act.status as any) === "pendiente" ||
                              (act.status as any) === "sucio" ||
                              (act.status as any) === "PENDING"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                      }`}
                    >
                      {act.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
