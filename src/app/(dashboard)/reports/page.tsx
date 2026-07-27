"use client";

import { useInventory } from "@/hooks/useInventory";
import { usePlayers } from "@/hooks/usePlayers";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveTeamId, useClubBranding } from "@/contexts/ClubDemoContext";
import { canAccessReports, canWriteClubData } from "@/lib/permissions";
import { exportInventoryCsv, exportSizingCsv } from "@/lib/csv-export";
import { getClubPack } from "@/data/clubs";
import {
  TrendingUp, Download, PieChart, BarChart3, AlertCircle, Shirt, Users, Package, Ruler,
} from "lucide-react";

export default function ReportsPage() {
  const { user, userEmail, hasOperationalAccess } = useAuth();
  const branding = useClubBranding();
  const teamId = useActiveTeamId();
  const { items } = useInventory(teamId);
  const { players } = usePlayers(teamId);
  const pack = getClubPack(branding.slug);
  const coachingStaff = pack.coachingStaff || [];
  const role = user?.profile?.role;
  const canExport = hasOperationalAccess || canWriteClubData(role, userEmail);

  const totalValue = items.reduce((acc, item) => acc + (item.unit_cost || 0) * item.stock_available, 0);
  const outOfStockCount = items.filter((item) => item.stock_available === 0).length;
  const lowStockCount = items.filter((item) => item.stock_available > 0 && item.stock_available <= item.stock_min).length;

  const categoryBreakdown = items.reduce<Record<string, { count: number; value: number }>>((acc, item) => {
    const cat = item.category || "otros";
    if (!acc[cat]) acc[cat] = { count: 0, value: 0 };
    acc[cat].count += item.stock_available;
    acc[cat].value += (item.unit_cost || 0) * item.stock_available;
    return acc;
  }, {});

  const handleExportInventory = () => {
    exportInventoryCsv(
      branding.slug,
      items.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        category: item.category,
        stock_available: item.stock_available,
        stock_min: item.stock_min,
        size: item.size,
        unit_cost: item.unit_cost,
        location: (item as { location?: string }).location,
      })),
      { season: branding.slug === "atm" ? "2025-26" : "2026-27" }
    );
  };

  const handleExportSizing = () => {
    exportSizingCsv(branding.slug, players, coachingStaff, [], {
      season: branding.slug === "atm" ? "2025-26" : "2026-27",
    });
  };

  if (!hasOperationalAccess && !canAccessReports(role, userEmail)) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-16 text-center text-slate-400">
        <AlertCircle className="h-12 w-12 mx-auto mb-3 text-red-500" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Acceso restringido</p>
        <p className="text-sm mt-1 max-w-md mx-auto text-muted">
          Informes de equipación: solo Administrador (Carlos Kobe), Utillero Jefe y Superadmin (Ramón del Pozo Rott).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Informes de Equipación y Utilería
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {branding.name} — exportación CSV con cabecera oficial, valor de almacén y tabla de tallas ({players.length} jugadores).
          </p>
        </div>
        {canExport && (
          <div className="flex flex-wrap gap-2">
            <button onClick={handleExportInventory} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md">
              <Download className="h-4 w-4" /> Inventario CSV
            </button>
            <button onClick={handleExportSizing} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold">
              <Ruler className="h-4 w-4 text-orange-500" /> Tallas CSV
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Package, label: "Valor Almacén", value: `€${totalValue.toLocaleString("es-ES")}`, color: "text-slate-800 dark:text-white" },
          { icon: Users, label: "Jugadores Activos", value: String(players.length), color: "text-orange-600" },
          { icon: Shirt, label: "Referencias Inventario", value: String(items.length), color: "text-slate-800 dark:text-white" },
          { icon: Ruler, label: "Productos de Talla", value: String(26), color: "text-emerald-600" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <Icon className="h-5 w-5 text-orange-500 mb-2" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
            <span className={`text-2xl font-black ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-orange-500" /> Inventario por Categoría de Equipación
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown).length === 0 && (
              <p className="text-sm text-slate-400">Sin referencias de inventario para este club.</p>
            )}
            {Object.entries(categoryBreakdown).map(([cat, data]) => (
              <div key={cat} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-bold text-slate-700 dark:text-slate-200 capitalize">{cat.replace(/_/g, " ")}</span>
                <span className="text-slate-500">{data.count} uds · €{data.value.toLocaleString("es-ES")}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-orange-500" /> Alertas de stock
          </h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Fuera de stock</span>
            <span className="font-black text-rose-600">{outOfStockCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Bajo mínimo</span>
            <span className="font-black text-amber-600">{lowStockCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Staff técnico</span>
            <span className="font-black text-slate-800 dark:text-white">{coachingStaff.length}</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Club activo: {branding.shortName}
          </p>
        </div>
      </div>
    </div>
  );
}
