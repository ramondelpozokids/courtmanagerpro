import { CARLOS_EMAIL, SUPERADMIN_EMAIL } from '@/lib/access-constants';

/**
 * Destinatarios reales del aviso de cumpleaños.
 * Un solo envío automático a ambos (sin reenvío manual ni modo prueba).
 */
export const BIRTHDAY_ALERT_RECIPIENTS = [
  {
    name: 'Ramón del Pozo Rott',
    email: SUPERADMIN_EMAIL,
    role: 'superadmin' as const,
  },
  {
    name: 'Carlos Rodríguez Kobe',
    email: CARLOS_EMAIL,
    role: 'equipment_manager' as const,
  },
] as const;

export const BIRTHDAY_ALERT_RECIPIENT = BIRTHDAY_ALERT_RECIPIENTS[0];

export const BIRTHDAY_ALERT_RECIPIENT_EMAILS: string[] = BIRTHDAY_ALERT_RECIPIENTS.map(
  (r) => r.email
);

export const BIRTHDAY_EMAIL_SUBJECT = '🎂 Recordatorio de cumpleaños - Mañana';

/** Hora local (Europe/Madrid) a la que se envía el recordatorio diario. */
export const BIRTHDAY_SEND_HOUR_MADRID = 8;
