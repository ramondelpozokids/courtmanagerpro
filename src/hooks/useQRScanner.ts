'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface QRScannerOptions {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
}

export function useQRScanner({ onScan, onError }: QRScannerOptions) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanning = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setHasPermission(true);
      setIsScanning(true);

      // Usar BarcodeDetector API si está disponible
      if ('BarcodeDetector' in window) {
        const detector = new (window as any).BarcodeDetector({
          formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'data_matrix'],
        });

        const scan = async () => {
          if (!isScanning || !videoRef.current) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              onScan(barcodes[0].rawValue);
              stopScanning();
              return;
            }
          } catch {}
          requestAnimationFrame(scan);
        };
        requestAnimationFrame(scan);
      }
    } catch (err) {
      setHasPermission(false);
      onError?.(err instanceof Error ? err : new Error('Camera access denied'));
    }
  }, [isScanning, onScan, onError]);

  const stopScanning = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsScanning(false);
  }, []);

  useEffect(() => () => stopScanning(), [stopScanning]);

  return { isScanning, hasPermission, videoRef, startScanning, stopScanning };
}
