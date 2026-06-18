"use client";

import { usePlayers } from "@/hooks/usePlayers";
import { useInventory } from "@/hooks/useInventory";
import { useRequests } from "@/hooks/useRequests";
import { useTrips } from "@/hooks/useTrips";
import { useAuth } from "@/contexts/AuthContext";
import { KPICard } from "@/components/dashboard/KPICard";
import AlertsWidget from "@/components/dashboard/AlertsWidget";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";
import { Users, Package, FileText, Plane, ShoppingBag } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { players } = usePlayers();
  const { items } = useInventory();
  const { requests } = useRequests();
  const { trips } = useTrips();

  // Compute actual KPIs dynamically
  const totalPlayers = players.length;
  const totalStock = items.reduce((acc, item) => acc + item.stock_available, 0);
  const pendingRequests = requests.filter((r) => r.status === "pendiente" || r.status === "aprobada").length;
  const planningTripsCount = trips.filter((t) => t.status === "PLANNING" || t.status === "READY" || (t.status as any) === "planificado" || (t.status as any) === "en_preparacion").length;

  return (
    <div className="space-y-6">
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
    </div>
  );
}
