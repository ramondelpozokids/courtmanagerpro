'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  Bus,
  Package,
  Users,
  CheckCircle2,
  Circle,
  Plane,
  ExternalLink,
  Clock,
  MapPin,
  Shirt,
  Stethoscope,
  Snowflake,
  Briefcase,
  FileDown,
} from 'lucide-react';
import { useActiveTeamId, useClubBranding } from '@/contexts/ClubDemoContext';
import { useTrips } from '@/hooks/useTrips';
import { usePlayers } from '@/hooks/usePlayers';
import { exportTransportPdf } from '@/lib/pdf-export';
import type { ClubSlug } from '@/data/clubs/types';

type BusId = 'bus1' | 'bus2';

type CargoItem = {
  id: string;
  label: string;
  bus: BusId;
  done: boolean;
};

type TransportState = {
  tripId: string | null;
  bus1Name: string;
  bus2Name: string;
  bus1Driver: string;
  bus2Driver: string;
  departureTime: string;
  meetingPoint: string;
  notes: string;
  cargo: CargoItem[];
};

const STORAGE_PREFIX = 'cm-transporte:';

const DEFAULT_CARGO: Omit<CargoItem, 'done'>[] = [
  // Bus 1 — plantilla / staff
  { id: 'b1_players', label: 'Plantilla jugadores (asientos asignados)', bus: 'bus1' },
  { id: 'b1_coaching', label: 'Cuerpo técnico (entrenador + asistentes)', bus: 'bus1' },
  { id: 'b1_medical_staff', label: 'Staff médico / fisioterapia a bordo', bus: 'bus1' },
  { id: 'b1_rep', label: 'Trajes / chándal de representación (jugadores)', bus: 'bus1' },
  { id: 'b1_hand_luggage', label: 'Equipaje de mano jugadores (mochilas)', bus: 'bus1' },
  { id: 'b1_water', label: 'Agua / snacks cabina plantilla', bus: 'bus1' },
  { id: 'b1_pass', label: 'Pases / acreditaciones / documentación viaje', bus: 'bus1' },
  // Bus 2 — utilería / material
  { id: 'b2_kit1', label: 'Petates 1ª equipación', bus: 'bus2' },
  { id: 'b2_kit2', label: 'Petates 2ª equipación', bus: 'bus2' },
  { id: 'b2_kit3', label: 'Petates 3ª equipación', bus: 'bus2' },
  { id: 'b2_train', label: 'Equipación entrenamiento', bus: 'bus2' },
  { id: 'b2_gk', label: 'Material porteros', bus: 'bus2' },
  { id: 'b2_balls', label: 'Balones partido + entrenamiento', bus: 'bus2' },
  { id: 'b2_coolers', label: 'Neveras / hidratación banquillo', bus: 'bus2' },
  { id: 'b2_medical', label: 'Botiquín viaje + camilla fisio', bus: 'bus2' },
  { id: 'b2_cones', label: 'Material entrenamiento (conos, petos, GPS)', bus: 'bus2' },
  { id: 'b2_laundry', label: 'Sacos ropa sucia / vacíos retorno', bus: 'bus2' },
  { id: 'b2_hangers', label: 'Perchas, fundas y kit costura', bus: 'bus2' },
  { id: 'b2_staff', label: 'Utilleros a bordo (responsable material)', bus: 'bus2' },
];

function defaultState(tripId: string | null): TransportState {
  return {
    tripId,
    bus1Name: 'Autobús 1 — Plantilla',
    bus2Name: 'Autobús 2 — Utilería',
    bus1Driver: '',
    bus2Driver: '',
    departureTime: '11:00',
    meetingPoint: 'Ciudad Deportiva — parking utilería',
    notes: '',
    cargo: DEFAULT_CARGO.map((c) => ({ ...c, done: false })),
  };
}

export default function TransportePage() {
  const teamId = useActiveTeamId();
  const branding = useClubBranding();
  const { trips, loading } = useTrips();
  const { players } = usePlayers(teamId);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [state, setState] = useState<TransportState>(() => defaultState(null));
  const [exportingPdf, setExportingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const storageKey = `${STORAGE_PREFIX}${teamId}:${selectedTripId || 'none'}`;

  useEffect(() => {
    if (!trips.length) {
      setSelectedTripId(null);
      return;
    }
    if (!selectedTripId || !trips.some((t) => t.id === selectedTripId)) {
      setSelectedTripId(trips[0].id);
    }
  }, [trips, selectedTripId]);

  useEffect(() => {
    const tripId = selectedTripId;
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${teamId}:${tripId || 'none'}`);
      if (raw) {
        const parsed = JSON.parse(raw) as TransportState;
        // Merge plantilla cargo por si añadimos ítems nuevos
        const byId = new Map(parsed.cargo?.map((c) => [c.id, c]) || []);
        const cargo = DEFAULT_CARGO.map((c) => ({
          ...c,
          done: Boolean(byId.get(c.id)?.done),
          bus: (byId.get(c.id)?.bus as BusId) || c.bus,
        }));
        setState({
          ...defaultState(tripId),
          ...parsed,
          tripId,
          cargo,
        });
        return;
      }
    } catch {
      /* ignore */
    }
    setState(defaultState(tripId));
  }, [teamId, selectedTripId]);

  const persist = useCallback(
    (next: TransportState) => {
      setState(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  const activeTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  const bus1Cargo = state.cargo.filter((c) => c.bus === 'bus1');
  const bus2Cargo = state.cargo.filter((c) => c.bus === 'bus2');
  const bus1Done = bus1Cargo.filter((c) => c.done).length;
  const bus2Done = bus2Cargo.filter((c) => c.done).length;
  const totalDone = state.cargo.filter((c) => c.done).length;
  const progress = state.cargo.length
    ? Math.round((totalDone / state.cargo.length) * 100)
    : 0;

  const toggleCargo = (id: string) => {
    persist({
      ...state,
      cargo: state.cargo.map((c) => (c.id === id ? { ...c, done: !c.done } : c)),
    });
  };

  const moveCargo = (id: string, bus: BusId) => {
    persist({
      ...state,
      cargo: state.cargo.map((c) => (c.id === id ? { ...c, bus } : c)),
    });
  };

  const markBus = (bus: BusId, done: boolean) => {
    persist({
      ...state,
      cargo: state.cargo.map((c) => (c.bus === bus ? { ...c, done } : c)),
    });
  };

  const patch = (partial: Partial<TransportState>) => {
    persist({ ...state, ...partial });
  };

  const handleExportPdf = async () => {
    if (!activeTrip) return;
    setExportingPdf(true);
    setPdfError(null);
    try {
      const KIT_LABELS: Record<string, string> = {
        primera: '1ª',
        segunda: '2ª',
        tercera: '3ª',
        entrenamiento: 'Entreno',
        portero: 'Portero',
      };
      let convocados: { dorsal: number; name: string; kit: string }[] | undefined;
      try {
        // Prefer any convocatoria saved for this team (latest match key variants)
        const prefix = `cm-convocatoria:${teamId}:`;
        let best: { selectedIds: string[]; kits: Record<string, string> } | null = null;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key || !key.startsWith(prefix)) continue;
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const parsed = JSON.parse(raw) as { selectedIds?: string[]; kits?: Record<string, string> };
          if (parsed.selectedIds?.length) {
            best = {
              selectedIds: parsed.selectedIds,
              kits: parsed.kits || {},
            };
            break;
          }
        }
        if (best?.selectedIds.length) {
          const byId = new Map(players.map((p) => [p.id, p]));
          convocados = best.selectedIds
            .map((id) => byId.get(id))
            .filter(Boolean)
            .map((p) => ({
              dorsal: p!.dorsal,
              name: p!.full_name,
              kit: KIT_LABELS[best!.kits[p!.id]] || best!.kits[p!.id] || '—',
            }))
            .sort((a, b) => a.dorsal - b.dorsal);
        }
      } catch {
        /* ignore convocatoria merge */
      }

      await exportTransportPdf(branding.slug as ClubSlug, {
        tripLabel: `vs ${activeTrip.opponent}`,
        destination: activeTrip.destination,
        departureDates: `${activeTrip.departureDate} → ${activeTrip.returnDate}`,
        bus1Name: state.bus1Name,
        bus2Name: state.bus2Name,
        bus1Driver: state.bus1Driver,
        bus2Driver: state.bus2Driver,
        departureTime: state.departureTime,
        meetingPoint: state.meetingPoint,
        notes: state.notes,
        cargo: state.cargo.map((c) => ({ label: c.label, bus: c.bus, done: c.done })),
        convocados,
      });
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'Error al exportar PDF');
    } finally {
      setExportingPdf(false);
    }
  };

  const isFootball =
    branding.sport === 'football' || branding.slug === 'atm' || branding.slug === 'rmf';

  const busHint = useMemo(
    () =>
      isFootball
        ? 'Desplazamiento típico de primer equipo: dos autobuses (plantilla + utilería).'
        : 'Logística de desplazamiento del primer equipo en dos vehículos.',
    [isFootball]
  );

  const renderBusCard = (
    bus: BusId,
    title: string,
    nameKey: 'bus1Name' | 'bus2Name',
    driverKey: 'bus1Driver' | 'bus2Driver',
    items: CargoItem[],
    done: number,
    icon: ReactNode
  ) => {
    const allDone = items.length > 0 && done === items.length;
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {icon}
              <div className="min-w-0">
                <input
                  value={state[nameKey]}
                  onChange={(e) => patch({ [nameKey]: e.target.value })}
                  className="w-full text-sm font-extrabold bg-transparent border-0 p-0 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-0"
                />
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {title} · {done}/{items.length}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => markBus(bus, !allDone)}
              className="text-[10px] font-bold text-orange-600 hover:underline shrink-0"
            >
              {allDone ? 'Desmarcar' : 'Listo'}
            </button>
          </div>
          <input
            value={state[driverKey]}
            onChange={(e) => patch({ [driverKey]: e.target.value })}
            placeholder="Conductor / empresa de transporte"
            className="mt-2 w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-2 px-3 py-2.5 ${
                item.done ? 'bg-emerald-50/40 dark:bg-emerald-950/10' : ''
              }`}
            >
              <button type="button" onClick={() => toggleCargo(item.id)} className="shrink-0">
                {item.done ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                ) : (
                  <Circle className="h-4.5 w-4.5 text-slate-300" />
                )}
              </button>
              <button
                type="button"
                onClick={() => toggleCargo(item.id)}
                className={`flex-1 text-left text-xs font-semibold ${
                  item.done ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {item.label}
              </button>
              <button
                type="button"
                title={bus === 'bus1' ? 'Mover a autobús 2' : 'Mover a autobús 1'}
                onClick={() => moveCargo(item.id, bus === 'bus1' ? 'bus2' : 'bus1')}
                className="text-[9px] font-bold uppercase tracking-wide text-slate-400 hover:text-orange-600 shrink-0 px-1.5 py-0.5 rounded border border-transparent hover:border-orange-200"
              >
                ↔
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">
            Servicios · {branding.shortName}
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Bus className="h-7 w-7 text-orange-500" />
            Transporte y equipaje
          </h2>
          <p className="text-xs text-slate-500 mt-1">{busHint}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:underline"
          >
            Lista de viajes <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          {activeTrip ? (
            <button
              type="button"
              onClick={() => void handleExportPdf()}
              disabled={exportingPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-xs font-bold"
            >
              <FileDown className="h-3.5 w-3.5" />
              {exportingPdf ? 'Generando…' : 'PDF manifiesto'}
            </button>
          ) : null}
          {pdfError ? <p className="text-[10px] text-red-500 font-semibold max-w-[220px] text-right">{pdfError}</p> : null}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs font-semibold">
          Cargando desplazamientos…
        </div>
      ) : !activeTrip ? (
        <div className="rounded-xl border py-16 text-center text-slate-400">
          <Plane className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-bold text-slate-600">Sin viajes planificados</p>
          <Link href="/trips" className="text-xs font-bold text-orange-600 mt-2 inline-block">
            Ir a Viajes
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {trips.map((trip) => (
              <button
                key={trip.id}
                type="button"
                onClick={() => setSelectedTripId(trip.id)}
                className={`px-3 py-2 rounded-xl border text-left text-xs transition-colors ${
                  activeTrip.id === trip.id
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <span className="font-extrabold text-slate-800 dark:text-slate-100 block">
                  vs {trip.opponent}
                </span>
                <span className="text-[10px] text-slate-400">{trip.destination}</span>
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Desplazamiento</p>
                <h3 className="text-lg font-black mt-0.5">vs {activeTrip.opponent}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-orange-500" />
                  {activeTrip.destination}
                </p>
              </div>
              <div className="text-right text-xs text-slate-500 space-y-1">
                <p className="flex items-center justify-end gap-1.5 font-semibold">
                  <Clock className="h-3.5 w-3.5 text-orange-500" />
                  {activeTrip.departureDate} → {activeTrip.returnDate}
                </p>
                {activeTrip.notes ? (
                  <p className="text-[10px] italic max-w-xs">{activeTrip.notes}</p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Salida autobuses</span>
                <input
                  type="time"
                  value={state.departureTime}
                  onChange={(e) => patch({ departureTime: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Punto de encuentro
                </span>
                <input
                  value={state.meetingPoint}
                  onChange={(e) => patch({ meetingPoint: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Notas de transporte
              </span>
              <textarea
                value={state.notes}
                onChange={(e) => patch({ notes: e.target.value })}
                rows={2}
                placeholder="Parking estadio, orden de carga, contacto seguridad, restricciones…"
                className="mt-1 w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent resize-y"
              />
            </label>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-bold text-slate-500">Carga lista (ambos buses)</p>
                <p className="text-xs font-black text-orange-600">
                  {totalDone}/{state.cargo.length} · {progress}%
                </p>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderBusCard(
              'bus1',
              'Pasajeros',
              'bus1Name',
              'bus1Driver',
              bus1Cargo,
              bus1Done,
              <Users className="h-5 w-5 text-orange-500 shrink-0" />
            )}
            {renderBusCard(
              'bus2',
              'Material',
              'bus2Name',
              'bus2Driver',
              bus2Cargo,
              bus2Done,
              <Package className="h-5 w-5 text-orange-500 shrink-0" />
            )}
          </div>

          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-4 text-[11px] text-slate-500 space-y-2">
            <p className="font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
              Operativa habitual · primer equipo
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
              <li className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-orange-500" /> Autobús 1: plantilla + cuerpo técnico
              </li>
              <li className="flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-orange-500" /> Autobús 2: petates, neveras, balones
              </li>
              <li className="flex items-center gap-1.5">
                <Shirt className="h-3.5 w-3.5 text-orange-500" /> Equipaciones 1ª / 2ª / 3ª / entreno
              </li>
              <li className="flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-orange-500" /> Botiquín y fisio en bus de material
              </li>
              <li className="flex items-center gap-1.5">
                <Snowflake className="h-3.5 w-3.5 text-orange-500" /> Neveras cargadas al final (frío)
              </li>
              <li className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-orange-500" /> Utillero responsable en bus 2
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
