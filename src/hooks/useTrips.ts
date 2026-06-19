import { useState, useEffect } from "react";
import { Trip } from "../domain/entities/Trip";

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/trips");
      if (!res.ok) throw new Error("Error fetching trips");
      const data = await res.json();
      setTrips(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const packItem = async (tripId: string, itemId: string, isPacked: boolean) => {
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, itemId, isPacked }),
      });
      if (!res.ok) throw new Error("Failed to pack item");
      const updatedTrip = await res.json();
      setTrips((prev) =>
        prev.map((t) => (t.id === tripId ? updatedTrip : t))
      );
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
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, action: "addItem", ...item }),
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
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, action: "removeItem", itemId }),
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
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
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
