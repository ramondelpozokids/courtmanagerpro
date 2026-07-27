'use client';

import Link from 'next/link';
import {
  Users,
  ClipboardList,
  Shirt,
  Calendar,
  Trophy,
  Globe2,
  Newspaper,
  Cake,
  MessageCircle,
  Headset,
  type LucideIcon,
} from 'lucide-react';
import type { ClubBranding } from '@/data/clubs/types';
import { cn } from '@/lib/utils';

type HeroLink = {
  href: string;
  label: string;
  sub: string;
  icon: LucideIcon;
};

function linksForSport(sport: ClubBranding['sport']): HeroLink[] {
  if (sport === 'football') {
    return [
      { href: '/players', label: 'Jugadores', sub: 'Tallas & Fichas', icon: Users },
      { href: '/players', label: 'Cuerpo técnico', sub: 'Staff', icon: ClipboardList },
      { href: '/inventory', label: 'Equipaciones', sub: 'Material', icon: Shirt },
      { href: '/calendario', label: 'Calendario', sub: 'Viajes & Eventos', icon: Calendar },
      { href: '/calendario', label: 'LaLiga', sub: 'Copa del Rey', icon: Trophy },
      { href: '/calendario', label: 'Champions', sub: 'Europa', icon: Globe2 },
      { href: '/blog/noticias', label: 'Noticias', sub: 'Blog', icon: Newspaper },
      { href: '/', label: 'Cumpleaños', sub: 'Avisos', icon: Cake },
      { href: '/', label: 'Chat', sub: 'Asistente', icon: MessageCircle },
      { href: '/cuenta', label: 'Soporte', sub: 'Técnico', icon: Headset },
    ];
  }
  return [
    { href: '/players', label: 'Jugadores', sub: 'Tallas & Fichas', icon: Users },
    { href: '/players', label: 'Cuerpo técnico', sub: 'Staff', icon: ClipboardList },
    { href: '/inventory', label: 'Equipaciones', sub: 'Material', icon: Shirt },
    { href: '/calendario', label: 'Calendario', sub: 'Viajes & Eventos', icon: Calendar },
    { href: '/calendario', label: 'ACB', sub: 'Copa del Rey', icon: Trophy },
    { href: '/calendario', label: 'Euroliga', sub: 'Liga', icon: Globe2 },
    { href: '/blog/noticias', label: 'Noticias', sub: 'Blog', icon: Newspaper },
    { href: '/', label: 'Cumpleaños', sub: 'Avisos', icon: Cake },
    { href: '/', label: 'Chat', sub: 'Asistente', icon: MessageCircle },
    { href: '/cuenta', label: 'Soporte', sub: 'Técnico', icon: Headset },
  ];
}

export function ClubDashboardHero({
  branding,
  className,
}: {
  branding: ClubBranding;
  className?: string;
}) {
  const isFootball = branding.sport === 'football';
  const links = linksForSport(branding.sport);
  const leagueLine = isFootball ? 'LaLiga · Champions League' : 'ACB · Euroliga';
  const fieldWord = isFootball ? 'campo' : 'cancha';

  return (
    <div
      className={cn(
        'relative w-full max-w-7xl rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 text-left',
        className
      )}
    >
      {/* Fondo fotográfico según deporte — tapamos créditos embebidos en el PNG */}
      <div className="absolute inset-0">
        <img
          src={branding.heroUrl}
          alt=""
          className="h-full w-full object-cover object-center opacity-55"
          onError={(e) => {
            const img = e.currentTarget;
            img.src = isFootball
              ? 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600'
              : 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1600';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(254,190,16,0.12),transparent_55%)]" />
        {/* Oculta el bloque superior derecho del PNG (Carlos / crédito gestor) */}
        <div className="absolute top-0 right-0 h-16 sm:h-20 w-[42%] bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent" />
      </div>

      <div className="relative z-10 px-5 sm:px-8 pt-6 pb-5 space-y-5">
        <div className="flex items-start justify-between gap-3 text-[10px] sm:text-xs font-semibold tracking-wide text-slate-300">
          <div>
            <p className="text-white font-bold">Ramón del Pozo Rott</p>
            <p className="uppercase text-slate-400">CEO y Creador de CourtManager Pro</p>
          </div>
          <div aria-hidden className="w-24 sm:w-32" />
        </div>

        <div className="flex flex-col items-center text-center gap-3 py-2 sm:py-4">
          <img
            src={branding.logoUrl}
            alt={branding.name}
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-xl"
          />
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow">
            COURTMANAGER PRO
          </h1>
          <div className="space-y-0.5">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-amber-300/90">
              Utillero profesional
            </p>
            <p className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-white">
              {branding.name}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300/90">
              {leagueLine}
            </p>
          </div>
          <span
            className="mt-1 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow"
            style={{ backgroundColor: branding.accentColor }}
          >
            {branding.tagline}
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/50 px-1 py-2.5 hover:border-amber-400/40 hover:bg-slate-900/80 transition"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400/20 to-sky-500/10 text-amber-300 group-hover:text-amber-200">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wide text-slate-100 text-center leading-tight">
                  {item.label}
                </span>
                <span className="hidden sm:block text-[8px] font-semibold uppercase text-slate-400 text-center leading-tight">
                  {item.sub}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/10 pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Organización · Control · Gestión · Seguridad · Profesionalidad
            </p>
            <p className="text-xs text-slate-200 mt-1">
              CourtManager Pro — {branding.name}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Tu aliado dentro y fuera del {fieldWord}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[9px] font-black uppercase tracking-wider px-2.5 py-1">
              {branding.tagline}
            </span>
            <img src={branding.logoUrl} alt="" className="h-7 w-7 object-contain opacity-90" />
          </div>
        </div>
      </div>
    </div>
  );
}
