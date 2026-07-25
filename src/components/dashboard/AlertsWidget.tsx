"use client";

import { useAlerts } from "@/hooks/useAlerts";
import { AlertCircle, AlertTriangle, Info, Check, Bell, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AlertsWidget({ compact }: { compact?: boolean }) {
  const { alerts, markAsRead, markAllAsRead } = useAlerts();
  const unreadAlerts = alerts.filter((a) => !a.is_read);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          icon: AlertCircle,
          color: "text-red-500 bg-red-50 dark:bg-red-950/20",
          border: "border-red-100 dark:border-red-950/40",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
          border: "border-amber-100 dark:border-amber-950/40",
        };
      default:
        return {
          icon: Info,
          color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
          border: "border-blue-100 dark:border-blue-950/40",
        };
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Bell className="h-4 w-4 text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Alertas</h3>
            <p className="text-[10px] text-slate-400">
              {unreadAlerts.length > 0
                ? `${unreadAlerts.length} sin leer`
                : "Sistema en verde"}
            </p>
          </div>
        </div>
        {unreadAlerts.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[10px] uppercase font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            Marcar leídas
          </button>
        )}
      </div>

      {unreadAlerts.length === 0 ? (
        <div
          className={`flex-1 rounded-xl bg-gradient-to-br from-emerald-50 to-slate-50 dark:from-emerald-950/30 dark:to-slate-900/50 border border-emerald-100/80 dark:border-emerald-900/40 ${
            compact ? "py-5 px-4" : "py-6 px-5"
          } flex items-center gap-4`}
        >
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              Todo controlado
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Sin alertas críticas. Inventario, viajes y plantilla en seguimiento.
            </p>
            <Link
              href="/alerts"
              className="inline-block mt-2 text-[11px] font-bold text-emerald-600 hover:text-emerald-500"
            >
              Ver historial de alertas →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {unreadAlerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            const Icon = styles.icon;

            return (
              <div
                key={alert.id}
                className={`flex gap-3 p-3 rounded-xl border ${styles.border} hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-xs`}
              >
                <div
                  className={`p-2 rounded-lg ${styles.color} shrink-0 h-9 w-9 flex items-center justify-center`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                    {alert.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(alert.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
