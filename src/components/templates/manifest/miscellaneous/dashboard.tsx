'use client';

import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/components/document/lib/utils';

export interface StatCardItem {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export interface ActivityItem {
  id: string;
  action: string;
  time: string;
  user?: string;
}

const demoStats: StatCardItem[] = [
  { label: 'Revenue', value: '$12,543', change: 12.5, trend: 'up' },
  { label: 'Orders', value: '342', change: -3.2, trend: 'down' },
  { label: 'Customers', value: '1,205', change: 0, trend: 'neutral' },
  { label: 'Conversion', value: '3.24%', change: 0.8, trend: 'up' },
];

const demoActivity: ActivityItem[] = [
  { id: '1', action: 'New order #1284', time: '2 minutes ago', user: 'Alex' },
  { id: '2', action: 'User registered', time: '15 minutes ago', user: 'Jamie' },
  { id: '3', action: 'Refund processed #1276', time: '1 hour ago', user: 'Taylor' },
];

export interface DashboardProps {
  data?: {
    stats?: StatCardItem[];
    recentActivity?: ActivityItem[];
    chartData?: unknown;
  };
  appearance?: {
    title?: string;
    subtitle?: string;
    statColumns?: 2 | 3 | 4;
    showRecentActivity?: boolean;
    showCharts?: boolean;
  };
  actions?: {
    onActivityClick?: (item: ActivityItem) => void;
    onRefresh?: () => void;
  };
  control?: {
    isLoading?: boolean;
    error?: string | null;
  };
}

function TrendIcon({ trend }: { trend?: StatCardItem['trend'] }) {
  if (trend === 'up') return <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />;
  if (trend === 'down') return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function Dashboard({ data, appearance, actions, control }: DashboardProps) {
  const stats = data?.stats ?? demoStats;
  const recentActivity = data?.recentActivity ?? demoActivity;
  const {
    title = 'Dashboard',
    subtitle,
    statColumns = 4,
    showRecentActivity = true,
    showCharts = true,
  } = appearance ?? {};
  const { isLoading = false, error = null } = control ?? {};

  const gridClass =
    statColumns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : statColumns === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-sm text-destructive">{error}</p>
        {actions?.onRefresh ? (
          <Button htmlType="button" className="mt-4" variant="outlined" onClick={actions.onRefresh}>
            Retry
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>

      <div className={cn('grid gap-4', gridClass)}>
        {isLoading
          ? Array.from({ length: statColumns }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          : stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <TrendIcon trend={stat.trend} />
                </div>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                {typeof stat.change === 'number' ? (
                  <p className="mt-1 text-xs text-muted-foreground">{stat.change}% vs last period</p>
                ) : null}
              </div>
            ))}
      </div>

      {showCharts ? (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-sm font-medium">Performance Overview</h3>
          {isLoading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              Chart area placeholder
            </div>
          )}
        </div>
      ) : null}

      {showRecentActivity ? (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-sm font-medium">Recent Activity</h3>
          <ul className="space-y-3">
            {(isLoading ? demoActivity : recentActivity).map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between rounded-lg px-2 py-2 text-left hover:bg-muted/50"
                  onClick={() => actions?.onActivityClick?.(item)}
                >
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    {item.user ? <p className="text-xs text-muted-foreground">{item.user}</p> : null}
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
