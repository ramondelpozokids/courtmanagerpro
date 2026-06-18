'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface BarcodeGeneratorProps {
  value: string;
  type: 'barcode' | 'qr';
  label?: string;
  width?: number;
  height?: number;
}

export function BarcodeGenerator({ value, type, label, width = 200, height = 100 }: BarcodeGeneratorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (type === 'barcode' && svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: 'CODE128',
        width: 2,
        height,
        displayValue: true,
        fontSize: 12,
        margin: 8,
      });
    }
    if (type === 'qr' && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, { width, margin: 2 });
    }
  }, [value, type, width, height]);

  const download = () => {
    if (type === 'barcode' && svgRef.current) {
      const blob = new Blob([svgRef.current.outerHTML], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `barcode-${value}.svg`;
      a.click();
    }
    if (type === 'qr' && canvasRef.current) {
      canvasRef.current.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qr-${value}.png`;
        a.click();
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {label && <p className="text-sm font-medium text-slate-700 dark:text-slate-350">{label}</p>}
      {type === 'barcode' ? (
        <svg ref={svgRef} />
      ) : (
        <canvas ref={canvasRef} />
      )}
      <Button variant="outline" size="sm" onClick={download}>
        <Download className="h-3.5 w-3.5 mr-1.5" />
        Descargar
      </Button>
    </div>
  );
}
