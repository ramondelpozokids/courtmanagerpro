"use client";

import { useEffect, useState, use } from "react";
import { Player } from "@/types";
import { Request } from "@/types";
import PlayerLeagueStats from "@/components/players/PlayerLeagueStats";
import PlayerSizeChart from "@/components/players/PlayerSizeChart";
import { ArrowLeft, User, Phone, Mail, Globe, Calendar, RefreshCw, Trophy, Target, Award, Sparkles } from "lucide-react";
import Link from "next/link";
import { getSupabaseClient } from "@/infrastructure/supabase/client";
import {
  isMockMode,
  mapDemoPlayerDetail,
  mapDemoPlayerRequests,
  shouldUseDemoFallback,
} from "@/lib/demo-data";
import { mapPackPlayerDetailFromRoute } from "@/lib/players-all-clubs-query";
import { normalizePlayerProfile } from "@/lib/player-profile";
import { useAuth } from "@/contexts/AuthContext";
import { canModifyProject } from "@/lib/permissions";
import { uuidToDemoPlayerId } from "@/lib/team-constants";

interface PlayerProfileProps {
  params: Promise<{ id: string }>;
}

export default function PlayerProfilePage({ params }: PlayerProfileProps) {
  const { id } = use(params);
  const { user, userEmail, isSuperadmin } = useAuth();
  const canEditStats = isSuperadmin || canModifyProject(user?.profile?.role, userEmail);
  const [player, setPlayer] = useState<any | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const mockMode = isMockMode();

        if (mockMode) {
          const globalDemo = mapPackPlayerDetailFromRoute(id);
          if (globalDemo) {
            setPlayer(normalizePlayerProfile(globalDemo));
            setRequests([]);
            return;
          }
          setPlayer(normalizePlayerProfile(mapDemoPlayerDetail(id)));
          setRequests(mapDemoPlayerRequests(id));
          return;
        }

        const globalDemo = mapPackPlayerDetailFromRoute(id);
        if (globalDemo) {
          setPlayer(normalizePlayerProfile(globalDemo));
          setRequests([]);
          return;
        }

        const supabase = getSupabaseClient() as any;
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('id', id)
          .single();

        if (error || shouldUseDemoFallback(data ? [data] : null)) {
          const demoId = uuidToDemoPlayerId(id) ?? id;
          setPlayer(normalizePlayerProfile(mapDemoPlayerDetail(demoId)));
          setRequests(mapDemoPlayerRequests(demoId));
          return;
        }

        setPlayer(normalizePlayerProfile(data));

        const requestsRes = await fetch('/api/requests');
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          const list = Array.isArray(requestsData) ? requestsData : requestsData.data || [];
          setRequests(list.filter((r: Request) => r.player_id === id));
        } else {
          setRequests(mapDemoPlayerRequests(id));
        }
      } catch (err) {
        console.error(err);
        const demoId = uuidToDemoPlayerId(id) ?? id;
        setPlayer(normalizePlayerProfile(mapDemoPlayerDetail(demoId)));
        setRequests(mapDemoPlayerRequests(demoId));
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
    <div className="space-y-6 text-left">
      {/* Back button */}
      <div>
        <Link href="/players" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver a la plantilla
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left w-full md:w-auto">
          <div className="h-28 w-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center shadow-sm">
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
            <p className="text-xs text-slate-400 mt-3.5 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
              <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" /> Nacionalidad: {player.nationality || "N/A"}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" /> Nacimiento: {player.birth_date || player.birthDate || "N/A"}</span>
              {player.birth_place && (
                <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" /> Origen: {player.birth_place}</span>
              )}
            </p>
          </div>
        </div>

        {/* Status Badge & Official Real Madrid profile link */}
        <div className="text-center md:text-right shrink-0 space-y-3">
          <div className="flex flex-col items-center md:items-end gap-2.5">
            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
              player.is_active
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                : "bg-slate-100 text-slate-500"
            }`}>
              {player.is_active ? "Activo" : "Inactivo"}
            </span>
            {player.profile_url && (
              <a
                href={player.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-extrabold shadow-sm transition-all hover:scale-105"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ver Ficha Oficial Real Madrid
              </a>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Asignaciones de Utilería aprobadas esta temporada</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Sizing & Personal Specs */}
        <div className="space-y-6">
          <PlayerSizeChart sizes={sizesObj} />

          {/* Physical Specifications Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">Ficha de Datos Físicos</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Altura</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-100">{player.height || "1,81 m"}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Peso</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-100">{player.weight || "84 kg"}</span>
              </div>
            </div>
          </div>

          {/* Action Photo Card */}
          {player.action_image && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
                  Imagen Destacada de Competición
                </h3>
              </div>
              <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                <img
                  src={player.action_image}
                  alt={`${player.full_name} en acción`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right column: Roster Stats & Delivery History */}
        <div className="lg:col-span-2 space-y-6">
          <PlayerLeagueStats
            playerId={player.id}
            competitionStats={player.competition_stats || {}}
            playerName={player.full_name}
            canEdit={canEditStats}
            onStatsSaved={(next) =>
              setPlayer((prev: any) =>
                prev ? { ...prev, competition_stats: next, metadata: { ...prev.metadata, competition_stats: next } } : prev
              )
            }
          />

          {(player.debut || player.trajectory || player.palmares?.length > 0) && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm mb-4 flex items-center gap-1.5">
                <Trophy className="h-5 w-5 text-orange-500" />
                Trayectoria y Palmarés
              </h3>
              <div className="p-4 bg-orange-50/20 dark:bg-orange-950/5 border border-orange-100 dark:border-orange-950/20 rounded-xl space-y-2 text-xs">
                {player.debut && (
                  <p className="text-slate-700 dark:text-slate-350">
                    <strong>Debut oficial RMB:</strong> {player.debut}
                  </p>
                )}
                {player.trajectory && (
                  <p className="text-slate-700 dark:text-slate-350">
                    <strong>Trayectoria en el club:</strong> {player.trajectory}
                  </p>
                )}
                {player.palmares?.length > 0 && (
                  <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {player.palmares.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Player Request History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
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
                      <p suppressHydrationWarning={true} className="text-[10px] text-slate-400 mt-0.5">Talla: {req.size || "Única"} • Cantidad: {req.quantity} uds • Fecha: {new Date(req.created_at).toLocaleDateString()}</p>
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
    </div>
  );
}
