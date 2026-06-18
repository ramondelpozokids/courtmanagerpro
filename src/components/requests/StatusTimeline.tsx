import { CheckCircle, Clock, XCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Request } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const STEPS: { key: Request['status']; label: string }[] = [
  { key: 'pendiente',   label: 'Solicitud recibida' },
  { key: 'aprobada',    label: 'Aprobada' },
  { key: 'en_proceso',  label: 'En proceso' },
  { key: 'completada',  label: 'Completada' },
];

export function StatusTimeline({ request }: { request: Request }) {
  const isRejected = request.status === 'rechazada' || request.status === 'cancelada';
  const currentStep = STEPS.findIndex(s => s.key === request.status);

  if (isRejected) {
    return (
      <div className="flex items-center gap-3 py-4 text-left">
        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-700">
            {request.status === 'rechazada' ? 'Solicitud rechazada' : 'Solicitud cancelada'}
          </p>
          {request.rejection_reason && (
            <p className="text-xs text-red-500 mt-0.5">{request.rejection_reason}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative text-left">
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-6">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={step.key} className="flex items-center gap-4">
              <div className={cn(
                'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0',
                isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                isCurrent   ? 'bg-orange-500 border-orange-500 text-white' :
                              'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800'
              )}>
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : isCurrent ? (
                  <Clock className="h-4 w-4 text-white" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <div>
                <p className={cn(
                  'text-sm font-bold',
                  isCompleted ? 'text-emerald-700 dark:text-emerald-450' :
                  isCurrent   ? 'text-orange-600 dark:text-orange-450' :
                                'text-slate-400 dark:text-slate-600'
                )}>
                  {step.label}
                </p>
                {isCompleted && step.key === 'aprobada' && request.approved_at && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {format(new Date(request.approved_at), "d MMM yyyy 'a las' HH:mm", { locale: es })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
