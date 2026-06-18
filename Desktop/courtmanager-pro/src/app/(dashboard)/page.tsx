"use client";

import { useState } from "react";
import { usePlayers } from "@/hooks/usePlayers";
import { useInventory } from "@/hooks/useInventory";
import { useRequests } from "@/hooks/useRequests";
import { useTrips } from "@/hooks/useTrips";
import { useAuth } from "@/contexts/AuthContext";
import { KPICard } from "@/components/dashboard/KPICard";
import AlertsWidget from "@/components/dashboard/AlertsWidget";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";
import { Users, Package, FileText, Plane, ShoppingBag, Trophy, Landmark } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { players } = usePlayers();
  const { items } = useInventory();
  const { requests } = useRequests();
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
            src="https://assets.realmadrid.com/is/image/realmadrid/ND-COPAS-DE-EUROPA_SALA-DE-JUNTAS_HE02434?$Desktop$&fit=wrap&wid=1440"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200'; // high quality placeholder
            }}
            alt="CourtManager Pro RMB Hero"
            className="w-full h-auto object-contain mx-auto block max-h-[550px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8 text-left">
            <div>
              <span className="text-white text-[10px] sm:text-xs font-black uppercase tracking-widest bg-orange-600 px-3 py-1.5 rounded shadow-lg shadow-orange-600/20">
                Sede Social Real Madrid — Sala de Juntas
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-white mt-3 leading-tight drop-shadow">
                CourtManager Pro — Real Madrid Baloncesto
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

      {/* RMB Portal: News, History & Apparel Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-left space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-850 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Landmark className="h-5.5 w-5.5 text-orange-500 animate-pulse" />
              RMB Portal: Noticias, Historia e Indumentaria
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Ficha editorial, historia de la década y colección técnica oficial del Real Madrid Baloncesto.</p>
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
              <strong className="text-orange-600 font-bold block text-sm mb-1">Camiseta Oficial Real Madrid Baloncesto 25/26</strong>
              Presentamos las camisetas y equipaciones oficiales de baloncesto que usan los jugadores del Real Madrid en competiciones ACB y Euroliga. Diseñadas para el máximo rendimiento deportivo, con tejido transpirable, los detalles dorados tradicionales de la identidad merengue y el escudo termosellado.
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-slate-100 dark:border-slate-800/80 rounded-xl p-3 bg-slate-50/30 dark:bg-slate-900/30 space-y-2 text-center">
                <div className="aspect-square rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <img src="https://shop.realmadrid.com/cdn/shop/files/image_07d5be34-9b06-4afd-9aa9-2bfd0a489720.jpg?v=1768385431&width=832" alt="Camiseta Local" className="w-full h-full object-cover transition-transform hover:scale-105" />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-[11px] text-slate-700 dark:text-slate-200 leading-tight truncate">Camiseta Juego Local</h4>
                  <span className="text-[10px] text-orange-500 font-bold">€85.00</span>
                </div>
              </div>
              <div className="border border-slate-100 dark:border-slate-800/80 rounded-xl p-3 bg-slate-50/30 dark:bg-slate-900/30 space-y-2 text-center">
                <div className="aspect-square rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <img src="https://shop.realmadrid.com/cdn/shop/files/image_b4701b50-3403-4235-ab4f-d74f11c29772.jpg?v=1767814661&width=832" alt="Camiseta Visitante" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">Camiseta Visitante</h4>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">€85.00</span>
                </div>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden p-3.5 bg-slate-50/30 dark:bg-slate-900/50 flex flex-col justify-between">
                <div className="aspect-square w-full rounded overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                  <img src="https://shop.realmadrid.com/cdn/shop/files/image_3e0e5795-0cfe-45e7-8b2d-607ea47a8d94.jpg?v=1768407965&width=832" alt="Pantalón Juego" className="w-full h-full object-cover transition-transform hover:scale-105" />
                </div>
                <div className="text-left mt-2">
                  <h4 className="font-extrabold text-[11px] text-slate-700 dark:text-slate-200 leading-tight truncate">Pantalón Corto Local</h4>
                  <span className="text-[10px] text-orange-500 font-bold">€45.00</span>
                </div>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden p-3.5 bg-slate-50/30 dark:bg-slate-900/50 flex flex-col justify-between">
                <div className="aspect-square w-full rounded overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                  <img src="https://shop.realmadrid.com/cdn/shop/files/image_0dc6e676-5277-4b85-9620-74d9e6e37daa.jpg?v=1768385666&width=832" alt="Chaqueta Calentamiento" className="w-full h-full object-cover transition-transform hover:scale-105" />
                </div>
                <div className="text-left mt-2">
                  <h4 className="font-extrabold text-[11px] text-slate-700 dark:text-slate-200 leading-tight truncate">Cortavientos Técnico</h4>
                  <span className="text-[10px] text-orange-500 font-bold">€95.00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Historia */}
        {blogTab === "history" && (
          <div className="space-y-4 animate-in fade-in duration-200 text-xs text-slate-650 dark:text-slate-300">
            <div className="p-4.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl space-y-2 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-100 text-sm font-extrabold block">Algo de Historia (2021-2030)</strong>
              <p>
                El **21 de mayo de 2023**, el Real Madrid conquistó la **Undécima Copa de Europa** en Kaunas tras derrotar al Olympiacos (78-79) con una canasta para la historia de **Sergio Llull** a falta de tres segundos. Fue el colofón a una Euroliga inolvidable y llena de épica en la que los nuestros levantaron un 0-2 en contra en el playoff contra el Partizán y superaron al Barça en semifinales.
              </p>
              <p className="mt-2">
                En esta década dorada también se han cosechado grandes victorias domésticas: las **Ligas 2021/22, 2023/24 y 2024/25**, la **Copa del Rey 2024** y las **Supercopas 2021, 2022 y 2023**.
              </p>
            </div>

            {/* Interactive Timeline */}
            <div className="space-y-4 pt-1">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Hitos de la Década:</h4>
              <div className="relative border-l-2 border-orange-100 dark:border-orange-950/40 ml-2.5 pl-5 space-y-5">
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-900" />
                  <strong className="text-slate-855 dark:text-slate-100 font-bold block">Septiembre 2021 — 8ª Supercopa de España</strong>
                  <p className="mt-1 leading-relaxed text-slate-500 dark:text-slate-400">Remontada legendaria de 19 puntos en los dos últimos cuartos para vencer al Barcelona por 83-88. Fue el inicio de una campaña brillante que culminaría con la 36ª Liga, con Walter Tavares coronado como MVP de la final (3-1 global).</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-900" />
                  <strong className="text-slate-855 dark:text-slate-100 font-bold block">Septiembre 2022 — Clásico y 5ª Supercopa Consecutiva</strong>
                  <p className="mt-1 leading-relaxed text-slate-500 dark:text-slate-400">Con Chus Mateo liderando el banquillo, el Real Madrid venció al eterno rival (89-83) en un duelo repleto de drama competitivo. Nuevamente, Walter Tavares demostró ser el pilar dominante de la plantilla.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-900 animate-pulse" />
                  <strong className="text-orange-600 font-bold block">21 de Mayo 2023 — La Épica Canasta de Llull y la 11ª Copa de Europa</strong>
                  <p className="mt-1 leading-relaxed text-slate-550 dark:text-slate-400">Un final no apto para cardíacos en el Zalgirio Arena. Tras remontar un histórico 0-2 en contra en playoffs, el equipo se plantó en la final. Llull sentenció el título frente a Olympiacos con su clásica suspensión de media distancia a falta de 3 segundos.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-900" />
                  <strong className="text-slate-855 dark:text-slate-100 font-bold block">Temporada 2023/24 — 10ª Supercopa & 29ª Copa del Rey</strong>
                  <p className="mt-1 leading-relaxed text-slate-500 dark:text-slate-400">Dominio absoluto en Murcia venciendo a Unicaja (81-88) y conquista de la Copa del Rey en el Martín Carpena de Málaga tras ganar al Barcelona en semis.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-900" />
                  <strong className="text-slate-855 dark:text-slate-100 font-bold block">Temporada 2024/25 — La 37ª Liga en Valencia</strong>
                  <p className="mt-1 leading-relaxed text-slate-500 dark:text-slate-400">La temporada de Liga se clausuró de forma magistral superando al Valencia Basket en la final de los playoffs con un rotundo y aplastante 3-0 global.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Palmarés */}
        {blogTab === "palmares" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm mb-2">Cuadro de Honor (2021-2030)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-orange-50/10 dark:bg-slate-800/40 p-5 rounded-2xl border border-orange-100/40 dark:border-slate-800 text-center space-y-1">
                <Trophy className="h-8 w-8 text-orange-500 mx-auto" />
                <span className="text-3xl font-black text-slate-800 dark:text-white block">1</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Copa de Europa</span>
                <span className="text-[9px] text-orange-500 font-semibold block">(2022-23)</span>
              </div>
              <div className="bg-orange-50/10 dark:bg-slate-800/40 p-5 rounded-2xl border border-orange-100/40 dark:border-slate-800 text-center space-y-1">
                <Trophy className="h-8 w-8 text-orange-500 mx-auto" />
                <span className="text-3xl font-black text-slate-800 dark:text-white block">3</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ligas Endesa</span>
                <span className="text-[9px] text-orange-500 font-semibold block">(21/22, 23/24, 24/25)</span>
              </div>
              <div className="bg-orange-50/10 dark:bg-slate-800/40 p-5 rounded-2xl border border-orange-100/40 dark:border-slate-800 text-center space-y-1">
                <Trophy className="h-8 w-8 text-orange-500 mx-auto" />
                <span className="text-3xl font-black text-slate-800 dark:text-white block">1</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Copa del Rey</span>
                <span className="text-[9px] text-orange-500 font-semibold block">(2023-24)</span>
              </div>
              <div className="bg-orange-50/10 dark:bg-slate-800/40 p-5 rounded-2xl border border-orange-100/40 dark:border-slate-800 text-center space-y-1">
                <Trophy className="h-8 w-8 text-orange-500 mx-auto" />
                <span className="text-3xl font-black text-slate-800 dark:text-white block">4</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Supercopas</span>
                <span className="text-[9px] text-orange-500 font-semibold block">(21, 22, 23, 24)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
