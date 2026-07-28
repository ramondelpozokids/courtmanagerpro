"use client";

import { useMedical } from "@/hooks/useMedical";
import { useAuth } from "@/contexts/AuthContext";
import { useClubBranding } from "@/contexts/ClubDemoContext";
import { canAccessMedical, canWriteClubData } from "@/lib/permissions";
import { useMemo, useState } from "react";
import {
  HeartPulse, Calendar, AlertTriangle, CheckCircle, RefreshCw, Minus, Plus, Search, MapPin, BriefcaseMedical, PlusCircle,
} from "lucide-react";

const KIT_OPTIONS_BASKETBALL = [
  { value: "Armario Central", label: "Armario Médico Central", location: "Armario Médico" },
  { value: "Botiquín Partido", label: "Botiquín Partido ACB", location: "Vestuario — Banquillo" },
  { value: "Botiquín Viaje", label: "Botiquín Viaje Euroliga", location: "Almacén Logística" },
  { value: "Fisioterapia", label: "Kit Fisioterapia", location: "Botiquín Fisioterapia" },
  { value: "Vestuario Principal", label: "Nevera Vestuario", location: "Nevera Vestuario" },
] as const;

const KIT_OPTIONS_FOOTBALL = [
  { value: "Armario Central", label: "Armario Médico Central", location: "Armario Médico" },
  { value: "Botiquín Partido", label: "Botiquín Partido LaLiga", location: "Vestuario — Banquillo" },
  { value: "Botiquín Viaje", label: "Botiquín Viaje Champions / Europa", location: "Almacén Logística" },
  { value: "Fisioterapia", label: "Kit Fisioterapia", location: "Botiquín Fisioterapia" },
  { value: "Vestuario Principal", label: "Nevera Vestuario", location: "Nevera Vestuario" },
] as const;

export default function MedicalStockPage() {
  const { user, userEmail, hasOperationalAccess } = useAuth();
  const branding = useClubBranding();
  const isFootball = branding.sport === "football";
  const KIT_OPTIONS = isFootball ? KIT_OPTIONS_FOOTBALL : KIT_OPTIONS_BASKETBALL;
  const KIT_LABELS: Record<string, string> = {
    ALL: "Todos los botiquines",
    ...Object.fromEntries(KIT_OPTIONS.map((k) => [k.value, k.label])),
  };
  const { items, loading, adjustQty, createItem } = useMedical();
  const [search, setSearch] = useState("");
  const [kitFilter, setKitFilter] = useState("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newKit, setNewKit] = useState<string>("");
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
    const fromData = items.map((i) => (i as any).kit || i.location).filter(Boolean);
    const ordered = KIT_OPTIONS.map((k) => k.value);
    const extra = Array.from(new Set(fromData)).filter((k) => !ordered.includes(k as any));
    return ["ALL", ...ordered, ...extra];
  }, [items, KIT_OPTIONS]);

  const openAddForm = () => {
    setNewName("");
    setNewLocation("");
    setNewKit(kitFilter !== "ALL" ? kitFilter : "");
    setNewQty(10);
    setNewMinQty(5);
    setShowAddForm(true);
  };

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

  const botiquinesConContenido = useMemo(
    () =>
      items.filter(
        (i) =>
          Array.isArray((i as any).contents) &&
          (i as any).contents.length > 0 &&
          (/botiquin/i.test(String((i as any).category || "")) ||
            /botiqu[ií]n/i.test(i.name) ||
            /Botiquín/i.test(String((i as any).kit || "")))
      ),
    [items]
  );

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const kitMeta = newKit ? KIT_OPTIONS.find((k) => k.value === newKit) : undefined;
    const location =
      newLocation.trim() ||
      kitMeta?.location ||
      (newKit || "Almacén médico");
    await createItem({
      name: newName.trim(),
      kit: newKit || undefined,
      location,
      quantity: newQty,
      minQuantity: newMinQty,
      expiryDate: newExpiry,
    });
    setNewName("");
    setNewLocation("");
    setNewKit("");
    setShowAddForm(false);
    setKitFilter("ALL");
  };
  if (!hasAccess) {
    return (
      <div className="bg-white dark:bg-slate-900 border rounded-xl py-16 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-amber-500" />
        <p className="text-sm font-bold">Acceso restringido</p>
        <p className="text-sm mt-1 max-w-md mx-auto text-slate-500">
          Material médico: Administrador, utilería, staff médico o Superadmin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            Material Médico y Botiquines {isFootball ? "LaLiga" : "ACB"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {stats.total} referencias · {stats.expired} caducadas · {stats.expiring} próximas a caducar · {stats.lowStock} bajo mínimo
          </p>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            Añadir producto
          </button>
        )}
      </div>

      {botiquinesConContenido.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <BriefcaseMedical className="h-4 w-4 text-orange-500" />
            Contenido de botiquines ({isFootball ? "partido LaLiga · Champions / Europa" : "partido · viaje"})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {botiquinesConContenido.map((kit) => (
              <div
                key={`kit-summary-${kit.id}`}
                className="bg-white dark:bg-slate-900 border border-orange-200/60 dark:border-orange-900/40 rounded-2xl p-5 shadow-sm text-left"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                      {(kit as any).kit || "Botiquín"}
                    </p>
                    <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">{kit.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {kit.location} · Stock {kit.quantity} uds
                    </p>
                  </div>
                  {getStatusBadge(kit.status, kit.expiryDate)}
                </div>
                <ul className="space-y-1.5 max-h-72 overflow-y-auto border-t border-slate-100 dark:border-slate-800 pt-3">
                  {((kit as any).contents as { name: string; qty: number }[]).map((c, idx) => (
                    <li
                      key={`${kit.id}-sum-${idx}`}
                      className="flex items-start justify-between gap-3 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <span className="leading-snug">{c.name}</span>
                      <span className="font-black text-slate-800 dark:text-white shrink-0">×{c.qty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddProduct} className="bg-white dark:bg-slate-900 border rounded-xl p-6 shadow-lg max-w-md w-full space-y-4 text-left">
            <h3 className="font-bold text-base">Nuevo producto médico</h3>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Nombre del producto</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej. Vendas elásticas, suero, hielo…"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Ubicación (libre)</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Ej. Armario médico, vestuario, nevera…"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Botiquín (opcional)</label>
              <select
                value={newKit}
                onChange={(e) => setNewKit(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="">Sin botiquín — solo producto</option>
                {KIT_OPTIONS.map((k) => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Puedes añadir el producto suelto. El botiquín es opcional.
              </p>
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
                  {Array.isArray((item as any).contents) && (item as any).contents.length > 0 && (
                    <div className="mt-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Contenido del botiquín
                      </p>
                      <ul className="space-y-1 max-h-40 overflow-y-auto">
                        {((item as any).contents as { name: string; qty: number }[]).map((c, idx) => (
                          <li
                            key={`${item.id}-c-${idx}`}
                            className="flex items-start justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-300"
                          >
                            <span className="leading-snug">{c.name}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100 shrink-0">
                              ×{c.qty}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
