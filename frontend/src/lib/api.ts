import axios from 'axios';

// ============================================================
// Cliente HTTP centralizado
// Base URL → VITE_API_BASE_URL (sin /api)
// El prefijo /api se agrega aquí — NUNCA en los servicios.
// ============================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
