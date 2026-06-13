import { Activity, RefreshCw, Sparkles } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n';
import { hasStructuredContent, type ParsedAiResponse } from './ai-parse';

interface Props {
  aiLoading: boolean;
  aiError: boolean;
  aiSlowLoad: boolean;
  aiParsed: ParsedAiResponse | null;
  aiRecommendations: string;
  automaticConclusion: string;
  dataLoading: boolean;
  onRetry: () => void;
}

// Bloque de lista coloreado (hallazgos, riesgos, oportunidades, recomendaciones)
function AiList({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  if (!items.length) return null;
  return (
    <div className={`rounded-xl border p-3 ${tone}`}>
      <p className="text-[11px] uppercase tracking-[0.12em] opacity-80">{title}</p>
      <ul className="mt-1 text-sm space-y-1">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}

export function DashboardAiPanel({
  aiLoading, aiError, aiSlowLoad, aiParsed, aiRecommendations, automaticConclusion, dataLoading, onRetry,
}: Props) {
  const { t, language } = useI18n();
  const en = language === 'en';

  return (
    <Card className="xl:col-span-2 rounded-2xl dash-card">
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
                {en
                  ? 'Server is waking up — first request may take up to 30s. Almost there!'
                  : 'Servidor despertando — la primera solicitud puede tomar hasta 30s. ¡Ya casi!'}
              </div>
            )}
          </div>
        ) : aiError ? (
          <div className="text-sm text-red-700 rounded-xl border border-red-100 bg-red-50 p-3 flex items-center justify-between gap-3">
            <span>{t('dashboard.aiError')}</span>
            <Button variant="secondary" size="sm" onClick={onRetry}>
              <RefreshCw size={14} />
              {t('dashboard.retry')}
            </Button>
          </div>
        ) : hasStructuredContent(aiParsed) ? (
          <div className="space-y-3">
            {aiParsed.resumen && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{en ? 'Executive summary' : 'Resumen ejecutivo'}</p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">{aiParsed.resumen}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AiList title={en ? 'Findings' : 'Hallazgos'} items={aiParsed.hallazgos} tone="border-red-100 bg-red-50 text-red-900" />
              <AiList title={en ? 'Risks' : 'Riesgos'} items={aiParsed.riesgos} tone="border-red-100 bg-red-50 text-red-900" />
              <AiList title={en ? 'Opportunities' : 'Oportunidades'} items={aiParsed.oportunidades} tone="border-amber-100 bg-amber-50 text-amber-900" />
              <AiList title={en ? 'Recommendations' : 'Recomendaciones'} items={aiParsed.recomendaciones} tone="border-emerald-100 bg-emerald-50 text-emerald-900" />
            </div>
            {aiParsed.conclusion && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{en ? 'Conclusion' : 'Conclusion'}</p>
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
          {dataLoading ? t('dashboard.loadingSummary') : t('dashboard.ready')}
        </div>

        {automaticConclusion && (
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-emerald-800">{t('dashboard.conclusion')}</p>
            <p className="text-sm text-emerald-900 mt-1">{automaticConclusion}</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
