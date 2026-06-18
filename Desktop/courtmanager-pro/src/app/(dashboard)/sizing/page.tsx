"use client";

import React, { useState } from "react";
import { db } from "@/infrastructure/supabase/repositories/InMemoryDB";
import { 
  Shirt, Table, ArrowLeft, Users, ShieldCheck, Search, Ruler, 
  Trash2, Edit2, Plus, X, CheckCircle, PackagePlus 
} from "lucide-react";
import Link from "next/link";

export default function SizingTablePage() {
  const [activeTab, setActiveTab] = useState<"players" | "staff">("players");
  const [search, setSearch] = useState("");

  // Reactive state synced with db
  const [players, setPlayers] = useState<any[]>([...db.players]);
  const [staff, setStaff] = useState<any[]>([...db.coachingStaff]);

  // Modal controls
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editingType, setEditingItemType] = useState<"player" | "staff">("player");

  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // New Player Form States
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerNumber, setNewPlayerNumber] = useState(10);
  const [newPlayerPosition, setNewPlayerPosition] = useState("base");
  const [newPlayerNationality, setNewPlayerNationality] = useState("España");
  const [newPlayerJersey, setNewPlayerJersey] = useState("XL");
  const [newPlayerShorts, setNewPlayerShorts] = useState("XL");
  const [newPlayerShoes, setNewPlayerShoes] = useState("46");

  // New Staff Form States
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Entrenador Ayudante");
  const [newStaffNationality, setNewStaffNationality] = useState("España");
  const [newStaffJersey, setNewStaffJersey] = useState("L");
  const [newStaffShorts, setNewStaffShorts] = useState("L");
  const [newStaffShoes, setNewStaffShoes] = useState("43");

  const positionLabels: Record<string, string> = {
    base: "Base (PG)",
    escolta: "Escolta (SG)",
    alero: "Alero (SF)",
    ala_pivot: "Ala-Pívot (PF)",
    pivot: "Pívot (C)"
  };

  // Filter lists
  const filteredPlayers = players.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || String(p.number).includes(search) || p.position.toLowerCase().includes(search.toLowerCase());
  });

  const filteredStaff = staff.filter((s) => {
    return s.full_name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase());
  });

  // Handlers: Delete Player
  const handleDeletePlayer = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar a este jugador de la plantilla oficial?")) {
      db.players = db.players.filter(p => p.id !== id);
      setPlayers([...db.players]);
    }
  };

  // Handlers: Delete Staff
  const handleDeleteStaff = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar a este miembro del cuerpo técnico?")) {
      db.coachingStaff = db.coachingStaff.filter(s => s.id !== id);
      setStaff([...db.coachingStaff]);
    }
  };

  // Handlers: Add Player
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const id = "p_" + Math.random().toString(36).substr(2, 5);
    const names = newPlayerName.split(" ");
    const firstName = names[0] || "Nuevo";
    const lastName = names.slice(1).join(" ") || "Jugador";

    const newP = {
      id,
      firstName,
      lastName,
      number: newPlayerNumber,
      position: newPlayerPosition,
      status: "ACTIVE",
      sizes: {
        jersey: newPlayerJersey,
        shorts: newPlayerShorts,
        shoes: newPlayerShoes,
        socks: "L",
        warmupShirt: newPlayerJersey
      },
      nationality: newPlayerNationality,
      birthDate: "1998-05-10"
    };

    db.players.push(newP);
    setPlayers([...db.players]);
    setShowAddPlayerModal(false);
    setNewPlayerName("");
  };

  // Handlers: Add Staff
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const id = "c_" + Math.random().toString(36).substr(2, 5);
    const newS = {
      id,
      full_name: newStaffName,
      role: newStaffRole,
      email: `${newStaffName.toLowerCase().replace(" ", "")}@realmadrid.com`,
      shirt_size: newStaffJersey,
      shorts_size: newStaffShorts,
      shoe_size: Number(newStaffShoes) || 43,
      nationality: newStaffNationality
    };

    db.coachingStaff.push(newS);
    setStaff([...db.coachingStaff]);
    setShowAddStaffModal(false);
    setNewStaffName("");
  };

  // Handlers: Edit sizes
  const handleOpenEdit = (item: any, type: "player" | "staff") => {
    setEditingItemType(type);
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType === "player") {
      const idx = db.players.findIndex(p => p.id === editingItem.id);
      if (idx !== -1) {
        db.players[idx] = { ...editingItem };
        setPlayers([...db.players]);
      }
    } else {
      const idx = db.coachingStaff.findIndex(s => s.id === editingItem.id);
      if (idx !== -1) {
        db.coachingStaff[idx] = { ...editingItem };
        setStaff([...db.coachingStaff]);
      }
    }
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* Back link */}
      <div className="flex justify-between items-center">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Link>
        <Link 
          href="/inventory"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-350"
        >
          <PackagePlus className="h-4 w-4 text-orange-500" />
          Añadir Producto o Accesorio
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 dark:bg-orange-950/40 rounded-2xl text-orange-600 border border-orange-200/40 shrink-0">
            <Ruler className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Fichas de Tallas y Plantilla Oficial</h2>
            <p className="text-xs text-slate-400 mt-1">Gestión integral del tallaje, altas y bajas de jugadores y cuerpo técnico (Carlos Rodriguez Kobe).</p>
          </div>
        </div>
      </div>

      {/* Selector Tabs & Add Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        {/* Tab switcher */}
        <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-800/40 shrink-0">
          <button
            onClick={() => { setActiveTab("players"); setSearch(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "players"
                ? "bg-white dark:bg-slate-800 text-orange-600 shadow-sm border border-slate-100 dark:border-slate-700/50"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Jugadores ({players.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab("staff"); setSearch(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "staff"
                ? "bg-white dark:bg-slate-800 text-orange-600 shadow-sm border border-slate-100 dark:border-slate-700/50"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Cuerpo Técnico ({staff.length})</span>
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === "players" ? "Buscar por dorsal o nombre..." : "Buscar por nombre o rol..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <button
            onClick={() => activeTab === "players" ? setShowAddPlayerModal(true) : setShowAddStaffModal(true)}
            className="flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold transition-all shadow-md w-full sm:w-auto shrink-0"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>{activeTab === "players" ? "Añadir Jugador" : "Añadir Staff"}</span>
          </button>
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {activeTab === "players" ? (
          filteredPlayers.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <p className="text-sm font-bold">No se encontraron jugadores que coincidan con la búsqueda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-150 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Foto</th>
                    <th className="p-4">Jugador</th>
                    <th className="p-4 text-center">Dorsal</th>
                    <th className="p-4">Posición</th>
                    <th className="p-4 text-center">Camiseta</th>
                    <th className="p-4 text-center">Pantalón</th>
                    <th className="p-4 text-center">Calzado</th>
                    <th className="p-4 text-center">Chaqueta</th>
                    <th className="p-4 text-right">Opciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPlayers.map((p) => {
                    const fullName = `${p.firstName} ${p.lastName}`;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 shrink-0">
                          <div className="h-10 w-9 rounded-md overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={fullName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-orange-600">{p.firstName[0]}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-850 dark:text-slate-200 whitespace-nowrap">
                          {fullName}
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-xs bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded font-black text-orange-600">
                            #{p.number}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-550 dark:text-slate-400 capitalize">
                          {positionLabels[p.position] || p.position}
                        </td>
                        <td className="p-4 text-center font-extrabold text-slate-750 dark:text-slate-350">
                          {p.sizes.jersey || "XL"}
                        </td>
                        <td className="p-4 text-center font-extrabold text-slate-750 dark:text-slate-350">
                          {p.sizes.shorts || "XL"}
                        </td>
                        <td className="p-4 text-center font-black text-orange-600">
                          {p.sizes.shoes || "46"}
                        </td>
                        <td className="p-4 text-center font-extrabold text-slate-750 dark:text-slate-350">
                          {p.sizes.warmupShirt || "XXL"}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(p, "player")}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
                              title="Editar tallas"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePlayer(p.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                              title="Eliminar jugador"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          filteredStaff.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <p className="text-sm font-bold">No se encontraron miembros del staff que coincidan con la búsqueda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-150 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Foto</th>
                    <th className="p-4">Nombre Completo</th>
                    <th className="p-4">Cargo</th>
                    <th className="p-4">Nacionalidad</th>
                    <th className="p-4 text-center">Chaqueta / Chaquetón</th>
                    <th className="p-4 text-center">Pantalón Chándal</th>
                    <th className="p-4 text-center">Calzado</th>
                    <th className="p-4 text-right">Opciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStaff.map((s) => {
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 shrink-0">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            {s.photo_url ? (
                              <img src={s.photo_url} alt={s.full_name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-orange-600">{s.full_name[0]}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-850 dark:text-slate-200 whitespace-nowrap">
                          {s.full_name}
                        </td>
                        <td className="p-4 font-bold text-orange-500">
                          {s.role}
                        </td>
                        <td className="p-4 font-medium text-slate-450 dark:text-slate-400">
                          {s.nationality || "España"}
                        </td>
                        <td className="p-4 text-center font-extrabold text-slate-750 dark:text-slate-350">
                          {s.shirt_size || s.sizes?.jersey || "L"}
                        </td>
                        <td className="p-4 text-center font-extrabold text-slate-750 dark:text-slate-350">
                          {s.shorts_size || s.sizes?.shorts || "L"}
                        </td>
                        <td className="p-4 text-center font-black text-orange-600">
                          {s.shoe_size || s.sizes?.shoes || "43"}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(s, "staff")}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
                              title="Editar tallas"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(s.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                              title="Eliminar staff"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddPlayer} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-left">
              <div>
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">Alta de Jugador en Plantilla</h3>
                <p className="text-[10px] text-slate-400 font-medium">Formulario oficial de utilería para nuevos jugadores</p>
              </div>
              <button type="button" onClick={() => setShowAddPlayerModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Nombre Completo</label>
                  <input type="text" required value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Dorsal</label>
                  <input type="number" required value={newPlayerNumber} onChange={(e) => setNewPlayerNumber(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Posición</label>
                  <select value={newPlayerPosition} onChange={(e) => setNewPlayerPosition(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-xs">
                    <option value="base">Base</option>
                    <option value="escolta">Escolta</option>
                    <option value="alero">Alero</option>
                    <option value="ala_pivot">Ala-Pívot</option>
                    <option value="pivot">Pívot</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Nacionalidad</label>
                  <input type="text" required value={newPlayerNationality} onChange={(e) => setNewPlayerNationality(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs" />
                </div>
                <div className="col-span-2 border-t border-slate-100 dark:border-slate-800 pt-3 flex gap-3 text-center">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block">Camiseta</label>
                    <input type="text" required value={newPlayerJersey} onChange={(e) => setNewPlayerJersey(e.target.value)} className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-bold" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block">Pantalón</label>
                    <input type="text" required value={newPlayerShorts} onChange={(e) => setNewPlayerShorts(e.target.value)} className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-bold" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block">Zapatillas</label>
                    <input type="text" required value={newPlayerShoes} onChange={(e) => setNewPlayerShoes(e.target.value)} className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-bold" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all mt-4">
                Dar de Alta Jugador
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddStaff} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-left">
              <div>
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">Alta de Miembro de Staff</h3>
                <p className="text-[10px] text-slate-400 font-medium">Formulario de registro para el Cuerpo Técnico</p>
              </div>
              <button type="button" onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Nombre Completo</label>
                  <input type="text" required value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Cargo / Rol</label>
                  <input type="text" required value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Nacionalidad</label>
                  <input type="text" required value={newStaffNationality} onChange={(e) => setNewStaffNationality(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs" />
                </div>
                <div className="col-span-2 border-t border-slate-100 dark:border-slate-800 pt-3 flex gap-3 text-center">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block">Camiseta</label>
                    <input type="text" required value={newStaffJersey} onChange={(e) => setNewStaffJersey(e.target.value)} className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-bold" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block">Pantalón</label>
                    <input type="text" required value={newStaffShorts} onChange={(e) => setNewStaffShorts(e.target.value)} className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-bold" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block">Zapatillas</label>
                    <input type="text" required value={newStaffShoes} onChange={(e) => setNewStaffShoes(e.target.value)} className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-bold" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all mt-4">
                Dar de Alta Staff
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sizing Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-left">
              <div>
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">Modificar Tallas de Utilería</h3>
                <p className="text-[10px] text-slate-400 font-medium">Asignación para {editingItem.firstName ? `${editingItem.firstName} ${editingItem.lastName}` : editingItem.full_name}</p>
              </div>
              <button type="button" onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-left">
              {editingType === "player" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="col-span-2 text-left">
                      <p className="text-xs font-bold text-slate-650 dark:text-slate-300">Medidas del Jugador:</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block text-left">Camiseta / Jersey</label>
                      <input
                        type="text"
                        required
                        value={editingItem.sizes.jersey || ""}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          sizes: { ...editingItem.sizes, jersey: e.target.value }
                        })}
                        className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-extrabold text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block text-left">Pantalón Corto</label>
                      <input
                        type="text"
                        required
                        value={editingItem.sizes.shorts || ""}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          sizes: { ...editingItem.sizes, shorts: e.target.value }
                        })}
                        className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-extrabold text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block text-left">Número Calzado</label>
                      <input
                        type="text"
                        required
                        value={editingItem.sizes.shoes || ""}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          sizes: { ...editingItem.sizes, shoes: e.target.value }
                        })}
                        className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-extrabold text-slate-850 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block text-left">Chaqueta Chándal</label>
                      <input
                        type="text"
                        required
                        value={editingItem.sizes.warmupShirt || ""}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          sizes: { ...editingItem.sizes, warmupShirt: e.target.value }
                        })}
                        className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-extrabold text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="col-span-2 text-left">
                      <p className="text-xs font-bold text-slate-650 dark:text-slate-300">Medidas del Cuerpo Técnico:</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block text-left">Chaqueta / Polo</label>
                      <input
                        type="text"
                        required
                        value={editingItem.shirt_size || ""}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          shirt_size: e.target.value
                        })}
                        className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-extrabold text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block text-left">Pantalón Corto</label>
                      <input
                        type="text"
                        required
                        value={editingItem.shorts_size || ""}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          shorts_size: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block text-left">Calzado</label>
                      <input
                        type="number"
                        required
                        value={editingItem.shoe_size || 43}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          shoe_size: Number(e.target.value)
                        })}
                        className="w-full text-center py-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs font-extrabold text-slate-850 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all mt-4">
                Guardar Cambios de Talla
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}