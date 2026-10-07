// ============================================================
// Tipos compartidos para las respuestas de la API
// ============================================================

export interface ApiError {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AnalyticsTrendPoint {
  day: string;
  visits: number;
  aiRequests: number;
  aiTokens?: number;
}

export interface AiModelUsage {
  model: string;
  tokens: number;
  calls: number;
  peakPerMinute: number;
  tpm: number;
}

// Opcionales: si el frontend se despliega antes que el backend, la respuesta puede no traerlos
export interface AiUsageSummary {
  tokens: { total: number; prompt: number; completion: number; chat: number; dashboard: number };
  messages: { answered: number; blocked: number };
  avgTokensPerMessage: number;
  peakTokensPerMinute: number;
  tpmLimit: number;
  byModel?: AiModelUsage[];
  capacityTpm?: number;
  trackingSince: string | null;
  lastUsedAt: string | null;
}

export interface AnalyticsTimelinePoint {
  date: string;
  visits: number;
  aiRequests: number;
  dashboardViews: number;
}

export interface AnalyticsTimelineResponse {
  days: number;
  timezone: string;
  firstEventDate: string | null;
  points: AnalyticsTimelinePoint[];
}

export interface AnalyticsSummaryResponse {
  totals: {
    totalVisits: number;
    aiRequests: number;
    authEntryOpens: number;
    dashboardViews: number;
    totalUsers: number;
  };
  roles: {
    admins: number;
    instructors: number;
    students: number;
  };
  conversionRate: number;
  aiPerVisit: number;
  dashboardAdoption: number;
  lastVisitAt: string | null;
  trend: AnalyticsTrendPoint[];
  aiUsage?: AiUsageSummary;
}
