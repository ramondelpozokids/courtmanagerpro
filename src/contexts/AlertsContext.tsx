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
import { countUnreadAlerts, isPastCalendarAlert } from '@/lib/alerts-state';
import { mapPackTripsForTeam } from '@/lib/club-trips';
import { useActiveTeamId, useClubBranding } from '@/contexts/ClubDemoContext';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import type { Alert } from '@/types';

export type AlertsContextValue = {
  teamId: string;
  alerts: Alert[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (alertId: string) => Promise<void>;
  dismissAlert: (alertId: string) => Promise<void>;
  dismissMany: (alertIds: string[]) => Promise<void>;
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
function isForeignSportCalendarAlert(message: string, sport: string): boolean {
  const text = message.toLowerCase();
  if (sport === 'football') {
    return /unicaja|la laguna|tenerife|gran canaria|baskonia|joventut|endesa|euroliga|acb\b|bàsquet|basquet|baloncesto|obradoiro|manresa|breog|bilbao basket/.test(
      text
    );
  }
  return false;
}

export function AlertsProvider({ children }: { children: ReactNode }) {
  const teamId = useActiveTeamId() || DEFAULT_TEAM_ID;
  const branding = useClubBranding();
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
          .filter((a: any) => !a.team_id || a.team_id === teamId)
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
          )
          .filter((a: Alert) => !isForeignSportCalendarAlert(`${a.title} ${a.message}`, branding.sport));
        const past = mapped.filter((a) => isPastCalendarAlert(a));
        if (past.length) {
          const ids = new Set(past.map((a) => a.id));
          db.alerts = db.alerts.map((a: any) =>
            ids.has(a.id) ? { ...a, is_dismissed: true, is_read: true } : a
          );
        }
        const kept = mapped.filter((a) => !isPastCalendarAlert(a));
        if (!kept.some((a) => a.type === 'viaje_proximo')) {
          const extras = mapPackTripsForTeam(teamId).slice(0, 8).map((t, i) => ({
            id: `viaje-pack-${t.departureDate}-${i}`,
            team_id: teamId,
            type: 'viaje_proximo' as const,
            severity: 'info' as const,
            title: 'Partido próximo',
            message: `${t.departureDate} · ${t.opponent} · ${t.destination}`,
            entity_type: 'official_match',
            entity_id: null,
            is_read: false,
            is_dismissed: false,
            read_by: null,
            read_at: null,
            auto_generated: true,
            metadata: { match_date: t.departureDate, rival: t.opponent, source: 'upcoming_fixture' },
            created_at: new Date().toISOString(),
          }));
          setAlerts([...extras, ...kept] as Alert[]);
          return;
        }
        setAlerts(kept);
        return;
      }

      const res = await fetch(`/api/alerts?team_id=${encodeURIComponent(teamId)}`, {
        credentials: 'include',
        cache: 'no-store',
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error((payload && payload.error) || `HTTP ${res.status}`);
      }
      const incoming = (Array.isArray(payload) ? payload : []) as Alert[];
      setAlerts(incoming.filter((a) => !isPastCalendarAlert(a)));
    } catch (err) {
      console.error('[AlertsProvider] load failed:', err);
    } finally {
      setLoading(false);
    }
  }, [teamId, mock, supabase, branding.sport]);

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

  const dismissMany = useCallback(
    async (alertIds: string[]) => {
      const ids = [...new Set(alertIds.filter(Boolean))];
      if (!ids.length) return;
      if (mock) {
        db.alerts = db.alerts.filter((a) => !ids.includes(a.id));
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
        .in('id', ids);
      if (error) throw new Error(error.message);
      await fetchAlerts();
    },
    [mock, fetchAlerts, supabase, teamId]
  );

  const dismissAll = useCallback(async () => {
    if (mock) {
      db.alerts = db.alerts.filter(
        (a: any) => a.team_id && a.team_id !== teamId
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
      dismissMany,
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
      dismissMany,
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
