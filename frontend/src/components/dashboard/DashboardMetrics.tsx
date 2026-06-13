import { useMemo } from 'react';
import { Bot, ChartColumnBig, Eye, Gauge, Users } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { useCounter } from '@/hooks/useCounter';
import { useI18n } from '@/lib/i18n';
import type { AnalyticsSummaryResponse } from '@/types/api';

// KPI con contador animado (los valores string, ej. "3.5%", se muestran estaticos)
function KpiValue({ value }: { value: number | string }) {
  const count = useCounter(typeof value === 'number' ? value : 0, 1400, typeof value === 'number');
  return (
    <p className="text-3xl font-bold text-[var(--color-text)] tabular-nums">
      {typeof value === 'number' ? count : value}
    </p>
  );
}

function metricTone(value: number) {
  if (value >= 60) return 'text-[var(--color-success)]';
  if (value >= 35) return 'text-[var(--color-accent)]';
  return 'text-[var(--color-danger)]';
}

export function DashboardMetrics({ snapshot }: { snapshot?: AnalyticsSummaryResponse }) {
  const { t } = useI18n();
  const totals = snapshot?.totals;
  const trend = snapshot?.trend ?? [];

  const peakDay = useMemo(() => trend.reduce(
    (acc, item) => {
      const score = item.visits + item.aiRequests;
      return score > acc.score ? { day: item.day, score } : acc;
    },
    { day: '-', score: 0 },
  ), [trend]);

  const topScale = Math.max(1, ...trend.map((p) => Math.max(p.visits, p.aiRequests)));

  const kpis = [
    { title: t('dashboard.kpiVisits'), value: totals?.totalVisits ?? 0, helper: t('dashboard.kpiVisitsHelp'), icon: Eye, accent: 'bg-orange-100 text-orange-700' },
    { title: t('dashboard.kpiAi'), value: totals?.aiRequests ?? 0, helper: t('dashboard.kpiAiHelp'), icon: Bot, accent: 'bg-indigo-100 text-indigo-700' },
    { title: t('dashboard.kpiUsers'), value: totals?.totalUsers ?? 0, helper: t('dashboard.kpiUsersHelp'), icon: Users, accent: 'bg-emerald-100 text-emerald-700' },
    { title: t('dashboard.kpiConversion'), value: `${(snapshot?.conversionRate ?? 0).toFixed(1)}%`, helper: t('dashboard.kpiConversionHelp'), icon: Gauge, accent: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="rounded-2xl dash-card">
              <CardBody className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-[var(--color-text-secondary)]">{item.title}</p>
                  <span className={`inline-flex size-9 items-center justify-center rounded-xl ${item.accent}`}>
                    <Icon size={16} />
                  </span>
                </div>
                <KpiValue value={item.value} />
                <p className="text-xs text-[var(--color-text-muted)]">{item.helper}</p>
              </CardBody>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 rounded-2xl dash-card">
          <CardHeader className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-text)]">{t('dashboard.trendTitle')}</h2>
              <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.trendSubtitle')}</p>
            </div>
            <ChartColumnBig size={18} className="text-[var(--color-text-muted)]" />
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-7 gap-2 items-end h-44">
              {trend.map((point) => (
                <div key={point.day} className="flex flex-col items-center gap-2 h-full">
                  <div className="w-full flex items-end justify-center gap-1 flex-1">
                    <div className="dash-bar w-2.5 rounded-full bg-orange-500/80" style={{ height: `${Math.max(8, (point.visits / topScale) * 100)}%` }} title={`${t('dashboard.visits')} ${point.visits}`} />
                    <div className="dash-bar w-2.5 rounded-full bg-red-500/80" style={{ height: `${Math.max(8, (point.aiRequests / topScale) * 100)}%` }} title={`${t('dashboard.aiUsage')} ${point.aiRequests}`} />
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)]">{point.day}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-2xl dash-card">
          <CardHeader>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">{t('dashboard.funnelTitle')}</h2>
            <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.funnelSubtitle')}</p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.conversion')}</p>
              <p className={`text-xl font-bold ${metricTone(snapshot?.conversionRate ?? 0)}`}>{(snapshot?.conversionRate ?? 0).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.dashboardAdoption')}</p>
              <p className={`text-xl font-bold ${metricTone(snapshot?.dashboardAdoption ?? 0)}`}>{(snapshot?.dashboardAdoption ?? 0).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.aiIntensity')}</p>
              <p className="text-xl font-bold text-[var(--color-text)]">{snapshot?.aiPerVisit ?? 0}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.peakDay')}</p>
              <p className="text-xl font-bold text-[var(--color-text)]">{peakDay.day}</p>
            </div>
          </CardBody>
        </Card>
      </section>
    </>
  );
}
