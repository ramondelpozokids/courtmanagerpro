"use client";

import { useState } from "react";
import { Pencil, Save, X, Plus, Trash2, RefreshCw } from "lucide-react";
import {
  RMB_COMPETITIONS,
  type CompetitionId,
  type PlayerCompetitionMap,
  type PlayerCompetitionStats,
  type PlayerGameLog,
} from "@/lib/player-competitions";
import { isMockMode } from "@/lib/demo-data";

interface PlayerCompetitionStatsEditorProps {
  playerId: string;
  playerName: string;
  competitionStats: PlayerCompetitionMap;
  canEdit: boolean;
  onSaved: (next: PlayerCompetitionMap) => void;
}

const EMPTY_FORM: PlayerCompetitionStats = {
  season: "2025-2026",
  phase: "Fase Regular",
  matches_played: 0,
  points: 0,
  rebounds: 0,
  assists: 0,
  minutes_played: 0,
  valuation: 0,
  ppg: 0,
  rpg: 0,
  apg: 0,
};

function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function PlayerCompetitionStatsEditor({
  playerId,
  playerName,
  competitionStats,
  canEdit,
  onSaved,
}: PlayerCompetitionStatsEditorProps) {
  const [open, setOpen] = useState(false);
  const [league, setLeague] = useState<CompetitionId>("liga_endesa");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = competitionStats[league];
  const [stats, setStats] = useState<PlayerCompetitionStats>({
    ...EMPTY_FORM,
    ...current?.stats,
  });
  const [games, setGames] = useState<PlayerGameLog[]>(current?.games ?? []);

  if (!canEdit) return null;

  const loadLeague = (next: CompetitionId) => {
    setLeague(next);
    const profile = competitionStats[next];
    setStats({ ...EMPTY_FORM, ...profile?.stats });
    setGames(profile?.games ?? []);
    setError(null);
  };

  const addGame = () => {
    setGames((prev) => [
      ...prev,
      {
        id: `g-${Date.now()}`,
        date: new Date().toISOString().slice(0, 16),
        opponent: "",
        venue: "",
        is_home: true,
        minutes: 0,
        points: 0,
        rebounds: 0,
        assists: 0,
        valuation: 0,
      },
    ]);
  };

  const updateGame = (index: number, patch: Partial<PlayerGameLog>) => {
    setGames((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  };

  const removeGame = (index: number) => {
    setGames((prev) => prev.filter((_, i) => i !== index));
  };

  const persistLocally = (next: PlayerCompetitionMap) => {
    onSaved(next);
    setOpen(false);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payloadStats: PlayerCompetitionStats = {
      ...stats,
      matches_played: toNumber(String(stats.matches_played)),
      points: toNumber(String(stats.points)),
      rebounds: toNumber(String(stats.rebounds)),
      assists: toNumber(String(stats.assists)),
      minutes_played: toNumber(String(stats.minutes_played)),
      valuation: toNumber(String(stats.valuation)),
      ppg: toNumber(String(stats.ppg)),
      rpg: toNumber(String(stats.rpg)),
      apg: toNumber(String(stats.apg)),
    };

    const nextMap: PlayerCompetitionMap = {
      ...competitionStats,
      [league]: {
        stats: payloadStats,
        games,
      },
    };

    const useLocalOnly = isMockMode() || /^p\d+$/i.test(playerId);

    try {
      if (!useLocalOnly) {
        const res = await fetch(`/api/players/${playerId}/competition-stats`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            competition: league,
            stats: payloadStats,
            games,
          }),
        });

        if (res.ok) {
          const body = await res.json();
          const saved = body?.data?.metadata?.competition_stats as PlayerCompetitionMap | undefined;
          persistLocally(saved ?? nextMap);
          return;
        }

        if (res.status !== 404) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "No se pudieron guardar las estadísticas");
        }
      }

      persistLocally(nextMap);
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-t border-slate-100 dark:border-slate-800">
      {!open ? (
        <div className="p-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              loadLeague(league);
              setOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Cargar / Editar estadísticas oficiales
          </button>
        </div>
      ) : (
        <div className="p-5 bg-slate-50/80 dark:bg-slate-900/60 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                Carga de datos — {playerName}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Selecciona la competición y guarda las estadísticas oficiales del club.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="inline-flex flex-wrap gap-1 p-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {RMB_COMPETITIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => loadLeague(item.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  league === item.id
                    ? "bg-[#00529F] text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {item.shortLabel}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: "season", label: "Temporada", type: "text" },
              { key: "phase", label: "Fase", type: "text" },
              { key: "matches_played", label: "Partidos", type: "number" },
              { key: "points", label: "Puntos", type: "number" },
              { key: "rebounds", label: "Rebotes", type: "number" },
              { key: "assists", label: "Asistencias", type: "number" },
              { key: "minutes_played", label: "Minutos", type: "number" },
              { key: "valuation", label: "Valoración", type: "number" },
              { key: "ppg", label: "PPG", type: "number" },
              { key: "rpg", label: "RPG", type: "number" },
              { key: "apg", label: "APG", type: "number" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  step={field.type === "number" ? "0.1" : undefined}
                  value={String((stats as any)[field.key] ?? "")}
                  onChange={(e) =>
                    setStats((prev) => ({
                      ...prev,
                      [field.key]:
                        field.type === "number" ? toNumber(e.target.value) : e.target.value,
                    }))
                  }
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actuaciones por partido
              </h5>
              <button
                type="button"
                onClick={addGame}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Añadir partido
              </button>
            </div>

            {games.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                Sin partidos registrados en esta competición.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {games.map((game, index) => (
                  <div
                    key={game.id}
                    className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <input
                      type="datetime-local"
                      value={game.date?.slice(0, 16) ?? ""}
                      onChange={(e) => updateGame(index, { date: e.target.value })}
                      className="col-span-2 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]"
                    />
                    <input
                      placeholder="Rival"
                      value={game.opponent}
                      onChange={(e) => updateGame(index, { opponent: e.target.value })}
                      className="col-span-2 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]"
                    />
                    <input
                      placeholder="Pabellón"
                      value={game.venue || ""}
                      onChange={(e) => updateGame(index, { venue: e.target.value })}
                      className="col-span-2 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]"
                    />
                    <input
                      type="number"
                      placeholder="Pts"
                      value={game.points ?? 0}
                      onChange={(e) => updateGame(index, { points: toNumber(e.target.value) })}
                      className="px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]"
                    />
                    <input
                      type="number"
                      placeholder="Reb"
                      value={game.rebounds ?? 0}
                      onChange={(e) => updateGame(index, { rebounds: toNumber(e.target.value) })}
                      className="px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]"
                    />
                    <input
                      type="number"
                      placeholder="Ast"
                      value={game.assists ?? 0}
                      onChange={(e) => updateGame(index, { assists: toNumber(e.target.value) })}
                      className="px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => removeGame(index)}
                      className="px-2 py-1.5 rounded border border-red-100 text-red-500 hover:bg-red-50 text-[11px] font-bold flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-xs font-extrabold"
            >
              {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Guardar {RMB_COMPETITIONS.find((l) => l.id === league)?.shortLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
