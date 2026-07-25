'use client';

import { TeamDashboard } from '@/modules/equipment-team';
import { useAuth } from '@/contexts/AuthContext';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';

export default function EquipmentTeamPage() {
  const { currentTeam } = useAuth();
  return <TeamDashboard teamId={currentTeam?.id || DEFAULT_TEAM_ID} />;
}
