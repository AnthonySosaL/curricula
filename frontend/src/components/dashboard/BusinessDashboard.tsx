import { useEffect, useMemo, useState } from 'react';
import { Activity, Bot, ChartColumnBig, Eye, Gauge, RefreshCw, Sparkles, Users } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAnalyticsSummary } from '@/hooks/useAnalytics';
import { buildAIExecutiveSummary, buildDashboardConclusion } from '@/lib/analytics';
import { useI18n } from '@/lib/i18n';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

interface Props {
  publicView?: boolean;
}

interface ParsedAiResponse {
  resumen: string;
  hallazgos: string[];
  riesgos: string[];
  oportunidades: string[];
  recomendaciones: string[];
  conclusion: string;
}

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function metricTone(value: number) {
  if (value >= 60) return 'text-[var(--color-success)]';
  if (value >= 35) return 'text-[var(--color-accent)]';
  return 'text-[var(--color-danger)]';
}

function parseListBlock(input: string) {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
    .filter(Boolean);
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

function normalizeTagFormat(text: string): string {
  // Groq sometimes returns **TAGNAME** instead of [TAGNAME] — normalize both
  const tagNames = [
    'RESUMEN EJECUTIVO', 'EXECUTIVE SUMMARY', 'RESUMEN', 'SUMMARY',
    'HALLAZGOS', 'FINDINGS',
    'RIESGOS', 'RISKS',
    'OPORTUNIDADES', 'OPPORTUNITIES',
    'RECOMENDACIONES', 'RECOMMENDATIONS',
    'CONCLUSION FINAL', 'CONCLUSION EJECUTIVA', 'CONCLUSIONES', 'CONCLUSION',
  ];
  let result = text.replace(/\r\n/g, '\n');
  for (const tag of tagNames) {
    const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // **TAG** or ## TAG or ### TAG → [TAG]
    result = result.replace(
      new RegExp(`(?:\\*\\*\\s*${escaped}\\s*\\*\\*|#{1,3}\\s*${escaped})\\s*:?`, 'gi'),
      `[${tag}]`,
    );
  }
  return result;
}

function parseAiResponse(text: string): ParsedAiResponse | null {
  const normalized = normalizeTagFormat(text);
  const tagGroups = {
    resumen: ['RESUMEN', 'SUMMARY', 'RESUMEN EJECUTIVO', 'EXECUTIVE SUMMARY'],
    hallazgos: ['HALLAZGOS', 'FINDINGS'],
    riesgos: ['RIESGOS', 'RISKS'],
    oportunidades: ['OPORTUNIDADES', 'OPPORTUNITIES'],
    recomendaciones: ['RECOMENDACIONES', 'RECOMMENDATIONS'],
    conclusion: ['CONCLUSION', 'CONCLUSIONES', 'CONCLUSION FINAL', 'CONCLUSION EJECUTIVA'],
  } as const;

  const allTags = Object.values(tagGroups).flat().map((tag) => escapeForRegex(tag));
  const allTagsGroup = allTags.join('|');

  const readBlockByAliases = (aliases: readonly string[]) => {
    const aliasGroup = aliases.map((alias) => escapeForRegex(alias)).join('|');
    const startPattern = `(?:\\[(?:${aliasGroup})\\]|^\\s*(?:#{1,3}\\s*)?(?:${aliasGroup})\\s*:?\\s*$)`;
    const endPattern = `(?=\\[(?:${allTagsGroup})\\]|^\\s*(?:#{1,3}\\s*)?(?:${allTagsGroup})\\s*:?\\s*$|$)`;
    const re = new RegExp(`${startPattern}([\\s\\S]*?)${endPattern}`, 'im');
    const match = normalized.match(re);
    if (match?.[1]?.trim()) return match[1].trim();

    for (const alias of aliases) {
      const reInline = new RegExp(`(?:\\[${escapeForRegex(alias)}\\]|${escapeForRegex(alias)}\\s*:)\\s*([^\\n]+)`, 'i');
      const inlineMatch = normalized.match(reInline);
      if (inlineMatch?.[1]?.trim()) return inlineMatch[1].trim();
    }

    return '';
  };

  const resumen = stripMarkdown(readBlockByAliases(tagGroups.resumen));
  const hallazgos = parseListBlock(readBlockByAliases(tagGroups.hallazgos)).map(stripMarkdown);
  const riesgos = parseListBlock(readBlockByAliases(tagGroups.riesgos)).map(stripMarkdown);
  const oportunidades = parseListBlock(readBlockByAliases(tagGroups.oportunidades)).map(stripMarkdown);
  const recomendaciones = parseListBlock(readBlockByAliases(tagGroups.recomendaciones)).map(stripMarkdown);
  const conclusion = stripMarkdown(readBlockByAliases(tagGroups.conclusion));

  if (!resumen && !hallazgos.length && !riesgos.length && !oportunidades.length && !recomendaciones.length && !conclusion) {
    return null;
  }

  return {
    resumen,
    hallazgos,
    riesgos,
    oportunidades,
    recomendaciones,
    conclusion,
  };
}

function fallbackParseAiResponse(text: string): ParsedAiResponse | null {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) return null;

  const bulletItems = parseListBlock(normalized);
  const sentenceItems = normalized
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const sourceItems = bulletItems.length > 0 ? bulletItems : sentenceItems;
  const resumen = sentenceItems.slice(0, 2).join(' ').trim() || sourceItems[0] || normalized;

  return {
    resumen,
    hallazgos: sourceItems.slice(0, 2),
    riesgos: sourceItems.slice(2, 4),
    oportunidades: sourceItems.slice(4, 6),
    recomendaciones: sourceItems.slice(0, 3),
    conclusion: sentenceItems.at(-1) ?? '',
  };
}

function hasStructuredContent(parsed: ParsedAiResponse | null): parsed is ParsedAiResponse {
  if (!parsed) return false;
  return Boolean(
    parsed.resumen
    || parsed.hallazgos.length
    || parsed.riesgos.length
    || parsed.oportunidades.length
    || parsed.recomendaciones.length
    || parsed.conclusion,
  );
}

export function BusinessDashboard({ publicView = false }: Props) {
  const user = useAuthStore((s) => s.user);
  const { t, language } = useI18n();
  const analyticsQuery = useAnalyticsSummary(true, publicView);
  const snapshot = analyticsQuery.data;

  const [aiRecommendations, setAiRecommendations] = useState('');
  const [aiParsed, setAiParsed] = useState<ParsedAiResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [aiSlowLoad, setAiSlowLoad] = useState(false);

  const automaticConclusion = useMemo(() => {
    if (!snapshot) return '';
    return buildDashboardConclusion(snapshot);
  }, [snapshot]);

  // Clear stale AI data immediately when language changes
  useEffect(() => {
    setAiParsed(null);
    setAiRecommendations('');
    setAiError(false);
  }, [language]);

  useEffect(() => {
    if (!snapshot) return;

    const controller = new AbortController();
    let isCurrentRequest = true;

    // Slow-load indicator: if AI takes > 8s, show render cold-start warning
    const slowTimer = window.setTimeout(() => {
      if (isCurrentRequest) setAiSlowLoad(true);
    }, 8000);

    const run = async () => {
      setAiLoading(true);
      setAiError(false);
      setAiSlowLoad(false);

      try {
        const context = buildAIExecutiveSummary(snapshot);
        const prompt = language === 'en'
          ? [
            context,
            '',
            'Respond in English using this EXACT tagged format:',
            '[RESUMEN]',
            '2 concise lines max.',
            '[HALLAZGOS]',
            '- key finding 1',
            '- key finding 2',
            '[RIESGOS]',
            '- risk 1',
            '- risk 2',
            '[OPORTUNIDADES]',
            '- opportunity 1',
            '- opportunity 2',
            '[RECOMENDACIONES]',
            '- recommendation 1 (action + expected impact)',
            '- recommendation 2 (action + expected impact)',
            '- recommendation 3 (action + expected impact)',
            '[CONCLUSION]',
            'Max 2 lines.',
          ].join('\n')
          : [
            context,
            '',
            'Responde en espanol usando este formato EXACTO con etiquetas:',
            '[RESUMEN]',
            'Maximo 2 lineas.',
            '[HALLAZGOS]',
            '- hallazgo clave 1',
            '- hallazgo clave 2',
            '[RIESGOS]',
            '- riesgo 1',
            '- riesgo 2',
            '[OPORTUNIDADES]',
            '- oportunidad 1',
            '- oportunidad 2',
            '[RECOMENDACIONES]',
            '- recomendacion 1 (accion + impacto esperado)',
            '- recomendacion 2 (accion + impacto esperado)',
            '- recomendacion 3 (accion + impacto esperado)',
            '[CONCLUSION]',
            'Maximo 2 lineas.',
          ].join('\n');

        const res = await api.post<{ reply: string }>(
          '/chat',
          {
            messages: [{ role: 'user', content: prompt }],
          },
          {
            signal: controller.signal,
          },
        );

        if (!isCurrentRequest) return;

        const reply = res.data.reply || (language === 'en' ? 'No recommendations available yet.' : 'Aun no hay recomendaciones disponibles.');
        const parsed = parseAiResponse(reply) ?? fallbackParseAiResponse(reply);

        setAiRecommendations(reply);
        setAiParsed(parsed);
      } catch (error) {
        const code = (error as { code?: string }).code;
        if (!isCurrentRequest || code === 'ERR_CANCELED') return;

        setAiParsed(null);
        setAiError(true);
      } finally {
        if (!isCurrentRequest) return;
        setAiLoading(false);
        setAiSlowLoad(false);
      }
    };

    void run();

    return () => {
      isCurrentRequest = false;
      clearTimeout(slowTimer);
      controller.abort();
    };
  }, [snapshot, language]);

  const totals = snapshot?.totals;
  const trend = snapshot?.trend ?? [];

  const activityTotal = (totals?.totalVisits ?? 0)
    + (totals?.aiRequests ?? 0)
    + (totals?.authEntryOpens ?? 0)
    + (totals?.dashboardViews ?? 0);

  const activityMix = [
    {
      label: t('dashboard.visits'),
      value: totals?.totalVisits ?? 0,
      color: 'bg-sky-500',
    },
    {
      label: t('dashboard.aiUsage'),
      value: totals?.aiRequests ?? 0,
      color: 'bg-indigo-500',
    },
    {
      label: t('dashboard.loginClicks'),
      value: totals?.authEntryOpens ?? 0,
      color: 'bg-amber-500',
    },
    {
      label: t('dashboard.dashboardViews'),
      value: totals?.dashboardViews ?? 0,
      color: 'bg-emerald-500',
    },
  ];

  const peakDay = useMemo(() => {
    return trend.reduce(
      (acc, item) => {
        const score = item.visits + item.aiRequests;
        if (score > acc.score) return { day: item.day, score };
        return acc;
      },
      { day: '-', score: 0 },
    );
  }, [trend]);

  const topScale = Math.max(
    1,
    ...trend.map((point) => Math.max(point.visits, point.aiRequests)),
  );

  const kpis = [
    {
      title: t('dashboard.kpiVisits'),
      value: totals?.totalVisits ?? 0,
      helper: t('dashboard.kpiVisitsHelp'),
      icon: Eye,
      accent: 'bg-sky-100 text-sky-700',
    },
    {
      title: t('dashboard.kpiAi'),
      value: totals?.aiRequests ?? 0,
      helper: t('dashboard.kpiAiHelp'),
      icon: Bot,
      accent: 'bg-indigo-100 text-indigo-700',
    },
    {
      title: t('dashboard.kpiUsers'),
      value: totals?.totalUsers ?? 0,
      helper: t('dashboard.kpiUsersHelp'),
      icon: Users,
      accent: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: t('dashboard.kpiConversion'),
      value: `${(snapshot?.conversionRate ?? 0).toFixed(1)}%`,
      helper: t('dashboard.kpiConversionHelp'),
      icon: Gauge,
      accent: 'bg-amber-100 text-amber-700',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-[var(--color-bg)] min-h-full">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:p-7">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.12),transparent_38%),radial-gradient(circle_at_90%_80%,rgba(16,185,129,0.10),transparent_36%)]" />
        <div className="relative flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Dashboard Login Analytics
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
            {publicView
              ? t('dashboard.publicTitle')
              : `${language === 'en' ? 'Hi' : 'Hola'} ${user?.name ?? (language === 'en' ? 'team' : 'equipo')}, ${t('dashboard.privateTitle')}`}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-3xl">
            {publicView
              ? t('dashboard.publicDescription')
              : t('dashboard.privateDescription')}
          </p>
        </div>
      </section>

      {analyticsQuery.isLoading && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 text-blue-900 px-4 py-3 text-sm">
          {t('dashboard.loadingData')}
        </div>
      )}

      {analyticsQuery.isError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 text-red-900 px-4 py-3 text-sm flex items-center justify-between gap-3">
          <span>
            {publicView
              ? t('dashboard.publicError')
              : t('dashboard.privateError')}
          </span>
          <Button variant="secondary" size="sm" onClick={() => void analyticsQuery.refetch()}>
            <RefreshCw size={14} />
            {t('dashboard.retry')}
          </Button>
        </div>
      )}

      {!analyticsQuery.isLoading && !analyticsQuery.isError && snapshot && snapshot.totals.totalVisits === 0 && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
          {t('dashboard.noDataYet')}
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="rounded-2xl">
              <CardBody className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-[var(--color-text-secondary)]">{item.title}</p>
                  <span className={`inline-flex size-9 items-center justify-center rounded-xl ${item.accent}`}>
                    <Icon size={16} />
                  </span>
                </div>
                <p className="text-3xl font-bold text-[var(--color-text)]">{item.value}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{item.helper}</p>
              </CardBody>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 rounded-2xl">
          <CardHeader className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-text)]">{t('dashboard.trendTitle')}</h2>
              <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.trendSubtitle')}</p>
            </div>
            <ChartColumnBig size={18} className="text-[var(--color-text-muted)]" />
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-7 gap-2 items-end h-44">
              {trend.map((point) => {
                const visitHeight = `${Math.max(8, (point.visits / topScale) * 100)}%`;
                const aiHeight = `${Math.max(8, (point.aiRequests / topScale) * 100)}%`;
                return (
                  <div key={point.day} className="flex flex-col items-center gap-2 h-full">
                    <div className="w-full flex items-end justify-center gap-1 flex-1">
                      <div
                        className="w-2.5 rounded-full bg-sky-500/80"
                        style={{ height: visitHeight }}
                        title={`${t('dashboard.visits')} ${point.visits}`}
                      />
                      <div
                        className="w-2.5 rounded-full bg-indigo-500/80"
                        style={{ height: aiHeight }}
                        title={`${t('dashboard.aiUsage')} ${point.aiRequests}`}
                      />
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{point.day}</p>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">{t('dashboard.funnelTitle')}</h2>
            <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.funnelSubtitle')}</p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.conversion')}</p>
              <p className={`text-xl font-bold ${metricTone(snapshot?.conversionRate ?? 0)}`}>
                {(snapshot?.conversionRate ?? 0).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.dashboardAdoption')}</p>
              <p className={`text-xl font-bold ${metricTone(snapshot?.dashboardAdoption ?? 0)}`}>
                {(snapshot?.dashboardAdoption ?? 0).toFixed(1)}%
              </p>
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

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="rounded-2xl">
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

        <Card className="xl:col-span-2 rounded-2xl">
          <CardHeader className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-text)]">{t('dashboard.recommendations')}</h2>
              <p className="text-xs text-[var(--color-text-muted)]">{t('dashboard.aiSuggestionsHelp')}</p>
            </div>
            <Sparkles size={16} className="text-[var(--color-primary)]" />
          </CardHeader>
          <CardBody>
            {aiLoading ? (
              <div className="space-y-2">
                <div className="text-sm text-[var(--color-text-secondary)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin shrink-0" />
                  {t('dashboard.aiGenerating')}
                </div>
                {aiSlowLoad && (
                  <div className="text-xs text-amber-700 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 flex items-center gap-2">
                    <span className="shrink-0">⏳</span>
                    {language === 'en'
                      ? 'Server is waking up — first request may take up to 30s. Almost there!'
                      : 'Servidor despertando — la primera solicitud puede tomar hasta 30s. ¡Ya casi!'}
                  </div>
                )}
              </div>
            ) : aiError ? (
              <div className="text-sm text-red-700 rounded-xl border border-red-100 bg-red-50 p-3">
                {t('dashboard.aiError')}
              </div>
            ) : hasStructuredContent(aiParsed) ? (
              <div className="space-y-3">
                {aiParsed.resumen && (
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      {language === 'en' ? 'Executive summary' : 'Resumen ejecutivo'}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">{aiParsed.resumen}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiParsed.hallazgos.length > 0 && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-blue-800">
                        {language === 'en' ? 'Findings' : 'Hallazgos'}
                      </p>
                      <ul className="mt-1 text-sm text-blue-900 space-y-1">
                        {aiParsed.hallazgos.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  )}

                  {aiParsed.riesgos.length > 0 && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-red-800">
                        {language === 'en' ? 'Risks' : 'Riesgos'}
                      </p>
                      <ul className="mt-1 text-sm text-red-900 space-y-1">
                        {aiParsed.riesgos.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  )}

                  {aiParsed.oportunidades.length > 0 && (
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-amber-800">
                        {language === 'en' ? 'Opportunities' : 'Oportunidades'}
                      </p>
                      <ul className="mt-1 text-sm text-amber-900 space-y-1">
                        {aiParsed.oportunidades.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  )}

                  {aiParsed.recomendaciones.length > 0 && (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-emerald-800">
                        {language === 'en' ? 'Recommendations' : 'Recomendaciones'}
                      </p>
                      <ul className="mt-1 text-sm text-emerald-900 space-y-1">
                        {aiParsed.recomendaciones.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                {aiParsed.conclusion && (
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      {language === 'en' ? 'Conclusion' : 'Conclusion'}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">{aiParsed.conclusion}</p>
                  </div>
                )}
              </div>
            ) : (
              <pre className="text-xs leading-relaxed whitespace-pre-wrap bg-[var(--color-surface-soft)] border border-[var(--color-border)] rounded-xl p-3 text-[var(--color-text-secondary)]">
                {aiRecommendations || t('dashboard.aiEmpty')}
              </pre>
            )}

            <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <Activity size={14} />
              {analyticsQuery.isLoading
                ? t('dashboard.loadingSummary')
                : t('dashboard.ready')}
            </div>

            {automaticConclusion && (
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-emerald-800">{t('dashboard.conclusion')}</p>
                <p className="text-sm text-emerald-900 mt-1">{automaticConclusion}</p>
              </div>
            )}
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
