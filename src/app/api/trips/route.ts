import { NextResponse } from "next/server";
import { db } from "@/infrastructure/supabase/repositories/InMemoryDB";

export async function GET() {
  return NextResponse.json(db.trips);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Adding a packing item
    if (body.tripId && body.action === 'addItem') {
      const trip = db.trips.find((t) => t.id === body.tripId) as any;
      if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

      const newItem = {
        id: "pi_" + Math.random().toString(36).substr(2, 9),
        itemName: body.itemName,
        category: body.category || "General",
        quantityRequired: body.quantityRequired || 1,
        quantityPacked: 0,
        isPacked: false,
      };
      trip.packingList.push(newItem);
      trip.status = "PLANNING";
      return NextResponse.json(trip);
    }

    // Removing a packing item
    if (body.tripId && body.action === 'removeItem' && body.itemId) {
      const trip = db.trips.find((t) => t.id === body.tripId) as any;
      if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

      trip.packingList = trip.packingList.filter((pi: any) => pi.id !== body.itemId);
      const allPacked = trip.packingList.length > 0 && trip.packingList.every((pi: any) => pi.isPacked);
      trip.status = allPacked ? "READY" : "PLANNING";
      return NextResponse.json(trip);
    }

    // Packing item action
    if (body.tripId && body.itemId && typeof body.isPacked !== "undefined") {
      const trip = db.trips.find((t) => t.id === body.tripId) as any;
      if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

      const packItem = trip.packingList.find((pi: any) => pi.id === body.itemId);
      if (packItem) {
        packItem.isPacked = body.isPacked;
        packItem.quantityPacked = body.isPacked ? packItem.quantityRequired : 0;
      }

      // Check if all items in trip are packed
      const allPacked = trip.packingList.every((pi: any) => pi.isPacked);
      if (allPacked) {
        trip.status = "READY";
      } else {
        trip.status = "PLANNING";
      }

      return NextResponse.json(trip);
    }

    // Creating a trip
    const newTrip = {
      id: "t_" + Math.random().toString(36).substr(2, 9),
      destination: body.destination,
      opponent: body.opponent,
      departureDate: body.departureDate,
      returnDate: body.returnDate,
      status: "PLANNING" as const,
      packingList: body.packingList || [],
      notes: body.notes
    } as any;
    db.trips.push(newTrip);
    return NextResponse.json(newTrip, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
