'use client';

import { useEffect, useRef } from 'react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { useActiveTeamId } from '@/contexts/ClubDemoContext';

/** Sync de calendario oficial por club activo (RMB / RMF / ATM). */
export function CalendarSyncBootstrap() {
  const teamId = useActiveTeamId() || DEFAULT_TEAM_ID;
  const lastTeamRef = useRef<string | null>(null);

  useEffect(() => {
    const teamChanged = lastTeamRef.current != null && lastTeamRef.current !== teamId;
    lastTeamRef.current = teamId;

    const key = `cm-calendar-sync-startup:${teamId}`;
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

    void fetch('/api/calendar/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        // Force: amistosos nuevos no deben quedar fuera por un sync "ok" reciente.
        trigger: teamChanged ? 'manual' : 'startup',
        team_id: teamId,
        force: true,
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
          new CustomEvent('calendar-sync-complete', { detail: json?.data || {} })
        );
      })
      .catch((err) => {
        console.warn('[CalendarSyncBootstrap] non-blocking failure:', err);
      });
  }, [teamId]);

  return null;
}
