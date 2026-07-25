'use client';

import Link from 'next/link';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import type { EquipmentTeamMember } from '../types';
import { memberFullName } from '../types';

function initials(m: EquipmentTeamMember) {
  return `${m.first_name.charAt(0)}${m.last_name.charAt(0)}`.toUpperCase();
}

export function MemberCard({ member }: { member: EquipmentTeamMember }) {
  const name = memberFullName(member);
  const wa = member.whatsapp?.replace(/\D/g, '');

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 text-left shadow-sm hover:border-orange-500/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center shrink-0">
          {member.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.photo_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-black text-orange-400">{initials(member)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={`/equipment-team/${member.id}`}
            className="font-extrabold text-sm text-slate-800 dark:text-slate-100 hover:text-orange-500 transition-colors block truncate"
          >
            {name}
          </Link>
          <p className="text-xs text-orange-500 font-bold mt-0.5">{member.role}</p>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {member.is_active ? 'Activo' : 'Inactivo'}
            {member.email ? ` · ${member.email}` : ''}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-orange-400"
            title="Email"
          >
            <Mail className="h-3.5 w-3.5" />
          </a>
        )}
        {wa && (
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-400"
            title="WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </a>
        )}
        {member.phone_mobile && (
          <a
            href={`tel:${member.phone_mobile.replace(/\s/g, '')}`}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-sky-400"
            title="Llamar"
          >
            <Phone className="h-3.5 w-3.5" />
          </a>
        )}
        <Link
          href={`/equipment-team/${member.id}`}
          className="ml-auto text-[11px] font-bold text-orange-500 hover:underline"
        >
          Ver ficha →
        </Link>
      </div>
    </div>
  );
}
