'use client';

import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQRScanner } from '@/hooks/useQRScanner';
import { Input } from '@/components/ui/input';
import { parseScannedValue, isGarmentQrCode } from '@/lib/qr-codes';

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  onResult: (code: string, type: 'qr' | 'barcode') => void;
}

export function QRScanner({ open, onClose, onResult }: QRScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const handleResult = (raw: string) => {
    const code = parseScannedValue(raw);
    onResult(code, isGarmentQrCode(code) ? 'qr' : 'barcode');
    onClose();
  };

  const { isScanning, hasPermission, videoRef, startScanning, stopScanning } = useQRScanner({
    onScan: handleResult,
  });

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      handleResult(manualCode.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { stopScanning(); onClose(); } }}>
      <DialogContent className="sm:max-w-md text-left">
        <DialogHeader>
          <DialogTitle>Escanear código</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Visor de cámara */}
          <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Pulsa para activar la cámara</p>
                </div>
              </div>
            )}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-orange-400 w-48 h-48 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-orange-400 rounded-tl" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-orange-400 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-orange-400 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-orange-400 rounded-br" />
                </div>
              </div>
            )}
          </div>
          {hasPermission === false && (
            <p className="text-sm text-red-650 text-center font-bold">
              Sin acceso a la cámara. Usa el código manual.
            </p>
          )}
          <div className="flex gap-2">
            {!isScanning ? (
              <Button onClick={startScanning} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Activar cámara
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="outline" className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Detener
              </Button>
            )}
          </div>
          {/* Entrada manual */}
          <div className="border-t pt-4 border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">O introduce el código manualmente:</p>
            <div className="flex gap-2">
              <Input
                placeholder="CMP-RMB-I1-P1-001 o URL /scan/…"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              />
              <Button onClick={handleManualSubmit} disabled={!manualCode.trim()}>
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
