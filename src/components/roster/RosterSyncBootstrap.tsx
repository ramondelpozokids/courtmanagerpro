'use client';

import { useEffect, useRef } from 'react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Transparent startup sync: fires once per browser session when the dashboard mounts.
 * Failures never block the UI.
 */
export function RosterSyncBootstrap() {
  const { currentTeam } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const teamId = currentTeam?.id || DEFAULT_TEAM_ID;
    const key = `cm-roster-sync-startup:${teamId}`;
    try {
      const last = sessionStorage.getItem(key);
      if (last) {
        const ageH = (Date.now() - Number(last)) / 3_600_000;
        if (ageH < 1) return;
      }
    } catch {
      /* ignore */
    }

    void fetch('/api/roster/sync', {
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
        if (json?.data?.changesCount > 0) {
          window.dispatchEvent(
            new CustomEvent('roster-sync-complete', { detail: json.data })
          );
        } else {
          window.dispatchEvent(
            new CustomEvent('roster-sync-complete', { detail: json?.data || {} })
          );
        }
      })
      .catch((err) => {
        console.warn('[RosterSyncBootstrap] sync failed (non-blocking):', err);
      });
  }, [currentTeam?.id]);

  return null;
}
