"use client";

import { useEffect, useState, use } from "react";
import { Player, Request } from "@/types";
import PlayerSizeChart from "@/components/players/PlayerSizeChart";
import { ArrowLeft, User, Phone, Mail, Globe, Calendar, RefreshCw } from "lucide-react";
import Link from "next/link";

interface PlayerProfileProps {
  params: Promise<{ id: string }>;
}

export default function PlayerProfilePage({ params }: PlayerProfileProps) {
  const { id } = use(params);
  const [player, setPlayer] = useState<Player | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Fetch player
        const playerRes = await fetch(`/api/players/${id}`);
        if (!playerRes.ok) throw new Error();
        const playerData = await playerRes.json();
        setPlayer(playerData);

        // Fetch requests and filter for player
        const requestsRes = await fetch("/api/requests");
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setRequests(requestsData.filter((r: Request) => r.player_id === id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
        <p className="text-xs font-semibold">Cargando perfil técnico de jugador...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-sm font-bold">Jugador no encontrado</p>
        <Link href="/players" className="text-orange-500 hover:underline text-xs mt-2 inline-block">
          Volver a la plantilla
        </Link>
      </div>
    );
  }

  // Create player sizes object for size chart component compatibility
  const sizesObj = {
    jersey: player.shirt_size || "XL",
    shorts: player.shorts_size || "XL",
    shoes: String(player.shoe_size || "46"),
    socks: player.sock_size || "L",
    warmupShirt: player.jacket_size || "XXL"
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link href="/players" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver a la plantilla
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left w-full md:w-auto">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-orange-100 border-2 border-orange-200 shrink-0 flex items-center justify-center">
            {player.photo_url ? (
              <img src={player.photo_url} alt={player.full_name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-extrabold text-orange-600">{player.full_name[0]}</span>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">
                {player.full_name}
              </h2>
              <span className="text-sm bg-orange-100 dark:bg-orange-950/40 px-2 py-0.5 rounded-lg font-bold text-orange-600">
                #{player.dorsal}
              </span>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md font-semibold uppercase">
                {player.position}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex flex-wrap justify-center md:justify-start gap-4">
              <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-slate-400" /> Nacionalidad: {player.nationality || "N/A"}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-400" /> Nacimiento: {player.birth_date || "N/A"}</span>
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="text-center md:text-right shrink-0 space-y-2.5">
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
              player.is_active
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                : "bg-slate-100 text-slate-500"
            }`}>
              {player.is_active ? "Activo" : "Inactivo"}
            </span>
            {(player as any).profile_url && (
              <a
                href={(player as any).profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-extrabold shadow-sm transition-all"
              >
                Ver Ficha Oficial Real Madrid
              </a>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Asignaciones de Utilería aprobadas esta temporada</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sizing charts */}
        <div className="lg:col-span-1">
          <PlayerSizeChart sizes={sizesObj} />
        </div>

        {/* Player Request History */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            Historial de Solicitudes y Suministros
          </h3>

          {requests.length === 0 ? (
            <p className="text-xs text-slate-400 py-12 text-center">Este jugador no ha solicitado equipamiento aún.</p>
          ) : (
            <div className="space-y-3.5">
              {requests.map((req) => (
                <div key={req.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-200">{req.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Talla: {req.size || "Única"} • Cantidad: {req.quantity} uds • Fecha: {new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                    req.status === "completada"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                      : req.status === "aprobada"
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                      : req.status === "pendiente"
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                      : "bg-red-50 text-red-600 dark:bg-red-950/20"
                  }`}>
                    {req.status === "completada" ? "Entregado" : req.status === "aprobada" ? "Aprobado" : req.status === "pendiente" ? "Pendiente" : "Rechazado"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
