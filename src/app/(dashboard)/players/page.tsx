"use client";

import { usePlayers } from "@/hooks/usePlayers";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveTeamId, useClubBranding } from "@/contexts/ClubDemoContext";
import PlayerCard from "@/components/players/PlayerCard";
import PlayerForm from "@/components/players/PlayerForm";
import StaffForm, { type StaffFormData } from "@/components/players/StaffForm";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { db } from "@/infrastructure/supabase/repositories/InMemoryDB";
import { persistDemoDb } from "@/lib/demo-persistence";
import { apiPlayerToFormValues } from "@/lib/player-form-mapper";
import { canWriteClubData } from "@/lib/permissions";
import { usesProductionClubData } from "@/lib/club-preview";
import { getClubPack } from "@/data/clubs";
import { groupPlayersByPosition } from "@/lib/player-sort";
import type { Player } from "@/types";
import type { Player as FormPlayer } from "@/domain/entities/Player";
import {
  PlusCircle, Search, User, Filter, RefreshCw, Globe, Pencil, Trash2, ExternalLink,
} from "lucide-react";
import { normalizeStaffProfile } from "@/lib/player-profile";
import { resolveAtmPackStaffPhoto } from "@/lib/atm-pack-photos";
import { RMB_OFFICIAL_SOURCE, RMB_OFFICIAL_SYNCED_AT } from "@/data/rmb-official-roster";
import { RMF_OFFICIAL_PLANTILLA_URL } from "@/data/clubs/rmf-data";
import { ATM_OFFICIAL_PLANTILLA_URL, resolveAtmStaffProfileUrl } from "@/data/clubs/atm-data";
import { UpdateOfficialRosterButton } from "@/components/roster/UpdateOfficialRosterButton";

type StaffMember = StaffFormData & {
  id: string;
  photo_url?: string | null;
  trajectory?: string;
  trajectory_items?: string[];
  palmares?: string[];
  birth_date?: string;
  birth_place?: string;
  profile_url?: string;
};

const OFFICIAL_PLANTILLA_URL = RMB_OFFICIAL_SOURCE;

export default function PlayersPage() {
  const { user, userEmail, hasOperationalAccess } = useAuth();
  const branding = useClubBranding();
  const teamId = useActiveTeamId();
  const {
    players,
    loading,
    createPlayerFromForm,
    updatePlayerFromForm,
    deletePlayer,
  } = usePlayers(teamId);

  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<FormPlayer | null>(null);

  const [activeTab, setActiveTab] = useState<"players" | "staff">("players");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const canWrite = hasOperationalAccess || canWriteClubData(user?.profile?.role, userEmail);
  const productionClub = usesProductionClubData();
  const applyOfficialRoster = branding.slug === "rmb";

  const mapStaffRows = useCallback(
    (rows: Record<string, unknown>[]) =>
      rows
        .map((s) => {
          const normalized = normalizeStaffProfile(s, { applyOfficialRoster }) as StaffMember | null;
          if (!normalized) return null;
          if (branding.slug === "atm") {
            const photo = resolveAtmPackStaffPhoto({
              fullName: normalized.full_name,
              photo_url: normalized.photo_url,
            });
            const pack = getClubPack("atm");
            const packHit = (pack.coachingStaff || []).find((p: { full_name?: string }) => {
              const a = (normalized.full_name || "")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();
              const b = (p.full_name || "")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();
              // Exact match only — avoid "Diego Pablo Simeone" ↔ "Pablo Vercellone"
              return a === b;
            }) as Record<string, unknown> | undefined;
            return {
              ...normalized,
              photo_url: photo || normalized.photo_url,
              birth_date: (normalized.birth_date || packHit?.birth_date || undefined) as string | undefined,
              birth_place: (normalized.birth_place || packHit?.birth_place || undefined) as string | undefined,
              trajectory: (normalized.trajectory || packHit?.trajectory || undefined) as string | undefined,
              profile_url: resolveAtmStaffProfileUrl(
                normalized.profile_url,
                typeof packHit?.profile_url === "string" ? packHit.profile_url : null
              ),
              role: String(packHit?.role || normalized.role),
            } as StaffMember;
          }
          return normalized;
        })
        .filter(Boolean) as StaffMember[],
    [applyOfficialRoster, branding.slug]
  );

  const loadStaff = useCallback(async () => {
    if (productionClub) {
      try {
        const res = await fetch(`/api/coaching-staff?team_id=${encodeURIComponent(teamId)}`, {
          credentials: "include",
        });
        const json = await res.json().catch(() => ({}));
        let rows: Record<string, unknown>[] = Array.isArray(json.data) ? json.data : [];
        if (rows.length === 0) {
          const pack = getClubPack(branding.slug);
          rows = (pack.coachingStaff || []) as Record<string, unknown>[];
        }
        // Preferir IDs canónicos ATM (8008) antes de deduplicar por nombre
        rows = [...rows].sort((a, b) => {
          const idA = String(a.id || "");
          const idB = String(b.id || "");
          const score = (id: string) => (id.includes("8008-") ? 0 : 1);
          return score(idA) - score(idB);
        });
        const mapped = mapStaffRows(rows);
        // Dedupe por nombre (p.ej. filas 8005 + 8008 o sync duplicado)
        const seen = new Set<string>();
        setStaff(
          mapped.filter((m) => {
            const key = (m.full_name || "")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .trim();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
          })
        );
      } catch (err) {
        console.error("Error cargando cuerpo técnico:", err);
        const pack = getClubPack(branding.slug);
        setStaff(mapStaffRows((pack.coachingStaff || []) as Record<string, unknown>[]));
      }
      return;
    }
    setStaff(mapStaffRows(db.coachingStaff as Record<string, unknown>[]));
  }, [productionClub, teamId, branding.slug, mapStaffRows]);

  useEffect(() => {
    void loadStaff();
    const onChange = () => void loadStaff();
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

  const staffEmailDomain =
    branding.slug === "atm"
      ? "atleticodemadrid.com"
      : branding.slug === "rmf" || branding.slug === "rmb"
        ? "realmadrid.com"
        : "club.local";

  const defaultStaffProfileUrl =
    branding.slug === "atm"
      ? ATM_OFFICIAL_PLANTILLA_URL
      : branding.slug === "rmf"
        ? RMF_OFFICIAL_PLANTILLA_URL
        : branding.slug === "rmb"
          ? OFFICIAL_PLANTILLA_URL
          : "";

  const handleSaveStaff = async (data: StaffFormData) => {
    if (productionClub) {
      try {
        if (editingStaff?.id) {
          const res = await fetch(`/api/coaching-staff/${editingStaff.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Error al guardar");
        } else {
          const res = await fetch("/api/coaching-staff", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              ...data,
              team_id: teamId,
              email: `${data.full_name.toLowerCase().replace(/\s/g, "")}@${staffEmailDomain}`,
            }),
          });
          if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Error al crear");
        }
        await loadStaff();
        setShowStaffForm(false);
        setEditingStaff(null);
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Error al guardar staff");
      }
      return;
    }

    if (editingStaff?.id) {
      const idx = db.coachingStaff.findIndex((s) => s.id === editingStaff.id);
      if (idx !== -1) {
        db.coachingStaff[idx] = { ...db.coachingStaff[idx], ...data };
      }
    } else {
      db.coachingStaff.push({
        id: `c_${Math.random().toString(36).slice(2, 9)}`,
        email: `${data.full_name.toLowerCase().replace(/\s/g, "")}@${staffEmailDomain}`,
        profile_url: data.profile_url || defaultStaffProfileUrl || undefined,
        ...data,
      });
    }
    persistDemoDb();
    void loadStaff();
    setShowStaffForm(false);
    setEditingStaff(null);
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("¿Eliminar a este miembro del cuerpo técnico?")) return;
    if (productionClub) {
      try {
        const res = await fetch(`/api/coaching-staff/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Error al eliminar");
        await loadStaff();
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Error al eliminar staff");
      }
      return;
    }
    db.coachingStaff = db.coachingStaff.filter((s) => s.id !== id);
    persistDemoDb();
    void loadStaff();
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

  const playerGroups = useMemo(
    () => groupPlayersByPosition(filteredPlayers, branding.sport),
    [filteredPlayers, branding.sport]
  );

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
            {branding.slug === 'rmb'
              ? `Datos oficiales realmadrid.com · ${branding.venue}${RMB_OFFICIAL_SYNCED_AT ? ` · sync ${new Date(RMB_OFFICIAL_SYNCED_AT).toLocaleDateString('es-ES')}` : ''}`
              : `${branding.name} · ${branding.venue} · ${branding.league}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {branding.slug === 'rmb' && (
            <UpdateOfficialRosterButton
              onDone={() => {
                void loadStaff();
                window.location.reload();
              }}
            />
          )}
          <a
            href={
              branding.slug === 'atm'
                ? ATM_OFFICIAL_PLANTILLA_URL
                : branding.sport === 'football'
                ? RMF_OFFICIAL_PLANTILLA_URL
                : OFFICIAL_PLANTILLA_URL
            }
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

      {branding.slug === 'rmb' && (
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300">
        Jugadores y cuerpo técnico se sincronizan automáticamente al iniciar la app (y cada 24 h) desde la{' '}
        <a href={OFFICIAL_PLANTILLA_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-orange-700 dark:text-orange-400 underline-offset-2 hover:underline">
          plantilla oficial del Real Madrid
        </a>
        . También puedes forzar una actualización con el botón «Actualizar plantilla oficial».
      </div>
      )}
      {branding.slug === 'rmf' && (
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300">
        Demo comercial del <strong>primer equipo de fútbol</strong> — plantilla, utilería, viajes y lavandería adaptados a LaLiga / Champions.
        Plantilla de referencia:{' '}
        <a href={RMF_OFFICIAL_PLANTILLA_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-700 dark:text-blue-400 underline-offset-2 hover:underline">
          realmadrid.com/futbol
        </a>
        .
      </div>
      )}

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
            defaultProfileUrl={defaultStaffProfileUrl}
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
                {branding.sport === 'football' ? (
                  <>
                    <option value="portero">Porteros</option>
                    <option value="defensa">Defensas</option>
                    <option value="centrocampista">Centrocampistas</option>
                    <option value="delantero">Delanteros</option>
                  </>
                ) : (
                  <>
                    <option value="base">Bases</option>
                    <option value="escolta">Escoltas</option>
                    <option value="alero">Aleros</option>
                    <option value="ala-pivot">Ala-Pívots</option>
                    <option value="pivot">Pívots</option>
                  </>
                )}
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
          <div className="space-y-8">
            {playerGroups.map((group) => (
              <section key={group.key} className="space-y-3">
                <div className="flex items-baseline justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                    {group.label}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {group.players.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.players.map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      canWrite={canWrite}
                      onEdit={handleEditPlayer}
                      onDelete={deletePlayer}
                    />
                  ))}
                </div>
              </section>
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
                    <img
                      src={member.photo_url}
                      alt={member.full_name}
                      className={`h-full w-full object-cover${
                        /bonvicini/i.test(member.photo_url || "") ? " object-[32%_40%]" : ""
                      }`}
                    />
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
                  {(member.birth_place || member.birth_date) && (
                    <p className="text-[10px] text-slate-500 mt-1 truncate">
                      {[
                        member.birth_date?.includes("-")
                          ? member.birth_date.split("-").reverse().join("/")
                          : member.birth_date,
                        member.birth_place,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
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
                <Link
                  href={`/players/staff/${member.id}`}
                  className="flex-1 text-center py-2 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-slate-800 text-orange-600 text-xs font-bold"
                >
                  Ver Ficha
                </Link>
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
    </div>
  );
}
