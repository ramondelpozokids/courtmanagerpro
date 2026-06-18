"use client";

import { usePlayers } from "@/hooks/usePlayers";
import { useAuth } from "@/contexts/AuthContext";
import PlayerCard from "@/components/players/PlayerCard";
import PlayerForm from "@/components/players/PlayerForm";
import { useState, useEffect } from "react";
import { PlusCircle, Search, User, Filter, RefreshCw, Shirt, Landmark, Globe, X, Trophy, Calendar } from "lucide-react";

export default function PlayersPage() {
  const { user } = useAuth();
  const { players, loading, createPlayer, updatePlayer } = usePlayers();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Tab state: "players" or "staff"
  const [activeTab, setActiveTab] = useState<"players" | "staff">("players");
  const [staff, setStaff] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

  // Search and filter states
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const canWrite = ["admin", "equipment_manager", "assistant"].includes(user?.profile?.role || "assistant");

  // Fetch coaching staff
  useEffect(() => {
    if (activeTab === "staff") {
      const fetchStaff = async () => {
        try {
          setStaffLoading(true);
          const res = await fetch("/api/coaching-staff");
          if (res.ok) {
            const data = await res.json();
            setStaff(data.data || []);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setStaffLoading(false);
        }
      };
      fetchStaff();
    }
  }, [activeTab]);

  const handleCreatePlayer = async (playerData: any) => {
    try {
      await createPlayer(playerData);
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePlayer = async (id: string) => {
    try {
      await updatePlayer(id, { is_active: false });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPlayers = players.filter((p) => {
    const fullName = (p.full_name || "").toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) || String(p.dorsal) === search;
    
    // Position labels
    const matchesPosition = positionFilter === "ALL" || p.position === positionFilter.toLowerCase();
    
    // Status maps to boolean is_active
    const matchesStatus = statusFilter === "ALL" || 
                          (statusFilter === "ACTIVE" && p.is_active) ||
                          (statusFilter === "INACTIVE" && !p.is_active);

    return matchesSearch && matchesPosition && matchesStatus;
  });

  const filteredStaff = staff.filter((s) => {
    return s.full_name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Plantilla y Personal RMB</h2>
          <p className="text-xs text-slate-400 mt-1">Fichas técnicas de utilería, tallas y equipamiento asignado para el Real Madrid Baloncesto.</p>
        </div>
        {canWrite && activeTab === "players" && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/15"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            Añadir Jugador
          </button>
        )}
      </div>

      {/* Tabs Selector Toggle */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => { setActiveTab("players"); setSearch(""); }}
          className={`px-5 py-2.5 text-xs font-bold transition-all border-b-2 ${
            activeTab === "players"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Jugadores del Primer Equipo ({players.length})
        </button>
        <button
          onClick={() => { setActiveTab("staff"); setSearch(""); }}
          className={`px-5 py-2.5 text-xs font-bold transition-all border-b-2 ${
            activeTab === "staff"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Cuerpo Técnico ({staff.length || 8})
        </button>
      </div>

      {/* Modal form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
            <PlayerForm onSubmit={handleCreatePlayer} onClose={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      {/* Filters bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === "players" ? "Buscar por dorsal o nombre..." : "Buscar por nombre del staff..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {activeTab === "players" && (
          <>
            {/* Position Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg p-2 focus:outline-none text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">Todas las Posiciones</option>
                <option value="PG">Bases (PG)</option>
                <option value="SG">Escoltas (SG)</option>
                <option value="SF">Aleros (SF)</option>
                <option value="PF">Ala-Pívots (PF)</option>
                <option value="C">Pívots (C)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg p-2 focus:outline-none text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="ACTIVE">Activo / Disponible</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Content Render */}
      {activeTab === "players" ? (
        loading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
            <p className="text-xs font-semibold">Cargando plantilla profesional...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-16 text-center text-slate-400">
            <User className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No se encontraron jugadores</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                canWrite={canWrite}
                onDelete={deletePlayer}
              />
            ))}
          </div>
        )
      ) : (
        staffLoading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
            <p className="text-xs font-semibold">Cargando personal técnico del Real Madrid...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-16 text-center text-slate-400">
            <User className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No se encontraron miembros del staff</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Header banner */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start gap-4 text-left">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-100 border border-orange-200 shrink-0 flex items-center justify-center font-bold text-orange-600 text-sm">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.full_name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{member.full_name[0]}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-none flex items-center gap-1.5">
                      <span>{member.full_name}</span>
                    </h3>
                    <p className="text-xs text-orange-500 font-semibold mt-1">{member.role}</p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Globe className="h-3 w-3 text-slate-400" /> Nacionalidad: {member.nationality || "España"}
                    </p>
                  </div>
                </div>

                {/* Sizing Details */}
                <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-900/40 text-left">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Medidas Técnicas</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Chaqueta</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{member.shirt_size || "L"}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Pantalón</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{member.shorts_size || "L"}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Calzado</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{member.shoe_size || "43"}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between gap-2">
                  <button
                    onClick={() => setSelectedStaff(member)}
                    className="flex-1 text-center py-2 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-orange-600 dark:text-orange-400 text-xs font-bold transition-all"
                  >
                    Ver Ficha Completa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Coaching Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            {/* Header / Banner */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start gap-4 text-left">
              <div className="flex gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-100 border-2 border-orange-200 shrink-0 flex items-center justify-center">
                  {selectedStaff.photo_url ? (
                    <img src={selectedStaff.photo_url} alt={selectedStaff.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-orange-600">{selectedStaff.full_name[0]}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg leading-none">
                    {selectedStaff.full_name}
                  </h3>
                  <p className="text-xs text-orange-500 font-bold mt-1.5">{selectedStaff.role}</p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Nacionalidad: {selectedStaff.nationality || "España"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-left max-h-[70vh] overflow-y-auto">
              {/* Personal Data (Birth) */}
              {(selectedStaff.birth_place || selectedStaff.birth_date) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Datos Personales
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-350 space-y-1.5">
                    {selectedStaff.birth_date && (
                      <p><strong>Fecha de nacimiento:</strong> {selectedStaff.birth_date.split("-").reverse().join("/")}</p>
                    )}
                    {selectedStaff.birth_place && (
                      <p><strong>Lugar de nacimiento:</strong> {selectedStaff.birth_place}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Medidas de Utilería */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shirt className="h-4 w-4 text-slate-400" />
                  Medidas de Utilería
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wide">Chaqueta</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100 block mt-0.5">{selectedStaff.shirt_size || "L"}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wide">Pantalón</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100 block mt-0.5">{selectedStaff.shorts_size || "L"}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wide">Calzado</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100 block mt-0.5">{selectedStaff.shoe_size || "43"}</span>
                  </div>
                </div>
              </div>

              {/* Trajectory */}
              {selectedStaff.trajectory && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Landmark className="h-4 w-4 text-slate-400" />
                    Trayectoria Profesional
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
                    {selectedStaff.trajectory}
                  </div>
                </div>
              )}

              {/* Palmares */}
              {selectedStaff.palmares && selectedStaff.palmares.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="h-4 w-4 text-orange-500" />
                    Palmarés de Trofeos
                  </h4>
                  <div className="bg-orange-50/15 dark:bg-orange-950/5 border border-orange-100 dark:border-orange-950/20 p-3.5 rounded-xl space-y-1.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {selectedStaff.palmares.map((achievement: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-md shadow-orange-500/10 transition-colors"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
