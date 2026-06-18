"use client";

import { useMedical } from "@/hooks/useMedical";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { HeartPulse, Calendar, AlertTriangle, CheckCircle, RefreshCw, Minus, Plus, Search, MapPin } from "lucide-react";

export default function MedicalStockPage() {
  const { user } = useAuth();
  const { items, loading, adjustQty, createItem } = useMedical();
  const [search, setSearch] = useState("");

  const hasAccess = ["admin", "equipment_manager", "medical"].includes(user?.profile?.role || "assistant");

  const getStatusBadge = (status: string, expiry: string) => {
    switch (status) {
      case "EXPIRED":
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-600 uppercase tracking-wide flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Caducado
          </span>
        );
      case "EXPIRING_SOON":
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-600 uppercase tracking-wide flex items-center gap-1 animate-pulse">
            <AlertTriangle className="h-3 w-3" /> Próxima Caducidad ({expiry})
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-600 uppercase tracking-wide flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> En Buen Estado
          </span>
        );
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!hasAccess) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-16 text-center text-slate-400">
        <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-amber-500" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Acceso restringido</p>
        <p className="text-xs mt-1 max-w-xs mx-auto">
          El módulo de Material Médico y Caducidades de Botiquines solo es accesible para el Administrador, Utillero Jefe y Staff Médico.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Material Médico y Botiquines ACB</h2>
          <p className="text-xs text-slate-400 mt-1">Control sanitario de stock de fisioterapia, sprays fríos, tapes, vendajes y alertas de caducidad.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
        <div className="relative max-w-md text-left">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar vendas, geles antiinflamatorios, sprays..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Grid of Medical Items */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando material sanitario...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <HeartPulse className="h-5 w-5 text-red-500" />
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-100 leading-snug">{item.name}</h3>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Lote: {item.batchNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="my-4 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estado caducidad:</span>
                      {getStatusBadge(item.status, item.expiryDate)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fecha caducidad:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" /> {item.expiryDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ubicación Física:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-orange-500" /> {item.location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cantidad disponible:</span>
                      <span className={`font-extrabold ${item.quantity <= item.minQuantity ? "text-amber-500" : "text-emerald-500"}`}>
                        {item.quantity} unidades (mínimo: {item.minQuantity})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Adjust medicine counts */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Control de Stock:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustQty(item.id, item.quantity - 1)}
                      disabled={item.quantity === 0}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-all"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-extrabold text-sm w-8 text-center text-slate-800 dark:text-slate-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => adjustQty(item.id, item.quantity + 1)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
