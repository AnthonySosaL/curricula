import { Cpu } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { useI18n } from '@/lib/i18n';
import type { AnalyticsSummaryResponse } from '@/types/api';

function peakTone(ratio: number) {
  if (ratio >= 80) return { text: 'text-[var(--color-danger)]', bar: 'bg-red-500' };
  if (ratio >= 50) return { text: 'text-[var(--color-accent)]', bar: 'bg-amber-500' };
  return { text: 'text-[var(--color-success)]', bar: 'bg-emerald-500' };
}

export function DashboardAiUsageCard({ snapshot }: { snapshot?: AnalyticsSummaryResponse }) {
  const { t, language } = useI18n();
  const usage = snapshot?.aiUsage;
  if (!usage) return null;

  const fmt = (n: number) => n.toLocaleString(language === 'en' ? 'en-US' : 'es-EC');
  const since = usage.trackingSince
    ? new Date(usage.trackingSince).toLocaleDateString(language === 'en' ? 'en-US' : 'es-EC', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const trend = snapshot?.trend ?? [];
  const topDay = Math.max(1, ...trend.map((p) => p.aiTokens ?? 0));
  const messages = usage.messages.answered + usage.messages.blocked;
  const peakRatio = usage.tpmLimit > 0 ? Math.min(100, (usage.peakTokensPerMinute / usage.tpmLimit) * 100) : 0;
  const tone = peakTone(peakRatio);

  return (
    <Card className="rounded-2xl dash-card">
      <CardHeader className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text)]">{t('dashboard.tokensTitle')}</h2>
          {since && (
            <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.tokensSubtitle')} {since}</p>
          )}
        </div>
        <Cpu size={18} className="text-[var(--color-text-muted)]" />
      </CardHeader>
      <CardBody>
        {usage.tokens.total === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">{t('dashboard.tokensEmpty')}</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.tokensTotal')}</p>
                <p className="text-2xl font-bold text-[var(--color-text)] tabular-nums">{fmt(usage.tokens.total)}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {t('dashboard.tokensChat')} {fmt(usage.tokens.chat)} · {t('dashboard.tokensDashboard')} {fmt(usage.tokens.dashboard)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.tokensAvg')}</p>
                <p className="text-2xl font-bold text-[var(--color-text)] tabular-nums">{fmt(usage.avgTokensPerMessage)}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.tokensAvgHelp')}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.tokensBlocked')}</p>
                <p className="text-2xl font-bold text-[var(--color-text)] tabular-nums">
                  {fmt(usage.messages.blocked)}
                  <span className="text-sm font-medium text-[var(--color-text-muted)]"> {t('dashboard.tokensBlockedOf')} {fmt(messages)}</span>
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.tokensBlockedHelp')}</p>
              </div>
              {usage.capacityTpm ? (
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.tokensCapacity')}</p>
                  <p className="text-2xl font-bold text-[var(--color-text)] tabular-nums">{fmt(usage.capacityTpm)}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.tokensCapacityHelp')}</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.tokensPeak')}</p>
                  <p className={`text-2xl font-bold tabular-nums ${tone.text}`}>{fmt(usage.peakTokensPerMinute)}</p>
                  <div className="mt-1 h-2 rounded-full bg-[var(--color-surface-soft)] overflow-hidden">
                    <div className={`h-full ${tone.bar}`} style={{ width: `${peakRatio}%` }} />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('dashboard.tokensPeakHelp')} {fmt(usage.tpmLimit)}</p>
                </div>
              )}

              {usage.byModel && usage.byModel.length > 0 && (
                <div className="sm:col-span-2 space-y-2.5">
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {t('dashboard.tokensByModel')} · {t('dashboard.tokensPeak').toLowerCase()} / {t('dashboard.tokensLimit')}
                  </p>
                  {usage.byModel.map((m) => {
                    const ratio = m.tpm > 0 ? Math.min(100, (m.peakPerMinute / m.tpm) * 100) : 0;
                    const modelTone = peakTone(ratio);
                    return (
                      <div key={m.model}>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
                          <span className="font-medium text-[var(--color-text)]">{m.model.split('/').pop()}</span>
                          <span className="text-[var(--color-text-muted)] tabular-nums">
                            {fmt(m.tokens)} · {fmt(m.calls)} {t('dashboard.tokensCalls')} · {fmt(m.peakPerMinute)} / {fmt(m.tpm)}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-[var(--color-surface-soft)] overflow-hidden">
                          <div className={`h-full ${modelTone.bar}`} style={{ width: `${ratio}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-2">{t('dashboard.tokensDaily')}</p>
              <div className="grid gap-2 items-end h-28" style={{ gridTemplateColumns: `repeat(${Math.max(trend.length, 1)}, minmax(0, 1fr))` }}>
                {trend.map((point) => (
                  <div key={point.day} className="flex flex-col items-center gap-1 h-full">
                    <div className="w-full flex items-end justify-center flex-1">
                      <div
                        className="dash-bar w-3 rounded-full bg-indigo-500/80"
                        style={{ height: `${Math.max(6, ((point.aiTokens ?? 0) / topDay) * 100)}%` }}
                        title={`${point.day}: ${fmt(point.aiTokens ?? 0)}`}
                      />
                    </div>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{point.day}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
