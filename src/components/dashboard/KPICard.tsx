import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: 'default' | 'warning' | 'danger' | 'success';
  onClick?: () => void;
}

const VARIANTS = {
  default: 'bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-800',
  warning: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40',
  danger:  'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/40',
  success: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/40',
};

const ICON_VARIANTS = {
  default: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
  danger:  'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400',
  success: 'bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400',
};

export function KPICard({
  title, value, subtitle, icon: Icon, trend, variant = 'default', onClick
}: KPICardProps) {
  return (
    <Card
      className={cn('border transition-shadow text-left', VARIANTS[variant], onClick && 'cursor-pointer hover:shadow-md')}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</p>
            <p className="text-3xl font-extrabold mt-1.5 text-gray-900 dark:text-slate-100 tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            {trend && (
              <div className="flex items-center gap-1 mt-2.5">
                <span className={cn(
                  'text-xs font-bold',
                  trend.value > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-gray-400">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={cn('p-3 rounded-xl shrink-0', ICON_VARIANTS[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
