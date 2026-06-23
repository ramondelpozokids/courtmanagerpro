"use client";

import { useMemo, useState, useEffect } from "react";
import { db } from "@/infrastructure/supabase/repositories/InMemoryDB";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { canWriteClubData } from "@/lib/permissions";
import { persistDemoDb } from "@/lib/demo-persistence";
import { usesDemoClubData, usesProductionClubData } from "@/lib/club-preview";
import {
  loadProductionSizing,
  saveProductionPlayerSizes,
  saveProductionStaffSizes,
} from "@/lib/sizing-production";
import {
  DEFAULT_SIZING_PRODUCTS,
  SIZING_CATEGORY_LABELS,
  mergeSizingCatalog,
  normalizeSizes,
  staffToSizes,
  sizesToStaffFields,
  type SizingCategory,
  type SizingProduct,
} from "@/content/sizing-products";
import {
  ArrowLeft, Users, ShieldCheck, Search, Ruler,
  Trash2, Edit2, Plus, X, PackagePlus, Layers, ChevronDown,
} from "lucide-react";

function saveSizingDemo() {
  persistDemoDb();
}

const ALL_CATEGORIES: (SizingCategory | "ALL")[] = [
  "ALL", "equipacion", "entrenamiento", "calzado", "accesorios", "viaje",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function initPlayers(catalog: SizingProduct[]) {
  return db.players.map((p) => ({
    ...p,
    sizes: normalizeSizes(p.sizes, catalog),
  }));
}

function initStaff(catalog: SizingProduct[]) {
  return db.coachingStaff.map((s) => ({
    ...s,
    ...sizesToStaffFields(staffToSizes(s, catalog)),
  }));
}

function propagateNewProduct(product: SizingProduct, catalog: SizingProduct[]) {
  const defaultVal = product.defaultSize || "—";
  db.players = db.players.map((p) => ({
    ...p,
    sizes: { ...normalizeSizes(p.sizes, catalog), [product.id]: defaultVal },
  }));
  db.coachingStaff = db.coachingStaff.map((s) => {
    const sizes = { ...staffToSizes(s, catalog), [product.id]: defaultVal };
    return { ...s, ...sizesToStaffFields(sizes) };
  });
}

export default function SizingTablePage() {
  const { user, userEmail, isSuperadmin } = useAuth();
  const canWrite = isSuperadmin || canWriteClubData(user?.profile?.role, userEmail);

  const [catalogVersion, setCatalogVersion] = useState(0);
  const [customProducts, setCustomProducts] = useState<SizingProduct[]>([]);

  const catalog = useMemo(
    () => (usesProductionClubData() ? mergeSizingCatalog(customProducts) : mergeSizingCatalog(db.customSizingProducts)),
    [catalogVersion, customProducts]
  );

  const [activeTab, setActiveTab] = useState<"players" | "staff">("players");
  const [categoryFilter, setCategoryFilter] = useState<SizingCategory | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState(() => initPlayers(catalog));
  const [staff, setStaff] = useState(() => initStaff(catalog));

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editingType, setEditingType] = useState<"player" | "staff">("player");
  const [editSizes, setEditSizes] = useState<Record<string, string>>({});

  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerNumber, setNewPlayerNumber] = useState(10);
  const [newPlayerPosition, setNewPlayerPosition] = useState("base");
  const [newPlayerNationality, setNewPlayerNationality] = useState("España");

  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Entrenador Ayudante");
  const [newStaffNationality, setNewStaffNationality] = useState("España");

  const [newProductName, setNewProductName] = useState("");
  const [newProductShort, setNewProductShort] = useState("");
  const [newProductCategory, setNewProductCategory] = useState<SizingCategory>("accesorios");
  const [newProductDefault, setNewProductDefault] = useState("XL");
  const [newProductInputType, setNewProductInputType] = useState<"text" | "number">("text");

  const visibleProducts = useMemo(
    () =>
      categoryFilter === "ALL"
        ? catalog
        : catalog.filter((p) => p.category === categoryFilter),
    [catalog, categoryFilter]
  );

  const positionLabels: Record<string, string> = {
    base: "Base (PG)",
    escolta: "Escolta (SG)",
    alero: "Alero (SF)",
    ala_pivot: "Ala-Pívot (PF)",
    pivot: "Pívot (C)",
  };

  const filteredPlayers = players.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      String(p.number).includes(search) ||
      p.position.toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredStaff = staff.filter((s) =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  const refreshFromDb = async () => {
    if (usesProductionClubData()) {
      try {
        const data = await loadProductionSizing();
        setPlayers(data.players);
        setStaff(data.staff);
        setCustomProducts(data.customProducts);
        setCatalogVersion((v) => v + 1);
      } catch (err) {
        console.error('Error cargando tallas:', err);
      }
      return;
    }
    const cat = mergeSizingCatalog(db.customSizingProducts);
    setPlayers(initPlayers(cat));
    setStaff(initStaff(cat));
    setCatalogVersion((v) => v + 1);
  };

  const refreshAndSave = () => {
    if (usesDemoClubData()) saveSizingDemo();
    void refreshFromDb();
  };

  useEffect(() => {
    void refreshFromDb();
    const onChange = () => void refreshFromDb();
    window.addEventListener("club-demo-changed", onChange);
    window.addEventListener("demo-db-changed", onChange);
    return () => {
      window.removeEventListener("club-demo-changed", onChange);
      window.removeEventListener("demo-db-changed", onChange);
    };
  }, []);

  const handleDeletePlayer = (id: string) => {
    if (confirm("¿Eliminar a este jugador de la plantilla oficial?")) {
      db.players = db.players.filter((p) => p.id !== id);
      refreshAndSave();
    }
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm("¿Eliminar a este miembro del cuerpo técnico?")) {
      db.coachingStaff = db.coachingStaff.filter((s) => s.id !== id);
      refreshAndSave();
    }
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const id = "p_" + Math.random().toString(36).substr(2, 5);
    const names = newPlayerName.split(" ");
    const firstName = names[0] || "Nuevo";
    const lastName = names.slice(1).join(" ") || "Jugador";
    const sizes = normalizeSizes({}, catalog);

    const newP = {
      id,
      firstName,
      lastName,
      number: newPlayerNumber,
      position: newPlayerPosition,
      status: "ACTIVE",
      sizes,
      nationality: newPlayerNationality,
      birthDate: "1998-05-10",
    };

    db.players.push(newP);
    refreshAndSave();
    setShowAddPlayerModal(false);
    setNewPlayerName("");
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const id = "c_" + Math.random().toString(36).substr(2, 5);
    const sizes = normalizeSizes({}, catalog);
    const newS = {
      id,
      full_name: newStaffName,
      role: newStaffRole,
      email: `${newStaffName.toLowerCase().replace(/\s/g, "")}@realmadrid.com`,
      nationality: newStaffNationality,
      ...sizesToStaffFields(sizes),
    };

    db.coachingStaff.push(newS);
    refreshAndSave();
    setShowAddStaffModal(false);
    setNewStaffName("");
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const id = slugify(newProductName);
    if (!id) return;
    if (catalog.some((p) => p.id === id)) {
      alert("Ya existe un producto con ese nombre.");
      return;
    }

    const product: SizingProduct = {
      id,
      label: newProductName,
      shortLabel: newProductShort || newProductName.slice(0, 8),
      category: newProductCategory,
      inputType: newProductInputType,
      defaultSize: newProductDefault,
      custom: true,
    };

    db.customSizingProducts.push(product);
    const updatedCatalog = mergeSizingCatalog(db.customSizingProducts);
    propagateNewProduct(product, updatedCatalog);
    refreshAndSave();
    setShowAddProductModal(false);
    setNewProductName("");
    setNewProductShort("");
    setNewProductDefault("XL");
  };

  const handleRemoveCustomProduct = (productId: string) => {
    if (!confirm("¿Eliminar este producto del catálogo de tallas?")) return;
    db.customSizingProducts = db.customSizingProducts.filter((p) => p.id !== productId);
    refreshAndSave();
  };

  const handleOpenEdit = (item: any, type: "player" | "staff") => {
    setEditingType(type);
    setEditingItem({ ...item });
    const sizes =
      type === "player"
        ? normalizeSizes(item.sizes, catalog)
        : staffToSizes(item, catalog);
    setEditSizes(sizes);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usesProductionClubData()) {
      try {
        if (editingType === "player") {
          await saveProductionPlayerSizes(editingItem.id, editSizes, catalog);
        } else {
          await saveProductionStaffSizes(editingItem.id, editSizes, catalog);
        }
        await refreshFromDb();
        setShowEditModal(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Error al guardar');
      }
      return;
    }
    if (editingType === "player") {
      const idx = db.players.findIndex((p) => p.id === editingItem.id);
      if (idx !== -1) {
        db.players[idx] = { ...editingItem, sizes: editSizes };
      }
    } else {
      const idx = db.coachingStaff.findIndex((s) => s.id === editingItem.id);
      if (idx !== -1) {
        db.coachingStaff[idx] = {
          ...editingItem,
          ...sizesToStaffFields(editSizes),
        };
      }
    }
    refreshAndSave();
    setShowEditModal(false);
  };

  const renderSizeCell = (sizes: Record<string, string>, product: SizingProduct) => {
    const val = sizes[product.id] || "—";
    const isShoe = product.category === "calzado";
    return (
      <td
        key={product.id}
        className={`p-3 text-center font-extrabold whitespace-nowrap ${isShoe ? "text-orange-600" : "text-slate-750 dark:text-slate-350"}`}
        title={`${product.label}: ${val}`}
      >
        {val}
      </td>
    );
  };

  const productsByCategory = useMemo(() => {
    const groups: Record<string, SizingProduct[]> = {};
    for (const p of catalog) {
      (groups[p.category] ||= []).push(p);
    }
    return groups;
  }, [catalog]);

  return (
    <div className="space-y-6 text-left max-w-[100vw] animate-in fade-in duration-150">
      {/* Top bar */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Link>
        {canWrite && (
          <button
            type="button"
            onClick={() => setShowAddProductModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:border-orange-900/40 text-xs font-bold text-orange-700 dark:text-orange-400 transition-all"
          >
            <PackagePlus className="h-4 w-4" />
            Añadir Producto o Accesorio
          </button>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-orange-100 dark:bg-orange-950/40 rounded-2xl text-orange-600 border border-orange-200/40 shrink-0">
          <Ruler className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Fichas de Tallas y Plantilla Oficial
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Catálogo completo de equipación RMB 25/26 — {catalog.length} productos ({DEFAULT_SIZING_PRODUCTS.length} oficiales
            {db.customSizingProducts.length > 0 ? ` + ${db.customSizingProducts.length} personalizados` : ""})
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl">
        <Layers className="h-4 w-4 text-orange-500 self-center ml-1 shrink-0" />
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
              categoryFilter === cat
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {cat === "ALL" ? "Todos" : SIZING_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Tabs & search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800/40 shrink-0">
          <button
            type="button"
            onClick={() => { setActiveTab("players"); setSearch(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "players"
                ? "bg-white dark:bg-slate-800 text-orange-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="h-4 w-4" />
            Jugadores ({players.length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("staff"); setSearch(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "staff"
                ? "bg-white dark:bg-slate-800 text-orange-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Cuerpo Técnico ({staff.length})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === "players" ? "Buscar por dorsal o nombre..." : "Buscar por nombre o rol..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent"
            />
          </div>
          {canWrite && (
            <button
              type="button"
              onClick={() => (activeTab === "players" ? setShowAddPlayerModal(true) : setShowAddStaffModal(true))}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-md w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              {activeTab === "players" ? "Añadir Jugador" : "Añadir Staff"}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {activeTab === "players" ? (
            <table className="w-full border-collapse text-xs text-left min-w-max">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-150 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3 sticky left-0 z-10 bg-slate-50 dark:bg-slate-800/95">Foto</th>
                  <th className="p-3 sticky left-10 z-10 bg-slate-50 dark:bg-slate-800/95 min-w-[140px]">Jugador</th>
                  <th className="p-3 text-center">Dorsal</th>
                  <th className="p-3 min-w-[100px]">Posición</th>
                  {visibleProducts.map((p) => (
                    <th key={p.id} className="p-3 text-center whitespace-nowrap" title={p.label}>
                      {p.shortLabel}
                      {p.custom && <span className="text-orange-400 ml-0.5">*</span>}
                    </th>
                  ))}
                  {canWrite && <th className="p-3 text-right sticky right-0 bg-slate-50 dark:bg-slate-800/95">Opc.</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPlayers.map((p) => {
                  const fullName = `${p.firstName} ${p.lastName}`;
                  const sizes = normalizeSizes(p.sizes, catalog);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 sticky left-0 bg-white dark:bg-slate-900 z-[1]">
                        <div className="h-9 w-8 rounded-md overflow-hidden bg-slate-100 border flex items-center justify-center">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={fullName} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-orange-600">{p.firstName[0]}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-bold sticky left-10 bg-white dark:bg-slate-900 z-[1] whitespace-nowrap">{fullName}</td>
                      <td className="p-3 text-center">
                        <span className="text-xs bg-orange-50 px-2 py-0.5 rounded font-black text-orange-600">#{p.number}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-550 capitalize">{positionLabels[p.position] || p.position}</td>
                      {visibleProducts.map((prod) => renderSizeCell(sizes, prod))}
                      {canWrite && (
                        <td className="p-3 text-right sticky right-0 bg-white dark:bg-slate-900">
                          <div className="flex justify-end gap-1">
                            <button type="button" onClick={() => handleOpenEdit(p, "player")} className="p-1.5 text-slate-400 hover:text-orange-500" title="Editar todas las tallas">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => handleDeletePlayer(p.id)} className="p-1.5 text-slate-400 hover:text-red-500" title="Eliminar">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full border-collapse text-xs text-left min-w-max">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 border-b text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-3 sticky left-0 bg-slate-50 dark:bg-slate-800/95">Foto</th>
                  <th className="p-3 sticky left-10 bg-slate-50 dark:bg-slate-800/95 min-w-[140px]">Nombre</th>
                  <th className="p-3">Cargo</th>
                  {visibleProducts.map((p) => (
                    <th key={p.id} className="p-3 text-center whitespace-nowrap" title={p.label}>{p.shortLabel}</th>
                  ))}
                  {canWrite && <th className="p-3 text-right sticky right-0 bg-slate-50 dark:bg-slate-800/95">Opc.</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStaff.map((s) => {
                  const sizes = staffToSizes(s, catalog);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-3 sticky left-0 bg-white dark:bg-slate-900">
                        <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-100 border flex items-center justify-center">
                          {s.photo_url ? (
                            <img src={s.photo_url} alt={s.full_name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-orange-600">{s.full_name[0]}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-bold sticky left-10 bg-white dark:bg-slate-900 whitespace-nowrap">{s.full_name}</td>
                      <td className="p-3 font-bold text-orange-500">{s.role}</td>
                      {visibleProducts.map((prod) => renderSizeCell(sizes, prod))}
                      {canWrite && (
                        <td className="p-3 text-right sticky right-0 bg-white dark:bg-slate-900">
                          <div className="flex justify-end gap-1">
                            <button type="button" onClick={() => handleOpenEdit(s, "staff")} className="p-1.5 text-slate-400 hover:text-orange-500">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => handleDeleteStaff(s.id)} className="p-1.5 text-slate-400 hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-[9px] text-slate-400 px-4 py-2 border-t border-slate-100 dark:border-slate-800">
          Desplaza horizontalmente para ver todas las tallas · Productos con * son personalizados por utilería
        </p>
      </div>

      {/* Edit modal — todas las categorías */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-5 border-b flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-extrabold text-sm">Modificar Tallas de Utilería</h3>
                <p className="text-[10px] text-slate-400">
                  {editingItem.firstName
                    ? `${editingItem.firstName} ${editingItem.lastName}`
                    : editingItem.full_name}{" "}
                  — {catalog.length} productos
                </p>
              </div>
              <button type="button" onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              {(Object.keys(SIZING_CATEGORY_LABELS) as SizingCategory[]).map((cat) => {
                const products = productsByCategory[cat];
                if (!products?.length) return null;
                return (
                  <div key={cat}>
                    <p className="text-[10px] font-black uppercase text-orange-600 tracking-wider mb-2 flex items-center gap-1">
                      <ChevronDown className="h-3 w-3" />
                      {SIZING_CATEGORY_LABELS[cat]}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {products.map((product) => (
                        <div key={product.id}>
                          <label className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5 truncate" title={product.label}>
                            {product.label}
                          </label>
                          <input
                            type={product.inputType === "number" ? "number" : "text"}
                            value={editSizes[product.id] || ""}
                            onChange={(e) =>
                              setEditSizes((prev) => ({ ...prev, [product.id]: e.target.value }))
                            }
                            className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-bold"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-5 border-t shrink-0">
              <button type="submit" className="w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold">
                Guardar Cambios de Talla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add product modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddProduct}
            className="bg-white dark:bg-slate-900 border rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
          >
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm">Nuevo Producto de Talla</h3>
                <p className="text-[10px] text-slate-400">Como en la tienda oficial RMB — Carlos puede ampliar el catálogo</p>
              </div>
              <button type="button" onClick={() => setShowAddProductModal(false)} className="text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Nombre del producto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mochila Euroliga, Gorro lana..."
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Etiqueta corta (columna)</label>
                  <input
                    type="text"
                    placeholder="Ej: Mochila"
                    value={newProductShort}
                    onChange={(e) => setNewProductShort(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Talla por defecto</label>
                  <input
                    type="text"
                    value={newProductDefault}
                    onChange={(e) => setNewProductDefault(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-xs mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Categoría</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as SizingCategory)}
                    className="w-full px-3 py-2 border rounded-lg text-xs mt-1"
                  >
                    {(Object.keys(SIZING_CATEGORY_LABELS) as SizingCategory[]).map((c) => (
                      <option key={c} value={c}>{SIZING_CATEGORY_LABELS[c]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Tipo de medida</label>
                  <select
                    value={newProductInputType}
                    onChange={(e) => setNewProductInputType(e.target.value as "text" | "number")}
                    className="w-full px-3 py-2 border rounded-lg text-xs mt-1"
                  >
                    <option value="text">Texto (S, M, L, XL…)</option>
                    <option value="number">Numérico (calzado)</option>
                  </select>
                </div>
              </div>
              {db.customSizingProducts.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Productos personalizados</p>
                  <ul className="space-y-1 max-h-24 overflow-y-auto">
                    {db.customSizingProducts.map((p) => (
                      <li key={p.id} className="flex justify-between items-center text-xs">
                        <span>{p.label}</span>
                        <button type="button" onClick={() => handleRemoveCustomProduct(p.id)} className="text-red-500 text-[10px] font-bold">Eliminar</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button type="submit" className="w-full py-2.5 rounded-lg bg-orange-500 text-white text-xs font-bold mt-2">
                Añadir al Catálogo de Tallas
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add player modal — simplified */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddPlayer} className="bg-white dark:bg-slate-900 border rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-5 border-b flex justify-between">
              <h3 className="font-extrabold text-sm">Alta de Jugador</h3>
              <button type="button" onClick={() => setShowAddPlayerModal(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <div className="p-5 space-y-3">
              <input type="text" required placeholder="Nombre completo" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" required placeholder="Dorsal" value={newPlayerNumber} onChange={(e) => setNewPlayerNumber(Number(e.target.value))} className="px-3 py-2 border rounded-lg text-xs" />
                <select value={newPlayerPosition} onChange={(e) => setNewPlayerPosition(e.target.value)} className="px-3 py-2 border rounded-lg text-xs">
                  <option value="base">Base</option><option value="escolta">Escolta</option><option value="alero">Alero</option>
                  <option value="ala_pivot">Ala-Pívot</option><option value="pivot">Pívot</option>
                </select>
              </div>
              <input type="text" required placeholder="Nacionalidad" value={newPlayerNationality} onChange={(e) => setNewPlayerNationality(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" />
              <p className="text-[10px] text-slate-400">Las tallas se inicializan con valores por defecto del catálogo ({catalog.length} productos).</p>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-orange-500 text-white text-xs font-bold">Dar de Alta</button>
            </div>
          </form>
        </div>
      )}

      {/* Add staff modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddStaff} className="bg-white dark:bg-slate-900 border rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-5 border-b flex justify-between">
              <h3 className="font-extrabold text-sm">Alta de Staff</h3>
              <button type="button" onClick={() => setShowAddStaffModal(false)}><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <div className="p-5 space-y-3">
              <input type="text" required placeholder="Nombre completo" value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" />
              <input type="text" required placeholder="Cargo / Rol" value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" />
              <input type="text" required placeholder="Nacionalidad" value={newStaffNationality} onChange={(e) => setNewStaffNationality(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" />
              <button type="submit" className="w-full py-2.5 rounded-lg bg-orange-500 text-white text-xs font-bold">Dar de Alta</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
