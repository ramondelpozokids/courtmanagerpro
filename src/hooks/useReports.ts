'use client';

import { useState, useCallback } from 'react';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import type { DashboardStats } from '@/types';

export function useReports(teamId: string = DEFAULT_TEAM_ID) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = getSupabaseClient() as any;
  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);

    if (isMockMode) {
      setStats({
        total_players: db.players.length,
        total_items: db.inventory.reduce((acc, i) => acc + (i.stock_available || 0), 0),
        low_stock_items: db.inventory.filter(i => i.stock_available <= i.stock_min).length,
        pending_requests: db.requests.filter(r => r.status === "PENDING" || r.status === "pendiente").length,
        active_assignments: 4,
        upcoming_trips: db.trips.length,
        laundry_pending: db.laundry.filter(l => (l.status as any) !== "READY" && l.status !== "limpio").length,
        critical_alerts: db.alerts.filter(a => a.severity === "critical" && !a.is_read).length,
        expiring_medical: db.medical.filter(m => (m as any).status === "EXPIRING_SOON").length
      });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .rpc('get_dashboard_stats', { p_team_id: teamId });

    if (!error && data) setStats(data as DashboardStats);
    setLoading(false);
  }, [teamId, isMockMode]);

  const getInventoryReport = useCallback(async () => {
    if (isMockMode) {
      return db.inventory.map(i => ({
        category: i.category,
        condition: 'nuevo',
        stock_total: i.stock_total,
        stock_available: i.stock_available,
        stock_assigned: 0,
        unit_cost: i.unit_cost
      }));
    }

    const { data } = await supabase
      .from('inventory_items')
      .select('category, condition, stock_total, stock_available, stock_assigned, unit_cost')
      .eq('team_id', teamId)
      .eq('is_active', true);

    return data || [];
  }, [teamId, isMockMode]);

  const getRequestsReport = useCallback(async (dateFrom: string, dateTo: string) => {
    if (isMockMode) {
      return db.requests.map(r => ({
        status: r.status,
        priority: 'normal',
        category: 'camiseta_juego',
        created_at: r.created_at || new Date().toISOString(),
        actual_cost: 85
      }));
    }

    const { data } = await supabase
      .from('requests')
      .select('status, priority, category, created_at, actual_cost')
      .eq('team_id', teamId)
      .gte('created_at', dateFrom)
      .lte('created_at', dateTo);

    return data || [];
  }, [teamId, isMockMode]);

  const getAssignmentsReport = useCallback(async () => {
    if (isMockMode) return [];

    const { data } = await supabase
      .from('item_assignments')
      .select(`
        quantity,
        assigned_at,
        is_returned,
        item:inventory_items(name, category),
        player:players(full_name, dorsal, position)
      `)
      .eq('is_returned', false);

    return data || [];
  }, [isMockMode]);

  return {
    stats,
    loading,
    fetchDashboardStats,
    getInventoryReport,
    getRequestsReport,
    getAssignmentsReport,
  };
}
