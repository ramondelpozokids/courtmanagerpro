"use client";

import { useRequests } from "@/hooks/useRequests";
import { useLaundry } from "@/hooks/useLaundry";
import { CheckCircle2, ShoppingBag, RefreshCw, ClipboardCheck } from "lucide-react";

export default function ActivityFeed() {
  const { requests } = useRequests();
  const { batches } = useLaundry();

  // Combine actions for a general timeline
  const activities = [
    ...requests.slice(0, 3).map((r) => ({
      id: `act-req-${r.id}`,
      title: `${r.player ? r.player.full_name : "Un jugador"} solicitó material`,
      description: `${r.quantity || 1}x ${r.title} (${r.size || "XL"})`,
      time: r.created_at ? new Date(r.created_at).toLocaleDateString() : "Hoy",
      icon: ShoppingBag,
      color: "bg-orange-500",
      status: r.status
    })),
    ...batches.slice(0, 2).map((b) => ({
      id: `act-lau-${b.id}`,
      title: `Lavandería: ${b.name}`,
      description: `Estado: ${b.status} • Responsable: ${(b as any).responsible || (b as any).created_by}`,
      time: (b as any).created_at ? new Date((b as any).created_at).toLocaleDateString() : (b as any).receivedDate || "Hoy",
      icon: RefreshCw,
      color: "bg-blue-500",
      status: b.status
    }))
  ].sort((a, b) => b.time.localeCompare(a.time));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <ClipboardCheck className="h-5 w-5 text-orange-500" />
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Actividad Reciente</h3>
      </div>

      {activities.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center">No hay actividad reciente en las últimas 24 horas.</p>
      ) : (
        <div className="relative border-l border-slate-150 dark:border-slate-800 ml-3.5 space-y-5 py-2">
          {activities.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="relative pl-6 text-xs text-left">
                {/* Timeline node */}
                <div className={`absolute -left-[11px] top-0.5 h-5 w-5 rounded-full flex items-center justify-center text-white ${act.color} ring-4 ring-white dark:ring-slate-900`}>
                  <Icon className="h-3 w-3" />
                </div>

                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{act.title}</h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{act.time}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{act.description}</p>
                  
                  {act.status && (
                    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                      (act.status as any) === "completada" || (act.status as any) === "limpio" || (act.status as any) === "READY"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                        : (act.status as any) === "pendiente" || (act.status as any) === "sucio" || (act.status as any) === "PENDING"
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                    }`}>
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
