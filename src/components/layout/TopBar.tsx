"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAlerts } from "@/hooks/useAlerts";
import { Bell, Shield, ChevronDown, Home, Settings, MessageCircle, X, CheckCircle, LogIn, Users, Landmark, UserPlus } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
import { useState } from "react";
import Link from "next/link";

export default function TopBar() {
  const { user, switchRole } = useAuth();
  const { alerts } = useAlerts();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showBlogDropdown, setShowBlogDropdown] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);

  // Form states for contact
  const [contactName, setContactName] = useState(user?.profile?.full_name || "Carlos Rodriguez Kobe");
  const [contactEmail, setContactEmail] = useState(user?.profile?.email || "charlie-r-k@hotmail.com");
  const [contactSubject, setContactSubject] = useState("Soporte Técnico");
  const [contactMessage, setContactMessage] = useState("");

  const unreadAlerts = alerts.filter((a) => !a.is_read);

  const roleLabels: Record<string, string> = {
    superadmin: "Superadmin (R. del Pozo Rott)",
    admin: "Administrador (C. Kobe)",
    assistant: "Utillero Asistente",
    player: "Jugador (Campazzo)",
    medical: "Staff Médico",
    coach: "Entrenador (Scariolo)",
    consulta: "Invitado (solo lectura)",
  };

  const userRole = user?.profile?.role || "equipment_manager";
  const userName = user?.profile?.full_name || "Carlos Rodriguez Kobe";
  const userAvatar = user?.profile?.avatar_url || '/images/carlos_kobe.png';

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactFormSubmitted(true);
    setTimeout(() => {
      setContactFormSubmitted(false);
      setShowContactModal(false);
      setContactMessage("");
    }, 2000);
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between px-6 z-10 shrink-0 relative">
      {/* Left section: Logo & Navigation menu navbar */}
      <div className="flex items-center gap-6">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.png" alt="Logo" className="h-6 w-6 object-contain shrink-0" />
          <span className="text-sm text-slate-800 dark:text-slate-100 font-extrabold tracking-tight md:block hidden">CourtManager Pro</span>
        </Link>

        {/* Navigation Menu Navbar */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-350">
          {/* Inicio Button */}
          <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-orange-600 transition-colors">
            <Home className="h-3.5 w-3.5 animate-pulse" />
            <span>Inicio</span>
          </Link>

          {/* Servicios Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowServicesDropdown(!showServicesDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-orange-600 transition-all"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Servicios</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
            {showServicesDropdown && (
              <div 
                className="absolute left-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 shadow-xl py-1 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setShowServicesDropdown(false)}
              >
                <Link
                  href="/trips"
                  onClick={() => setShowServicesDropdown(false)}
                  className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  ✈️ Viajes Logísticos
                </Link>
                <Link
                  href="/laundry"
                  onClick={() => setShowServicesDropdown(false)}
                  className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  🧺 Servicio Lavandería
                </Link>
                <Link
                  href="/trips"
                  onClick={() => setShowServicesDropdown(false)}
                  className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  🚌 Transporte y Equipaje
                </Link>
              </div>
            )}
          </div>

          {/* Blog Dropdown with Noticias Submenu */}
          <div className="relative">
            <button
              onClick={() => setShowBlogDropdown(!showBlogDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-orange-600 transition-all"
            >
              <Landmark className="h-3.5 w-3.5" />
              <span>Blog</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
            {showBlogDropdown && (
              <div 
                className="absolute left-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 shadow-xl py-1 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setShowBlogDropdown(false)}
              >
                <Link
                  href="/blog"
                  onClick={() => setShowBlogDropdown(false)}
                  className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  📜 Historia del Club
                </Link>
                <Link
                  href="/blog/noticias"
                  onClick={() => setShowBlogDropdown(false)}
                  className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  📰 Noticias de Actualidad
                </Link>
              </div>
            )}
          </div>

          {/* Contacto Button */}
          <button
            onClick={() => setShowContactModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-orange-600 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Contacto</span>
          </button>
        </nav>
      </div>

      {/* Right section: Login simulation, Role switcher, Alerts, Avatar */}
      <div className="flex items-center gap-4">
        {/* WhatsApp directo a Carlos Rodriguez Kobe */}
        <a
          href="https://wa.me/34637237100?text=Hola%20Carlos%20Rodriguez%20Kobe%2C%20te%20contacto%20desde%20la%20plataforma%20CourtManager%20Pro"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-full text-[#25D366] hover:bg-[#25D366]/10 transition-all flex items-center gap-1.5 text-[11px] font-extrabold"
          title="WhatsApp — Carlos Rodriguez Kobe"
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          <span className="hidden sm:inline">Carlos Kobe (+34 637 23 71 00)</span>
        </a>

        {/* Accesos rápidos: visible también en táctil/móvil */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-4">
          <button
            onClick={() => {
              switchRole("superadmin");
              alert("Sesión iniciada como Ramón del Pozo Rott (Superadmin con Acceso Absoluto y sin Restricciones)");
            }}
            className="px-2 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-orange-600 dark:text-orange-400 text-[9px] sm:text-[10px] font-extrabold tracking-wide uppercase transition-all flex items-center gap-1 border border-orange-200/40"
            title="Superadmin — Ramón del Pozo Rott"
          >
            <LogIn className="h-3 w-3 shrink-0" />
            <span className="hidden xs:inline sm:inline">Ramón</span>
          </button>
          <button
            onClick={() => {
              switchRole("admin");
              alert("Sesión iniciada como Carlos Rodriguez Kobe (Administrador de Utilería)");
            }}
            className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-850 text-emerald-700 dark:text-emerald-400 text-[9px] sm:text-[10px] font-extrabold tracking-wide uppercase transition-all flex items-center gap-1 border border-emerald-200/40"
            title="Administrador — Carlos Rodriguez Kobe"
          >
            <Users className="h-3 w-3 shrink-0" />
            <span className="hidden xs:inline sm:inline">Carlos</span>
          </button>
          <button
            onClick={() => {
              switchRole("consulta");
              alert('Acceso de invitado activado: "Usuario Invitado" (guest@realmadrid.com) — solo lectura');
            }}
            className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-[9px] sm:text-[10px] font-extrabold tracking-wide uppercase transition-all flex items-center gap-1"
            title="Registro / Invitado — acceso limitado"
          >
            <UserPlus className="h-3 w-3 shrink-0" />
            <span className="hidden md:inline">Invitado</span>
          </button>
        </div>

        {/* Interactive Role Switcher dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
          >
            <Shield className="h-4 w-4 text-orange-500" />
            <span>Rol: <strong className="text-orange-600">{roleLabels[userRole] || userRole}</strong></span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-1.5 w-60 rounded-xl border border-slate-150 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-xl py-1 z-50 animate-fade-in text-sm text-left">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Simular Rol de Usuario
              </div>
              {Object.keys(roleLabels).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r as any);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between text-xs font-semibold transition-colors ${
                    userRole === r ? "text-orange-600 font-bold bg-orange-50/50 dark:bg-orange-500/10" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>{roleLabels[r]}</span>
                  {userRole === r && <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alerts Badge */}
        <Link href="/alerts" className="relative p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="h-5 w-5" />
          {unreadAlerts.length > 0 && (
            <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] text-white font-extrabold flex items-center justify-center animate-pulse">
              {unreadAlerts.length}
            </span>
          )}
        </Link>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <img
            src={userAvatar || undefined}
            alt={userName}
            className="h-9 w-9 rounded-full bg-orange-100 border border-orange-200 animate-in fade-in zoom-in"
          />
          <div className="hidden lg:block leading-none text-left">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{userName}</h4>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{userRole.replace("_", " ")}</span>
          </div>
        </div>
      </div>

      {/* Support / Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-left">
              <div>
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">Soporte & Contacto</h3>
                <p className="text-[10px] text-slate-400 font-medium">Formulario de Soporte Técnico de Utilería</p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-left">
              {contactFormSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
                  <p className="text-sm font-bold text-slate-800 dark:text-white">¡Mensaje Enviado con Éxito!</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Tu consulta ha sido enviada de forma segura a Ramón del Pozo y Carlos Rodriguez Kobe. Recibirás respuesta inmediata.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed">
                    Para incidencias de stock, lavandería o solicitudes de viajes de la plantilla oficial de la temporada 2025/2026.
                  </p>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tu Nombre</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Asunto / Categoría</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white dark:bg-slate-900"
                    >
                      <option value="Soporte Técnico">⚙️ Soporte Técnico</option>
                      <option value="Utilería Viaje">✈️ Utilería Viaje / Maleta</option>
                      <option value="Lavandería">🧺 Lavandería / Incidencia</option>
                      <option value="Otro">Otro Asunto</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Detalles del Mensaje</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe detalladamente el problema o solicitud..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 leading-relaxed resize-none"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full text-center py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/10"
                  >
                    Enviar Mensaje de Soporte
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
