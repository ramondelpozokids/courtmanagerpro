"use client";

import { useEffect, useMemo, useState } from "react";
import { scanBirthdayAlerts, getUpcomingBirthdays } from "@/lib/birthday-alerts";
import { useAlerts } from "@/hooks/useAlerts";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveTeamId } from "@/contexts/ClubDemoContext";
import { canManageAlerts, canViewAlerts } from "@/lib/permissions";
import { Bell, Check, Trash2, ShieldAlert, CheckCircle, RefreshCw, ExternalLink, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { sortAlertsByEventDate, type AlertDateSort } from "@/lib/alerts-state";

export default function AlertsPage() {
  const { user, userEmail, hasOperationalAccess } = useAuth();
  const teamId = useActiveTeamId();
  const {
    alerts,
    loading,
    markAsRead,
    dismissAlert,
    dismissMany,
    dismissAll,
    markAllAsRead,
    refresh,
  } = useAlerts(teamId);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [dateOrder, setDateOrder] = useState<AlertDateSort>("asc");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cmAlertsDateOrder");
      if (stored === "asc" || stored === "desc") setDateOrder(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const listed = useMemo(() => sortAlertsByEventDate(alerts, dateOrder), [alerts, dateOrder]);

  const userRole = user?.profile?.role;
  const hasAccess = hasOperationalAccess || canViewAlerts(userRole, userEmail);
  const canEdit = hasOperationalAccess || canManageAlerts(userRole, userEmail);

  useEffect(() => {
    const visible = new Set(alerts.map((a) => a.id));
    setSelected((prev) => {
      const next = new Set([...prev].filter((id) => visible.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [alerts]);

  const allSelected = listed.length > 0 && selected.size === listed.length;
  const readIds = useMemo(() => listed.filter((a) => a.is_read).map((a) => a.id), [listed]);

  if (!hasAccess) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-16 text-center text-slate-400">
        <Bell className="h-12 w-12 mx-auto mb-3 text-slate-300" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Acceso restringido</p>
        <p className="text-xs mt-1 max-w-xs mx-auto">
          El módulo de Centro de Alertas y Notificaciones Críticas solo es accesible para el personal administrativo y médico del club.
        </p>
      </div>
    );
  }

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  function resolveHref(alert: { type?: string; entity_type?: string | null }): string | null {
    const t = String(alert.type || '');
    const e = String(alert.entity_type || '');
    if (t.includes('stock') || e.includes('inventory')) return '/almacen';
    if (t.includes('caducidad') || e.includes('medical')) return '/medical';
    if (t.includes('solicitud') || e.includes('request')) return '/requests';
    if (t.includes('viaje') || e.includes('trip')) return '/trips';
    if (t.includes('calendario') || e.includes('match')) return '/calendario';
    if (t.includes('lavander') || e.includes('laundry')) return '/laundry';
    if (t.includes('cumple')) return '/birthdays';
    return null;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Centro de Alertas de Utilería</h2>
          <p className="text-xs text-slate-400 mt-1">Notificaciones en tiempo real sobre límites de existencias de material, caducidad de fármacos y solicitudes de jugadores.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canEdit && (
          <>
          <button
            onClick={() => {
              const created = scanBirthdayAlerts(teamId);
              const upcoming = getUpcomingBirthdays();
              if (refresh) refresh();
              if (created === 0 && upcoming.length === 0) {
                alert("No hay cumpleaños de plantilla este mes.");
              } else if (created === 0) {
                alert(`Cumpleaños de ${upcoming.map((b) => `${b.name} (${b.day})`).join(", ")} — alertas ya generadas para Carlos Kobe.`);
              } else {
                alert(`${created} alerta(s) de cumpleaños creadas para Carlos Rodriguez Kobe.`);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all shadow-md"
          >
            🎂 Escanear Cumpleaños del Mes
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
            >
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Marcar todas como leídas
            </button>
          )}
          {alerts.length > 0 && (
            <>
            <button
              type="button"
              onClick={() => {
                const next = dateOrder === "asc" ? "desc" : "asc";
                setDateOrder(next);
                try {
                  localStorage.setItem("cmAlertsDateOrder", next);
                } catch {
                  /* ignore */
                }
              }}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
              title="Ordenar por fecha del partido"
            >
              <ArrowUpDown className="h-4 w-4" />
              {dateOrder === "asc" ? "Fecha ↑ (próximos primero)" : "Fecha ↓ (lejanos primero)"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (allSelected) setSelected(new Set());
                else setSelected(new Set(listed.map((a) => a.id)));
              }}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
            >
              {allSelected ? 'Quitar selección' : `Seleccionar todas (${listed.length})`}
            </button>
            {readIds.length > 0 && (
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  if (!confirm(`¿Eliminar las ${readIds.length} alerta(s) ya leídas?`)) return;
                  setBusy(true);
                  try {
                    await dismissMany(readIds);
                    setSelected(new Set());
                  } finally {
                    setBusy(false);
                  }
                }}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar leídas
              </button>
            )}
            {selected.size > 0 && (
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  const ids = [...selected];
                  if (!confirm(`¿Eliminar ${ids.length} alerta(s) seleccionadas?`)) return;
                  setBusy(true);
                  try {
                    await dismissMany(ids);
                    setSelected(new Set());
                  } finally {
                    setBusy(false);
                  }
                }}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar seleccionadas ({selected.size})
              </button>
            )}
            <button
              type="button"
              onClick={async () => {
                if (!confirm(`¿Eliminar las ${alerts.length} alerta(s) de la bandeja?`)) return;
                await dismissAll();
                setSelected(new Set());
              }}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold text-red-600 transition-all"
            >
              <Trash2 className="h-4 w-4" />
              Vaciar bandeja
            </button>
            </>
          )}
          </>
          )}
        </div>
      </div>

      {/* Alerts List Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando alertas del sistema...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-20 text-center text-slate-400">
          <Check className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">¡Bandeja de Entrada Limpia!</p>
          <p className="text-xs mt-1">No hay ninguna alerta crítica o advertencia pendiente de revisión.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {listed.map((alert) => {
            const isCritical = alert.severity === "critical";
            const isWarning = alert.severity === "warning";

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                  selected.has(alert.id)
                    ? "ring-2 ring-orange-400 border-orange-300"
                    : ""
                } ${
                  alert.is_read
                    ? "bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/60 opacity-60"
                    : isCritical
                    ? "bg-red-50/30 dark:bg-red-950/5 border-red-200 dark:border-red-950/40"
                    : isWarning
                    ? "bg-amber-50/30 dark:bg-amber-950/5 border-amber-200 dark:border-amber-950/40"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }`}
              >
                {canEdit && (
                  <label className="shrink-0 self-center pt-0.5">
                    <input
                      type="checkbox"
                      checked={selected.has(alert.id)}
                      onChange={() => {
                        setSelected((prev) => {
                          const next = new Set(prev);
                          if (next.has(alert.id)) next.delete(alert.id);
                          else next.add(alert.id);
                          return next;
                        });
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                      aria-label={`Seleccionar alerta ${alert.title || alert.message}`}
                    />
                  </label>
                )}
                {/* Alert Severity Indicator Node */}
                <div className={`p-2.5 rounded-lg shrink-0 ${
                  alert.is_read
                    ? "bg-slate-100 text-slate-400 dark:bg-slate-800"
                    : isCritical
                    ? "bg-red-100 text-red-600 dark:bg-red-950/40"
                    : isWarning
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-950/40"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-950/40"
                }`}>
                  <ShieldAlert className="h-5 w-5" />
                </div>

                {/* Message & Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wide ${
                      alert.is_read
                        ? "bg-slate-100 text-slate-400 dark:bg-slate-800"
                        : isCritical
                        ? "bg-red-100 text-red-700 dark:bg-red-950/50"
                        : isWarning
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950/50"
                    }`}>
                      {alert.type}
                    </span>
                    <span suppressHydrationWarning={true} className="text-[10px] text-slate-400 font-medium">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className={`text-xs mt-2.5 leading-relaxed font-semibold ${
                    alert.is_read ? "text-slate-500" : "text-slate-800 dark:text-slate-200"
                  }`}>
                    {alert.message}
                  </p>
                  {resolveHref(alert) && (
                    <Link
                      href={resolveHref(alert)!}
                      className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-orange-600 hover:underline"
                    >
                      Resolver <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                {/* Action buttons (Read / Dismiss-Delete) */}
                {canEdit && (
                <div className="shrink-0 self-center flex items-center gap-1">
                  {!alert.is_read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(alert.id)}
                      className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Marcar como leída"
                    >
                      <Check className="h-4.5 w-4.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('¿Eliminar esta alerta de la bandeja?')) {
                        void dismissAlert(alert.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Eliminar alerta"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
