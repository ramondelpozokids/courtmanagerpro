'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { scanBirthdayAlerts } from '@/lib/birthday-alerts';
import { countUnreadAlerts } from '@/lib/alerts-state';
import { useActiveTeamId } from '@/contexts/ClubDemoContext';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import type { Alert } from '@/types';

export type AlertsContextValue = {
  teamId: string;
  alerts: Alert[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (alertId: string) => Promise<void>;
  dismissAlert: (alertId: string) => Promise<void>;
  dismissAll: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AlertsContext = createContext<AlertsContextValue | null>(null);

function isMockMode() {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')
  );
}

/**
 * Una sola fuente de verdad para bandeja + badge (Sidebar/TopBar/página).
 * Evita el bug de vaciar alertas y seguir viendo 32 en el menú.
 */
export function AlertsProvider({ children }: { children: ReactNode }) {
  const teamId = useActiveTeamId() || DEFAULT_TEAM_ID;
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient() as any;
  const mock = isMockMode();
  const instanceId = useId().replace(/:/g, '');

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      if (mock) {
        scanBirthdayAlerts(teamId);
        const mapped = db.alerts
          .filter((a: any) => !a.is_dismissed)
          .filter((a: any) => !a.team_id || a.team_id === teamId || a.team_id === 'team-acb-123')
          .map(
            (a: any) =>
              ({
                id: a.id,
                team_id: teamId,
                type: a.type,
                severity: String(a.severity).toLowerCase(),
                title: a.title || 'Alerta del Sistema',
                message: a.message,
                entity_type: a.entity_type ?? null,
                entity_id: a.entity_id ?? null,
                is_read: Boolean(a.is_read),
                is_dismissed: Boolean(a.is_dismissed),
                read_by: null,
                read_at: null,
                auto_generated: true,
                metadata: a.metadata || {},
                created_at: a.created_at,
              }) as Alert
          );
        setAlerts(mapped);
        return;
      }

      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('team_id', teamId)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAlerts((data || []) as Alert[]);
    } catch (err) {
      console.error('[AlertsProvider] load failed:', err);
    } finally {
      setLoading(false);
    }
  }, [teamId, mock, supabase]);

  useEffect(() => {
    void fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    if (mock || !teamId) return;
    const channel = supabase
      .channel(`alerts-shared:${teamId}:${instanceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          void fetchAlerts();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, mock, instanceId, supabase, fetchAlerts]);

  const markAsRead = useCallback(
    async (alertId: string) => {
      if (mock) {
        const idx = db.alerts.findIndex((a) => a.id === alertId);
        if (idx !== -1) db.alerts[idx].is_read = true;
        await fetchAlerts();
        return;
      }
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', alertId)
        .eq('team_id', teamId);
      if (error) throw new Error(error.message);
      await fetchAlerts();
    },
    [mock, fetchAlerts, supabase, teamId]
  );

  const dismissAlert = useCallback(
    async (alertId: string) => {
      if (mock) {
        db.alerts = db.alerts.filter((a) => a.id !== alertId);
        await fetchAlerts();
        return;
      }
      const { error } = await supabase
        .from('alerts')
        .update({
          is_dismissed: true,
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', alertId)
        .eq('team_id', teamId);
      if (error) throw new Error(error.message);
      await fetchAlerts();
    },
    [mock, fetchAlerts, supabase, teamId]
  );

  const dismissAll = useCallback(async () => {
    if (mock) {
      db.alerts = db.alerts.filter(
        (a: any) => a.team_id && a.team_id !== teamId && a.team_id !== 'team-acb-123'
      );
      await fetchAlerts();
      return;
    }
    const { error } = await supabase
      .from('alerts')
      .update({
        is_dismissed: true,
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('team_id', teamId)
      .eq('is_dismissed', false);
    if (error) throw new Error(error.message);
    await fetchAlerts();
  }, [mock, fetchAlerts, supabase, teamId]);

  const markAllAsRead = useCallback(async () => {
    if (mock) {
      db.alerts.forEach((a) => {
        a.is_read = true;
      });
      await fetchAlerts();
      return;
    }
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('team_id', teamId)
      .eq('is_read', false)
      .eq('is_dismissed', false);
    if (error) throw new Error(error.message);
    await fetchAlerts();
  }, [mock, fetchAlerts, supabase, teamId]);

  const unreadCount = countUnreadAlerts(alerts);

  const value = useMemo<AlertsContextValue>(
    () => ({
      teamId,
      alerts,
      unreadCount,
      loading,
      markAsRead,
      dismissAlert,
      dismissAll,
      markAllAsRead,
      refresh: fetchAlerts,
    }),
    [
      teamId,
      alerts,
      unreadCount,
      loading,
      markAsRead,
      dismissAlert,
      dismissAll,
      markAllAsRead,
      fetchAlerts,
    ]
  );

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlertsContext(): AlertsContextValue {
  const ctx = useContext(AlertsContext);
  if (!ctx) {
    throw new Error('useAlerts debe usarse dentro de AlertsProvider');
  }
  return ctx;
}
