'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import type { Alert } from '@/types';

export function useAlerts(teamId: string = 'team-acb-123') {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const supabase = getSupabaseClient() as any;
  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

  const fetchAlerts = useCallback(async () => {
    setLoading(true);

    if (isMockMode) {
      const mapped = db.alerts.map(a => ({
        id: a.id,
        team_id: teamId,
        type: a.type as any,
        severity: a.severity.toLowerCase() as any,
        title: "Alerta del Sistema",
        message: a.message,
        entity_type: null,
        entity_id: null,
        is_read: a.is_read,
        is_dismissed: false,
        read_by: null,
        read_at: null,
        auto_generated: true,
        metadata: {},
        created_at: a.created_at
      }));
      setAlerts(mapped);
      setUnreadCount(mapped.filter(a => !a.is_read).length);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('alerts')
      .select('*')
      .eq('team_id', teamId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setAlerts(data as Alert[]);
      setUnreadCount(data.filter((a: Alert) => !a.is_read).length);
    }
    setLoading(false);
  }, [teamId, isMockMode]);

  // Realtime subscription (only if not mock mode)
  useEffect(() => {
    fetchAlerts();
    if (isMockMode) return;

    const channel = supabase
      .channel(`alerts:${teamId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'alerts',
        filter: `team_id=eq.${teamId}`,
      }, (payload: any) => {
        setAlerts(prev => [payload.new as Alert, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, fetchAlerts, isMockMode]);

  const markAsRead = useCallback(async (alertId: string): Promise<void> => {
    if (isMockMode) {
      const idx = db.alerts.findIndex(a => a.id === alertId);
      if (idx !== -1) {
        db.alerts[idx].is_read = true;
      }
      await fetchAlerts();
      return;
    }

    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', alertId);

    if (error) throw new Error(error.message);
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_read: true } : a));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [isMockMode, fetchAlerts]);

  const dismissAlert = useCallback(async (alertId: string): Promise<void> => {
    if (isMockMode) {
      db.alerts = db.alerts.filter(a => a.id !== alertId);
      await fetchAlerts();
      return;
    }

    const { error } = await supabase
      .from('alerts')
      .update({ is_dismissed: true })
      .eq('id', alertId);

    if (error) throw new Error(error.message);
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  }, [isMockMode, fetchAlerts]);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    if (isMockMode) {
      db.alerts.forEach(a => a.is_read = true);
      await fetchAlerts();
      return;
    }

    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('team_id', teamId)
      .eq('is_read', false);

    if (error) throw new Error(error.message);
    setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
    setUnreadCount(0);
  }, [teamId, isMockMode, fetchAlerts]);

  return {
    alerts,
    unreadCount,
    loading,
    markAsRead,
    dismissAlert,
    markAllAsRead,
    refresh: fetchAlerts
  };
}
