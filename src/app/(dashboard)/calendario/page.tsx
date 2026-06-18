'use client';

import { PortalBackHeader } from '@/components/legal/LegalPageView';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { Calendar, ExternalLink } from 'lucide-react';

const OFFICIAL_CALENDAR_URL =
  'https://www.realmadrid.com/es-ES/calendario?filter-football=&filter-basketball=';

const extraFixtures = [
  { date: '2026-06-28', competition: 'Liga Endesa', rival: 'Barcelona', venue: 'WiZink Center (Local)' },
  { date: '2026-07-02', competition: 'Euroliga', rival: 'Panathinaikos', venue: 'Atenas (Visitante)' },
  { date: '2026-07-08', competition: 'Copa del Rey', rival: 'Baskonia', venue: 'Final Four — Madrid' },
];

export default function CalendarioPage() {
  const trips = db.trips;

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      <PortalBackHeader
        title="Calendario Oficial RMB"
        subtitle="Partidos y desplazamientos de utilería — Liga Endesa 2025/2026"
      />

      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300">
        Estás dentro de CourtManager Pro. Usa <strong>Volver al Dashboard</strong> arriba para regresar sin salir de la app.
        Si necesitas el calendario completo del club, ábrelo en la web oficial (nueva pestaña).
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
          <Calendar className="h-5 w-5 text-orange-500" />
          Viajes de utilería programados
        </h2>
        <div className="grid gap-3">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{trip.destination} — vs {trip.opponent}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Salida: {trip.departureDate} · Regreso: {trip.returnDate}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 h-fit">
                  {trip.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Próximos partidos (referencia)</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Competición</th>
                <th className="p-3">Rival</th>
                <th className="p-3">Sede</th>
              </tr>
            </thead>
            <tbody>
              {extraFixtures.map((f) => (
                <tr key={f.date + f.rival} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-3 font-medium">{f.date}</td>
                  <td className="p-3">{f.competition}</td>
                  <td className="p-3">{f.rival}</td>
                  <td className="p-3 text-slate-500">{f.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <a
        href={OFFICIAL_CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition-colors"
      >
        Abrir calendario completo en realmadrid.com
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
