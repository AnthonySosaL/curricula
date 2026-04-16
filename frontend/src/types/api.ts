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
}
