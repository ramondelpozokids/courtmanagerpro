import type { MatchHomeAway, MatchResult, MatchStatus } from '@/types';
import type { OfficialFixture } from './types';

export function mapOfficialStatus(raw: unknown): MatchStatus {
  const s = String(raw || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (/postpon|aplaz/.test(s)) return 'aplazado';
  if (/suspend|cancel|abort/.test(s)) return 'suspendido';
  if (/live|playing|in_progress|en_juego|ongoing/.test(s)) return 'en_juego';
  if (/finish|played|final|complet|ended/.test(s)) return 'finalizado';
  if (/pre_match|scheduled|fixture|pendiente|not_started/.test(s)) return 'pendiente';
  return 'pendiente';
}

export function parseScore(v: unknown): number | null {
  if (v == null || v === '') return null;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? Math.round(n) : null;
}

export function madridHomeAway(
  homeName: string,
  awayName: string,
  playAsHome: boolean | null | undefined
): { rival: string; home_away: MatchHomeAway } {
  const isRm = (n: string) => /real\s*madrid/i.test(n) && !/castilla|femenino|cff|ii\b/i.test(n);
  if (playAsHome === true) return { rival: awayName || 'Rival', home_away: 'local' };
  if (playAsHome === false) {
    if (isRm(homeName)) return { rival: awayName || 'Rival', home_away: 'local' };
    return { rival: homeName || 'Rival', home_away: 'visitante' };
  }
  if (isRm(homeName)) return { rival: awayName || 'Rival', home_away: 'local' };
  if (isRm(awayName)) return { rival: homeName || 'Rival', home_away: 'visitante' };
  return { rival: awayName || homeName || 'Rival', home_away: 'neutral' };
}

export function computeResult(
  status: MatchStatus,
  homeAway: MatchHomeAway,
  scoreHome: number | null,
  scoreAway: number | null,
  overtimeHint?: boolean
): MatchResult | null {
  if (status !== 'finalizado' || scoreHome == null || scoreAway == null) return null;
  if (overtimeHint) return 'prorroga';
  const rmScore = homeAway === 'local' ? scoreHome : homeAway === 'visitante' ? scoreAway : null;
  const oppScore = homeAway === 'local' ? scoreAway : homeAway === 'visitante' ? scoreHome : null;
  if (rmScore == null || oppScore == null) {
    if (scoreHome === scoreAway) return 'empate';
    return null;
  }
  if (rmScore > oppScore) return 'victoria';
  if (rmScore < oppScore) return 'derrota';
  return 'empate';
}

export function toMadridParts(iso: string): { match_date: string; match_time: string | null } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { match_date: iso.slice(0, 10), match_time: null };
  }
  // Europe/Madrid wall clock via Intl
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '';
  const match_date = `${get('year')}-${get('month')}-${get('day')}`;
  const match_time = `${get('hour')}:${get('minute')}`;
  return { match_date, match_time };
}

export function officialMatchUrl(slug: string): string {
  return `https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/partidos/${slug}`;
}

export function mapDiaryItemToFixture(item: Record<string, unknown>): OfficialFixture | null {
  const slug = String(item.slug || '');
  if (!slug) return null;

  const competition = (item.competition || {}) as Record<string, unknown>;
  const homeTeam = (item.homeTeam || {}) as Record<string, unknown>;
  const awayTeam = (item.awayTeam || {}) as Record<string, unknown>;
  const venue = (item.venue || {}) as Record<string, unknown>;

  const homeName = String(homeTeam.name || homeTeam.shortName || item.homeTeamName || '');
  const awayName = String(awayTeam.name || awayTeam.shortName || item.awayTeamName || '');
  const { rival, home_away } = madridHomeAway(
    homeName,
    awayName,
    item.playAsHome as boolean | null | undefined
  );

  const dateTime = String(item.dateTime || item.matchDate || '');
  if (!dateTime) return null;
  const { match_date, match_time } = toMadridParts(dateTime);

  const status = mapOfficialStatus(item.status);
  const score_home = parseScore(item.homeTeamScoreTotal);
  const score_away = parseScore(item.awayTeamScoreTotal);
  const result = computeResult(status, home_away, score_home, score_away);

  const venueName = venue.name ? String(venue.name) : null;
  const city =
    (venue.city as string) ||
    (venue.town as string) ||
    ((venue.address as Record<string, unknown>)?.city as string) ||
    null;
  const country =
    (venue.country as string) ||
    ((venue.address as Record<string, unknown>)?.country as string) ||
    null;

  let score_text: string | null = null;
  if (score_home != null && score_away != null) {
    score_text = `${score_home}-${score_away}`;
  }

  return {
    official_id: item.id ? String(item.id) : item.optaId ? String(item.optaId) : null,
    official_slug: slug,
    match_datetime: dateTime,
    match_date,
    match_time,
    rival,
    home_away,
    competition: String(competition.name || competition.title || 'Competición'),
    competition_slug: competition.slug ? String(competition.slug) : null,
    jornada: item.week != null ? String(item.week) : item.weekAsText ? String(item.weekAsText) : null,
    venue: venueName,
    city,
    country,
    status,
    score_home,
    score_away,
    score_text,
    partial_score: null,
    result,
    official_url: officialMatchUrl(slug),
  };
}

export function categorizeCompetition(name: string): string {
  const n = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (n.includes('euroliga') || n.includes('euroleague')) return 'Euroliga';
  if (n.includes('copa')) return 'Copa del Rey';
  if (n.includes('supercopa')) return 'Supercopa';
  if (n.includes('endesa') || n.includes('acb') || n.includes('liga')) return 'Liga Endesa';
  if (n.includes('amist')) return 'Amistosos';
  return 'Torneos internacionales';
}
