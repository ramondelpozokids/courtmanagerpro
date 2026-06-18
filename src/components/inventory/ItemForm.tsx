"use client";

import { InventoryItem, ItemCategory } from "@/domain/entities/InventoryItem";
import { useState } from "react";
import { X } from "lucide-react";

interface ItemFormProps {
  onSubmit: (itemData: Omit<InventoryItem, "id" | "lastUpdated">) => void;
  onClose?: () => void;
  initialValues?: InventoryItem;
}

export default function ItemForm({ onSubmit, onClose, initialValues }: ItemFormProps) {
  const [name, setName] = useState(initialValues?.name || "");
  const [sku, setSku] = useState(initialValues?.sku || "");
  const [category, setCategory] = useState<ItemCategory>(initialValues?.category || "UNIFORM");
  const [stock, setStock] = useState<number>(initialValues?.stock || 0);
  const [minStock, setMinStock] = useState<number>(initialValues?.minStock || 5);
  const [location, setLocation] = useState(initialValues?.location || "Almacén Principal");
  const [size, setSize] = useState(initialValues?.size || "XL");
  const [price, setPrice] = useState<number>(initialValues?.price || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) {
      alert("Por favor introduce nombre y SKU de utilería");
      return;
    }
    onSubmit({
      name,
      sku,
      category,
      stock: Number(stock),
      minStock: Number(minStock),
      location,
      size,
      price: Number(price),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg max-w-2xl mx-auto space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">
          {initialValues ? "Modificar Item de Utilería" : "Agregar Nuevo Item al Inventario"}
        </h3>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Nombre del Item</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            placeholder="Camiseta Oficial ACB Local 25/26"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">SKU / Referencia</label>
          <input
            type="text"
            required
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            placeholder="TS-HOME-2526"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-850 dark:text-slate-100"
          >
            <option value="UNIFORM">UNIFORME — Competición Oficial</option>
            <option value="TRAINING">ENTRENAMIENTO — Prendas de pista</option>
            <option value="FOOTWEAR">ZAPATILLAS — Calzado Técnico</option>
            <option value="MEDICAL">BOTIQUÍN — Material Médico</option>
            <option value="ACCESSORY">ACCESORIO — Toallas, bolsas, botellas</option>
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Stock Inicial</label>
          <input
            type="number"
            min="0"
            required
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            placeholder="50"
          />
        </div>

        {/* Min Stock */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Stock de Alerta Mínimo</label>
          <input
            type="number"
            min="0"
            required
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            placeholder="10"
          />
        </div>

        {/* Size */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Talla</label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            placeholder="XL"
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Precio Unitario (€)</label>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            placeholder="85"
          />
        </div>

        {/* Location */}
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Ubicación Física</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 dark:text-slate-100"
            placeholder="Almacén Principal (Estantería B)"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/10"
        >
          {initialValues ? "Guardar Cambios" : "Añadir Item"}
        </button>
      </div>
    </form>
  );
}
