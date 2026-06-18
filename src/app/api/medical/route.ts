import { NextResponse } from "next/server";
import { db } from "@/infrastructure/supabase/repositories/InMemoryDB";

export async function GET() {
  return NextResponse.json(db.medical);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Adjusting a medical item quantity
    if (body.itemId && typeof body.quantity === "number") {
      const item = db.medical.find((m) => m.id === body.itemId) as any;
      if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

      item.quantity = Math.max(0, body.quantity);
      if (item.quantity <= item.minQuantity) {
        item.status = "EXPIRING_SOON"; // Mock status update
      } else {
        item.status = "OK";
      }
      return NextResponse.json(item);
    }

    // Creating a medical item
    const newItem = {
      id: "m_" + Math.random().toString(36).substr(2, 9),
      name: body.name,
      quantity: body.quantity || 0,
      minQuantity: body.minQuantity || 5,
      expiryDate: body.expiryDate || "2027-12-31",
      batchNumber: body.batchNumber || `B-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "OK" as const,
      location: body.location || "Armario Médico"
    } as any;
    db.medical.push(newItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
