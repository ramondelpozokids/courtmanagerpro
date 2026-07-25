'use client';

import { useEffect } from 'react';
import { checkOfficialStore } from '@/modules/official-store';

/**
 * On app/dashboard start: ping official store availability only.
 * No product download. Result persisted in local/session storage for the card.
 */
export function OfficialStoreBootstrap() {
  useEffect(() => {
    const key = 'cm-official-store-startup';
    try {
      const last = sessionStorage.getItem(key);
      if (last && Date.now() - Number(last) < 3_600_000) return;
      sessionStorage.setItem(key, String(Date.now()));
    } catch {
      /* ignore */
    }

    void checkOfficialStore().catch((err) => {
      console.warn('[OfficialStoreBootstrap] non-blocking:', err);
    });
  }, []);

  return null;
}
