import type { Profile, Team, UserTeam } from '@/types';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { CARLOS_EMAIL, isSuperadminUser, SUPERADMIN_EMAIL } from '@/lib/permissions';

export type AppProfile = Omit<Profile, 'role'> & { role: Profile['role'] | 'superadmin' };

/** Perfil en memoria con rol superadmin cuando corresponde (enum SQL solo tiene admin). */
export function enrichProfileWithSuperadmin(profile: Profile, authEmail?: string | null): AppProfile {
  const sessionEmail = normalizeEmail(authEmail);
  const merged: Profile = {
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

  const currentTeam = (team as Team | null) ?? null;

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
        role: role === 'superadmin' ? 'admin' : (role as UserTeam['role']),
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
