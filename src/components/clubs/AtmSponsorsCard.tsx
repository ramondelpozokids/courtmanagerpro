'use client';

import { Handshake } from 'lucide-react';
import { useClubBranding } from '@/contexts/ClubDemoContext';
import {
  ATM_SPONSORS_MAIN,
  ATM_SPONSORS_OFFICIAL,
  ATM_SPONSORS_PREMIUM,
  ATM_SPONSORS_SUPPLIERS,
  ATM_SPONSORS_URL,
} from '@/data/clubs/atm-data';

function Tier({ label, names }: { label: string; names: readonly string[] }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1.5">{label}</p>
      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">{names.join(' · ')}</p>
    </div>
  );
}

export function AtmSponsorsCard() {
  const branding = useClubBranding();
  if (branding.slug !== 'atm') return null;

  return (
    <div className="text-left">
      <div className="flex items-start gap-3 mb-3">
        <div className="rounded-xl bg-red-500/15 border border-red-500/20 p-2.5">
          <Handshake className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">Patrocinadores oficiales</h3>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            El club vive también de sus partners. Listado de atleticodemadrid.com/patrocinadores.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <Tier label="Principales" names={ATM_SPONSORS_MAIN} />
        <Tier label="Premium" names={ATM_SPONSORS_PREMIUM} />
        <Tier label="Oficiales" names={ATM_SPONSORS_OFFICIAL} />
        <Tier label="Proveedores" names={ATM_SPONSORS_SUPPLIERS} />
      </div>
      <a
        href={ATM_SPONSORS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex mt-4 text-xs font-bold text-red-700 dark:text-red-300 hover:underline underline-offset-2"
      >
        Ver en la web del club
      </a>
    </div>
  );
}
