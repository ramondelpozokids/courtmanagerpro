"use client";

import { useAuth, AppRole } from "@/contexts/AuthContext";
import { useAlerts } from "@/hooks/useAlerts";
import { Bell, Shield, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function TopBar() {
  const { user, switchRole } = useAuth();
  const { alerts } = useAlerts();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.is_read);

  const roleLabels: Record<string, string> = {
    admin: "Administrador (Total)",
    equipment_manager: "Utillero Jefe",
    assistant: "Utillero Asistente",
    player: "Jugador (Huertas)",
    medical: "Staff Médico",
    coach: "Entrenador",
  };

  const userRole = user?.profile?.role || "equipment_manager";
  const userName = user?.profile?.full_name || "Carlos Sánchez";
  const userAvatar = user?.profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userName}`;

  return (
    <header className="h-16 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger could go here, but let's keep it clean */}
        <div className="text-sm text-slate-500 font-medium md:block hidden">
          CourtManager Pro <span className="mx-1.5">•</span> Liga Endesa ACB
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Dynamic Role Switcher (Highly interactive feature for demo preview!) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all"
          >
            <Shield className="h-4 w-4 text-orange-500" />
            <span>Rol: <strong className="text-orange-600">{roleLabels[userRole]}</strong></span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-slate-150 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-xl py-1 z-50 animate-fade-in text-sm text-left">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Simular Rol de Usuario
              </div>
              {(Object.keys(roleLabels) as AppRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between text-xs font-medium transition-colors ${
                    userRole === r ? "text-orange-600 font-bold bg-orange-50/50 dark:bg-orange-500/10" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>{roleLabels[r]}</span>
                  {userRole === r && <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alerts Badge */}
        <Link href="/alerts" className="relative p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="h-5 w-5" />
          {unreadAlerts.length > 0 && (
            <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] text-white font-extrabold flex items-center justify-center animate-pulse">
              {unreadAlerts.length}
            </span>
          )}
        </Link>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <img
            src={userAvatar}
            alt={userName}
            className="h-9 w-9 rounded-full bg-orange-100 border border-orange-200"
          />
          <div className="hidden lg:block leading-none text-left">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{userName}</h4>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{userRole.replace("_", " ")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
