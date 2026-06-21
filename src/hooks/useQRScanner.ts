'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser';

interface QRScannerOptions {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
}

export function useQRScanner({ onScan, onError }: QRScannerOptions) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const handledRef = useRef(false);

  const stopScanning = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    readerRef.current = null;
    setIsScanning(false);
  }, []);

  const startScanning = useCallback(async () => {
    if (!videoRef.current) return;

    handledRef.current = false;
    setHasPermission(null);

    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result && !handledRef.current) {
            handledRef.current = true;
            onScan(result.getText());
            stopScanning();
          }
          if (error && error.name !== 'NotFoundException') {
            // Frame sin código — ignorar
          }
        }
      );

      controlsRef.current = controls;
      setHasPermission(true);
      setIsScanning(true);
    } catch (err) {
      setHasPermission(false);
      stopScanning();
      onError?.(err instanceof Error ? err : new Error('No se pudo acceder a la cámara'));
    }
  }, [onScan, onError, stopScanning]);

  useEffect(() => () => stopScanning(), [stopScanning]);

  return { isScanning, hasPermission, videoRef, startScanning, stopScanning };
}
