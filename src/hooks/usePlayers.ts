'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { isMockMode, mapDemoPlayers, shouldUseDemoFallback } from '@/lib/demo-data';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import type { Player, CreatePlayerForm, ItemAssignment, AssignItemForm } from '@/types';

export function usePlayers(teamId: string = DEFAULT_TEAM_ID) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [usingDemoData, setUsingDemoData] = useState(false);
  const supabase = getSupabaseClient() as any;
  const mockMode = isMockMode();
  const demoActive = mockMode || usingDemoData;

  const fetchPlayers = useCallback(async () => {
    if (!teamId) return;
    setLoading(true);
    setError(null);

    try {
      if (mockMode) {
        setUsingDemoData(true);
        setPlayers(mapDemoPlayers(teamId));
        return;
      }

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId)
        .eq('is_active', true)
        .order('dorsal');

      if (error) {
        setError(error.message);
        setUsingDemoData(true);
        setPlayers(mapDemoPlayers(teamId));
      } else if (shouldUseDemoFallback(data)) {
        setUsingDemoData(true);
        setPlayers(mapDemoPlayers(teamId));
      } else {
        setUsingDemoData(false);
        setPlayers(data as Player[]);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar jugadores');
      setUsingDemoData(true);
      setPlayers(mapDemoPlayers(teamId));
    } finally {
      setLoading(false);
    }
  }, [teamId, mockMode, supabase]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const getPlayerInventory = useCallback(async (playerId: string): Promise<ItemAssignment[]> => {
    if (demoActive) {
      // Simple static mock assignments
      return [];
    }

    const { data, error } = await supabase
      .from('item_assignments')
      .select('*, item:inventory_items(*)')
      .eq('player_id', playerId)
      .eq('is_returned', false)
      .order('assigned_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as ItemAssignment[];
  }, [demoActive, supabase]);

  const assignItem = useCallback(async (form: AssignItemForm): Promise<ItemAssignment> => {
    if (demoActive) {
      const mockAs: ItemAssignment = {
        id: "as_" + Math.random().toString(36).substr(2, 9),
        item_id: form.item_id,
        player_id: form.player_id,
        assigned_by: "u1",
        quantity: form.quantity,
        assigned_at: new Date().toISOString(),
        returned_at: null,
        expected_return: form.expected_return || null,
        condition_out: form.condition_out || 'nuevo',
        condition_in: null,
        notes: form.notes || null,
        is_returned: false,
        created_at: new Date().toISOString(),
      };
      return mockAs;
    }

    const { data, error } = await supabase
      .from('item_assignments')
      .insert(form)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as ItemAssignment;
  }, [demoActive, supabase]);

  const returnItem = useCallback(async (assignmentId: string, conditionIn: string): Promise<void> => {
    if (demoActive) return;

    const { error } = await supabase
      .from('item_assignments')
      .update({
        is_returned: true,
        returned_at: new Date().toISOString(),
        condition_in: conditionIn as any,
      })
      .eq('id', assignmentId);

    if (error) throw new Error(error.message);
  }, [demoActive, supabase]);

  const createPlayer = useCallback(async (form: CreatePlayerForm): Promise<Player> => {
    if (demoActive) {
      const newP = {
        id: "p_" + Math.random().toString(36).substr(2, 9),
        firstName: form.full_name.split(" ")[0] || "Nuevo",
        lastName: form.full_name.split(" ").slice(1).join(" ") || "Jugador",
        number: form.dorsal,
        position: (form.position.toUpperCase() === "BASE" ? "PG" : "SF") as any,
        status: "ACTIVE" as const,
        sizes: {
          jersey: form.shirt_size || "XL",
          shorts: form.shorts_size || "XL",
          shoes: String(form.shoe_size || 47),
          socks: "L",
          warmupShirt: form.jacket_size || "XXL"
        },
        nationality: form.nationality || "España",
        birthDate: form.birth_date || "1998-05-10"
      };
      db.players.push(newP);
      await fetchPlayers();
      return players.find(p => p.id === newP.id) as Player || {} as Player;
    }

    const { data, error } = await supabase
      .from('players')
      .insert({ ...form, team_id: teamId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    setPlayers(prev => [...prev, data as Player].sort((a, b) => a.dorsal - b.dorsal));
    return data as Player;
  }, [teamId, demoActive, fetchPlayers, players, supabase]);

  const updatePlayer = useCallback(async (id: string, updates: Partial<Player>): Promise<Player> => {
    if (demoActive) {
      const idx = db.players.findIndex(p => p.id === id);
      if (idx !== -1) {
        db.players[idx] = { ...db.players[idx], ...updates as any };
        await fetchPlayers();
      }
      return players.find(p => p.id === id) as Player;
    }

    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    setPlayers(prev => prev.map(p => p.id === id ? data as Player : p));
    return data as Player;
  }, [demoActive, fetchPlayers, players, supabase]);

  return {
    players,
    loading,
    error,
    createPlayer,
    updatePlayer,
    getPlayerInventory,
    assignItem,
    returnItem,
    refresh: fetchPlayers,
  };
}
