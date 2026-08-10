'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import { categorizeCompetition } from '@/application/calendar-sync/parser';
import {
  calendarSportForTeamId,
  getOfficialCalendarMetaForTeam,
  type CalendarSport,
} from '@/application/calendar-sync/types';
import { useActiveTeamId, useClubBranding } from '@/contexts/ClubDemoContext';
import type { OfficialMatch } from '@/types';
import { cn } from '@/lib/utils';

type ViewMode = 'month' | 'week' | 'timeline';

/** RMF: julio vacío → abrir septiembre de la temporada (amistosos/liga). */
function initialCalendarCursor(slug: string, sport: CalendarSport): Date {
  const now = new Date();
  if (slug === 'rmf' && sport === 'football') {
    const seasonStartYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
    const september = new Date(seasonStartYear, 8, 1);
    if (now < september) return september;
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

const BASKETBALL_FILTERS = [
  'Todas',
  'Liga Endesa',
  'Euroliga',
  'Copa del Rey',
  'Supercopa',
  'Amistosos',
  'Torneos internacionales',
] as const;

const FOOTBALL_FILTERS = [
  'Todas',
  'LaLiga',
  'Champions League',
  'Copa del Rey',
  'Supercopa',
  'Amistosos',
  'Mundial de Clubes',
  'Torneos internacionales',
] as const;

function formatDateEs(isoDate: string) {
  try {
    return new Date(isoDate + (isoDate.length === 10 ? 'T12:00:00' : '')).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

function countdownLabel(dt: string | null): string {
  if (!dt) return '—';
  const diff = new Date(dt).getTime() - Date.now();
  if (diff <= 0) return 'En curso / reciente';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  return `${hours}h ${mins}m`;
}

function matchInCategory(m: OfficialMatch, filter: string, sport: CalendarSport) {
  if (filter === 'Todas') return true;
  return categorizeCompetition(m.competition, sport) === filter;
}

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Monday=0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function CalendarioPage() {
  const branding = useClubBranding();
  const teamId = useActiveTeamId();
  const sport = branding.sport === 'football' ? 'football' : calendarSportForTeamId(teamId);
  const calendarMeta = getOfficialCalendarMetaForTeam(teamId);
  const competitionFilters = sport === 'football' ? FOOTBALL_FILTERS : BASKETBALL_FILTERS;

  const [matches, setMatches] = useState<OfficialMatch[]>([]);
  const [nextMatch, setNextMatch] = useState<OfficialMatch | null>(null);
  const [nextFive, setNextFive] = useState<OfficialMatch[]>([]);
  const [recentResults, setRecentResults] = useState<OfficialMatch[]>([]);
  const [source, setSource] = useState(calendarMeta.sourceLabel);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('month');
  const [filter, setFilter] = useState<string>('Todas');
  const [cursor, setCursor] = useState(() =>
    initialCalendarCursor(branding.slug, sport === 'football' ? 'football' : 'basketball')
  );
  const [cursorSynced, setCursorSynced] = useState(false);
  const [, setTick] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/calendar/sync/status?team_id=${encodeURIComponent(teamId)}`, {
        credentials: 'include',
      });
      const json = await res.json();
      const list = (json.data?.matches || []) as OfficialMatch[];
      const next = (json.data?.nextMatch || null) as OfficialMatch | null;
      setMatches(list);
      setNextMatch(next);
      setNextFive(json.data?.nextFive || []);
      setRecentResults(json.data?.recentResults || []);
      setSource(json.data?.source || json.data?.sourceLabel || calendarMeta.sourceLabel);
      setLastUpdated(json.data?.lastUpdatedAt || null);
      return { list, next };
    } catch (err) {
      console.warn(err);
      return { list: [] as OfficialMatch[], next: null as OfficialMatch | null };
    } finally {
      setLoading(false);
    }
  }, [teamId, calendarMeta.sourceLabel]);

  useEffect(() => {
    void (async () => {
      const { list, next } = await load();
      // Vacío, sin próximo, o cambio de club (teamId): forzar sync con la web oficial del deporte activo.
      if (list.length === 0 || !next) {
        try {
          await fetch('/api/calendar/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ trigger: 'manual', team_id: teamId, force: true }),
          });
          await load();
        } catch {
          /* keep previous */
        }
      }
    })();
    const onSync = () => void load();
    const onClub = () => {
      void (async () => {
        try {
          await fetch('/api/calendar/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ trigger: 'manual', team_id: teamId, force: true }),
          });
        } catch {
          /* ignore */
        }
        await load();
      })();
    };
    window.addEventListener('calendar-sync-complete', onSync);
    window.addEventListener('club-demo-changed', onClub);
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => {
      window.removeEventListener('calendar-sync-complete', onSync);
      window.removeEventListener('club-demo-changed', onClub);
      clearInterval(id);
    };
  }, [load, teamId]);

  // Abrir el mes del próximo partido; al cambiar de club, volver a centrar.
  useEffect(() => {
    setCursorSynced(false);
    setCursor(initialCalendarCursor(branding.slug, sport === 'football' ? 'football' : 'basketball'));
  }, [teamId, branding.slug, sport]);

  useEffect(() => {
    if (cursorSynced || !nextMatch?.match_date) return;
    const [y, m] = nextMatch.match_date.split('-').map(Number);
    if (!y || !m) return;
    setCursor(new Date(y, m - 1, 1));
    setCursorSynced(true);
  }, [nextMatch, cursorSynced]);

  async function syncNow(opts?: { focusNextMonth?: boolean }) {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ trigger: 'manual', team_id: teamId, force: true }),
      });
      const json = await res.json().catch(() => ({} as { data?: any; error?: string }));
      const data = json.data;
      if (!res.ok) {
        setSyncMsg(json.error || `Error al sincronizar (HTTP ${res.status})`);
        return;
      }
      if (!data || data.status === 'error') {
        setSyncMsg(data?.errorMessage || json.error || 'Error (se mantiene el calendario en caché)');
        return;
      }
      const clubLabel =
        branding.slug === 'atm'
          ? 'Atlético'
          : branding.slug === 'rmf'
            ? 'RM Fútbol'
            : 'RM Baloncesto';
      setSyncMsg(
        data.changesCount
          ? `${clubLabel}: ${data.changesCount} cambio(s) desde la web oficial`
          : `Calendario ${clubLabel} al día con la web oficial`
      );
      window.dispatchEvent(new CustomEvent('calendar-sync-complete', { detail: data }));
      const loaded = await load();
      if (opts?.focusNextMonth || branding.slug === 'rmf' || branding.slug === 'atm') {
        const next = loaded?.next || nextMatch;
        if (next?.match_date) {
          const [y, m] = next.match_date.split('-').map(Number);
          if (y && m) {
            setCursor(new Date(y, m - 1, 1));
            setCursorSynced(true);
          }
        }
      }
    } catch (err) {
      setSyncMsg(err instanceof Error ? err.message : 'Error de red');
    } finally {
      setSyncing(false);
    }
  }

  /** Cambiar de mes y forzar sync en fútbol (RMF/ATM) cuando la web no avanza sola. */
  function goToMonth(next: Date, sync = branding.slug === 'rmf' || branding.slug === 'atm') {
    setCursor(next);
    if (sync) void syncNow();
  }

  const filtered = useMemo(
    () => matches.filter((m) => matchInCategory(m, filter, sport)),
    [matches, filter, sport]
  );

  useEffect(() => {
    setFilter('Todas');
  }, [sport]);

  const monthCells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const start = startOfWeek(first);
    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push(d);
    }
    return cells;
  }, [cursor]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(cursor);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursor]);

  function matchesOnDay(day: Date) {
    // Fecha local (no toISOString/UTC: desfasaba el día en ES).
    const y = day.getFullYear();
    const m = String(day.getMonth() + 1).padStart(2, '0');
    const dd = String(day.getDate()).padStart(2, '0');
    const localKey = `${y}-${m}-${dd}`;
    return filtered.filter((match) => match.match_date === localKey);
  }

  const timeline = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        String(a.match_datetime).localeCompare(String(b.match_datetime))
      ),
    [filtered]
  );

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-orange-500" />
            Calendario · Primer Equipo {sport === 'football' ? 'Fútbol' : 'Baloncesto'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Solo partidos oficiales de {branding.name} (
            {sport === 'football' ? 'fútbol · primer equipo masculino' : 'baloncesto · primer equipo'}
            ).{' '}
            Fuente: {source}
            {lastUpdated
              ? ` · Última sync ${new Date(lastUpdated).toLocaleString('es-ES')}`
              : ''}
          </p>
          {branding.slug === 'rmf' && (
            <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1.5 max-w-xl">
              La web de realmadrid.com a veces salta a baloncesto: el enlace de abajo fuerza fútbol.
              Al cambiar de mes, pulsa <strong>Actualizar calendario oficial</strong> (o usa las flechas: sincronizan solas).
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void syncNow({ focusNextMonth: true })}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white px-4 py-2.5 text-sm font-semibold"
          >
            <RefreshCw className={cn('h-4 w-4', syncing && 'animate-spin')} />
            Actualizar calendario oficial
          </button>
          <a
            href={calendarMeta.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-bold"
          >
            Web oficial ({sport === 'football' ? 'fútbol' : 'baloncesto'})
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
      {syncMsg && <p className="text-xs text-slate-500">{syncMsg}</p>}

      {/* Next match + countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 to-orange-950/40 text-white p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-300">Próximo partido</p>
          {nextMatch ? (
            <>
              <h3 className="mt-2 text-2xl font-black">
                {branding.shortName} vs {nextMatch.rival}
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                {formatDateEs(nextMatch.match_date)}
                {nextMatch.match_time ? ` · ${nextMatch.match_time.slice(0, 5)}` : ''} ·{' '}
                {nextMatch.home_away === 'local' ? 'Local' : nextMatch.home_away === 'visitante' ? 'Visitante' : 'Neutral'}
              </p>
              <p className="mt-1 text-sm text-slate-400 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {nextMatch.venue || 'Pabellón por confirmar'}
                {nextMatch.city ? ` · ${nextMatch.city}` : ''}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold">
                <Clock className="h-4 w-4 text-orange-300" />
                Cuenta atrás: {countdownLabel(nextMatch.match_datetime)}
              </p>
              <p className="mt-2 text-xs text-orange-200/80">{nextMatch.competition}
                {nextMatch.jornada ? ` · Jornada ${nextMatch.jornada}` : ''}
              </p>
            </>
          ) : (
            <p className="mt-3 text-slate-300">{loading ? 'Cargando…' : 'Sin próximo partido en caché'}</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-orange-500" />
            Últimos resultados
          </p>
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {recentResults.length === 0 && (
              <p className="text-xs text-slate-400">Sin resultados aún</p>
            )}
            {recentResults.map((m) => (
              <div key={m.id} className="text-sm flex justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">vs {m.rival}</p>
                  <p className="text-[11px] text-slate-400">{m.competition}</p>
                </div>
                <div className="text-right">
                  <p className="font-black">{m.score_text || '—'}</p>
                  <p
                    className={cn(
                      'text-[10px] font-bold uppercase',
                      m.result === 'victoria' && 'text-emerald-600',
                      m.result === 'derrota' && 'text-rose-600',
                      m.result === 'prorroga' && 'text-amber-600'
                    )}
                  >
                    {m.result || m.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next five */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Próximos cinco encuentros</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-3">
          {nextFive.map((m) => (
            <div key={m.id} className="rounded-xl bg-slate-50 dark:bg-slate-950/50 p-3 text-xs">
              <p className="font-bold text-slate-800 dark:text-white">vs {m.rival}</p>
              <p className="text-slate-500 mt-1">{formatDateEs(m.match_date)}</p>
              <p className="text-orange-600 font-semibold mt-1">{m.competition}</p>
            </div>
          ))}
          {nextFive.length === 0 && <p className="text-xs text-slate-400 col-span-full">Sin próximos partidos</p>}
        </div>
      </div>

      {/* Filters + views */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {competitionFilters.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[11px] font-bold border transition',
                filter === c
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
          {(
            [
              ['month', 'Mensual'],
              ['week', 'Semanal'],
              ['timeline', 'Línea temporal'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold',
                view === id ? 'bg-slate-900 text-white' : 'text-slate-500'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {(view === 'month' || view === 'week') && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(() => {
              const seasonStart =
                cursor.getMonth() >= 6 ? cursor.getFullYear() : cursor.getFullYear() - 1;
              const labels = [
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic',
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
              ];
              return labels.map((label, i) => {
                const monthIndex = (6 + i) % 12;
                const year = monthIndex >= 6 ? seasonStart : seasonStart + 1;
                const active = cursor.getMonth() === monthIndex && cursor.getFullYear() === year;
                const hasGames = filtered.some((m) => {
                  const [y, mo] = m.match_date.split('-').map(Number);
                  return y === year && mo === monthIndex + 1;
                });
                return (
                  <button
                    key={`${year}-${monthIndex}`}
                    type="button"
                    onClick={() => goToMonth(new Date(year, monthIndex, 1))}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold transition',
                      active
                        ? 'bg-[#002654] text-white'
                        : hasGames
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                          : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    )}
                  >
                    {label}
                  </button>
                );
              });
            })()}
            {nextMatch && (
              <button
                type="button"
                onClick={() => {
                  const [y, m] = nextMatch.match_date.split('-').map(Number);
                  if (y && m) goToMonth(new Date(y, m - 1, 1));
                }}
                className="ml-auto px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Ir al próximo partido
              </button>
            )}
          </div>
          <div className="flex items-center justify-between">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() =>
              goToMonth(
                new Date(
                  cursor.getFullYear(),
                  cursor.getMonth() - (view === 'month' ? 1 : 0),
                  cursor.getDate() - (view === 'week' ? 7 : 0)
                )
              )
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-bold capitalize">
            {cursor.toLocaleDateString('es-ES', {
              month: 'long',
              year: 'numeric',
              ...(view === 'week' ? { day: 'numeric' } : {}),
            })}
          </p>
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() =>
              goToMonth(
                new Date(
                  cursor.getFullYear(),
                  cursor.getMonth() + (view === 'month' ? 1 : 0),
                  cursor.getDate() + (view === 'week' ? 7 : 0)
                )
              )
            }
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          </div>
        </div>
      )}

      {view === 'month' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-950 text-[10px] font-bold uppercase text-slate-500">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
              <div key={d} className="p-2 text-center border-b border-slate-200 dark:border-slate-800">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr">
            {monthCells.map((day) => {
              const inMonth = day.getMonth() === cursor.getMonth();
              const dayMatches = matchesOnDay(day);
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'min-h-[88px] border-t border-r border-slate-100 dark:border-slate-800 p-1.5',
                    !inMonth && 'bg-slate-50/60 dark:bg-slate-950/40 text-slate-400'
                  )}
                >
                  <p className="text-[11px] font-bold mb-1">{day.getDate()}</p>
                  <div className="space-y-0.5">
                    {dayMatches.slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        className="text-[10px] leading-tight rounded bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 px-1 py-0.5 truncate"
                        title={`${m.rival} · ${m.competition}`}
                      >
                        {m.match_time?.slice(0, 5) || ''} vs {m.rival}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 min-h-[160px]"
            >
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 capitalize">
                {day.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
              </p>
              <div className="mt-2 space-y-2">
                {matchesOnDay(day).map((m) => (
                  <div key={m.id} className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2 text-[11px]">
                    <p className="font-bold">vs {m.rival}</p>
                    <p className="text-slate-500">{m.match_time?.slice(0, 5) || '—'} · {m.competition}</p>
                    <p className="text-slate-400 truncate">{m.venue}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'timeline' && (
        <div className="space-y-2">
          {timeline.map((m) => (
            <div
              key={m.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3"
            >
              <div>
                <p className="font-bold text-slate-800 dark:text-white">
                  {formatDateEs(m.match_date)}
                  {m.match_time ? ` · ${m.match_time.slice(0, 5)}` : ''} — vs {m.rival}
                </p>
                <p className="text-xs text-slate-500">
                  {m.competition}
                  {m.jornada ? ` · J${m.jornada}` : ''} ·{' '}
                  {m.home_away === 'local' ? 'Local' : m.home_away === 'visitante' ? 'Visitante' : 'Neutral'}
                  {m.venue ? ` · ${m.venue}` : ''}
                </p>
              </div>
              <div className="text-right text-sm">
                {m.status === 'finalizado' ? (
                  <>
                    <p className="font-black">{m.score_text}</p>
                    <p className="text-[11px] uppercase font-bold text-slate-500">{m.result}</p>
                  </>
                ) : (
                  <p className="text-xs font-bold uppercase text-orange-600">{m.status}</p>
                )}
                {m.official_url && (
                  <a
                    href={m.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-400 hover:text-orange-500 inline-flex items-center gap-1"
                  >
                    Ficha oficial <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
          {timeline.length === 0 && (
            <p className="text-sm text-slate-400">
              {loading ? 'Sincronizando calendario…' : 'No hay partidos para este filtro.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
