"use client";

import { useMedical } from "@/hooks/useMedical";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessMedical, canWriteClubData } from "@/lib/permissions";
import { useMemo, useState } from "react";
import {
  HeartPulse, Calendar, AlertTriangle, CheckCircle, RefreshCw, Minus, Plus, Search, MapPin, BriefcaseMedical, PlusCircle,
} from "lucide-react";

const KIT_LABELS: Record<string, string> = {
  ALL: "Todos los botiquines",
  "Botiquín Partido": "Botiquín Partido ACB",
  "Botiquín Viaje": "Botiquín Viaje Euroliga",
  "Fisioterapia": "Kit Fisioterapia",
  "Vestuario Principal": "Nevera Vestuario",
  "Armario Central": "Armario Médico Central",
};

export default function MedicalStockPage() {
  const { user, userEmail, hasOperationalAccess } = useAuth();
  const { items, loading, adjustQty, createItem } = useMedical();
  const [search, setSearch] = useState("");
  const [kitFilter, setKitFilter] = useState("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("Armario Médico Central");
  const [newQty, setNewQty] = useState(10);
  const [newMinQty, setNewMinQty] = useState(5);
  const [newExpiry, setNewExpiry] = useState("2027-12-31");

  const role = user?.profile?.role;
  const hasAccess = hasOperationalAccess || canAccessMedical(role, userEmail);
  const canEdit = hasOperationalAccess || canWriteClubData(role, userEmail) || role === "medical";

  const stats = useMemo(() => ({
    total: items.length,
    expired: items.filter((i) => i.status === "EXPIRED").length,
    expiring: items.filter((i) => i.status === "EXPIRING_SOON").length,
    lowStock: items.filter((i) => i.quantity <= i.minQuantity).length,
  }), [items]);

  const kits = useMemo(() => {
    const set = new Set(items.map((i) => (i as any).kit || i.location));
    return ["ALL", ...Array.from(set)];
  }, [items]);

  const getStatusBadge = (status: string, expiry: string) => {
    if (status === "EXPIRED") {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-600 uppercase flex items-center gap-1 w-fit">
          <AlertTriangle className="h-3 w-3" /> Caducado
        </span>
      );
    }
    if (status === "EXPIRING_SOON") {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-600 uppercase flex items-center gap-1 w-fit animate-pulse">
          <AlertTriangle className="h-3 w-3" /> Caduca pronto ({expiry})
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-600 uppercase flex items-center gap-1 w-fit">
        <CheckCircle className="h-3 w-3" /> OK
      </span>
    );
  };

  const filteredItems = items.filter((item) => {
    const kit = (item as any).kit || item.location;
    const matchesKit = kitFilter === "ALL" || kit === kitFilter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      ((item as any).category || "").toLowerCase().includes(search.toLowerCase());
    return matchesKit && matchesSearch;
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await createItem({
      name: newName.trim(),
      location: newLocation,
      quantity: newQty,
      minQuantity: newMinQty,
      expiryDate: newExpiry,
    });
    setNewName("");
    setShowAddForm(false);
  };

  if (!hasAccess) {
    return (
      <div className="bg-white dark:bg-slate-900 border rounded-xl py-16 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-amber-500" />
        <p className="text-sm font-bold">Acceso restringido</p>
        <p className="text-sm mt-1 max-w-md mx-auto text-slate-500">
          Material médico: Administrador, Carlos Kobe (utilería), staff médico o Superadmin Ramón del Pozo Rott.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Material Médico y Botiquines ACB</h2>
          <p className="text-sm text-slate-500 mt-1">
            {stats.total} referencias · {stats.expired} caducadas · {stats.expiring} próximas a caducar · {stats.lowStock} bajo mínimo
          </p>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            Añadir producto
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddProduct} className="bg-white dark:bg-slate-900 border rounded-xl p-6 shadow-lg max-w-md w-full space-y-4 text-left">
            <h3 className="font-bold text-base">Nuevo producto médico</h3>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Nombre</label>
              <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Ubicación / Botiquín</label>
              <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Stock inicial</label>
                <input type="number" min={0} value={newQty} onChange={(e) => setNewQty(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Stock mínimo</label>
                <input type="number" min={0} value={newMinQty} onChange={(e) => setNewMinQty(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Fecha de caducidad</label>
              <input type="date" value={newExpiry} onChange={(e) => setNewExpiry(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-2 text-xs font-bold text-slate-500">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold">Guardar</button>
            </div>
          </form>
        </div>
      )}

      {/* Stats kits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Referencias", value: stats.total, icon: BriefcaseMedical },
          { label: "Caducadas", value: stats.expired, icon: AlertTriangle, warn: true },
          { label: "Próx. caducidad", value: stats.expiring, icon: Calendar, warn: true },
          { label: "Bajo mínimo", value: stats.lowStock, icon: HeartPulse, warn: true },
        ].map(({ label, value, icon: Icon, warn }) => (
          <div key={label} className="bg-white dark:bg-slate-900 border rounded-xl p-4">
            <Icon className={`h-5 w-5 mb-1 ${warn && value > 0 ? "text-amber-500" : "text-orange-500"}`} />
            <span className="text-xs font-bold text-slate-400 uppercase">{label}</span>
            <p className={`text-xl font-black ${warn && value > 0 ? "text-amber-600" : ""}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filtros botiquín */}
      <div className="flex flex-wrap gap-1.5">
        {kits.map((kit) => (
          <button
            key={kit}
            type="button"
            onClick={() => setKitFilter(kit)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              kitFilter === kit ? "bg-orange-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600"
            }`}
          >
            {KIT_LABELS[kit] || kit}
          </button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar vendas, fármacos, botiquines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
        />
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-sm font-semibold text-slate-400">Cargando material sanitario...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 text-left">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-2 border-b pb-3">
                  <HeartPulse className="h-5 w-5 text-red-500 shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-sm leading-snug">{item.name}</h3>
                    <span className="text-xs text-slate-400">Lote {item.batchNumber} · {(item as any).brand || "—"}</span>
                    {(item as any).kit && (
                      <span className="text-xs text-orange-600 font-bold block mt-0.5">{(item as any).kit}</span>
                    )}
                  </div>
                </div>
                <div className="my-3 space-y-2 text-sm">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-400">Estado</span>
                    {getStatusBadge(item.status, item.expiryDate)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Caducidad</span>
                    <span className="font-bold flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {item.expiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ubicación</span>
                    <span className="font-bold flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-orange-500" /> {item.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stock</span>
                    <span className={`font-extrabold ${item.quantity <= item.minQuantity ? "text-amber-500" : "text-emerald-600"}`}>
                      {item.quantity} uds (mín. {item.minQuantity})
                    </span>
                  </div>
                  {(item as any).prescription_required && (
                    <p className="text-xs text-red-500 font-bold">⚕ Requiere prescripción médica</p>
                  )}
                </div>
              </div>
              {canEdit && (
                <div className="pt-3 border-t flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Ajustar stock</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => adjustQty(item.id, item.quantity - 1)} disabled={item.quantity === 0} className="p-1 rounded bg-slate-100 dark:bg-slate-800 disabled:opacity-30">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-extrabold w-8 text-center">{item.quantity}</span>
                    <button type="button" onClick={() => adjustQty(item.id, item.quantity + 1)} className="p-1 rounded bg-slate-100 dark:bg-slate-800">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
