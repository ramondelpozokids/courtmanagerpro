'use client';

import Link from 'next/link';
import { ArrowLeft, History, Mail, MessageCircle, Phone, PhoneCall } from 'lucide-react';
import type { EquipmentHistoryEntry, EquipmentTeamMember } from '../types';
import { memberFullName } from '../types';

function initials(m: EquipmentTeamMember) {
  return `${m.first_name.charAt(0)}${m.last_name.charAt(0)}`.toUpperCase();
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function MemberProfile({
  member,
  history,
}: {
  member: EquipmentTeamMember;
  history: EquipmentHistoryEntry[];
}) {
  const name = memberFullName(member);
  const wa = member.whatsapp?.replace(/\D/g, '');
  const memberHistory = history.filter((h) => h.entity_id === member.id || h.details?.includes(name));

  return (
    <div className="space-y-6 text-left">
      <Link
        href="/equipment-team"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-orange-400"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver al hub
      </Link>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-orange-500/50 bg-slate-800 flex items-center justify-center shrink-0">
            {member.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={member.photo_url} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-orange-400">{initials(member)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black tracking-tight">{name}</h1>
            <p className="text-orange-400 font-bold text-sm mt-1">{member.role}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                  member.is_active
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-700 text-slate-400 border border-slate-600'
                }`}
              >
                {member.is_active ? 'Activo' : 'Inactivo'}
              </span>
              {member.joined_at && (
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  Desde {member.joined_at}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <InfoRow label="Email" value={member.email} />
          <InfoRow label="Móvil" value={member.phone_mobile} />
          <InfoRow label="Fijo" value={member.phone_landline} />
          <InfoRow label="WhatsApp" value={member.whatsapp} />
          <InfoRow label="Última conexión" value={formatDate(member.last_seen_at)} />
        </div>

        {member.notes && (
          <div className="mt-5 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Observaciones</p>
            <p className="text-sm text-slate-300 leading-relaxed">{member.notes}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
            >
              <Mail className="h-3.5 w-3.5" /> Email
            </a>
          )}
          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
          )}
          {member.phone_mobile && (
            <a
              href={`tel:${member.phone_mobile.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
            >
              <Phone className="h-3.5 w-3.5" /> Llamar
            </a>
          )}
          {member.phone_landline && (
            <a
              href={`tel:${member.phone_landline.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold"
            >
              <PhoneCall className="h-3.5 w-3.5" /> Fijo
            </a>
          )}
          <a
            href="#historial"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-orange-400 text-xs font-bold"
          >
            <History className="h-3.5 w-3.5" /> Historial
          </a>
        </div>
      </div>

      <div id="historial" className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <History className="h-4 w-4 text-orange-500" />
          Historial relacionado
        </h2>
        {memberHistory.length === 0 ? (
          <p className="text-xs text-slate-500 mt-3">Sin eventos registrados para este compañero.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {memberHistory.slice(0, 20).map((h) => (
              <li
                key={h.id}
                className="text-xs text-slate-600 dark:text-slate-300 border-l-2 border-orange-500/40 pl-3 py-1"
              >
                <span className="font-bold text-slate-800 dark:text-slate-100">{h.actor_name}</span>{' '}
                {h.action}
                {h.details ? ` — ${h.details}` : ''}
                <span className="block text-[10px] text-slate-400 mt-0.5">{formatDate(h.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="rounded-lg bg-slate-950/40 border border-slate-800 px-3 py-2">
      <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-200 mt-0.5 truncate">{value || '—'}</p>
    </div>
  );
}
