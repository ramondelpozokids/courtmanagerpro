import AppShell from '@/components/layout/AppShell';
import { RosterSyncBootstrap } from '@/components/roster/RosterSyncBootstrap';
import { CalendarSyncBootstrap } from '@/components/calendar/CalendarSyncBootstrap';
import { OfficialStoreBootstrap } from '@/components/store/OfficialStoreBootstrap';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <RosterSyncBootstrap />
      <CalendarSyncBootstrap />
      <OfficialStoreBootstrap />
      {children}
    </AppShell>
  );
}
