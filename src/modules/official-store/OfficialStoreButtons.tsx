'use client';

import { RefreshCw, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfficialStoreButtons({
  onOpen,
  onRefresh,
  refreshing,
}: {
  onOpen: () => void;
  onRefresh: () => void;
  refreshing?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          'w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5',
          'text-sm font-bold text-white',
          'bg-gradient-to-r from-emerald-600 to-emerald-500',
          'shadow-md shadow-emerald-900/30',
          'transition-all duration-150 ease-out',
          'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/40',
          'active:translate-y-0'
        )}
      >
        <ShoppingBag className="h-4 w-4" aria-hidden />
        🛍 Abrir Tienda Oficial
      </button>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className={cn(
          'w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3',
          'text-sm font-bold text-slate-200',
          'border border-slate-600/80 bg-slate-900/40',
          'transition-all duration-150 ease-out',
          'hover:border-slate-400 hover:bg-slate-800/60',
          'disabled:opacity-60'
        )}
      >
        <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} aria-hidden />
        🔄 Actualizar
      </button>
    </div>
  );
}
