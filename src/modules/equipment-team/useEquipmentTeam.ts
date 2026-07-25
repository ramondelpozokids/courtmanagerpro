'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import type {
  EquipmentHistoryEntry,
  EquipmentNote,
  EquipmentNotice,
  EquipmentReport,
  EquipmentTask,
  EquipmentTeamMember,
  EquipmentTeamSummary,
} from './types';

export interface EquipmentBootstrap {
  summary: EquipmentTeamSummary;
  members: EquipmentTeamMember[];
  notes: EquipmentNote[];
  reports: EquipmentReport[];
  tasks: EquipmentTask[];
  notices: EquipmentNotice[];
  history: EquipmentHistoryEntry[];
}

export interface EquipmentSearchResult {
  members: EquipmentTeamMember[];
  notes: EquipmentNote[];
  reports: EquipmentReport[];
  tasks: EquipmentTask[];
  notices: EquipmentNotice[];
}

async function jsonFetch<T>(
  url: string,
  init?: RequestInit
): Promise<{ data: T; fallbackDemo: boolean }> {
  const res = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (payload as { error?: string }).error || `Error HTTP ${res.status}`;
    throw new Error(msg);
  }
  const meta = (payload as { meta?: { fallback?: string } }).meta;
  return {
    data: (payload as { data: T }).data,
    fallbackDemo: meta?.fallback === 'demo',
  };
}

export function useEquipmentTeam(teamId: string = DEFAULT_TEAM_ID) {
  const [data, setData] = useState<EquipmentBootstrap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await jsonFetch<EquipmentBootstrap>(
        `/api/equipment-team?team_id=${encodeURIComponent(teamId)}`
      );
      setData(next.data);
      setDemoMode(next.fallbackDemo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const search = useCallback(
    async (q: string) => {
      const result = await jsonFetch<EquipmentSearchResult>(
        `/api/equipment-team/search?team_id=${encodeURIComponent(teamId)}&q=${encodeURIComponent(q)}`
      );
      return result.data;
    },
    [teamId]
  );

  const createMember = useCallback(
    async (body: Partial<EquipmentTeamMember>) => {
      await jsonFetch(`/api/equipment-team/members`, {
        method: 'POST',
        body: JSON.stringify({ ...body, team_id: teamId }),
      });
      await refresh();
    },
    [teamId, refresh]
  );

  const updateMember = useCallback(
    async (body: Partial<EquipmentTeamMember> & { id: string }) => {
      await jsonFetch(`/api/equipment-team/members`, {
        method: 'PATCH',
        body: JSON.stringify({ ...body, team_id: teamId }),
      });
      await refresh();
    },
    [teamId, refresh]
  );

  const deleteMember = useCallback(
    async (id: string) => {
      await jsonFetch(`/api/equipment-team/members?id=${encodeURIComponent(id)}&team_id=${encodeURIComponent(teamId)}`, {
        method: 'DELETE',
      });
      await refresh();
    },
    [teamId, refresh]
  );

  const createNote = useCallback(
    async (content: string, author_name?: string) => {
      await jsonFetch(`/api/equipment-team/notes`, {
        method: 'POST',
        body: JSON.stringify({ team_id: teamId, content, author_name }),
      });
      await refresh();
    },
    [teamId, refresh]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      await jsonFetch(
        `/api/equipment-team/notes?id=${encodeURIComponent(id)}&team_id=${encodeURIComponent(teamId)}`,
        { method: 'DELETE' }
      );
      await refresh();
    },
    [teamId, refresh]
  );

  const createReport = useCallback(
    async (body: { title: string; content: string; attachments?: EquipmentReport['attachments']; author_name?: string }) => {
      await jsonFetch(`/api/equipment-team/reports`, {
        method: 'POST',
        body: JSON.stringify({ ...body, team_id: teamId }),
      });
      await refresh();
    },
    [teamId, refresh]
  );

  const deleteReport = useCallback(
    async (id: string) => {
      await jsonFetch(
        `/api/equipment-team/reports?id=${encodeURIComponent(id)}&team_id=${encodeURIComponent(teamId)}`,
        { method: 'DELETE' }
      );
      await refresh();
    },
    [teamId, refresh]
  );

  const createTask = useCallback(
    async (body: Partial<EquipmentTask>) => {
      await jsonFetch(`/api/equipment-team/tasks`, {
        method: 'POST',
        body: JSON.stringify({ ...body, team_id: teamId }),
      });
      await refresh();
    },
    [teamId, refresh]
  );

  const updateTask = useCallback(
    async (body: Partial<EquipmentTask> & { id: string }) => {
      await jsonFetch(`/api/equipment-team/tasks`, {
        method: 'PATCH',
        body: JSON.stringify({ ...body, team_id: teamId }),
      });
      await refresh();
    },
    [teamId, refresh]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await jsonFetch(
        `/api/equipment-team/tasks?id=${encodeURIComponent(id)}&team_id=${encodeURIComponent(teamId)}`,
        { method: 'DELETE' }
      );
      await refresh();
    },
    [teamId, refresh]
  );

  const createNotice = useCallback(
    async (body: Partial<EquipmentNotice>) => {
      await jsonFetch(`/api/equipment-team/notices`, {
        method: 'POST',
        body: JSON.stringify({ ...body, team_id: teamId }),
      });
      await refresh();
    },
    [teamId, refresh]
  );

  const updateNotice = useCallback(
    async (body: Partial<EquipmentNotice> & { id: string }) => {
      await jsonFetch(`/api/equipment-team/notices`, {
        method: 'PATCH',
        body: JSON.stringify({ ...body, team_id: teamId }),
      });
      await refresh();
    },
    [teamId, refresh]
  );

  const deleteNotice = useCallback(
    async (id: string) => {
      await jsonFetch(
        `/api/equipment-team/notices?id=${encodeURIComponent(id)}&team_id=${encodeURIComponent(teamId)}`,
        { method: 'DELETE' }
      );
      await refresh();
    },
    [teamId, refresh]
  );

  return {
    data,
    loading,
    error,
    demoMode,
    refresh,
    search,
    createMember,
    updateMember,
    deleteMember,
    createNote,
    deleteNote,
    createReport,
    deleteReport,
    createTask,
    updateTask,
    deleteTask,
    createNotice,
    updateNotice,
    deleteNotice,
  };
}
