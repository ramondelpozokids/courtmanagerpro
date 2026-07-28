import { useState, useEffect, useCallback } from "react";
import { LaundryBatch } from "../domain/entities/LaundryBatch";
import { useActiveTeamId } from "@/contexts/ClubDemoContext";
import { usesDemoClubData } from "@/lib/club-preview";
import { isMockMode } from "@/lib/demo-data";
import { db } from "@/infrastructure/supabase/repositories/InMemoryDB";

export function useLaundry() {
  const teamId = useActiveTeamId();
  const [batches, setBatches] = useState<LaundryBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLaundry = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (isMockMode() || usesDemoClubData()) {
        setBatches([...(db.laundry || [])] as LaundryBatch[]);
        return;
      }

      const res = await fetch(`/api/laundry?team_id=${encodeURIComponent(teamId)}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error fetching laundry");
      const data = await res.json();
      setBatches(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    void fetchLaundry();
    const onClubChange = () => void fetchLaundry();
    window.addEventListener("club-demo-changed", onClubChange);
    return () => window.removeEventListener("club-demo-changed", onClubChange);
  }, [fetchLaundry]);

  const updateBatchStatus = async (batchId: string, status: "PENDING" | "WASHING" | "DRYING" | "READY") => {
    try {
      if (isMockMode() || usesDemoClubData()) {
        const batch = db.laundry.find((b) => b.id === batchId) as any;
        if (!batch) throw new Error("Batch not found");
        batch.status = status;
        if (status === "READY") batch.completedDate = new Date().toISOString().split("T")[0];
        setBatches((prev) => prev.map((b) => (b.id === batchId ? { ...batch } : b)));
        return batch;
      }

      const res = await fetch("/api/laundry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ batchId, status, team_id: teamId }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setBatches((prev) => prev.map((b) => (b.id === batchId ? updated : b)));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const createBatch = async (batchData: any) => {
    try {
      if (isMockMode() || usesDemoClubData()) {
        const newBatch = {
          id: "l_" + Math.random().toString(36).substr(2, 9),
          name: batchData.name,
          itemCount: batchData.itemCount || 0,
          status: (batchData.flow === "salida" ? "READY" : "PENDING") as
            | "READY"
            | "PENDING",
          receivedDate: new Date().toISOString().split("T")[0],
          completedDate:
            batchData.flow === "salida"
              ? new Date().toISOString().split("T")[0]
              : undefined,
          responsible: batchData.responsible || "Utillero",
          kitType: batchData.kitType || undefined,
          flow: batchData.flow || undefined,
        };
        db.laundry.push(newBatch);
        setBatches((prev) => [...prev, newBatch]);
        return newBatch;
      }

      const res = await fetch("/api/laundry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...batchData, team_id: teamId }),
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
      if (isMockMode() || usesDemoClubData()) {
        const index = db.laundry.findIndex((b) => b.id === batchId);
        if (index !== -1) db.laundry.splice(index, 1);
        setBatches((prev) => prev.filter((b) => b.id !== batchId));
        return;
      }

      const res = await fetch(
        `/api/laundry?batchId=${encodeURIComponent(batchId)}&team_id=${encodeURIComponent(teamId)}`,
        { method: "DELETE", credentials: "include" }
      );
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
