"use client";

import { useInventory } from "@/hooks/useInventory";
import { usePlayers } from "@/hooks/usePlayers";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessReports, canWriteClubData } from "@/lib/permissions";
import { DEFAULT_SIZING_PRODUCTS } from "@/content/sizing-products";
import { db } from "@/infrastructure/supabase/repositories/InMemoryDB";
import {
  TrendingUp, Download, PieChart, BarChart3, AlertCircle, Shirt, Users, Package, Ruler,
} from "lucide-react";

export default function ReportsPage() {
  const { user } = useAuth();
  const { items } = useInventory();
  const { players } = usePlayers();
  const role = user?.profile?.role;
  const canExport = canWriteClubData(role);

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

  const exportInventoryCSV = () => {
    let csv = "data:text/csv;charset=utf-8,ID,Nombre,SKU,Categoria,Stock,Talla,Precio,Valor Total\r\n";
    items.forEach((item) => {
      csv += `${item.id},"${item.name}",${item.sku},${item.category},${item.stock_available},"${item.size || "U"}",${item.unit_cost || 0},${(item.unit_cost || 0) * item.stock_available}\r\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "inventario_utileria_courtmanager.csv";
    link.click();
  };

  const exportSizingCSV = () => {
    let csv = "data:text/csv;charset=utf-8,Jugador,Dorsal,Posicion";
    DEFAULT_SIZING_PRODUCTS.forEach((p) => { csv += `,${p.label}`; });
    csv += "\r\n";
    db.players.forEach((p) => {
      csv += `"${p.firstName} ${p.lastName}",${p.number},${p.position}`;
      DEFAULT_SIZING_PRODUCTS.forEach((prod) => {
        csv += `,"${p.sizes?.[prod.id] || p.sizes?.[prod.legacyKey || ""] || "—"}"`;
      });
      csv += "\r\n";
    });
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "tabla_tallas_plantilla_rmb.csv";
    link.click();
  };

  if (!canAccessReports(role)) {
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
            Valor de almacén, rotación de material, tallajes de plantilla ({players.length} jugadores) e informes exportables para Carlos Kobe.
          </p>
        </div>
        {canExport && (
          <div className="flex flex-wrap gap-2">
            <button onClick={exportInventoryCSV} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md">
              <Download className="h-4 w-4" /> Inventario CSV
            </button>
            <button onClick={exportSizingCSV} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold">
              <Ruler className="h-4 w-4 text-orange-500" /> Tallas CSV
            </button>
          </div>
        )}
      </div>

      {/* KPIs equipación */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Package, label: "Valor Almacén", value: `€${totalValue.toLocaleString("es-ES")}`, color: "text-slate-800 dark:text-white" },
          { icon: Users, label: "Jugadores Activos", value: String(players.length), color: "text-orange-600" },
          { icon: Shirt, label: "Referencias Inventario", value: String(items.length), color: "text-slate-800 dark:text-white" },
          { icon: Ruler, label: "Productos de Talla", value: String(DEFAULT_SIZING_PRODUCTS.length + db.customSizingProducts.length), color: "text-emerald-600" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <Icon className="h-5 w-5 text-orange-500 mb-2" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
            <h3 className={`text-xl font-black mt-1 ${color}`}>{value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border rounded-xl p-4">
          <span className="text-xs font-bold text-slate-400 uppercase">Fuera de Stock</span>
          <h3 className="text-2xl font-black text-red-500 mt-1">{outOfStockCount}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 border rounded-xl p-4">
          <span className="text-xs font-bold text-slate-400 uppercase">Bajo Mínimo</span>
          <h3 className="text-2xl font-black text-orange-500 mt-1">{lowStockCount}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 border rounded-xl p-4">
          <span className="text-xs font-bold text-slate-400 uppercase">Staff Técnico</span>
          <h3 className="text-2xl font-black mt-1">{db.coachingStaff.length}</h3>
        </div>
      </div>

      {/* Desglose por categoría de equipación */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-orange-500" />
          Inventario por Categoría de Equipación
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-400 border-b">
                <th className="text-left py-2">Categoría</th>
                <th className="text-right py-2">Unidades</th>
                <th className="text-right py-2">Valor €</th>
                <th className="text-right py-2">% del total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categoryBreakdown).sort((a, b) => b[1].value - a[1].value).map(([cat, data]) => (
                <tr key={cat} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 font-semibold capitalize">{cat.replace(/_/g, " ")}</td>
                  <td className="py-2 text-right">{data.count}</td>
                  <td className="py-2 text-right font-bold">€{data.value.toLocaleString("es-ES")}</td>
                  <td className="py-2 text-right text-orange-600">{totalValue ? Math.round((data.value / totalValue) * 100) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico consumo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-sm">
          <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            Consumo Mensual Equipación (uds)
          </h3>
          <svg viewBox="0 0 500 240" className="w-full max-w-lg mx-auto h-auto">
            <line x1="40" y1="200" x2="480" y2="200" stroke="#cbd5e1" strokeWidth="1.5" />
            {[80, 50, 110, 40, 90].map((y, i) => (
              <rect key={i} x={70 + i * 80} y={y} width="35" height={200 - y} rx="3" fill={i % 2 ? "#fb923c" : "#ea580c"} />
            ))}
            {["Ene", "Feb", "Mar", "Abr", "May"].map((m, i) => (
              <text key={m} x={87 + i * 80} y="220" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#64748b">{m}</text>
            ))}
          </svg>
        </div>

        <div className="bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-sm">
          <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Distribución de Costes por Tipo
          </h3>
          <div className="space-y-3 text-sm">
            {[
              { label: "Uniformes Competición", pct: 52 },
              { label: "Zapatillas Técnicas", pct: 28 },
              { label: "Ropa Entrenamiento / Chándal", pct: 14 },
              { label: "Accesorios y Material Viaje", pct: 6 },
            ].map(({ label, pct }) => (
              <div key={label}>
                <div className="flex justify-between font-bold mb-1">
                  <span>{label}</span><span>{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
