"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Newspaper, ShieldCheck } from "lucide-react";
import { useClubNews, useClubBranding } from "@/contexts/ClubDemoContext";

export default function BlogNoticiasPage() {
  const newsList = useClubNews();
  const branding = useClubBranding();

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Newspaper className="h-6 w-6 text-orange-500" />
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Noticias de Actualidad — {branding.shortName}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Crónicas, premios y momentos icónicos del {branding.name} esta temporada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map((news) => (
          <div
            key={news.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] w-full bg-slate-950 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
              />
              <span
                className="absolute top-3 left-3 text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded shadow-md"
                style={{ backgroundColor: branding.accentColor }}
              >
                {news.tag}
              </span>
            </div>

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
                  {branding.shortName} Demo
                </span>
                {news.date && (
                  <span suppressHydrationWarning>{new Date(news.date).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
