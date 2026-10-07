import { useMemo, useState } from 'react';
import { CalendarRange, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { useAnalyticsTimeline } from '@/hooks/useAnalytics';
import { useI18n } from '@/lib/i18n';
import { computeStats, trimToHistory } from '@/lib/timeline-stats';
import { TimelineChart } from './TimelineChart';
import { SERIES_COLORS } from './timeline-colors';

const RANGES = [
  { days: 7, label: 'dashboard.timelineRange7' },
  { days: 30, label: 'dashboard.timelineRange30' },
  { days: 90, label: 'dashboard.timelineRange90' },
  { days: 365, label: 'dashboard.timelineRangeAll' },
] as const;

type SeriesKey = keyof typeof SERIES_COLORS;

export function DashboardTimelineCard() {
  const { t, language } = useI18n();
  const locale = language === 'en' ? 'en-US' : 'es-EC';
  const [days, setDays] = useState<number>(30);
  const [show, setShow] = useState<Record<SeriesKey, boolean>>({ visits: true, avg: true, ai: false });
  const query = useAnalyticsTimeline(days);
  // Un fallo al refrescar en segundo plano no debe tapar datos que ya se cargaron
  const failed = query.isError && !query.data;

  const points = useMemo(
    () => trimToHistory(query.data?.points ?? [], query.data?.firstEventDate ?? null),
    [query.data],
  );
  const stats = useMemo(() => computeStats(points), [points]);

  const num = (n: number, digits = 0) => n.toLocaleString(locale, { maximumFractionDigits: digits });
  const day = (iso: string) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
  const month = (ym: string) => {
    const text = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${ym}-01T00:00:00Z`));
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const labels = { visits: t('dashboard.timelineVisits'), avg: t('dashboard.timelineAvg'), ai: t('dashboard.timelineAi') };
  const longRange = points.length >= 45;
  const busiest = longRange && stats.bestMonth
    ? { title: t('dashboard.timelineBestMonth'), value: month(stats.bestMonth.month), visits: stats.bestMonth.visits }
    : stats.bestWeek
      ? { title: t('dashboard.timelineBestWeek'), value: `${day(stats.bestWeek.from)} – ${day(stats.bestWeek.to)}`, visits: stats.bestWeek.visits }
      : null;

  const trend = stats.trendPct;
  const trendUp = trend !== null && trend >= 0;
  const TrendIcon = trendUp ? TrendingUp : TrendingDown;

  return (
    <Card className="xl:col-span-2 rounded-2xl dash-card">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text)]">{t('dashboard.timelineTitle')}</h2>
          <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.timelineSubtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarRange size={16} className="text-[var(--color-text-muted)] hidden sm:block" />
          <div className="inline-flex rounded-xl border border-[var(--color-border)] p-0.5 bg-[var(--color-surface-soft)]">
            {RANGES.map((r) => (
              <button
                key={r.days}
                type="button"
                onClick={() => setDays(r.days)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  days === r.days ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                {t(r.label)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SERIES_COLORS) as SeriesKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setShow((s) => ({ ...s, [key]: !s[key] }))}
              aria-pressed={show[key]}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-opacity ${
                show[key] ? 'border-[var(--color-border)] text-[var(--color-text)]' : 'border-transparent text-[var(--color-text-muted)] opacity-60'
              }`}
            >
              <span className="size-2.5 rounded-full" style={{ backgroundColor: SERIES_COLORS[key] }} />
              {labels[key]}
            </button>
          ))}
        </div>

        {query.isLoading && <p className="py-16 text-center text-sm text-[var(--color-text-muted)]">{t('dashboard.timelineLoading')}</p>}
        {failed && <p className="py-16 text-center text-sm text-[var(--color-danger)]">{t('dashboard.timelineError')}</p>}
        {!query.isLoading && !failed && stats.total === 0 && (
          <p className="py-16 text-center text-sm text-[var(--color-text-muted)]">{t('dashboard.timelineEmpty')}</p>
        )}
        {!query.isLoading && !failed && stats.total > 0 && (
          <>
            <TimelineChart points={points} locale={locale} show={show} labels={labels} />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.timelineTotal')}</p>
                <p className="text-xl font-bold text-[var(--color-text)] tabular-nums">{num(stats.total)}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{num(stats.avgPerDay, 1)} {t('dashboard.timelinePerDay')}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.timelinePeakDay')}</p>
                <p className="text-xl font-bold text-[var(--color-text)]">{stats.peak ? day(stats.peak.date) : '-'}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{stats.peak ? `${num(stats.peak.visits)} ${t('dashboard.timelineVisitsWord')}` : ''}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">{busiest?.title ?? t('dashboard.timelineBestWeek')}</p>
                <p className="text-xl font-bold text-[var(--color-text)]">{busiest?.value ?? '-'}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{busiest ? `${num(busiest.visits)} ${t('dashboard.timelineVisitsWord')}` : ''}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.timelineTrend')}</p>
                {trend === null ? (
                  <p className="text-xl font-bold text-[var(--color-text-muted)]">-</p>
                ) : (
                  <p className={`flex items-center gap-1 text-xl font-bold ${trendUp ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                    <TrendIcon size={18} />
                    {Number.isFinite(trend) ? `${trend > 0 ? '+' : ''}${num(trend)}%` : t('dashboard.timelineTrendNew')}
                  </p>
                )}
                <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.timelineTrendHelp')}</p>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
