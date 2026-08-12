"use client";

import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { usePlayers } from "@/hooks/usePlayers";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveTeamId, useClubBranding } from "@/contexts/ClubDemoContext";
import { canAccessReports, canWriteClubData } from "@/lib/permissions";
import { exportSizingXlsx } from "@/lib/sizing-xlsx-export";
import {
  exportInventoryPdf,
  exportSizingPdf,
  exportWarehousePdf,
  seasonLabelForClub,
} from "@/lib/pdf-export";
import { getClubPack } from "@/data/clubs";
import { equipoConjuntoTotal } from "@/lib/atm-roster";
import {
  TrendingUp, PieChart, BarChart3, AlertCircle, Shirt, Users, Package, Ruler, FileText, Warehouse,
} from "lucide-react";

export default function ReportsPage() {
  const { user, userEmail, hasOperationalAccess } = useAuth();
  const branding = useClubBranding();
  const teamId = useActiveTeamId();
  const { items } = useInventory(teamId);
  const { players } = usePlayers(teamId);
  const pack = getClubPack(branding.slug);
  const coachingStaff = pack.coachingStaff || [];
  const teamTotal = equipoConjuntoTotal(players.length, coachingStaff.length);
  const role = user?.profile?.role;
  const canExport = hasOperationalAccess || canWriteClubData(role, userEmail);
  const season = seasonLabelForClub(branding.slug);
  const [pdfBusy, setPdfBusy] = useState<string | null>(null);
  const [xlsxBusy, setXlsxBusy] = useState(false);

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

  const inventoryRows = items.map((item) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    category: item.category,
    stock_available: item.stock_available,
    stock_min: item.stock_min,
    size: item.size,
    unit_cost: item.unit_cost,
    location: (item as { location?: string }).location,
  }));

  const handleExportSizingXlsx = () => {
    void (async () => {
      try {
        setXlsxBusy(true);
        await exportSizingXlsx(branding.slug, players, coachingStaff, [], { season });
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Error al generar Excel");
      } finally {
        setXlsxBusy(false);
      }
    })();
  };

  const loadWarehouseRows = async () => {
    const params = new URLSearchParams({
      scope: "active",
      team_id: teamId,
      sport: branding.sport === "football" ? "football" : "basketball",
      category: "primer_equipo",
    });
    const res = await fetch(`/api/warehouse?${params}`, { credentials: "include" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Error al cargar almacén");
    return (json.data?.items || []) as Array<{
      name: string;
      sku?: string | null;
      section_label?: string;
      size?: string | null;
      stock: number;
      stock_min?: number;
      unit_cost?: number;
      value?: number;
      location?: string;
      low_stock?: boolean;
    }>;
  };

  const runPdf = async (key: string, fn: () => Promise<void>) => {
    try {
      setPdfBusy(key);
      await fn();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al generar PDF");
    } finally {
      setPdfBusy(null);
    }
  };

  if (!hasOperationalAccess && !canAccessReports(role, userEmail)) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-16 text-center text-slate-400">
        <AlertCircle className="h-12 w-12 mx-auto mb-3 text-red-500" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Acceso restringido</p>
        <p className="text-sm mt-1 max-w-md mx-auto text-muted">
          Informes de equipación: Administrador, Utillero Jefe y Superadmin.
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
            {branding.name} · {teamTotal} personas ({players.length} jugadores + {coachingStaff.length} staff)
          </p>
        </div>
        {canExport && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto sm:min-w-[28rem]">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Ruler className="h-3 w-3 text-orange-500" /> Tallas
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleExportSizingXlsx}
                  disabled={xlsxBusy || !!pdfBusy}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-50"
                >
                  {xlsxBusy ? "…" : "Excel"}
                </button>
                <button
                  onClick={() =>
                    void runPdf("siz", () =>
                      exportSizingPdf(branding.slug, players, coachingStaff, [], { season })
                    )
                  }
                  disabled={!!pdfBusy || xlsxBusy}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold disabled:opacity-50"
                >
                  {pdfBusy === "siz" ? "…" : "PDF"}
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Package className="h-3 w-3 text-orange-500" /> Inventario
              </p>
              <button
                onClick={() =>
                  void runPdf("inv", () => exportInventoryPdf(branding.slug, inventoryRows, { season }))
                }
                disabled={!!pdfBusy}
                className="w-full flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold disabled:opacity-50"
              >
                <FileText className="h-3.5 w-3.5" /> {pdfBusy === "inv" ? "…" : "PDF"}
              </button>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Warehouse className="h-3 w-3 text-orange-500" /> Almacén
              </p>
              <button
                onClick={() =>
                  void runPdf("wh", async () => {
                    const rows = await loadWarehouseRows();
                    await exportWarehousePdf(branding.slug, rows, { season });
                  })
                }
                disabled={!!pdfBusy}
                className="w-full flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold disabled:opacity-50"
              >
                <FileText className="h-3.5 w-3.5" /> {pdfBusy === "wh" ? "…" : "PDF"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Package, label: "Valor Almacén", value: `€${totalValue.toLocaleString("es-ES")}`, color: "text-slate-800 dark:text-white" },
          { icon: Users, label: "Equipo conjunto", value: String(teamTotal), color: "text-orange-600" },
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
            <span className="text-slate-600 dark:text-slate-300">Jugadores</span>
            <span className="font-black text-slate-800 dark:text-white">{players.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Staff técnico</span>
            <span className="font-black text-slate-800 dark:text-white">{coachingStaff.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Equipo conjunto</span>
            <span className="font-black text-orange-600">{teamTotal}</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Club activo: {branding.shortName}
          </p>
        </div>
      </div>
    </div>
  );
}
