import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { buildAIExecutiveSummary } from '@/lib/analytics';
import type { AnalyticsSummaryResponse } from '@/types/api';
import { parseAiResponse, stripMd, type ParsedAiResponse } from './ai-parse';

/**
 * Encapsula la petición del análisis ejecutivo a la IA: reintentos con
 * backoff ante 500 transitorios, indicador de cold start y limpieza al
 * cambiar idioma. Devuelve el estado listo para pintar el panel.
 */
export function useAiAnalysis(snapshot: AnalyticsSummaryResponse | undefined, language: string) {
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [aiParsed, setAiParsed] = useState<ParsedAiResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [aiSlowLoad, setAiSlowLoad] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);

  // Limpia datos viejos al instante cuando cambia el idioma
  useEffect(() => {
    setAiParsed(null);
    setAiRecommendations('');
    setAiError(false);
  }, [language]);

  useEffect(() => {
    if (!snapshot) return;

    const controller = new AbortController();
    let isCurrentRequest = true;
    const slowTimer = window.setTimeout(() => {
      if (isCurrentRequest) setAiSlowLoad(true);
    }, 8000);

    const run = async () => {
      setAiLoading(true);
      setAiError(false);
      setAiSlowLoad(false);

      const MAX_ATTEMPTS = 3;
      try {
        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
          try {
            const context = buildAIExecutiveSummary(snapshot);
            const lang = language === 'en' ? 'English' : 'Spanish';
            const prompt = [
              context,
              '',
              `Respond in ${lang}. Return ONLY a JSON object with these exact keys:`,
              '{"resumen":"2 sentence summary","hallazgos":["finding1","finding2"],"riesgos":["risk1","risk2"],"oportunidades":["opp1","opp2"],"recomendaciones":["rec1 (action+impact)","rec2 (action+impact)","rec3 (action+impact)"],"conclusion":"2 sentence conclusion"}',
              'No markdown, no extra text. Only the JSON.',
              '[RECOMENDACIONES]',
            ].join('\n');

            const res = await api.post<{ reply: string }>(
              '/chat',
              { messages: [{ role: 'user', content: prompt }] },
              { signal: controller.signal },
            );
            if (!isCurrentRequest) return;

            const rawReply = res.data.reply ?? '';
            let parsed: ParsedAiResponse | null = null;
            try {
              const jsonStart = rawReply.indexOf('{');
              const jsonEnd = rawReply.lastIndexOf('}');
              if (jsonStart !== -1 && jsonEnd !== -1) {
                const obj = JSON.parse(rawReply.slice(jsonStart, jsonEnd + 1)) as Partial<ParsedAiResponse>;
                parsed = {
                  resumen: stripMd(String(obj.resumen ?? '')),
                  hallazgos: (Array.isArray(obj.hallazgos) ? obj.hallazgos : []).map((s) => stripMd(String(s))),
                  riesgos: (Array.isArray(obj.riesgos) ? obj.riesgos : []).map((s) => stripMd(String(s))),
                  oportunidades: (Array.isArray(obj.oportunidades) ? obj.oportunidades : []).map((s) => stripMd(String(s))),
                  recomendaciones: (Array.isArray(obj.recomendaciones) ? obj.recomendaciones : []).map((s) => stripMd(String(s))),
                  conclusion: stripMd(String(obj.conclusion ?? '')),
                };
                if (!parsed.resumen && !parsed.hallazgos.length) parsed = null;
              }
            } catch {
              // JSON inválido — cae al parser por etiquetas
            }
            if (!parsed) parsed = parseAiResponse(rawReply);

            const reply = rawReply || (language === 'en' ? 'No recommendations available yet.' : 'Aun no hay recomendaciones disponibles.');
            setAiRecommendations(reply);
            setAiParsed(parsed);
            return;
          } catch (error) {
            const code = (error as { code?: string }).code;
            if (!isCurrentRequest || code === 'ERR_CANCELED') return;
            if (attempt < MAX_ATTEMPTS) {
              await new Promise((resolve) => setTimeout(resolve, attempt * 4000));
              if (!isCurrentRequest) return;
              continue;
            }
            setAiParsed(null);
            setAiError(true);
          }
        }
      } finally {
        if (isCurrentRequest) {
          setAiLoading(false);
          setAiSlowLoad(false);
        }
      }
    };

    void run();
    return () => {
      isCurrentRequest = false;
      clearTimeout(slowTimer);
      controller.abort();
    };
  }, [snapshot, language, retryNonce]);

  return {
    aiRecommendations,
    aiParsed,
    aiLoading,
    aiError,
    aiSlowLoad,
    retry: () => setRetryNonce((n) => n + 1),
  };
}
