"use client";

import { useState } from "react";
import { usePlayers } from "@/hooks/usePlayers";
import { useInventory } from "@/hooks/useInventory";
import { useRequests } from "@/hooks/useRequests";
import { useTrips } from "@/hooks/useTrips";
import { useAuth } from "@/contexts/AuthContext";
import { useClubBranding, useClubBlog } from "@/contexts/ClubDemoContext";
import { KPICard } from "@/components/dashboard/KPICard";
import AlertsWidget from "@/components/dashboard/AlertsWidget";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";
import { Users, Package, FileText, Plane, ShoppingBag, Trophy, Landmark } from "lucide-react";

export default function DashboardPage() {
  const { user, currentTeam } = useAuth();
  const branding = useClubBranding();
  const blog = useClubBlog();
  const teamId = currentTeam?.id;
  const { players } = usePlayers(teamId);
  const { items } = useInventory(teamId);
  const { requests } = useRequests(teamId);
  const { trips } = useTrips();
  const [blogTab, setBlogTab] = useState<"equipacion" | "history" | "palmares">("equipacion");

  // Compute actual KPIs dynamically
  const totalPlayers = players.length;
  const totalStock = items.reduce((acc, item) => acc + item.stock_available, 0);
  const pendingRequests = requests.filter((r) => r.status === "pendiente" || r.status === "aprobada").length;
  const planningTripsCount = trips.filter((t) => t.status === "PLANNING" || t.status === "READY" || (t.status as any) === "planificado" || (t.status as any) === "en_preparacion").length;

  return (
    <div className="space-y-6">
      
      {/* Massive Centered Premium Hero Image */}
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-7xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950">
          <img
            src={branding.heroUrl}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200';
            }}
            alt={`CourtManager Pro — ${branding.name}`}
            className="w-full h-auto object-contain mx-auto block max-h-[550px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8 text-left">
            <div>
              <span
                className="text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded shadow-lg"
                style={{ backgroundColor: branding.accentColor }}
              >
                {branding.tagline}
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-white mt-3 leading-tight drop-shadow flex items-center gap-2.5">
                <img src={branding.logoUrl} alt="Logo" className="h-8 w-8 object-contain shrink-0" />
                <span>CourtManager Pro — {branding.name}</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 to-orange-900/60 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-lg text-left">
        <span className="bg-orange-500/20 text-orange-400 font-semibold px-2.5 py-1 rounded-full text-xs tracking-wider uppercase border border-orange-500/30">
          Liga Endesa 2025/2026
        </span>
        <h2 className="text-2xl md:text-3.5xl font-extrabold mt-3 tracking-tight">
          ¡Hola de nuevo, <span className="text-orange-400">{user?.profile?.full_name || "Carlos"}</span>!
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-xl">
          Bienvenido al centro de mando de utilería de CourtManager Pro. Controla el inventario, prepara las maletas para los viajes profesionales y gestiona las solicitudes de los jugadores.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Fichas de Jugadores"
          value={totalPlayers}
          subtitle="Jugadores ACB registrados"
          icon={Users}
          trend={{ value: 4.8, label: "este mes" }}
          variant="default"
        />
        <KPICard
          title="Stock Total Utilería"
          value={`${totalStock} uds`}
          subtitle="Camisetas, balones, calzado..."
          icon={Package}
          trend={{ value: -1.2, label: "hoy" }}
          variant="default"
        />
        <KPICard
          title="Peticiones Activas"
          value={pendingRequests}
          subtitle="Solicitudes pendientes de entrega"
          icon={FileText}
          variant="warning"
        />
        <KPICard
          title="Viajes en Cursada"
          value={`${planningTripsCount} viajes`}
          subtitle="Logística de maletas y equipaje"
          icon={Plane}
          variant="success"
        />
      </div>

      {/* Dashboard Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts & Urgent Updates */}
        <div className="lg:col-span-2 space-y-6">
          <AlertsWidget />
          <ActivityFeed />
        </div>

        {/* Quick Actions & Tasks */}
        <div className="space-y-6">
          <QuickActions />
          
          {/* Quick status box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white text-left">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest">Estado del Pabellón</h4>
            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Temperatura Almacén Principal:</span>
                <span className="font-bold text-emerald-400">21°C (Óptima)</span>
              </div>
              <div className="flex justify-between">
                <span>Humedad relativa:</span>
                <span className="font-bold text-emerald-400">45%</span>
              </div>
              <div className="flex justify-between">
                <span>Conectividad de básculas:</span>
                <span className="font-bold text-emerald-400">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span>Sincronización PWA offline:</span>
                <span className="font-bold text-orange-400">ACTIVA (Local)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Club Portal: News, History & Apparel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-left space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-850 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Landmark className="h-5.5 w-5.5 text-orange-500 animate-pulse" />
              {blog.portalTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{blog.portalSubtitle}</p>
          </div>

          {/* Tabs selector */}
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
            <button
              onClick={() => setBlogTab("equipacion")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                blogTab === "equipacion"
                  ? "bg-white dark:bg-slate-800 text-orange-600 shadow-sm border border-slate-100 dark:border-slate-700/50"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              Colección 25/26
            </button>
            <button
              onClick={() => setBlogTab("history")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                blogTab === "history"
                  ? "bg-white dark:bg-slate-800 text-orange-600 shadow-sm border border-slate-100 dark:border-slate-700/50"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              Década Dorada
            </button>
            <button
              onClick={() => setBlogTab("palmares")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                blogTab === "palmares"
                  ? "bg-white dark:bg-slate-800 text-orange-600 shadow-sm border border-slate-100 dark:border-slate-700/50"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              Palmarés (2021-2030)
            </button>
          </div>
        </div>

        {/* Tab 1: Equipaciones */}
        {blogTab === "equipacion" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-orange-50/20 dark:bg-orange-950/5 border border-orange-100/50 dark:border-orange-950/10 p-4 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-orange-600 font-bold block text-sm mb-1">{blog.equipacionTitle}</strong>
              {blog.equipacionDescription}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {blog.equipacionItems.map((item) => (
              <div key={item.name} className="border border-slate-100 dark:border-slate-800/80 rounded-xl p-3 bg-slate-50/30 dark:bg-slate-900/30 space-y-2 text-center">
                <div className="aspect-square rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform hover:scale-105" />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-[11px] text-slate-700 dark:text-slate-200 leading-tight truncate">{item.name}</h4>
                  <span className="text-[10px] text-orange-500 font-bold">{item.price}</span>
                </div>
              </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Historia */}
        {blogTab === "history" && (
          <div className="space-y-4 animate-in fade-in duration-200 text-xs text-slate-650 dark:text-slate-300">
            <div className="p-4.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl space-y-2 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-100 text-sm font-extrabold block">{blog.historyTitle}</strong>
              {blog.historyIntro.map((para, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{para.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
              ))}
            </div>
            <div className="space-y-4 pt-1">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Hitos destacados:</h4>
              <div className="relative border-l-2 border-orange-100 dark:border-orange-950/40 ml-2.5 pl-5 space-y-5">
                {blog.timeline.map((item, i) => (
                <div key={i} className="relative">
                  <span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-900 ${i === 2 ? 'animate-pulse' : ''}`} />
                  <strong className="text-slate-855 dark:text-slate-100 font-bold block">{item.title}</strong>
                  <p className="mt-1 leading-relaxed text-slate-500 dark:text-slate-400">{item.description}</p>
                </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {blogTab === "palmares" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm mb-2">Cuadro de Honor</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {blog.palmares.map((item) => (
              <div key={item.label} className="bg-orange-50/10 dark:bg-slate-800/40 p-5 rounded-2xl border border-orange-100/40 dark:border-slate-800 text-center space-y-1">
                <Trophy className="h-8 w-8 text-orange-500 mx-auto" />
                <span className="text-3xl font-black text-slate-800 dark:text-white block">{item.count}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{item.label}</span>
                <span className="text-[9px] text-orange-500 font-semibold block">{item.detail}</span>
              </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
