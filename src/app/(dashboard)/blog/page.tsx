"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Landmark, Award } from "lucide-react";
import { useClubBlog, useClubBranding } from "@/contexts/ClubDemoContext";

export default function BlogHistoryPage() {
  const blog = useClubBlog();
  const branding = useClubBranding();

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Link>
      </div>

      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-950">
        <img
          src={branding.blogHeroUrl}
          alt={branding.name}
          className="w-full h-auto object-cover mx-auto block max-h-[450px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <span
            className="text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded w-fit shadow-md"
            style={{ backgroundColor: branding.accentColor }}
          >
            {branding.shortName} · Historia del Club
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-3 leading-tight drop-shadow-md">
            {blog.historyTitle}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl drop-shadow">
            {blog.historySubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-1.5">
              <Trophy className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
              Palmarés — {branding.shortName}
            </h3>

            <div className="space-y-3.5">
              {blog.palmares.map((item, idx) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    idx === 0
                      ? 'bg-orange-50/20 dark:bg-orange-950/5 border-orange-100/50 dark:border-orange-950/10'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Award className={`h-5 w-5 ${idx === 0 ? 'text-orange-500' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.label}</span>
                  </div>
                  <span className={`text-xl font-black ${idx === 0 ? 'text-orange-600' : 'text-slate-800 dark:text-slate-100'}`}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 font-medium leading-relaxed pt-2">
              * Datos ilustrativos para demo comercial de CourtManager Pro — {branding.name}.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-6 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Landmark className="h-4.5 w-4.5 text-orange-500" />
              Línea de Hitos — {branding.name}
            </h3>

            <div className="relative border-l-2 border-orange-100 dark:border-orange-950/20 ml-3 pl-6 space-y-7">
              {blog.milestones.map((m, idx) => (
                <div key={idx} className="relative">
                  <span
                    className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-white dark:ring-slate-900 ${
                      idx === blog.milestones.length - 2 ? 'bg-orange-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50/50 dark:bg-orange-500/10 px-2 py-0.5 rounded">
                      Hito {m.year}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-100 mt-1">{m.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-350 leading-relaxed pt-1">{m.description}</p>
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
