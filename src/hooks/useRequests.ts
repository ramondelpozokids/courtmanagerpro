'use client';

import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { CLUB_TEAM_IDS, isRealMadridTeamId, isUuid } from '@/lib/club-team-ids';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import { isMockMode, mapDemoRequests } from '@/lib/demo-data';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import type { Request, CreateRequestForm, RequestFilters } from '@/types';

/** Persistencia real: RMB + RMF (no FCB/VBC). */
export function usesRealRequests(teamId: string): boolean {
  return !isMockMode() && isRealMadridTeamId(teamId);
}

async function ensureRealMadridTeam(supabase: any, teamId: string) {
  if (teamId === CLUB_TEAM_IDS.rmf) {
    const { error } = await supabase.from('teams').upsert(
      {
        id: teamId,
        name: 'Real Madrid Fútbol',
        short_name: 'RMF',
        season: '2026-2027',
        league: 'LaLiga',
        primary_color: '#FFFFFF',
        secondary_color: '#FEBE10',
        metadata: { demoSlug: 'rmf', sport: 'football' },
      },
      { onConflict: 'id' }
    );
    if (error) throw new Error(`Equipo RMF: ${error.message}`);
  }
}

export function useRequests(teamId: string = DEFAULT_TEAM_ID, filters: RequestFilters = {}) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseClient() as any;
  const mockMode = isMockMode();
  const realMode = usesRealRequests(teamId);
  const demoActive = !realMode;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!usesRealRequests(teamId)) {
        setRequests(mapDemoRequests(teamId));
        return;
      }

      let query = supabase
        .from('requests')
        .select(`
          *,
          requester:profiles!requester_id(id, full_name, avatar_url),
          player:players(id, full_name, dorsal, photo_url, team_id),
          items:request_items(*),
          comments:request_comments(count)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.priority) query = query.eq('priority', filters.priority);
      if (filters.player_id) query = query.eq('player_id', filters.player_id);
      if (filters.search) query = query.ilike('title', `%${filters.search}%`);

      const { data, error: qErr } = await query;
      if (qErr) {
        setError(qErr.message);
        setRequests([]);
      } else {
        // Evitar contaminación cruzada (p. ej. jugador RMB en team_id ATM)
        const rows = ((data || []) as any[]).filter((r) => {
          if (!r.player_id) return true;
          if (!r.player) return false;
          return r.player.team_id === teamId;
        });
        setRequests(rows as unknown as Request[]);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar solicitudes');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [teamId, JSON.stringify(filters), mockMode, supabase]);

  useEffect(() => {
    void fetchRequests();
    const onClubChange = () => void fetchRequests();
    window.addEventListener('club-demo-changed', onClubChange);
    return () => window.removeEventListener('club-demo-changed', onClubChange);
  }, [fetchRequests]);

  const createRequest = useCallback(
    async (form: CreateRequestForm, userId: string): Promise<any> => {
      if (!isUuid(userId)) {
        throw new Error('Debes iniciar sesión con un usuario real (UUID) para guardar en Supabase.');
      }

      if (!usesRealRequests(teamId)) {
        const p = db.players.find((pl) => pl.id === form.player_id) || db.players[0];
        const newReq = {
          id: 'r_' + Math.random().toString(36).substr(2, 9),
          playerId: form.player_id || 'p1',
          playerName: p ? `${p.firstName} ${p.lastName}` : 'Jugador',
          itemId: 'i1',
          itemName: form.title,
          quantity: form.quantity || 1,
          size: form.size || 'XL',
          status: 'PENDING' as const,
          requestDate: new Date().toISOString().split('T')[0],
          notes: form.description,
        };
        db.requests.unshift(newReq as any);
        db.alerts.unshift({
          id: 'a_' + Math.random().toString(36).substr(2, 9),
          team_id: teamId,
          type: 'solicitud_pendiente' as any,
          severity: 'info' as any,
          title: 'Nueva Solicitud',
          message: `Nueva solicitud para ${newReq.playerName}: ${newReq.itemName}`,
          entity_type: 'request',
          entity_id: newReq.id,
          is_read: false,
          is_dismissed: false,
          read_by: null,
          read_at: null,
          auto_generated: true,
          metadata: {},
          created_at: new Date().toISOString(),
        } as any);
        await fetchRequests();
        return newReq;
      }

      await ensureRealMadridTeam(supabase, teamId);

      const { items, ...rest } = form;
      const playerId = isUuid(form.player_id) ? form.player_id : null;
      const insertPayload = {
        title: rest.title,
        description: rest.description || null,
        priority: rest.priority || 'normal',
        category: rest.category || null,
        quantity: rest.quantity || 1,
        size: rest.size || null,
        estimated_cost: rest.estimated_cost ?? null,
        due_date: rest.due_date || null,
        team_id: teamId,
        requester_id: userId,
        player_id: playerId,
        status: 'pendiente',
      };

      const { data, error: insertErr } = await supabase
        .from('requests')
        .insert(insertPayload)
        .select()
        .single();

      if (insertErr) throw new Error(insertErr.message);

      const lineItems =
        items && items.length > 0
          ? items
          : [
              {
                item_id: null as string | null,
                item_name: form.title,
                quantity: form.quantity || 1,
                size: form.size || null,
                notes: form.description || null,
              },
            ];

      const rows = lineItems.map((i) => ({
        request_id: data.id,
        item_id: isUuid(i.item_id) ? i.item_id : null,
        item_name: i.item_name || form.title,
        quantity: i.quantity || form.quantity || 1,
        size: i.size ?? form.size ?? null,
        notes: i.notes ?? null,
      }));

      const { error: itemsError } = await supabase.from('request_items').insert(rows);
      if (itemsError) throw new Error(itemsError.message);

      const { error: alertErr } = await supabase.from('alerts').insert({
        team_id: teamId,
        type: 'solicitud_pendiente',
        severity: 'info',
        title: 'Nueva Solicitud',
        message: `Nueva solicitud: ${form.title}${form.description ? ` — ${form.description}` : ''}`,
        entity_type: 'request',
        entity_id: data.id,
        is_read: false,
        is_dismissed: false,
        auto_generated: true,
        metadata: {
          player_id: form.player_id || null,
          quantity: form.quantity || 1,
          size: form.size || null,
        },
      });
      if (alertErr) {
        console.warn('[requests] alerta no creada:', alertErr.message);
      }

      await fetchRequests();
      return data;
    },
    [teamId, fetchRequests, supabase]
  );

  const updateStatus = useCallback(
    async (
      id: string,
      status: Request['status'],
      extra?: { rejection_reason?: string; approved_by?: string; completed_by?: string }
    ): Promise<void> => {
      if (!usesRealRequests(teamId)) {
        const idx = db.requests.findIndex((r) => r.id === id);
        if (idx !== -1) {
          const mappedState =
            status === 'aprobada' ? 'APPROVED' : status === 'completada' ? 'DELIVERED' : 'REJECTED';
          db.requests[idx].status = mappedState as any;
          if (mappedState === 'DELIVERED') {
            const itemIdx = db.inventory.findIndex((i) => i.id === db.requests[idx].itemId);
            if (itemIdx !== -1) {
              db.inventory[itemIdx].stock = Math.max(
                0,
                db.inventory[itemIdx].stock - db.requests[idx].quantity
              );
            }
          }
        }
        await fetchRequests();
        return;
      }

      const updates: Partial<Request> = { status, ...extra };
      if (status === 'aprobada') updates.approved_at = new Date().toISOString();
      if (status === 'completada') updates.completed_at = new Date().toISOString();

      const { error: upErr } = await supabase.from('requests').update(updates).eq('id', id);
      if (upErr) throw new Error(upErr.message);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    },
    [teamId, fetchRequests, supabase]
  );

  const deleteRequest = useCallback(
    async (id: string): Promise<void> => {
      if (!usesRealRequests(teamId)) {
        db.requests = db.requests.filter((r) => r.id !== id);
        await fetchRequests();
        return;
      }

      // Cascada: request_items / comments según FK ON DELETE CASCADE
      const { error: delErr } = await supabase.from('requests').delete().eq('id', id).eq('team_id', teamId);
      if (delErr) throw new Error(delErr.message);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    },
    [teamId, fetchRequests, supabase]
  );

  const addComment = useCallback(
    async (requestId: string, content: string, authorId: string, isInternal = false): Promise<void> => {
      if (!usesRealRequests(teamId)) return;

      const { error: cErr } = await supabase.from('request_comments').insert({
        request_id: requestId,
        content,
        author_id: authorId,
        is_internal: isInternal,
      });
      if (cErr) throw new Error(cErr.message);
    },
    [teamId, supabase]
  );

  return {
    requests,
    loading,
    error,
    realMode,
    demoActive,
    createRequest,
    updateStatus,
    deleteRequest,
    addComment,
    refresh: fetchRequests,
  };
}
