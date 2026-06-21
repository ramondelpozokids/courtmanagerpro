"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { resolveScan } from "@/lib/garment-lookup";
import { ScanResultCard, ScanNotFound } from "@/components/inventory/ScanResultCard";
import type { GarmentUnit } from "@/types/garment";

export default function ScanDeepLinkPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const decoded = decodeURIComponent(code);
  const [garment, setGarment] = useState<GarmentUnit | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const result = resolveScan(decoded);
    if (result?.kind === "garment" && result.garment) {
      setGarment({ ...result.garment });
    }
    setReady(true);
  }, [decoded]);

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-8">
      <Link
        href="/inventory/scanner"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold"
      >
        <ArrowLeft className="h-4 w-4" />
        Abrir escáner
      </Link>

      <div className="flex items-center gap-2 text-left">
        <Camera className="h-5 w-5 text-orange-500" />
        <div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white">Ficha de prenda</h1>
          <p className="text-[10px] text-slate-400 font-mono">{decoded}</p>
        </div>
      </div>

      {!ready ? (
        <p className="text-xs text-slate-400 text-center py-12">Cargando…</p>
      ) : garment ? (
        <ScanResultCard garment={garment} />
      ) : (
        <ScanNotFound code={decoded} />
      )}
    </div>
  );
}
