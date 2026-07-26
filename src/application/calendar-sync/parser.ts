import type { MatchHomeAway, MatchResult, MatchStatus } from '@/types';
import type { CalendarSport, OfficialFixture } from './types';

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

export function officialMatchUrl(slug: string, sport: CalendarSport = 'basketball'): string {
  if (sport === 'football') {
    return `https://www.realmadrid.com/es-ES/futbol/primer-equipo/partidos/${slug}`;
  }
  return `https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/partidos/${slug}`;
}

export function isBasketballFirstTeamFixture(f: {
  official_url?: string | null;
  competition?: string | null;
  official_slug?: string | null;
}): boolean {
  const url = (f.official_url || '').toLowerCase();
  const slug = (f.official_slug || '').toLowerCase();
  const competition = (f.competition || '').toLowerCase();
  const blob = `${url} ${slug} ${competition}`;

  if (/futbol|football|soccer|castilla|madrid cff|cantera/i.test(blob)) return false;
  if (/laliga|champions league|uefa europa|premier league|serie a|bundesliga|mundial de clubes/i.test(competition)) {
    return false;
  }

  if (url.includes('/baloncesto/primer-equipo/')) return true;

  if (
    /endesa|euroliga|euroleague|copa del rey|supercopa|amist|basket|baloncesto|acb|intercontinental/i.test(
      competition
    )
  ) {
    return true;
  }

  return url.includes('baloncesto');
}

export function isFootballFirstTeamFixture(f: {
  official_url?: string | null;
  competition?: string | null;
  official_slug?: string | null;
}): boolean {
  const url = (f.official_url || '').toLowerCase();
  const slug = (f.official_slug || '').toLowerCase();
  const competition = (f.competition || '').toLowerCase();
  const blob = `${url} ${slug} ${competition}`;

  if (/baloncesto|basket|castilla|madrid cff|femenino|cantera|juvenil/i.test(blob)) return false;
  if (/endesa|euroliga|euroleague|acb/i.test(competition)) return false;

  if (url.includes('/futbol/primer-equipo')) return true;

  if (
    /laliga|la liga|champions|liga de campeones|copa del rey|supercopa|amist|mundial de clubes|uefa|club world/i.test(
      competition
    )
  ) {
    return true;
  }

  return url.includes('futbol') || /football|soccer/.test(blob);
}

export function mapDiaryItemToFixture(
  item: Record<string, unknown>,
  sport: CalendarSport = 'basketball'
): OfficialFixture | null {
  const slug = String(item.slug || '');
  if (!slug) return null;

  const raw = JSON.stringify(item).toLowerCase();

  if (sport === 'basketball') {
    if (
      raw.includes('futbol') ||
      raw.includes('football') ||
      raw.includes('soccer') ||
      raw.includes('castilla') ||
      raw.includes('madrid-cff') ||
      (raw.includes('deportes/futbol') && !raw.includes('baloncesto'))
    ) {
      if (
        !raw.includes('baloncesto/primer-equipo') &&
        !raw.includes('baloncesto-primer-equipo') &&
        !raw.includes('sports/baloncesto')
      ) {
        return null;
      }
    }
  } else {
    if (
      raw.includes('baloncesto') ||
      raw.includes('basket') ||
      raw.includes('castilla') ||
      raw.includes('madrid-cff') ||
      raw.includes('femenino')
    ) {
      if (
        !raw.includes('futbol/primer-equipo') &&
        !raw.includes('sports/futbol') &&
        !raw.includes('futbol-primer-equipo')
      ) {
        return null;
      }
    }
  }

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

  const fixture: OfficialFixture = {
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
    official_url: officialMatchUrl(slug, sport),
  };

  if (sport === 'football') {
    if (!isFootballFirstTeamFixture(fixture)) return null;
  } else if (!isBasketballFirstTeamFixture(fixture)) {
    return null;
  }
  return fixture;
}

export function categorizeCompetition(
  name: string,
  sport: CalendarSport = 'basketball'
): string {
  const n = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (sport === 'football') {
    if (n.includes('champions') || n.includes('liga de campeones')) return 'Champions League';
    if (n.includes('mundial')) return 'Mundial de Clubes';
    if (n.includes('supercopa de europa') || n.includes('uefa super')) return 'Supercopa de Europa';
    if (n.includes('supercopa')) return 'Supercopa';
    if (n.includes('copa del rey') || (n.includes('copa') && !n.includes('supercopa'))) {
      return 'Copa del Rey';
    }
    if (n.includes('laliga') || n.includes('la liga') || n.includes('liga ea') || n.includes('primera division')) {
      return 'LaLiga';
    }
    if (n.includes('amist')) return 'Amistosos';
    return 'Torneos internacionales';
  }

  if (n.includes('euroliga') || n.includes('euroleague')) return 'Euroliga';
  if (n.includes('copa')) return 'Copa del Rey';
  if (n.includes('supercopa')) return 'Supercopa';
  if (n.includes('endesa') || n.includes('acb') || n.includes('liga')) return 'Liga Endesa';
  // Amistosos / pretemporada (Costa del Sol, etc.)
  if (n.includes('amist') || n.includes('torneo') || n.includes('pretempor')) return 'Amistosos';
  return 'Torneos internacionales';
}
