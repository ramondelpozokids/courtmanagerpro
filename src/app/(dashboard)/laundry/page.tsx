"use client";

import { useState } from "react";
import { useLaundry } from "@/hooks/useLaundry";
import { useAuth } from "@/contexts/AuthContext";
import { canWriteClubData } from "@/lib/permissions";
import { Droplet, Wind, CheckCircle, Clock, PlusCircle, RefreshCw, User, Trash2 } from "lucide-react";

export default function LaundryPage() {
  const { user } = useAuth();
  const { batches, loading, updateBatchStatus, createBatch, deleteBatch } = useLaundry();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Create batch form state
  const [name, setName] = useState("");
  const [itemCount, setItemCount] = useState<number>(20);
  const [responsible, setResponsible] = useState("Carlos (Utillero)");

  const canWrite = canWriteClubData(user?.profile?.role, user?.profile?.email ?? user?.email);

  const handleDeleteBatch = async (batchId: string) => {
    if (!confirm("¿Eliminar este lote de lavandería?")) return;
    await deleteBatch(batchId);
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await createBatch({ name, itemCount, responsible });
    setShowAddForm(false);
    setName("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "WASHING":
        return <Droplet className="h-5 w-5 text-blue-500 animate-bounce" />;
      case "DRYING":
        return <Wind className="h-5 w-5 text-amber-500 animate-pulse" />;
      case "READY":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "WASHING": return "Lavando";
      case "DRYING": return "Secando";
      case "READY": return "Listo / Doblado";
      default: return "En cola / Pendiente";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Control de Lavandería Industrial</h2>
          <p className="text-xs text-slate-400 mt-1">Seguimiento de lotes de ropa de entrenamiento, juego y chándales post-partido.</p>
        </div>
        {canWrite && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/15"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            Nuevo Lote de Lavado
          </button>
        )}
      </div>

      {/* Add Batch Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateBatch} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg max-w-sm w-full space-y-4 text-left">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Crear Lote de Lavandería</h3>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nombre del Lote</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Ropa Entrenamiento vs Unicaja"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Prendas (Aprox.)</label>
                <input
                  type="number"
                  value={itemCount}
                  onChange={(e) => setItemCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Responsable</label>
                <input
                  type="text"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-850 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 text-xs font-bold">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 shadow-md">Añadir Lote</button>
            </div>
          </form>
        </div>
      )}

      {/* Batches Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando lavadoras del club...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {batches.map((batch) => {
            return (
              <div
                key={batch.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      {getStatusIcon(batch.status)}
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-100 leading-snug">{batch.name}</h3>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Recibido: {batch.receivedDate}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      batch.status === "READY"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                        : batch.status === "WASHING"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {getStatusLabel(batch.status)}
                    </span>
                  </div>

                  <div className="my-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Prendas estimadas:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{batch.itemCount} prendas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Utillero responsable:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <User className="h-3 w-3 text-orange-500" /> {batch.responsible}
                      </span>
                    </div>
                    {batch.completedDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Completado el:</span>
                        <span className="font-bold text-emerald-500">{batch.completedDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status adjustment buttons */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex gap-2">
                  {canWrite && batch.status !== "READY" && (
                    <>
                      {batch.status === "PENDING" && (
                        <button
                          onClick={() => updateBatchStatus(batch.id, "WASHING")}
                          className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/10"
                        >
                          Iniciar Lavado (WASH)
                        </button>
                      )}
                      {batch.status === "WASHING" && (
                        <button
                          onClick={() => updateBatchStatus(batch.id, "DRYING")}
                          className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/10"
                        >
                          Iniciar Secado (DRY)
                        </button>
                      )}
                      {batch.status === "DRYING" && (
                        <button
                          onClick={() => updateBatchStatus(batch.id, "READY")}
                          className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-500/10"
                        >
                          Marcar Listo (READY)
                        </button>
                      )}
                    </>
                  )}
                  {canWrite && (
                    <button
                      onClick={() => handleDeleteBatch(batch.id)}
                      className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all border border-red-200"
                      title="Eliminar lote"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
