'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Package, ClipboardList,
  Plane, Shirt, Stethoscope, BarChart3, Bell, ChevronLeft,
  ChevronRight, LogOut, Settings, Calendar, Table, ShoppingBag, KeyRound
} from 'lucide-react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { cn } from '@/lib/utils';
import { canAccessMedical, canAccessReports } from '@/lib/permissions';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { useClubBranding } from '@/contexts/ClubDemoContext';
import { useAlerts } from '@/hooks/useAlerts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip';

const NAV_ITEMS = [
  { href: '/',           label: 'Dashboard',    icon: LayoutDashboard, roles: [] },
  { href: '/players',    label: 'Jugadores',     icon: Users,           roles: [] },
  { href: '/inventory',  label: 'Inventario',    icon: Package,         roles: [] },
  { href: '/sizing',     label: 'Tabla de Tallas', icon: Table,         roles: [] },
  { href: '/requests',   label: 'Solicitudes',   icon: ClipboardList,   roles: [] },
  { href: '/trips',      label: 'Viajes',        icon: Plane,           roles: [] },
  { href: '/laundry',    label: 'Lavandería',    icon: Shirt,           roles: [] },
  { href: '/medical',    label: 'Material Médico', icon: Stethoscope,   roles: ['admin', 'equipment_manager', 'medical'] },
  { href: '/reports',    label: 'Informes',      icon: BarChart3,       roles: ['admin', 'equipment_manager'] },
  { href: '/alerts',     label: 'Alertas',       icon: Bell,            roles: [] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, currentTeam, logout, hasPermission, userEmail, hasOperationalAccess, effectiveRole } = useAuth();
  const branding = useClubBranding();
  const { sidebarOpen, toggleSidebar } = useApp();
  const { unreadCount } = useAlerts(currentTeam?.id || DEFAULT_TEAM_ID);

  const userRole = effectiveRole;

  const visibleItems = NAV_ITEMS.filter(item => {
    if (hasOperationalAccess) return true;
    if (item.href === '/medical') return canAccessMedical(userRole, userEmail);
    if (item.href === '/reports') return canAccessReports(userRole, userEmail);
    return item.roles.length === 0 || hasPermission(item.roles);
  });

  const full_name = user?.profile?.full_name || "Carlos Rodriguez Kobe";
  const user_role = user?.profile?.role || "equipment_manager";
  const user_avatar = user?.profile?.avatar_url || undefined;

  return (
    <aside className={cn(
      'flex flex-col h-full bg-slate-900 text-white transition-all duration-300 border-r border-slate-800',
      sidebarOpen ? 'w-64' : 'w-16'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 h-16 shrink-0">
        {sidebarOpen && (
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              <img
                src={branding.logoUrl}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">CourtManager</p>
              <p className="text-xs text-orange-400 leading-none mt-1 uppercase font-bold tracking-wider">Pro ACB</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white hover:bg-slate-800 ml-auto h-8 w-8"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Team selector */}
      {sidebarOpen && currentTeam && (
        <div className="px-4 py-3 border-b border-slate-800 text-left">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">Equipo</p>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: currentTeam.primary_color }}
            />
            <p className="text-sm font-bold truncate">{currentTeam.name}</p>
          </div>
          <p className="text-[10px] text-orange-400 font-bold mt-0.5">{currentTeam.season} · {currentTeam.league}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto text-left">
        <TooltipProvider delayDuration={0}>
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;
            const showBadge = item.href === '/alerts' && unreadCount > 0;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors relative',
                      isActive
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                    {showBadge && (
                      <Badge
                        variant="destructive"
                        className={cn(
                          'text-xs px-1.5 py-0 h-5 min-w-5 flex items-center justify-center font-black',
                          sidebarOpen ? 'ml-auto' : 'absolute -top-1 -right-1'
                        )}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </Link>
                </TooltipTrigger>
                {!sidebarOpen && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Official Calendar Widget */}
      {sidebarOpen && (
        <div className="mx-3 my-1 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-left space-y-1 shrink-0">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
            <span className="text-xs font-black uppercase text-slate-200 tracking-wider">Calendario Oficial</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Fechas oficiales de los partidos del primer equipo de baloncesto.
          </p>
          <Link
            href="/calendario"
            className="block text-center py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold transition-all shadow-md"
          >
            Ver Calendario
          </Link>
        </div>
      )}

      {/* Official Shop Widget */}
      {sidebarOpen && (
        <div className="mx-3 my-1 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-left space-y-1 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="h-3.5 w-3.5 text-orange-400 animate-pulse" />
            <span className="text-xs font-black uppercase text-slate-200 tracking-wider">Tienda Oficial RMB</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Camisetas de juego, jerseis y equipamiento técnico oficial.
          </p>
          <Link
            href="/tienda"
            className="block text-center py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-md"
          >
            Ir a la Tienda
          </Link>
        </div>
      )}

      {/* User section */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-left shrink-0">
        {sidebarOpen ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user_avatar || undefined} />
              <AvatarFallback className="bg-gray-700 text-white text-xs">
                {full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Link href="/cuenta" className="flex-1 min-w-0 group">
              <p className="text-xs font-bold truncate text-slate-100 group-hover:text-orange-300 transition-colors">{full_name}</p>
              <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider font-semibold mt-0.5">{user_role.replace("_", " ")}</p>
            </Link>
            <Link
              href="/cuenta"
              title="Mi cuenta"
              className="inline-flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-850 h-8 w-8 transition-colors"
            >
              <KeyRound className="h-4 w-4" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-slate-400 hover:text-white hover:bg-slate-850 h-8 w-8"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-8 w-8 mx-auto">
              <AvatarFallback className="bg-gray-700 text-white text-xs">
                {full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-slate-400 hover:text-white h-7 w-7"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
