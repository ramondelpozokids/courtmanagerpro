import { NextResponse } from "next/server";
import { db } from "@/infrastructure/supabase/repositories/InMemoryDB";

export async function GET() {
  return NextResponse.json(db.laundry);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Updating a laundry batch status
    if (body.batchId && body.status) {
      const batch = db.laundry.find((b) => b.id === body.batchId);
      if (!batch) return NextResponse.json({ error: "Batch not found" }, { status: 404 });

      batch.status = body.status;
      if (body.status === "READY") {
        (batch as any).completedDate = new Date().toISOString().split("T")[0];
      }
      return NextResponse.json(batch);
    }

    // Creating a laundry batch
    const newBatch = {
      id: "l_" + Math.random().toString(36).substr(2, 9),
      name: body.name,
      itemCount: body.itemCount || 0,
      status: "PENDING" as const,
      receivedDate: new Date().toISOString().split("T")[0],
      responsible: body.responsible || "Carlos (Utillero)"
    } as any;
    db.laundry.push(newBatch);
    return NextResponse.json(newBatch, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
