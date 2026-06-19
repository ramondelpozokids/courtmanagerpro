import { useState, useEffect } from "react";
import { LaundryBatch } from "../domain/entities/LaundryBatch";

export function useLaundry() {
  const [batches, setBatches] = useState<LaundryBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLaundry = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/laundry");
      if (!res.ok) throw new Error("Error fetching laundry");
      const data = await res.json();
      setBatches(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaundry();
  }, []);

  const updateBatchStatus = async (batchId: string, status: "PENDING" | "WASHING" | "DRYING" | "READY") => {
    try {
      const res = await fetch("/api/laundry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId, status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setBatches((prev) =>
        prev.map((b) => (b.id === batchId ? updated : b))
      );
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const createBatch = async (batchData: any) => {
    try {
      const res = await fetch("/api/laundry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batchData),
      });
      if (!res.ok) throw new Error("Failed to create laundry batch");
      const newBatch = await res.json();
      setBatches((prev) => [...prev, newBatch]);
      return newBatch;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteBatch = async (batchId: string) => {
    try {
      const res = await fetch(`/api/laundry?batchId=${batchId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete batch");
      setBatches((prev) => prev.filter((b) => b.id !== batchId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    batches,
    loading,
    error,
    refetch: fetchLaundry,
    updateBatchStatus,
    createBatch,
    deleteBatch,
  };
}
