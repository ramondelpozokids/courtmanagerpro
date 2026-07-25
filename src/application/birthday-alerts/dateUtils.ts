import type { BirthdayPerson } from './types';

const MADRID_TZ = 'Europe/Madrid';

export function getMadridNowParts(reference = new Date()): {
  year: number;
  month: number;
  day: number;
  hour: number;
  isoDate: string;
} {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: MADRID_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(reference);

  const get = (type: string) => parts.find((p) => p.type === type)?.value || '0';
  const year = Number(get('year'));
  const month = Number(get('month'));
  const day = Number(get('day'));
  let hour = Number(get('hour'));
  if (hour === 24) hour = 0;

  return {
    year,
    month,
    day,
    hour,
    isoDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
}

export function addDaysMadrid(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const utc = Date.UTC(y, m - 1, d + days, 12, 0, 0);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: MADRID_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(utc));
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '0';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function parseBirthDate(raw: string | null | undefined): { month: number; day: number; year: number } | null {
  if (!raw) return null;
  const m = String(raw).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

export function ageTurningOn(birthYear: number, onYear: number): number {
  return onYear - birthYear;
}

export function computeNextBirthday(
  birthDate: string,
  fromIso: string
): { nextIso: string; daysUntil: number; turningAge: number } | null {
  const parsed = parseBirthDate(birthDate);
  if (!parsed) return null;

  const [fy, fm, fd] = fromIso.split('-').map(Number);
  let targetYear = fy;
  let nextIso = `${targetYear}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;

  const candidate = new Date(Date.UTC(targetYear, parsed.month - 1, parsed.day, 12));
  if (candidate.getUTCMonth() + 1 !== parsed.month) {
    nextIso = `${targetYear}-03-01`;
  }

  if (nextIso < fromIso) {
    targetYear = fy + 1;
    const c2 = new Date(Date.UTC(targetYear, parsed.month - 1, parsed.day, 12));
    if (c2.getUTCMonth() + 1 !== parsed.month) {
      nextIso = `${targetYear}-03-01`;
    } else {
      nextIso = `${targetYear}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
    }
  }

  const fromUtc = Date.UTC(fy, fm - 1, fd, 12);
  const [ny, nm, nd] = nextIso.split('-').map(Number);
  const nextUtc = Date.UTC(ny, nm - 1, nd, 12);
  const daysUntil = Math.round((nextUtc - fromUtc) / 86400000);
  const turningAge = ageTurningOn(parsed.year, ny);

  return { nextIso, daysUntil, turningAge };
}

export function isBirthdayTomorrow(birthDate: string, todayIso: string): boolean {
  const tomorrow = addDaysMadrid(todayIso, 1);
  const next = computeNextBirthday(birthDate, todayIso);
  return Boolean(next && next.nextIso === tomorrow);
}

export function formatBirthDateEs(iso: string): string {
  const parsed = parseBirthDate(iso);
  if (!parsed) return iso;
  const d = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day, 12));
  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function buildDedupeKey(personKey: string, birthdayIso: string, recipient: string): string {
  return `${personKey}|${birthdayIso}|${recipient.toLowerCase()}`;
}

export function sortByProximity(people: BirthdayPerson[]): BirthdayPerson[] {
  return [...people].sort((a, b) => a.days_until - b.days_until || a.full_name.localeCompare(b.full_name));
}
