import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RmbAutoImportModule } from '@/components/rmb/RmbAutoImportModule';

export default function RmbImportPage() {
  return (
    <div className="space-y-6 text-left max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Importación automática RMB
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Carlos y Superadmin: sube cualquier documento y CourtManager actualiza tallas, fotos o inventario al instante.
        </p>
      </div>
      <RmbAutoImportModule />
    </div>
  );
}
