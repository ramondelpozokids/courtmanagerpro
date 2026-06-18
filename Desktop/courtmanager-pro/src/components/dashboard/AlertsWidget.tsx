"use client";

import { useAlerts } from "@/hooks/useAlerts";
import { AlertCircle, AlertTriangle, Info, Check, Bell } from "lucide-react";

export default function AlertsWidget() {
  const { alerts, markAsRead, markAllAsRead } = useAlerts();
  const unreadAlerts = alerts.filter((a) => !a.is_read);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          icon: AlertCircle,
          color: "text-red-500 bg-red-50 dark:bg-red-950/20",
          border: "border-red-100 dark:border-red-950/40"
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
          border: "border-amber-100 dark:border-amber-950/40"
        };
      default:
        return {
          icon: Info,
          color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
          border: "border-blue-100 dark:border-blue-950/40"
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-500" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Alertas del Sistema</h3>
        </div>
        {unreadAlerts.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[10px] uppercase font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            Marcar todo leído
          </button>
        )}
      </div>

      {unreadAlerts.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          <Check className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-xs font-semibold">Todo controlado</p>
          <p className="text-[10px] mt-0.5">No hay alertas críticas pendientes.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {unreadAlerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            const Icon = styles.icon;

            return (
              <div
                key={alert.id}
                className={`flex gap-3 p-3 rounded-lg border ${styles.border} hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-xs`}
              >
                <div className={`p-2 rounded-lg ${styles.color} shrink-0 h-9 w-9 flex items-center justify-center`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 leading-snug">{alert.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(alert.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <button
                  onClick={() => markAsRead(alert.id)}
                  className="p-1 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 self-center"
                  title="Marcar como leída"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
