'use client';

import React, { createContext, useState, useEffect, useCallback, useContext, type ReactNode } from 'react';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import type { AuthUser, Profile, Team, UserTeam, LoginForm, RegisterForm, UserRole } from '@/types';
import type { Session } from '@supabase/supabase-js';

// Extend UserRole with superadmin
export type ExtendedRole = UserRole | 'superadmin' | 'staff' | 'consulta';

interface AuthContextValue {
  user: any | null;
  session: Session | null;
  loading: boolean;
  currentTeam: Team | null;
  setCurrentTeam: (team: Team) => void;
  login: (form: LoginForm) => Promise<void>;
  register: (form: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  hasPermission: (roles: string[]) => boolean;
  switchRole: (role: ExtendedRole) => void; // Interactive role switcher
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
  email: "carlos.kobe@realmadrid.com",
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
  id: "team-acb-123",
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
  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

  const loadUserData = useCallback(async (userId: string) => {
    const [profileResult, teamsResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase
        .from('user_teams')
        .select('*, team:teams(*)')
        .eq('user_id', userId)
        .eq('is_active', true),
    ]);

    if (profileResult.error || !profileResult.data) return null;
    const profile = profileResult.data as Profile;
    const userTeams = (teamsResult.data || []) as unknown as UserTeam[];
    const teams = userTeams.map((ut: any) => ut.team).filter(Boolean) as Team[];

    const storedTeamId = localStorage.getItem('currentTeamId');
    const defaultTeam = storedTeamId ? teams.find(t => t.id === storedTeamId) || teams[0] : teams[0];

    return {
      id: userId,
      email: profile.email,
      profile,
      teams: userTeams,
      currentTeam: defaultTeam || null
    };
  }, [supabase]);

  // Role switching function for interactive Arena AI playground testing!
  const switchRole = useCallback((role: ExtendedRole) => {
    let name = "Carlos Rodriguez Kobe";
    let email = "carlos.kobe@realmadrid.com";

    if (role === "superadmin") {
      name = "Ramón del Pozo";
      email = "ramon.delpozo@realmadrid.com";
    } else if (role === "admin") {
      name = "Carlos Rodriguez Kobe";
      email = "carlos.kobe@realmadrid.com";
    } else if (role === "assistant") {
      name = "Marta López";
      email = "marta.lopez@realmadrid.com";
    } else if (role === "player") {
      name = "Facundo Campazzo";
      email = "facu@campazzo.com";
    } else if (role === "medical") {
      name = "Dr. Xavier Flores";
      email = "dr.flores@realmadrid.com";
    } else if (role === "coach") {
      name = "Sergio Scariolo";
      email = "scariolo@realmadrid.com";
    } else if (role === "staff") {
      name = "Asistente Técnico";
      email = "staff@realmadrid.com";
    } else if (role === "consulta") {
      name = "Usuario Invitado";
      email = "guest@realmadrid.com";
    }

    const updatedProfile: Profile = {
      ...defaultMockProfile,
      role: role === "superadmin" ? "admin" : (role as any), // Map to base role for compatibility
      full_name: name,
      email,
      avatar_url: role === "superadmin" ? "/images/ramon_del_pozo.png" : role === "admin" ? "/images/carlos_kobe.png" : `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`
    };

    setUser({
      id: role === "player" ? "p1" : "u_" + role,
      email,
      profile: {
        ...updatedProfile,
        role: role // Keep extended role in object
      },
      teams: [{ team: defaultMockTeam, role: role === "superadmin" ? "admin" : (role as any), is_active: true }],
      currentTeam: defaultMockTeam
    });
  }, []);

  useEffect(() => {
    if (isMockMode) {
      // Mock loading Carlos Rodriguez Kobe as default interactive user
      setUser({
        id: "u_manager",
        email: defaultMockProfile.email,
        profile: defaultMockProfile,
        teams: defaultMockUserTeams,
        currentTeam: defaultMockTeam
      });
      setCurrentTeamState(defaultMockTeam);
      setLoading(false);
      return;
    }

    // Live Supabase Auth
    supabase.auth.getSession().then(async ({ data: { session } }: any) => {
      setSession(session);
      if (session?.user) {
        const userData = await loadUserData(session.user.id);
        setUser(userData);
        if (userData?.currentTeam) setCurrentTeamState(userData.currentTeam);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      setSession(session);
      if (session?.user) {
        const userData = await loadUserData(session.user.id);
        setUser(userData);
        if (userData?.currentTeam) setCurrentTeamState(userData.currentTeam);
      } else {
        setUser(null);
        setCurrentTeamState(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserData, isMockMode, supabase]);

  const login = useCallback(async ({ email, password }: LoginForm) => {
    if (isMockMode) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, [isMockMode, supabase]);

  const register = useCallback(async ({ email, password, full_name, role }: RegisterForm) => {
    if (isMockMode) return;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, email, full_name, role: role || 'assistant' });
      if (profileError) throw new Error(profileError.message);
    }
  }, [isMockMode, supabase]);

  const logout = useCallback(async () => {
    if (isMockMode) {
      setUser(null);
      setCurrentTeamState(null);
      return;
    }
    await supabase.auth.signOut();
    localStorage.removeItem('currentTeamId');
    setUser(null);
    setCurrentTeamState(null);
  }, [isMockMode, supabase]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return;
    if (isMockMode) {
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
  }, [user, isMockMode, supabase]);

  const setCurrentTeam = useCallback((team: Team) => {
    setCurrentTeamState(team);
    localStorage.setItem('currentTeamId', team.id);
    setUser((prev: any) => prev ? { ...prev, currentTeam: team } : null);
  }, []);

  const hasPermission = useCallback((roles: string[]): boolean => {
    if (!user || !currentTeam) return false;
    const userRole = user?.profile?.role || "assistant";
    if (userRole === "superadmin") return true; // Superadmin has universal bypass permissions!
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
      register,
      logout,
      updateProfile,
      hasPermission,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}
