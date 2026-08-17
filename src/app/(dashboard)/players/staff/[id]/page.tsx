"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Globe,
  Landmark,
  Mail,
  Pencil,
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
import { useActiveTeamId, useClubBranding } from "@/contexts/ClubDemoContext";
import { usesProductionClubData } from "@/lib/club-preview";
import { getClubPack } from "@/data/clubs";
import {
  ATM_OFFICIAL_PLANTILLA_URL,
  resolveAtmStaffProfileUrl,
} from "@/data/clubs/atm-data";
import { RMF_OFFICIAL_PLANTILLA_URL } from "@/data/clubs/rmf-data";
import { resolveAtmPackStaffPhoto } from "@/lib/atm-pack-photos";
import { useAuth } from "@/contexts/AuthContext";
import { canWriteClubData } from "@/lib/permissions";
import { persistDemoDb } from "@/lib/demo-persistence";
import { preferRmbStaffIfStale } from "@/lib/rmb-roster";

interface StaffProfileProps {
  params: Promise<{ id: string }>;
}

function officialMeta(slug: string) {
  if (slug === "atm") {
    return {
      plantillaUrl: ATM_OFFICIAL_PLANTILLA_URL,
      siteLabel: "atleticodemadrid.com",
      fichaLabel: "Ver Ficha Oficial Atlético de Madrid",
    };
  }
  if (slug === "rmf") {
    return {
      plantillaUrl: RMF_OFFICIAL_PLANTILLA_URL,
      siteLabel: "realmadrid.com",
      fichaLabel: "Ver Ficha Oficial Real Madrid",
    };
  }
  return {
    plantillaUrl: RMB_OFFICIAL_SOURCE,
    siteLabel: "realmadrid.com",
    fichaLabel: "Ver Ficha Oficial Real Madrid",
  };
}

function matchPackStaff(fullName: string, packStaff: Record<string, unknown>[]) {
  const a = fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
  return packStaff.find((p) => {
    const b = String(p.full_name || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    return a === b;
  });
}

export default function StaffProfilePage({ params }: StaffProfileProps) {
  const { id } = use(params);
  const branding = useClubBranding();
  const teamId = useActiveTeamId();
  const { user, userEmail, hasOperationalAccess } = useAuth();
  const productionClub = usesProductionClubData();
  const applyOfficialRoster = branding.slug === "rmb";
  const canWrite = hasOperationalAccess || canWriteClubData(user?.profile?.role, userEmail);
  const meta = officialMeta(branding.slug);
  const [remoteStaff, setRemoteStaff] = useState<Record<string, unknown> | null>(null);
  const [loadingRemote, setLoadingRemote] = useState(productionClub);
  const [editingSizes, setEditingSizes] = useState(false);
  const [savingSizes, setSavingSizes] = useState(false);
  const [shirtSize, setShirtSize] = useState("L");
  const [shortsSize, setShortsSize] = useState("L");
  const [shoeSize, setShoeSize] = useState<string | number>(43);

  useEffect(() => {
    if (!productionClub) {
      setLoadingRemote(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/coaching-staff?team_id=${encodeURIComponent(teamId)}`, {
          credentials: "include",
        });
        const json = await res.json().catch(() => ({}));
        let rows: Record<string, unknown>[] = Array.isArray(json.data) ? json.data : [];
        if (branding.slug === "rmb") {
          rows = preferRmbStaffIfStale(rows, teamId);
        } else if (rows.length === 0) {
          rows = (getClubPack(branding.slug).coachingStaff || []) as Record<string, unknown>[];
        }
        if (!cancelled) {
          setRemoteStaff(rows.find((s) => String(s.id) === id) || null);
        }
      } catch {
        if (!cancelled) {
          if (branding.slug === "rmb") {
            const rows = preferRmbStaffIfStale([], teamId);
            setRemoteStaff(rows.find((s) => String(s.id) === id) || null);
          } else {
            const packRow = (getClubPack(branding.slug).coachingStaff || []).find(
              (s: { id?: string }) => String(s.id) === id
            );
            setRemoteStaff((packRow as Record<string, unknown>) || null);
          }
        }
      } finally {
        if (!cancelled) setLoadingRemote(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productionClub, teamId, branding.slug, id]);

  const staff = useMemo(() => {
    const baseRow = productionClub
      ? remoteStaff
      : (db.coachingStaff.find((s) => s.id === id) as Record<string, unknown> | null) || null;

    let normalized = normalizeStaffProfile(baseRow, { applyOfficialRoster });

    if (!normalized && applyOfficialRoster) {
      const official = getOfficialStaffByLegacyId(id);
      if (official) {
        normalized = normalizeStaffProfile(
          {
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
          },
          { applyOfficialRoster: true }
        );
      }
    }

    if (!normalized) return null;

    if (branding.slug === "atm") {
      const pack = getClubPack("atm");
      const packHit = matchPackStaff(
        normalized.full_name,
        (pack.coachingStaff || []) as Record<string, unknown>[]
      );
      const photo = resolveAtmPackStaffPhoto({
        fullName: normalized.full_name,
        photo_url: normalized.photo_url,
      });
      return {
        ...normalized,
        photo_url: photo || normalized.photo_url,
        birth_date: normalized.birth_date || (packHit?.birth_date as string) || null,
        birth_place: normalized.birth_place || (packHit?.birth_place as string) || null,
        trajectory: normalized.trajectory || String(packHit?.trajectory || ""),
        role: String(packHit?.role || normalized.role),
        profile_url: resolveAtmStaffProfileUrl(
          normalized.profile_url,
          typeof packHit?.profile_url === "string" ? packHit.profile_url : null
        ),
      };
    }

    return {
      ...normalized,
      profile_url: normalized.profile_url || meta.plantillaUrl,
    };
  }, [id, productionClub, remoteStaff, applyOfficialRoster, branding.slug, meta.plantillaUrl]);

  useEffect(() => {
    if (!staff) return;
    setShirtSize(staff.shirt_size || "L");
    setShortsSize(staff.shorts_size || "L");
    setShoeSize(staff.shoe_size ?? 43);
  }, [staff]);

  const handleSaveSizes = async () => {
    if (!staff?.id) return;
    setSavingSizes(true);
    const payload = {
      shirt_size: shirtSize,
      shorts_size: shortsSize,
      shoe_size: Number(shoeSize) || 43,
    };
    try {
      if (productionClub) {
        const res = await fetch(`/api/coaching-staff/${staff.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error((await res.json().catch(() => ({}))).error || "Error al guardar");
        }
        const json = await res.json().catch(() => ({}));
        if (json.data) setRemoteStaff(json.data as Record<string, unknown>);
      } else {
        const idx = db.coachingStaff.findIndex((s) => s.id === staff.id);
        if (idx !== -1) {
          db.coachingStaff[idx] = { ...db.coachingStaff[idx], ...payload };
          persistDemoDb();
        }
      }
      setEditingSizes(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar medidas");
    } finally {
      setSavingSizes(false);
    }
  };

  if (loadingRemote) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-sm font-bold">Cargando ficha...</p>
      </div>
    );
  }

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

  const profileUrl = staff.profile_url || meta.plantillaUrl;

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
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-extrabold shadow-sm transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {meta.fichaLabel}
          </a>
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
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                <Shirt className="h-4 w-4 text-orange-500" />
                Medidas de Utilería
              </h2>
              {canWrite && !editingSizes ? (
                <button
                  type="button"
                  onClick={() => setEditingSizes(true)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 hover:text-orange-500"
                >
                  <Pencil className="h-3 w-3" />
                  Editar
                </button>
              ) : null}
            </div>
            {editingSizes ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <label className="text-center space-y-1">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Chaqueta</span>
                    <input
                      value={shirtSize}
                      onChange={(e) => setShirtSize(e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-center text-sm font-black"
                    />
                  </label>
                  <label className="text-center space-y-1">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Pantalón</span>
                    <input
                      value={shortsSize}
                      onChange={(e) => setShortsSize(e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-center text-sm font-black"
                    />
                  </label>
                  <label className="text-center space-y-1">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Calzado</span>
                    <input
                      type="number"
                      value={shoeSize}
                      onChange={(e) => setShoeSize(e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-center text-sm font-black"
                    />
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShirtSize(staff.shirt_size || "L");
                      setShortsSize(staff.shorts_size || "L");
                      setShoeSize(staff.shoe_size ?? 43);
                      setEditingSizes(false);
                    }}
                    className="px-3 py-1.5 rounded-lg border text-[10px] font-bold text-slate-500"
                    disabled={savingSizes}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSaveSizes()}
                    className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold disabled:opacity-60"
                    disabled={savingSizes}
                  >
                    {savingSizes ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            ) : (
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
            )}
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
                href={meta.plantillaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-orange-700 dark:text-orange-400 hover:underline"
              >
                plantilla oficial
              </a>
              .
            </p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 dark:text-orange-400"
            >
              Abrir perfil en {meta.siteLabel}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
