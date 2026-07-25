import {
  RMB_OFFICIAL_PLAYERS,
  RMB_OFFICIAL_STAFF,
} from '@/data/rmb-official-roster';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import {
  computeNextBirthday,
  getMadridNowParts,
  isBirthdayTomorrow,
  sortByProximity,
} from './dateUtils';
import type { BirthdayPerson } from './types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isDemoMode } from '@/lib/app-mode';

function fromOfficialBundled(todayIso: string): BirthdayPerson[] {
  const people: BirthdayPerson[] = [];

  for (const p of RMB_OFFICIAL_PLAYERS) {
    if (!p.birth_date) continue;
    const next = computeNextBirthday(p.birth_date, todayIso);
    if (!next) continue;
    people.push({
      id: p.legacyId,
      full_name: p.full_name,
      role: p.position || p.position_demo || 'Jugador',
      person_type: 'player',
      birth_date: p.birth_date,
      photo_url: p.photo_url,
      next_birthday: next.nextIso,
      days_until: next.daysUntil,
      turning_age: next.turningAge,
      official_slug: p.slug,
    });
  }

  for (const s of RMB_OFFICIAL_STAFF) {
    if (!s.birth_date) continue;
    const next = computeNextBirthday(s.birth_date, todayIso);
    if (!next) continue;
    people.push({
      id: s.legacyId,
      full_name: s.full_name,
      role: s.role === 'Entrenador' ? 'Entrenador Principal' : s.role,
      person_type: 'staff',
      birth_date: s.birth_date,
      photo_url: s.photo_url,
      next_birthday: next.nextIso,
      days_until: next.daysUntil,
      turning_age: next.turningAge,
      official_slug: s.slug,
    });
  }

  return sortByProximity(people);
}

function fromInMemory(todayIso: string): BirthdayPerson[] {
  const people: BirthdayPerson[] = [];

  for (const p of db.players as any[]) {
    const birth = p.birthDate || p.birth_date;
    if (!birth) continue;
    const next = computeNextBirthday(String(birth).slice(0, 10), todayIso);
    if (!next) continue;
    people.push({
      id: String(p.id),
      full_name: p.full_name || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
      role: String(p.position || 'Jugador'),
      person_type: 'player',
      birth_date: String(birth).slice(0, 10),
      photo_url: p.photo_url || p.imageUrl || null,
      next_birthday: next.nextIso,
      days_until: next.daysUntil,
      turning_age: next.turningAge,
      official_slug: p.slug || p.official_slug || null,
    });
  }

  for (const s of db.coachingStaff as any[]) {
    const birth = s.birth_date || s.birthDate;
    if (!birth) continue;
    const next = computeNextBirthday(String(birth).slice(0, 10), todayIso);
    if (!next) continue;
    people.push({
      id: String(s.id),
      full_name: String(s.full_name || s.name || ''),
      role: String(s.role || 'Cuerpo técnico'),
      person_type: 'staff',
      birth_date: String(birth).slice(0, 10),
      photo_url: s.photo_url || s.imageUrl || null,
      next_birthday: next.nextIso,
      days_until: next.daysUntil,
      turning_age: next.turningAge,
      official_slug: s.slug || s.official_slug || null,
    });
  }

  return sortByProximity(people);
}

async function fromSupabase(supabase: SupabaseClient, teamId: string, todayIso: string): Promise<BirthdayPerson[]> {
  const people: BirthdayPerson[] = [];

  const [{ data: players }, { data: staff }] = await Promise.all([
    supabase
      .from('players')
      .select('id, full_name, position, birth_date, photo_url, official_slug, is_active')
      .eq('team_id', teamId)
      .eq('is_active', true),
    supabase
      .from('coaching_staff')
      .select('id, full_name, role, photo_url, official_slug, is_active, notes')
      .eq('team_id', teamId)
      .eq('is_active', true),
  ]);

  for (const p of players || []) {
    if (!p.birth_date) continue;
    const next = computeNextBirthday(String(p.birth_date).slice(0, 10), todayIso);
    if (!next) continue;
    people.push({
      id: p.id,
      full_name: p.full_name,
      role: p.position || 'Jugador',
      person_type: 'player',
      birth_date: String(p.birth_date).slice(0, 10),
      photo_url: p.photo_url,
      next_birthday: next.nextIso,
      days_until: next.daysUntil,
      turning_age: next.turningAge,
      official_slug: p.official_slug,
    });
  }

  // Staff birth_date may live in notes/metadata — prefer dedicated column if present via cast
  for (const s of staff || []) {
    const row = s as Record<string, unknown>;
    const birth =
      (row.birth_date as string) ||
      ((row.metadata as Record<string, unknown>)?.birth_date as string) ||
      null;
    // Fall back: match official roster by slug/name
    if (!birth) {
      const official = RMB_OFFICIAL_STAFF.find(
        (o) =>
          o.slug === s.official_slug ||
          o.full_name.toLowerCase() === String(s.full_name).toLowerCase()
      );
      if (!official?.birth_date) continue;
      const next = computeNextBirthday(official.birth_date, todayIso);
      if (!next) continue;
      people.push({
        id: s.id,
        full_name: s.full_name,
        role: s.role || 'Cuerpo técnico',
        person_type: 'staff',
        birth_date: official.birth_date,
        photo_url: s.photo_url || official.photo_url,
        next_birthday: next.nextIso,
        days_until: next.daysUntil,
        turning_age: next.turningAge,
        official_slug: s.official_slug || official.slug,
      });
      continue;
    }
    const next = computeNextBirthday(String(birth).slice(0, 10), todayIso);
    if (!next) continue;
    people.push({
      id: s.id,
      full_name: s.full_name,
      role: s.role || 'Cuerpo técnico',
      person_type: 'staff',
      birth_date: String(birth).slice(0, 10),
      photo_url: s.photo_url,
      next_birthday: next.nextIso,
      days_until: next.daysUntil,
      turning_age: next.turningAge,
      official_slug: s.official_slug,
    });
  }

  return sortByProximity(people);
}

/**
 * Prefer live DB; enrich with official bundled roster so staff birthdays are never lost.
 * Deduplicate by official_slug / normalized name.
 */
export async function collectBirthdayPeople(params: {
  supabase: SupabaseClient | null;
  teamId: string;
  referenceDate?: Date;
}): Promise<BirthdayPerson[]> {
  const todayIso = getMadridNowParts(params.referenceDate).isoDate;

  let base: BirthdayPerson[] = [];
  if (params.supabase && !isDemoMode()) {
    try {
      base = await fromSupabase(params.supabase, params.teamId, todayIso);
    } catch (err) {
      console.warn('[birthday-alerts] supabase roster failed, using official bundle:', err);
      base = fromOfficialBundled(todayIso);
    }
  } else {
    const mem = fromInMemory(todayIso);
    base = mem.length > 0 ? mem : fromOfficialBundled(todayIso);
  }

  // Merge official bundle for anyone missing
  const bundled = fromOfficialBundled(todayIso);
  const keys = new Set(
    base.map((p) => (p.official_slug || p.full_name).toLowerCase())
  );
  for (const b of bundled) {
    const key = (b.official_slug || b.full_name).toLowerCase();
    if (!keys.has(key)) {
      base.push(b);
      keys.add(key);
    }
  }

  return sortByProximity(base);
}

export function filterTomorrowBirthdays(people: BirthdayPerson[], todayIso?: string): BirthdayPerson[] {
  const today = todayIso || getMadridNowParts().isoDate;
  return people.filter((p) => isBirthdayTomorrow(p.birth_date, today));
}

export function getUpcomingBirthdaysList(people: BirthdayPerson[], limit = 12): BirthdayPerson[] {
  return people.filter((p) => p.days_until >= 0).slice(0, limit);
}
