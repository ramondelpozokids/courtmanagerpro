import { useState, useEffect } from "react";
import { MedicalItem } from "../domain/entities/MedicalItem";

export function useMedical() {
  const [items, setItems] = useState<MedicalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedical = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/medical");
      if (!res.ok) throw new Error("Error fetching medical stock");
      const data = await res.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedical();
  }, []);

  const adjustQty = async (itemId: string, quantity: number) => {
    try {
      const res = await fetch("/api/medical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });
      if (!res.ok) throw new Error("Failed to adjust medical qty");
      const updated = await res.json();
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? updated : i))
      );
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const createItem = async (itemData: any) => {
    try {
      const res = await fetch("/api/medical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
      if (!res.ok) throw new Error("Failed to add medical supply");
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
