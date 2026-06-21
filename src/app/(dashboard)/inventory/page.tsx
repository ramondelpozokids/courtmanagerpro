"use client";

import { useInventory } from "@/hooks/useInventory";
import { useAuth } from "@/contexts/AuthContext";
import { canWriteClubData } from "@/lib/permissions";
import StockBadge from "@/components/inventory/StockBadge";
import ItemForm from "@/components/inventory/ItemForm";
import { useState } from "react";
import { Search, PlusCircle, Package, ArrowUpRight, ArrowDownRight, QrCode, ClipboardList, Trash2, Edit2 } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  const { user } = useAuth();
  const { items, loading, createItem, adjustStock, deleteItem } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const canWrite = canWriteClubData(user?.profile?.role, user?.profile?.email ?? user?.email);

  const categories = [
    { code: "ALL", name: "Todos" },
    { code: "camiseta_juego", name: "Camisetas Juego" },
    { code: "pantalon_juego", name: "Pantalones" },
    { code: "camiseta_entrenamiento", name: "Entrenamiento" },
    { code: "zapatillas", name: "Zapatillas" },
    { code: "calcetines", name: "Calcetines" },
    { code: "chaqueta", name: "Chaquetas" },
  ];

  const handleCreateItem = async (itemData: any) => {
    try {
      await createItem(itemData);
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

    const filteredItems = items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || (item.sku || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "ALL" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Inventario de Utilería Profesional</h2>
          <p className="text-xs text-slate-400 mt-1">Control de stock, QR por prenda (móvil) y asignación de ropa técnica ACB.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/inventory/scanner"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
          >
            <QrCode className="h-4.5 w-4.5" />
            Escanear con móvil
          </Link>
          {canWrite && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/15"
            >
              <PlusCircle className="h-4.5 w-4.5" />
              Añadir Material
            </button>
          )}
        </div>
      </div>

      {/* Item Modal Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
            <ItemForm onSubmit={handleCreateItem} onClose={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      {/* Tabs / Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Buttons */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat.code}
              onClick={() => setActiveCategory(cat.code)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === cat.code
                  ? "bg-white dark:bg-slate-800 text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por SKU, referencia o nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Inventory List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Package className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando catálogo de material deportivo...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-16 text-center text-slate-400">
          <Package className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No hay existencias</p>
          <p className="text-xs mt-1">No se encontró ningún artículo de utilería que coincida con la búsqueda.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm text-left">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Artículo de Utilería</th>
                  <th scope="col" className="px-6 py-4">SKU / Referencia</th>
                  <th scope="col" className="px-6 py-4">Categoría</th>
                  <th scope="col" className="px-6 py-4">Talla</th>
                  <th scope="col" className="px-6 py-4">Estado Stock</th>
                  <th scope="col" className="px-6 py-4">Ubicación</th>
                  {canWrite && <th scope="col" className="px-6 py-4 text-center">Acción Stock</th>}
                  {canWrite && <th scope="col" className="px-6 py-4 text-right">Opciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/55 dark:hover:bg-slate-800/10 transition-colors">
                    {/* Item Name / QR image */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center font-bold text-slate-400">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item.sku || "CMP"}`} alt="QR Code" className="h-full w-full object-cover p-1" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-100 block">{item.name}</span>
                        <span suppressHydrationWarning={true} className="text-[10px] text-slate-400 mt-0.5">Precio: €{item.unit_cost || "N/A"} • Act: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "—"}</span>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300 font-semibold">{item.sku}</td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{item.category}</span>
                    </td>

                    {/* Size */}
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{item.size || "—"}</td>

                     {/* Stock Status Badge */}
                      <td className="px-6 py-4">
                        <StockBadge stock={item.stock_available} minStock={item.stock_min} />
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 text-slate-400 font-medium">{item.location}</td>

                      {/* Actions Stock adjustment */}
                      {canWrite && (
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => adjustStock(item.id, 1, "REDUCE")}
                              disabled={item.stock_available === 0}
                              className="p-1 rounded bg-slate-100 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 dark:bg-slate-800 transition-colors"
                              title="Quitar 1 unidad"
                            >
                              <ArrowDownRight className="h-4 w-4" />
                            </button>
                            <span className="font-extrabold w-8 text-center text-slate-800 dark:text-slate-100">{item.stock_available}</span>
                            <button
                              onClick={() => adjustStock(item.id, 1, "ADD")}
                              className="p-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800 transition-colors"
                              title="Añadir 1 unidad"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}

                    {/* Delete Options */}
                    {canWrite && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950/15 transition-colors"
                          title="Eliminar artículo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
