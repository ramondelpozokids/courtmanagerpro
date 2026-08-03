'use client';

import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/** Banner visible solo para la cuenta de evaluación ATM. */
export function AtmDemoBanner() {
  const { isAtmDemo } = useAuth();
  if (!isAtmDemo) return null;

  return (
    <div className="bg-red-700 text-white px-4 py-2 text-center text-[11px] font-semibold tracking-wide flex items-center justify-center gap-2">
      <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
      <span>
        Modo evaluación Atleti Lab — solo Atlético de Madrid · sin superadmin · sin cambios de plataforma
      </span>
    </div>
  );
}
