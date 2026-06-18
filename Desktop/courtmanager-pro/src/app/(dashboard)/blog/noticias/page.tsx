"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Newspaper, Sparkles, Award, Star, ShieldCheck } from "lucide-react";

export default function BlogNoticiasPage() {
  const newsList = [
    {
      id: "n1",
      title: "Walter 'Edy' Tavares recibe el premio al Mejor Defensor de la Temporada",
      tag: "ACB",
      image: "https://assets.realmadrid.com/is/image/realmadrid/ND_TAVARES_PREMIO_MEJOR_DEFENSOR_SG21227?$Desktop$&fit=wrap&wid=400",
      description: "El pívot de Cabo Verde Walter Samuel Tavares sigue agigantando su palmarés y leyenda al ser condecorado como el Mejor Defensor de la competición de Liga Endesa. La entrega del galardón reconoce su titánico dominio intimidatorio en la pintura.",
      date: "2026-06-18"
    },
    {
      id: "n2",
      title: "Mario Hezonja brilla con actuaciones estelares en los Playoffs",
      tag: "Liga Endesa",
      image: "https://assets.realmadrid.com/is/image/realmadrid/ND-LIGA-ENDESA-PLAYOFF-P1-RM-TENERIFE-PREMIOS-HEZONJA_SG20301?$Desktop$&fit=wrap&wid=400",
      description: "Con una puntería y verticalidad descomunales ante el Lenovo Tenerife, Hezonja lideró las eliminatorias para consolidar el camino del club blanco a disputar un nuevo campeonato liguero en el WiZink Center.",
      date: "2026-06-15"
    },
    {
      id: "n3",
      title: "Izan Almansa asume galones y destaca en la rotación contra el Zaragoza",
      tag: "Cantera & Futuro",
      image: "https://assets.realmadrid.com/is/image/realmadrid/ND-J18-LIGA-ENDESA-RM-ZARAGOZA-ALMANSA_SG15582?$Desktop$&fit=wrap&wid=400",
      description: "El joven e internacional interior español, Izan Almansa, firmó un partido soberbio dominando el rebote ofensivo en la victoria ante el Zaragoza, demostrando el altísimo nivel y solidez de su indumentaria número #13.",
      date: "2026-06-12"
    },
    {
      id: "n4",
      title: "Homenaje especial del Presidente y la Junta Directiva a Sergio Llull",
      tag: "Leyenda",
      image: "https://assets.realmadrid.com/is/image/realmadrid/ND_PRESIDENTE_LLULL_SG25640?$Desktop$&fit=wrap&wid=400",
      description: "El incansable e histórico capitán fue recibido y homenajeado por el presidente Florentino Pérez y la junta directiva en la sala de juntas, recordando sus tiros imposibles, su compromiso eterno y sus 23 títulos como madridista."
    },
    {
      id: "n5",
      title: "El equipo juvenil del Real Madrid conquista el Torneo de la Liga U contra el Barcelona",
      tag: "Cantera",
      image: "https://assets.realmadrid.com/is/image/realmadrid/ND-LIGA-U-RM-BARCELONA-GRUPO-COPA_SG11471?$Desktop$&fit=wrap&wid=400",
      description: "La cantera merengue cosechó una gloriosa victoria en la Liga de Desarrollo U tras derrotar al Barcelona en la final del torneo, levantando la Copa juvenil en una estampa repleta de orgullo blanco.",
      date: "2026-06-08"
    },
    {
      id: "n6",
      title: "Estreno de los nuevos lotes de equipación de calentamiento blanca",
      tag: "Utilería",
      image: "https://assets.realmadrid.com/is/image/realmadrid/ND_LUIK_1VC5447?$Desktop$&fit=wrap&wid=400",
      description: "El primer equipo ha completado su entrenamiento oficial luciendo los cortavientos y camisetas técnicas blancas reversibles que formarán parte de la indumentaria logística de viaje para la Euroliga.",
      date: "2026-06-05"
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

      {/* Title */}
      <div className="flex items-center gap-2">
        <Newspaper className="h-6 w-6 text-orange-500" />
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Noticias de Actualidad RMB</h2>
          <p className="text-xs text-slate-400 mt-1">Crónicas, premios y momentos icónicos del primer equipo en acción esta temporada.</p>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map((news) => (
          <div
            key={news.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Action picture aspect ratio container */}
            <div className="relative aspect-[4/3] w-full bg-slate-950 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
              />
              <span className="absolute top-3 left-3 bg-orange-600 text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded shadow-md">
                {news.tag}
              </span>
            </div>

            {/* Content card */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5 text-left">
              <div>
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm leading-tight line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-350 leading-relaxed mt-2.5 line-clamp-4">
                  {news.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
                  RMB Oficial
                </span>
                {news.date && <span>{new Date(news.date).toLocaleDateString()}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}