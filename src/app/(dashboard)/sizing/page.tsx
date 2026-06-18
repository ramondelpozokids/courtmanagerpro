"use client";

import React, { useState } from "react";
import { db } from "@/infrastructure/supabase/repositories/InMemoryDB";
import { Shirt, Table, ArrowLeft, Users, ShieldCheck, Search, Ruler } from "lucide-react";
import Link from "next/link";

export default function SizingTablePage() {
  const [activeTab, setActiveTab] = useState<"players" | "staff">("players");
  const [search, setSearch] = useState("");

  const players = db.players;
  const staff = db.coachingStaff;

  const filteredPlayers = players.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || String(p.number).includes(search) || p.position.toLowerCase().includes(search.toLowerCase());
  });

  const filteredStaff = staff.filter((s) => {
    return s.full_name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase());
  });

  const positionLabels: Record<string, string> = {
    base: "Base (PG)",
    escolta: "Escolta (SG)",
    alero: "Alero (SF)",
    ala_pivot: "Ala-Pívot (PF)",
    pivot: "Pívot (C)"
  };

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* Back link */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 dark:bg-orange-950/40 rounded-2xl text-orange-600 border border-orange-200/40 shrink-0">
            <Ruler className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Registro General de Tallas y Medidas</h2>
            <p className="text-xs text-slate-400 mt-1">Control maestro de tallajes oficiales de indumentaria deportiva para jugadores y cuerpo técnico.</p>
          </div>
        </div>
      </div>

      {/* Selector Tabs & Search Filter */}
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

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === "players" ? "Buscar jugador por dorsal o nombre..." : "Buscar por nombre del staff..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
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
                    <th className="p-4 text-center">Calcetines</th>
                    <th className="p-4 text-center">Chaqueta</th>
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
                        <td className="p-4 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {fullName}
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-xs bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded font-black text-orange-600">
                            #{p.number}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-500 dark:text-slate-400 capitalize">
                          {positionLabels[p.position] || p.position}
                        </td>
                        <td className="p-4 text-center font-extrabold text-slate-700 dark:text-slate-350">
                          {p.sizes.jersey || "XL"}
                        </td>
                        <td className="p-4 text-center font-extrabold text-slate-700 dark:text-slate-350">
                          {p.sizes.shorts || "XL"}
                        </td>
                        <td className="p-4 text-center font-black text-orange-600">
                          {p.sizes.shoes || "46"}
                        </td>
                        <td className="p-4 text-center font-extrabold text-slate-700 dark:text-slate-350">
                          {p.sizes.socks || "L"}
                        </td>
                        <td className="p-4 text-center font-extrabold text-slate-700 dark:text-slate-350">
                          {p.sizes.warmupShirt || "XXL"}
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
                        <td className="p-4 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {s.full_name}
                        </td>
                        <td className="p-4 font-semibold text-orange-500">
                          {s.role}
                        </td>
                        <td className="p-4 font-medium text-slate-400">
                          {s.nationality || "España"}
                        </td>
                        <td className="p-4 text-center font-extrabold text-slate-700 dark:text-slate-350">
                          {s.shirt_size || "L"}
                        </td>
                        <td className="p-4 text-center font-extrabold text-slate-700 dark:text-slate-350">
                          {s.shorts_size || "L"}
                        </td>
                        <td className="p-4 text-center font-black text-orange-600">
                          {s.shoe_size || "43"}
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
    </div>
  );
}