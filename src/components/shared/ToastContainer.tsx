'use client';

import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const { notifications, dismiss } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2.5 max-w-sm w-full text-left">
      {notifications.map((n) => {
        return (
          <div
            key={n.id}
            className={`p-4 rounded-xl shadow-lg border flex gap-3 items-start animate-fade-in bg-white dark:bg-slate-900 ${
              n.type === 'success'
                ? 'border-emerald-100 dark:border-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                : n.type === 'error'
                ? 'border-red-100 dark:border-red-950/40 text-red-800 dark:text-red-300'
                : n.type === 'warning'
                ? 'border-amber-100 dark:border-amber-950/40 text-amber-800 dark:text-amber-300'
                : 'border-blue-100 dark:border-blue-950/40 text-blue-800 dark:text-blue-300'
            }`}
          >
            {n.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />}
            {n.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />}
            {n.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />}
            {n.type === 'info' && <Info className="h-5 w-5 text-blue-500 shrink-0" />}

            <div className="flex-1 min-w-0 text-xs">
              <h4 className="font-extrabold">{n.title}</h4>
              {n.message && <p className="text-slate-500 mt-1">{n.message}</p>}
            </div>

            <button
              onClick={() => dismiss(n.id)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
