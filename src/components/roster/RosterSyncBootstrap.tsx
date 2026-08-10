'use client';

import { useEffect, useRef } from 'react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { useActiveTeamId } from '@/contexts/ClubDemoContext';

/**
 * Startup sync por club activo (RMB / RMF / ATM).
 * Al cambiar de club en el switcher, vuelve a sincronizar ese team_id.
 * Failures never block the UI.
 */
export function RosterSyncBootstrap() {
  const teamId = useActiveTeamId() || DEFAULT_TEAM_ID;
  const lastTeamRef = useRef<string | null>(null);

  useEffect(() => {
    const teamChanged = lastTeamRef.current != null && lastTeamRef.current !== teamId;
    lastTeamRef.current = teamId;

    const key = `cm-roster-sync-startup:${teamId}`;
    try {
      if (!teamChanged) {
        const last = sessionStorage.getItem(key);
        if (last) {
          const ageH = (Date.now() - Number(last)) / 3_600_000;
          if (ageH < 1) return;
        }
      } else {
        sessionStorage.removeItem(key);
      }
    } catch {
      /* ignore */
    }

    void fetch('/api/roster/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        trigger: teamChanged ? 'manual' : 'startup',
        team_id: teamId,
        force: teamChanged,
      }),
    })
      .then(async (res) => {
        try {
          sessionStorage.setItem(key, String(Date.now()));
        } catch {
          /* ignore */
        }
        const json = await res.json().catch(() => null);
        window.dispatchEvent(
          new CustomEvent('roster-sync-complete', { detail: json?.data || {} })
        );
      })
      .catch((err) => {
        console.warn('[RosterSyncBootstrap] sync failed (non-blocking):', err);
      });
  }, [teamId]);

  return null;
}
