'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveTeamId } from '@/contexts/ClubDemoContext';
import {
  canAccessEquipmentTeam,
  MemberProfile,
  type EquipmentHistoryEntry,
  type EquipmentTeamMember,
} from '@/modules/equipment-team';

export default function EquipmentMemberPage() {
  const params = useParams();
  const id = String(params?.id || '');
  const { user, userEmail, hasOperationalAccess } = useAuth();
  const teamId = useActiveTeamId();
  const role = user?.profile?.role;
  const hasAccess = hasOperationalAccess || canAccessEquipmentTeam(role, userEmail);

  const [member, setMember] = useState<EquipmentTeamMember | null>(null);
  const [history, setHistory] = useState<EquipmentHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasAccess || !id) return;
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const [mRes, hRes] = await Promise.all([
          fetch(
            `/api/equipment-team/members?id=${encodeURIComponent(id)}&team_id=${encodeURIComponent(teamId)}`
          ),
          fetch(
            `/api/equipment-team/history?team_id=${encodeURIComponent(teamId)}&entity_id=${encodeURIComponent(id)}`
          ),
        ]);
        const mJson = await mRes.json();
        const hJson = await hRes.json();
        if (!mRes.ok) throw new Error(mJson.error || 'No encontrado');
        if (!cancelled) {
          setMember(mJson.data);
          setHistory(hJson.data || []);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasAccess, id, teamId]);

  if (!hasAccess) {
    return (
      <div className="bg-white dark:bg-slate-900 border rounded-xl py-16 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-amber-500" />
        <p className="text-sm font-bold">Acceso restringido</p>
        <p className="text-sm mt-1 max-w-md mx-auto text-slate-500">
          Centro de utillería: solo personal autorizado (utilleros, managers o superadmin).
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
        <p className="text-sm font-semibold text-slate-400">Cargando ficha...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="bg-white dark:bg-slate-900 border rounded-xl py-16 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-amber-500" />
        <p className="text-sm font-bold">{error || 'Compañero no encontrado'}</p>
      </div>
    );
  }

  return <MemberProfile member={member} history={history} />;
}
