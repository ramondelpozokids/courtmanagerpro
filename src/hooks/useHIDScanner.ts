'use client';

import { useEffect, useRef } from 'react';

interface HIDScannerOptions {
  enabled?: boolean;
  onScan: (code: string) => void;
  /** Máximo ms entre teclas para considerar entrada de pistola (Fase 2). */
  maxGapMs?: number;
  minLength?: number;
}

/**
 * Fase 2 — Lectores Zebra / Honeywell en modo teclado HID (Bluetooth/USB).
 * Acumula caracteres rápidos + Enter sin foco en inputs.
 */
export function useHIDScanner({
  enabled = true,
  onScan,
  maxGapMs = 45,
  minLength = 4,
}: HIDScannerOptions) {
  const bufferRef = useRef('');
  const lastKeyRef = useRef(0);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }

      const now = Date.now();
      if (now - lastKeyRef.current > maxGapMs) {
        bufferRef.current = '';
      }
      lastKeyRef.current = now;

      if (e.key === 'Enter') {
        const code = bufferRef.current.trim();
        bufferRef.current = '';
        if (code.length >= minLength) {
          e.preventDefault();
          onScanRef.current(code);
        }
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        bufferRef.current += e.key;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, maxGapMs, minLength]);
}
