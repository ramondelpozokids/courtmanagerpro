'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Package, ClipboardList,
  Plane, Shirt, Stethoscope, BarChart3, Bell, ChevronLeft,
  ChevronRight, LogOut, Calendar, Table, KeyRound, HardHat, Warehouse, ClipboardCheck, History
} from 'lucide-react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { cn } from '@/lib/utils';
import { canAccessMedical, canAccessReports, isCarlosUser } from '@/lib/permissions';
import { canAccessEquipmentTeam } from '@/modules/equipment-team';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { useClubBranding } from '@/contexts/ClubDemoContext';
import { useAlerts } from '@/hooks/useAlerts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip';
import { CeoAvatar } from '@/components/layout/CeoAvatar';

/** Orden fijo Ramón + Carlos (no filtrar ni reordenar). */
const NAV_ITEMS = [
  { href: '/',           label: 'Dashboard',    icon: LayoutDashboard, roles: [] },
  { href: '/players',    label: 'Jugadores',     icon: Users,           roles: [] },
  { href: '/sizing',     label: 'Tabla de Tallas', icon: Table,         roles: [] },
  { href: '/inventory',  label: 'Inventario',    icon: Package,         roles: [] },
  { href: '/equipment-team', label: 'Equipo de Utillería', icon: HardHat, roles: [] },
  { href: '/requests',   label: 'Solicitudes',   icon: ClipboardList,   roles: [] },
  { href: '/trips',      label: 'Viajes',        icon: Plane,           roles: [] },
  { href: '/laundry',    label: 'Lavandería',    icon: Shirt,           roles: [] },
  { href: '/medical',    label: 'Material Médico', icon: Stethoscope,   roles: [] },
  { href: '/reports',    label: 'Informes',      icon: BarChart3,       roles: [] },
  { href: '/alerts',     label: 'Alertas',       icon: Bell,            roles: [] },
  { href: '/almacen',    label: 'Almacén general', icon: Warehouse,     roles: [] },
  { href: '/movimientos', label: 'Movimientos', icon: History, roles: [] },
  { href: '/prepartido', label: 'Checklist pre-partido', icon: ClipboardCheck, roles: [] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, currentTeam, logout, hasPermission, userEmail, hasOperationalAccess, effectiveRole, isSuperadmin } = useAuth();
  const branding = useClubBranding();
  const { sidebarOpen, toggleSidebar } = useApp();
  const { unreadCount } = useAlerts(currentTeam?.id || DEFAULT_TEAM_ID);

  const userRole = effectiveRole;
  // Ramón y Carlos: exactamente el mismo menú en el mismo orden
  const sameFullMenu =
    isSuperadmin ||
    hasOperationalAccess ||
    isCarlosUser(userEmail) ||
    isCarlosUser(user?.email) ||
    isCarlosUser(user?.profile?.email);

  const visibleItems = sameFullMenu
    ? [...NAV_ITEMS]
    : NAV_ITEMS.filter((item) => {
        if (item.href === '/medical') return canAccessMedical(userRole, userEmail);
        if (item.href === '/equipment-team') return canAccessEquipmentTeam(userRole, userEmail);
        if (item.href === '/reports') return canAccessReports(userRole, userEmail);
        return item.roles.length === 0 || hasPermission(item.roles);
      });

  const full_name = user?.profile?.full_name || (isSuperadmin ? 'Ramón del Pozo Rott' : 'Carlos Rodriguez Kobe');
  const user_role = user?.profile?.role || (isSuperadmin ? 'superadmin' : 'equipment_manager');
  const isCarlos =
    isCarlosUser(userEmail) ||
    isCarlosUser(user?.email) ||
    isCarlosUser(user?.profile?.email);
  const isRamonAccount =
    isSuperadmin ||
    user_role === 'superadmin' ||
    /ram[oó]n/i.test(full_name) ||
    /ramondelpozo/i.test(String(userEmail || user?.email || ''));

  const seasonLabel = '2026-2027';

  const AvatarPhoto = ({ size = 32 }: { size?: number }) =>
    isRamonAccount ? (
      <CeoAvatar size={size} title={full_name} />
    ) : (
      <span
        className="relative inline-flex shrink-0 overflow-hidden rounded-full border border-slate-700 bg-slate-800"
        style={{ width: size, height: size }}
        title={full_name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/carlos-avatar.png?v=12"
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
      </span>
    );

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
              <p className="text-xs text-orange-400 leading-none mt-1 uppercase font-bold tracking-wider">
                {branding.sport === 'football' ? 'Pro Fútbol' : 'Pro ACB'}
              </p>
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
        <div className="px-4 py-2 border-b border-slate-800 text-left shrink-0">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5 font-bold">Equipo</p>
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: currentTeam.primary_color }}
            />
            <p className="text-sm font-bold truncate">{currentTeam.name}</p>
          </div>
          <p className="text-[10px] text-orange-400 font-bold mt-0.5 truncate">{seasonLabel} · {currentTeam.league}</p>
        </div>
      )}

      {/* Navigation — espacio cómodo; flex-1 + scroll si se añaden más secciones */}
      <nav className="flex-1 min-h-0 py-2 px-2 overflow-y-auto text-left">
        <TooltipProvider delayDuration={0}>
          <div className="flex flex-col gap-1">
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;
              const showBadge = item.href === '/alerts' && unreadCount > 0;

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors relative whitespace-nowrap',
                        isActive
                          ? 'bg-orange-600 text-white shadow-md shadow-orange-600/10'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                      {sidebarOpen && <span className="truncate">{item.label}</span>}
                      {showBadge && (
                        <Badge
                          variant="destructive"
                          className={cn(
                            'text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center font-black',
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
          </div>
        </TooltipProvider>
      </nav>

      {/* Pie fijo: calendario + usuario (fútbol y baloncesto) */}
      <div className="shrink-0 mt-1">
        {sidebarOpen && (
          <div className="mx-2 mb-1.5 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-left space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
              <span className="text-xs font-black uppercase text-slate-200 tracking-wider">
                {branding.sport === 'football' ? 'Calendario Fútbol' : 'Calendario Baloncesto'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-snug">
              Solo primer equipo de{' '}
              {branding.sport === 'football' ? 'fútbol' : 'baloncesto'} de{' '}
              {branding.name} (oficial).
            </p>
            <Link
              href="/calendario"
              className="block text-center py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold transition-all shadow-md"
            >
              Ver Calendario
            </Link>
          </div>
        )}

        <div className="px-3 py-2 border-t border-slate-800 bg-slate-950/20 text-left">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <AvatarPhoto size={28} />
              <Link href="/cuenta" className="flex-1 min-w-0 group">
                <p className="text-xs font-bold truncate text-slate-100 group-hover:text-orange-300 transition-colors">{full_name}</p>
                <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider font-semibold">{user_role.replace("_", " ")}</p>
              </Link>
              <Link
                href="/cuenta"
                title="Mi cuenta"
                className="inline-flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-850 h-7 w-7 transition-colors"
              >
                <KeyRound className="h-3.5 w-3.5" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-slate-400 hover:text-white hover:bg-slate-850 h-7 w-7"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <AvatarPhoto size={28} />
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
      </div>
    </aside>
  );
}
