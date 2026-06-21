"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useClubBranding } from "@/contexts/ClubDemoContext";
import { useQRScanner } from "@/hooks/useQRScanner";
import { useHIDScanner } from "@/hooks/useHIDScanner";
import { resolveScan, recordGarmentWash } from "@/lib/garment-lookup";
import { parseScannedValue } from "@/lib/qr-codes";
import { ScanResultCard, ScanNotFound, ScanSuccessBanner } from "@/components/inventory/ScanResultCard";
import type { GarmentUnit } from "@/types/garment";
import { SERGIO_LLULL_AW_JACKET } from "@/lib/featured-garments";
import {
  ArrowLeft,
  Camera,
  X,
  Smartphone,
  Bluetooth,
  Keyboard,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function QRScannerPage() {
  const { currentTeam } = useAuth();
  const branding = useClubBranding();
  const [garment, setGarment] = useState<GarmentUnit | null>(null);
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [hidEnabled, setHidEnabled] = useState(false);
  const [washing, setWashing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleScan = useCallback((raw: string) => {
    const code = parseScannedValue(raw);
    const result = resolveScan(code);
    if (result?.kind === "garment" && result.garment) {
      setGarment({ ...result.garment });
      setNotFoundCode(null);
      setShowSuccess(true);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(80);
      }
    } else {
      setGarment(null);
      setNotFoundCode(code);
      setShowSuccess(false);
    }
  }, []);

  const { isScanning, hasPermission, videoRef, startScanning, stopScanning } = useQRScanner({
    onScan: handleScan,
  });

  useHIDScanner({
    enabled: hidEnabled,
    onScan: handleScan,
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) handleScan(manualCode.trim());
  };

  const handleRegisterWash = () => {
    if (!garment) return;
    setWashing(true);
    const updated = recordGarmentWash(garment.qr_code);
    if (updated) setGarment({ ...updated });
    setWashing(false);
  };

  const demoSamples =
    branding.slug === "rmb"
      ? [
          {
            label: "Sergio Llull — Chubasquero JP4057 (etiqueta real)",
            code: SERGIO_LLULL_AW_JACKET.barcode!,
            hint: "EAN 4068807308923 · escanea el QR de la etiqueta Adidas",
          },
          {
            label: "Campazzo — Camiseta #7",
            code: `CMP-${branding.slug.toUpperCase()}-I1-P1-001`,
          },
        ]
      : [
          { label: "Campazzo — Camiseta #7", code: `CMP-${branding.slug.toUpperCase()}-I1-P1-001` },
          { label: "Tavares — Camiseta #22", code: `CMP-${branding.slug.toUpperCase()}-I1-P2-001` },
        ];

  return (
    <div className="space-y-4 max-w-lg mx-auto pb-8">
      <div className="flex items-center justify-between">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Inventario
        </Link>
        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1">
          <Smartphone className="h-3.5 w-3.5" />
          Fase 1 · Móvil
        </span>
      </div>

      <div className="text-left space-y-1">
        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Escanear QR de prenda
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Usa la cámara del iPhone o Android. Sin hardware extra — la PWA abre la ficha al instante.
        </p>
      </div>

      {/* Cámara */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 bg-black aspect-[3/4] max-h-[420px]">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 text-white p-6 text-center">
            <Camera className="h-14 w-14 text-orange-400 mb-3" />
            <p className="text-sm font-bold">Cámara trasera lista</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              En iPhone 16 / Galaxy S25 apunta al QR pegado en la prenda
            </p>
            <button
              type="button"
              onClick={startScanning}
              className="mt-5 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-sm transition-colors"
            >
              Activar cámara
            </button>
          </div>
        )}
        {isScanning && (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 border-2 border-orange-400/80 rounded-2xl relative">
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-orange-400/60 animate-pulse" />
              </div>
            </div>
            <button
              type="button"
              onClick={stopScanning}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white"
              aria-label="Detener cámara"
            >
              <X className="h-5 w-5" />
            </button>
          </>
        )}
        {hasPermission === false && (
          <p className="absolute bottom-3 left-3 right-3 text-center text-[11px] text-red-300 font-semibold bg-black/60 rounded-lg py-2">
            Permiso de cámara denegado — usa código manual abajo
          </p>
        )}
      </div>

      {/* Fase 2 HID toggle */}
      <button
        type="button"
        onClick={() => setHidEnabled((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left text-xs font-bold transition-colors ${
          hidEnabled
            ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
        }`}
      >
        <span className="flex items-center gap-2">
          <Bluetooth className="h-4 w-4" />
          Fase 2 — Lector Zebra / Honeywell (HID)
        </span>
        <span>{hidEnabled ? "ON" : "OFF"}</span>
      </button>
      {hidEnabled && (
        <p className="text-[10px] text-slate-400 -mt-2 flex items-center gap-1">
          <Keyboard className="h-3 w-3" />
          Escanea con la pistola Bluetooth — no hace falta enfocar ningún campo
        </p>
      )}

      {/* Manual */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <input
          type="text"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="JP4057 · 4068807308923 · CMP-RMB-…"
          className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold"
        >
          Buscar
        </button>
      </form>

      {/* Demo rápida */}
      <div className="bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/30 rounded-xl p-4 space-y-2 text-left">
        <p className="text-[10px] font-black uppercase tracking-wider text-orange-600 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          Probar sin QR impreso — {branding.shortName}
        </p>
        {demoSamples.map((s) => (
          <button
            key={s.code}
            type="button"
            onClick={() => handleScan(s.code)}
            className="w-full flex flex-col items-start px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-semibold hover:border-orange-400 transition-colors"
          >
            <span className="flex items-center justify-between w-full">
              {s.label}
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </span>
            {"hint" in s && s.hint && (
              <span className="text-[10px] text-slate-400 font-normal mt-0.5">{s.hint}</span>
            )}
          </button>
        ))}
      </div>

      {showSuccess && garment && <ScanSuccessBanner />}

      {garment && (
        <ScanResultCard
          garment={garment}
          onRegisterWash={handleRegisterWash}
          washing={washing}
        />
      )}

      {notFoundCode && !garment && <ScanNotFound code={notFoundCode} />}

      <p className="text-[10px] text-center text-slate-400 pt-2">
        Fase 3 (roadmap): RFID + QR para grandes clubes · {currentTeam?.name}
      </p>
    </div>
  );
}
