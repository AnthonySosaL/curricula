import axios from 'axios';

// ============================================================
// Cliente HTTP centralizado
// Base URL → VITE_API_BASE_URL (sin /api)
// El prefijo /api se agrega aquí — NUNCA en los servicios.
// En producción, VITE_API_BASE_URL apunta al backend de Render.
// En local, apunta a http://localhost:3001
// ============================================================

const ENV_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

function resolveBaseUrl() {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';

    // Safety net: in public hosts, never call localhost even if env is misconfigured.
    if (ENV_BASE_URL) {
      const pointsToLocalhost = /localhost|127\.0\.0\.1/i.test(ENV_BASE_URL);
      if (!isLocal && pointsToLocalhost) return 'https://curricula-backend.onrender.com';
      return ENV_BASE_URL;
    }

    if (!isLocal) return 'https://curricula-backend.onrender.com';
  }

  if (ENV_BASE_URL) return ENV_BASE_URL;

  return 'http://localhost:3001';
}

const BASE_URL = resolveBaseUrl();

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// ── Request: adjunta JWT ─────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: desenvuelve { data } del interceptor backend ──
api.interceptors.response.use(
  (response) => {
    // El backend envuelve en { data, timestamp } — extraemos data
    if (response.data && 'data' in response.data && 'timestamp' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = String(error.config?.url ?? '');
      const isAuthAttempt = /\/auth\/(login|register)$/i.test(requestUrl);
      if (isAuthAttempt) {
        return Promise.reject(error);
      }

      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
