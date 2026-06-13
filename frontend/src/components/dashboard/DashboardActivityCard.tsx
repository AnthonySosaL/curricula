import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { useI18n } from '@/lib/i18n';
import type { AnalyticsSummaryResponse } from '@/types/api';

export function DashboardActivityCard({ snapshot }: { snapshot?: AnalyticsSummaryResponse }) {
  const { t } = useI18n();
  const totals = snapshot?.totals;
  const activityTotal = (totals?.totalVisits ?? 0)
    + (totals?.aiRequests ?? 0)
    + (totals?.authEntryOpens ?? 0)
    + (totals?.dashboardViews ?? 0);

  const activityMix = [
    { label: t('dashboard.visits'), value: totals?.totalVisits ?? 0, color: 'bg-orange-500' },
    { label: t('dashboard.aiUsage'), value: totals?.aiRequests ?? 0, color: 'bg-indigo-500' },
    { label: t('dashboard.loginClicks'), value: totals?.authEntryOpens ?? 0, color: 'bg-amber-500' },
    { label: t('dashboard.dashboardViews'), value: totals?.dashboardViews ?? 0, color: 'bg-emerald-500' },
  ];

  return (
    <Card className="rounded-2xl dash-card">
      <CardHeader>
        <h2 className="text-sm font-semibold text-[var(--color-text)]">{t('dashboard.activityDistribution')}</h2>
      </CardHeader>
      <CardBody className="space-y-3">
        {activityMix.map((item) => {
          const ratio = activityTotal > 0 ? (item.value / activityTotal) * 100 : 0;
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">{item.label}</span>
                <span className="font-semibold text-[var(--color-text)]">{item.value} ({ratio.toFixed(0)}%)</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-surface-soft)] overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: `${ratio}%` }} />
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
