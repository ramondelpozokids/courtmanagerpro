"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Calendar, Sparkles, Landmark, Award } from "lucide-react";

export default function BlogHistoryPage() {
  const milestones = [
    {
      year: "2021",
      title: "8ª Supercopa de España",
      description: "Espectacular remontada de 19 puntos en los dos últimos cuartos para vencer al Barcelona por 83-88. Fue el comienzo de una campaña brillante que terminó con un nuevo título de Liga."
    },
    {
      year: "2022",
      title: "36ª Liga y MVP Tavares",
      description: "El rival por la 36ª Liga volvió a ser el Barcelona. El Real Madrid se impuso por un contundente global de 3-1 en los playoffs de la final, coronando a Walter Tavares como el MVP indiscutible."
    },
    {
      year: "2022",
      title: "9ª Supercopa (5ª Consecutiva)",
      description: "Con Chus Mateo al frente del banquillo, el Real Madrid se llevó un Clásico épico (89-83) tras prórroga, con Walter Tavares como gran baluarte, dominando el palmarés de la competición."
    },
    {
      year: "2023",
      title: "La Undécima Copa de Europa — Milagro de Kaunas",
      description: "El 21 de mayo de 2023, el Real Madrid conquistó su 11ª Copa de Europa tras derrotar al Olympiacos (78-79) con una canasta para la historia de Sergio Llull a falta de tres segundos. Una Euroliga épica donde se levantó un 0-2 en contra frente al Partizán de Belgrado."
    },
    {
      year: "2024",
      title: "10ª Supercopa y 29ª Copa del Rey",
      description: "Edición estelar en Murcia venciendo a Unicaja (81-88) y conquista posterior de la Copa del Rey en el pabellón Martín Carpena de Málaga frente a los rivales directos de la ACB."
    },
    {
      year: "2025",
      title: "37ª Liga de Baloncesto",
      description: "La temporada 2024/25 se cerró con broche de oro tras superar al Valencia Basket en la final de los playoffs con un contundente e impecable 3-0 global."
    }
  ];

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* Back button */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Link>
      </div>

      {/* Main Boardroom image hero */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-950">
        <img
          src="https://assets.realmadrid.com/is/image/realmadrid/ND-COPAS-DE-EUROPA_SALA-DE-JUNTAS_HE02434?$Desktop$&fit=wrap&wid=1440"
          alt="Sala de Juntas Real Madrid"
          className="w-full h-auto object-contain mx-auto block max-h-[450px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <span className="text-white text-[10px] sm:text-xs font-black uppercase tracking-widest bg-orange-600 px-3 py-1.5 rounded w-fit shadow-md">
            Sala de Trofeos Oficial
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-3 leading-tight drop-shadow-md">
            Algo de Historia — La Década Dorada (2021-2030)
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl drop-shadow">
            Un repaso exclusivo por las hazañas del Real Madrid Baloncesto en competiciones ACB y Euroliga.
          </p>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Palmares & Trophies */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-1.5">
              <Trophy className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
              Palmarés de la Década (2021-2030)
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/20 dark:bg-orange-950/5 border border-orange-100/50 dark:border-orange-950/10">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Copa de Europa</span>
                </div>
                <span className="text-xl font-black text-orange-600">1</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Ligas ACB</span>
                </div>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100">3</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Copa del Rey</span>
                </div>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100">1</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Supercopas de España</span>
                </div>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100">4</span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed pt-2">
              * Datos recopilados de los anales históricos del pabellón y la secretaría técnica del Real Madrid Baloncesto.
            </p>
          </div>
        </div>

        {/* Right Column: Historical Chronological Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-6 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Landmark className="h-4.5 w-4.5 text-orange-500" />
              Línea de Hitos y Títulos del Real Madrid Baloncesto (2021-2030)
            </h3>

            {/* Timeline */}
            <div className="relative border-l-2 border-orange-100 dark:border-orange-950/20 ml-3 pl-6 space-y-7">
              {milestones.map((m, idx) => (
                <div key={idx} className="relative">
                  {/* Glowing bubble */}
                  <span className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-white dark:ring-slate-900 flex items-center justify-center ${
                    m.year === "2023" ? "bg-orange-500 animate-pulse" : "bg-slate-400"
                  }`} />
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50/50 dark:bg-orange-500/10 px-2 py-0.5 rounded">
                      Hito {m.year}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-100 mt-1">
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-350 leading-relaxed pt-1">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}