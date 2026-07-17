"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Globe,
  Landmark,
  Mail,
  Shirt,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";
import { db } from "@/infrastructure/supabase/repositories/InMemoryDB";
import { normalizeStaffProfile } from "@/lib/player-profile";
import {
  getOfficialStaffByLegacyId,
  RMB_OFFICIAL_SOURCE,
} from "@/data/rmb-official-roster";

interface StaffProfileProps {
  params: Promise<{ id: string }>;
}

export default function StaffProfilePage({ params }: StaffProfileProps) {
  const { id } = use(params);

  const staff = useMemo(() => {
    const local = db.coachingStaff.find((s) => s.id === id) || null;
    const normalized = normalizeStaffProfile(local);
    if (normalized) return normalized;

    const official = getOfficialStaffByLegacyId(id);
    if (!official) return null;
    return normalizeStaffProfile({
      id: official.legacyId,
      full_name: official.full_name,
      role: official.role,
      nationality: official.nationality,
      birth_date: official.birth_date,
      birth_place: official.birth_place,
      photo_url: official.photo_url,
      profile_url: official.profile_url,
      trajectory: official.trajectory,
      trajectory_items: official.trajectory_items,
      palmares: official.palmares,
      shirt_size: "L",
      shorts_size: "L",
      shoe_size: 43,
      email: `${official.slug}@realmadrid.com`,
    });
  }, [id]);

  if (!staff) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-sm font-bold">Miembro del cuerpo técnico no encontrado</p>
        <Link href="/players" className="text-orange-500 hover:underline text-xs mt-2 inline-block">
          Volver a la plantilla
        </Link>
      </div>
    );
  }

  const trajectoryItems =
    staff.trajectory_items.length > 0
      ? staff.trajectory_items
      : staff.trajectory
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

  const birthDate = staff.birth_date?.includes("-")
    ? staff.birth_date.split("-").reverse().join("/")
    : staff.birth_date || "—";

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      <Link
        href="/players"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver a Plantilla y Personal
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="h-36 w-28 rounded-xl overflow-hidden bg-slate-100 border border-orange-200 shrink-0 flex items-center justify-center">
          {staff.photo_url ? (
            <img
              src={staff.photo_url}
              alt={staff.full_name}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <User className="h-12 w-12 text-orange-400" />
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              {staff.full_name}
            </h1>
            <p className="text-sm font-bold text-orange-600 mt-1">{staff.role}</p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              {staff.nationality}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Nacimiento: {birthDate}
            </span>
            {staff.birth_place ? (
              <span className="inline-flex items-center gap-1.5">
                <Landmark className="h-3.5 w-3.5" />
                {staff.birth_place}
              </span>
            ) : null}
            {staff.email ? (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {staff.email}
              </span>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center md:items-end gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20">
            Activo
          </span>
          {staff.profile_url ? (
            <a
              href={staff.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-extrabold shadow-sm transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Ver Ficha Oficial Real Madrid
            </a>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-orange-500" />
              Datos Personales
            </h2>
            <dl className="space-y-3 text-xs">
              <div className="flex justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                <dt className="text-slate-400 font-semibold">Nombre completo</dt>
                <dd className="font-bold text-slate-800 dark:text-slate-100 text-right">{staff.full_name}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                <dt className="text-slate-400 font-semibold">Cargo</dt>
                <dd className="font-bold text-slate-800 dark:text-slate-100 text-right">{staff.role}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                <dt className="text-slate-400 font-semibold">Nacionalidad</dt>
                <dd className="font-bold text-slate-800 dark:text-slate-100 text-right">{staff.nationality}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                <dt className="text-slate-400 font-semibold">Fecha de nacimiento</dt>
                <dd className="font-bold text-slate-800 dark:text-slate-100 text-right">{birthDate}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400 font-semibold">Lugar de nacimiento</dt>
                <dd className="font-bold text-slate-800 dark:text-slate-100 text-right">
                  {staff.birth_place || "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
              <Shirt className="h-4 w-4 text-orange-500" />
              Medidas de Utilería
            </h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Chaqueta</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                  {staff.shirt_size || "L"}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Pantalón</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                  {staff.shorts_size || "L"}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Calzado</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                  {staff.shoe_size ?? "43"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-1.5">
              <Landmark className="h-5 w-5 text-orange-500" />
              Trayectoria
            </h2>
            {trajectoryItems.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">Sin trayectoria publicada.</p>
            ) : (
              <ol className="space-y-2.5 max-h-[28rem] overflow-y-auto pr-1">
                {trajectoryItems.map((item, idx) => (
                  <li
                    key={`${item}-${idx}`}
                    className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl px-3.5 py-2.5"
                  >
                    <span className="mt-0.5 h-5 w-5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 text-[10px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-1.5">
              <Trophy className="h-5 w-5 text-orange-500" />
              Palmarés
            </h2>
            {staff.palmares.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">Sin palmarés publicado.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {staff.palmares.map((item, idx) => (
                  <li
                    key={`${item}-${idx}`}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-orange-50/40 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/30 rounded-xl px-3 py-2.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 flex flex-wrap items-center justify-between gap-3">
            <p>
              Ficha sincronizada desde la{" "}
              <a
                href={RMB_OFFICIAL_SOURCE}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-orange-700 dark:text-orange-400 hover:underline"
              >
                plantilla oficial
              </a>
              .
            </p>
            {staff.profile_url ? (
              <a
                href={staff.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 dark:text-orange-400"
              >
                Abrir perfil en realmadrid.com
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
