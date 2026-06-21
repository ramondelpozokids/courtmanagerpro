'use client';

import React, { createContext, useState, useEffect, useCallback, useContext, type ReactNode } from 'react';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import type { Profile, Team, UserTeam, LoginForm, RegisterForm, UserRole } from '@/types';
import type { Session } from '@supabase/supabase-js';
import {
  findMockCredential,
  setAuthCookies,
  clearAuthCookies,
  ROLE_COOKIE,
  AUTH_COOKIE,
} from '@/lib/auth-credentials';
import { canModifyProject, hasFullClubAccess } from '@/lib/permissions';
import { loginWithPasskey } from '@/lib/passkey-client';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { isDemoMode } from '@/lib/app-mode';
import { buildFallbackProductionUser, enrichProfileForApp } from '@/lib/production-auth-fallback';

// Extend UserRole with superadmin
export type ExtendedRole = UserRole | 'superadmin' | 'staff' | 'consulta';

interface AuthContextValue {
  user: any | null;
  session: Session | null;
  loading: boolean;
  currentTeam: Team | null;
  setCurrentTeam: (team: Team) => void;
  login: (form: LoginForm) => Promise<void>;
  loginWithBiometric: (email: string) => Promise<void>;
  register: (form: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  hasPermission: (roles: string[]) => boolean;
  switchRole: (role: ExtendedRole) => void;
  buildUserFromRole: (role: ExtendedRole, profileOverrides?: Partial<Profile>) => any;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export type AppRole = ExtendedRole;

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

const defaultMockProfile: Profile = {
  id: "u_manager",
  email: "charlie-r-k@hotmail.com",
  full_name: "Carlos Rodriguez Kobe",
  avatar_url: "/images/carlos_kobe.png",
  role: "equipment_manager",
  phone: "+34 622 991 928",
  department: "Utilería Principal",
  is_active: true,
  preferences: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};


const defaultMockTeam: Team = {
  id: DEFAULT_TEAM_ID,
  name: "Real Madrid Baloncesto",
  short_name: "RMB",
  logo_url: null,
  primary_color: "#FFFFFF", // Real Madrid White
  secondary_color: "#2C3E50", // Royal Blue
  season: "2025-2026",
  league: "ACB",
  is_active: true,
  metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const defaultMockUserTeams: UserTeam[] = [
  {
    team: defaultMockTeam,
    role: "equipment_manager",
    is_active: true
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTeam, setCurrentTeamState] = useState<Team | null>(null);

  const supabase = getSupabaseClient() as any;
  const mockAuth = isDemoMode();

  const loadUserData = useCallback(async (userId: string, authEmail?: string | null) => {
    try {
      const [profileResult, teamsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase
          .from('user_teams')
          .select('*, team:teams(*)')
          .eq('user_id', userId)
          .eq('is_active', true),
      ]);

      if (profileResult.error || !profileResult.data) {
        return buildFallbackProductionUser(supabase, userId, authEmail || '');
      }

      const profile = enrichProfileForApp(profileResult.data as Profile);
      const userTeams = (teamsResult.data || []) as unknown as UserTeam[];
      const teams = userTeams.map((ut: any) => ut.team).filter(Boolean) as Team[];

      const storedTeamId = typeof window !== 'undefined' ? localStorage.getItem('currentTeamId') : null;
      const defaultTeam = storedTeamId ? teams.find(t => t.id === storedTeamId) || teams[0] : teams[0];

      return {
        id: userId,
        email: profile.email,
        profile,
        teams: userTeams,
        currentTeam: defaultTeam || null,
      };
    } catch (err) {
      console.error("Error loading user data from Supabase:", err);
      return null;
    }
  }, [supabase]);

  // Role switching — solo roles internos autorizados (sin jugador ni invitado)
  const buildUserFromRole = useCallback((role: ExtendedRole, profileOverrides?: Partial<Profile>) => {
    let name = "Carlos Rodriguez Kobe";
    let email = "charlie-r-k@hotmail.com";
    let avatar_url: string | undefined = "/images/carlos_kobe.png";

    if (role === "superadmin") {
      name = "Ramón del Pozo Rott";
      email = "info@ramondelpozorott.es";
      avatar_url = "/images/ramon-del-pozo.png";
    } else if (role === "admin") {
      name = "Carlos Rodriguez Kobe";
      email = "charlie-r-k@hotmail.com";
      avatar_url = "/images/carlos_kobe.png";
    } else if (role === "assistant") {
      name = "Marta López";
      email = "marta.lopez@realmadrid.com";
      avatar_url = undefined;
    } else if (role === "medical") {
      name = "Dr. Xavier Flores";
      email = "dr.flores@realmadrid.com";
      avatar_url = undefined;
    } else if (role === "coach") {
      name = "Sergio Scariolo";
      email = "scariolo@realmadrid.com";
      avatar_url = undefined;
    } else if (role === "staff") {
      name = "Asistente Técnico";
      email = "staff@realmadrid.com";
      avatar_url = undefined;
    }

    const updatedProfile: Profile = {
      ...defaultMockProfile,
      role: role === "superadmin" ? "admin" : (role as UserRole),
      full_name: profileOverrides?.full_name || name,
      email: profileOverrides?.email || email,
      avatar_url: profileOverrides?.avatar_url || avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
    };

    return {
      id: "u_" + role,
      email: updatedProfile.email,
      profile: { ...updatedProfile, role },
      teams: [{ team: defaultMockTeam, role: role === "superadmin" ? "admin" : (role as UserRole), is_active: true }],
      currentTeam: defaultMockTeam,
    };
  }, []);

  const switchRole = useCallback((role: ExtendedRole) => {
    const currentRole = user?.profile?.role;
    const email = user?.profile?.email ?? user?.email;
    if (!canModifyProject(currentRole, email)) {
      throw new Error('Solo el superadmin (Ramón) puede cambiar la configuración del proyecto.');
    }
    const userData = buildUserFromRole(role);
    setUser(userData);
    setCurrentTeamState(defaultMockTeam);
    setAuthCookies(role);
  }, [buildUserFromRole, user]);

  const restoreMockSession = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const hasAuth = document.cookie.includes(`${AUTH_COOKIE}=1`);
    const roleMatch = document.cookie.match(new RegExp(`${ROLE_COOKIE}=([^;]+)`));
    if (!hasAuth || !roleMatch) return false;
    const role = roleMatch[1] as ExtendedRole;
    const userData = buildUserFromRole(role);
    setUser(userData);
    setCurrentTeamState(defaultMockTeam);
    return true;
  }, [buildUserFromRole]);

  useEffect(() => {
    if (mockAuth) {
      restoreMockSession();
      setLoading(false);
      return;
    }

    // Live Supabase Auth with Exception safety guard
    let subscription: any = null;
    try {
      supabase.auth.getSession().then(async ({ data: { session } }: any) => {
        setSession(session);
        if (session?.user) {
          const userData = await loadUserData(session.user.id, session.user.email);
          setUser(userData);
          if (userData?.currentTeam) setCurrentTeamState(userData.currentTeam);
        } else {
          setUser(null);
          setCurrentTeamState(null);
        }
        setLoading(false);
      }).catch((e: any) => {
        console.error("Session fetch failed:", e);
        setUser(null);
        setLoading(false);
      });

      const res = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
        setSession(session);
        if (session?.user) {
          const userData = await loadUserData(session.user.id, session.user.email);
          setUser(userData);
          if (userData?.currentTeam) setCurrentTeamState(userData.currentTeam);
        } else {
          setUser(null);
          setCurrentTeamState(null);
        }
      });
      subscription = res?.data?.subscription;
    } catch (err) {
      console.error("Supabase Auth initialization failed:", err);
      setLoading(false);
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
  }, [loadUserData, mockAuth, supabase, restoreMockSession]);

  const login = useCallback(async ({ email, password }: LoginForm) => {
    if (mockAuth) {
      const cred = findMockCredential(email, password);
      if (!cred) throw new Error('Email o contraseña incorrectos.');
      const userData = buildUserFromRole(cred.role, {
        full_name: cred.full_name,
        email: cred.email,
        avatar_url: cred.avatar_url,
      });
      setUser(userData);
      setCurrentTeamState(defaultMockTeam);
      setAuthCookies(cred.role);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, [mockAuth, supabase, buildUserFromRole]);

  const loginWithBiometric = useCallback(async (email: string) => {
    const result = await loginWithPasskey(email);

    if (mockAuth) {
      const userData = buildUserFromRole(result.role as ExtendedRole, {
        full_name: result.full_name,
        email: result.email,
        avatar_url: result.avatar_url,
      });
      setUser(userData);
      setCurrentTeamState(defaultMockTeam);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('No se pudo iniciar sesión tras el acceso biométrico.');
    }
    const userData = await loadUserData(session.user.id);
    if (!userData) {
      throw new Error('No se encontró el perfil del usuario.');
    }
    setSession(session);
    setUser(userData);
    if (userData.currentTeam) setCurrentTeamState(userData.currentTeam);
  }, [mockAuth, supabase, buildUserFromRole, loadUserData]);

  const register = useCallback(async ({ email, password, full_name, role }: RegisterForm) => {
    if (mockAuth) {
      const userData = buildUserFromRole(role || 'assistant', { full_name, email });
      setUser(userData);
      setCurrentTeamState(defaultMockTeam);
      setAuthCookies(role || 'assistant');
      return;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, email, full_name, role: role || 'assistant' });
      if (profileError) throw new Error(profileError.message);
    }
  }, [mockAuth, supabase]);

  const logout = useCallback(async () => {
    clearAuthCookies();
    if (mockAuth) {
      setUser(null);
      setCurrentTeamState(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }
    await supabase.auth.signOut();
    localStorage.removeItem('currentTeamId');
    setUser(null);
    setCurrentTeamState(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, [mockAuth, supabase]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return;
    if (mockAuth) {
      setUser((prev: any) => prev ? { ...prev, profile: { ...prev.profile, ...updates } } : null);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    setUser((prev: any) => prev ? { ...prev, profile: data as Profile } : null);
  }, [user, mockAuth, supabase]);

  const setCurrentTeam = useCallback((team: Team) => {
    setCurrentTeamState(team);
    localStorage.setItem('currentTeamId', team.id);
    setUser((prev: any) => prev ? { ...prev, currentTeam: team } : null);
  }, []);

  const hasPermission = useCallback((roles: string[]): boolean => {
    if (!user || !currentTeam) return false;
    const userRole = user?.profile?.role || "assistant";
    const email = user?.profile?.email ?? user?.email;
    if (hasFullClubAccess(userRole, email)) return true;
    const userTeam = user.teams.find((ut: any) => (ut.team as unknown as Team).id === currentTeam.id);
    return userTeam ? roles.includes(userTeam.role) : false;
  }, [user, currentTeam]);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      currentTeam,
      setCurrentTeam,
      login,
      loginWithBiometric,
      register,
      logout,
      updateProfile,
      hasPermission,
      switchRole,
      buildUserFromRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
