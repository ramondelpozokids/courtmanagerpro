"use client";

import { usePlayers } from "@/hooks/usePlayers";
import { useAuth } from "@/contexts/AuthContext";
import { useClubBranding } from "@/contexts/ClubDemoContext";
import PlayerCard from "@/components/players/PlayerCard";
import PlayerForm from "@/components/players/PlayerForm";
import StaffForm, { type StaffFormData } from "@/components/players/StaffForm";
import { useState, useEffect, useCallback } from "react";
import { db } from "@/infrastructure/supabase/repositories/InMemoryDB";
import { persistDemoDb } from "@/lib/demo-persistence";
import { apiPlayerToFormValues } from "@/lib/player-form-mapper";
import { canWriteClubData } from "@/lib/permissions";
import type { Player } from "@/types";
import type { Player as FormPlayer } from "@/domain/entities/Player";
import {
  PlusCircle, Search, User, Filter, RefreshCw, Shirt, Landmark, Globe, X, Trophy, Calendar, Pencil, Trash2, ExternalLink,
} from "lucide-react";
import { normalizeStaffProfile } from "@/lib/player-profile";
import { RMB_OFFICIAL_SOURCE, RMB_OFFICIAL_SYNCED_AT } from "@/data/rmb-official-roster";

type StaffMember = StaffFormData & { id: string; photo_url?: string | null; trajectory?: string; palmares?: string[]; birth_date?: string; birth_place?: string; profile_url?: string };

const OFFICIAL_PLANTILLA_URL = RMB_OFFICIAL_SOURCE;

export default function PlayersPage() {
  const { user, currentTeam, userEmail, hasOperationalAccess } = useAuth();
  const branding = useClubBranding();
  const {
    players,
    loading,
    createPlayerFromForm,
    updatePlayerFromForm,
    deletePlayer,
  } = usePlayers(currentTeam?.id);

  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<FormPlayer | null>(null);

  const [activeTab, setActiveTab] = useState<"players" | "staff">("players");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const canWrite = hasOperationalAccess || canWriteClubData(user?.profile?.role, userEmail);

  const loadStaff = useCallback(() => {
    setStaff(
      db.coachingStaff.map((s) => normalizeStaffProfile(s) as StaffMember).filter(Boolean) as StaffMember[]
    );
  }, []);

  useEffect(() => {
    loadStaff();
    const onChange = () => loadStaff();
    window.addEventListener("club-demo-changed", onChange);
    window.addEventListener("demo-db-changed", onChange);
    return () => {
      window.removeEventListener("club-demo-changed", onChange);
      window.removeEventListener("demo-db-changed", onChange);
    };
  }, [loadStaff]);

  const handleSavePlayer = async (playerData: Omit<FormPlayer, "id">) => {
    try {
      if (editingPlayer?.id) {
        await updatePlayerFromForm(editingPlayer.id, { ...playerData, id: editingPlayer.id });
      } else {
        await createPlayerFromForm(playerData);
      }
      setShowPlayerForm(false);
      setEditingPlayer(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(apiPlayerToFormValues(player));
    setShowPlayerForm(true);
  };

  const handleSaveStaff = (data: StaffFormData) => {
    if (editingStaff?.id) {
      const idx = db.coachingStaff.findIndex((s) => s.id === editingStaff.id);
      if (idx !== -1) {
        db.coachingStaff[idx] = { ...db.coachingStaff[idx], ...data };
      }
    } else {
      db.coachingStaff.push({
        id: `c_${Math.random().toString(36).slice(2, 9)}`,
        email: `${data.full_name.toLowerCase().replace(/\s/g, "")}@club.local`,
        ...data,
      });
    }
    persistDemoDb();
    loadStaff();
    setShowStaffForm(false);
    setEditingStaff(null);
  };

  const handleDeleteStaff = (id: string) => {
    if (!confirm("¿Eliminar a este miembro del cuerpo técnico?")) return;
    db.coachingStaff = db.coachingStaff.filter((s) => s.id !== id);
    persistDemoDb();
    loadStaff();
    if (selectedStaff?.id === id) setSelectedStaff(null);
  };

  const filteredPlayers = players.filter((p) => {
    const fullName = (p.full_name || "").toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      String(p.dorsal) === search;
    const matchesPosition =
      positionFilter === "ALL" ||
      p.position === positionFilter.toLowerCase() ||
      p.position === positionFilter.toLowerCase().replace("_", "-");
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && p.is_active) ||
      (statusFilter === "INACTIVE" && !p.is_active);
    return matchesSearch && matchesPosition && matchesStatus;
  });

  const filteredStaff = staff.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase())
  );

  const openAddPlayer = () => {
    setEditingPlayer(null);
    setShowPlayerForm(true);
  };

  const openAddStaff = () => {
    setEditingStaff(null);
    setShowStaffForm(true);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Plantilla y Personal — {branding.shortName}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Datos oficiales realmadrid.com · {branding.venue}
            {RMB_OFFICIAL_SYNCED_AT ? ` · sync ${new Date(RMB_OFFICIAL_SYNCED_AT).toLocaleDateString('es-ES')}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={OFFICIAL_PLANTILLA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold hover:border-orange-400 hover:text-orange-600 transition-all"
          >
            Plantilla oficial
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          {canWrite && (
            <button
              onClick={activeTab === "players" ? openAddPlayer : openAddStaff}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/15"
            >
              <PlusCircle className="h-4.5 w-4.5" />
              {activeTab === "players" ? "Añadir Jugador" : "Añadir Staff"}
            </button>
          )}
        </div>
      </div>

      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300">
        Jugadores y cuerpo técnico se sincronizan desde la{' '}
        <a href={OFFICIAL_PLANTILLA_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-orange-700 dark:text-orange-400 underline-offset-2 hover:underline">
          plantilla oficial del Real Madrid
        </a>
        {' '}(imagen, ficha, trayectoria y palmarés). Para actualizar: <code className="text-[11px] bg-white/70 dark:bg-slate-900/60 px-1.5 py-0.5 rounded">npm run sync:rm-plantilla</code>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => { setActiveTab("players"); setSearch(""); }}
          className={`px-5 py-2.5 text-xs font-bold transition-all border-b-2 ${
            activeTab === "players" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Jugadores ({players.length})
        </button>
        <button
          onClick={() => { setActiveTab("staff"); setSearch(""); }}
          className={`px-5 py-2.5 text-xs font-bold transition-all border-b-2 ${
            activeTab === "staff" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Cuerpo Técnico ({staff.length})
        </button>
      </div>

      {showPlayerForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
            <PlayerForm
              initialValues={editingPlayer ?? undefined}
              onSubmit={handleSavePlayer}
              onClose={() => { setShowPlayerForm(false); setEditingPlayer(null); }}
            />
          </div>
        </div>
      )}

      {showStaffForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <StaffForm
            initialValues={editingStaff ?? undefined}
            onSubmit={handleSaveStaff}
            onClose={() => { setShowStaffForm(false); setEditingStaff(null); }}
          />
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-3">
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
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg p-2 focus:outline-none text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">Todas las Posiciones</option>
                <option value="base">Bases</option>
                <option value="escolta">Escoltas</option>
                <option value="alero">Aleros</option>
                <option value="ala-pivot">Ala-Pívots</option>
                <option value="pivot">Pívots</option>
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg p-2 focus:outline-none text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
            </select>
          </>
        )}
      </div>

      {activeTab === "players" ? (
        loading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
            <p className="text-xs font-semibold">Cargando plantilla...</p>
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
                onEdit={handleEditPlayer}
                onDelete={deletePlayer}
              />
            ))}
          </div>
        )
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
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start gap-4 text-left">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-100 border border-orange-200 shrink-0 flex items-center justify-center font-bold text-orange-600 text-sm">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <span>{member.full_name[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-none">{member.full_name}</h3>
                  <p className="text-xs text-orange-500 font-semibold mt-1">{member.role}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Globe className="h-3 w-3" /> {member.nationality || "España"}
                  </p>
                </div>
              </div>

              <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-900/40 text-left">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Medidas Técnicas</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border">
                    <span className="text-[9px] text-slate-400 block">Chaqueta</span>
                    <span className="text-xs font-bold">{member.shirt_size || "L"}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border">
                    <span className="text-[9px] text-slate-400 block">Pantalón</span>
                    <span className="text-xs font-bold">{member.shorts_size || "L"}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border">
                    <span className="text-[9px] text-slate-400 block">Calzado</span>
                    <span className="text-xs font-bold">{member.shoe_size || "43"}</span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
                <button
                  onClick={() => setSelectedStaff(member)}
                  className="flex-1 text-center py-2 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-slate-800 text-orange-600 text-xs font-bold"
                >
                  Ver Ficha
                </button>
                {canWrite && (
                  <>
                    <button
                      onClick={() => { setEditingStaff(member); setShowStaffForm(true); }}
                      className="p-2 rounded-lg text-slate-400 hover:text-orange-500"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedStaff && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
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
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg leading-none">{selectedStaff.full_name}</h3>
                  <p className="text-xs text-orange-500 font-bold mt-1.5">{selectedStaff.role}</p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Nacionalidad: {selectedStaff.nationality || "España"}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-left max-h-[70vh] overflow-y-auto">
              {(selectedStaff.birth_place || selectedStaff.birth_date) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> Datos Personales
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border text-xs space-y-1.5">
                    {selectedStaff.birth_date && (
                      <p><strong>Fecha de nacimiento:</strong> {selectedStaff.birth_date.split("-").reverse().join("/")}</p>
                    )}
                    {selectedStaff.birth_place && (
                      <p><strong>Lugar de nacimiento:</strong> {selectedStaff.birth_place}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shirt className="h-4 w-4" /> Medidas de Utilería
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Chaqueta</span>
                    <span className="text-sm font-black block mt-0.5">{selectedStaff.shirt_size || "L"}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Pantalón</span>
                    <span className="text-sm font-black block mt-0.5">{selectedStaff.shorts_size || "L"}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Calzado</span>
                    <span className="text-sm font-black block mt-0.5">{selectedStaff.shoe_size || "43"}</span>
                  </div>
                </div>
              </div>

              {selectedStaff.trajectory && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Landmark className="h-4 w-4" /> Trayectoria
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border text-xs leading-relaxed max-h-36 overflow-y-auto">
                    {selectedStaff.trajectory}
                  </div>
                </div>
              )}

              {selectedStaff.palmares && selectedStaff.palmares.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="h-4 w-4 text-orange-500" /> Palmarés
                  </h4>
                  <div className="bg-orange-50/15 border border-orange-100 p-3.5 rounded-xl space-y-1.5">
                    {selectedStaff.palmares.map((achievement, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t flex justify-end gap-2">
              {selectedStaff.profile_url && (
                <a
                  href={selectedStaff.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Ver en realmadrid.com
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {canWrite && (
                <button
                  onClick={() => { setEditingStaff(selectedStaff); setShowStaffForm(true); setSelectedStaff(null); }}
                  className="px-4 py-2 rounded-lg border border-orange-200 text-orange-600 text-xs font-bold"
                >
                  Editar
                </button>
              )}
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
