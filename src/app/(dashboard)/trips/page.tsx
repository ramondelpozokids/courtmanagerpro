"use client";

import { useEffect, useState } from "react";
import { useTrips } from "@/hooks/useTrips";
import { useAuth } from "@/contexts/AuthContext";
import { canWriteClubData } from "@/lib/permissions";
import {
  Plane,
  Calendar,
  CheckSquare,
  Square,
  CheckCircle,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";
import { useClubBranding } from "@/contexts/ClubDemoContext";

/** Atajos fútbol: 1ª / 2ª / 3ª / entrenamiento */
const FOOTBALL_KIT_PRESETS = [
  {
    itemName: "Camiseta Match Hombre 1ª Equipación 26/27",
    category: "camiseta_juego",
    quantityRequired: 25,
    short: "1ª equipación",
  },
  {
    itemName: "Camiseta Match Hombre 2ª Equipación 26/27",
    category: "camiseta_juego",
    quantityRequired: 25,
    short: "2ª equipación",
  },
  {
    itemName: "Camiseta Match Hombre 3ª Equipación 26/27",
    category: "camiseta_juego",
    quantityRequired: 25,
    short: "3ª equipación",
  },
  {
    itemName: "Equipación entrenamiento (camisetas + pantalones)",
    category: "camiseta_entrenamiento",
    quantityRequired: 30,
    short: "Entrenamiento",
  },
] as const;

export default function TripsPage() {
  const { user, userEmail, isSuperadmin } = useAuth();
  const branding = useClubBranding();
  const { trips, loading, packItem, addPackingItem, removePackingItem } = useTrips();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Equipaje");
  const [newItemQty, setNewItemQty] = useState(1);
  const [addingPreset, setAddingPreset] = useState(false);

  const canWrite = isSuperadmin || canWriteClubData(user?.profile?.role, userEmail);
  const isFootball =
    branding.sport === "football" || branding.slug === "atm" || branding.slug === "rmf";

  useEffect(() => {
    if (!trips.length) {
      setSelectedTripId(null);
      return;
    }
    if (!selectedTripId || !trips.some((t) => t.id === selectedTripId)) {
      setSelectedTripId(trips[0].id);
    }
  }, [trips, selectedTripId]);

  const activeTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  const handlePackToggle = async (
    tripId: string,
    itemId: string,
    currentPacked: boolean
  ) => {
    try {
      await packItem(tripId, itemId, !currentPacked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip || !newItemName.trim()) return;
    await addPackingItem(activeTrip.id, {
      itemName: newItemName.trim(),
      category: newItemCategory,
      quantityRequired: newItemQty,
    });
    setNewItemName("");
    setNewItemQty(1);
    setShowAddItem(false);
  };

  const handleAddKitPreset = async (preset: (typeof FOOTBALL_KIT_PRESETS)[number]) => {
    if (!activeTrip || !canWrite) return;
    const already = activeTrip.packingList.some(
      (pi) => pi.itemName.toLowerCase() === preset.itemName.toLowerCase()
    );
    if (already) {
      alert(`Ya está en la lista: ${preset.short}`);
      return;
    }
    setAddingPreset(true);
    try {
      await addPackingItem(activeTrip.id, {
        itemName: preset.itemName,
        category: preset.category,
        quantityRequired: preset.quantityRequired,
      });
    } finally {
      setAddingPreset(false);
    }
  };

  const handleAddMissingKits = async () => {
    if (!activeTrip || !canWrite) return;
    setAddingPreset(true);
    try {
      const existing = new Set(
        activeTrip.packingList.map((pi) => pi.itemName.toLowerCase())
      );
      for (const preset of FOOTBALL_KIT_PRESETS) {
        const key = preset.itemName.toLowerCase();
        if (existing.has(key)) continue;
        await addPackingItem(activeTrip.id, {
          itemName: preset.itemName,
          category: preset.category,
          quantityRequired: preset.quantityRequired,
        });
        existing.add(key);
      }
    } finally {
      setAddingPreset(false);
    }
  };

  const handleRemoveItem = async (tripId: string, itemId: string) => {
    if (!confirm("¿Eliminar esta prenda del equipaje?")) return;
    await removePackingItem(tripId, itemId);
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Logística de Viajes y Equipaje{" "}
          {branding.sport === "football" ? "· Fútbol" : "ACB"}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Gestión del material deportivo y equipamiento necesario para los partidos
          oficiales fuera de casa.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando itinerarios logísticos...</p>
        </div>
      ) : !activeTrip ? (
        <div className="py-16 text-center text-slate-400">
          <Plane className="h-12 w-12 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-bold">No hay viajes planificados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
              Próximos Partidos Fuera
            </h3>
            <div className="space-y-3">
              {trips.map((trip) => {
                const totalItems = trip.packingList.length;
                const packedItems = trip.packingList.filter((pi) => pi.isPacked).length;
                const percent =
                  totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

                return (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTripId(trip.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      activeTrip.id === trip.id
                        ? "bg-white dark:bg-slate-900 border-orange-500 shadow-sm"
                        : "bg-white/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                          vs {trip.opponent}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Plane className="h-3.5 w-3.5 text-orange-500" /> {trip.destination}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          trip.status === "READY"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                            : "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                        }`}
                      >
                        {trip.status === "READY" ? "Listo" : "Preparando"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                        <span>Equipaje cargado</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-orange-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] bg-orange-100 dark:bg-orange-950/40 text-orange-600 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                  Control de Equipaje
                </span>
                <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100 mt-1.5">
                  Lista de Utilería para {activeTrip.destination}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Salida: {activeTrip.departureDate} — Regreso: {activeTrip.returnDate}
                </p>
              </div>

              {activeTrip.status === "READY" && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-2.5 flex items-center gap-2 text-xs">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <span className="font-bold">Equipaje al 100% Listo</span>
                </div>
              )}
            </div>

            {activeTrip.notes && (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 italic leading-relaxed">
                <strong>Notas de viaje:</strong> &quot;{activeTrip.notes}&quot;
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                  Prendas y petates requeridos:
                </span>
                {canWrite && (
                  <button
                    type="button"
                    onClick={() => setShowAddItem(true)}
                    className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-500"
                  >
                    <Plus className="h-3.5 w-3.5" /> Añadir equipaje
                  </button>
                )}
              </div>

              {canWrite && isFootball && (
                <div className="flex flex-wrap gap-1.5">
                  {FOOTBALL_KIT_PRESETS.map((preset) => (
                    <button
                      key={preset.short}
                      type="button"
                      disabled={addingPreset}
                      onClick={() => void handleAddKitPreset(preset)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:border-orange-400 hover:text-orange-600 disabled:opacity-50"
                    >
                      + {preset.short}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={addingPreset}
                    onClick={() => void handleAddMissingKits()}
                    className="px-2.5 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-[10px] font-bold text-orange-700 hover:bg-orange-100 disabled:opacity-50"
                  >
                    + 1ª · 2ª · 3ª · Entreno
                  </button>
                </div>
              )}

              {showAddItem && (
                <form
                  onSubmit={handleAddItem}
                  className="p-3 rounded-xl border border-orange-200 bg-orange-50/30 dark:bg-orange-950/10 space-y-2"
                >
                  <input
                    type="text"
                    required
                    placeholder="Nombre de la prenda"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      placeholder="Categoría"
                      className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="number"
                      min={1}
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(Number(e.target.value))}
                      className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddItem(false)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-bold bg-orange-500 text-white rounded-lg"
                    >
                      Añadir
                    </button>
                  </div>
                </form>
              )}

              {activeTrip.packingList.map((packItem) => (
                <div
                  key={packItem.id}
                  onClick={() =>
                    handlePackToggle(activeTrip.id, packItem.id, packItem.isPacked)
                  }
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    packItem.isPacked
                      ? "bg-orange-50/20 dark:bg-orange-950/5 border-orange-100 dark:border-orange-950/30"
                      : "bg-white border-slate-150 dark:border-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {packItem.isPacked ? (
                      <CheckSquare className="h-5 w-5 text-orange-500 shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-300 dark:text-slate-700 shrink-0" />
                    )}
                    <div>
                      <h4
                        className={`text-xs font-bold leading-none ${
                          packItem.isPacked
                            ? "text-slate-700 dark:text-slate-300 line-through opacity-70"
                            : "text-slate-850 dark:text-slate-100"
                        }`}
                      >
                        {packItem.itemName}
                      </h4>
                      <span className="text-[10px] text-slate-400 mt-1 block uppercase font-medium tracking-wide">
                        Cat: {packItem.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        packItem.isPacked
                          ? "bg-orange-100/60 text-orange-600 dark:bg-orange-950/35"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                      }`}
                    >
                      {packItem.quantityRequired} unidades
                    </span>
                    {canWrite && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleRemoveItem(activeTrip.id, packItem.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
