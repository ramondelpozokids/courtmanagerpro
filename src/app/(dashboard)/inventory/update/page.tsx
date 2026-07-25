'use client';

import { UpdateInventoryModule } from '@/components/inventory/UpdateInventoryModule';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function UpdateInventoryPage() {
  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-500"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Inventario
        </Link>
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Actualizar inventario
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Sube un PDF o Word del club. OCR + IA detectan altas, bajas y cambios de cantidad.
        </p>
      </div>
      <UpdateInventoryModule />
    </div>
  );
}
