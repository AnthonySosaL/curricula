import { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAnalyticsSummary } from '@/hooks/useAnalytics';
import { buildDashboardConclusion } from '@/lib/analytics';
import { useI18n } from '@/lib/i18n';
import { useAuthStore } from '@/stores/auth.store';
import { DashboardLoadingScreen } from './DashboardLoadingScreen';
import { DashboardMetrics } from './DashboardMetrics';
import { DashboardActivityCard } from './DashboardActivityCard';
import { DashboardAiPanel } from './DashboardAiPanel';
import { useAiAnalysis } from './useAiAnalysis';

interface Props {
  publicView?: boolean;
}

export function BusinessDashboard({ publicView = false }: Props) {
  const user = useAuthStore((s) => s.user);
  const { t, language } = useI18n();
  const analyticsQuery = useAnalyticsSummary(true, publicView);
  const snapshot = analyticsQuery.data;

  const ai = useAiAnalysis(snapshot, language);

  // Tiempo minimo visible del loader: si los datos llegan muy rapido, igual se
  // ve la animacion un momento al entrar (evita el parpadeo).
  const [minTimePassed, setMinTimePassed] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setMinTimePassed(true), 1800);
    return () => window.clearTimeout(t);
  }, []);
  const showLoader = analyticsQuery.isLoading || !minTimePassed;

  const automaticConclusion = useMemo(
    () => (snapshot ? buildDashboardConclusion(snapshot) : ''),
    [snapshot],
  );

  return (
    <div className="relative overflow-hidden p-4 sm:p-6 lg:p-8 bg-[var(--color-bg)] min-h-full">
      {/* Pantalla de carga a pantalla completa mientras llegan los datos del backend */}
      {showLoader && <DashboardLoadingScreen />}

      {/* Fondo decorativo animado — orbes de luz y grid, misma identidad del boot loader */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <span className="boot-orb w-96 h-96 -top-24 -left-24 bg-red-500/25" />
        <span className="boot-orb w-80 h-80 top-1/3 -right-20 bg-orange-500/20" style={{ animationDelay: '-3s' }} />
        <span className="boot-orb w-96 h-96 -bottom-24 left-1/4 bg-red-600/20" style={{ animationDelay: '-6s' }} />
        <div className="boot-grid" style={{ opacity: 0.35 }} />
      </div>

      <div className="dash-cascade relative space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:p-7">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_20%,rgba(220,38,38,0.10),transparent_38%),radial-gradient(circle_at_90%_80%,rgba(245,158,11,0.10),transparent_36%)]" />
          <div className="nav-flow-border" style={{ bottom: 0 }} aria-hidden="true" />
          <div className="relative flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Dashboard Login Analytics</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
              {publicView
                ? t('dashboard.publicTitle')
                : `${language === 'en' ? 'Hi' : 'Hola'} ${user?.name ?? (language === 'en' ? 'team' : 'equipo')}, ${t('dashboard.privateTitle')}`}
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-3xl">
              {publicView ? t('dashboard.publicDescription') : t('dashboard.privateDescription')}
            </p>
          </div>
        </section>

        {analyticsQuery.isError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 text-red-900 px-4 py-3 text-sm flex items-center justify-between gap-3">
            <span>{publicView ? t('dashboard.publicError') : t('dashboard.privateError')}</span>
            <Button variant="secondary" size="sm" onClick={() => void analyticsQuery.refetch()}>
              <RefreshCw size={14} />
              {t('dashboard.retry')}
            </Button>
          </div>
        )}

        {!showLoader && !analyticsQuery.isError && snapshot && snapshot.totals.totalVisits === 0 && (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
            {t('dashboard.noDataYet')}
          </div>
        )}

        {!showLoader && (
          <>
            <DashboardMetrics snapshot={snapshot} />
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <DashboardActivityCard snapshot={snapshot} />
              <DashboardAiPanel
                aiLoading={ai.aiLoading}
                aiError={ai.aiError}
                aiSlowLoad={ai.aiSlowLoad}
                aiParsed={ai.aiParsed}
                aiRecommendations={ai.aiRecommendations}
                automaticConclusion={automaticConclusion}
                dataLoading={analyticsQuery.isLoading}
                onRetry={ai.retry}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
