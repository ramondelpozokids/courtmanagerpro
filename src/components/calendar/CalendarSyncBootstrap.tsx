'use client';

import { useEffect, useRef } from 'react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { useAuth } from '@/contexts/AuthContext';

/** Transparent calendar sync on dashboard mount (every ~12h / once per session window). */
export function CalendarSyncBootstrap() {
  const { currentTeam } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const teamId = currentTeam?.id || DEFAULT_TEAM_ID;
    const key = `cm-calendar-sync-startup:${teamId}`;
    try {
      const last = sessionStorage.getItem(key);
      if (last) {
        const ageH = (Date.now() - Number(last)) / 3_600_000;
        if (ageH < 1) return;
      }
    } catch {
      /* ignore */
    }

    void fetch('/api/calendar/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trigger: 'startup', team_id: teamId }),
    })
      .then(async (res) => {
        try {
          sessionStorage.setItem(key, String(Date.now()));
        } catch {
          /* ignore */
        }
        const json = await res.json().catch(() => null);
        window.dispatchEvent(
          new CustomEvent('calendar-sync-complete', { detail: json?.data || {} })
        );
      })
      .catch((err) => {
        console.warn('[CalendarSyncBootstrap] non-blocking failure:', err);
      });
  }, [currentTeam?.id]);

  return null;
}
