import { api } from '@/lib/api';
import type { AnalyticsSummaryResponse } from '@/types/api';

export type MetricEvent =
  | 'PORTFOLIO_VISIT'
  | 'AI_REQUEST'
  | 'AUTH_ENTRY_OPEN'
  | 'DASHBOARD_VIEW';

export function recordMetric(event: MetricEvent) {
  void api.post('/analytics/events', {
    type: event,
    path: window.location.pathname,
    source: 'frontend',
  }).catch(() => undefined);
}

export function getPreviewSummary(): AnalyticsSummaryResponse {
  return {
    totals: {
      totalVisits: 184,
      aiRequests: 69,
      authEntryOpens: 54,
      dashboardViews: 41,
      totalUsers: 37,
    },
    roles: {
      admins: 2,
      instructors: 6,
      students: 29,
    },
    conversionRate: 20.1,
    aiPerVisit: 0.38,
    dashboardAdoption: 22.3,
    lastVisitAt: new Date().toISOString(),
    trend: [
      { day: '04-07', visits: 22, aiRequests: 7 },
      { day: '04-08', visits: 18, aiRequests: 5 },
      { day: '04-09', visits: 25, aiRequests: 8 },
      { day: '04-10', visits: 30, aiRequests: 11 },
      { day: '04-11', visits: 28, aiRequests: 12 },
      { day: '04-12', visits: 31, aiRequests: 14 },
      { day: '04-13', visits: 30, aiRequests: 12 },
    ],
  };
}

export function buildAIExecutiveSummary(summary: AnalyticsSummaryResponse, language: 'es' | 'en' = 'es'): string {
  const { totals, roles } = summary;

  // Las instrucciones y el contexto van en el idioma pedido: una instruccion en espanol
  // ("Debes responder en espanol") le gana a un "Respond in English" puesto al final.
  if (language === 'en') {
    const trendLine = summary.trend
      .map((point) => `${point.day}: visits ${point.visits}, AI ${point.aiRequests}`)
      .join(' | ');
    return [
      'Act as a senior growth and digital operations analyst.',
      'You must answer in English, with a professional and executive tone.',
      'MANDATORY RESPONSE FORMAT:',
      '1) Executive summary (maximum 6 lines).',
      '2) Key findings (3 bullets).',
      '3) Risks and alerts (2 bullets).',
      '4) Improvement opportunities (3 bullets).',
      '5) Prioritized recommendations (Top 3, with expected impact).',
      '6) Final conclusion (1 short paragraph with a suggested decision).',
      'Do not invent data that is not in the context.',
      'DATA CONTEXT:',
      `Total visits: ${totals.totalVisits}`,
      `AI requests: ${totals.aiRequests}`,
      `Registered users: ${totals.totalUsers}`,
      `Role distribution -> Admin: ${roles.admins}, Instructor: ${roles.instructors}, Student: ${roles.students}`,
      `Conversion rate (users/visits): ${summary.conversionRate.toFixed(1)}%`,
      `AI usage intensity (requests/visit): ${summary.aiPerVisit}`,
      `Dashboard adoption (dashboard views/visits): ${summary.dashboardAdoption.toFixed(1)}%`,
      `Last visit detected: ${summary.lastVisitAt ?? 'no data'}`,
      `7-day trend: ${trendLine}`,
    ].join('\n');
  }

  const trendLine = summary.trend
    .map((point) => `${point.day}: visitas ${point.visits}, IA ${point.aiRequests}`)
    .join(' | ');

  return [
    'Actua como analista senior de crecimiento y operaciones digitales.',
    'Debes responder en espanol, con tono profesional y ejecutivo.',
    'FORMATO OBLIGATORIO DE RESPUESTA:',
    '1) Resumen ejecutivo (maximo 6 lineas).',
    '2) Hallazgos clave (3 bullets).',
    '3) Riesgos y alertas (2 bullets).',
    '4) Oportunidades de mejora (3 bullets).',
    '5) Recomendaciones priorizadas (Top 3, con impacto esperado).',
    '6) Conclusion final (1 parrafo breve con decision sugerida).',
    'No inventes datos no presentes en el contexto.',
    'CONTEXTO DE DATOS:',
    `Visitas totales: ${totals.totalVisits}`,
    `Solicitudes a IA: ${totals.aiRequests}`,
    `Usuarios registrados: ${totals.totalUsers}`,
    `Distribucion de roles -> Admin: ${roles.admins}, Instructor: ${roles.instructors}, Student: ${roles.students}`,
    `Tasa de conversion (usuarios/visitas): ${summary.conversionRate.toFixed(1)}%`,
    `Intensidad de uso IA (solicitudes/visita): ${summary.aiPerVisit}`,
    `Adopcion dashboard (vistas dashboard/visitas): ${summary.dashboardAdoption.toFixed(1)}%`,
    `Ultima visita detectada: ${summary.lastVisitAt ?? 'sin datos'}`,
    `Tendencia 7 dias: ${trendLine}`,
  ].join('\n');
}

export function buildDashboardConclusion(summary: AnalyticsSummaryResponse): string {
  const { totals, conversionRate, aiPerVisit, dashboardAdoption } = summary;

  if (totals.totalVisits === 0) {
    return 'Aun no existe suficiente trafico para concluir tendencia. Prioridad: captar visitas y activar interaccion con IA.';
  }

  if (conversionRate < 8 && aiPerVisit < 0.2) {
    return 'La pagina tiene baja conversion y baja interaccion con IA. Se recomienda optimizar el mensaje de valor y reforzar CTAs tempranos.';
  }

  if (conversionRate >= 8 && conversionRate < 20 && dashboardAdoption < 20) {
    return 'Hay interes inicial con conversion moderada, pero adopcion del dashboard limitada. Conviene mejorar onboarding y acceso al panel.';
  }

  if (conversionRate >= 20 && aiPerVisit >= 0.35) {
    return 'El comportamiento general es saludable: buena conversion y uso consistente de IA. Siguiente paso: escalar adquisicion manteniendo calidad.';
  }

  return 'El rendimiento es estable con margen de mejora. Enfocar en aumentar adopcion del dashboard y profundizar uso del asistente IA.';
}
