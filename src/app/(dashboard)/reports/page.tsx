"use client";

import { useInventory } from "@/hooks/useInventory";
import { usePlayers } from "@/hooks/usePlayers";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Download, PieChart, BarChart3, AlertCircle } from "lucide-react";

export default function ReportsPage() {
  const { user } = useAuth();
  const { items } = useInventory();
  const { players } = usePlayers();

  const hasAccess = ["admin", "equipment_manager", "coach"].includes(user?.profile?.role || "assistant");

  // Math stats
  const totalValue = items.reduce((acc, item) => acc + (item.unit_cost || 0) * item.stock_available, 0);
  const outOfStockCount = items.filter((item) => item.stock_available === 0).length;
  const lowStockCount = items.filter((item) => item.stock_available > 0 && item.stock_available <= item.stock_min).length;

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Nombre,SKU,Categoria,Stock,Talla,Precio Unitario,Valor Total\r\n";
    
    items.forEach((item) => {
      csvContent += `${item.id},"${item.name}",${item.sku},${item.category},${item.stock_available},"${item.size || "U"}",${item.unit_cost || 0},${(item.unit_cost || 0) * item.stock_available}\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "catalogo_utileria_courtmanager.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!hasAccess) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-16 text-center text-slate-400">
        <AlertCircle className="h-12 w-12 mx-auto mb-3 text-red-500" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Acceso restringido</p>
        <p className="text-xs mt-1 max-w-xs mx-auto">
          El módulo de Analíticas e Informes Ejecutivos solo es accesible para el Administrador, Utillero Jefe y Cuerpo Técnico (Entrenador).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Informes y Analítica Ejecutiva</h2>
          <p className="text-xs text-slate-400 mt-1">Monitoreo del valor de activos del club, rotación de calzado, ratios de desgaste e informes financieros.</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/15"
        >
          <Download className="h-4.5 w-4.5" />
          Exportar Catálogo (CSV)
        </button>
      </div>

      {/* Numerical Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Valor Estimado del Almacén</span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">€{totalValue.toLocaleString("es-ES")}</h3>
          <p className="text-xs text-slate-400 mt-1">Basado en precios de adquisición de fabricante.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Artículos Fuera de Stock</span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">{outOfStockCount} items</h3>
          <p className="text-xs text-slate-400 mt-1">Artículos con stock igual a cero.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Artículos Bajo Mínimo</span>
          <h3 className="text-2xl font-black text-orange-500 mt-2">{lowStockCount} items</h3>
          <p className="text-xs text-slate-400 mt-1">Nivel crítico requiriendo reposición inmediata.</p>
        </div>
      </div>

      {/* SVG Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Stock consumption chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-100 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            Consumo Mensual de Ropa de Competición ( uds )
          </h3>

          {/* SVG Column chart bar */}
          <div className="pt-6 flex justify-center">
            <svg viewBox="0 0 500 240" className="w-full max-w-lg h-auto">
              {/* Gridlines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
              <line x1="40" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
              <line x1="40" y1="200" x2="480" y2="200" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Bars */}
              {/* Jan */}
              <rect x="70" y="80" width="35" height="120" rx="3" fill="#ea580c" />
              {/* Feb */}
              <rect x="150" y="50" width="35" height="150" rx="3" fill="#ea580c" />
              {/* Mar */}
              <rect x="230" y="110" width="35" height="90" rx="3" fill="#fb923c" />
              {/* Apr */}
              <rect x="310" y="40" width="35" height="160" rx="3" fill="#ea580c" />
              {/* May */}
              <rect x="390" y="90" width="35" height="110" rx="3" fill="#fb923c" />

              {/* Month Text */}
              <text x="87" y="220" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">Ene</text>
              <text x="167" y="220" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">Feb</text>
              <text x="247" y="220" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">Mar</text>
              <text x="327" y="220" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">Abr</text>
              <text x="407" y="220" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">May</text>

              {/* Y-axis Labels */}
              <text x="30" y="23" textAnchor="end" fontSize="9" fontWeight="bold" fill="#94a3b8">200</text>
              <text x="30" y="83" textAnchor="end" fontSize="9" fontWeight="bold" fill="#94a3b8">150</text>
              <text x="30" y="143" textAnchor="end" fontSize="9" fontWeight="bold" fill="#94a3b8">100</text>
              <text x="30" y="203" textAnchor="end" fontSize="9" fontWeight="bold" fill="#94a3b8">0</text>
            </svg>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-100 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-orange-500" />
            Distribución de Costes por Tipo de Artículo
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center pt-4">
            {/* Simple representation of cost ratios */}
            <div className="space-y-3.5 flex-1 w-full text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Uniformes de Competición</span>
                  <span>52%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-orange-600 h-full rounded-full" style={{ width: "52%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Zapatillas Técnicas</span>
                  <span>28%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-orange-400 h-full rounded-full" style={{ width: "28%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Ropa de Entrenamiento</span>
                  <span>14%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: "14%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Material Sanitario</span>
                  <span>6%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full rounded-full" style={{ width: "6%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
