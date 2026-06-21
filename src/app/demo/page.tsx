'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CLUB_LIST } from '@/data/clubs';
import type { ClubSlug } from '@/data/clubs/types';
import { useClubDemo } from '@/contexts/ClubDemoContext';
import { Trophy, Users, Package, Newspaper, Shield, ArrowRight, Sparkles } from 'lucide-react';

export default function DemoSelectorPage() {
  const { clubSlug, switchClub } = useClubDemo();
  const [hovered, setHovered] = useState<ClubSlug | null>(null);

  const handleExplore = (slug: ClubSlug) => {
    switchClub(slug, { redirect: '/login?redirect=/' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero header */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="CourtManager Pro" className="h-8 w-8 object-contain" />
            <div>
              <p className="font-black text-sm tracking-tight">CourtManager Pro</p>
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Demo Comercial ACB</p>
            </div>
          </div>
          <Link
            href="/login"
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Acceso clientes →
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Intro */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-orange-500/15 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full">
            <Sparkles className="h-3 w-3" />
            Entorno demostrativo · Datos ilustrativos
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Así quedaría CourtManager Pro<br />
            <span className="text-orange-400">en tu club de la ACB</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Selecciona uno de los tres grandes de la Liga Endesa y explora la plataforma con plantilla,
            inventario, blog, noticias, viajes y utilería personalizada con la identidad de cada club.
          </p>
        </section>

        {/* Club cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CLUB_LIST.map((pack) => {
            const { branding } = pack;
            const isActive = clubSlug === branding.slug;
            const isHovered = hovered === branding.slug;

            return (
              <article
                key={branding.slug}
                onMouseEnter={() => setHovered(branding.slug)}
                onMouseLeave={() => setHovered(null)}
                className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isActive
                    ? 'border-orange-500 shadow-xl shadow-orange-500/20 scale-[1.02]'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={branding.heroUrl}
                    alt={branding.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                  />
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      background: `linear-gradient(to top, ${branding.secondaryColor}ee, transparent 60%)`,
                    }}
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <img src={branding.logoUrl} alt="" className="h-10 w-10 object-contain drop-shadow-lg" />
                    <div className="text-left">
                      <p className="font-black text-sm leading-tight">{branding.shortName}</p>
                      <p className="text-[10px] text-white/70">{branding.venue}</p>
                    </div>
                  </div>
                  {isActive && (
                    <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider bg-orange-500 text-white px-2 py-1 rounded">
                      Seleccionado
                    </span>
                  )}
                </div>

                <div className="p-5 bg-slate-900/80 space-y-4 text-left">
                  <h2 className="font-extrabold text-base">{branding.name}</h2>
                  <p className="text-xs text-slate-400 leading-relaxed">{branding.tagline}</p>

                  <ul className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                    <li className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-orange-400" />
                      {pack.players.length} jugadores demo
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-orange-400" />
                      Inventario + QR
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Newspaper className="h-3.5 w-3.5 text-orange-400" />
                      Blog & noticias
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-orange-400" />
                      Palmarés & historia
                    </li>
                  </ul>

                  <button
                    onClick={() => handleExplore(branding.slug)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all"
                    style={{
                      backgroundColor: isHovered || isActive ? branding.primaryColor : 'rgba(255,255,255,0.08)',
                      color: branding.slug === 'rmb' || branding.slug === 'vbc' ? (isHovered || isActive ? '#000' : '#fff') : '#fff',
                      border: `1px solid ${branding.accentColor}44`,
                    }}
                  >
                    Ver demo {branding.shortName}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* Features + legal */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4 text-left">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-400" />
              Qué incluye cada demo
            </h3>
            <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <li>· Escaneo QR con cámara del móvil — ficha de prenda al instante (sin hardware)</li>
              <li>· Dashboard con hero, logo y colores del club</li>
              <li>· Plantilla completa con tallajes y perfiles de jugador</li>
              <li>· Inventario, solicitudes, viajes, lavandería y alertas</li>
              <li>· Blog con historia, palmarés y colección de equipación</li>
              <li>· Noticias de actualidad con imágenes del club</li>
              <li>· Módulo de utilería operativo (Carlos Rodriguez Kobe — utillero demo)</li>
            </ul>
          </div>

          <div className="bg-orange-950/20 border border-orange-900/40 rounded-2xl p-6 space-y-3 text-left">
            <h3 className="font-extrabold text-sm text-orange-300">Aviso legal — demo comercial</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Este entorno utiliza datos, imágenes y referencias <strong className="text-slate-300">meramente ilustrativos</strong> con
              fines de demostración comercial de CourtManager Pro. No está afiliado ni avalado oficialmente por los clubes mostrados.
              Para una implementación real, cada club recibiría su propia instancia con datos verificados y branding oficial autorizado.
            </p>
            <p className="text-xs text-slate-500">
              Contacto: <strong className="text-slate-300">Ramón del Pozo Rott</strong> · info@ramondelpozorott.es
            </p>
          </div>
        </section>

        {/* CTA footer */}
        <section className="text-center pb-8">
          <p className="text-xs text-slate-500 mb-4">
            Credenciales demo: <code className="text-orange-400">charlie-r-k@hotmail.com</code> / <code className="text-orange-400">utileria2026</code>
          </p>
          <Link
            href="/login?redirect=/"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Entrar a la plataforma
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
