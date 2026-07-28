'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useActiveTeamId, useClubBranding } from '@/contexts/ClubDemoContext';
import {
  ClipboardCheck,
  RefreshCw,
  Calendar,
  Plane,
  Shirt,
  Stethoscope,
  Package,
  ExternalLink,
  CheckCircle2,
  Circle,
  Briefcase,
  Snowflake,
  Dumbbell,
  Trophy,
  FileDown,
} from 'lucide-react';
import type { OfficialMatch } from '@/types';
import { exportPreMatchPdf } from '@/lib/pdf-export';
import type { ClubSlug } from '@/data/clubs/types';

type CheckItem = { id: string; label: string; href: string; done: boolean };

type KitId = 'primera' | 'segunda' | 'tercera' | 'entrenamiento' | 'portero';

type PackItem = {
  id: string;
  label: string;
  category: string;
  done: boolean;
};

const STORAGE_PREFIX = 'cm-prematch-checklist:';
const STORAGE_PACK_PREFIX = 'cm-prematch-pack:';

const KIT_OPTIONS: { id: KitId; label: string; hint: string }[] = [
  { id: 'primera', label: 'Equipación 1ª', hint: 'Local / match day' },
  { id: 'segunda', label: 'Equipación 2ª', hint: 'Visitante' },
  { id: 'tercera', label: 'Equipación 3ª', hint: 'Alternativa' },
  { id: 'entrenamiento', label: 'Entrenamiento', hint: 'Sesión / warm-up' },
  { id: 'portero', label: 'Portero', hint: 'GK match + training' },
];

const PACK_TEMPLATE: Omit<PackItem, 'done'>[] = [
  // Equipación / prendas
  { id: 'kit_shirts', label: 'Camisetas de juego (plantel + staff técnico)', category: 'Equipación' },
  { id: 'kit_shorts', label: 'Pantalones cortos de juego', category: 'Equipación' },
  { id: 'kit_socks', label: 'Medias / calcetines de juego', category: 'Equipación' },
  { id: 'kit_gk', label: 'Equipación completa de porteros', category: 'Equipación' },
  { id: 'kit_training', label: 'Ropa de entrenamiento (camisetas, pantalones, sudaderas)', category: 'Equipación' },
  { id: 'kit_warmup', label: 'Chándal / chaqueta warm-up pre-partido', category: 'Equipación' },
  { id: 'kit_rain', label: 'Chubasqueros / capas de lluvia', category: 'Equipación' },
  { id: 'kit_spare', label: 'Repuestos dorsales / tallas extra', category: 'Equipación' },
  // Representación
  { id: 'rep_suit', label: 'Trajes de representación (viaje / hotel)', category: 'Representación' },
  { id: 'rep_track', label: 'Chándal oficial de representación', category: 'Representación' },
  { id: 'rep_polo', label: 'Polos / camisetas oficiales de desplazamiento', category: 'Representación' },
  { id: 'rep_shoes', label: 'Calzado de representación / viaje', category: 'Representación' },
  // Material de juego
  { id: 'ball_match', label: 'Balones oficiales de partido', category: 'Material de juego' },
  { id: 'ball_train', label: 'Balones de entrenamiento / warm-up', category: 'Material de juego' },
  { id: 'ball_pump', label: 'Inflador + agujas + manómetro', category: 'Material de juego' },
  { id: 'caps', label: 'Petos / chalecos de entrenamiento', category: 'Material de juego' },
  { id: 'captain', label: 'Brazalete de capitán + recambio', category: 'Material de juego' },
  // Hidratación / neveras
  { id: 'cooler_main', label: 'Neveras principales (hidratación banquillo)', category: 'Hidratación' },
  { id: 'cooler_ice', label: 'Hielo / packs frío', category: 'Hidratación' },
  { id: 'bottles', label: 'Botellas individuales + boquillas', category: 'Hidratación' },
  { id: 'isotonic', label: 'Bebidas isotónicas / agua mineral', category: 'Hidratación' },
  // Entrenamiento / campo
  { id: 'cones', label: 'Conos, picas y marcas de campo', category: 'Entrenamiento' },
  { id: 'hurdles', label: 'Vallas / aros / material de activación', category: 'Entrenamiento' },
  { id: 'ladders', label: 'Escaleras de coordinación', category: 'Entrenamiento' },
  { id: 'bands', label: 'Bandas elásticas / gomas', category: 'Entrenamiento' },
  { id: 'goals_mini', label: 'Porterías portátiles / mini-goles (si aplica)', category: 'Entrenamiento' },
  { id: 'gps', label: 'Chalecos GPS / tracking (si el club los usa)', category: 'Entrenamiento' },
  // Utilería / logística
  { id: 'bags', label: 'Bolsas / maletas de utilería etiquetadas', category: 'Logística' },
  { id: 'hangers', label: 'Perchas y fundas de uniforme', category: 'Logística' },
  { id: 'sewing', label: 'Kit costura / dorsales de emergencia', category: 'Logística' },
  { id: 'tape', label: 'Cinta americana, velcro, tijeras, rotuladores', category: 'Logística' },
  { id: 'laundry_bag', label: 'Sacos de ropa sucia post-partido', category: 'Logística' },
  { id: 'keys_pass', label: 'Pases / acreditaciones / llaves vestuario', category: 'Logística' },
  // Médico (resumen; detalle en /medical)
  { id: 'med_kit', label: 'Botiquín partido / viaje cargado', category: 'Médico' },
  { id: 'med_massage', label: 'Camilla / material de fisioterapia portátil', category: 'Médico' },
];

type StoredPack = {
  kits: KitId[];
  items: Record<string, boolean>;
};

export default function PrematchChecklistPage() {
  const teamId = useActiveTeamId();
  const branding = useClubBranding();
  const [nextMatch, setNextMatch] = useState<OfficialMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState<CheckItem[]>([]);
  const [kits, setKits] = useState<KitId[]>([]);
  const [packItems, setPackItems] = useState<PackItem[]>([]);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const matchKey = nextMatch?.id || nextMatch?.official_slug || 'none';
  const persistKey = `${STORAGE_PREFIX}${teamId}:${matchKey}`;
  const packKey = `${STORAGE_PACK_PREFIX}${teamId}:${matchKey}`;

  const isFootball = branding.sport === 'football' || branding.slug === 'atm' || branding.slug === 'rmf';

  const kitOptions = useMemo(
    () => (isFootball ? KIT_OPTIONS : KIT_OPTIONS.filter((k) => k.id !== 'portero')),
    [isFootball]
  );

  const buildChecks = useCallback(
    (match: OfficialMatch | null, saved: Record<string, boolean> = {}): CheckItem[] => [
      {
        id: 'calendar',
        label: 'Confirmar rival, hora y pabellón en calendario oficial',
        href: '/calendario',
        done: Boolean(saved.calendar),
      },
      {
        id: 'kits',
        label: 'Definir equipación(es) que llevan (1ª / 2ª / 3ª / entrenamiento)',
        href: '#equipacion',
        done: Boolean(saved.kits),
      },
      {
        id: 'pack',
        label: 'Completar packing: material, neveras, balones y representación',
        href: '#packing',
        done: Boolean(saved.pack),
      },
      {
        id: 'trip',
        label: match
          ? `Preparar packing list del viaje / partido vs ${match.rival}`
          : 'Crear o revisar viaje y packing list',
        href: '/trips',
        done: Boolean(saved.trip),
      },
      {
        id: 'laundry',
        label: 'Revisar lavandería (lotes pendientes antes del partido)',
        href: '/laundry',
        done: Boolean(saved.laundry),
      },
      {
        id: 'medical',
        label: 'Botiquín de partido / viaje completo y caducidades OK',
        href: '/medical',
        done: Boolean(saved.medical),
      },
      {
        id: 'inventory',
        label: 'Stock crítico: equipación y calzado del plantel',
        href: '/almacen',
        done: Boolean(saved.inventory),
      },
      {
        id: 'requests',
        label: 'Cerrar solicitudes pendientes del jugador / staff',
        href: '/requests',
        done: Boolean(saved.requests),
      },
    ],
    []
  );

  const savePack = useCallback(
    (nextKits: KitId[], nextItems: PackItem[]) => {
      const payload: StoredPack = {
        kits: nextKits,
        items: Object.fromEntries(nextItems.map((i) => [i.id, i.done])),
      };
      try {
        localStorage.setItem(packKey, JSON.stringify(payload));
      } catch {
        /* ignore */
      }
    },
    [packKey]
  );

  const syncAutoChecks = useCallback(
    (nextKits: KitId[], nextItems: PackItem[]) => {
      setChecks((prev) => {
        const map: Record<string, boolean> = {};
        prev.forEach((c) => {
          map[c.id] = c.done;
        });
        map.kits = nextKits.length > 0;
        map.pack = nextItems.length > 0 && nextItems.every((i) => i.done);
        const updated = prev.map((c) =>
          c.id === 'kits' || c.id === 'pack' ? { ...c, done: Boolean(map[c.id]) } : c
        );
        try {
          localStorage.setItem(persistKey, JSON.stringify(map));
        } catch {
          /* ignore */
        }
        return updated;
      });
    },
    [persistKey]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/calendar/sync/status?team_id=${encodeURIComponent(teamId)}`, {
        credentials: 'include',
      });
      const json = await res.json();
      const match = (json.data?.nextMatch || null) as OfficialMatch | null;
      setNextMatch(match);

      const key = `${STORAGE_PREFIX}${teamId}:${match?.id || match?.official_slug || 'none'}`;
      const pKey = `${STORAGE_PACK_PREFIX}${teamId}:${match?.id || match?.official_slug || 'none'}`;

      let saved: Record<string, boolean> = {};
      try {
        const raw = localStorage.getItem(key);
        if (raw) saved = JSON.parse(raw);
      } catch {
        /* ignore */
      }

      let storedPack: StoredPack | null = null;
      try {
        const raw = localStorage.getItem(pKey);
        if (raw) storedPack = JSON.parse(raw) as StoredPack;
      } catch {
        /* ignore */
      }

      const nextKits = storedPack?.kits || [];
      const nextItems: PackItem[] = PACK_TEMPLATE.map((t) => ({
        ...t,
        done: Boolean(storedPack?.items?.[t.id]),
      }));

      setKits(nextKits);
      setPackItems(nextItems);

      const withAuto = {
        ...saved,
        kits: nextKits.length > 0 || Boolean(saved.kits),
        pack:
          (nextItems.length > 0 && nextItems.every((i) => i.done)) || Boolean(saved.pack),
      };
      setChecks(buildChecks(match, withAuto));
    } finally {
      setLoading(false);
    }
  }, [teamId, buildChecks]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = (id: string) => {
    setChecks((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c));
      const map: Record<string, boolean> = {};
      next.forEach((c) => {
        map[c.id] = c.done;
      });
      try {
        localStorage.setItem(persistKey, JSON.stringify(map));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const toggleKit = (id: KitId) => {
    setKits((prev) => {
      const next = prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id];
      savePack(next, packItems);
      syncAutoChecks(next, packItems);
      return next;
    });
  };

  const togglePackItem = (id: string) => {
    setPackItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i));
      savePack(kits, next);
      syncAutoChecks(kits, next);
      return next;
    });
  };

  const markCategory = (category: string, done: boolean) => {
    setPackItems((prev) => {
      const next = prev.map((i) => (i.category === category ? { ...i, done } : i));
      savePack(kits, next);
      syncAutoChecks(kits, next);
      return next;
    });
  };

  const doneCount = checks.filter((c) => c.done).length;
  const progress = checks.length ? Math.round((doneCount / checks.length) * 100) : 0;
  const packDone = packItems.filter((i) => i.done).length;
  const packProgress = packItems.length
    ? Math.round((packDone / packItems.length) * 100)
    : 0;

  const categories = useMemo(() => {
    const order: string[] = [];
    for (const i of packItems) {
      if (!order.includes(i.category)) order.push(i.category);
    }
    return order;
  }, [packItems]);

  const handleExportPdf = async () => {
    setExportingPdf(true);
    setPdfError(null);
    try {
      const kitLabels = kits.map(
        (id) => kitOptions.find((k) => k.id === id)?.label || id
      );

      const busSummary: { label: string; done: number; total: number }[] = [];
      try {
        const prefix = `cm-transporte:${teamId}:`;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key || !key.startsWith(prefix)) continue;
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const parsed = JSON.parse(raw) as {
            bus1Name?: string;
            bus2Name?: string;
            cargo?: { bus: string; done: boolean }[];
          };
          if (!parsed.cargo?.length) continue;
          const b1 = parsed.cargo.filter((c) => c.bus === 'bus1');
          const b2 = parsed.cargo.filter((c) => c.bus === 'bus2');
          busSummary.push({
            label: parsed.bus1Name || 'Autobús 1',
            done: b1.filter((c) => c.done).length,
            total: b1.length,
          });
          busSummary.push({
            label: parsed.bus2Name || 'Autobús 2',
            done: b2.filter((c) => c.done).length,
            total: b2.length,
          });
          break;
        }
      } catch {
        /* ignore transporte merge */
      }

      const medicalAlerts: string[] = [];
      try {
        const raw = localStorage.getItem(`cm-caducidades-medico:${teamId}`);
        if (raw) {
          const saved = JSON.parse(raw) as Record<
            string,
            { qty?: number; expiry?: string }
          >;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          for (const [id, row] of Object.entries(saved)) {
            const tpl = [
              { id: 'ice_packs', label: 'Packs de frío', minQty: 12 },
              { id: 'cooler_med', label: 'Nevera médica', minQty: 1 },
              { id: 'cold_spray', label: 'Spray frío', minQty: 4 },
              { id: 'gauze', label: 'Gasas', minQty: 20 },
              { id: 'tape_med', label: 'Vendas', minQty: 10 },
              { id: 'disinfectant', label: 'Antiséptico', minQty: 2 },
              { id: 'gloves', label: 'Guantes', minQty: 2 },
              { id: 'scissors', label: 'Tijeras / pinzas', minQty: 1 },
              { id: 'saline', label: 'Suero', minQty: 6 },
              { id: 'pain_gel', label: 'Geles musculares', minQty: 3 },
              { id: 'glucose', label: 'Gel glucosa', minQty: 6 },
              { id: 'stretcher', label: 'Camilla fisio', minQty: 1 },
            ].find((t) => t.id === id);
            const label = tpl?.label || id;
            const minQty = tpl?.minQty ?? 1;
            const qty = typeof row.qty === 'number' ? row.qty : minQty;
            if (qty < minQty) medicalAlerts.push(`${label}: stock ${qty}/${minQty}`);
            if (row.expiry) {
              const d = new Date(`${row.expiry}T00:00:00`);
              if (!Number.isNaN(d.getTime())) {
                const days = Math.round((d.getTime() - today.getTime()) / 86400000);
                if (days < 0) medicalAlerts.push(`${label}: CADUCADO`);
                else if (days <= 30) medicalAlerts.push(`${label}: caduca en ${days}d`);
              }
            }
          }
        }
      } catch {
        /* ignore medical merge */
      }

      await exportPreMatchPdf(branding.slug as ClubSlug, {
        matchLabel: nextMatch ? `vs ${nextMatch.rival}` : 'Sin partido',
        matchDate: nextMatch
          ? `${nextMatch.match_date}${
              nextMatch.match_time ? ` · ${String(nextMatch.match_time).slice(0, 5)}` : ''
            }`
          : undefined,
        venue: nextMatch?.venue || undefined,
        homeAway:
          nextMatch?.home_away === 'local'
            ? 'Local'
            : nextMatch?.home_away === 'visitante'
              ? 'Visitante'
              : nextMatch?.home_away || undefined,
        competition: nextMatch?.competition || undefined,
        kits: kitLabels,
        checks: checks.map((c) => ({ label: c.label, done: c.done })),
        packing: packItems.map((p) => ({
          category: p.category,
          label: p.label,
          done: p.done,
        })),
        busSummary: busSummary.length ? busSummary : undefined,
        medicalAlerts: medicalAlerts.length ? medicalAlerts : undefined,
      });
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'Error al exportar PDF');
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">
            Operativa utillería
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-7 w-7 text-orange-500" />
            Checklist pre-partido
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Equipación, packing de material y operativa — listo para presentar al club.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleExportPdf()}
          disabled={exportingPdf || loading}
          className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-xs font-bold px-3 py-2.5 transition-colors"
        >
          <FileDown className="h-4 w-4" />
          {exportingPdf ? 'Generando…' : 'PDF informe'}
        </button>
      </div>
      {pdfError ? (
        <p className="text-xs font-semibold text-red-500">{pdfError}</p>
      ) : null}

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold">Cargando próximo partido…</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            {nextMatch ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Próximo encuentro</p>
                    <h3 className="text-lg font-black mt-1">vs {nextMatch.rival}</h3>
                    <p className="text-xs text-slate-500 mt-1">{nextMatch.competition}</p>
                  </div>
                  <Link
                    href="/calendario"
                    className="text-[11px] font-bold text-orange-600 inline-flex items-center gap-1"
                  >
                    Calendario <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">
                      {nextMatch.match_date}
                      {nextMatch.match_time
                        ? ` · ${String(nextMatch.match_time).slice(0, 5)}`
                        : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Plane className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">
                      {nextMatch.home_away === 'local'
                        ? 'Local'
                        : nextMatch.home_away === 'visitante'
                          ? 'Visitante'
                          : 'Neutral'}
                      {nextMatch.venue ? ` · ${nextMatch.venue}` : ''}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold">Sin próximo partido sincronizado</p>
                <p className="text-xs text-slate-500 mt-1">Actualiza el calendario y vuelve aquí.</p>
                <Link href="/calendario" className="inline-block mt-3 text-xs font-bold text-orange-600">
                  Ir a calendario
                </Link>
              </div>
            )}
          </div>

          <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-500">Progreso operativa</p>
              <p className="text-xs font-black text-orange-600">
                {doneCount}/{checks.length} · {progress}%
              </p>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Equipación */}
          <section id="equipacion" className="scroll-mt-24 space-y-3">
            <div className="flex items-center gap-2">
              <Shirt className="h-5 w-5 text-orange-500" />
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                Equipación que llevan
              </h3>
            </div>
            <p className="text-[11px] text-slate-500">
              Marca una o varias: 1ª, 2ª, 3ª, entrenamiento
              {isFootball ? ' y portero' : ''}.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {kitOptions.map((k) => {
                const on = kits.includes(k.id);
                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => toggleKit(k.id)}
                    className={`text-left rounded-xl border px-3 py-3 transition-colors ${
                      on
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <span
                      className={`text-xs font-extrabold block ${
                        on ? 'text-orange-700 dark:text-orange-300' : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {k.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{k.hint}</span>
                  </button>
                );
              })}
            </div>
            {kits.length > 0 && (
              <p className="text-[11px] font-semibold text-emerald-600">
                Seleccionadas:{' '}
                {kits
                  .map((id) => kitOptions.find((k) => k.id === id)?.label || id)
                  .join(' · ')}
              </p>
            )}
          </section>

          {/* Packing material */}
          <section id="packing" className="scroll-mt-24 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-500" />
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                  Material y accesorios
                </h3>
              </div>
              <p className="text-[11px] font-black text-orange-600">
                {packDone}/{packItems.length} · {packProgress}%
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              Todo lo que lleva un equipo de primera: balones, neveras, entrenamiento,
              trajes / chándal de representación, logística y botiquín.
            </p>
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all"
                style={{ width: `${packProgress}%` }}
              />
            </div>

            <div className="space-y-4">
              {categories.map((cat) => {
                const items = packItems.filter((i) => i.category === cat);
                const catDone = items.filter((i) => i.done).length;
                const allDone = catDone === items.length;
                const Icon =
                  cat === 'Hidratación'
                    ? Snowflake
                    : cat === 'Entrenamiento'
                      ? Dumbbell
                      : cat === 'Representación'
                        ? Trophy
                        : cat === 'Médico'
                          ? Stethoscope
                          : Package;

                return (
                  <div
                    key={cat}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="h-4 w-4 text-orange-500 shrink-0" />
                        <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                          {cat}
                        </p>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {catDone}/{items.length}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => markCategory(cat, !allDone)}
                        className="text-[10px] font-bold text-orange-600 hover:underline shrink-0"
                      >
                        {allDone ? 'Desmarcar' : 'Marcar todo'}
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => togglePackItem(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            item.done ? 'bg-emerald-50/40 dark:bg-emerald-950/10' : ''
                          }`}
                        >
                          {item.done ? (
                            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="h-4.5 w-4.5 text-slate-300 shrink-0" />
                          )}
                          <span
                            className={`text-xs font-semibold ${
                              item.done
                                ? 'text-slate-500 line-through'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Operativa links */}
          <section className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 px-0.5">
              Operativa del club
            </h3>
            {checks.map((c) => (
              <div
                key={c.id}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                  c.done
                    ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <button type="button" onClick={() => toggle(c.id)} className="shrink-0" title="Marcar">
                  {c.done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold ${
                      c.done ? 'text-slate-500 line-through' : ''
                    }`}
                  >
                    {c.label}
                  </p>
                </div>
                <Link
                  href={c.href}
                  className="shrink-0 text-[11px] font-bold text-orange-600 inline-flex items-center gap-1"
                >
                  {c.id === 'trip' ? (
                    <Plane className="h-3.5 w-3.5" />
                  ) : c.id === 'laundry' ? (
                    <Shirt className="h-3.5 w-3.5" />
                  ) : c.id === 'medical' ? (
                    <Stethoscope className="h-3.5 w-3.5" />
                  ) : c.id === 'inventory' || c.id === 'pack' ? (
                    <Package className="h-3.5 w-3.5" />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5" />
                  )}
                  Abrir
                </Link>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
