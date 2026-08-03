import { NextResponse } from "next/server";
import { pingAllProviders, summarizePingResults, PROVIDER_META } from "@/lib/ai/providerPing";

function isPingAuthorized(req: Request): boolean {
  const secret = process.env.AI_PING_SECRET?.trim();
  if (!secret) {
    // Sin secreto configurado: solo desarrollo local (nunca Vercel).
    return process.env.NODE_ENV === "development" && !process.env.VERCEL;
  }
  // Solo cabecera — nunca ?secret= (acaba en logs de proxy/CDN).
  const header = req.headers.get("x-ai-ping-secret");
  return header === secret;
}

export async function GET(req: Request) {
  if (!isPingAuthorized(req)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const started = Date.now();
  const providers = await pingAllProviders();
  const summary = summarizePingResults(providers);

  const res = NextResponse.json({
    project: process.env.NEXT_PUBLIC_APP_URL || "courtmanager-pro",
    checkedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    roles: PROVIDER_META,
    summary,
    providers,
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
