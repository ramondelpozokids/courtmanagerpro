'use client';

import Link from 'next/link';
import {
  User,
  Shirt,
  Droplets,
  MapPin,
  Package,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import type { GarmentUnit } from '@/types/garment';
import { GARMENT_STATUS_COLORS, GARMENT_STATUS_LABELS } from '@/types/garment';
import { buildGarmentScanUrl } from '@/lib/qr-codes';
import { BarcodeGenerator } from '@/components/inventory/BarcodeGenerator';

interface ScanResultCardProps {
  garment: GarmentUnit;
  compact?: boolean;
  onRegisterWash?: () => void;
  washing?: boolean;
}

export function ScanResultCard({ garment, compact, onRegisterWash, washing }: ScanResultCardProps) {
  const statusClass = GARMENT_STATUS_COLORS[garment.status];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg text-left">
      {garment.image_url && !compact && (
        <div className="h-36 bg-slate-100 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
          <img src={garment.image_url} alt="" className="w-full h-full object-cover object-top" />
        </div>
      )}

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
              QR escaneado
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 leading-tight">
              {garment.display_name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{garment.qr_code}</p>
          </div>
          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border shrink-0 ${statusClass}`}>
            {GARMENT_STATUS_LABELS[garment.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {garment.player_name && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase mb-1">
                <User className="h-3.5 w-3.5" />
                Jugador
              </div>
              <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                {garment.player_name}
                {garment.player_number != null && (
                  <span className="text-orange-500 ml-1">#{garment.player_number}</span>
                )}
              </p>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase mb-1">
              <Shirt className="h-3.5 w-3.5" />
              Talla
            </div>
            <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{garment.size}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase mb-1">
              <Droplets className="h-3.5 w-3.5" />
              Lavados
            </div>
            <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{garment.wash_count}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase mb-1">
              <MapPin className="h-3.5 w-3.5" />
              Ubicación
            </div>
            <p className="font-bold text-xs text-slate-700 dark:text-slate-200 leading-snug">{garment.location}</p>
          </div>
        </div>

        <div className="text-xs space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Artículo catálogo</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200 text-right max-w-[60%] truncate">
              {garment.item_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Estado prenda</span>
            <span className="font-semibold capitalize">{garment.condition}</span>
          </div>
          {garment.last_wash_date && (
            <div className="flex justify-between">
              <span className="text-slate-400">Último lavado</span>
              <span className="font-semibold">{garment.last_wash_date}</span>
            </div>
          )}
          {garment.product_ref && (
            <div className="flex justify-between">
              <span className="text-slate-400">Ref. Adidas</span>
              <span className="font-mono font-semibold">{garment.product_ref}</span>
            </div>
          )}
          {garment.barcode && (
            <div className="flex justify-between">
              <span className="text-slate-400">EAN / Código barras</span>
              <span className="font-mono font-semibold text-[10px]">{garment.barcode}</span>
            </div>
          )}
          {garment.rfid_tag && (
            <div className="flex justify-between">
              <span className="text-slate-400">RFID etiqueta</span>
              <span className="font-semibold">{garment.rfid_tag}</span>
            </div>
          )}
        </div>

        {!compact && (
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            {onRegisterWash && (
              <button
                type="button"
                onClick={onRegisterWash}
                disabled={washing}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
              >
                {washing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Droplets className="h-4 w-4" />}
                Registrar lavado
              </button>
            )}
            <Link
              href={`/inventory?search=${encodeURIComponent(garment.item_id)}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Package className="h-4 w-4" />
              Ver en inventario
            </Link>
          </div>
        )}

        {!compact && (
          <details className="text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <summary className="font-bold text-slate-500 cursor-pointer">QR de esta prenda (imprimir / pegatinas)</summary>
            <div className="mt-3 flex justify-center">
              <BarcodeGenerator
                value={buildGarmentScanUrl(garment.qr_code)}
                type="qr"
                label={garment.display_name}
                width={160}
              />
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

export function ScanNotFound({ code }: { code?: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 text-center space-y-3">
      <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
      <h3 className="font-extrabold text-slate-800 dark:text-slate-100">Código no reconocido</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        {code
          ? `No hay ninguna prenda registrada con el código «${code}».`
          : 'Apunta la cámara al QR generado por CourtManager Pro.'}
      </p>
      <Link
        href="/inventory/scanner"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Volver al escáner
      </Link>
    </div>
  );
}

export function ScanSuccessBanner() {
  return (
    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl p-3 flex items-center gap-2 text-xs">
      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
      <p className="font-bold text-emerald-800 dark:text-emerald-200">
        Prenda localizada — ficha lista para utilería
      </p>
    </div>
  );
}
