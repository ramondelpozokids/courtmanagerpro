import type { SupabaseClient } from '@supabase/supabase-js';
import {
  BIRTHDAY_ALERT_RECIPIENT,
  BIRTHDAY_SEND_HOUR_MADRID,
} from '@/config/birthday-alerts';
import { buildDedupeKey, getMadridNowParts } from './dateUtils';
import { sendBirthdayEmailWithRetries } from './emailSender';
import {
  collectBirthdayPeople,
  filterTomorrowBirthdays,
  getUpcomingBirthdaysList,
} from './rosterBirthdays';
import type { BirthdayNotificationRecord, BirthdayPerson } from './types';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { isDemoMode } from '@/lib/app-mode';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';

declare global {
  // eslint-disable-next-line no-var
  var __cmBirthdayNotifications: BirthdayNotificationRecord[] | undefined;
}

function ensureDemoNotifications(): BirthdayNotificationRecord[] {
  if (!globalThis.__cmBirthdayNotifications) globalThis.__cmBirthdayNotifications = [];
  return globalThis.__cmBirthdayNotifications;
}

export function getDemoBirthdayNotifications(teamId: string, limit = 50) {
  return ensureDemoNotifications()
    .filter((n) => n.team_id === teamId)
    .sort((a, b) => (a.sent_at < b.sent_at ? 1 : -1))
    .slice(0, limit);
}

function uuid(): string {
  return `bday-${Date.now().toString(16)}-${Math.random().toString(36).slice(2, 7)}`;
}

async function alreadySent(
  supabase: SupabaseClient | null,
  teamId: string,
  dedupeKey: string
): Promise<boolean> {
  if (!supabase || isDemoMode()) {
    return ensureDemoNotifications().some(
      (n) => n.team_id === teamId && n.dedupe_key === dedupeKey && n.status === 'sent'
    );
  }
  const { data } = await supabase
    .from('birthday_notifications')
    .select('id, status')
    .eq('team_id', teamId)
    .eq('dedupe_key', dedupeKey)
    .eq('status', 'sent')
    .maybeSingle();
  return Boolean(data?.id);
}

async function recordNotification(
  supabase: SupabaseClient | null,
  row: Omit<BirthdayNotificationRecord, 'id' | 'created_at'> & { id?: string }
): Promise<void> {
  const full: BirthdayNotificationRecord = {
    id: row.id || uuid(),
    created_at: new Date().toISOString(),
    ...row,
  } as BirthdayNotificationRecord;

  if (!supabase || isDemoMode()) {
    const store = ensureDemoNotifications();
    const idx = store.findIndex((n) => n.dedupe_key === full.dedupe_key && n.team_id === full.team_id);
    if (idx >= 0) store[idx] = full;
    else store.unshift(full);
    return;
  }

  const { error } = await supabase.from('birthday_notifications').upsert(
    {
      team_id: full.team_id,
      person_name: full.person_name,
      person_role: full.person_role,
      person_type: full.person_type,
      person_id: full.person_id,
      birthday_date: full.birthday_date,
      turning_age: full.turning_age,
      recipient_email: full.recipient_email,
      recipient_name: full.recipient_name,
      sent_at: full.sent_at,
      status: full.status,
      attempts: full.attempts,
      error_message: full.error_message,
      dedupe_key: full.dedupe_key,
      metadata: full.metadata,
    },
    { onConflict: 'team_id,dedupe_key' }
  );
  if (error) console.warn('[birthday-alerts] record failed:', error.message);
}

async function createDashboardFailureAlert(
  supabase: SupabaseClient | null,
  teamId: string,
  errorMessage: string,
  people: BirthdayPerson[]
) {
  const payload = {
    team_id: teamId,
    type: 'cumpleanos_email_error',
    severity: 'critical',
    title: 'Correo de cumpleaños no enviado',
    message: `No se pudo enviar el recordatorio a ${BIRTHDAY_ALERT_RECIPIENT.email}: ${errorMessage}. Personas: ${people.map((p) => p.full_name).join(', ')}`,
    entity_type: 'birthday_notification',
    entity_id: null,
    is_read: false,
    is_dismissed: false,
    auto_generated: true,
    metadata: {
      recipient: BIRTHDAY_ALERT_RECIPIENT.email,
      people: people.map((p) => p.full_name),
    },
  };

  if (!supabase || isDemoMode()) {
    db.alerts.unshift({
      id: `a-bday-fail-${Date.now()}`,
      ...payload,
      read_by: null,
      read_at: null,
      created_at: new Date().toISOString(),
    });
    return;
  }

  await supabase.from('alerts').insert(payload);
}

export interface BirthdayJobResult {
  skipped: boolean;
  reason?: string;
  madridHour: number;
  tomorrowCount: number;
  sent: boolean;
  alreadySent: boolean;
  people: BirthdayPerson[];
  upcoming: BirthdayPerson[];
  error: string | null;
  attempts: number;
}

export async function runBirthdayEmailJob(params: {
  supabase: SupabaseClient | null;
  teamId?: string;
  force?: boolean;
  /** When true, ignore the 08:00 Madrid gate (manual / tests). */
  ignoreHourGate?: boolean;
  referenceDate?: Date;
}): Promise<BirthdayJobResult> {
  const teamId = params.teamId || DEFAULT_TEAM_ID;
  const madrid = getMadridNowParts(params.referenceDate);

  const peopleAll = await collectBirthdayPeople({
    supabase: params.supabase,
    teamId,
    referenceDate: params.referenceDate,
  });
  const upcoming = getUpcomingBirthdaysList(peopleAll, 12);
  const tomorrow = filterTomorrowBirthdays(peopleAll, madrid.isoDate);

  if (!params.ignoreHourGate && !params.force && madrid.hour !== BIRTHDAY_SEND_HOUR_MADRID) {
    return {
      skipped: true,
      reason: `Fuera de franja (hora Madrid ${madrid.hour}:00; se envía a las ${BIRTHDAY_SEND_HOUR_MADRID}:00)`,
      madridHour: madrid.hour,
      tomorrowCount: tomorrow.length,
      sent: false,
      alreadySent: false,
      people: tomorrow,
      upcoming,
      error: null,
      attempts: 0,
    };
  }

  if (tomorrow.length === 0) {
    return {
      skipped: true,
      reason: 'No hay cumpleaños mañana',
      madridHour: madrid.hour,
      tomorrowCount: 0,
      sent: false,
      alreadySent: false,
      people: [],
      upcoming,
      error: null,
      attempts: 0,
    };
  }

  // Dedupe: one email per day covering all people — key by recipient + tomorrow date
  const batchKey = buildDedupeKey(
    `batch:${tomorrow
      .map((p) => p.official_slug || p.id)
      .sort()
      .join(',')}`,
    tomorrow[0].next_birthday,
    BIRTHDAY_ALERT_RECIPIENT.email
  );

  if (!params.force && (await alreadySent(params.supabase, teamId, batchKey))) {
    return {
      skipped: true,
      reason: 'Correo ya enviado (sin duplicados)',
      madridHour: madrid.hour,
      tomorrowCount: tomorrow.length,
      sent: false,
      alreadySent: true,
      people: tomorrow,
      upcoming,
      error: null,
      attempts: 0,
    };
  }

  const send = await sendBirthdayEmailWithRetries(tomorrow, 3);
  const now = new Date().toISOString();

  if (send.ok) {
    await recordNotification(params.supabase, {
      team_id: teamId,
      person_name: tomorrow.map((p) => p.full_name).join(', '),
      person_role: tomorrow.map((p) => p.role).join(', '),
      person_type: tomorrow[0].person_type,
      person_id: tomorrow.map((p) => p.id).join(','),
      birthday_date: tomorrow[0].next_birthday,
      turning_age: tomorrow[0].turning_age,
      recipient_email: BIRTHDAY_ALERT_RECIPIENT.email,
      recipient_name: BIRTHDAY_ALERT_RECIPIENT.name,
      sent_at: now,
      status: 'sent',
      attempts: send.attempts,
      error_message: send.simulated ? 'Simulado (sin proveedor SMTP/Resend)' : null,
      dedupe_key: batchKey,
      metadata: {
        people: tomorrow,
        provider: send.provider,
        simulated: Boolean(send.simulated),
      },
    });

    // Also per-person rows for historial detail
    for (const p of tomorrow) {
      const personKey = buildDedupeKey(p.official_slug || p.id, p.next_birthday, BIRTHDAY_ALERT_RECIPIENT.email);
      await recordNotification(params.supabase, {
        team_id: teamId,
        person_name: p.full_name,
        person_role: p.role,
        person_type: p.person_type,
        person_id: p.id,
        birthday_date: p.next_birthday,
        turning_age: p.turning_age,
        recipient_email: BIRTHDAY_ALERT_RECIPIENT.email,
        recipient_name: BIRTHDAY_ALERT_RECIPIENT.name,
        sent_at: now,
        status: 'sent',
        attempts: send.attempts,
        error_message: null,
        dedupe_key: personKey,
        metadata: { batch: batchKey, provider: send.provider },
      });
    }

    return {
      skipped: false,
      madridHour: madrid.hour,
      tomorrowCount: tomorrow.length,
      sent: true,
      alreadySent: false,
      people: tomorrow,
      upcoming,
      error: null,
      attempts: send.attempts,
    };
  }

  await recordNotification(params.supabase, {
    team_id: teamId,
    person_name: tomorrow.map((p) => p.full_name).join(', '),
    person_role: tomorrow.map((p) => p.role).join(', '),
    person_type: tomorrow[0].person_type,
    person_id: tomorrow.map((p) => p.id).join(','),
    birthday_date: tomorrow[0].next_birthday,
    turning_age: tomorrow[0].turning_age,
    recipient_email: BIRTHDAY_ALERT_RECIPIENT.email,
    recipient_name: BIRTHDAY_ALERT_RECIPIENT.name,
    sent_at: now,
    status: 'failed',
    attempts: send.attempts,
    error_message: send.error,
    dedupe_key: `${batchKey}|failed|${now}`,
    metadata: { people: tomorrow, provider: send.provider },
  });

  await createDashboardFailureAlert(params.supabase, teamId, send.error || 'Error desconocido', tomorrow);

  return {
    skipped: false,
    madridHour: madrid.hour,
    tomorrowCount: tomorrow.length,
    sent: false,
    alreadySent: false,
    people: tomorrow,
    upcoming,
    error: send.error,
    attempts: send.attempts,
  };
}

export async function getBirthdayDashboardData(params: {
  supabase: SupabaseClient | null;
  teamId: string;
}) {
  const people = await collectBirthdayPeople(params);
  return {
    upcoming: getUpcomingBirthdaysList(people, 10),
    tomorrow: filterTomorrowBirthdays(people),
    recipient: BIRTHDAY_ALERT_RECIPIENT,
  };
}
