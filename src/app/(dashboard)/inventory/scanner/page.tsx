"use client";

import { useInventory } from "@/hooks/useInventory";
import { useState } from "react";
import { QrCode, ArrowLeft, Camera, RefreshCw, CheckCircle, Package, Minus, Plus } from "lucide-react";
import Link from "next/link";

export default function QRScannerPage() {
  const { items, adjustStock } = useInventory();
  const [scannedItem, setScannedItem] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);

  const simulateScan = (sku: string) => {
    setScanning(true);
    setScannedItem(null);
    setSuccess(false);

    setTimeout(() => {
      const match = items.find((i) => i.sku === sku);
      if (match) {
        setScannedItem(match);
        setSuccess(true);
      } else {
        alert("Código no reconocido en el almacén ACB");
      }
      setScanning(false);
    }, 1200);
  };

  const handleAdjustStock = async (id: string, qty: number, action: "ADD" | "REDUCE") => {
    const updated = await adjustStock(id, qty, action);
    setScannedItem(updated);
  };

  return (
    <div className="space-y-6">
      {/* Back to Inventory */}
      <div>
        <Link href="/inventory" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al Inventario
        </Link>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* Mock Scanning Camera Viewport */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 text-white flex flex-col justify-between relative min-h-[350px]">
          {/* Scanning lines animation */}
          {scanning && (
            <div className="absolute inset-0 bg-orange-500/10 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-full h-1 bg-orange-500 animate-bounce absolute top-10" />
              <div className="w-full h-1 bg-orange-500 animate-bounce absolute bottom-10" />
            </div>
          )}

          <div>
            <h3 className="font-extrabold text-sm text-orange-400 uppercase tracking-widest flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Cámara Utilería Pro (Simulada)
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Escanea códigos QR de ropa de partido o códigos de barra de material médico.
            </p>
          </div>

          {/* Scanner Area Target */}
          <div className="my-8 flex items-center justify-center">
            <div className={`h-40 w-40 border-4 rounded-xl flex items-center justify-center transition-colors relative ${
              scanning ? "border-orange-500 pulse-active" : "border-slate-700"
            }`}>
              <QrCode className={`h-20 w-20 ${scanning ? "text-orange-500" : "text-slate-600"}`} />
              <span className="absolute -top-3 bg-slate-950 px-2 text-[9px] uppercase font-bold tracking-widest text-slate-400">
                Alinear Código
              </span>
            </div>
          </div>

          {/* Scan trigger simulator options */}
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 font-bold block text-center">SELECCIONAR ARTÍCULO PARA SIMULAR ESCANEO:</span>
            <div className="grid grid-cols-2 gap-2">
              {items.slice(0, 4).map((i) => (
                <button
                  key={i.id}
                  onClick={() => simulateScan(i.sku || "")}
                  disabled={scanning}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 transition-colors truncate"
                  title={i.name}
                >
                  {i.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scan Results Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-3">
              Resultado del Escaneo
            </h3>

            {scanning ? (
              <div className="py-20 text-center text-slate-400">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
                <p className="text-xs font-semibold">Procesando código QR...</p>
              </div>
            ) : scannedItem ? (
              <div className="mt-5 space-y-5">
                {/* Header info */}
                <div className="flex gap-4 items-start">
                  <div className="p-1 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 rounded">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${scannedItem.sku || "CMP"}`} alt="Item QR" className="h-16 w-16" />
                  </div>
                  <div>
                    <span className="text-[9px] bg-orange-100 dark:bg-orange-950/40 text-orange-600 px-2 py-0.5 rounded font-extrabold tracking-wider uppercase">
                      {scannedItem.category}
                    </span>
                    <h4 className="font-extrabold text-base text-slate-850 dark:text-slate-100 mt-1">{scannedItem.name}</h4>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">SKU: {scannedItem.sku}</p>
                  </div>
                </div>

                {/* Details list */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Talla asignada:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{scannedItem.size || "Única"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ubicación Almacén:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{scannedItem.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Precio de adquisición:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">€{scannedItem.unit_cost || scannedItem.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nivel de stock actual:</span>
                    <span className={`font-extrabold ${scannedItem.stock <= scannedItem.minStock ? "text-amber-500" : "text-emerald-500"}`}>
                      {scannedItem.stock} unidades
                    </span>
                  </div>
                </div>

                {/* Quick inventory mutations */}
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 font-bold block mb-2 uppercase tracking-wide">Acciones de Inventario Directas:</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAdjustStock(scannedItem.id, 1, "REDUCE")}
                      disabled={scannedItem.stock === 0}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 text-xs font-bold transition-all disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" />
                      Retirar 1 ud
                    </button>
                    <button
                      onClick={() => handleAdjustStock(scannedItem.id, 1, "ADD")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 text-xs font-bold transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      Añadir 1 ud
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400">
                <QrCode className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-xs font-semibold">Esperando escaneo...</p>
                <p className="text-[10px] mt-1 text-slate-400 max-w-xs mx-auto">
                  Selecciona uno de los artículos rápidos de utilería de la izquierda para simular la detección del código QR de la prenda.
                </p>
              </div>
            )}
          </div>

          {success && scannedItem && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3 flex items-center gap-2 text-xs mt-4">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-bold">¡Código reconocido!</p>
                <p className="text-[10px] text-emerald-600/90 mt-0.5">Artículo localizado con éxito en el Almacén de Competición.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
