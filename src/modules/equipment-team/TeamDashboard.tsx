'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ClipboardList,
  FileText,
  HardHat,
  History,
  MessageSquare,
  RefreshCw,
  Search,
  StickyNote,
  Users,
} from 'lucide-react';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { useAuth } from '@/contexts/AuthContext';
import { canWriteClubData } from '@/lib/permissions';
import { canAccessEquipmentTeam } from './access';
import { useEquipmentTeam, type EquipmentSearchResult } from './useEquipmentTeam';
import { MembersList, memberFormToPayload } from './Members/MembersList';
import { NotesWall } from './Notes/NotesWall';
import { ReportsPanel } from './Reports/ReportsPanel';
import { TasksPanel } from './Tasks/TasksPanel';
import { NoticesPanel } from './Alerts/NoticesPanel';
import { HistoryFeed } from './History/HistoryFeed';
import { memberFullName } from './types';

type TabId = 'resumen' | 'companeros' | 'notas' | 'informes' | 'tareas' | 'avisos' | 'historial';

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: 'resumen', label: 'Resumen', icon: HardHat },
  { id: 'companeros', label: 'Compañeros', icon: Users },
  { id: 'notas', label: 'Notas', icon: StickyNote },
  { id: 'informes', label: 'Informes', icon: FileText },
  { id: 'tareas', label: 'Tareas', icon: ClipboardList },
  { id: 'avisos', label: 'Avisos', icon: MessageSquare },
  { id: 'historial', label: 'Historial', icon: History },
];

export function TeamDashboard({ teamId = DEFAULT_TEAM_ID }: { teamId?: string }) {
  const { user, userEmail, hasOperationalAccess } = useAuth();
  const role = user?.profile?.role;
  const hasAccess = hasOperationalAccess || canAccessEquipmentTeam(role, userEmail);
  const canEdit = hasOperationalAccess || canWriteClubData(role, userEmail);
  const authorName = user?.profile?.full_name || 'Carlos Rodríguez Kobe';

  const {
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
    deleteHistory,
    deleteHistoryMany,
    clearHistory,
  } = useEquipmentTeam(teamId);

  const [tab, setTab] = useState<TabId>('resumen');
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<EquipmentSearchResult | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResult(null);
      return;
    }
    const t = setTimeout(() => {
      setSearching(true);
      void search(query)
        .then(setSearchResult)
        .finally(() => setSearching(false));
    }, 280);
    return () => clearTimeout(t);
  }, [query, search]);

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

  const summary = data?.summary;

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <HardHat className="h-6 w-6 text-orange-500" />
            Equipo de Utillería
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hub de comunicación interno: compañeros, muro, informes, tareas y avisos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-orange-500"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {demoMode && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-700 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          Modo demo: faltan las tablas de utillería en Supabase. Los cambios no se guardan de forma permanente hasta
          aplicar la migración <code className="text-xs">011_equipment_team_hub.sql</code> en el SQL Editor.
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-800 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar personas, notas, informes, tareas, avisos..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md"
        />
      </div>

      {query.trim() && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
            Resultados {searching ? '…' : ''}
          </p>
          {!searchResult ||
          (searchResult.members.length === 0 &&
            searchResult.notes.length === 0 &&
            searchResult.reports.length === 0 &&
            searchResult.tasks.length === 0 &&
            searchResult.notices.length === 0) ? (
            <p className="text-xs text-slate-500">Sin coincidencias.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {searchResult.members.map((m) => (
                <a key={m.id} href={`/equipment-team/${m.id}`} className="font-bold text-orange-500 hover:underline">
                  {memberFullName(m)} · {m.role}
                </a>
              ))}
              {searchResult.notes.map((n) => (
                <p key={n.id} className="text-slate-500 truncate">
                  Nota: {n.content}
                </p>
              ))}
              {searchResult.reports.map((r) => (
                <p key={r.id} className="text-slate-500 truncate">
                  Informe: {r.title}
                </p>
              ))}
              {searchResult.tasks.map((t) => (
                <p key={t.id} className="text-slate-500 truncate">
                  Tarea: {t.title}
                </p>
              ))}
              {searchResult.notices.map((n) => (
                <p key={n.id} className="text-slate-500 truncate">
                  Aviso: {n.title}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400 font-bold">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="py-20 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-sm font-semibold text-slate-400">Cargando hub de utillería...</p>
        </div>
      ) : (
        <>
          {tab === 'resumen' && summary && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <SummaryCard label="Compañeros activos" value={summary.activeMembers} />
                <SummaryCard label="Tareas pendientes" value={summary.pendingTasks.length} warn />
                <SummaryCard label="Avisos urgentes" value={summary.urgentNotices.length} warn />
                <SummaryCard label="Informes recientes" value={summary.newReports.length} />
              </div>
              {summary.urgentNotices.length > 0 && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                  <p className="text-[10px] font-black uppercase text-red-400 mb-2">Urgente</p>
                  {summary.urgentNotices.map((n) => (
                    <p key={n.id} className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {n.title}
                    </p>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Últimas notas</p>
                  {summary.recentNotes.length === 0 ? (
                    <p className="text-xs text-slate-500">Sin notas</p>
                  ) : (
                    summary.recentNotes.map((n) => (
                      <p key={n.id} className="text-xs text-slate-600 dark:text-slate-300 truncate mb-1">
                        <span className="font-bold text-orange-500">{n.author_name}:</span> {n.content}
                      </p>
                    ))
                  )}
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Tareas abiertas</p>
                  {summary.pendingTasks.length === 0 ? (
                    <p className="text-xs text-slate-500">Todo al día</p>
                  ) : (
                    summary.pendingTasks.slice(0, 5).map((t) => (
                      <p key={t.id} className="text-xs text-slate-600 dark:text-slate-300 truncate mb-1">
                        {t.title} · <span className="text-orange-500 font-bold">{t.status}</span>
                      </p>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'companeros' && data && (
            <MembersList
              members={data.members}
              canEdit={canEdit}
              onCreate={async (values) => createMember(memberFormToPayload(values))}
              onUpdate={async (id, values) => updateMember({ id, ...memberFormToPayload(values) })}
              onDelete={deleteMember}
            />
          )}

          {tab === 'notas' && data && (
            <NotesWall
              notes={data.notes}
              canEdit={canEdit}
              authorName={authorName}
              onCreate={createNote}
              onDelete={deleteNote}
            />
          )}

          {tab === 'informes' && data && (
            <ReportsPanel
              reports={data.reports}
              canEdit={canEdit}
              authorName={authorName}
              onCreate={createReport}
              onDelete={deleteReport}
            />
          )}

          {tab === 'tareas' && data && (
            <TasksPanel
              tasks={data.tasks}
              members={data.members}
              canEdit={canEdit}
              onCreate={createTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          )}

          {tab === 'avisos' && data && (
            <NoticesPanel
              notices={data.notices}
              canEdit={canEdit}
              authorName={authorName}
              onCreate={createNotice}
              onUpdate={updateNotice}
              onDelete={deleteNotice}
            />
          )}

          {tab === 'historial' && data && (
            <HistoryFeed
              history={data.history}
              canEdit={canEdit}
              onDelete={deleteHistory}
              onDeleteMany={deleteHistoryMany}
              onClearAll={clearHistory}
            />
          )}
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
      <p className={`text-2xl font-black mt-1 ${warn && value > 0 ? 'text-amber-500' : 'text-slate-800 dark:text-white'}`}>
        {value}
      </p>
    </div>
  );
}
