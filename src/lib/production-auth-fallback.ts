import type { Profile, Team, UserTeam } from '@/types';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { CARLOS_EMAIL, isSuperadminUser, SUPERADMIN_EMAIL } from '@/lib/permissions';

export type AppProfile = Omit<Profile, 'role'> & { role: Profile['role'] | 'superadmin' };

const DEFAULT_SUPERADMIN_TEAM: Team = {
  id: DEFAULT_TEAM_ID,
  name: 'Real Madrid Baloncesto',
  short_name: 'RMB',
  logo_url: null,
  primary_color: '#FFFFFF',
  secondary_color: '#2C3E50',
  season: '2025-2026',
  league: 'ACB',
  is_active: true,
  metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Usuario SuperAdmin garantizado sin consultas a BD (RLS, profiles, teams).
 * Ramón del Pozo Rott nunca queda bloqueado por fallos de carga de perfil.
 */
export function buildGuaranteedSuperadminUser(userId: string, authEmail?: string | null) {
  const sessionEmail = normalizeEmail(authEmail);
  if (!isSuperadminUser(null, sessionEmail)) return null;

  const profile: AppProfile = {
    id: userId,
    email: SUPERADMIN_EMAIL,
    full_name: 'Ramón del Pozo Rott',
    avatar_url: '/images/ramon-del-pozo.png',
    role: 'superadmin',
    phone: null,
    department: 'Superadmin',
    is_active: true,
    preferences: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const userTeams: UserTeam[] = [{
    team: DEFAULT_SUPERADMIN_TEAM,
    role: 'equipment_manager',
    is_active: true,
  }];

  return {
    id: userId,
    email: SUPERADMIN_EMAIL,
    profile,
    teams: userTeams,
    currentTeam: DEFAULT_SUPERADMIN_TEAM,
  };
}

/** Perfil en memoria con rol superadmin cuando corresponde (enum SQL solo tiene admin). */
export function enrichProfileWithSuperadmin(profile: Profile | AppProfile, authEmail?: string | null): AppProfile {
  const sessionEmail = normalizeEmail(authEmail);
  const merged: AppProfile = {
    ...profile,
    email: sessionEmail ?? profile.email ?? '',
  };

  if (isSuperadminUser(null, sessionEmail) || isSuperadminUser(null, merged.email)) {
    return {
      ...merged,
      role: 'superadmin',
      email: SUPERADMIN_EMAIL,
      full_name: merged.full_name || 'Ramón del Pozo Rott',
      avatar_url: merged.avatar_url || '/images/ramon-del-pozo.png',
      department: merged.department || 'Superadmin',
    };
  }
  return merged as AppProfile;
}

/** SuperAdmin con el mismo acceso operativo que Carlos (equipment_manager + equipo RMB). */
export function normalizeSuperadminLikeCarlos(
  userData: {
    id: string;
    email?: string;
    profile: AppProfile | Profile;
    teams?: UserTeam[];
    currentTeam?: Team | null;
  },
  authEmail?: string | null
) {
  const profile = enrichProfileWithSuperadmin(userData.profile, authEmail);
  const team = userData.currentTeam ?? userData.teams?.[0]?.team ?? DEFAULT_SUPERADMIN_TEAM;
  const teams: UserTeam[] = userData.teams?.length
    ? userData.teams.map((ut) => ({ ...ut, role: 'equipment_manager' as UserTeam['role'] }))
    : [{ team, role: 'equipment_manager', is_active: true }];

  return {
    ...userData,
    email: SUPERADMIN_EMAIL,
    profile,
    teams,
    currentTeam: team,
  };
}

function normalizeEmail(email?: string | null): string | null {
  return email?.trim().toLowerCase() ?? null;
}

/** @deprecated Use enrichProfileWithSuperadmin */
export function enrichProfileForApp(profile: Profile): AppProfile {
  return enrichProfileWithSuperadmin(profile, profile.email);
}

function isKnownProductionEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized === SUPERADMIN_EMAIL || normalized === CARLOS_EMAIL;
}

/** Usuario de respaldo cuando Auth existe pero falta fila en profiles/user_teams. */
export async function buildFallbackProductionUser(
  supabase: { from: (table: string) => any },
  userId: string,
  email: string
) {
  const normalized = email.trim().toLowerCase();
  if (!isKnownProductionEmail(normalized)) return null;

  let full_name = 'Usuario';
  let avatar_url: string | null = null;
  let role: AppProfile['role'] = 'admin';
  let department = 'Administración';

  if (isSuperadminUser(null, normalized)) {
    full_name = 'Ramón del Pozo Rott';
    avatar_url = '/images/ramon-del-pozo.png';
    role = 'superadmin';
    department = 'Superadmin';
  } else if (normalized === CARLOS_EMAIL) {
    full_name = 'Carlos Rodriguez Kobe';
    avatar_url = '/images/carlos_kobe.png';
    role = 'equipment_manager';
    department = 'Utilería Principal';
  }

  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('id', DEFAULT_TEAM_ID)
    .maybeSingle();

  const currentTeam =
    (team as Team | null)
    ?? (isSuperadminUser(null, normalized) ? DEFAULT_SUPERADMIN_TEAM : null);

  const profile: AppProfile = {
    id: userId,
    email: normalized,
    full_name,
    avatar_url,
    role,
    phone: null,
    department,
    is_active: true,
    preferences: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const userTeams: UserTeam[] = currentTeam
    ? [{
        team: currentTeam,
        role: role === 'superadmin' ? 'equipment_manager' : (role as UserTeam['role']),
        is_active: true,
      }]
    : [];

  return {
    id: userId,
    email: normalized,
    profile,
    teams: userTeams,
    currentTeam,
  };
}
