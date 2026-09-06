"use client";

import { Cake } from "lucide-react";
import { UpcomingBirthdaysCard } from "@/components/dashboard/UpcomingBirthdaysCard";
import { CARLOS_EMAIL, SUPERADMIN_EMAIL } from "@/lib/access-constants";

export default function BirthdaysPage() {
  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Cumpleaños
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Plantilla y cuerpo técnico del club activo. El aviso por correo sale
          el día anterior a las 8:00 (Madrid) a Carlos ({CARLOS_EMAIL}) y a
          Ramón ({SUPERADMIN_EMAIL}).
        </p>
      </div>

      <UpcomingBirthdaysCard />

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs text-slate-500 space-y-1">
        <p className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
          <Cake className="h-4 w-4 text-orange-500" />
          Aviso automático
        </p>
        <p>
          Si mañana cumple años un jugador o un miembro del staff con fecha de
          nacimiento en ficha, se envía un correo a los dos. No se reenvía el
          mismo aviso dos veces el mismo día.
        </p>
      </div>
    </div>
  );
}
