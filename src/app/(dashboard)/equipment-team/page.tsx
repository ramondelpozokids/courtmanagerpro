'use client';

import { TeamDashboard } from '@/modules/equipment-team';
import { useActiveTeamId } from '@/contexts/ClubDemoContext';

export default function EquipmentTeamPage() {
  const teamId = useActiveTeamId();
  return <TeamDashboard teamId={teamId} />;
}
