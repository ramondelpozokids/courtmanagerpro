import { useState, useEffect, useCallback } from "react";
import { Trip } from "../domain/entities/Trip";
import { db } from "@/infrastructure/supabase/repositories/InMemoryDB";
import { usesDemoClubData } from "@/lib/club-preview";
import { isMockMode } from "@/lib/demo-data";
import { useActiveTeamId } from "@/contexts/ClubDemoContext";

function mapDbTrips(): Trip[] {
  return (db.trips || []).map((t: any) => ({
    ...t,
    packingList: (t.packingList || []).map((pi: any) => ({ ...pi })),
  })) as Trip[];
}

export function useTrips() {
  const teamId = useActiveTeamId();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Demo / preview de club: leer InMemoryDB del cliente (ya cargado al cambiar de club).
      // La API /api/trips vive en el servidor y no ve el club activo del navegador.
      if (isMockMode() || usesDemoClubData()) {
        setTrips(mapDbTrips());
        return;
      }

      const res = await fetch(`/api/trips?team_id=${encodeURIComponent(teamId)}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error fetching trips");
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      if (isMockMode() || usesDemoClubData()) {
        setTrips(mapDbTrips());
      }
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    void fetchTrips();
    const onClubChange = () => {
      void fetchTrips();
    };
    window.addEventListener("club-demo-changed", onClubChange);
    return () => window.removeEventListener("club-demo-changed", onClubChange);
  }, [fetchTrips]);

  const packItem = async (tripId: string, itemId: string, isPacked: boolean) => {
    try {
      if (isMockMode() || usesDemoClubData()) {
        const trip = db.trips.find((t: any) => t.id === tripId) as any;
        if (!trip) throw new Error("Trip not found");
        const pack = trip.packingList?.find((pi: any) => pi.id === itemId);
        if (pack) {
          pack.isPacked = isPacked;
          pack.quantityPacked = isPacked ? pack.quantityRequired : 0;
        }
        const allPacked = trip.packingList?.every((pi: any) => pi.isPacked);
        trip.status = allPacked ? "READY" : "PLANNING";
        const updated = { ...trip, packingList: [...(trip.packingList || [])] };
        setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
        return updated;
      }

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tripId, itemId, isPacked, team_id: teamId }),
      });
      if (!res.ok) throw new Error("Failed to pack item");
      const updatedTrip = await res.json();
      setTrips((prev) => prev.map((t) => (t.id === tripId ? updatedTrip : t)));
      return updatedTrip;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const addPackingItem = async (
    tripId: string,
    item: { itemName: string; category?: string; quantityRequired?: number }
  ) => {
    try {
      if (isMockMode() || usesDemoClubData()) {
        const trip = db.trips.find((t: any) => t.id === tripId) as any;
        if (!trip) throw new Error("Trip not found");
        const newItem = {
          id: "pi_" + Math.random().toString(36).slice(2, 9),
          itemName: item.itemName,
          category: item.category || "General",
          quantityRequired: item.quantityRequired || 1,
          quantityPacked: 0,
          isPacked: false,
        };
        trip.packingList = [...(trip.packingList || []), newItem];
        trip.status = "PLANNING";
        const updated = { ...trip, packingList: [...trip.packingList] };
        setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
        return updated;
      }

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tripId, action: "addItem", ...item, team_id: teamId }),
      });
      if (!res.ok) throw new Error("Failed to add item");
      const updatedTrip = await res.json();
      setTrips((prev) => prev.map((t) => (t.id === tripId ? updatedTrip : t)));
      return updatedTrip;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removePackingItem = async (tripId: string, itemId: string) => {
    try {
      if (isMockMode() || usesDemoClubData()) {
        const trip = db.trips.find((t: any) => t.id === tripId) as any;
        if (!trip) throw new Error("Trip not found");
        trip.packingList = (trip.packingList || []).filter((pi: any) => pi.id !== itemId);
        const allPacked =
          trip.packingList.length > 0 && trip.packingList.every((pi: any) => pi.isPacked);
        trip.status = allPacked ? "READY" : "PLANNING";
        const updated = { ...trip, packingList: [...trip.packingList] };
        setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
        return updated;
      }

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tripId, action: "removeItem", itemId, team_id: teamId }),
      });
      if (!res.ok) throw new Error("Failed to remove item");
      const updatedTrip = await res.json();
      setTrips((prev) => prev.map((t) => (t.id === tripId ? updatedTrip : t)));
      return updatedTrip;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const createTrip = async (tripData: any) => {
    try {
      if (isMockMode() || usesDemoClubData()) {
        const newTrip = {
          id: "t_" + Math.random().toString(36).slice(2, 9),
          destination: tripData.destination,
          opponent: tripData.opponent,
          departureDate: tripData.departureDate,
          returnDate: tripData.returnDate,
          status: "PLANNING" as const,
          packingList: tripData.packingList || [],
          notes: tripData.notes,
        };
        db.trips.push(newTrip);
        setTrips((prev) => [...prev, newTrip as Trip]);
        return newTrip;
      }

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...tripData, team_id: teamId }),
      });
      if (!res.ok) throw new Error("Failed to create trip");
      const newTrip = await res.json();
      setTrips((prev) => [...prev, newTrip]);
      return newTrip;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    trips,
    loading,
    error,
    refetch: fetchTrips,
    packItem,
    addPackingItem,
    removePackingItem,
    createTrip,
  };
}
