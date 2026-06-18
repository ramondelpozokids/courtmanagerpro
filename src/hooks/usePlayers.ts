'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/infrastructure/supabase/client';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import type { Player, CreatePlayerForm, ItemAssignment, AssignItemForm } from '@/types';

export function usePlayers(teamId: string = 'team-acb-123') {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseClient() as any;
  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

  const fetchPlayers = useCallback(async () => {
    if (!teamId) return;
    setLoading(true);

    if (isMockMode) {
      // Mock mapping
      const mapped = db.players.map(p => ({
        id: p.id,
        team_id: teamId,
        user_id: p.id === 'p1' ? 'u1' : null,
        dorsal: p.number,
        full_name: `${p.firstName} ${p.lastName}`,
        position: p.position.toLowerCase() as any,
        nationality: p.nationality || "España",
        birth_date: p.birthDate || "1995-01-01",
        photo_url: p.imageUrl || null,
        is_active: p.status === 'ACTIVE',
        shirt_size: p.sizes.jersey,
        shorts_size: p.sizes.shorts,
        shoe_size: Number(p.sizes.shoes) || 46,
        jacket_size: p.sizes.warmupShirt,
        underwear_size: "XL",
        sock_size: p.sizes.socks,
        suit_size: "52",
        hat_size: "M",
        jersey_name: p.lastName.toUpperCase(),
        contract_end: "2027-06-30",
        notes: null,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      setPlayers(mapped);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', teamId)
      .eq('is_active', true)
      .order('dorsal');

    if (error) setError(error.message);
    else setPlayers(data as Player[]);
    setLoading(false);
  }, [teamId, isMockMode]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const getPlayerInventory = useCallback(async (playerId: string): Promise<ItemAssignment[]> => {
    if (isMockMode) {
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
  }, [isMockMode]);

  const assignItem = useCallback(async (form: AssignItemForm): Promise<ItemAssignment> => {
    if (isMockMode) {
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
  }, [isMockMode]);

  const returnItem = useCallback(async (assignmentId: string, conditionIn: string): Promise<void> => {
    if (isMockMode) return;

    const { error } = await supabase
      .from('item_assignments')
      .update({
        is_returned: true,
        returned_at: new Date().toISOString(),
        condition_in: conditionIn as any,
      })
      .eq('id', assignmentId);

    if (error) throw new Error(error.message);
  }, [isMockMode]);

  const createPlayer = useCallback(async (form: CreatePlayerForm): Promise<Player> => {
    if (isMockMode) {
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
  }, [teamId, fetchPlayers, isMockMode, players]);

  const updatePlayer = useCallback(async (id: string, updates: Partial<Player>): Promise<Player> => {
    if (isMockMode) {
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
  }, [isMockMode, fetchPlayers, players]);

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
