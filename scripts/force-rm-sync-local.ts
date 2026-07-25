/**
 * Fuerza sync local de plantilla + calendario (demo store).
 * Uso: npx tsx scripts/force-rm-sync-local.ts
 */
import { DEFAULT_TEAM_ID } from '../src/lib/team-constants';
import { applyDemoRosterSync } from '../src/application/roster-sync/demoStore';
import { applyDemoCalendarSync } from '../src/application/calendar-sync/demoStore';

async function main() {
  const teamId = DEFAULT_TEAM_ID;
  console.log('Roster sync…');
  const roster = await applyDemoRosterSync({ teamId, trigger: 'manual', force: true, skipHours: 0 });
  console.log(roster);

  console.log('Calendar sync…');
  const calendar = await applyDemoCalendarSync({ teamId, trigger: 'manual', force: true, skipIfRecentHours: 0 });
  console.log(calendar);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
