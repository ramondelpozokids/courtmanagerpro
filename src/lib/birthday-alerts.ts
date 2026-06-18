import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

/** Genera alertas de cumpleaños para Carlos Rodriguez Kobe (utilería). */
export function scanBirthdayAlerts(
  teamId: string = 'team-acb-123',
  referenceDate: Date = new Date()
): number {
  const month = referenceDate.getMonth();
  const year = referenceDate.getFullYear();
  let created = 0;

  for (const player of db.players) {
    if (!player.birthDate) continue;
    const birth = new Date(player.birthDate);
    if (birth.getMonth() !== month) continue;

    const fullName = `${player.firstName} ${player.lastName}`;
    const day = birth.getDate();
    const alertId = `a_bday_${player.id}_${year}`;

    const exists = db.alerts.some(
      (a) => a.id === alertId || (a.type === 'cumpleaños' && a.message.includes(fullName))
    );
    if (exists) continue;

    db.alerts.unshift({
      id: alertId,
      team_id: teamId,
      type: 'cumpleaños',
      severity: 'info',
      title: 'Cumpleaños de la Plantilla',
      message: `¡AVISO PARA CARLOS KOBE! ${fullName} cumple años el ${day} de ${MONTH_NAMES[month]}. Preparar lote de equipación oficial de regalo corporativo del club.`,
      entity_type: 'player',
      entity_id: player.id,
      is_read: false,
      is_dismissed: false,
      read_by: null,
      read_at: null,
      auto_generated: true,
      metadata: { notify: 'charlie-r-k@hotmail.com', player_id: player.id },
      created_at: new Date().toISOString(),
    });
    created++;
  }

  return created;
}

export function getUpcomingBirthdays(month?: number) {
  const m = month ?? new Date().getMonth();
  return db.players
    .filter((p) => p.birthDate && new Date(p.birthDate).getMonth() === m)
    .map((p) => ({
      name: `${p.firstName} ${p.lastName}`,
      day: new Date(p.birthDate).getDate(),
      dorsal: p.number,
    }))
    .sort((a, b) => a.day - b.day);
}
