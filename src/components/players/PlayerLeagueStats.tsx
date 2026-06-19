"use client";

import { useEffect, useState } from "react";
import { Trophy, Calendar, MapPin } from "lucide-react";
import PlayerCompetitionStatsEditor from "@/components/players/PlayerCompetitionStatsEditor";
import {
  RMB_COMPETITIONS,
  type CompetitionId,
  type PlayerCompetitionMap,
  hasCompetitionData,
} from "@/lib/player-competitions";

interface PlayerLeagueStatsProps {
  playerId: string;
  competitionStats: PlayerCompetitionMap;
  playerName: string;
  canEdit?: boolean;
  onStatsSaved?: (next: PlayerCompetitionMap) => void;
}

export default function PlayerLeagueStats({
  playerId,
  competitionStats,
  playerName,
  canEdit = false,
  onStatsSaved,
}: PlayerLeagueStatsProps) {
  const [statsMap, setStatsMap] = useState(competitionStats);

  useEffect(() => {
    setStatsMap(competitionStats);
  }, [competitionStats]);

  const defaultTab =
    RMB_COMPETITIONS.find((c) => hasCompetitionData(statsMap, c.id))?.id ?? "liga_endesa";

  const [activeLeague, setActiveLeague] = useState<CompetitionId>(defaultTab);
  const active = statsMap[activeLeague];
  const stats = active?.stats;
  const games = active?.games ?? [];

  const handleSaved = (next: PlayerCompetitionMap) => {
    setStatsMap(next);
    onStatsSaved?.(next);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
          <Trophy className="h-5 w-5 text-orange-500" />
          Estadísticas por Competición
        </h3>
        <p className="text-[10px] text-slate-400 mt-1">
          Datos oficiales del Real Madrid en las 4 competiciones de la temporada. El club puede actualizar cada liga de forma independiente.
        </p>
      </div>

      {/* League tabs — estilo Real Madrid */}
      <div className="px-5 pt-4">
        <div className="inline-flex flex-wrap gap-1 p-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
          {RMB_COMPETITIONS.map((league) => {
            const hasData = hasCompetitionData(statsMap, league.id);
            const isActive = activeLeague === league.id;
            return (
              <button
                key={league.id}
                type="button"
                onClick={() => setActiveLeague(league.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#00529F] text-white shadow-sm"
                    : hasData
                      ? "text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-700"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                {league.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 space-y-5">
        {stats && stats.matches_played > 0 ? (
          <>
            {(stats.phase || stats.season) && (
              <div>
                <h4 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                  {stats.phase || "Temporada"}
                </h4>
                {stats.season && (
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    Temporada {stats.season}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { label: "Partidos", value: stats.matches_played },
                { label: "Puntos", value: stats.points },
                { label: "Rebotes", value: stats.rebounds },
                { label: "Asistencias", value: stats.assists },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="text-xl font-black text-slate-800 dark:text-slate-100 block mt-1">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {(stats.ppg != null || stats.minutes_played != null || stats.valuation != null) && (
              <div className="grid grid-cols-3 gap-3 text-center">
                {stats.ppg != null && (
                  <div className="p-2.5 bg-orange-50/40 dark:bg-orange-950/10 rounded-lg border border-orange-100 dark:border-orange-950/20">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">PPG</span>
                    <span className="text-sm font-black text-orange-600">{stats.ppg}</span>
                  </div>
                )}
                {stats.rpg != null && (
                  <div className="p-2.5 bg-orange-50/40 dark:bg-orange-950/10 rounded-lg border border-orange-100 dark:border-orange-950/20">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">RPG</span>
                    <span className="text-sm font-black text-orange-600">{stats.rpg}</span>
                  </div>
                )}
                {stats.apg != null && (
                  <div className="p-2.5 bg-orange-50/40 dark:bg-orange-950/10 rounded-lg border border-orange-100 dark:border-orange-950/20">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">APG</span>
                    <span className="text-sm font-black text-orange-600">{stats.apg}</span>
                  </div>
                )}
              </div>
            )}

            {games.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actuaciones por partido
                </h5>
                <div className="space-y-2">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                    >
                      <div className="flex flex-wrap justify-between gap-2 text-xs">
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {new Date(game.date).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          {game.venue && (
                            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {game.venue}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-slate-800 dark:text-slate-100">
                            vs {game.opponent}
                          </p>
                          {game.team_score != null && game.opponent_score != null && (
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {game.is_home ? "Local" : "Visitante"} · {game.team_score} - {game.opponent_score}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2.5 text-[10px] font-bold text-slate-500">
                        {game.minutes != null && <span>{game.minutes} min</span>}
                        {game.points != null && <span className="text-orange-600">{game.points} pts</span>}
                        {game.rebounds != null && <span>{game.rebounds} reb</span>}
                        {game.assists != null && <span>{game.assists} ast</span>}
                        {game.valuation != null && <span>Val. {game.valuation}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-10 text-center">
            <Trophy className="h-10 w-10 mx-auto text-slate-200 dark:text-slate-700 mb-3" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              Sin estadísticas en {RMB_COMPETITIONS.find((l) => l.id === activeLeague)?.label}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              El departamento del club puede cargar los datos oficiales de {playerName} para esta competición cuando estén disponibles.
            </p>
          </div>
        )}
      </div>

      <PlayerCompetitionStatsEditor
        playerId={playerId}
        playerName={playerName}
        competitionStats={statsMap}
        canEdit={canEdit}
        onSaved={handleSaved}
      />
    </div>
  );
}
