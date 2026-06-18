"use client";

import { useRequests } from "@/hooks/useRequests";
import { useAuth } from "@/contexts/AuthContext";
import { canCreateRequest, canProcessRequests } from "@/lib/permissions";
import RequestForm from "@/components/requests/RequestForm";
import { useMemo, useState } from "react";
import { PlusCircle, ShoppingBag, CheckCircle, Clock, RefreshCw, Filter } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  ALL: "Todas",
  equipacion: "Equipación",
  entrenamiento: "Entrenamiento",
  calzado: "Calzado",
  accesorios: "Accesorios",
};

export default function RequestsPage() {
  const { user } = useAuth();
  const { requests, loading, createRequest, updateStatus } = useRequests();
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const userRole = user?.profile?.role || "assistant";
  const userId = user?.id || "u1";
  const canProcess = canProcessRequests(userRole);
  const canCreate = canCreateRequest(userRole);
  const isPlayer = userRole === "player";

  const stats = useMemo(() => ({
    pending: requests.filter((r) => r.status === "pendiente").length,
    approved: requests.filter((r) => r.status === "aprobada").length,
    delivered: requests.filter((r) => r.status === "completada").length,
    total: requests.length,
  }), [requests]);

  const handleCreateRequest = async (reqData: any) => {
    try {
      // Map to CreateRequestForm fields
      await createRequest({
        title: reqData.itemName,
        description: reqData.notes,
        priority: "normal",
        player_id: reqData.playerId,
        quantity: reqData.quantity,
        size: reqData.size
      }, userId);
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const visibleRequests = requests.filter((req) => {
    const matchesUser = !isPlayer || req.player_id === userId;
    const matchesStatus = statusFilter === "ALL" || req.status === statusFilter;
    const cat = (req as any).category || "equipacion";
    const matchesCategory = categoryFilter === "ALL" || cat === categoryFilter;
    return matchesUser && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Solicitudes de Equipamiento</h2>
          <p className="text-sm text-slate-500 mt-1">
            {canProcess
              ? `Workflow de peticiones — ${stats.pending} pendientes · ${stats.approved} aprobadas · ${stats.delivered} entregadas`
              : "Tus solicitudes personales de utilería e indumentaria."}
          </p>
        </div>
        {canCreate && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/15"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Nueva Petición
        </button>
        )}
      </div>

      {/* Stats */}
      {canProcess && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total },
            { label: "Pendientes", value: stats.pending, color: "text-amber-600" },
            { label: "Aprobadas", value: stats.approved, color: "text-blue-600" },
            { label: "Entregadas", value: stats.delivered, color: "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-slate-900 border rounded-xl p-3 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">{label}</span>
              <p className={`text-xl font-black ${color || ""}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal request form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-lg">
            <RequestForm onSubmit={handleCreateRequest} onClose={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          {["ALL", "pendiente", "aprobada", "completada"].map((status) => {
            const labels: Record<string, string> = { ALL: "Todas", pendiente: "Pendientes", aprobada: "Aprobadas", completada: "Entregadas" };
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  statusFilter === status ? "bg-white dark:bg-slate-800 text-orange-600 shadow-sm" : "text-slate-500"
                }`}
              >
                {labels[status]}
              </button>
            );
          })}
        </div>
        <div className="flex gap-1.5 items-center">
          <Filter className="h-4 w-4 text-slate-400" />
          {Object.keys(CATEGORY_LABELS).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                categoryFilter === cat ? "bg-orange-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando histórico de peticiones...</p>
        </div>
      ) : visibleRequests.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-16 text-center text-slate-400">
          <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No hay solicitudes encontradas</p>
          <p className="text-xs mt-1">Crea una nueva solicitud para verla reflejada en el tablero.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {visibleRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between"
            >
              {/* Request Item Header */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-500 tracking-wider uppercase">
                      ID: {req.id.slice(0, 8)}
                    </span>
                    <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-base mt-1.5">{req.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Talla: <span className="font-bold text-slate-700 dark:text-slate-300">{req.size || "Única"}</span> • Cantidad: <span className="font-bold text-slate-700 dark:text-slate-300">{req.quantity || 1} uds</span></p>
                  </div>

                  {/* Status Tag */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    req.status === "completada"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                      : req.status === "aprobada"
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                      : req.status === "pendiente"
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                      : "bg-red-50 text-red-600 dark:bg-red-950/20"
                  }`}>
                    {req.status === "completada" ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : req.status === "pendiente" ? (
                      <Clock className="h-3 w-3" />
                    ) : null}
                    <span>{req.status === "completada" ? "Entregado" : req.status === "aprobada" ? "Aprobado" : req.status === "pendiente" ? "Pendiente" : "Rechazado"}</span>
                  </span>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jugador solicitante:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {(req as any).playerName || (req.player ? req.player.full_name : "N/A")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fecha solicitud:</span>
                    <span suppressHydrationWarning={true} className="font-medium text-slate-500">{new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                  {req.description && (
                    <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 mt-2 italic leading-relaxed">
                      "{req.description}"
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons for Admins / Managers */}
              {canProcess && req.status !== "completada" && req.status !== "rechazada" && (
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex gap-2">
                  {req.status === "pendiente" && (
                    <>
                      <button
                        onClick={() => updateStatus(req.id, "rechazada")}
                        className="flex-1 py-2 text-xs font-bold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Rechazar
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, "aprobada")}
                        className="flex-1 py-2 text-xs font-bold rounded-lg bg-orange-500 text-white hover:bg-orange-600 shadow-sm transition-all"
                      >
                        Aprobar
                      </button>
                    </>
                  )}
                  {req.status === "aprobada" && (
                    <button
                      onClick={() => updateStatus(req.id, "completada")}
                      className="w-full py-2 text-xs font-bold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Marcar como ENTREGADO (Deducir Stock)
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
