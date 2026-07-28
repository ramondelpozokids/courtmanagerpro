import { useState, useEffect, useCallback } from 'react';
import type { MedicalItem } from '@/domain/entities/MedicalItem';
import { useActiveTeamId } from '@/contexts/ClubDemoContext';
import { usesDemoClubData } from '@/lib/club-preview';
import { isMockMode } from '@/lib/demo-data';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { atmMedical, ATM_TEAM_ID } from '@/data/clubs/atm-data';

type MedicalUi = MedicalItem & {
  kit?: string;
  brand?: string;
  category?: string;
  prescription_required?: boolean;
  team_id?: string;
  contents?: { name: string; qty: number }[];
};

function packMedicalFallback(teamId: string): MedicalUi[] {
  if (teamId !== ATM_TEAM_ID) return [];
  return atmMedical.map((m) => ({
    id: m.id,
    name: m.name,
    quantity: m.quantity,
    minQuantity: m.minQuantity,
    expiryDate: m.expiryDate,
    batchNumber: m.batchNumber,
    status: m.status as MedicalItem['status'],
    location: m.location,
    kit: m.kit,
    team_id: m.team_id,
    category: m.category,
    brand: m.brand,
    reference: m.reference,
    unit_cost: m.unit_cost,
    is_active: m.is_active,
    prescription_required: (m as { prescription_required?: boolean }).prescription_required,
    contents: (m as { contents?: { name: string; qty: number }[] }).contents,
  }));
}

export function useMedical() {
  const teamId = useActiveTeamId();
  const [items, setItems] = useState<MedicalUi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedical = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (isMockMode() || usesDemoClubData()) {
        const demo = (db.medical || []) as MedicalUi[];
        const filtered = demo.filter((i) => !i.team_id || i.team_id === teamId);
        setItems(filtered.length > 0 ? filtered : packMedicalFallback(teamId));
        return;
      }

      const res = await fetch(`/api/medical?team_id=${encodeURIComponent(teamId)}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error fetching medical stock');
      const data = await res.json();
      const rows = Array.isArray(data) ? data : [];
      setItems(rows.length > 0 ? rows : packMedicalFallback(teamId));
    } catch (err: any) {
      setError(err.message);
      setItems(packMedicalFallback(teamId));
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    void fetchMedical();
    const onClub = () => void fetchMedical();
    window.addEventListener('club-demo-changed', onClub);
    return () => window.removeEventListener('club-demo-changed', onClub);
  }, [fetchMedical]);

  const adjustQty = async (itemId: string, quantity: number) => {
    try {
      const res = await fetch('/api/medical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itemId, quantity, team_id: teamId }),
      });
      if (!res.ok) throw new Error('Failed to adjust medical qty');
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const createItem = async (itemData: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/medical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...itemData, team_id: teamId }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to add medical supply');
      }
      const newItem = await res.json();
      setItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    refetch: fetchMedical,
    adjustQty,
    createItem,
  };
}
