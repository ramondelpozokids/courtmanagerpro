'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ToastNotification } from '@/types';

interface NotificationContextValue {
  notifications: ToastNotification[];
  toast: (notification: Omit<ToastNotification, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const toast = useCallback((notification: Omit<ToastNotification, 'id'>) => {
    const id = crypto.randomUUID();
    const newNotification = { ...notification, id };
    setNotifications((prev) => [newNotification, ...prev]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, notification.duration || 4000);
  }, []);

  const success = useCallback((title: string, message?: string) => toast({ type: 'success', title, message }), [toast]);
  const error = useCallback((title: string, message?: string) => toast({ type: 'error', title, message, duration: 6000 }), [toast]);
  const warning = useCallback((title: string, message?: string) => toast({ type: 'warning', title, message }), [toast]);
  const info = useCallback((title: string, message?: string) => toast({ type: 'info', title, message }), [toast]);

  const dismiss = useCallback((id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id)), []);

  return (
    <NotificationContext.Provider value={{ notifications, toast, success, error, warning, info, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
  return ctx;
}
