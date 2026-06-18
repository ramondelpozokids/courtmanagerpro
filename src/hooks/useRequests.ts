'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import { isMockMode, mapDemoRequests, shouldUseDemoFallback } from '@/lib/demo-data';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import type { Request, CreateRequestForm, RequestFilters } from '@/types';

export function useRequests(teamId: string = 'team-acb-123', filters: RequestFilters = {}) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseClient() as any;
  const mockMode = isMockMode();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (mockMode) {
        setRequests(mapDemoRequests(teamId));
        return;
      }

      let query = supabase
        .from('requests')
        .select(`
          *,
          requester:profiles!requester_id(id, full_name, avatar_url),
          player:players(id, full_name, dorsal, photo_url),
          items:request_items(*),
          comments:request_comments(count)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.priority) query = query.eq('priority', filters.priority);
      if (filters.player_id) query = query.eq('player_id', filters.player_id);
      if (filters.search) query = query.ilike('title', `%${filters.search}%`);

      const { data, error } = await query;
      if (error) {
        setError(error.message);
        setRequests(mapDemoRequests(teamId));
      } else if (shouldUseDemoFallback(data)) {
        setRequests(mapDemoRequests(teamId));
      } else {
        setRequests((data || []) as unknown as Request[]);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar solicitudes');
      setRequests(mapDemoRequests(teamId));
    } finally {
      setLoading(false);
    }
  }, [teamId, JSON.stringify(filters), mockMode, supabase]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const createRequest = useCallback(async (form: CreateRequestForm, userId: string): Promise<any> => {
    if (mockMode) {
      const p = db.players.find(pl => pl.id === form.player_id) || db.players[0];
      const newReq = {
        id: "r_" + Math.random().toString(36).substr(2, 9),
        playerId: form.player_id || "p1",
        playerName: p ? `${p.firstName} ${p.lastName}` : "Jugador",
        itemId: "i1",
        itemName: form.title,
        quantity: form.quantity || 1,
        size: form.size || "XL",
        status: "PENDING" as const,
        requestDate: new Date().toISOString().split("T")[0],
        notes: form.description
      };
      db.requests.unshift(newReq as any);
      
      // Inject alert
      db.alerts.unshift({
        id: "a_" + Math.random().toString(36).substr(2, 9),
        team_id: teamId,
        type: "solicitud_pendiente" as any,
        severity: "info" as any,
        title: "Nueva Solicitud",
        message: `Nueva solicitud para ${newReq.playerName}: ${newReq.itemName}`,
        entity_type: "request",
        entity_id: newReq.id,
        is_read: false,
        is_dismissed: false,
        read_by: null,
        read_at: null,
        auto_generated: true,
        metadata: {},
        created_at: new Date().toISOString()
      } as any);

      await fetchRequests();
      return newReq;
    }

    const { items, ...requestData } = form;
    const { data, error } = await supabase
      .from('requests')
      .insert({ ...requestData, team_id: teamId, requester_id: userId })
      .select()
      .single();

    if (error) throw new Error(error.message);

    if (items && items.length > 0) {
      const { error: itemsError } = await supabase
        .from('request_items')
        .insert(items.map(i => ({ ...i, request_id: data.id })));
      if (itemsError) throw new Error(itemsError.message);
    }

    await fetchRequests();
    return data;
  }, [teamId, fetchRequests, mockMode]);

  const updateStatus = useCallback(async (
    id: string,
    status: Request['status'],
    extra?: { rejection_reason?: string; approved_by?: string; completed_by?: string }
  ): Promise<void> => {
    if (mockMode) {
      const idx = db.requests.findIndex(r => r.id === id);
      if (idx !== -1) {
        // map state
        const mappedState = status === 'aprobada' ? 'APPROVED' : status === 'completada' ? 'DELIVERED' : 'REJECTED';
        db.requests[idx].status = mappedState as any;
        
        // Dedup stock if delivered
        if (mappedState === 'DELIVERED') {
          const itemIdx = db.inventory.findIndex(i => i.id === db.requests[idx].itemId);
          if (itemIdx !== -1) {
            db.inventory[itemIdx].stock = Math.max(0, db.inventory[itemIdx].stock - db.requests[idx].quantity);
          }
        }
      }
      await fetchRequests();
      return;
    }

    const updates: Partial<Request> = { status, ...extra };
    if (status === 'aprobada') updates.approved_at = new Date().toISOString();
    if (status === 'completada') updates.completed_at = new Date().toISOString();

    const { error } = await supabase
      .from('requests')
      .update(updates)
      .eq('id', id);

    if (error) throw new Error(error.message);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, [mockMode, fetchRequests]);

  const addComment = useCallback(async (
    requestId: string,
    content: string,
    authorId: string,
    isInternal = false
  ): Promise<void> => {
    if (mockMode) return;

    const { error } = await supabase
      .from('request_comments')
      .insert({ request_id: requestId, content, author_id: authorId, is_internal: isInternal });

    if (error) throw new Error(error.message);
  }, [mockMode]);

  return {
    requests,
    loading,
    error,
    createRequest,
    updateStatus,
    addComment,
    refresh: fetchRequests,
  };
}
