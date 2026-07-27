import { useState, useEffect, useCallback } from 'react';
import type { MedicalItem } from '@/domain/entities/MedicalItem';
import { useActiveTeamId } from '@/contexts/ClubDemoContext';
import { usesDemoClubData } from '@/lib/club-preview';
import { isMockMode } from '@/lib/demo-data';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';

type MedicalUi = MedicalItem & {
  kit?: string;
  brand?: string;
  category?: string;
  prescription_required?: boolean;
};

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
        setItems([...(db.medical || [])] as MedicalUi[]);
        return;
      }

      const res = await fetch(`/api/medical?team_id=${encodeURIComponent(teamId)}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error fetching medical stock');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
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
