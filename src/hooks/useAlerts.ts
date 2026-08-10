'use client';

/**
 * API estable para alertas.
 * Toda la UI (Sidebar badge, TopBar, /alerts, widget) lee el mismo AlertsProvider.
 * El parámetro teamId se ignora a propósito: el club activo lo fija el provider.
 */
import { useAlertsContext, type AlertsContextValue } from '@/contexts/AlertsContext';

export function useAlerts(_teamId?: string): AlertsContextValue {
  return useAlertsContext();
}
